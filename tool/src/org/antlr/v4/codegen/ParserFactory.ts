/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { DecisionState, IntervalSet, PlusLoopbackState, StarLoopEntryState } from "antlr4ng";

import { AnalysisPipeline } from "../analysis/AnalysisPipeline.js";
import { Alternative } from "../tool/Alternative.js";
import { LeftRecursiveRule } from "../tool/LeftRecursiveRule.js";
import { Rule } from "../tool/Rule.js";
import { ActionAST } from "../tool/ast/ActionAST.js";
import { BlockAST } from "../tool/ast/BlockAST.js";
import { GrammarAST } from "../tool/ast/GrammarAST.js";
import { TerminalAST } from "../tool/ast/TerminalAST.js";
import { CodeGenerator } from "./CodeGenerator.js";
import { DefaultOutputModelFactory } from "./DefaultOutputModelFactory.js";
import { Action } from "./model/Action.js";
import { AddToLabelList } from "./model/AddToLabelList.js";
import { AltBlock } from "./model/AltBlock.js";
import { Choice } from "./model/Choice.js";
import { CodeBlockForAlt } from "./model/CodeBlockForAlt.js";
import { CodeBlockForOuterMostAlt } from "./model/CodeBlockForOuterMostAlt.js";
import { InvokeRule } from "./model/InvokeRule.js";
import { LL1AltBlock } from "./model/LL1AltBlock.js";
import { LL1OptionalBlock } from "./model/LL1OptionalBlock.js";
import { LL1OptionalBlockSingleAlt } from "./model/LL1OptionalBlockSingleAlt.js";
import { LL1PlusBlockSingleAlt } from "./model/LL1PlusBlockSingleAlt.js";
import { LL1StarBlockSingleAlt } from "./model/LL1StarBlockSingleAlt.js";
import { LabeledOp } from "./model/LabeledOp.js";
import { LeftRecursiveRuleFunction } from "./model/LeftRecursiveRuleFunction.js";
import { MatchNotSet } from "./model/MatchNotSet.js";
import { MatchSet } from "./model/MatchSet.js";
import { MatchToken } from "./model/MatchToken.js";
import { OptionalBlock } from "./model/OptionalBlock.js";
import { Parser } from "./model/Parser.js";
import { ParserFile } from "./model/ParserFile.js";
import { PlusBlock } from "./model/PlusBlock.js";
import { RuleFunction } from "./model/RuleFunction.js";
import { SemPred } from "./model/SemPred.js";
import { SrcOp } from "./model/SrcOp.js";
import { StarBlock } from "./model/StarBlock.js";
import { TestSetInline } from "./model/TestSetInline.js";
import { Wildcard } from "./model/Wildcard.js";
import { Decl } from "./model/decl/Decl.js";
import { RuleContextDecl } from "./model/decl/RuleContextDecl.js";
import { TokenDecl } from "./model/decl/TokenDecl.js";
import { TokenListDecl } from "./model/decl/TokenListDecl.js";

export class ParserFactory extends DefaultOutputModelFactory {
    public constructor(gen: CodeGenerator) { super(gen); }

    public override parserFile(fileName: string): ParserFile {
        return new ParserFile(this, fileName);
    }

    public override parser(file: ParserFile): Parser {
        return new Parser(this, file);
    }

    public override rule(r: Rule): RuleFunction {
        if (r instanceof LeftRecursiveRule) {
            return new LeftRecursiveRuleFunction(this, r);
        }
        else {
            const rf = new RuleFunction(this, r);

            return rf;
        }
    }

    public override epsilon(alt: Alternative, outerMost: boolean): CodeBlockForAlt {
        return this.alternative(alt, outerMost);
    }

    public override alternative(alt: Alternative, outerMost: boolean): CodeBlockForAlt {
        if (outerMost) {
            return new CodeBlockForOuterMostAlt(this, alt);
        }

        return new CodeBlockForAlt(this);
    }

