/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */


/* eslint-disable jsdoc/require-returns, jsdoc/require-param */


import { ANTLRInputStream, CommonTokenStream, LexerInterpreter, ParserInterpreter, ParseTree } from "antlr4ng";




export  class TestParserInterpreter {
	@Test
public  testEmptyStartRule():  void {
		let  lg = new  LexerGrammar(
			"lexer grammar L;\n" +
			"A : 'a' ;\n");
		let  g = new  Grammar(
			"parser grammar T;\n" +
			"s :  ;",
			lg);

		this.testInterp(lg, g, "s", "", "s");
		this.testInterp(lg, g, "s", "a", "s");
	}

	@Test
public  testA():  void {
		let  lg = new  LexerGrammar(
			"lexer grammar L;\n" +
			"A : 'a' ;\n");
		let  g = new  Grammar(
			"parser grammar T;\n" +
			"s : A ;",
			lg);

		let  t = this.testInterp(lg, g, "s", "a", "(s a)");
		assertEquals("0..0", t.getSourceInterval().toString());
	}

	@Test
public  testEOF():  void {
		let  lg = new  LexerGrammar(
			"lexer grammar L;\n" +
			"A : 'a' ;\n");
		let  g = new  Grammar(
			"parser grammar T;\n" +
			"s : A EOF ;",
			lg);

		let  t = this.testInterp(lg, g, "s", "a", "(s a <EOF>)");
		assertEquals("0..1", t.getSourceInterval().toString());
	}

	@Test
public  testEOFInChild():  void {
		let  lg = new  LexerGrammar(
			"lexer grammar L;\n" +
			"A : 'a' ;\n");
		let  g = new  Grammar(
			"parser grammar T;\n" +
			"s : x ;\n" +
			"x : A EOF ;",
			lg);

		let  t = this.testInterp(lg, g, "s", "a", "(s (x a <EOF>))");
		assertEquals("0..1", t.getSourceInterval().toString());
		assertEquals("0..1", t.getChild(0).getSourceInterval().toString());
	}

	@Test
public  testEmptyRuleAfterEOFInChild():  void {
		let  lg = new  LexerGrammar(
			"lexer grammar L;\n" +
			"A : 'a' ;\n");
		let  g = new  Grammar(
			"parser grammar T;\n" +
			"s : x y;\n" +
			"x : A EOF ;\n" +
			"y : ;",
			lg);

		let  t = this.testInterp(lg, g, "s", "a", "(s (x a <EOF>) y)");
		assertEquals("0..1", t.getSourceInterval().toString()); // s
		assertEquals("0..1", t.getChild(0).getSourceInterval().toString()); // x
// unspecified		assertEquals("1..0", t.getChild(1).getSourceInterval().toString()); // y
	}

	@Test
public  testEmptyRuleAfterJustEOFInChild():  void {
		let  lg = new  LexerGrammar(
			"lexer grammar L;\n" +
			"A : 'a' ;\n");
		let  g = new  Grammar(
			"parser grammar T;\n" +
			"s : x y;\n" +
			"x : EOF ;\n" +
			"y : ;",
			lg);

		let  t = this.testInterp(lg, g, "s", "", "(s (x <EOF>) y)");
		assertEquals("0..0", t.getSourceInterval().toString()); // s
		assertEquals("0..0", t.getChild(0).getSourceInterval().toString()); // x
		// this next one is a weird special case where somebody tries to match beyond in the file
// unspecified		assertEquals("0..-1", t.getChild(1).getSourceInterval().toString()); // y
	}

	@Test
public  testEmptyInput():  void {
		let  lg = new  LexerGrammar(
			"lexer grammar L;\n" +
			"A : 'a' ;\n");
		let  g = new  Grammar(
			"parser grammar T;\n" +
			"s : x EOF ;\n" +
			"x : ;\n",
			lg);

		let  t = this.testInterp(lg, g, "s", "", "(s x <EOF>)");
		assertEquals("0..0", t.getSourceInterval().toString()); // s
		assertEquals("0..-1", t.getChild(0).getSourceInterval().toString()); // x
	}

	@Test
public  testEmptyInputWithCallsAfter():  void {
		let  lg = new  LexerGrammar(
			"lexer grammar L;\n" +
			"A : 'a' ;\n");
		let  g = new  Grammar(
			"parser grammar T;\n" +
			"s : x y ;\n" +
			"x : EOF ;\n" +
			"y : z ;\n" +
			"z : ;",
			lg);

		let  t = this.testInterp(lg, g, "s", "", "(s (x <EOF>) (y z))");
		assertEquals("0..0", t.getSourceInterval().toString()); // s
		assertEquals("0..0", t.getChild(0).getSourceInterval().toString()); // x
// unspecified		assertEquals("0..-1", t.getChild(1).getSourceInterval().toString()); // x
	}

