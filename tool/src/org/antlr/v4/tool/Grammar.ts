/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */


/* eslint-disable jsdoc/require-returns, jsdoc/require-param */


import { Rule } from "./Rule.js";
import { LexerGrammar } from "./LexerGrammar.js";
import { LeftRecursiveRule } from "./LeftRecursiveRule.js";
import { GrammarParserInterpreter } from "./GrammarParserInterpreter.js";
import { ErrorType } from "./ErrorType.js";
import { AttributeResolver } from "./AttributeResolver.js";
import { AttributeDict } from "./AttributeDict.js";
import { ANTLRToolListener } from "./ANTLRToolListener.js";
import { ANTLRMessage } from "./ANTLRMessage.js";
import { Tool } from "../Tool.js";
import { LeftRecursiveRuleTransformer } from "../analysis/LeftRecursiveRuleTransformer.js";
import { ParserATNFactory } from "../automata/ParserATNFactory.js";
import { CharSupport } from "../misc/CharSupport.js";
import { Utils } from "../misc/Utils.js";
import { GrammarASTAdaptor } from "../parse/GrammarASTAdaptor.js";
import { TokenVocabParser } from "../parse/TokenVocabParser.js";
import { CharStream, Lexer, LexerInterpreter, ParserInterpreter, Token, TokenStream, Vocabulary, ATN, ATNDeserializer, ATNSerializer, SemanticContext, DFA, IntervalSet, Interval, IntegerList, IntSet, HashSet, HashMap, OrderedHashMap, LinkedHashMap as HashMap, VocabularyImpl as Vocabulary } from "antlr4ng";
import { ActionAST } from "./ast/ActionAST.js";
import { GrammarAST } from "./ast/GrammarAST.js";
import { GrammarASTWithOptions } from "./ast/GrammarASTWithOptions.js";
import { GrammarRootAST } from "./ast/GrammarRootAST.js";
import { PredAST } from "./ast/PredAST.js";
import { RuleAST } from "./ast/RuleAST.js";
import { TerminalAST } from "./ast/TerminalAST.js";



export  class Grammar implements AttributeResolver {
	public static readonly  GRAMMAR_FROM_STRING_NAME = "<string>";
	/**
	 * This value is used in the following situations to indicate that a token
	 * type does not have an associated name which can be directly referenced in
	 * a grammar.
	 *
	 * <ul>
	 * <li>This value is the name and display name for the token with type
	 * {@link Token#INVALID_TYPE}.</li>
	 * <li>This value is the name for tokens with a type not represented by a
	 * named token. The display name for these tokens is simply the string
	 * representation of the token type as an integer.</li>
	 * </ul>
	 */
	public static readonly  INVALID_TOKEN_NAME = "<INVALID>";
	/**
	 * This value is used as the name for elements in the array returned by
	 * {@link #getRuleNames} for indexes not associated with a rule.
	 */
	public static readonly  INVALID_RULE_NAME = "<invalid>";

	public static readonly  caseInsensitiveOptionName = "caseInsensitive";

	public static readonly  parserOptions = new  HashSet<string>();

	public static readonly  lexerOptions = Grammar.parserOptions;

	public static readonly  lexerRuleOptions = new  HashSet();

	public static readonly  parseRuleOptions = new  HashSet();

	public static readonly  parserBlockOptions = new  HashSet<string>();

	public static readonly  lexerBlockOptions = new  HashSet<string>();

	/** Legal options for rule refs like id&lt;key=value&gt; */
	public static readonly  ruleRefOptions = new  HashSet<string>();

	/** Legal options for terminal refs like ID&lt;assoc=right&gt; */
	public static readonly  tokenOptions = new  HashSet<string>();

	public static readonly  actionOptions = new  HashSet<string>();

	public static readonly  semPredOptions = new  HashSet<string>();

	public static readonly  doNotCopyOptionsToLexer = new  HashSet<string>();

	public static readonly  grammarAndLabelRefTypeToScope =
		new  HashMap<string, AttributeDict>();

	public static readonly  AUTO_GENERATED_TOKEN_NAME_PREFIX = "T__";

	public  name:  string;
    public  ast:  GrammarRootAST;

	/** Track token stream used to create this grammar */

	public readonly  tokenStream:  org.antlr.runtime.TokenStream;

	/** If we transform grammar, track original unaltered token stream.
	 *  This is set to the same value as tokenStream when tokenStream is
	 *  initially set.
	 *
	 *  If this field differs from tokenStream, then we have transformed
	 *  the grammar.
	 */

	public  originalTokenStream:  org.antlr.runtime.TokenStream;

    public  text:  string; // testing only
    public  fileName:  string;

    /** Was this parser grammar created from a COMBINED grammar?  If so,
	 *  this is what we extracted.
	 */
    public  implicitLexer:  LexerGrammar;

	/** If this is an extracted/implicit lexer, we point at original grammar */
	public  originalGrammar:  Grammar;

    /** If we're imported, who imported us? If null, implies grammar is root */
    public  parent:  Grammar;
    public  importedGrammars:  Array<Grammar>;

	/** All rules defined in this specific grammar, not imported. Also does
	 *  not include lexical rules if combined.
	 */
    public  rules = new  OrderedHashMap<string, Rule>();
	public  indexToRule = new  Array<Rule>(); // used to invent rule names for 'keyword', ';', ... (0..n-1)

	/** The ATN that represents the grammar with edges labelled with tokens
	 *  or epsilon.  It is more suitable to analysis than an AST representation.
	 */
	public  atn:  ATN;

	public  stateToGrammarRegionMap:  Map<number, Interval>;

	public  decisionDFAs = new  HashMap<number, DFA>();

	public  decisionLOOK:  Array<IntervalSet[]>;

	public readonly  tool:  Tool;

	/**
	 * Map token like {@code ID} (but not literals like {@code 'while'}) to its
	 * token type.
	 */
	public readonly  tokenNameToTypeMap = new  LinkedHashMap<string, number>();

	/**
	 * Map token literals like {@code 'while'} to its token type. It may be that
	 * {@code WHILE="while"=35}, in which case both {@link #tokenNameToTypeMap}
	 * and this field will have entries both mapped to 35.
	 */
	public readonly  stringLiteralToTypeMap = new  LinkedHashMap<string, number>();

	/**
	 * Reverse index for {@link #stringLiteralToTypeMap}. Indexed with raw token
	 * type. 0 is invalid.
	 */
	public readonly  typeToStringLiteralList = new  Array<string>();

	/**
	 * Map a token type to its token name. Indexed with raw token type. 0 is
	 * invalid.
	 */
	public readonly  typeToTokenList = new  Array<string>();

	/**
	 * Map channel like {@code COMMENTS_CHANNEL} to its constant channel value.
	 * Only user-defined channels are defined in this map.
	 */
	public readonly  channelNameToValueMap = new  LinkedHashMap<string, number>();

