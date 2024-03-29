/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */


/* eslint-disable jsdoc/require-returns, jsdoc/require-param */


import { Grammar } from "./Grammar.js";
import { ErrorType } from "./ErrorType.js";
import { Tool } from "../Tool.js";
import { LeftRecursiveRuleTransformer } from "../analysis/LeftRecursiveRuleTransformer.js";
import { GrammarASTAdaptor } from "../parse/GrammarASTAdaptor.js";
import { GrammarToken } from "../parse/GrammarToken.js";
import { DoubleKeyMap, HashSet } from "antlr4ng";
import { AltAST } from "./ast/AltAST.js";
import { BlockAST } from "./ast/BlockAST.js";
import { GrammarAST } from "./ast/GrammarAST.js";
import { GrammarASTWithOptions } from "./ast/GrammarASTWithOptions.js";
import { GrammarRootAST } from "./ast/GrammarRootAST.js";
import { RuleAST } from "./ast/RuleAST.js";
import { TerminalAST } from "./ast/TerminalAST.js";



/** Handle left-recursion and block-set transforms */
export  class GrammarTransformPipeline {
	public  g:  Grammar;
	public  tool:  Tool;

	public  constructor(g: Grammar, tool: Tool) {
		this.g = g;
		this.tool = tool;
	}

    /** Utility visitor that sets grammar ptr in each node */
	public static  setGrammarPtr(/* final */  g: Grammar, tree: GrammarAST):  void {
		if ( tree===null ) {
 return;
}

		// ensure each node has pointer to surrounding grammar
		let  v = new  TreeVisitor(new  GrammarASTAdaptor());
		v.visit(tree, new  class extends TreeVisitorAction {
			@Override
public  pre(t: Object):  Object { (t as GrammarAST).g = g; return t; }
			@Override
public  post(t: Object):  Object { return t; }
		}());
	}

	public static  augmentTokensWithOriginalPosition(/* final */  g: Grammar, tree: GrammarAST):  void {
		if ( tree===null ) {
 return;
}


		let  optionsSubTrees = tree.getNodesWithType(ANTLRParser.ELEMENT_OPTIONS);
		for (let  i = 0; i < optionsSubTrees.size(); i++) {
			let  t = optionsSubTrees.get(i);
			let  elWithOpt = t.parent;
			if ( elWithOpt instanceof GrammarASTWithOptions ) {
				let  options = ( elWithOpt as GrammarASTWithOptions).getOptions();
				if ( options.containsKey(LeftRecursiveRuleTransformer.TOKENINDEX_OPTION_NAME) ) {
					let  newTok = new  GrammarToken(g, elWithOpt.getToken());
					newTok.originalTokenIndex = number.valueOf(options.get(LeftRecursiveRuleTransformer.TOKENINDEX_OPTION_NAME).getText());
					elWithOpt.token = newTok;

					let  originalNode = g.ast.getNodeWithTokenIndex(newTok.getTokenIndex());
					if (originalNode !== null) {
						// update the AST node start/stop index to match the values
						// of the corresponding node in the original parse tree.
						elWithOpt.setTokenStartIndex(originalNode.getTokenStartIndex());
						elWithOpt.setTokenStopIndex(originalNode.getTokenStopIndex());
					}
					else {
						// the original AST node could not be located by index;
						// make sure to assign valid values for the start/stop
						// index so toTokenString will not throw exceptions.
						elWithOpt.setTokenStartIndex(newTok.getTokenIndex());
						elWithOpt.setTokenStopIndex(newTok.getTokenIndex());
					}
				}
			}
		}
	}

	public  process():  void {
		let  root = this.g.ast;
		if ( root===null ) {
 return;
}

        this.tool.log("grammar", "before: "+root.toStringTree());

        this.integrateImportedGrammars(this.g);
		this.reduceBlocksToSets(root);
        this.expandParameterizedLoops(root);

        this.tool.log("grammar", "after: "+root.toStringTree());
	}

	public  reduceBlocksToSets(root: GrammarAST):  void {
		let  nodes = new  CommonTreeNodeStream(new  GrammarASTAdaptor(), root);
		let  adaptor = new  GrammarASTAdaptor();
		let  transformer = new  BlockSetTransformer(nodes, this.g);
		transformer.setTreeAdaptor(adaptor);
		transformer.downup(root);
	}

