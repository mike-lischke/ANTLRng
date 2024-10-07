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

    public parserFile(fileName: string): ParserFile { return null; }


    public parser(file: ParserFile): Parser { return null; }


    public rule(r: Rule): RuleFunction { return null; }


    public rulePostamble(function: RuleFunction, r: Rule): Array<SrcOp> { return null; }


    public lexerFile(fileName: string): LexerFile { return null; }


    public lexer(file: LexerFile): Lexer { return null; }

    // ALTERNATIVES / ELEMENTS


    public alternative(alt: Alternative, outerMost: boolean): CodeBlockForAlt { return null; }


    public finishAlternative(blk: CodeBlockForAlt, ops: Array<SrcOp>): CodeBlockForAlt { return blk; }


    public epsilon(alt: Alternative, outerMost: boolean): CodeBlockForAlt { return null; }


    public ruleRef(ID: GrammarAST, label: GrammarAST, args: GrammarAST): Array<SrcOp> { return null; }


    public tokenRef(ID: GrammarAST, label: GrammarAST, args: GrammarAST): Array<SrcOp> { return null; }


    public stringRef(ID: GrammarAST, label: GrammarAST): Array<SrcOp> { return this.tokenRef(ID, label, null); }


    public set(setAST: GrammarAST, label: GrammarAST, invert: boolean): Array<SrcOp> { return null; }


    public wildcard(ast: GrammarAST, labelAST: GrammarAST): Array<SrcOp> { return null; }

    // ACTIONS


    public action(ast: ActionAST): Array<SrcOp> { return null; }


    public sempred(ast: ActionAST): Array<SrcOp> { return null; }

    // BLOCKS


    public getChoiceBlock(blkAST: BlockAST, alts: Array<CodeBlockForAlt>, label: GrammarAST): Choice { return null; }


    public getEBNFBlock(ebnfRoot: GrammarAST, alts: Array<CodeBlockForAlt>): Choice { return null; }


    public getLL1ChoiceBlock(blkAST: BlockAST, alts: Array<CodeBlockForAlt>): Choice { return null; }


    public getComplexChoiceBlock(blkAST: BlockAST, alts: Array<CodeBlockForAlt>): Choice { return null; }


    public getLL1EBNFBlock(ebnfRoot: GrammarAST, alts: Array<CodeBlockForAlt>): Choice { return null; }


    public getComplexEBNFBlock(ebnfRoot: GrammarAST, alts: Array<CodeBlockForAlt>): Choice { return null; }


    public getLL1Test(look: IntervalSet, blkAST: GrammarAST): Array<SrcOp> { return null; }


    public needsImplicitLabel(ID: GrammarAST, op: LabeledOp): boolean { return false; }
}