	/**
	 * Map a constant channel value to its name. Indexed with raw channel value.
	 * The predefined channels {@link Token#DEFAULT_CHANNEL} and
	 * {@link Token#HIDDEN_CHANNEL} are not stored in this list, so the values
	 * at the corresponding indexes is {@code null}.
	 */
	public readonly  channelValueToNameList = new  Array<string>();

    /** Map a name to an action.
     *  The code generator will use this to fill holes in the output files.
     *  I track the AST node for the action in case I need the line number
     *  for errors.
     */
	public  namedActions = new  HashMap<string,ActionAST>();

	/** Tracks all user lexer actions in all alternatives of all rules.
	 *  Doesn't track sempreds.  maps tree node to action index (alt number 1..n).
 	 */
	public  lexerActions = new  LinkedHashMap<ActionAST, number>();

	/** All sempreds found in grammar; maps tree node to sempred index;
	 *  sempred index is 0..n-1
	 */
	public  sempreds = new  LinkedHashMap<PredAST, number>();
	/** Map the other direction upon demand */
	public  indexToPredMap:  LinkedHashMap<number, PredAST>;

	protected  ruleNumber = 0; // used to get rule indexes (0..n-1)
	protected  stringLiteralRuleNumber = 0;

	/** Token names and literal tokens like "void" are uniquely indexed.
	 *  with -1 implying EOF.  Characters are different; they go from
	 *  -1 (EOF) to \uFFFE.  For example, 0 could be a binary byte you
	 *  want to lexer.  Labels of DFA/ATN transitions can be both tokens
	 *  and characters.  I use negative numbers for bookkeeping labels
	 *  like EPSILON. Char/String literals and token types overlap in the same
	 *  space, however.
	 */
	protected  maxTokenType = Token.MIN_USER_TOKEN_TYPE -1;

	/**
	 * The maximum channel value which is assigned by this grammar. Values below
	 * {@link Token#MIN_USER_CHANNEL_VALUE} are assumed to be predefined.
	 */
	protected  maxChannelType = Token.MIN_USER_CHANNEL_VALUE - 1;

	/** For testing */
	public  constructor(grammarText: string);

	public  constructor(tool: Tool, ast: GrammarRootAST);

	public  constructor(grammarText: string, tokenVocabSource: LexerGrammar);

	/** For testing */
	public  constructor(grammarText: string, listener: ANTLRToolListener);

	/** For testing; builds trees, does sem anal */
	public  constructor(fileName: string, grammarText: string);

	/** For testing; builds trees, does sem anal */
	public  constructor(fileName: string, grammarText: string, listener: ANTLRToolListener);

	/** For testing; builds trees, does sem anal */
	public  constructor(fileName: string, grammarText: string, tokenVocabSource: Grammar, listener: ANTLRToolListener);
    public constructor(...args: unknown[]) {
		switch (args.length) {
			case 1: {
				const [grammarText] = args as [string];


		this(Grammar.GRAMMAR_FROM_STRING_NAME, grammarText, null);
	

				break;
			}

			case 2: {
				const [tool, ast] = args as [Tool, GrammarRootAST];


		if ( ast===null ) {
			throw new  NullPointerException("ast");
		}

		if (ast.tokenStream === null) {
			throw new  IllegalArgumentException("ast must have a token stream");
		}

        this.tool = tool;
        this.ast = ast;
        this.name = (ast.getChild(0)).getText();
		this.tokenStream = ast.tokenStream;
		this.originalTokenStream = this.tokenStream;

		this.initTokenSymbolTables();
    

				break;
			}

			case 2: {
				const [grammarText, tokenVocabSource] = args as [string, LexerGrammar];


		this(Grammar.GRAMMAR_FROM_STRING_NAME, grammarText, tokenVocabSource, null);
	

				break;
			}

			case 2: {
				const [grammarText, listener] = args as [string, ANTLRToolListener];


		this(Grammar.GRAMMAR_FROM_STRING_NAME, grammarText, listener);
	

				break;
			}

			case 2: {
				const [fileName, grammarText] = args as [string, string];


		this(fileName, grammarText, null);
	

				break;
			}

			case 3: {
				const [fileName, grammarText, listener] = args as [string, string, ANTLRToolListener];


		this(fileName, grammarText, null, listener);
	

				break;
			}

			case 4: {
				const [fileName, grammarText, tokenVocabSource, listener] = args as [string, string, Grammar, ANTLRToolListener];


        this.text = grammarText;
		this.fileName = fileName;
		this.tool = new  Tool();
		let  hush = new  class implements ANTLRToolListener {
			@Override
public  info(msg: string):  void { }
			@Override
public  error(msg: ANTLRMessage):  void { }
			@Override
public  warning(msg: ANTLRMessage):  void { }
		}();
		this.tool.addListener(hush); // we want to hush errors/warnings
		this.tool.addListener(listener);
		let  in = new  org.antlr.runtime.ANTLRStringStream(grammarText);
		in.name = fileName;

		this.ast = this.tool.parse(fileName, in);
		if ( this.ast===null ) {
			throw new  UnsupportedOperationException();
		}

		if (this.ast.tokenStream === null) {
			throw new  IllegalStateException("expected ast to have a token stream");
		}

		this.tokenStream = this.ast.tokenStream;
		this.originalTokenStream = this.tokenStream;

		// ensure each node has pointer to surrounding grammar
		 let  thiz = this;
		let  v = new  org.antlr.runtime.tree.TreeVisitor(new  GrammarASTAdaptor());
		v.visit(this.ast, new  class extends org.antlr.runtime.tree.TreeVisitorAction {
			@Override
public  pre(t: Object):  Object { (t as GrammarAST).g = thiz; return t; }
			@Override
public  post(t: Object):  Object { return t; }
		}());
		this.initTokenSymbolTables();

		if (tokenVocabSource !== null) {
			this.importVocab(tokenVocabSource);
		}

		this.tool.process(this, false);
    

				break;
			}

			default: {
				throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
			}
		}
	}


	/** convenience method for Tool.loadGrammar() */
	public static  load(fileName: string):  Grammar {
		let  antlr = new  Tool();
		return antlr.loadGrammar(fileName);
	}

	/** Is id a valid token name? Does id start with an uppercase letter? */
	public static  isTokenName(id: string):  boolean {
		return Character.isUpperCase(id.charAt(0));
	}

    public static  getGrammarTypeToFileNameSuffix(type: number):  string {
        switch ( type ) {
            case ANTLRParser.LEXER :{ return "Lexer";
}

            case ANTLRParser.PARSER :{ return "Parser";
}

            // if combined grammar, gen Parser and Lexer will be done later
            // TODO: we are separate now right?
            case ANTLRParser.COMBINED :{ return "Parser";
}

            default :{
                return "<invalid>";
}

        }
	}

