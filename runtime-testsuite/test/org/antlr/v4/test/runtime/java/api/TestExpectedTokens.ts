/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */



import { java, type int } from "jree";
import { ParserRuleContext, ATN, IntervalSet } from "antlr4ng";
import { RuntimeTestUtils } from "../../RuntimeTestUtils";
import { JavaRunner } from "../JavaRunner";

type String = java.lang.String;
const String = java.lang.String;

import { Test, Override } from "../../../../../../../../decorators.js";


export  class TestExpectedTokens extends JavaRunner {
	@Test
public  testEpsilonAltSubrule():  void {
		let  gtext =
			"parser grammar T;\n" +
			"a : A (B | ) C ;\n";
		let  g = new  Grammar(gtext);
		let  atnText =
			"RuleStart_a_0->s2\n"+
			"s2-A->BlockStart_5\n"+
			"BlockStart_5->s3\n"+
			"BlockStart_5->s4\n"+
			"s3-B->BlockEnd_6\n"+
			"s4->BlockEnd_6\n"+
			"BlockEnd_6->s7\n"+
			"s7-C->s8\n"+
			"s8->RuleStop_a_1\n"+
			"RuleStop_a_1-EOF->s9\n";
		RuntimeTestUtils.checkRuleATN(g, "a", atnText);

		let  atn = g.getATN();
		let  blkStartStateNumber = 5;
		let  tokens = atn.getExpectedTokens(blkStartStateNumber, null);
		assertEquals("{B, C}", tokens.toString(g.getTokenNames()));
	}

	@Test
public  testOptionalSubrule():  void {
		let  gtext =
			"parser grammar T;\n" +
			"a : A B? C ;\n";
		let  g = new  Grammar(gtext);
		let  atnText =
			"RuleStart_a_0->s2\n"+
			"s2-A->BlockStart_4\n"+
			"BlockStart_4->s3\n"+
			"BlockStart_4->BlockEnd_5\n"+
			"s3-B->BlockEnd_5\n"+
			"BlockEnd_5->s6\n"+
			"s6-C->s7\n"+
			"s7->RuleStop_a_1\n"+
			"RuleStop_a_1-EOF->s8\n";
		RuntimeTestUtils.checkRuleATN(g, "a", atnText);

		let  atn = g.getATN();
		let  blkStartStateNumber = 4;
		let  tokens = atn.getExpectedTokens(blkStartStateNumber, null);
		assertEquals("{B, C}", tokens.toString(g.getTokenNames()));
	}

	@Test
public  testFollowIncluded():  void {
		let  gtext =
			"parser grammar T;\n" +
				"a : b A ;\n" +
				"b : B | ;";
		let  g = new  Grammar(gtext);
		let  atnText =
			"RuleStart_a_0->s4\n"+
			"s4-b->RuleStart_b_2\n"+
			"s5-A->s6\n"+
			"s6->RuleStop_a_1\n"+
			"RuleStop_a_1-EOF->s11\n";
		RuntimeTestUtils.checkRuleATN(g, "a", atnText);
		atnText =
			"RuleStart_b_2->BlockStart_9\n"+
			"BlockStart_9->s7\n"+
			"BlockStart_9->s8\n"+
			"s7-B->BlockEnd_10\n"+
			"s8->BlockEnd_10\n"+
			"BlockEnd_10->RuleStop_b_3\n"+
			"RuleStop_b_3->s5\n";
		RuntimeTestUtils.checkRuleATN(g, "b", atnText);

		let  atn = g.getATN();

		// From the start of 'b' with empty stack, can only see B and EOF
		let  blkStartStateNumber = 9;
		let  tokens = atn.getExpectedTokens(blkStartStateNumber, ParserRuleContext.EMPTY);
		assertEquals("{<EOF>, B}", tokens.toString(g.getTokenNames()));

		// Now call from 'a'
		tokens = atn.getExpectedTokens(blkStartStateNumber, new  ParserRuleContext(ParserRuleContext.EMPTY, 4));
		assertEquals("{A, B}", tokens.toString(g.getTokenNames()));
	}

	// Test for https://github.com/antlr/antlr4/issues/1480
	// can't reproduce
	@Test
public  testFollowIncludedInLeftRecursiveRule():  void {
		let  gtext =
			"grammar T;\n" +
			"s : expr EOF ;\n" +
			"expr : L expr R\n"+
			"     | expr PLUS expr\n"+
			"     | ID\n"+
			"     ;\n";
		let  g = new  Grammar(gtext);
		let  atnText =
			"RuleStart_expr_2->BlockStart_13\n"+
			"BlockStart_13->s7\n"+
			"BlockStart_13->s12\n"+
			"s7-action_1:-1->s8\n"+
			"s12-ID->BlockEnd_14\n"+
			"s8-L->s9\n"+
			"BlockEnd_14->StarLoopEntry_20\n"+
			"s9-expr->RuleStart_expr_2\n"+
			"StarLoopEntry_20->StarBlockStart_18\n"+
			"StarLoopEntry_20->s21\n"+
			"s10-R->s11\n"+
			"StarBlockStart_18->s15\n"+
			"s21->RuleStop_expr_3\n"+
			"s11->BlockEnd_14\n"+
			"s15-2 >= _p->s16\n"+
			"RuleStop_expr_3->s5\n"+
			"RuleStop_expr_3->s10\n"+
			"RuleStop_expr_3->BlockEnd_19\n"+
			"s16-PLUS->s17\n"+
			"s17-expr->RuleStart_expr_2\n"+
			"BlockEnd_19->StarLoopBack_22\n"+
			"StarLoopBack_22->StarLoopEntry_20\n";
		RuntimeTestUtils.checkRuleATN(g, "expr", atnText);

		let  atn = g.getATN();

//		DOTGenerator gen = new DOTGenerator(g);
//		String dot = gen.getDOT(atn.states.get(2), g.getRuleNames(), false);
//		System.out.println(dot);

		// Simulate call stack after input '(x' from rule s
		let  callStackFrom_s = new  ParserRuleContext(null, 4);
		let  callStackFrom_expr = new  ParserRuleContext(callStackFrom_s, 9);
		let  afterID = 14;
		let  tokens = atn.getExpectedTokens(afterID, callStackFrom_expr);
		assertEquals("{R, PLUS}", tokens.toString(g.getTokenNames()));

		// Simulate call stack after input '(x' from within rule expr
		callStackFrom_expr = new  ParserRuleContext(null, 9);
		tokens = atn.getExpectedTokens(afterID, callStackFrom_expr);
		assertEquals("{R, PLUS}", tokens.toString(g.getTokenNames()));
	}
}
