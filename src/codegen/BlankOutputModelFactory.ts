/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { IntervalSet } from "antlr4ng";

import { Alternative } from "../tool/Alternative.js";
import type { Grammar } from "../tool/Grammar.js";
import { Rule } from "../tool/Rule.js";
import { ActionAST } from "../tool/ast/ActionAST.js";
import { BlockAST } from "../tool/ast/BlockAST.js";
import { GrammarAST } from "../tool/ast/GrammarAST.js";
import type { CodeGenerator } from "./CodeGenerator.js";
import type { OutputModelController } from "./OutputModelController.js";
import { OutputModelFactory } from "./OutputModelFactory.js";
import { Choice } from "./model/Choice.js";
import { CodeBlockForAlt } from "./model/CodeBlockForAlt.js";
import type { CodeBlockForOuterMostAlt } from "./model/CodeBlockForOuterMostAlt.js";
import { LabeledOp } from "./model/LabeledOp.js";
import { Lexer } from "./model/Lexer.js";
import { LexerFile } from "./model/LexerFile.js";
import type { OutputModelObject } from "./model/OutputModelObject.js";
import { Parser } from "./model/Parser.js";
import { ParserFile } from "./model/ParserFile.js";
import { RuleFunction } from "./model/RuleFunction.js";
import { SrcOp } from "./model/SrcOp.js";
import type { CodeBlock } from "./model/decl/CodeBlock.js";

export abstract class BlankOutputModelFactory implements OutputModelFactory {
    public getGrammar(): Grammar | null {
        return null;
    }

    public getGenerator(): CodeGenerator | null {
        return null;
    }

    public setController(controller: OutputModelController): void { /**/ }

    public getController(): OutputModelController | null {
        return null;
    }

    public parserFile(fileName: string): ParserFile | null {
        return null;
    }

    public parser(file: ParserFile): Parser | null {
        return null;
    }

    public rule(r: Rule): RuleFunction | null {
        return null;
    }

    public rulePostamble(ruleFunction: RuleFunction, r: Rule): SrcOp[] | null {
        return null;
    }

    public lexerFile(fileName: string): LexerFile | null {
        return null;
    }

    public lexer(file: LexerFile): Lexer | null {
        return null;
    }

    // ALTERNATIVES / ELEMENTS

    public alternative(alt: Alternative, outerMost: boolean): CodeBlockForAlt | null {
        return null;
    }

    public finishAlternative(blk: CodeBlockForAlt, ops: SrcOp[]): CodeBlockForAlt {
        return blk;
    }

    public epsilon(alt: Alternative, outerMost: boolean): CodeBlockForAlt | null {
        return null;
    }

    public ruleRef(id: GrammarAST, label: GrammarAST, args: GrammarAST): SrcOp[] | null {
        return null;
    }

    public tokenRef(id: GrammarAST, label: GrammarAST, args: GrammarAST | null): SrcOp[] | null {
        return null;
    }

    public stringRef(id: GrammarAST, label: GrammarAST): SrcOp[] | null {
        return this.tokenRef(id, label, null);
    }

    public set(setAST: GrammarAST, label: GrammarAST, invert: boolean): SrcOp[] | null {
        return null;
    }

    public wildcard(ast: GrammarAST, labelAST: GrammarAST): SrcOp[] | null {
        return null;
    };

    // ACTIONS

    public action(ast: ActionAST): SrcOp[] | null {
        return null;
    }

    public sempred(ast: ActionAST): SrcOp[] | null {
        return null;
    };

    // BLOCKS

    public getChoiceBlock(blkAST: BlockAST, alts: CodeBlockForAlt[], label: GrammarAST): Choice | null {
        return null;
    }

    public getEBNFBlock(ebnfRoot: GrammarAST, alts: CodeBlockForAlt[]): Choice | null {
        return null;
    }

    public getLL1ChoiceBlock(blkAST: BlockAST, alts: CodeBlockForAlt[]): Choice | null {
        return null;
    }

    public getComplexChoiceBlock(blkAST: BlockAST, alts: CodeBlockForAlt[]): Choice | null {
        return null;
    }

    public getLL1EBNFBlock(ebnfRoot: GrammarAST, alts: CodeBlockForAlt[]): Choice | null {
        return null;
    }

    public getComplexEBNFBlock(ebnfRoot: GrammarAST, alts: CodeBlockForAlt[]): Choice | null {
        return null;
    }

    public getLL1Test(look: IntervalSet, blkAST: GrammarAST): SrcOp[] | null {
        return null;
    }

    public needsImplicitLabel(id: GrammarAST, op: LabeledOp): boolean {
        return false;
    }

    // CONTEXT INFO

    public getRoot(): OutputModelObject | null {
        return null;
    }

    public getCurrentRuleFunction(): RuleFunction | undefined {
        return undefined;
    }

    public getCurrentOuterMostAlt(): Alternative | null {
        return null;
    }

    public getCurrentBlock(): CodeBlock | null {
        return null;
    }

    public getCurrentOuterMostAlternativeBlock(): CodeBlockForOuterMostAlt | null {
        return null;
    }

    public getCodeBlockLevel(): number {
        return -1;
    }

    public getTreeLevel(): number {
        return -1;
    }

}