	/** Given ^(TOKEN_REF ^(OPTIONS ^(ELEMENT_OPTIONS (= assoc right))))
	 *  set option assoc=right in TOKEN_REF.
	 */
	public static  setNodeOptions(node: GrammarAST, options: GrammarAST):  void {
		if ( options===null ) {
 return;
}

		let  t = node as GrammarASTWithOptions;
		if ( t.getChildCount()===0 || options.getChildCount()===0 ) {
 return;
}

		for (let o of options.getChildren()) {
			let  c = o as GrammarAST;
			if ( c.getType()===ANTLRParser.ASSIGN ) {
				t.setOption(c.getChild(0).getText(), c.getChild(1) as GrammarAST);
			}
			else {
				t.setOption(c.getText(), null); // no arg such as ID<VarNodeType>
			}
		}
	}

	/** Return list of (TOKEN_NAME node, 'literal' node) pairs */
	public static  getStringLiteralAliasesFromLexerRules(ast: GrammarRootAST):  Array<<GrammarAST,GrammarAST>> {
		let  patterns = [
			"(RULE %name:TOKEN_REF (BLOCK (ALT %lit:STRING_LITERAL)))",
			"(RULE %name:TOKEN_REF (BLOCK (ALT %lit:STRING_LITERAL ACTION)))",
			"(RULE %name:TOKEN_REF (BLOCK (ALT %lit:STRING_LITERAL SEMPRED)))",
			"(RULE %name:TOKEN_REF (BLOCK (LEXER_ALT_ACTION (ALT %lit:STRING_LITERAL) .)))",
			"(RULE %name:TOKEN_REF (BLOCK (LEXER_ALT_ACTION (ALT %lit:STRING_LITERAL) . .)))",
			"(RULE %name:TOKEN_REF (BLOCK (LEXER_ALT_ACTION (ALT %lit:STRING_LITERAL) (LEXER_ACTION_CALL . .))))",
			"(RULE %name:TOKEN_REF (BLOCK (LEXER_ALT_ACTION (ALT %lit:STRING_LITERAL) . (LEXER_ACTION_CALL . .))))",
			"(RULE %name:TOKEN_REF (BLOCK (LEXER_ALT_ACTION (ALT %lit:STRING_LITERAL) (LEXER_ACTION_CALL . .) .)))",
			// TODO: allow doc comment in there
		];
		let  adaptor = new  GrammarASTAdaptor(ast.token.getInputStream());
		let  wiz = new  org.antlr.runtime.tree.TreeWizard(adaptor,ANTLRParser.tokenNames);
		let  lexerRuleToStringLiteral =
			new  Array<<GrammarAST,GrammarAST>>();

		let  ruleNodes = ast.getNodesWithType(ANTLRParser.RULE);
		if ( ruleNodes===null || ruleNodes.isEmpty() ) {
 return null;
}


		for (let r of ruleNodes) {
			//tool.log("grammar", r.toStringTree());
//			System.out.println("chk: "+r.toStringTree());
			let  name = r.getChild(0);
			if ( name.getType()===ANTLRParser.TOKEN_REF ) {
				// check rule against patterns
				let  isLitRule: boolean;
				for (let pattern of patterns) {
					isLitRule =
						Grammar.defAlias(r, pattern, wiz, lexerRuleToStringLiteral);
					if ( isLitRule ) {
 break;
}

				}
//				if ( !isLitRule ) System.out.println("no pattern matched");
			}
		}
		return lexerRuleToStringLiteral;
	}

	public static  getStateToGrammarRegionMap(ast: GrammarRootAST, grammarTokenTypes: IntervalSet):  Map<number, Interval> {
		let  stateToGrammarRegionMap = new  HashMap<number, Interval>();
		if ( ast===null ) {
 return stateToGrammarRegionMap;
}


		let  nodes = ast.getNodesWithType(grammarTokenTypes);
		for (let n of nodes) {
			if (n.atnState !== null) {
				let  tokenRegion = Interval.of(n.getTokenStartIndex(), n.getTokenStopIndex());
				let  ruleNode = null;
				// RULEs, BLOCKs of transformed recursive rules point to original token interval
				switch ( n.getType() ) {
					case ANTLRParser.RULE :{
						ruleNode = n;
						break;
}

					case ANTLRParser.BLOCK :
					case ANTLRParser.CLOSURE :{
						ruleNode = n.getAncestor(ANTLRParser.RULE);
						break;
}


default:

				}
				if ( ruleNode instanceof RuleAST ) {
					let  ruleName = ( ruleNode as RuleAST).getRuleName();
					let  r = ast.g.getRule(ruleName);
					if ( r instanceof LeftRecursiveRule ) {
						let  originalAST = ( r as LeftRecursiveRule).getOriginalAST();
						tokenRegion = Interval.of(originalAST.getTokenStartIndex(), originalAST.getTokenStopIndex());
					}
				}
				stateToGrammarRegionMap.put(n.atnState.stateNumber, tokenRegion);
			}
		}
		return stateToGrammarRegionMap;
	}

	protected static  defAlias(r: GrammarAST, pattern: string,
									  wiz: org.antlr.runtime.tree.TreeWizard,
									  lexerRuleToStringLiteral: Array<<GrammarAST,GrammarAST>>):  boolean
	{
		let  nodes = new  HashMap<string, Object>();
		if ( wiz.parse(r, pattern, nodes) ) {
			let  litNode = nodes.get("lit") as GrammarAST;
			let  nameNode = nodes.get("name") as GrammarAST;
			let  pair =
				new  <GrammarAST, GrammarAST>(nameNode, litNode);
			lexerRuleToStringLiteral.add(pair);
			return true;
		}
		return false;
	}


	public  loadImportedGrammars():  void;

    private  loadImportedGrammars(visited: Set<string>):  void;
public loadImportedGrammars(...args: unknown[]):  void {
		switch (args.length) {
			case 0: {

		this.loadImportedGrammars(new  HashSet());
	

				break;
			}

			case 1: {
				const [visited] = args as [Set<string>];


		if ( this.ast===null ) {
 return;
}

        let  i = this.ast.getFirstChildWithType(ANTLRParser.IMPORT) as GrammarAST;
        if ( i===null ) {
 return;
}

	    visited.add(this.name);
        this.importedGrammars = new  Array<Grammar>();
        for (let c of i.getChildren()) {
            let  t = c as GrammarAST;
            let  importedGrammarName = null;
            if ( t.getType()===ANTLRParser.ASSIGN ) {
				t = t.getChild(1) as GrammarAST;
				importedGrammarName = t.getText();
            }
            else {
 if ( t.getType()===ANTLRParser.ID ) {
                importedGrammarName = t.getText();
			}
}

			if ( visited.contains(importedGrammarName) ) { // ignore circular refs
				continue;
			}
			let  g: Grammar;
			try {
				g = this.tool.loadImportedGrammar(this, t);
			} catch (ioe) {
if (ioe instanceof IOException) {
				this.tool.errMgr.grammarError(ErrorType.ERROR_READING_IMPORTED_GRAMMAR,
										 importedGrammarName,
										 t.getToken(),
										 importedGrammarName,
										 this.name);
				continue;
			} else {
	throw ioe;
	}
}
			// did it come back as error node or missing?
			if ( g === null ) {
 continue;
}

			g.parent = this;
			this.importedGrammars.add(g);
			g.loadImportedGrammars(visited); // recursively pursue any imports in this import
        }
    

				break;
			}

			default: {
				throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
			}
		}
	}


