/* java2ts: keep */

/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { ParserRuleContext } from "antlr4ng";

import { RuntimeTestUtils } from "../../RuntimeTestUtils.js";

import { Test } from "../../../decorators.js";
import { Grammar } from "../../../temp.js";
import { assertEquals } from "../../../junit.js";

export class TestExpectedTokens {
    @Test
    public testEpsilonAltSubrule(): void {
        const grammarText =
            "parser grammar T;\n" +
            "a : A (B | ) C ;\n";
        const g = new Grammar(grammarText);
        const atnText =
            "RuleStart_a_0->s2\n" +
            "s2-A->BlockStart_5\n" +
            "BlockStart_5->s3\n" +
            "BlockStart_5->s4\n" +
            "s3-B->BlockEnd_6\n" +
            "s4->BlockEnd_6\n" +
            "BlockEnd_6->s7\n" +
            "s7-C->s8\n" +
            "s8->RuleStop_a_1\n" +
            "RuleStop_a_1-EOF->s9\n";
        RuntimeTestUtils.checkRuleATN(g, "a", atnText);

        const atn = g.getATN();
        const blkStartStateNumber = 5;
        const tokens = atn.getExpectedTokens(blkStartStateNumber, null);
        assertEquals("{B, C}", tokens.toString(g.getTokenNames()));
    }

    @Test
    public testOptionalSubrule(): void {
        const grammarText =
            "parser grammar T;\n" +
            "a : A B? C ;\n";
        const g = new Grammar(grammarText);
        const atnText =
            "RuleStart_a_0->s2\n" +
            "s2-A->BlockStart_4\n" +
            "BlockStart_4->s3\n" +
            "BlockStart_4->BlockEnd_5\n" +
            "s3-B->BlockEnd_5\n" +
            "BlockEnd_5->s6\n" +
            "s6-C->s7\n" +
            "s7->RuleStop_a_1\n" +
            "RuleStop_a_1-EOF->s8\n";
        RuntimeTestUtils.checkRuleATN(g, "a", atnText);

        const atn = g.getATN();
        const blkStartStateNumber = 4;
        const tokens = atn.getExpectedTokens(blkStartStateNumber, null);
        assertEquals("{B, C}", tokens.toString(g.getTokenNames()));
    }

    @Test
    public testFollowIncluded(): void {
        const grammarText =
            "parser grammar T;\n" +
            "a : b A ;\n" +
            "b : B | ;";
        const g = new Grammar(grammarText);
        let atnText =
            "RuleStart_a_0->s4\n" +
            "s4-b->RuleStart_b_2\n" +
            "s5-A->s6\n" +
            "s6->RuleStop_a_1\n" +
            "RuleStop_a_1-EOF->s11\n";
        RuntimeTestUtils.checkRuleATN(g, "a", atnText);
        atnText =
            "RuleStart_b_2->BlockStart_9\n" +
            "BlockStart_9->s7\n" +
            "BlockStart_9->s8\n" +
            "s7-B->BlockEnd_10\n" +
            "s8->BlockEnd_10\n" +
            "BlockEnd_10->RuleStop_b_3\n" +
            "RuleStop_b_3->s5\n";
        RuntimeTestUtils.checkRuleATN(g, "b", atnText);

        const atn = g.getATN();

        // From the start of 'b' with empty stack, can only see B and EOF
        const blkStartStateNumber = 9;
        let tokens = atn.getExpectedTokens(blkStartStateNumber, ParserRuleContext.EMPTY);
        assertEquals("{<EOF>, B}", tokens.toString(g.getTokenNames()));

        // Now call from 'a'
        tokens = atn.getExpectedTokens(blkStartStateNumber, new ParserRuleContext(ParserRuleContext.EMPTY, 4));
        assertEquals("{A, B}", tokens.toString(g.getTokenNames()));
    }

    // Test for https://github.com/antlr/antlr4/issues/1480
    // can't reproduce
    @Test
    public testFollowIncludedInLeftRecursiveRule(): void {
        const grammarText =
            "grammar T;\n" +
            "s : expr EOF ;\n" +
            "expr : L expr R\n" +
            "     | expr PLUS expr\n" +
            "     | ID\n" +
            "     ;\n";
        const g = new Grammar(grammarText);
        const atnText =
            "RuleStart_expr_2->BlockStart_13\n" +
            "BlockStart_13->s7\n" +
            "BlockStart_13->s12\n" +
            "s7-action_1:-1->s8\n" +
            "s12-ID->BlockEnd_14\n" +
            "s8-L->s9\n" +
            "BlockEnd_14->StarLoopEntry_20\n" +
            "s9-expr->RuleStart_expr_2\n" +
            "StarLoopEntry_20->StarBlockStart_18\n" +
            "StarLoopEntry_20->s21\n" +
            "s10-R->s11\n" +
            "StarBlockStart_18->s15\n" +
            "s21->RuleStop_expr_3\n" +
            "s11->BlockEnd_14\n" +
            "s15-2 >= _p->s16\n" +
            "RuleStop_expr_3->s5\n" +
            "RuleStop_expr_3->s10\n" +
            "RuleStop_expr_3->BlockEnd_19\n" +
            "s16-PLUS->s17\n" +
            "s17-expr->RuleStart_expr_2\n" +
            "BlockEnd_19->StarLoopBack_22\n" +
            "StarLoopBack_22->StarLoopEntry_20\n";
        RuntimeTestUtils.checkRuleATN(g, "expr", atnText);

        const atn = g.getATN();

        // Simulate call stack after input '(x' from rule s
        const callStackFrom_s = new ParserRuleContext(null, 4);
        let callStackFromExpr = new ParserRuleContext(callStackFrom_s, 9);
        const afterID = 14;
        let tokens = atn.getExpectedTokens(afterID, callStackFromExpr);
        assertEquals("{R, PLUS}", tokens.toString(g.getTokenNames()));

        // Simulate call stack after input '(x' from within rule expr
        callStackFromExpr = new ParserRuleContext(null, 9);
        tokens = atn.getExpectedTokens(afterID, callStackFromExpr);
        assertEquals("{R, PLUS}", tokens.toString(g.getTokenNames()));
    }
}