    /** Find and replace
     *      ID*[','] with ID (',' ID)*
     *      ID+[','] with ID (',' ID)+
     *      (x {action} y)+[','] with x {action} y (',' x {action} y)+
     *
     *  Parameter must be a token.
     *  todo: do we want?
     */
    public  expandParameterizedLoops(root: GrammarAST):  void {
        let  v = new  TreeVisitor(new  GrammarASTAdaptor());
        v.visit(root, new  class extends TreeVisitorAction {
            @Override
public  pre(t: Object):  Object {
                if ( (t as GrammarAST).getType() === 3 ) {
                    return $outer.expandParameterizedLoop(t as GrammarAST);
                }
                return t;
            }
            @Override
public  post(t: Object):  Object { return t; }
        }());
    }

    public  expandParameterizedLoop(t: GrammarAST):  GrammarAST {
        // todo: update grammar, alter AST
        return t;
    }

	/** Merge all the rules, token definitions, and named actions from
		imported grammars into the root grammar tree.  Perform:

	 	(tokens { X (= Y 'y')) + (tokens { Z )	-&gt;	(tokens { X (= Y 'y') Z)

	 	(@ members {foo}) + (@ members {bar})	-&gt;	(@ members {foobar})

	 	(RULES (RULE x y)) + (RULES (RULE z))	-&gt;	(RULES (RULE x y z))

	 	Rules in root prevent same rule from being appended to RULES node.

	 	The goal is a complete combined grammar so we can ignore subordinate
	 	grammars.
	 */
	public  integrateImportedGrammars(rootGrammar: Grammar):  void {
		let  imports = rootGrammar.getAllImportedGrammars();
		if ( imports===null ) {
 return;
}


		let  root = rootGrammar.ast;
		let  id =  root.getChild(0) as GrammarAST;
		let  adaptor = new  GrammarASTAdaptor(id.token.getInputStream());

		let  channelsRoot = root.getFirstChildWithType(ANTLRParser.CHANNELS) as GrammarAST;
	 	let  tokensRoot = root.getFirstChildWithType(ANTLRParser.TOKENS_SPEC) as GrammarAST;

		let  actionRoots = root.getNodesWithType(ANTLRParser.AT);

		// Compute list of rules in root grammar and ensure we have a RULES node
		let  RULES = root.getFirstChildWithType(ANTLRParser.RULES) as GrammarAST;
		let  rootRuleNames = new  HashSet<string>();
		// make list of rules we have in root grammar
		let  rootRules = RULES.getNodesWithType(ANTLRParser.RULE);
		for (let r of rootRules) {
 rootRuleNames.add(r.getChild(0).getText());
}


		// make list of modes we have in root grammar
		let  rootModes = root.getNodesWithType(ANTLRParser.MODE);
		let  rootModeNames = new  HashSet<string>();
		for (let m of rootModes) {
 rootModeNames.add(m.getChild(0).getText());
}

		let  addedModes = new  Array<GrammarAST>();

		for (let imp of imports) {
			// COPY CHANNELS
			let  imp_channelRoot = imp.ast.getFirstChildWithType(ANTLRParser.CHANNELS) as GrammarAST;
			if ( imp_channelRoot !== null) {
				rootGrammar.tool.log("grammar", "imported channels: "+imp_channelRoot.getChildren());
				if (channelsRoot===null) {
					channelsRoot = imp_channelRoot.dupTree();
					channelsRoot.g = rootGrammar;
					root.insertChild(1, channelsRoot); // ^(GRAMMAR ID TOKENS...)
				} else {
					for (let  c = 0; c < imp_channelRoot.getChildCount(); ++c) {
						let  channel = imp_channelRoot.getChild(c).getText();
						let  channelIsInRootGrammar = false;
						for (let  rc = 0; rc < channelsRoot.getChildCount(); ++rc) {
							let  rootChannel = channelsRoot.getChild(rc).getText();
							if (rootChannel.equals(channel)) {
								channelIsInRootGrammar = true;
								break;
							}
						}
						if (!channelIsInRootGrammar) {
                            channelsRoot.addChild(imp_channelRoot.getChild(c).dupNode());
						}
					}
				}
			}

			// COPY TOKENS
			let  imp_tokensRoot = imp.ast.getFirstChildWithType(ANTLRParser.TOKENS_SPEC) as GrammarAST;
			if ( imp_tokensRoot!==null ) {
				rootGrammar.tool.log("grammar", "imported tokens: "+imp_tokensRoot.getChildren());
				if ( tokensRoot===null ) {
					tokensRoot = adaptor.create(ANTLRParser.TOKENS_SPEC, "TOKENS") as GrammarAST;
					tokensRoot.g = rootGrammar;
					root.insertChild(1, tokensRoot); // ^(GRAMMAR ID TOKENS...)
				}
				tokensRoot.addChildren(Arrays.asList(imp_tokensRoot.getChildren().toArray(new  Array<Tree>(0))));
			}

			let  all_actionRoots = new  Array<GrammarAST>();
			let  imp_actionRoots = imp.ast.getAllChildrenWithType(ANTLRParser.AT);
			if ( actionRoots!==null ) {
 all_actionRoots.addAll(actionRoots);
}

			all_actionRoots.addAll(imp_actionRoots);

			// COPY ACTIONS
			if ( imp_actionRoots!==null ) {
				let  namedActions =
					new  DoubleKeyMap<string, string, GrammarAST>();

				rootGrammar.tool.log("grammar", "imported actions: "+imp_actionRoots);
				for (let at of all_actionRoots) {
					let  scopeName = rootGrammar.getDefaultActionScope();
					let  scope: GrammarAST;
let  name: GrammarAST;
let  action: GrammarAST;
					if ( at.getChildCount()>2 ) { // must have a scope
						scope = at.getChild(0) as GrammarAST;
						scopeName = scope.getText();
						name = at.getChild(1) as GrammarAST;
						action = at.getChild(2) as GrammarAST;
					}
					else {
						name = at.getChild(0) as GrammarAST;
						action = at.getChild(1) as GrammarAST;
					}
					let  prevAction = namedActions.get(scopeName, name.getText());
					if ( prevAction===null ) {
						namedActions.put(scopeName, name.getText(), action);
					}
					else {
						if ( prevAction.g === at.g ) {
							rootGrammar.tool.errMgr.grammarError(ErrorType.ACTION_REDEFINITION,
												at.g.fileName, name.token, name.getText());
						}
						else {
							let  s1 = prevAction.getText();
							s1 = s1.substring(1, s1.length()-1);
							let  s2 = action.getText();
							s2 = s2.substring(1, s2.length()-1);
							let  combinedAction = "{"+s1 + '\n'+ s2+"}";
							prevAction.token.setText(combinedAction);
						}
					}
				}
				// at this point, we have complete list of combined actions,
				// some of which are already living in root grammar.
				// Merge in any actions not in root grammar into root's tree.
				for (let scopeName of namedActions.keySet()) {
					for (let name of namedActions.keySet(scopeName)) {
						let  action = namedActions.get(scopeName, name);
						rootGrammar.tool.log("grammar", action.g.name+" "+scopeName+":"+name+"="+action.getText());
						if ( action.g !== rootGrammar ) {
							root.insertChild(1, action.getParent());
						}
					}
				}
			}

			// COPY MODES
			// The strategy is to copy all the mode sections rules across to any
			// mode section in the new grammar with the same name or a new
			// mode section if no matching mode is resolved. Rules which are
			// already in the new grammar are ignored for copy. If the mode
			// section being added ends up empty it is not added to the merged
			// grammar.
            let  modes = imp.ast.getNodesWithType(ANTLRParser.MODE);
			if (modes !== null) {
				for (let m of modes) {
					rootGrammar.tool.log("grammar", "imported mode: " + m.toStringTree());
					let  name = m.getChild(0).getText();
					let  rootAlreadyHasMode = rootModeNames.contains(name);
					let  destinationAST = null;
					if (rootAlreadyHasMode) {
		                for (let m2 of rootModes) {
							if (m2.getChild(0).getText().equals(name)) {
                                destinationAST = m2;
								break;
							}
						}
					} else {
						destinationAST = m.dupNode();
						destinationAST.addChild(m.getChild(0).dupNode());
					}

					let  addedRules = 0;
					let  modeRules = m.getAllChildrenWithType(ANTLRParser.RULE);
					for (let r of modeRules) {
					    rootGrammar.tool.log("grammar", "imported rule: "+r.toStringTree());
						let  ruleName = r.getChild(0).getText();
					    let  rootAlreadyHasRule = rootRuleNames.contains(ruleName);
					    if (!rootAlreadyHasRule) {
						    destinationAST.addChild(r);
							addedRules++;
						    rootRuleNames.add(ruleName);
					    }
					}
					if (!rootAlreadyHasMode && addedRules > 0) {
						rootGrammar.ast.addChild(destinationAST);
						rootModeNames.add(name);
						rootModes.add(destinationAST);
					}
				}
			}

			// COPY RULES
			// Rules copied in the mode copy phase are not copied again.
			let  rules = imp.ast.getNodesWithType(ANTLRParser.RULE);
			if ( rules!==null ) {
				for (let r of rules) {
					rootGrammar.tool.log("grammar", "imported rule: "+r.toStringTree());
					let  name = r.getChild(0).getText();
					let  rootAlreadyHasRule = rootRuleNames.contains(name);
					if ( !rootAlreadyHasRule ) {
						RULES.addChild(r); // merge in if not overridden
						rootRuleNames.add(name);
					}
				}
			}

			let  optionsRoot = imp.ast.getFirstChildWithType(ANTLRParser.OPTIONS) as GrammarAST;
			if ( optionsRoot!==null ) {
				// suppress the warning if the options match the options specified
				// in the root grammar
				// https://github.com/antlr/antlr4/issues/707

				let  hasNewOption = false;
				for (let option of imp.ast.getOptions().entrySet()) {
					let  importOption = imp.ast.getOptionString(option.getKey());
					if (importOption === null) {
						continue;
					}

					let  rootOption = rootGrammar.ast.getOptionString(option.getKey());
					if (!importOption.equals(rootOption)) {
						hasNewOption = true;
						break;
					}
				}

				if (hasNewOption) {
					rootGrammar.tool.errMgr.grammarError(ErrorType.OPTIONS_IN_DELEGATE,
										optionsRoot.g.fileName, optionsRoot.token, imp.name);
				}
			}
		}
		rootGrammar.tool.log("grammar", "Grammar: "+rootGrammar.ast.toStringTree());
	}