    public  defineAction(atAST: GrammarAST):  void {
        if ( atAST.getChildCount()===2 ) {
            let  name = atAST.getChild(0).getText();
            this.namedActions.put(name, atAST.getChild(1) as ActionAST);
        }
        else {
			let  scope = atAST.getChild(0).getText();
            let  gtype = this.getTypeString();
            if ( scope.equals(gtype) || (scope.equals("parser")&&gtype.equals("combined")) ) {
				let  name = atAST.getChild(1).getText();
				this.namedActions.put(name, atAST.getChild(2) as ActionAST);
			}
        }
    }

	/**
	 * Define the specified rule in the grammar. This method assigns the rule's
	 * {@link Rule#index} according to the {@link #ruleNumber} field, and adds
	 * the {@link Rule} instance to {@link #rules} and {@link #indexToRule}.
	 *
	 * @param r The rule to define in the grammar.
	 * @return {@code true} if the rule was added to the {@link Grammar}
	 * instance; otherwise, {@code false} if a rule with this name already
	 * existed in the grammar instance.
	 */
	public  defineRule(r: Rule):  boolean {
		if ( this.rules.get(r.name)!==null ) {
			return false;
		}
		this.rules.put(r.name, r);
		r.index = this.ruleNumber++;
		this.indexToRule.add(r);
		return true;
	}

	/**
	 * Undefine the specified rule from this {@link Grammar} instance. The
	 * instance {@code r} is removed from {@link #rules} and
	 * {@link #indexToRule}. This method updates the {@link Rule#index} field
	 * for all rules defined after {@code r}, and decrements {@link #ruleNumber}
	 * in preparation for adding new rules.
	 * <p>
	 * This method does nothing if the current {@link Grammar} does not contain
	 * the instance {@code r} at index {@code r.index} in {@link #indexToRule}.
	 * </p>
	 *
	 * @param r
	 * @return {@code true} if the rule was removed from the {@link Grammar}
	 * instance; otherwise, {@code false} if the specified rule was not defined
	 * in the grammar.
	 */
	public  undefineRule(r: Rule):  boolean {
		if (r.index < 0 || r.index >= this.indexToRule.size() || this.indexToRule.get(r.index) !== r) {
			return false;
		}

		/* assert rules.get(r.name) == r; */ 

		this.rules.remove(r.name);
		this.indexToRule.remove(r.index);
		for (let  i = r.index; i < this.indexToRule.size(); i++) {
			/* assert indexToRule.get(i).index == i + 1; */ 
			this.indexToRule.get(i).index--;
		}

		this.ruleNumber--;
		return true;
	}

//	public int getNumRules() {
//		int n = rules.size();
//		List<Grammar> imports = getAllImportedGrammars();
//		if ( imports!=null ) {
//			for (Grammar g : imports) n += g.getNumRules();
//		}
//		return n;
//	}

    public  getRule(name: string):  Rule;

	public  getRule(index: number):  Rule;

	public  getRule(grammarName: string, ruleName: string):  Rule;
public getRule(...args: unknown[]):  Rule {
		switch (args.length) {
			case 1: {
				const [name] = args as [string];


		let  r = this.rules.get(name);
		if ( r!==null ) {
 return r;
}

		return null;
		/*
		List<Grammar> imports = getAllImportedGrammars();
		if ( imports==null ) return null;
		for (Grammar g : imports) {
			r = g.getRule(name); // recursively walk up hierarchy
			if ( r!=null ) return r;
		}
		return null;
		*/
	

				break;
			}

			case 1: {
				const [index] = args as [number];

 return this.indexToRule.get(index); 

				break;
			}

			case 2: {
				const [grammarName, ruleName] = args as [string, string];


		if ( grammarName!==null ) { // scope override
			let  g = this.getImportedGrammar(grammarName);
			if ( g ===null ) {
				return null;
			}
			return g.rules.get(ruleName);
		}
		return this.getRule(ruleName);
	

				break;
			}

			default: {
				throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
			}
		}
	}


	public  getATN():  ATN {
		if ( this.atn===null ) {
			let  factory = new  ParserATNFactory(this);
			this.atn = factory.createATN();
		}
		return this.atn;
	}

    /** Get list of all imports from all grammars in the delegate subtree of g.
     *  The grammars are in import tree preorder.  Don't include ourselves
     *  in list as we're not a delegate of ourselves.
     */
	public  getAllImportedGrammars():  Array<Grammar> {
		if (this.importedGrammars === null) {
			return null;
		}

		let  delegates = new  LinkedHashMap<string, Grammar>();
		for (let d of this.importedGrammars) {
			delegates.put(d.fileName, d);
			let  ds = d.getAllImportedGrammars();
			if (ds !== null) {
				for (let imported of ds) {
					delegates.put(imported.fileName, imported);
				}
			}
		}

		return new  Array<Grammar>(delegates.values());
	}

    public  getImportedGrammars():  Array<Grammar> { return this.importedGrammars; }

	public  getImplicitLexer():  LexerGrammar {
		return this.implicitLexer;
	}

	/** Return list of imported grammars from root down to our parent.
     *  Order is [root, ..., this.parent].  (us not included).
     */
    public  getGrammarAncestors():  Array<Grammar> {
        let  root = this.getOutermostGrammar();
        if ( this===root ) {
 return null;
}

        let  grammars = new  Array<Grammar>();
        // walk backwards to root, collecting grammars
        let  p = this.parent;
        while ( p!==null ) {
            grammars.add(0, p); // add to head so in order later
            p = p.parent;
        }
        return grammars;
    }

    /** Return the grammar that imported us and our parents. Return this
     *  if we're root.
     */
    public  getOutermostGrammar():  Grammar {
        if ( this.parent===null ) {
 return this;
}

        return this.parent.getOutermostGrammar();
    }

