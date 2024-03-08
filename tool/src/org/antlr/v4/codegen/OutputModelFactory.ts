/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */


/* eslint-disable jsdoc/require-returns, jsdoc/require-param */


import { OutputModelController } from "./OutputModelController.js";
import { CodeGenerator } from "./CodeGenerator.js";
import { Choice } from "./model/Choice.js";
import { CodeBlockForAlt } from "./model/CodeBlockForAlt.js";
import { CodeBlockForOuterMostAlt } from "./model/CodeBlockForOuterMostAlt.js";
import { LabeledOp } from "./model/LabeledOp.js";
import { Lexer } from "./model/Lexer.js";
import { LexerFile } from "./model/LexerFile.js";
import { OutputModelObject } from "./model/OutputModelObject.js";
import { Parser } from "./model/Parser.js";
import { ParserFile } from "./model/ParserFile.js";
import { RuleFunction } from "./model/RuleFunction.js";
import { SrcOp } from "./model/SrcOp.js";
import { CodeBlock } from "./model/decl/CodeBlock.js";
import { IntervalSet } from "antlr4ng";
import { Alternative } from "../tool/Alternative.js";
import { Grammar } from "../tool/Grammar.js";
import { Rule } from "../tool/Rule.js";
import { ActionAST } from "../tool/ast/ActionAST.js";
import { BlockAST } from "../tool/ast/BlockAST.js";
import { GrammarAST } from "../tool/ast/GrammarAST.js";



 interface OutputModelFactory {
	  getGrammar(): Grammar;

	  getGenerator(): CodeGenerator;

	  setController(controller: OutputModelController): void;

	  getController(): OutputModelController;

	  parserFile(fileName: string): ParserFile;

	  parser(file: ParserFile): Parser;

	  lexerFile(fileName: string): LexerFile;

	  lexer(file: LexerFile): Lexer;

	  rule(r: Rule): RuleFunction;

	  rulePostamble(function: RuleFunction, r: Rule): Array<SrcOp>;

	// ELEMENT TRIGGERS

	  alternative(alt: Alternative, outerMost: boolean): CodeBlockForAlt;

	  finishAlternative(blk: CodeBlockForAlt, ops: Array<SrcOp>): CodeBlockForAlt;

	  epsilon(alt: Alternative, outerMost: boolean): CodeBlockForAlt;

	  ruleRef(ID: GrammarAST, label: GrammarAST, args: GrammarAST): Array<SrcOp>;

	  tokenRef(ID: GrammarAST, label: GrammarAST, args: GrammarAST): Array<SrcOp>;

	  stringRef(ID: GrammarAST, label: GrammarAST): Array<SrcOp>;

	  set(setAST: GrammarAST, label: GrammarAST, invert: boolean): Array<SrcOp>;

	  wildcard(ast: GrammarAST, labelAST: GrammarAST): Array<SrcOp>;

	  action(ast: ActionAST): Array<SrcOp>;

	  sempred(ast: ActionAST): Array<SrcOp>;

	  getChoiceBlock(blkAST: BlockAST, alts: Array<CodeBlockForAlt>, label: GrammarAST): Choice;

	  getEBNFBlock(ebnfRoot: GrammarAST, alts: Array<CodeBlockForAlt>): Choice;

	  getLL1ChoiceBlock(blkAST: BlockAST, alts: Array<CodeBlockForAlt>): Choice;

	  getComplexChoiceBlock(blkAST: BlockAST, alts: Array<CodeBlockForAlt>): Choice;

	  getLL1EBNFBlock(ebnfRoot: GrammarAST, alts: Array<CodeBlockForAlt>): Choice;

	  getComplexEBNFBlock(ebnfRoot: GrammarAST, alts: Array<CodeBlockForAlt>): Choice;

	  getLL1Test(look: IntervalSet, blkAST: GrammarAST): Array<SrcOp>;

	  needsImplicitLabel(ID: GrammarAST, op: LabeledOp): boolean;

	// CONTEXT INFO

	  getRoot(): OutputModelObject;

	  getCurrentRuleFunction(): RuleFunction;

	  getCurrentOuterMostAlt(): Alternative;

	  getCurrentBlock(): CodeBlock;

	  getCurrentOuterMostAlternativeBlock(): CodeBlockForOuterMostAlt;

	  getCodeBlockLevel(): number;

	  getTreeLevel(): number;

}
