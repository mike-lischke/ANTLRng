/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */


/* eslint-disable jsdoc/require-returns, jsdoc/require-param */


import { LabelType } from "./LabelType.js";
import { LabelElementPair } from "./LabelElementPair.js";
import { Grammar } from "./Grammar.js";
import { AttributeResolver } from "./AttributeResolver.js";
import { AttributeDict } from "./AttributeDict.js";
import { Alternative } from "./Alternative.js";
import { ActionAST } from "./ast/ActionAST.js";
import { AltAST } from "./ast/AltAST.js";
import { GrammarAST } from "./ast/GrammarAST.js";
import { PredAST } from "./ast/PredAST.js";
import { RuleAST } from "./ast/RuleAST.js";
import { HashSet, HashMap, LinkedHashMap as HashMap } from "antlr4ng";



export  class Rule implements AttributeResolver {
	/** Rule refs have a predefined set of attributes as well as
     *  the return values and args.
     *
     *  These must be consistent with ActionTranslator.rulePropToModelMap, ...
     */
	public static readonly  predefinedRulePropertiesDict =
		new  AttributeDict(AttributeDict.DictType.PREDEFINED_RULE);

	public static readonly  validLexerCommands = new  HashSet<string>();

	public readonly  name:  string;
	public  modifiers:  Array<GrammarAST>;

	public  ast:  RuleAST;
	public  args:  AttributeDict;
	public  retvals:  AttributeDict;
	public  locals:  AttributeDict;

	/** In which grammar does this rule live? */
	public readonly  g:  Grammar;

	/** If we're in a lexer grammar, we might be in a mode */
	public readonly  mode:  string;

	/** If null then use value from global option that is false by default */
	public readonly  caseInsensitive:  boolean;

    /** Map a name to an action for this rule like @init {...}.
     *  The code generator will use this to fill holes in the rule template.
     *  I track the AST node for the action in case I need the line number
     *  for errors.
     */
    public  namedActions =
        new  HashMap<string, ActionAST>();

    /** Track exception handlers; points at "catch" node of (catch exception action)
	 *  don't track finally action
	 */
    public  exceptions = new  Array<GrammarAST>();

	/** Track all executable actions other than named actions like @init
	 *  and catch/finally (not in an alt). Also tracks predicates, rewrite actions.
	 *  We need to examine these actions before code generation so
	 *  that we can detect refs to $rule.attr etc...
	 *
	 *  This tracks per rule; Alternative objs also track per alt.
	 */
	public  actions = new  Array<ActionAST>();

	public  finallyAction:  ActionAST;

	public readonly  numberOfAlts:  number;

	public  isStartRule = true; // nobody calls us

	/** 1..n alts */
	public  alt:  Alternative[];

	/** All rules have unique index 0..n-1 */
	public  index:  number;

	public  actionIndex = -1; // if lexer; 0..n-1 for n actions in a rule

	public  constructor(g: Grammar, name: string, ast: RuleAST, numberOfAlts: number);

	public  constructor(g: Grammar, name: string, ast: RuleAST, numberOfAlts: number, lexerMode: string, caseInsensitive: boolean);
    public constructor(...args: unknown[]) {
		switch (args.length) {
			case 4: {
				const [g, name, ast, numberOfAlts] = args as [Grammar, string, RuleAST, number];


		this(g, name, ast, numberOfAlts, null, false);
	

				break;
			}

			case 6: {
				const [g, name, ast, numberOfAlts, lexerMode, caseInsensitive] = args as [Grammar, string, RuleAST, number, string, boolean];


		this.g = g;
		this.name = name;
		this.ast = ast;
		this.numberOfAlts = numberOfAlts;
		this.alt = new  Array<Alternative>(numberOfAlts+1); // 1..n
		for (let  i=1; i<=numberOfAlts; i++) {
 this.alt[i] = new  Alternative(this, i);
}

		this.mode = lexerMode;
		this.caseInsensitive = caseInsensitive;
	

				break;
			}

			default: {
				throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
			}
		}
	}


	public  defineActionInAlt(currentAlt: number, actionAST: ActionAST):  void {
		this.actions.add(actionAST);
		this.alt[currentAlt].actions.add(actionAST);
		if ( this.g.isLexer() ) {
			this.defineLexerAction(actionAST);
		}
	}

	/** Lexer actions are numbered across rules 0..n-1 */
	public  defineLexerAction(actionAST: ActionAST):  void {
		this.actionIndex = this.g.lexerActions.size();
		if ( this.g.lexerActions.get(actionAST)===null ) {
			this.g.lexerActions.put(actionAST, this.actionIndex);
		}
	}