    /** Get the name of the generated recognizer; may or may not be same
     *  as grammar name.
     *  Recognizer is TParser and TLexer from T if combined, else
     *  just use T regardless of grammar type.
     */
    public  getRecognizerName():  string {
        let  suffix = "";
        let  grammarsFromRootToMe = this.getOutermostGrammar().getGrammarAncestors();
        let  qualifiedName = this.name;
        if ( grammarsFromRootToMe!==null ) {
            let  buf = new  StringBuilder();
            for (let g of grammarsFromRootToMe) {
                buf.append(g.name);
                buf.append('_');
            }
            buf.append(this.name);
            qualifiedName = buf.toString();
        }

        if ( this.isCombined() || (this.isLexer() && this.implicitLexer!==null) )
        {
            suffix = Grammar.getGrammarTypeToFileNameSuffix(this.getType());
        }
        return qualifiedName+suffix;
    }

	public  getStringLiteralLexerRuleName(lit: string):  string {
		return Grammar.AUTO_GENERATED_TOKEN_NAME_PREFIX + this.stringLiteralRuleNumber++;
	}

    /** Return grammar directly imported by this grammar */
    public  getImportedGrammar(name: string):  Grammar {
		for (let g of this.importedGrammars) {
            if ( g.name.equals(name) ) {
 return g;
}

        }
        return null;
    }

	public  getTokenType(token: string):  number {
		let  I: number;
		if ( token.charAt(0)==='\'') {
			I = this.stringLiteralToTypeMap.get(token);
		}
		else { // must be a label like ID
			I = this.tokenNameToTypeMap.get(token);
		}
		let  i = (I!==null)? I : Token.INVALID_TYPE;
		//tool.log("grammar", "grammar type "+type+" "+tokenName+"->"+i);
		return i;
	}

	public  getTokenName(literal: string):  string;

	/**
	 * Gets the name by which a token can be referenced in the generated code.
	 * For tokens defined in a {@code tokens{}} block or via a lexer rule, this
	 * is the declared name of the token. For token types generated by the use
	 * of a string literal within a parser rule of a combined grammar, this is
	 * the automatically generated token type which includes the
	 * {@link #AUTO_GENERATED_TOKEN_NAME_PREFIX} prefix. For types which are not
	 * associated with a defined token, this method returns
	 * {@link #INVALID_TOKEN_NAME}.
	 *
	 * @param ttype The token type.
	 * @return The name of the token with the specified type.
	 */

	public  getTokenName(ttype: number):  string;
public getTokenName(...args: unknown[]):  string {
		switch (args.length) {
			case 1: {
				const [literal] = args as [string];


		let  grammar = this;
		while (grammar !== null) {
			if (grammar.stringLiteralToTypeMap.containsKey(literal)) {

				return grammar.getTokenName(grammar.stringLiteralToTypeMap.get(literal));
}

			grammar = grammar.parent;
		}
		return null;
	

				break;
			}

			case 1: {
				const [ttype] = args as [number];


		// inside any target's char range and is lexer grammar?
		if ( this.isLexer() &&
			 ttype >= Lexer.MIN_CHAR_VALUE && ttype <= Lexer.MAX_CHAR_VALUE )
		{
			return CharSupport.getANTLRCharLiteralForChar(ttype);
		}

		if ( ttype===Token.EOF ) {
			return "EOF";
		}

		if (ttype >= 0 && ttype < this.typeToTokenList.size() && this.typeToTokenList.get(ttype) !== null) {
			return this.typeToTokenList.get(ttype);
		}

		return Grammar.INVALID_TOKEN_NAME;
	

				break;
			}

			default: {
				throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
			}
		}
	}


	/** Given a token type, get a meaningful name for it such as the ID
	 *  or string literal.  If this is a lexer and the ttype is in the
	 *  char vocabulary, compute an ANTLR-valid (possibly escaped) char literal.
	 */
	public  getTokenDisplayName(ttype: number):  string {
		// inside any target's char range and is lexer grammar?
		if ( this.isLexer() &&
			 ttype >= Lexer.MIN_CHAR_VALUE && ttype <= Lexer.MAX_CHAR_VALUE )
		{
			return CharSupport.getANTLRCharLiteralForChar(ttype);
		}

		if ( ttype===Token.EOF ) {
			return "EOF";
		}

		if ( ttype===Token.INVALID_TYPE ) {
			return Grammar.INVALID_TOKEN_NAME;
		}

		if (ttype >= 0 && ttype < this.typeToStringLiteralList.size() && this.typeToStringLiteralList.get(ttype) !== null) {
			return this.typeToStringLiteralList.get(ttype);
		}

		if (ttype >= 0 && ttype < this.typeToTokenList.size() && this.typeToTokenList.get(ttype) !== null) {
			return this.typeToTokenList.get(ttype);
		}

		return string.valueOf(ttype);
	}

	/**
	 * Gets the constant channel value for a user-defined channel.
	 *
	 * <p>
	 * This method only returns channel values for user-defined channels. All
	 * other channels, including the predefined channels
	 * {@link Token#DEFAULT_CHANNEL} and {@link Token#HIDDEN_CHANNEL} along with
	 * any channel defined in code (e.g. in a {@code @members{}} block), are
	 * ignored.</p>
	 *
	 * @param channel The channel name.
	 * @return The channel value, if {@code channel} is the name of a known
	 * user-defined token channel; otherwise, -1.
	 */
	public  getChannelValue(channel: string):  number {
		let  I = this.channelNameToValueMap.get(channel);
		let  i = (I !== null) ? I : -1;
		return i;
	}

	/**
	 * Gets an array of rule names for rules defined or imported by the
	 * grammar. The array index is the rule index, and the value is the name of
	 * the rule with the corresponding {@link Rule#index}.
	 *
	 * <p>If no rule is defined with an index for an element of the resulting
	 * array, the value of that element is {@link #INVALID_RULE_NAME}.</p>
	 *
	 * @return The names of all rules defined in the grammar.
	 */
	public  getRuleNames():  string[] {
		let  result = new  Array<string>(this.rules.size());
		Arrays.fill(result, Grammar.INVALID_RULE_NAME);
		for (let rule of this.rules.values()) {
			result[rule.index] = rule.name;
		}

		return result;
	}

	/**
	 * Gets an array of token names for tokens defined or imported by the
	 * grammar. The array index is the token type, and the value is the result
	 * of {@link #getTokenName} for the corresponding token type.
	 *
	 * @see #getTokenName
	 * @return The token names of all tokens defined in the grammar.
	 */
	public  getTokenNames():  string[] {
		let  numTokens = this.getMaxTokenType();
		let  tokenNames = new  Array<string>(numTokens+1);
		for (let  i = 0; i < tokenNames.length; i++) {
			tokenNames[i] = this.getTokenName(i);
		}

		return tokenNames;
	}

