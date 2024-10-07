/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */



import { OutputModelFactory } from "./OutputModelFactory.js";
import { Choice } from "./model/Choice.js";
import { CodeBlockForAlt } from "./model/CodeBlockForAlt.js";
import { LabeledOp } from "./model/LabeledOp.js";
import { Lexer } from "./model/Lexer.js";
import { LexerFile } from "./model/LexerFile.js";
import { Parser } from "./model/Parser.js";
import { ParserFile } from "./model/ParserFile.js";
import { RuleFunction } from "./model/RuleFunction.js";
import { SrcOp } from "./model/SrcOp.js";
import { IntervalSet } from "antlr4ng";
import { Alternative } from "../tool/Alternative.js";
import { Rule } from "../tool/Rule.js";
import { ActionAST } from "../tool/ast/ActionAST.js";
import { BlockAST } from "../tool/ast/BlockAST.js";
import { GrammarAST } from "../tool/ast/GrammarAST.js";



export abstract class BlankOutputModelFactory implements OutputModelFactory {
    @Override
    public parserFile(fileName: string): ParserFile { return null; }

    @Override
    public parser(file: ParserFile): Parser { return null; }

    @Override
    public rule(r: Rule): RuleFunction { return null; }

    @Override
    public rulePostamble(function: RuleFunction, r: Rule): Array<SrcOp> { return null; }

    @Override
    public lexerFile(fileName: string): LexerFile { return null; }

    @Override
    public lexer(file: LexerFile): Lexer { return null; }

    // ALTERNATIVES / ELEMENTS

    @Override
    public alternative(alt: Alternative, outerMost: boolean): CodeBlockForAlt { return null; }

    @Override
    public finishAlternative(blk: CodeBlockForAlt, ops: Array<SrcOp>): CodeBlockForAlt { return blk; }

    @Override
    public epsilon(alt: Alternative, outerMost: boolean): CodeBlockForAlt { return null; }

    @Override
    public ruleRef(ID: GrammarAST, label: GrammarAST, args: GrammarAST): Array<SrcOp> { return null; }

    @Override
    public tokenRef(ID: GrammarAST, label: GrammarAST, args: GrammarAST): Array<SrcOp> { return null; }

    @Override
    public stringRef(ID: GrammarAST, label: GrammarAST): Array<SrcOp> { return this.tokenRef(ID, label, null); }

    @Override
    public set(setAST: GrammarAST, label: GrammarAST, invert: boolean): Array<SrcOp> { return null; }

    @Override
    public wildcard(ast: GrammarAST, labelAST: GrammarAST): Array<SrcOp> { return null; }

    // ACTIONS

    @Override
    public action(ast: ActionAST): Array<SrcOp> { return null; }

    @Override
    public sempred(ast: ActionAST): Array<SrcOp> { return null; }

    // BLOCKS

    @Override
    public getChoiceBlock(blkAST: BlockAST, alts: Array<CodeBlockForAlt>, label: GrammarAST): Choice { return null; }

    @Override
    public getEBNFBlock(ebnfRoot: GrammarAST, alts: Array<CodeBlockForAlt>): Choice { return null; }

    @Override
    public getLL1ChoiceBlock(blkAST: BlockAST, alts: Array<CodeBlockForAlt>): Choice { return null; }

    @Override
    public getComplexChoiceBlock(blkAST: BlockAST, alts: Array<CodeBlockForAlt>): Choice { return null; }

    @Override
    public getLL1EBNFBlock(ebnfRoot: GrammarAST, alts: Array<CodeBlockForAlt>): Choice { return null; }

    @Override
    public getComplexEBNFBlock(ebnfRoot: GrammarAST, alts: Array<CodeBlockForAlt>): Choice { return null; }

    @Override
    public getLL1Test(look: IntervalSet, blkAST: GrammarAST): Array<SrcOp> { return null; }

    @Override
    public needsImplicitLabel(ID: GrammarAST, op: LabeledOp): boolean { return false; }
}