	public  definePredicateInAlt(currentAlt: number, predAST: PredAST):  void {
		this.actions.add(predAST);
		this.alt[currentAlt].actions.add(predAST);
		if ( this.g.sempreds.get(predAST)===null ) {
			this.g.sempreds.put(predAST, this.g.sempreds.size());
		}
	}

	public  resolveRetvalOrProperty(y: string):  java.security.KeyStore.Entry.Attribute {
		if ( this.retvals!==null ) {
			let  a = this.retvals.get(y);
			if ( a!==null ) {
 return a;
}

		}
		let  d = this.getPredefinedScope(LabelType.RULE_LABEL);
		return d.get(y);
	}

	public  getTokenRefs():  Set<string> {
        let  refs = new  HashSet<string>();
		for (let  i=1; i<=this.numberOfAlts; i++) {
			refs.addAll(this.alt[i].tokenRefs.keySet());
		}
		return refs;
    }

    public  getElementLabelNames():  Set<string> {
        let  refs = new  HashSet<string>();
        for (let  i=1; i<=this.numberOfAlts; i++) {
            refs.addAll(this.alt[i].labelDefs.keySet());
        }
		if ( refs.isEmpty() ) {
 return null;
}

        return refs;
    }

    public  getElementLabelDefs():  MultiMap<string, LabelElementPair> {
        let  defs =
            new  MultiMap<string, LabelElementPair>();
        for (let  i=1; i<=this.numberOfAlts; i++) {
            for (let pairs of this.alt[i].labelDefs.values()) {
                for (let p of pairs) {
                    defs.map(p.label.getText(), p);
                }
            }
        }
        return defs;
    }

	public  hasAltSpecificContexts():  boolean {
		return this.getAltLabels()!==null;
	}

	/** Used for recursive rules (subclass), which have 1 alt, but many original alts */
	public  getOriginalNumberOfAlts():  number {
		return this.numberOfAlts;
	}

	/**
	 * Get {@code #} labels. The keys of the map are the labels applied to outer
	 * alternatives of a lexer rule, and the values are collections of pairs
	 * (alternative number and {@link AltAST}) identifying the alternatives with
	 * this label. Unlabeled alternatives are not included in the result.
	 */
	public  getAltLabels():  Map<string, Array<<number, AltAST>>> {
		let  labels = new  LinkedHashMap<string, Array<<number, AltAST>>>();
		for (let  i=1; i<=this.numberOfAlts; i++) {
			let  altLabel = this.alt[i].ast.altLabel;
			if ( altLabel!==null ) {
				let  list = labels.get(altLabel.getText());
				if (list === null) {
					list = new  Array<<number, AltAST>>();
					labels.put(altLabel.getText(), list);
				}

				list.add(new  <number, AltAST>(i, this.alt[i].ast));
			}
		}
		if ( labels.isEmpty() ) {
 return null;
}

		return labels;
	}

	public  getUnlabeledAltASTs():  Array<AltAST> {
		let  alts = new  Array<AltAST>();
		for (let  i=1; i<=this.numberOfAlts; i++) {
			let  altLabel = this.alt[i].ast.altLabel;
			if ( altLabel===null ) {
 alts.add(this.alt[i].ast);
}

		}
		if ( alts.isEmpty() ) {
 return null;
}

		return alts;
	}

	/**  $x		Attribute: rule arguments, return values, predefined rule prop.
	 */
	@Override
public  resolveToAttribute(x: string, node: ActionAST):  java.security.KeyStore.Entry.Attribute;

	/** $x.y	Attribute: x is surrounding rule, label ref (in any alts) */
	@Override
public  resolveToAttribute(x: string, y: string, node: ActionAST):  java.security.KeyStore.Entry.Attribute;
public resolveToAttribute(...args: unknown[]):  java.security.KeyStore.Entry.Attribute {
		switch (args.length) {
			case 2: {
				const [x, node] = args as [string, ActionAST];


		if ( this.args!==null ) {
			let  a = this.args.get(x);   	if ( a!==null ) {
 return a;
}

		}
		if ( this.retvals!==null ) {
			let  a = this.retvals.get(x);	if ( a!==null ) {
 return a;
}

		}
		if ( this.locals!==null ) {
			let  a = this.locals.get(x);	if ( a!==null ) {
 return a;
}

		}
		let  properties = this.getPredefinedScope(LabelType.RULE_LABEL);
		return properties.get(x);
	

				break;
			}

			case 3: {
				const [x, y, node] = args as [string, string, ActionAST];


		let  anyLabelDef = this.getAnyLabelDef(x);
		if ( anyLabelDef!==null ) {
			if ( anyLabelDef.type===LabelType.RULE_LABEL ) {
				return this.g.getRule(anyLabelDef.element.getText()).resolveRetvalOrProperty(y);
			}
			else {
				let  scope = this.getPredefinedScope(anyLabelDef.type);
				if (scope === null) {
					return null;
				}

				return scope.get(y);
			}
		}
		return null;

	

				break;
			}

			default: {
				throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
			}
		}
	}


