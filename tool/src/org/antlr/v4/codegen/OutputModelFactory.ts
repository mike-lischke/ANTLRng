/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

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

export interface OutputModelFactory {
    getGrammar(): Grammar;

    getGenerator(): CodeGenerator;

    setController(controller: OutputModelController): void;

    getController(): OutputModelController;

    parserFile(fileName: string): ParserFile;

    parser(file: ParserFile): Parser;

    lexerFile(fileName: string): LexerFile;

    lexer(file: LexerFile): Lexer;

    rule(r: Rule): RuleFunction;

    rulePostamble(func: RuleFunction, r: Rule): SrcOp[];

    // ELEMENT TRIGGERS

    alternative(alt: Alternative, outerMost: boolean): CodeBlockForAlt;

    finishAlternative(blk: CodeBlockForAlt, ops: SrcOp[]): CodeBlockForAlt;

    epsilon(alt: Alternative, outerMost: boolean): CodeBlockForAlt;

    ruleRef(ID: GrammarAST, label: GrammarAST, args: GrammarAST): SrcOp[];

    tokenRef(ID: GrammarAST, label: GrammarAST, args: GrammarAST): SrcOp[];

    stringRef(ID: GrammarAST, label: GrammarAST): SrcOp[];

    set(setAST: GrammarAST, label: GrammarAST, invert: boolean): SrcOp[];

    wildcard(ast: GrammarAST, labelAST: GrammarAST): SrcOp[];

    action(ast: ActionAST): SrcOp[];

    sempred(ast: ActionAST): SrcOp[];

    getChoiceBlock(blkAST: BlockAST, alts: CodeBlockForAlt[], label: GrammarAST): Choice;

    getEBNFBlock(ebnfRoot: GrammarAST, alts: CodeBlockForAlt[]): Choice;

    getLL1ChoiceBlock(blkAST: BlockAST, alts: CodeBlockForAlt[]): Choice;

    getComplexChoiceBlock(blkAST: BlockAST, alts: CodeBlockForAlt[]): Choice;

    getLL1EBNFBlock(ebnfRoot: GrammarAST, alts: CodeBlockForAlt[]): Choice;

    getComplexEBNFBlock(ebnfRoot: GrammarAST, alts: CodeBlockForAlt[]): Choice;

    getLL1Test(look: IntervalSet, blkAST: GrammarAST): SrcOp[];

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
