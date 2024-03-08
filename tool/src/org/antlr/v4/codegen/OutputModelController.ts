/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */


/* eslint-disable jsdoc/require-returns, jsdoc/require-param */


import { OutputModelFactory } from "./OutputModelFactory.js";
import { DefaultOutputModelFactory } from "./DefaultOutputModelFactory.js";
import { CodeGeneratorExtension } from "./CodeGeneratorExtension.js";
import { CodeGenerator } from "./CodeGenerator.js";
import { LeftRecursiveRuleAltInfo } from "../analysis/LeftRecursiveRuleAltInfo.js";
import { Action } from "./model/Action.js";
import { AltBlock } from "./model/AltBlock.js";
import { BaseListenerFile } from "./model/BaseListenerFile.js";
import { BaseVisitorFile } from "./model/BaseVisitorFile.js";
import { Choice } from "./model/Choice.js";
import { CodeBlockForAlt } from "./model/CodeBlockForAlt.js";
import { CodeBlockForOuterMostAlt } from "./model/CodeBlockForOuterMostAlt.js";
import { LabeledOp } from "./model/LabeledOp.js";
import { LeftRecursiveRuleFunction } from "./model/LeftRecursiveRuleFunction.js";
import { Lexer } from "./model/Lexer.js";
import { LexerFile } from "./model/LexerFile.js";
import { ListenerFile } from "./model/ListenerFile.js";
import { OutputModelObject } from "./model/OutputModelObject.js";
import { Parser } from "./model/Parser.js";
import { ParserFile } from "./model/ParserFile.js";
import { RuleActionFunction } from "./model/RuleActionFunction.js";
import { RuleFunction } from "./model/RuleFunction.js";
import { RuleSempredFunction } from "./model/RuleSempredFunction.js";
import { SrcOp } from "./model/SrcOp.js";
import { StarBlock } from "./model/StarBlock.js";
import { VisitorFile } from "./model/VisitorFile.js";
import { CodeBlock } from "./model/decl/CodeBlock.js";
import { Utils } from "../misc/Utils.js";
import { GrammarASTAdaptor } from "../parse/GrammarASTAdaptor.js";
import { Alternative } from "../tool/Alternative.js";
import { ErrorType } from "../tool/ErrorType.js";
import { Grammar } from "../tool/Grammar.js";
import { LeftRecursiveRule } from "../tool/LeftRecursiveRule.js";
import { Rule } from "../tool/Rule.js";
import { ActionAST } from "../tool/ast/ActionAST.js";
import { BlockAST } from "../tool/ast/BlockAST.js";
import { GrammarAST } from "../tool/ast/GrammarAST.js";
import { PredAST } from "../tool/ast/PredAST.js";



/** This receives events from SourceGenTriggers.g and asks factory to do work.
 *  Then runs extensions in order on resulting SrcOps to get final list.
 **/
export  class OutputModelController {
	/** Who does the work? Doesn't have to be CoreOutputModelFactory. */
	public  delegate:  OutputModelFactory;

	/** Post-processing CodeGeneratorExtension objects; done in order given. */
	public  extensions = new  Array<CodeGeneratorExtension>();

	/** While walking code in rules, this is set to the tree walker that
	 *  triggers actions.
	 */
	public  walker:  SourceGenTriggers;

	/** Context set by the SourceGenTriggers.g */
	public  codeBlockLevel = -1;
	public  treeLevel = -1;
	public  root:  OutputModelObject; // normally ParserFile, LexerFile, ...
	public  currentRule = new  Stack<RuleFunction>();
	public  currentOuterMostAlt:  Alternative;
	public  currentBlock:  CodeBlock;
	public  currentOuterMostAlternativeBlock:  CodeBlockForOuterMostAlt;

	public  constructor(factory: OutputModelFactory) {
		this.delegate = factory;
	}

	public  addExtension(ext: CodeGeneratorExtension):  void { this.extensions.add(ext); }