    public override finishAlternative(blk: CodeBlockForAlt, ops: SrcOp[]): CodeBlockForAlt {
        blk.ops = ops;

        return blk;
    }

    public override action(ast: ActionAST): SrcOp[] { return ParserFactory.list(new Action(this, ast)); }

    public override sempred(ast: ActionAST): SrcOp[] { return ParserFactory.list(new SemPred(this, ast)); }

    public override ruleRef(ID: GrammarAST, label: GrammarAST, args: GrammarAST): SrcOp[] {
        const invokeOp = new InvokeRule(this, ID, label);
        // If no manual label and action refs as token/rule not label, we need to define implicit label
        if (this.controller.needsImplicitLabel(ID, invokeOp)) {
            this.defineImplicitLabel(ID, invokeOp);
        }

        const listLabelOp = this.getAddToListOpIfListLabelPresent(invokeOp, label);

        return ParserFactory.list(invokeOp, listLabelOp);
    }

    public override tokenRef(ID: GrammarAST, labelAST: GrammarAST, args: GrammarAST): SrcOp[] {
        const matchOp = new MatchToken(this, ID as TerminalAST);
        if (labelAST !== null) {
            const label = labelAST.getText();
            const rf = this.getCurrentRuleFunction();
            if (labelAST.parent.getType() === ANTLRParser.PLUS_ASSIGN) {
                // add Token _X and List<Token> X decls
                this.defineImplicitLabel(ID, matchOp); // adds _X
                const l = this.getTokenListLabelDecl(label);
                rf.addContextDecl(ID.getAltLabel(), l);
            }
            else {
                const d = this.getTokenLabelDecl(label);
                matchOp.labels.add(d);
                rf.addContextDecl(ID.getAltLabel(), d);
            }

            //			Decl d = getTokenLabelDecl(label);
            //			((MatchToken)matchOp).labels.add(d);
            //			getCurrentRuleFunction().addContextDecl(ID.getAltLabel(), d);
            //			if ( labelAST.parent.getType() == ANTLRParser.PLUS_ASSIGN ) {
            //				TokenListDecl l = getTokenListLabelDecl(label);
            //				getCurrentRuleFunction().addContextDecl(ID.getAltLabel(), l);
            //			}
        }
        if (this.controller.needsImplicitLabel(ID, matchOp)) {
            this.defineImplicitLabel(ID, matchOp);
        }

        const listLabelOp = this.getAddToListOpIfListLabelPresent(matchOp, labelAST);

        return ParserFactory.list(matchOp, listLabelOp);
    }

    public getTokenLabelDecl(label: string): Decl {
        return new TokenDecl(this, label);
    }

    public getTokenListLabelDecl(label: string): TokenListDecl {
        return new TokenListDecl(this, this.gen.getTarget().getListLabel(label));
    }

    public override set(setAST: GrammarAST, labelAST: GrammarAST, invert: boolean): SrcOp[] {
        let matchOp: MatchSet;
        if (invert) {
            matchOp = new MatchNotSet(this, setAST);
        }

        else {
            matchOp = new MatchSet(this, setAST);
        }

        if (labelAST !== null) {
            const label = labelAST.getText();
            const rf = this.getCurrentRuleFunction();
            if (labelAST.parent.getType() === ANTLRParser.PLUS_ASSIGN) {
                this.defineImplicitLabel(setAST, matchOp);
                const l = this.getTokenListLabelDecl(label);
                rf.addContextDecl(setAST.getAltLabel(), l);
            }
            else {
                const d = this.getTokenLabelDecl(label);
                matchOp.labels.add(d);
                rf.addContextDecl(setAST.getAltLabel(), d);
            }
        }
        if (this.controller.needsImplicitLabel(setAST, matchOp)) {
            this.defineImplicitLabel(setAST, matchOp);
        }

        const listLabelOp = this.getAddToListOpIfListLabelPresent(matchOp, labelAST);

        return ParserFactory.list(matchOp, listLabelOp);
    }