	/**
	 * Gets an array of display names for tokens defined or imported by the
	 * grammar. The array index is the token type, and the value is the result
	 * of {@link #getTokenDisplayName} for the corresponding token type.
	 *
	 * @see #getTokenDisplayName
	 * @return The display names of all tokens defined in the grammar.
	 */
	public  getTokenDisplayNames():  string[] {
		let  numTokens = this.getMaxTokenType();
		let  tokenNames = new  Array<string>(numTokens+1);
		for (let  i = 0; i < tokenNames.length; i++) {
			tokenNames[i] = this.getTokenDisplayName(i);
		}

		return tokenNames;
	}

	/**
	 * Gets the literal names assigned to tokens in the grammar.
	 */

	public  getTokenLiteralNames():  string[] {
		let  numTokens = this.getMaxTokenType();
		let  literalNames = new  Array<string>(numTokens+1);
		for (let  i = 0; i < Math.min(literalNames.length, this.typeToStringLiteralList.size()); i++) {
			literalNames[i] = this.typeToStringLiteralList.get(i);
		}

		for (let entry of this.stringLiteralToTypeMap.entrySet()) {
			let  value = entry.getValue();
			if (value >= 0 && value < literalNames.length && literalNames[value] === null) {
				literalNames[value] = entry.getKey();
			}
		}

		return literalNames;
	}

	/**
	 * Gets the symbolic names assigned to tokens in the grammar.
	 */

	public  getTokenSymbolicNames():  string[] {
		let  numTokens = this.getMaxTokenType();
		let  symbolicNames = new  Array<string>(numTokens+1);
		for (let  i = 0; i < Math.min(symbolicNames.length, this.typeToTokenList.size()); i++) {
			if (this.typeToTokenList.get(i) === null || this.typeToTokenList.get(i).startsWith(Grammar.AUTO_GENERATED_TOKEN_NAME_PREFIX)) {
				continue;
			}

			symbolicNames[i] = this.typeToTokenList.get(i);
		}

		return symbolicNames;
	}

	/**
	 * Gets a {@link Vocabulary} instance describing the vocabulary used by the
	 * grammar.
	 */

	public  getVocabulary():  Vocabulary {
		return new  VocabularyImpl(this.getTokenLiteralNames(), this.getTokenSymbolicNames());
	}

	/** Given an arbitrarily complex SemanticContext, walk the "tree" and get display string.
	 *  Pull predicates from grammar text.
	 */
	public  getSemanticContextDisplayString(semctx: SemanticContext):  string {
		if ( semctx instanceof SemanticContext.Predicate ) {
			return this.getPredicateDisplayString(semctx as SemanticContext.Predicate);
		}
		if ( semctx instanceof SemanticContext.AND ) {
			let  and = semctx as SemanticContext.AND;
			return this.joinPredicateOperands(and, " and ");
		}
		if ( semctx instanceof SemanticContext.OR ) {
			let  or = semctx as SemanticContext.OR;
			return this.joinPredicateOperands(or, " or ");
		}
		return semctx.toString();
	}

	public  joinPredicateOperands(op: SemanticContext.Operator, separator: string):  string {
		let  buf = new  StringBuilder();
		for (let operand of op.getOperands()) {
			if (buf.length() > 0) {
				buf.append(separator);
			}

			buf.append(this.getSemanticContextDisplayString(operand));
		}

		return buf.toString();
	}

	public  getIndexToPredicateMap():  LinkedHashMap<number, PredAST> {
		let  indexToPredMap = new  LinkedHashMap<number, PredAST>();
		for (let r of this.rules.values()) {
			for (let a of r.actions) {
				if (a instanceof PredAST) {
					let  p =  a as PredAST;
					indexToPredMap.put(this.sempreds.get(p), p);
				}
			}
		}
		return indexToPredMap;
	}

	public  getPredicateDisplayString(pred: SemanticContext.Predicate):  string {
		if ( this.indexToPredMap===null ) {
			this.indexToPredMap = this.getIndexToPredicateMap();
		}
		let  actionAST = this.indexToPredMap.get(pred.predIndex);
		return actionAST.getText();
	}

	/** What is the max char value possible for this grammar's target?  Use
	 *  unicode max if no target defined.
	 */
	public  getMaxCharValue():  number {
		return org.antlr.v4.runtime.Lexer.MAX_CHAR_VALUE;
//		if ( generator!=null ) {
//			return generator.getTarget().getMaxCharValue(generator);
//		}
//		else {
//			return Label.MAX_CHAR_VALUE;
//		}
	}

	/** Return a set of all possible token or char types for this grammar */
	public  getTokenTypes():  IntSet {
		if ( this.isLexer() ) {
			return this.getAllCharValues();
		}
		return IntervalSet.of(Token.MIN_USER_TOKEN_TYPE, this.getMaxTokenType());
	}

	/** Return min to max char as defined by the target.
	 *  If no target, use max unicode char value.
	 */
	public  getAllCharValues():  IntSet {
		return IntervalSet.of(Lexer.MIN_CHAR_VALUE, this.getMaxCharValue());
	}

	/** How many token types have been allocated so far? */
	public  getMaxTokenType():  number {
		return this.typeToTokenList.size() - 1; // don't count 0 (invalid)
	}

	/** Return a new unique integer in the token type space */
	public  getNewTokenType():  number {
		this.maxTokenType++;
		return this.maxTokenType;
	}

	/** Return a new unique integer in the channel value space. */
	public  getNewChannelNumber():  number {
		this.maxChannelType++;
		return this.maxChannelType;
	}

	public  importTokensFromTokensFile():  void {
		let  vocab = this.getOptionString("tokenVocab");
		if ( vocab!==null ) {
			let  vparser = new  TokenVocabParser(this);
			let  tokens = vparser.load();
			this.tool.log("grammar", "tokens=" + tokens);
			for (let t of tokens.keySet()) {
				if ( t.charAt(0)==='\'' ) {
 this.defineStringLiteral(t, tokens.get(t));
}

				else {
 this.defineTokenName(t, tokens.get(t));
}

			}
		}
	}

	public  importVocab(importG: Grammar):  void {
		for (let tokenNameof importG.tokenNameToTypeMap.keySet()) {
			this.defineTokenName(tokenName, importG.tokenNameToTypeMap.get(tokenName));
		}
		for (let tokenNameof importG.stringLiteralToTypeMap.keySet()) {
			this.defineStringLiteral(tokenName, importG.stringLiteralToTypeMap.get(tokenName));
		}
		for (let channel of importG.channelNameToValueMap.entrySet()) {
			this.defineChannelName(channel.getKey(), channel.getValue());
		}
//		this.tokenNameToTypeMap.putAll( importG.tokenNameToTypeMap );
//		this.stringLiteralToTypeMap.putAll( importG.stringLiteralToTypeMap );
		let  max = Math.max(this.typeToTokenList.size(), importG.typeToTokenList.size());
		Utils.setSize(this.typeToTokenList, max);
		for (let  ttype=0; ttype<importG.typeToTokenList.size(); ttype++) {
			this.maxTokenType = Math.max(this.maxTokenType, ttype);
			this.typeToTokenList.set(ttype, importG.typeToTokenList.get(ttype));
		}

		max = Math.max(this.channelValueToNameList.size(), importG.channelValueToNameList.size());
		Utils.setSize(this.channelValueToNameList, max);
		for (let  channelValue = 0; channelValue < importG.channelValueToNameList.size(); channelValue++) {
			this.maxChannelType = Math.max(this.maxChannelType, channelValue);
			this.channelValueToNameList.set(channelValue, importG.channelValueToNameList.get(channelValue));
		}
	}