	/** Build a file with a parser containing rule functions. Use the
	 *  controller as factory in SourceGenTriggers so it triggers codegen
	 *  extensions too, not just the factory functions in this factory.
	 */
	public  buildParserOutputModel(header: boolean):  OutputModelObject {
		let  gen = this.delegate.getGenerator();
		let  file = this.parserFile(gen.getRecognizerFileName(header));
		this.setRoot(file);
		file.parser = this.parser(file);

		let  g = this.delegate.getGrammar();
		for (let r of g.rules.values()) {
			this.buildRuleFunction(file.parser, r);
		}

		return file;
	}

	public  buildLexerOutputModel(header: boolean):  OutputModelObject {
		let  gen = this.delegate.getGenerator();
		let  file = this.lexerFile(gen.getRecognizerFileName(header));
		this.setRoot(file);
		file.lexer = this.lexer(file);

		let  g = this.delegate.getGrammar();
		for (let r of g.rules.values()) {
			this.buildLexerRuleActions(file.lexer, r);
		}

		return file;
	}

	public  buildListenerOutputModel(header: boolean):  OutputModelObject {
		let  gen = this.delegate.getGenerator();
		return new  ListenerFile(this.delegate, gen.getListenerFileName(header));
	}

	public  buildBaseListenerOutputModel(header: boolean):  OutputModelObject {
		let  gen = this.delegate.getGenerator();
		return new  BaseListenerFile(this.delegate, gen.getBaseListenerFileName(header));
	}

	public  buildVisitorOutputModel(header: boolean):  OutputModelObject {
		let  gen = this.delegate.getGenerator();
		return new  VisitorFile(this.delegate, gen.getVisitorFileName(header));
	}

	public  buildBaseVisitorOutputModel(header: boolean):  OutputModelObject {
		let  gen = this.delegate.getGenerator();
		return new  BaseVisitorFile(this.delegate, gen.getBaseVisitorFileName(header));
	}

	public  parserFile(fileName: string):  ParserFile {
		let  f = this.delegate.parserFile(fileName);
		for (let ext of this.extensions) {
 f = ext.parserFile(f);
}

		return f;
	}

	public  parser(file: ParserFile):  Parser {
		let  p = this.delegate.parser(file);
		for (let ext of this.extensions) {
 p = ext.parser(p);
}

		return p;
	}

	public  lexerFile(fileName: string):  LexerFile {
		return new  LexerFile(this.delegate, fileName);
	}

	public  lexer(file: LexerFile):  Lexer {
		return new  Lexer(this.delegate, file);
	}

	/** Create RuleFunction per rule and update sempreds,actions of parser
	 *  output object with stuff found in r.
	 */
	public  buildRuleFunction(parser: Parser, r: Rule):  void {
		let  function = this.rule(r);
		parser.funcs.add(function);
		this.pushCurrentRule(function);
		function.fillNamedActions(this.delegate, r);

		if ( r instanceof LeftRecursiveRule ) {
			this.buildLeftRecursiveRuleFunction(r as LeftRecursiveRule,
										   function as LeftRecursiveRuleFunction);
		}
		else {
			this.buildNormalRuleFunction(r, function);
		}

		let  g = this.getGrammar();
		for (let a of r.actions) {
			if ( a instanceof PredAST ) {
				let  p = a as PredAST;
				let  rsf = parser.sempredFuncs.get(r);
				if ( rsf===null ) {
					rsf = new  RuleSempredFunction(this.delegate, r, function.ctxType);
					parser.sempredFuncs.put(r, rsf);
				}
				rsf.actions.put(g.sempreds.get(p), new  Action(this.delegate, p));
			}
		}

		this.popCurrentRule();
	}