	/** Build lexer grammar from combined grammar that looks like:
	 *
	 *  (COMBINED_GRAMMAR A
	 *      (tokens { X (= Y 'y'))
	 *      (OPTIONS (= x 'y'))
	 *      (@ members {foo})
	 *      (@ lexer header {package jj;})
	 *      (RULES (RULE .+)))
	 *
	 *  Move rules and actions to new tree, don't dup. Split AST apart.
	 *  We'll have this Grammar share token symbols later; don't generate
	 *  tokenVocab or tokens{} section.  Copy over named actions.
	 *
	 *  Side-effects: it removes children from GRAMMAR &amp; RULES nodes
	 *                in combined AST.  Anything cut out is dup'd before
	 *                adding to lexer to avoid "who's ur daddy" issues
	 */
	public  extractImplicitLexer(combinedGrammar: Grammar):  GrammarRootAST {
		let  combinedAST = combinedGrammar.ast;
		//tool.log("grammar", "before="+combinedAST.toStringTree());
		let  adaptor = new  GrammarASTAdaptor(combinedAST.token.getInputStream());
		let  elements = combinedAST.getChildren().toArray(new  Array<GrammarAST>(0));

		// MAKE A GRAMMAR ROOT and ID
		let  lexerName = combinedAST.getChild(0).getText()+"Lexer";
		let  lexerAST =
		    new  GrammarRootAST(new  CommonToken(ANTLRParser.GRAMMAR, "LEXER_GRAMMAR"), combinedGrammar.ast.tokenStream);
		lexerAST.grammarType = ANTLRParser.LEXER;
		lexerAST.token.setInputStream(combinedAST.token.getInputStream());
		lexerAST.addChild(adaptor.create(ANTLRParser.ID, lexerName) as GrammarAST);

		// COPY OPTIONS
		let  optionsRoot =
			combinedAST.getFirstChildWithType(ANTLRParser.OPTIONS) as GrammarAST;
		if ( optionsRoot!==null && optionsRoot.getChildCount()!==0 ) {
			let  lexerOptionsRoot = adaptor.dupNode(optionsRoot) as GrammarAST;
			lexerAST.addChild(lexerOptionsRoot);
			let  options = optionsRoot.getChildren().toArray(new  Array<GrammarAST>(0));
			for (let o of options) {
				let  optionName = o.getChild(0).getText();
				if ( Grammar.lexerOptions.contains(optionName) &&
					 !Grammar.doNotCopyOptionsToLexer.contains(optionName) )
				{
					let  optionTree = adaptor.dupTree(o) as GrammarAST;
					lexerOptionsRoot.addChild(optionTree);
					lexerAST.setOption(optionName, optionTree.getChild(1) as GrammarAST);
				}
			}
		}

		// COPY all named actions, but only move those with lexer:: scope
		let  actionsWeMoved = new  Array<GrammarAST>();
		for (let e of elements) {
			if ( e.getType()===ANTLRParser.AT ) {
				lexerAST.addChild(adaptor.dupTree(e) as Tree);
				if ( e.getChild(0).getText().equals("lexer") ) {
					actionsWeMoved.add(e);
				}
			}
		}

		for (let r of actionsWeMoved) {
			combinedAST.deleteChild( r );
		}

		let  combinedRulesRoot =
			combinedAST.getFirstChildWithType(ANTLRParser.RULES) as GrammarAST;
		if ( combinedRulesRoot===null ) {
 return lexerAST;
}


		// MOVE lexer rules

		let  lexerRulesRoot =
			adaptor.create(ANTLRParser.RULES, "RULES") as GrammarAST;
		lexerAST.addChild(lexerRulesRoot);
		let  rulesWeMoved = new  Array<GrammarAST>();
		let  rules: GrammarASTWithOptions[];
		if (combinedRulesRoot.getChildCount() > 0) {
			rules = combinedRulesRoot.getChildren().toArray(new  Array<GrammarASTWithOptions>(0));
		}
		else {
			rules = new  Array<GrammarASTWithOptions>(0);
		}

		for (let r of rules) {
			let  ruleName = r.getChild(0).getText();
			if (Grammar.isTokenName(ruleName)) {
				lexerRulesRoot.addChild(adaptor.dupTree(r) as Tree);
				rulesWeMoved.add(r);
			}
		}
		for (let r of rulesWeMoved) {
			combinedRulesRoot.deleteChild( r );
		}

		// Will track 'if' from IF : 'if' ; rules to avoid defining new token for 'if'
		let  litAliases =
			Grammar.getStringLiteralAliasesFromLexerRules(lexerAST);

		let  stringLiterals = combinedGrammar.getStringLiterals();
		// add strings from combined grammar (and imported grammars) into lexer
		// put them first as they are keywords; must resolve ambigs to these rules
//		tool.log("grammar", "strings from parser: "+stringLiterals);
		let  insertIndex = 0;
		nextLit:
		for (let lit of stringLiterals) {
			// if lexer already has a rule for literal, continue
			if ( litAliases!==null ) {
				for (let pair of litAliases) {
					let  litAST = pair.b;
					if ( lit.equals(litAST.getText()) ) {
 continue nextLit;
}

				}
			}
			// create for each literal: (RULE <uniquename> (BLOCK (ALT <lit>))
			let  rname = combinedGrammar.getStringLiteralLexerRuleName(lit);
			// can't use wizard; need special node types
			let  litRule = new  RuleAST(ANTLRParser.RULE);
			let  blk = new  BlockAST(ANTLRParser.BLOCK);
			let  alt = new  AltAST(ANTLRParser.ALT);
			let  slit = new  TerminalAST(new  CommonToken(ANTLRParser.STRING_LITERAL, lit));
			alt.addChild(slit);
			blk.addChild(alt);
			let  idToken = new  CommonToken(ANTLRParser.TOKEN_REF, rname);
			litRule.addChild(new  TerminalAST(idToken));
			litRule.addChild(blk);
			lexerRulesRoot.insertChild(insertIndex, litRule);
//			lexerRulesRoot.getChildren().add(0, litRule);
			lexerRulesRoot.freshenParentAndChildIndexes(); // reset indexes and set litRule parent

			// next literal will be added after the one just added
			insertIndex++;
		}

		// TODO: take out after stable if slow
		lexerAST.sanityCheckParentAndChildIndexes();
		combinedAST.sanityCheckParentAndChildIndexes();
//		tool.log("grammar", combinedAST.toTokenString());

        combinedGrammar.tool.log("grammar", "after extract implicit lexer ="+combinedAST.toStringTree());
        combinedGrammar.tool.log("grammar", "lexer ="+lexerAST.toStringTree());

		if ( lexerRulesRoot.getChildCount()===0 ) {
	return null;
}

		return lexerAST;
	}

}
