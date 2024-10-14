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
    getGrammar(): Grammar | null;

    getGenerator(): CodeGenerator | null;

    setController(controller: OutputModelController): void;

    getController(): OutputModelController | null;

    parserFile(fileName: string): ParserFile | null;

    parser(file: ParserFile): Parser | null;

    lexerFile(fileName: string): LexerFile | null;

    lexer(file: LexerFile): Lexer | null;

    rule(r: Rule): RuleFunction | null;

    rulePostamble(func: RuleFunction, r: Rule): SrcOp[] | null;

    // ELEMENT TRIGGERS

    alternative(alt: Alternative, outerMost: boolean): CodeBlockForAlt | null;

    finishAlternative(blk: CodeBlockForAlt, ops: SrcOp[]): CodeBlockForAlt;

    epsilon(alt: Alternative, outerMost: boolean): CodeBlockForAlt | null;

    ruleRef(ID: GrammarAST, label: GrammarAST | null, args: GrammarAST | null): SrcOp[] | null;

    tokenRef(ID: GrammarAST, label: GrammarAST | null, args: GrammarAST | null): SrcOp[] | null;

    stringRef(ID: GrammarAST, label: GrammarAST | null): SrcOp[] | null;

    set(setAST: GrammarAST, label: GrammarAST | null, invert: boolean): SrcOp[] | null;

    wildcard(ast: GrammarAST, labelAST: GrammarAST | null): SrcOp[] | null;

    action(ast: ActionAST): SrcOp[] | null;

    sempred(ast: ActionAST): SrcOp[] | null;

    getChoiceBlock(blkAST: BlockAST, alts: CodeBlockForAlt[], label: GrammarAST | null): Choice | null;

    getEBNFBlock(ebnfRoot: GrammarAST | null, alts: CodeBlockForAlt[]): Choice | null;

    getLL1ChoiceBlock(blkAST: BlockAST, alts: CodeBlockForAlt[]): Choice | null;

    getComplexChoiceBlock(blkAST: BlockAST, alts: CodeBlockForAlt[]): Choice | null;

    getLL1EBNFBlock(ebnfRoot: GrammarAST, alts: CodeBlockForAlt[]): Choice | null;

    getComplexEBNFBlock(ebnfRoot: GrammarAST, alts: CodeBlockForAlt[]): Choice | null;

    getLL1Test(look: IntervalSet, blkAST: GrammarAST): SrcOp[] | null;

    needsImplicitLabel(ID: GrammarAST, op: LabeledOp): boolean;

    // CONTEXT INFO

    getRoot(): OutputModelObject | null;

    getCurrentRuleFunction(): RuleFunction | undefined;

    getCurrentOuterMostAlt(): Alternative | null;

    getCurrentBlock(): CodeBlock | null;

    getCurrentOuterMostAlternativeBlock(): CodeBlockForOuterMostAlt | null;

    getCodeBlockLevel(): number;

    getTreeLevel(): number;

}