	public  buildLeftRecursiveRuleFunction(r: LeftRecursiveRule, function: LeftRecursiveRuleFunction):  void {
		this.buildNormalRuleFunction(r, function);

		// now inject code to start alts
		let  gen = this.delegate.getGenerator();
		let  codegenTemplates = gen.getTemplates();

		// pick out alt(s) for primaries
		let  outerAlt = function.code.get(0) as CodeBlockForOuterMostAlt;
		let  primaryAltsCode = new  Array<CodeBlockForAlt>();
		let  primaryStuff = outerAlt.ops.get(0);
		if ( primaryStuff instanceof Choice ) {
			let  primaryAltBlock =  primaryStuff as Choice;
			primaryAltsCode.addAll(primaryAltBlock.alts);
		}
		else { // just a single alt I guess; no block
			primaryAltsCode.add(primaryStuff as CodeBlockForAlt);
		}

		// pick out alt(s) for op alts
		let  opAltStarBlock = outerAlt.ops.get(1) as StarBlock;
		let  altForOpAltBlock = opAltStarBlock.alts.get(0);
		let  opAltsCode = new  Array<CodeBlockForAlt>();
		let  opStuff = altForOpAltBlock.ops.get(0);
		if ( opStuff instanceof AltBlock ) {
			let  opAltBlock = opStuff as AltBlock;
			opAltsCode.addAll(opAltBlock.alts);
		}
		else { // just a single alt I guess; no block
			opAltsCode.add(opStuff as CodeBlockForAlt);
		}

		// Insert code in front of each primary alt to create specialized ctx if there was a label
		for (let  i = 0; i < primaryAltsCode.size(); i++) {
			let  altInfo = r.recPrimaryAlts.get(i);
			if ( altInfo.altLabel===null ) {
 continue;
}

			let  altActionST = codegenTemplates.getInstanceOf("recRuleReplaceContext");
			altActionST.add("ctxName", Utils.capitalize(altInfo.altLabel));
			let  altAction =
				new  Action(this.delegate, function.altLabelCtxs.get(altInfo.altLabel), altActionST);
			let  alt = primaryAltsCode.get(i);
			alt.insertOp(0, altAction);
		}

		// Insert code to set ctx.stop after primary block and before op * loop
		let  setStopTokenAST = codegenTemplates.getInstanceOf("recRuleSetStopToken");
		let  setStopTokenAction = new  Action(this.delegate, function.ruleCtx, setStopTokenAST);
		outerAlt.insertOp(1, setStopTokenAction);

		// Insert code to set _prevctx at start of * loop
		let  setPrevCtx = codegenTemplates.getInstanceOf("recRuleSetPrevCtx");
		let  setPrevCtxAction = new  Action(this.delegate, function.ruleCtx, setPrevCtx);
		opAltStarBlock.addIterationOp(setPrevCtxAction);

		// Insert code in front of each op alt to create specialized ctx if there was an alt label
		for (let  i = 0; i < opAltsCode.size(); i++) {
			let  altActionST: ST;
			let  altInfo = r.recOpAlts.getElement(i);
			let  templateName: string;
			if ( altInfo.altLabel!==null ) {
				templateName = "recRuleLabeledAltStartAction";
				altActionST = codegenTemplates.getInstanceOf(templateName);
				altActionST.add("currentAltLabel", altInfo.altLabel);
			}
			else {
				templateName = "recRuleAltStartAction";
				altActionST = codegenTemplates.getInstanceOf(templateName);
				altActionST.add("ctxName", Utils.capitalize(r.name));
			}
			altActionST.add("ruleName", r.name);
			// add label of any lr ref we deleted
			altActionST.add("label", altInfo.leftRecursiveRuleRefLabel);
			if (altActionST.impl.formalArguments.containsKey("isListLabel")) {
				altActionST.add("isListLabel", altInfo.isListLabel);
			}
			else {
 if (altInfo.isListLabel) {
				this.delegate.getGenerator().tool.errMgr.toolError(ErrorType.CODE_TEMPLATE_ARG_ISSUE, templateName, "isListLabel");
			}
}

			let  altAction =
				new  Action(this.delegate, function.altLabelCtxs.get(altInfo.altLabel), altActionST);
			let  alt = opAltsCode.get(i);
			alt.insertOp(0, altAction);
		}
	}