	public  defineTokenName(name: string):  number;

	public  defineTokenName(name: string, ttype: number):  number;
public defineTokenName(...args: unknown[]):  number {
		switch (args.length) {
			case 1: {
				const [name] = args as [string];


		let  prev = this.tokenNameToTypeMap.get(name);
		if ( prev===null ) {
 return this.defineTokenName(name, this.getNewTokenType());
}

		return prev;
	

				break;
			}

			case 2: {
				const [name, ttype] = args as [string, number];


		let  prev = this.tokenNameToTypeMap.get(name);
		if ( prev!==null ) {
 return prev;
}

		this.tokenNameToTypeMap.put(name, ttype);
		this.setTokenForType(ttype, name);
		this.maxTokenType = Math.max(this.maxTokenType, ttype);
		return ttype;
	

				break;
			}

			default: {
				throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
			}
		}
	}


	public  defineStringLiteral(lit: string):  number;

	public  defineStringLiteral(lit: string, ttype: number):  number;
public defineStringLiteral(...args: unknown[]):  number {
		switch (args.length) {
			case 1: {
				const [lit] = args as [string];


		if ( this.stringLiteralToTypeMap.containsKey(lit) ) {
			return this.stringLiteralToTypeMap.get(lit);
		}
		return this.defineStringLiteral(lit, this.getNewTokenType());

	

				break;
			}

			case 2: {
				const [lit, ttype] = args as [string, number];


		if ( !this.stringLiteralToTypeMap.containsKey(lit) ) {
			this.stringLiteralToTypeMap.put(lit, ttype);
			// track in reverse index too
			if ( ttype>=this.typeToStringLiteralList.size() ) {
				Utils.setSize(this.typeToStringLiteralList, ttype+1);
			}
			this.typeToStringLiteralList.set(ttype, lit);

			this.setTokenForType(ttype, lit);
			return ttype;
		}
		return Token.INVALID_TYPE;
	

				break;
			}

			default: {
				throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
			}
		}
	}


	public  defineTokenAlias(name: string, lit: string):  number {
		let  ttype = this.defineTokenName(name);
		this.stringLiteralToTypeMap.put(lit, ttype);
		this.setTokenForType(ttype, name);
		return ttype;
	}

	public  setTokenForType(ttype: number, text: string):  void {
		if (ttype === Token.EOF) {
			// ignore EOF, it will be reported as an error separately
			return;
		}

		if ( ttype>=this.typeToTokenList.size() ) {
			Utils.setSize(this.typeToTokenList, ttype+1);
		}
		let  prevToken = this.typeToTokenList.get(ttype);
		if ( prevToken===null || prevToken.charAt(0)==='\'' ) {
			// only record if nothing there before or if thing before was a literal
			this.typeToTokenList.set(ttype, text);
		}
	}

	/**
	 * Define a token channel with a specified name.
	 *
	 * <p>
	 * If a channel with the specified name already exists, the previously
	 * assigned channel value is returned.</p>
	 *
	 * @param name The channel name.
	 * @return The constant channel value assigned to the channel.
	 */
	public  defineChannelName(name: string):  number;

	/**
	 * Define a token channel with a specified name.
	 *
	 * <p>
	 * If a channel with the specified name already exists, the previously
	 * assigned channel value is not altered.</p>
	 *
	 * @param name The channel name.
	 * @return The constant channel value assigned to the channel.
	 */
	public  defineChannelName(name: string, value: number):  number;
public defineChannelName(...args: unknown[]):  number {
		switch (args.length) {
			case 1: {
				const [name] = args as [string];


		let  prev = this.channelNameToValueMap.get(name);
		if (prev === null) {
			return this.defineChannelName(name, this.getNewChannelNumber());
		}

		return prev;
	

				break;
			}

			case 2: {
				const [name, value] = args as [string, number];


		let  prev = this.channelNameToValueMap.get(name);
		if (prev !== null) {
			return prev;
		}

		this.channelNameToValueMap.put(name, value);
		this.setChannelNameForValue(value, name);
		this.maxChannelType = Math.max(this.maxChannelType, value);
		return value;
	

				break;
			}

			default: {
				throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
			}
		}
	}


	/**
	 * Sets the channel name associated with a particular channel value.
	 *
	 * <p>
	 * If a name has already been assigned to the channel with constant value
	 * {@code channelValue}, this method does nothing.</p>
	 *
	 * @param channelValue The constant value for the channel.
	 * @param name The channel name.
	 */
	public  setChannelNameForValue(channelValue: number, name: string):  void {
		if (channelValue >= this.channelValueToNameList.size()) {
			Utils.setSize(this.channelValueToNameList, channelValue + 1);
		}

		let  prevChannel = this.channelValueToNameList.get(channelValue);
		if (prevChannel === null) {
			this.channelValueToNameList.set(channelValue, name);
		}
	}

	// no isolated attr at grammar action level
	@Override
public  resolveToAttribute(x: string, node: ActionAST):  java.security.KeyStore.Entry.Attribute;

	// no $x.y makes sense here
	@Override
public  resolveToAttribute(x: string, y: string, node: ActionAST):  java.security.KeyStore.Entry.Attribute;
public resolveToAttribute(...args: unknown[]):  java.security.KeyStore.Entry.Attribute {
		switch (args.length) {
			case 2: {
				const [x, node] = args as [string, ActionAST];


		return null;
	

				break;
			}

			case 3: {
				const [x, y, node] = args as [string, string, ActionAST];


		return null;
	

				break;
			}

			default: {
				throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
			}
		}
	}


	@Override
public  resolvesToLabel(x: string, node: ActionAST):  boolean { return false; }

	@Override
public  resolvesToListLabel(x: string, node: ActionAST):  boolean { return false; }

	@Override
public  resolvesToToken(x: string, node: ActionAST):  boolean { return false; }

	@Override
public  resolvesToAttributeDict(x: string, node: ActionAST):  boolean {
		return false;
	}