	@Test
public  testEmptyFirstRule():  void {
		let  lg = new  LexerGrammar(
			"lexer grammar L;\n" +
			"A : 'a' ;\n");
		let  g = new  Grammar(
			"parser grammar T;\n" +
			"s : x A ;\n" +
			"x : ;\n",
			lg);

		let  t = this.testInterp(lg, g, "s", "a", "(s x a)");
		assertEquals("0..0", t.getSourceInterval().toString()); // s
		// This gets an empty interval because the stop token is null for x
		assertEquals("0..-1", t.getChild(0).getSourceInterval().toString()); // x
	}

	@Test
public  testAorB():  void {
		let  lg = new  LexerGrammar(
			"lexer grammar L;\n" +
			"A : 'a' ;\n" +
			"B : 'b' ;\n" +
			"C : 'c' ;\n");
		let  g = new  Grammar(
			"parser grammar T;\n"+
			"s : A{;} | B ;",
			lg);
		this.testInterp(lg, g, "s", "a", "(s a)");
		this.testInterp(lg, g, "s", "b", "(s b)");
	}

	@Test
public  testCall():  void {
		let  lg = new  LexerGrammar(
			"lexer grammar L;\n" +
			"A : 'a' ;\n" +
			"B : 'b' ;\n" +
			"C : 'c' ;\n");
		let  g = new  Grammar(
			"parser grammar T;\n"+
			"s : t C ;\n" +
			"t : A{;} | B ;\n",
			lg);

		this.testInterp(lg, g, "s", "ac", "(s (t a) c)");
		this.testInterp(lg, g, "s", "bc", "(s (t b) c)");
	}

	@Test
public  testCall2():  void {
		let  lg = new  LexerGrammar(
			"lexer grammar L;\n" +
			"A : 'a' ;\n" +
			"B : 'b' ;\n" +
			"C : 'c' ;\n");
		let  g = new  Grammar(
			"parser grammar T;\n"+
			"s : t C ;\n" +
			"t : u ;\n" +
			"u : A{;} | B ;\n",
			lg);

		this.testInterp(lg, g, "s", "ac", "(s (t (u a)) c)");
		this.testInterp(lg, g, "s", "bc", "(s (t (u b)) c)");
	}

	@Test
public  testOptionalA():  void {
		let  lg = new  LexerGrammar(
			"lexer grammar L;\n" +
			"A : 'a' ;\n" +
			"B : 'b' ;\n" +
			"C : 'c' ;\n");
		let  g = new  Grammar(
			"parser grammar T;\n" +
			"s : A? B ;\n",
			lg);

		this.testInterp(lg, g, "s", "b", "(s b)");
		this.testInterp(lg, g, "s", "ab", "(s a b)");
	}

	@Test
public  testOptionalAorB():  void {
		let  lg = new  LexerGrammar(
			"lexer grammar L;\n" +
			"A : 'a' ;\n" +
			"B : 'b' ;\n" +
			"C : 'c' ;\n");
		let  g = new  Grammar(
			"parser grammar T;\n" +
			"s : (A{;}|B)? C ;\n",
			lg);

		this.testInterp(lg, g, "s", "c", "(s c)");
		this.testInterp(lg, g, "s", "ac", "(s a c)");
		this.testInterp(lg, g, "s", "bc", "(s b c)");
	}

	@Test
public  testStarA():  void {
		let  lg = new  LexerGrammar(
			"lexer grammar L;\n" +
			"A : 'a' ;\n" +
			"B : 'b' ;\n" +
			"C : 'c' ;\n");
		let  g = new  Grammar(
			"parser grammar T;\n" +
			"s : A* B ;\n",
			lg);

		this.testInterp(lg, g, "s", "b", "(s b)");
		this.testInterp(lg, g, "s", "ab", "(s a b)");
		this.testInterp(lg, g, "s", "aaaaaab", "(s a a a a a a b)");
	}