    public override wildcard(ast: GrammarAST, labelAST: GrammarAST): SrcOp[] {
        const wild = new Wildcard(this, ast);
        // TODO: dup with tokenRef
        if (labelAST !== null) {
            const label = labelAST.getText();
            const d = this.getTokenLabelDecl(label);
            wild.labels.add(d);
            this.getCurrentRuleFunction().addContextDecl(ast.getAltLabel(), d);
            if (labelAST.parent.getType() === ANTLRParser.PLUS_ASSIGN) {
                const l = this.getTokenListLabelDecl(label);
                this.getCurrentRuleFunction().addContextDecl(ast.getAltLabel(), l);
            }
        }
        if (this.controller.needsImplicitLabel(ast, wild)) {
            this.defineImplicitLabel(ast, wild);
        }

        const listLabelOp = this.getAddToListOpIfListLabelPresent(wild, labelAST);

        return ParserFactory.list(wild, listLabelOp);
    }

    public override getChoiceBlock(blkAST: BlockAST, alts: CodeBlockForAlt[], labelAST: GrammarAST): Choice {
        const decision = (blkAST.atnState as DecisionState).decision;
        let c: Choice;
        if (!this.g.tool.force_atn && AnalysisPipeline.disjoint(this.g.decisionLOOK.get(decision))) {
            c = this.getLL1ChoiceBlock(blkAST, alts);
        }
        else {
            c = this.getComplexChoiceBlock(blkAST, alts);
        }

        if (labelAST !== null) { // for x=(...), define x or x_list
            const label = labelAST.getText();
            const d = this.getTokenLabelDecl(label);
            c.label = d;
            this.getCurrentRuleFunction().addContextDecl(labelAST.getAltLabel(), d);
            if (labelAST.parent.getType() === ANTLRParser.PLUS_ASSIGN) {
                const listLabel = this.gen.getTarget().getListLabel(label);
                const l = new TokenListDecl(this, listLabel);
                this.getCurrentRuleFunction().addContextDecl(labelAST.getAltLabel(), l);
            }
        }

        return c;
    }

    public override getEBNFBlock(ebnfRoot: GrammarAST, alts: CodeBlockForAlt[]): Choice {
        if (!this.g.tool.force_atn) {
            let decision: number;
            if (ebnfRoot.getType() === ANTLRParser.POSITIVE_CLOSURE) {
                decision = (ebnfRoot.atnState as PlusLoopbackState).decision;
            }
            else {
                if (ebnfRoot.getType() === ANTLRParser.CLOSURE) {
                    decision = (ebnfRoot.atnState as StarLoopEntryState).decision;
                }
                else {
                    decision = (ebnfRoot.atnState as DecisionState).decision;
                }
            }

            if (AnalysisPipeline.disjoint(this.g.decisionLOOK.get(decision))) {
                return this.getLL1EBNFBlock(ebnfRoot, alts);
            }
        }

        return this.getComplexEBNFBlock(ebnfRoot, alts);
    }

    public override getLL1ChoiceBlock(blkAST: BlockAST, alts: CodeBlockForAlt[]): Choice {
        return new LL1AltBlock(this, blkAST, alts);
    }

    public override getComplexChoiceBlock(blkAST: BlockAST, alts: CodeBlockForAlt[]): Choice {
        return new AltBlock(this, blkAST, alts);
    }

    public override getLL1EBNFBlock(ebnfRoot: GrammarAST, alts: CodeBlockForAlt[]): Choice {
        let ebnf = 0;
        if (ebnfRoot !== null) {
            ebnf = ebnfRoot.getType();
        }

        let c = null;
        switch (ebnf) {
            case ANTLRParser.OPTIONAL: {
                if (alts.size() === 1) {
                    c = new LL1OptionalBlockSingleAlt(this, ebnfRoot, alts);
                }

                else {
                    c = new LL1OptionalBlock(this, ebnfRoot, alts);
                }

                break;
            }

            case ANTLRParser.CLOSURE: {
                if (alts.size() === 1) {
                    c = new LL1StarBlockSingleAlt(this, ebnfRoot, alts);
                }

                else {
                    c = this.getComplexEBNFBlock(ebnfRoot, alts);
                }

                break;
            }

            case ANTLRParser.POSITIVE_CLOSURE: {
                if (alts.size() === 1) {
                    c = new LL1PlusBlockSingleAlt(this, ebnfRoot, alts);
                }

                else {
                    c = this.getComplexEBNFBlock(ebnfRoot, alts);
                }

                break;
            }

            default:

        }

        return c;
    }

