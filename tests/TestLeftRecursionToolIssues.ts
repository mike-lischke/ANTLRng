/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */


/* eslint-disable jsdoc/require-returns, jsdoc/require-param */





/** */
export  class TestLeftRecursionToolIssues {
	protected  debug = false;

	@Test
public  testCheckForNonLeftRecursiveRule():  void {
		let  grammar =
			"grammar T;\n" +
			"s @after {System.out.println($ctx.toStringTree(this));} : a ;\n" +
			"a : a ID\n" +
			"  ;\n" +
			"ID : 'a'..'z'+ ;\n" +
			"WS : (' '|'\\n') -> skip ;\n";
		let  expected =
			"error(" + ErrorType.NO_NON_LR_ALTS.code + "): T.g4:3:0: left recursive rule a must contain an alternative which is not left recursive\n";
		testErrors( [ grammar, expected ], false);
	}

	@Test
public  testCheckForLeftRecursiveEmptyFollow():  void {
		let  grammar =
			"grammar T;\n" +
			"s @after {System.out.println($ctx.toStringTree(this));} : a ;\n" +
			"a : a ID?\n" +
			"  | ID\n" +
			"  ;\n" +
			"ID : 'a'..'z'+ ;\n" +
			"WS : (' '|'\\n') -> skip ;\n";
		let  expected =
			"error(" + ErrorType.EPSILON_LR_FOLLOW.code + "): T.g4:3:0: left recursive rule a contains a left recursive alternative which can be followed by the empty string\n";
		testErrors( [ grammar, expected ], false);
	}

	/** Reproduces https://github.com/antlr/antlr4/issues/855 */
	@Test
public  testLeftRecursiveRuleRefWithArg():  void {
		let  grammar =
			"grammar T;\n" +
			"statement\n" +
			"locals[Scope scope]\n" +
			"    : expressionA[$scope] ';'\n" +
			"    ;\n" +
			"expressionA[Scope scope]\n" +
			"    : atom[$scope]\n" +
			"    | expressionA[$scope] '[' expressionA[$scope] ']'\n" +
			"    ;\n" +
			"atom[Scope scope]\n" +
			"    : 'dummy'\n" +
			"    ;\n";
		let  expected =
			"error(" + ErrorType.NONCONFORMING_LR_RULE.code + "): T.g4:6:0: rule expressionA is left recursive but doesn't conform to a pattern ANTLR can handle\n";
		testErrors( [grammar, expected], false);
	}

	/** Reproduces https://github.com/antlr/antlr4/issues/855 */
	@Test
public  testLeftRecursiveRuleRefWithArg2():  void {
		let  grammar =
			"grammar T;\n" +
			"a[int i] : 'x'\n" +
			"  | a[3] 'y'\n" +
			"  ;";
		let  expected =
			"error(" + ErrorType.NONCONFORMING_LR_RULE.code + "): T.g4:2:0: rule a is left recursive but doesn't conform to a pattern ANTLR can handle\n";
		testErrors( [grammar, expected], false);
	}

	/** Reproduces https://github.com/antlr/antlr4/issues/855 */
	@Test
public  testLeftRecursiveRuleRefWithArg3():  void {
		let  grammar =
			"grammar T;\n" +
			"a : 'x'\n" +
			"  | a[3] 'y'\n" +
			"  ;";
		let  expected =
			"error(" + ErrorType.NONCONFORMING_LR_RULE.code + "): T.g4:2:0: rule a is left recursive but doesn't conform to a pattern ANTLR can handle\n";
		testErrors( [grammar, expected], false);
	}

	/** Reproduces https://github.com/antlr/antlr4/issues/822 */
	@Test
public  testIsolatedLeftRecursiveRuleRef():  void {
		let  grammar =
			"grammar T;\n" +
			"a : a | b ;\n" +
			"b : 'B' ;\n";
		let  expected =
			"error(" + ErrorType.NONCONFORMING_LR_RULE.code + "): T.g4:2:0: rule a is left recursive but doesn't conform to a pattern ANTLR can handle\n";
		testErrors( [grammar, expected], false);
	}

	/** Reproduces https://github.com/antlr/antlr4/issues/773 */
	@Test
public  testArgOnPrimaryRuleInLeftRecursiveRule():  void {
		let  grammar =
			"grammar T;\n" +
			"val: dval[1]\n" +
			"   | val '*' val\n" +
			"   ;\n" +
			"dval[int  x]: '.';\n";
		let  expected = ""; // dval[1] should not be error
		testErrors( [grammar, expected], false);
	}
}