	@Test
public  testStarAorB():  void {
		let  lg = new  LexerGrammar(
			"lexer grammar L;\n" +
			"A : 'a' ;\n" +
			"B : 'b' ;\n" +
			"C : 'c' ;\n");
		let  g = new  Grammar(
			"parser grammar T;\n" +
			"s : (A{;}|B)* C ;\n",
			lg);

		this.testInterp(lg, g, "s", "c", "(s c)");
		this.testInterp(lg, g, "s", "ac", "(s a c)");
		this.testInterp(lg, g, "s", "bc", "(s b c)");
		this.testInterp(lg, g, "s", "abaaabc", "(s a b a a a b c)");
		this.testInterp(lg, g, "s", "babac", "(s b a b a c)");
	}

	@Test
public  testLeftRecursion():  void {
		let  lg = new  LexerGrammar(
			"lexer grammar L;\n" +
			"A : 'a' ;\n" +
			"B : 'b' ;\n" +
			"C : 'c' ;\n" +
			"PLUS : '+' ;\n" +
			"MULT : '*' ;\n");
		let  g = new  Grammar(
			"parser grammar T;\n" +
			"s : e ;\n" +
			"e : e MULT e\n" +
			"  | e PLUS e\n" +
			"  | A\n" +
			"  ;\n",
			lg);

		this.testInterp(lg, g, "s", "a", 	"(s (e a))");
		this.testInterp(lg, g, "s", "a+a", 	"(s (e (e a) + (e a)))");
		this.testInterp(lg, g, "s", "a*a", 	"(s (e (e a) * (e a)))");
		this.testInterp(lg, g, "s", "a+a+a", "(s (e (e (e a) + (e a)) + (e a)))");
		this.testInterp(lg, g, "s", "a*a+a", "(s (e (e (e a) * (e a)) + (e a)))");
		this.testInterp(lg, g, "s", "a+a*a", "(s (e (e a) + (e (e a) * (e a))))");
	}

	/**
	 * This is a regression test for antlr/antlr4#461.
	 * https://github.com/antlr/antlr4/issues/461
	 */
	@Test
public  testLeftRecursiveStartRule():  void {
		let  lg = new  LexerGrammar(
			"lexer grammar L;\n" +
			"A : 'a' ;\n" +
			"B : 'b' ;\n" +
			"C : 'c' ;\n" +
			"PLUS : '+' ;\n" +
			"MULT : '*' ;\n");
		let  g = new  Grammar(
			"parser grammar T;\n" +
			"s : e ;\n" +
			"e : e MULT e\n" +
			"  | e PLUS e\n" +
			"  | A\n" +
			"  ;\n",
			lg);

		this.testInterp(lg, g, "e", "a", 	"(e a)");
		this.testInterp(lg, g, "e", "a+a", 	"(e (e a) + (e a))");
		this.testInterp(lg, g, "e", "a*a", 	"(e (e a) * (e a))");
		this.testInterp(lg, g, "e", "a+a+a", "(e (e (e a) + (e a)) + (e a))");
		this.testInterp(lg, g, "e", "a*a+a", "(e (e (e a) * (e a)) + (e a))");
		this.testInterp(lg, g, "e", "a+a*a", "(e (e a) + (e (e a) * (e a)))");
	}

	@Test
public  testCaseInsensitiveTokensInParser():  void {
		let  lg = new  LexerGrammar(
				"lexer grammar L;\n" +
				"options { caseInsensitive = true; }\n" +
				"NOT: 'not';\n" +
				"AND: 'and';\n" +
				"NEW: 'new';\n" +
				"LB:  '(';\n" +
				"RB:  ')';\n" +
				"ID: [a-z_][a-z_0-9]*;\n" +
				"WS: [ \\t\\n\\r]+ -> skip;");
		let  g = new  Grammar(
				"parser grammar T;\n" +
				"options { caseInsensitive = true; }\n" +
				"e\n" +
				"    : ID\n" +
				"    | 'not' e\n" +
				"    | e 'and' e\n" +
				"    | 'new' ID '(' e ')'\n" +
				"    ;", lg);

		this.testInterp(lg, g, "e", "NEW Abc (Not a AND not B)", "(e NEW Abc ( (e (e Not (e a)) AND (e not (e B))) ))");
	}

	protected  testInterp(lg: LexerGrammar, g: Grammar,
					startRule: string, input: string,
					expectedParseTree: string): ParseTree
	{
		let  lexEngine = lg.createLexerInterpreter(new  ANTLRInputStream(input));
		let  tokens = new  CommonTokenStream(lexEngine);
		let  parser = g.createParserInterpreter(tokens);
		let  t = parser.parse(g.rules.get(startRule).index);
		assertEquals(expectedParseTree, t.toStringTree(parser));
		return t;
	}
}