    public override getComplexEBNFBlock(ebnfRoot: GrammarAST, alts: CodeBlockForAlt[]): Choice {
        let ebnf = 0;
        if (ebnfRoot !== null) {
            ebnf = ebnfRoot.getType();
        }

        let c = null;
        switch (ebnf) {
            case ANTLRParser.OPTIONAL: {
                c = new OptionalBlock(this, ebnfRoot, alts);
                break;
            }

            case ANTLRParser.CLOSURE: {
                c = new StarBlock(this, ebnfRoot, alts);
                break;
            }

            case ANTLRParser.POSITIVE_CLOSURE: {
                c = new PlusBlock(this, ebnfRoot, alts);
                break;
            }

            default:

        }

        return c;
    }

    public override getLL1Test(look: IntervalSet, blkAST: GrammarAST): SrcOp[] {
        return ParserFactory.list(new TestSetInline(this, blkAST, look, this.gen.getTarget().getInlineTestSetWordSize()));
    }

    public override needsImplicitLabel(ID: GrammarAST, op: LabeledOp): boolean {
        const currentOuterMostAlt = this.getCurrentOuterMostAlt();
        const actionRefsAsToken = currentOuterMostAlt.tokenRefsInActions.containsKey(ID.getText());
        const actionRefsAsRule = currentOuterMostAlt.ruleRefsInActions.containsKey(ID.getText());

        return op.getLabels().isEmpty() && (actionRefsAsToken || actionRefsAsRule);
    }

    // support

    public defineImplicitLabel(ast: GrammarAST, op: LabeledOp): void {
        let d: Decl;
        if (ast.getType() === ANTLRParser.SET || ast.getType() === ANTLRParser.WILDCARD) {
            const implLabel =
                this.gen.getTarget().getImplicitSetLabel(string.valueOf(ast.token.getTokenIndex()));
            d = this.getTokenLabelDecl(implLabel);
            (d as TokenDecl).isImplicit = true;
        }
        else {
            if (ast.getType() === ANTLRParser.RULE_REF) { // a rule reference?
                const r = this.g.getRule(ast.getText());
                const implLabel = this.gen.getTarget().getImplicitRuleLabel(ast.getText());
                const ctxName =
                    this.gen.getTarget().getRuleFunctionContextStructName(r);
                d = new RuleContextDecl(this, implLabel, ctxName);
                (d as RuleContextDecl).isImplicit = true;
            }
            else {
                const implLabel = this.gen.getTarget().getImplicitTokenLabel(ast.getText());
                d = this.getTokenLabelDecl(implLabel);
                (d as TokenDecl).isImplicit = true;
            }
        }

        op.getLabels().add(d);
        // all labels must be in scope struct in case we exec action out of context
        this.getCurrentRuleFunction().addContextDecl(ast.getAltLabel(), d);
    }

    public getAddToListOpIfListLabelPresent(op: LabeledOp, label: GrammarAST): AddToLabelList {
        let labelOp = null;
        if (label !== null && label.parent.getType() === ANTLRParser.PLUS_ASSIGN) {
            const target = this.gen.getTarget();
            const listLabel = target.getListLabel(label.getText());
            const listRuntimeName = target.escapeIfNeeded(listLabel);
            labelOp = new AddToLabelList(this, listRuntimeName, op.getLabels().get(0));
        }

        return labelOp;
    }

}