	public  buildNormalRuleFunction(r: Rule, function: RuleFunction):  void {
		let  gen = this.delegate.getGenerator();
		// TRIGGER factory functions for rule alts, elements
		let  adaptor = new  GrammarASTAdaptor(r.ast.token.getInputStream());
		let  blk = r.ast.getFirstChildWithType(ANTLRParser.BLOCK) as GrammarAST;
		let  nodes = new  CommonTreeNodeStream(adaptor,blk);
		this.walker = new  SourceGenTriggers(nodes, this);
		try {
			// walk AST of rule alts/elements
			function.code = DefaultOutputModelFactory.list(this.walker.block(null, null));
			function.hasLookaheadBlock = this.walker.hasLookaheadBlock;
		} catch (e) {
if (e instanceof org.antlr.runtime.RecognitionException){
			e.printStackTrace(System.err);
		} else {
	throw e;
	}
}

		function.ctxType = gen.getTarget().getRuleFunctionContextStructName(function);

		function.postamble = this.rulePostamble(function, r);
	}

	public  buildLexerRuleActions(lexer: Lexer, /* final */  r: Rule):  void {
		if (r.actions.isEmpty()) {
			return;
		}

		let  gen = this.delegate.getGenerator();
		let  g = this.delegate.getGrammar();
		let  ctxType = gen.getTarget().getRuleFunctionContextStructName(r);
		let  raf = lexer.actionFuncs.get(r);
		if ( raf===null ) {
			raf = new  RuleActionFunction(this.delegate, r, ctxType);
		}

		for (let a of r.actions) {
			if ( a instanceof PredAST ) {
				let  p = a as PredAST;
				let  rsf = lexer.sempredFuncs.get(r);
				if ( rsf===null ) {
					rsf = new  RuleSempredFunction(this.delegate, r, ctxType);
					lexer.sempredFuncs.put(r, rsf);
				}
				rsf.actions.put(g.sempreds.get(p), new  Action(this.delegate, p));
			}
			else {
 if ( a.getType()=== ANTLRParser.ACTION ) {
				raf.actions.put(g.lexerActions.get(a), new  Action(this.delegate, a));
			}
}

		}

		if (!raf.actions.isEmpty() && !lexer.actionFuncs.containsKey(r)) {
			// only add to lexer if the function actually contains actions
			lexer.actionFuncs.put(r, raf);
		}
	}

	public  rule(r: Rule):  RuleFunction {
		let  rf = this.delegate.rule(r);
		for (let ext of this.extensions) {
 rf = ext.rule(rf);
}

		return rf;
	}

	public  rulePostamble(function: RuleFunction, r: Rule):  Array<SrcOp> {
		let  ops = this.delegate.rulePostamble(function, r);
		for (let ext of this.extensions) {
 ops = ext.rulePostamble(ops);
}

		return ops;
	}

	public  getGrammar():  Grammar { return this.delegate.getGrammar(); }

	public  getGenerator():  CodeGenerator { return this.delegate.getGenerator(); }

	public  alternative(alt: Alternative, outerMost: boolean):  CodeBlockForAlt {
		let  blk = this.delegate.alternative(alt, outerMost);
		if ( outerMost ) {
			this.currentOuterMostAlternativeBlock = blk as CodeBlockForOuterMostAlt;
		}
		for (let ext of this.extensions) {
 blk = ext.alternative(blk, outerMost);
}

		return blk;
	}

	public  finishAlternative(blk: CodeBlockForAlt, ops: Array<SrcOp>,
											 outerMost: boolean):  CodeBlockForAlt
	{
		blk = this.delegate.finishAlternative(blk, ops);
		for (let ext of this.extensions) {
 blk = ext.finishAlternative(blk, outerMost);
}

		return blk;
	}

	public  ruleRef(ID: GrammarAST, label: GrammarAST, args: GrammarAST):  Array<SrcOp> {
		let  ops = this.delegate.ruleRef(ID, label, args);
		for (let ext of this.extensions) {
			ops = ext.ruleRef(ops);
		}
		return ops;
	}

	public  tokenRef(ID: GrammarAST, label: GrammarAST, args: GrammarAST):  Array<SrcOp>
	{
		let  ops = this.delegate.tokenRef(ID, label, args);
		for (let ext of this.extensions) {
			ops = ext.tokenRef(ops);
		}
		return ops;
	}