	@Override
public  resolvesToLabel(x: string, node: ActionAST):  boolean {
		let  anyLabelDef = this.getAnyLabelDef(x);
		return anyLabelDef!==null &&
			   (anyLabelDef.type===LabelType.RULE_LABEL ||
				anyLabelDef.type===LabelType.TOKEN_LABEL);
	}

	@Override
public  resolvesToListLabel(x: string, node: ActionAST):  boolean {
		let  anyLabelDef = this.getAnyLabelDef(x);
		return anyLabelDef!==null &&
			   (anyLabelDef.type===LabelType.RULE_LIST_LABEL ||
				anyLabelDef.type===LabelType.TOKEN_LIST_LABEL);
	}

	@Override
public  resolvesToToken(x: string, node: ActionAST):  boolean {
		let  anyLabelDef = this.getAnyLabelDef(x);
		if ( anyLabelDef!==null && anyLabelDef.type===LabelType.TOKEN_LABEL ) {
 return true;
}

		return false;
	}

	@Override
public  resolvesToAttributeDict(x: string, node: ActionAST):  boolean {
		if ( this.resolvesToToken(x, node) ) {
 return true;
}

		return false;
	}

	public  resolveToRule(x: string):  Rule {
		if ( x.equals(this.name) ) {
 return this;
}

		let  anyLabelDef = this.getAnyLabelDef(x);
		if ( anyLabelDef!==null && anyLabelDef.type===LabelType.RULE_LABEL ) {
			return this.g.getRule(anyLabelDef.element.getText());
		}
		return this.g.getRule(x);
	}

	public  getAnyLabelDef(x: string):  LabelElementPair {
		let  labels = this.getElementLabelDefs().get(x);
		if ( labels!==null ) {
 return labels.get(0);
}

		return null;
	}

    public  getPredefinedScope(ltype: LabelType):  AttributeDict {
        let  grammarLabelKey = this.g.getTypeString() + ":" + ltype;
        return Grammar.grammarAndLabelRefTypeToScope.get(grammarLabelKey);
    }

	public  isFragment():  boolean {
		if ( this.modifiers===null ) {
 return false;
}

		for (let a of this.modifiers) {
			if ( a.getText().equals("fragment") ) {
 return true;
}

		}
		return false;
	}

	@Override
public override  hashCode():  number { return this.name.hashCode(); }

	@Override
public override  equals(obj: Object):  boolean {
		if (this === obj) {
			return true;
		}

		if (!(obj instanceof Rule)) {
			return false;
		}

		return this.name.equals((obj as Rule).name);
	}

	@Override
public override  toString():  string {
		let  buf = new  StringBuilder();
		buf.append("Rule{name=").append(this.name);
		if ( this.args!==null ) {
 buf.append(", args=").append(this.args);
}

		if ( this.retvals!==null ) {
 buf.append(", retvals=").append(this.retvals);
}

		buf.append("}");
		return buf.toString();
    }
	 static {
		Rule.predefinedRulePropertiesDict.add(new  java.security.KeyStore.Entry.Attribute("parser"));
		Rule.predefinedRulePropertiesDict.add(new  java.security.KeyStore.Entry.Attribute("text"));
		Rule.predefinedRulePropertiesDict.add(new  java.security.KeyStore.Entry.Attribute("start"));
		Rule.predefinedRulePropertiesDict.add(new  java.security.KeyStore.Entry.Attribute("stop"));
		Rule.predefinedRulePropertiesDict.add(new  java.security.KeyStore.Entry.Attribute("ctx"));
	}
	 static {
		// CALLS
		Rule.validLexerCommands.add("mode");
		Rule.validLexerCommands.add("pushMode");
		Rule.validLexerCommands.add("type");
		Rule.validLexerCommands.add("channel");

		// ACTIONS
		Rule.validLexerCommands.add("popMode");
		Rule.validLexerCommands.add("skip");
		Rule.validLexerCommands.add("more");
	}
}
