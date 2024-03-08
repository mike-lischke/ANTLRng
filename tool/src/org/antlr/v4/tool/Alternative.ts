/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */


/* eslint-disable jsdoc/require-returns, jsdoc/require-param */



import { Rule } from "./Rule.js";
import { LabelType } from "./LabelType.js";
import { LabelElementPair } from "./LabelElementPair.js";
import { AttributeResolver } from "./AttributeResolver.js";
import { AttributeDict } from "./AttributeDict.js";
import { ActionAST } from "./ast/ActionAST.js";
import { AltAST } from "./ast/AltAST.js";
import { GrammarAST } from "./ast/GrammarAST.js";
import { TerminalAST } from "./ast/TerminalAST.js";



/** An outermost alternative for a rule.  We don't track inner alternatives. */
export  class Alternative implements AttributeResolver {
    public  rule:  Rule;

	public  ast:  AltAST;

	/** What alternative number is this outermost alt? 1..n */
	public  altNum:  number;

    // token IDs, string literals in this alt
    public  tokenRefs = new  MultiMap<string, TerminalAST>();

	// does not include labels
	public  tokenRefsInActions = new  MultiMap<string, GrammarAST>();

    // all rule refs in this alt
    public  ruleRefs = new  MultiMap<string, GrammarAST>();

	// does not include labels
	public  ruleRefsInActions = new  MultiMap<string, GrammarAST>();

    /** A list of all LabelElementPair attached to tokens like id=ID, ids+=ID */
    public  labelDefs = new  MultiMap<string, LabelElementPair>();

    // track all token, rule, label refs in rewrite (right of ->)
    //public List<GrammarAST> rewriteElements = new ArrayList<GrammarAST>();

    /** Track all executable actions other than named actions like @init
     *  and catch/finally (not in an alt). Also tracks predicates, rewrite actions.
     *  We need to examine these actions before code generation so
     *  that we can detect refs to $rule.attr etc...
	 *
	 *  This tracks per alt
     */
    public  actions = new  Array<ActionAST>();

    public  constructor(r: Rule, altNum: number) { this.rule = r; this.altNum = altNum; }

	@Override
public  resolvesToToken(x: string, node: ActionAST):  boolean {
		if ( this.tokenRefs.get(x)!==null ) {
 return true;
}

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

        if ( this.ruleRefs.get(x)!==null ) {
 return true;
}
 // rule ref in this alt?
        let  anyLabelDef = this.getAnyLabelDef(x);
        if ( anyLabelDef!==null && anyLabelDef.type===LabelType.RULE_LABEL ) {
 return true;
}

		return false;
	}

	/**  $x		Attribute: rule arguments, return values, predefined rule prop.
	 */
	@Override
public  resolveToAttribute(x: string, node: ActionAST):  java.security.KeyStore.Entry.Attribute;

	/** $x.y, x can be surrounding rule, token/rule/label ref. y is visible
	 *  attr in that dictionary.  Can't see args on rule refs.
	 */
	@Override
public  resolveToAttribute(x: string, y: string, node: ActionAST):  java.security.KeyStore.Entry.Attribute;
public resolveToAttribute(...args: unknown[]):  java.security.KeyStore.Entry.Attribute {
		switch (args.length) {
			case 2: {
				const [x, node] = args as [string, ActionAST];


		return this.rule.resolveToAttribute(x, node); // reuse that code
	

				break;
			}

			case 3: {
				const [x, y, node] = args as [string, string, ActionAST];


        if ( this.tokenRefs.get(x)!==null ) { // token ref in this alt?
            return this.rule.getPredefinedScope(LabelType.TOKEN_LABEL).get(y);
        }
        if ( this.ruleRefs.get(x)!==null ) {  // rule ref in this alt?
            // look up rule, ask it to resolve y (must be retval or predefined)
			return this.rule.g.getRule(x).resolveRetvalOrProperty(y);
		}
		let  anyLabelDef = this.getAnyLabelDef(x);
		if ( anyLabelDef!==null && anyLabelDef.type===LabelType.RULE_LABEL ) {
			return this.rule.g.getRule(anyLabelDef.element.getText()).resolveRetvalOrProperty(y);
		}
		else {
 if ( anyLabelDef!==null ) {
			let  scope = this.rule.getPredefinedScope(anyLabelDef.type);
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
			   (anyLabelDef.type===LabelType.TOKEN_LABEL ||
				anyLabelDef.type===LabelType.RULE_LABEL);
	}

	@Override
public  resolvesToListLabel(x: string, node: ActionAST):  boolean {
		let  anyLabelDef = this.getAnyLabelDef(x);
		return anyLabelDef!==null &&
			   (anyLabelDef.type===LabelType.RULE_LIST_LABEL ||
				anyLabelDef.type===LabelType.TOKEN_LIST_LABEL);
	}

	public  getAnyLabelDef(x: string):  LabelElementPair {
		let  labels = this.labelDefs.get(x);
		if ( labels!==null ) {
 return labels.get(0);
}

		return null;
	}

	/** x can be ruleref or rule label. */
	public  resolveToRule(x: string):  Rule {
        if ( this.ruleRefs.get(x)!==null ) {
 return this.rule.g.getRule(x);
}

		let  anyLabelDef = this.getAnyLabelDef(x);
		if ( anyLabelDef!==null && anyLabelDef.type===LabelType.RULE_LABEL ) {
            return this.rule.g.getRule(anyLabelDef.element.getText());
        }
        return null;
    }
}