	public  stringRef(ID: GrammarAST, label: GrammarAST):  Array<SrcOp> {
		let  ops = this.delegate.stringRef(ID, label);
		for (let ext of this.extensions) {
			ops = ext.stringRef(ops);
		}
		return ops;
	}

	/** (A|B|C) possibly with ebnfRoot and label */
	public  set(setAST: GrammarAST, labelAST: GrammarAST, invert: boolean):  Array<SrcOp> {
		let  ops = this.delegate.set(setAST, labelAST, invert);
		for (let ext of this.extensions) {
			ops = ext.set(ops);
		}
		return ops;
	}

	public  epsilon(alt: Alternative, outerMost: boolean):  CodeBlockForAlt {
		let  blk = this.delegate.epsilon(alt, outerMost);
		for (let ext of this.extensions) {
 blk = ext.epsilon(blk);
}

		return blk;
	}

	public  wildcard(ast: GrammarAST, labelAST: GrammarAST):  Array<SrcOp> {
		let  ops = this.delegate.wildcard(ast, labelAST);
		for (let ext of this.extensions) {
			ops = ext.wildcard(ops);
		}
		return ops;
	}

	public  action(ast: ActionAST):  Array<SrcOp> {
		let  ops = this.delegate.action(ast);
		for (let ext of this.extensions) {
 ops = ext.action(ops);
}

		return ops;
	}

	public  sempred(ast: ActionAST):  Array<SrcOp> {
		let  ops = this.delegate.sempred(ast);
		for (let ext of this.extensions) {
 ops = ext.sempred(ops);
}

		return ops;
	}

	public  getChoiceBlock(blkAST: BlockAST, alts: Array<CodeBlockForAlt>, label: GrammarAST):  Choice {
		let  c = this.delegate.getChoiceBlock(blkAST, alts, label);
		for (let ext of this.extensions) {
 c = ext.getChoiceBlock(c);
}

		return c;
	}

	public  getEBNFBlock(ebnfRoot: GrammarAST, alts: Array<CodeBlockForAlt>):  Choice {
		let  c = this.delegate.getEBNFBlock(ebnfRoot, alts);
		for (let ext of this.extensions) {
 c = ext.getEBNFBlock(c);
}

		return c;
	}

	public  needsImplicitLabel(ID: GrammarAST, op: LabeledOp):  boolean {
		let  needs = this.delegate.needsImplicitLabel(ID, op);
		for (let ext of this.extensions) {
 needs |= ext.needsImplicitLabel(ID, op);
}

		return needs;
	}

	public  getRoot():  OutputModelObject { return this.root; }

	public  setRoot(root: OutputModelObject):  void { this.root = root; }

	public  getCurrentRuleFunction():  RuleFunction {
		if ( !this.currentRule.isEmpty() ) {
	return this.currentRule.peek();
}

		return null;
	}

	public  pushCurrentRule(r: RuleFunction):  void { this.currentRule.push(r); }

	public  popCurrentRule():  RuleFunction {
		if ( !this.currentRule.isEmpty() ) {
 return this.currentRule.pop();
}

		return null;
	}

	public  getCurrentOuterMostAlt():  Alternative { return this.currentOuterMostAlt; }

	public  setCurrentOuterMostAlt(currentOuterMostAlt: Alternative):  void { this.currentOuterMostAlt = currentOuterMostAlt; }

	public  setCurrentBlock(blk: CodeBlock):  void {
		this.currentBlock = blk;
	}

	public  getCurrentBlock():  CodeBlock {
		return this.currentBlock;
	}

	public  setCurrentOuterMostAlternativeBlock(currentOuterMostAlternativeBlock: CodeBlockForOuterMostAlt):  void {
		this.currentOuterMostAlternativeBlock = currentOuterMostAlternativeBlock;
	}

	public  getCurrentOuterMostAlternativeBlock():  CodeBlockForOuterMostAlt {
		return this.currentOuterMostAlternativeBlock;
	}

	public  getCodeBlockLevel():  number { return this.codeBlockLevel; }
}