	/** Given a grammar type, what should be the default action scope?
     *  If I say @members in a COMBINED grammar, for example, the
     *  default scope should be "parser".
     */
    public  getDefaultActionScope():  string {
        switch ( this.getType() ) {
            case ANTLRParser.LEXER :{
                return "lexer";
}

            case ANTLRParser.PARSER :
            case ANTLRParser.COMBINED :{
                return "parser";
}


default:

        }
        return null;
    }

    public  getType():  number {
        if ( this.ast!==null ) {
 return this.ast.grammarType;
}

        return 0;
    }

	public  getTokenStream():  org.antlr.runtime.TokenStream {
		if ( this.ast!==null ) {
 return this.ast.tokenStream;
}

		return null;
	}

	public  isLexer():  boolean { return this.getType()===ANTLRParser.LEXER; }
	public  isParser():  boolean { return this.getType()===ANTLRParser.PARSER; }
	public  isCombined():  boolean { return this.getType()===ANTLRParser.COMBINED; }

    public  getTypeString():  string {
        if ( this.ast===null ) {
 return null;
}

        return ANTLRParser.tokenNames[this.getType()].toLowerCase();
    }

	public  getLanguage():  string {
		return this.getOptionString("language");
	}

	public  getOptionString(key: string):  string { return this.ast.getOptionString(key); }

	public  getStringLiterals():  Set<string> {
		 let  strings = new  LinkedHashSet<string>();
		let  collector = new  class extends GrammarTreeVisitor {
			@Override
public  stringRef(ref: TerminalAST):  void {
				strings.add(ref.getText());
			}
			@Override
public  getErrorManager():  java.util.logging.ErrorManager { return $outer.tool.errMgr; }
		}();
		collector.visitGrammar(this.ast);
		return strings;
	}

	public  setLookaheadDFA(decision: number, lookaheadDFA: DFA):  void {
		this.decisionDFAs.put(decision, lookaheadDFA);
	}

	/** Given an ATN state number, return the token index range within the grammar from which that ATN state was derived. */
	public  getStateToGrammarRegion(atnStateNumber: number):  Interval {
		if ( this.stateToGrammarRegionMap===null ) {
			this.stateToGrammarRegionMap = Grammar.getStateToGrammarRegionMap(this.ast, null); // map all nodes with non-null atn state ptr
		}
		if ( this.stateToGrammarRegionMap===null ) {
 return Interval.INVALID;
}


		return this.stateToGrammarRegionMap.get(atnStateNumber);
	}

	public  createLexerInterpreter(input: CharStream):  LexerInterpreter {
		if (this.isParser()) {
			throw new  IllegalStateException("A lexer interpreter can only be created for a lexer or combined grammar.");
		}

		if (this.isCombined()) {
			return this.implicitLexer.createLexerInterpreter(input);
		}

		let  allChannels = new  Array<string>();
		allChannels.add("DEFAULT_TOKEN_CHANNEL");
		allChannels.add("HIDDEN");
		allChannels.addAll(this.channelValueToNameList);

		// must run ATN through serializer to set some state flags
		let  serialized = ATNSerializer.getSerialized(this.atn);
		let  deserializedATN = new  ATNDeserializer().deserialize(serialized.toArray());
		return new  LexerInterpreter(
				this.fileName,
				this.getVocabulary(),
				Arrays.asList(this.getRuleNames()),
				allChannels,
				(this as LexerGrammar).modes.keySet(),
				deserializedATN,
				input);
	}

	/** @since 4.5.1 */
	public  createGrammarParserInterpreter(tokenStream: TokenStream):  GrammarParserInterpreter {
		if (this.isLexer()) {
			throw new  IllegalStateException("A parser interpreter can only be created for a parser or combined grammar.");
		}
		// must run ATN through serializer to set some state flags
		let  serialized = ATNSerializer.getSerialized(this.atn);
		let  deserializedATN = new  ATNDeserializer().deserialize(serialized.toArray());

		return new  GrammarParserInterpreter(this, deserializedATN, tokenStream);
	}

	public  createParserInterpreter(tokenStream: TokenStream):  ParserInterpreter {
		if (this.isLexer()) {
			throw new  IllegalStateException("A parser interpreter can only be created for a parser or combined grammar.");
		}

		// must run ATN through serializer to set some state flags
		let  serialized = ATNSerializer.getSerialized(this.atn);
		let  deserializedATN = new  ATNDeserializer().deserialize(serialized.toArray());

		return new  ParserInterpreter(this.fileName, this.getVocabulary(), Arrays.asList(this.getRuleNames()), deserializedATN, tokenStream);
	}

	protected  initTokenSymbolTables():  void {
		this.tokenNameToTypeMap.put("EOF", Token.EOF);

		// reserve a spot for the INVALID token
		this.typeToTokenList.add(null);
	}
	 static {
		Grammar.parserOptions.add("superClass");
		Grammar.parserOptions.add("contextSuperClass");
		Grammar.parserOptions.add("TokenLabelType");
		Grammar.parserOptions.add("tokenVocab");
		Grammar.parserOptions.add("language");
		Grammar.parserOptions.add("accessLevel");
		Grammar.parserOptions.add("exportMacro");
		Grammar.parserOptions.add(Grammar.caseInsensitiveOptionName);
	}
	 static {
		Grammar.lexerRuleOptions.add(Grammar.caseInsensitiveOptionName);
	}
	 static {
		Grammar.ruleRefOptions.add(LeftRecursiveRuleTransformer.PRECEDENCE_OPTION_NAME);
		Grammar.ruleRefOptions.add(LeftRecursiveRuleTransformer.TOKENINDEX_OPTION_NAME);
	}
	 static {
		Grammar.tokenOptions.add("assoc");
		Grammar.tokenOptions.add(LeftRecursiveRuleTransformer.TOKENINDEX_OPTION_NAME);
	}
	 static {
		Grammar.semPredOptions.add(LeftRecursiveRuleTransformer.PRECEDENCE_OPTION_NAME);
		Grammar.semPredOptions.add("fail");
	}
	 static {
		Grammar.doNotCopyOptionsToLexer.add("superClass");
		Grammar.doNotCopyOptionsToLexer.add("TokenLabelType");
		Grammar.doNotCopyOptionsToLexer.add("tokenVocab");
	}
	 static {
		Grammar.grammarAndLabelRefTypeToScope.put("parser:RULE_LABEL", Rule.predefinedRulePropertiesDict);
		Grammar.grammarAndLabelRefTypeToScope.put("parser:TOKEN_LABEL", AttributeDict.predefinedTokenDict);
		Grammar.grammarAndLabelRefTypeToScope.put("combined:RULE_LABEL", Rule.predefinedRulePropertiesDict);
		Grammar.grammarAndLabelRefTypeToScope.put("combined:TOKEN_LABEL", AttributeDict.predefinedTokenDict);
	}
}
