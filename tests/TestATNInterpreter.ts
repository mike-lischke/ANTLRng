/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */


/* eslint-disable jsdoc/require-returns, jsdoc/require-param */


import { Lexer, NoViableAltException, TokenStream, ATN, ATNState, BlockStartState, LexerATNSimulator, DFA, IntegerList } from "antlr4ng";



	// NOTICE: TOKENS IN LEXER, PARSER MUST BE SAME OR TOKEN TYPE MISMATCH
	// NOTICE: TOKENS IN LEXER, PARSER MUST BE SAME OR TOKEN TYPE MISMATCH
	// NOTICE: TOKENS IN LEXER, PARSER MUST BE SAME OR TOKEN TYPE MISMATCH

export  class TestATNInterpreter {
	@Test
public  testSimpleNoBlock():  void {
		let  lg = new  LexerGrammar(
			"lexer grammar L;\n" +
			"A : 'a' ;\n" +
			"B : 'b' ;\n" +
			"C : 'c' ;\n");
		let  g = new  Grammar(
			"parser grammar T;\n"+
			"a : A B ;");
		this.checkMatchedAlt(lg, g, "ab", 1);
	}

	@Test
public  testSet():  void {
		let  lg = new  LexerGrammar(
			"lexer grammar L;\n" +
			"A : 'a' ;\n" +
			"B : 'b' ;\n" +
			"C : 'c' ;\n");
		let  g = new  Grammar(
			"parser grammar T;\n"+
			"tokens {A,B,C}\n" +
			"a : ~A ;");
		this.checkMatchedAlt(lg, g, "b", 1);
	}

	@Test
public  testPEGAchillesHeel():  void {
		let  lg = new  LexerGrammar(
			"lexer grammar L;\n" +
			"A : 'a' ;\n" +
			"B : 'b' ;\n" +
			"C : 'c' ;\n");
		let  g = new  Grammar(
			"parser grammar T;\n"+
			"a : A | A B ;");
		this.checkMatchedAlt(lg, g, "a", 1);
		this.checkMatchedAlt(lg, g, "ab", 2);
		this.checkMatchedAlt(lg, g, "abc", 2);
	}

	@Test
public  testMustTrackPreviousGoodAlt():  void {
		let  lg = new  LexerGrammar(
			"lexer grammar L;\n" +
			"A : 'a' ;\n" +
			"B : 'b' ;\n" +
			"C : 'c' ;\n");
		let  g = new  Grammar(
			"parser grammar T;\n"+
			"a : A | A B ;");

		this.checkMatchedAlt(lg, g, "a", 1);
		this.checkMatchedAlt(lg, g, "ab", 2);

		this.checkMatchedAlt(lg, g, "ac", 1);
		this.checkMatchedAlt(lg, g, "abc", 2);
	}

	@Test
public  testMustTrackPreviousGoodAltWithEOF():  void {
		let  lg = new  LexerGrammar(
			"lexer grammar L;\n" +
			"A : 'a' ;\n" +
			"B : 'b' ;\n" +
			"C : 'c' ;\n");
		let  g = new  Grammar(
			"parser grammar T;\n"+
			"a : (A | A B) EOF;");

		this.checkMatchedAlt(lg, g, "a", 1);
		this.checkMatchedAlt(lg, g, "ab", 2);

		try {
			this.checkMatchedAlt(lg, g, "ac", 1);
			fail();
		} catch (re) {
if (re instanceof NoViableAltException) {
			assertEquals(1, re.getOffendingToken().getTokenIndex());
			assertEquals(3, re.getOffendingToken().getType());
		} else {
	throw re;
	}
}
	}

	@Test
public  testMustTrackPreviousGoodAlt2():  void {
		let  lg = new  LexerGrammar(
			"lexer grammar L;\n" +
			"A : 'a' ;\n" +
			"B : 'b' ;\n" +
			"C : 'c' ;\n" +
			"D : 'd' ;\n");
		let  g = new  Grammar(
			"parser grammar T;\n"+
			"a : A | A B | A B C ;");

		this.checkMatchedAlt(lg, g, "a", 1);
		this.checkMatchedAlt(lg, g, "ab", 2);
		this.checkMatchedAlt(lg, g, "abc", 3);

		this.checkMatchedAlt(lg, g, "ad", 1);
		this.checkMatchedAlt(lg, g, "abd", 2);
		this.checkMatchedAlt(lg, g, "abcd", 3);
	}

	@Test
public  testMustTrackPreviousGoodAlt2WithEOF():  void {
		let  lg = new  LexerGrammar(
			"lexer grammar L;\n" +
			"A : 'a' ;\n" +
			"B : 'b' ;\n" +
			"C : 'c' ;\n" +
			"D : 'd' ;\n");
		let  g = new  Grammar(
			"parser grammar T;\n"+
			"a : (A | A B | A B C) EOF;");

		this.checkMatchedAlt(lg, g, "a", 1);
		this.checkMatchedAlt(lg, g, "ab", 2);
		this.checkMatchedAlt(lg, g, "abc", 3);

		try {
			this.checkMatchedAlt(lg, g, "abd", 1);
			fail();
		} catch (re) {
if (re instanceof NoViableAltException) {
			assertEquals(2, re.getOffendingToken().getTokenIndex());
			assertEquals(4, re.getOffendingToken().getType());
		} else {
	throw re;
	}
}
	}

	@Test
public  testMustTrackPreviousGoodAlt3():  void {
		let  lg = new  LexerGrammar(
			"lexer grammar L;\n" +
			"A : 'a' ;\n" +
			"B : 'b' ;\n" +
			"C : 'c' ;\n" +
			"D : 'd' ;\n");
		let  g = new  Grammar(
			"parser grammar T;\n"+
			"a : A B | A | A B C ;");

		this.checkMatchedAlt(lg, g, "a", 2);
		this.checkMatchedAlt(lg, g, "ab", 1);
		this.checkMatchedAlt(lg, g, "abc", 3);

		this.checkMatchedAlt(lg, g, "ad", 2);
		this.checkMatchedAlt(lg, g, "abd", 1);
		this.checkMatchedAlt(lg, g, "abcd", 3);
	}

	@Test
public  testMustTrackPreviousGoodAlt3WithEOF():  void {
		let  lg = new  LexerGrammar(
			"lexer grammar L;\n" +
			"A : 'a' ;\n" +
			"B : 'b' ;\n" +
			"C : 'c' ;\n" +
			"D : 'd' ;\n");
		let  g = new  Grammar(
			"parser grammar T;\n"+
			"a : (A B | A | A B C) EOF;");

		this.checkMatchedAlt(lg, g, "a", 2);
		this.checkMatchedAlt(lg, g, "ab", 1);
		this.checkMatchedAlt(lg, g, "abc", 3);

		try {
			this.checkMatchedAlt(lg, g, "abd", 1);
			fail();
		} catch (re) {
if (re instanceof NoViableAltException) {
			assertEquals(2, re.getOffendingToken().getTokenIndex());
			assertEquals(4, re.getOffendingToken().getType());
		} else {
	throw re;
	}
}
	}

	@Test
public  testAmbigAltChooseFirst():  void {
		let  lg = new  LexerGrammar(
			"lexer grammar L;\n" +
			"A : 'a' ;\n" +
			"B : 'b' ;\n" +
			"C : 'c' ;\n" +
			"D : 'd' ;\n");
		let  g = new  Grammar(
			"parser grammar T;\n"+
			"a : A B | A B ;"); // first alt
		this.checkMatchedAlt(lg, g, "ab", 1);
		this.checkMatchedAlt(lg, g, "abc", 1);
	}

	@Test
public  testAmbigAltChooseFirstWithFollowingToken():  void {
		let  lg = new  LexerGrammar(
			"lexer grammar L;\n" +
			"A : 'a' ;\n" +
			"B : 'b' ;\n" +
			"C : 'c' ;\n" +
			"D : 'd' ;\n");
		let  g = new  Grammar(
			"parser grammar T;\n"+
			"a : (A B | A B) C ;"); // first alt
		this.checkMatchedAlt(lg, g, "abc", 1);
		this.checkMatchedAlt(lg, g, "abcd", 1);
	}

	@Test
public  testAmbigAltChooseFirstWithFollowingToken2():  void {
		let  lg = new  LexerGrammar(
			"lexer grammar L;\n" +
			"A : 'a' ;\n" +
			"B : 'b' ;\n" +
			"C : 'c' ;\n" +
			"D : 'd' ;\n");
		let  g = new  Grammar(
			"parser grammar T;\n"+
			"a : (A B | A B | C) D ;");
		this.checkMatchedAlt(lg, g, "abd", 1);
		this.checkMatchedAlt(lg, g, "abdc", 1);
		this.checkMatchedAlt(lg, g, "cd", 3);
	}

	@Test
public  testAmbigAltChooseFirst2():  void {
		let  lg = new  LexerGrammar(
			"lexer grammar L;\n" +
			"A : 'a' ;\n" +
			"B : 'b' ;\n" +
			"C : 'c' ;\n" +
			"D : 'd' ;\n");
		let  g = new  Grammar(
			"parser grammar T;\n"+
			"a : A B | A B | A B C ;");

		this.checkMatchedAlt(lg, g, "ab", 1);
		this.checkMatchedAlt(lg, g, "abc", 3);

		this.checkMatchedAlt(lg, g, "abd", 1);
		this.checkMatchedAlt(lg, g, "abcd", 3);
	}

	@Test
public  testAmbigAltChooseFirst2WithEOF():  void {
		let  lg = new  LexerGrammar(
			"lexer grammar L;\n" +
			"A : 'a' ;\n" +
			"B : 'b' ;\n" +
			"C : 'c' ;\n" +
			"D : 'd' ;\n");
		let  g = new  Grammar(
			"parser grammar T;\n"+
			"a : (A B | A B | A B C) EOF;");

		this.checkMatchedAlt(lg, g, "ab", 1);
		this.checkMatchedAlt(lg, g, "abc", 3);

		try {
			this.checkMatchedAlt(lg, g, "abd", 1);
			fail();
		} catch (re) {
if (re instanceof NoViableAltException) {
			assertEquals(2, re.getOffendingToken().getTokenIndex());
			assertEquals(4, re.getOffendingToken().getType());
		} else {
	throw re;
	}
}
	}

	@Test
public  testSimpleLoop():  void {
		let  lg = new  LexerGrammar(
			"lexer grammar L;\n" +
			"A : 'a' ;\n" +
			"B : 'b' ;\n" +
			"C : 'c' ;\n" +
			"D : 'd' ;\n");
		let  g = new  Grammar(
			"parser grammar T;\n"+
			"a : A+ B ;");
		this.checkMatchedAlt(lg, g, "ab", 1);
		this.checkMatchedAlt(lg, g, "aab", 1);
		this.checkMatchedAlt(lg, g, "aaaaaab", 1);
		this.checkMatchedAlt(lg, g, "aabd", 1);
	}

	@Test
public  testCommonLeftPrefix():  void {
		let  lg = new  LexerGrammar(
			"lexer grammar L;\n" +
			"A : 'a' ;\n" +
			"B : 'b' ;\n" +
			"C : 'c' ;\n");
		let  g = new  Grammar(
			"parser grammar T;\n"+
			"a : A B | A C ;");
		this.checkMatchedAlt(lg, g, "ab", 1);
		this.checkMatchedAlt(lg, g, "ac", 2);
	}

	@Test
public  testArbitraryLeftPrefix():  void {
		let  lg = new  LexerGrammar(
			"lexer grammar L;\n" +
			"A : 'a' ;\n" +
			"B : 'b' ;\n" +
			"C : 'c' ;\n");
		let  g = new  Grammar(
			"parser grammar T;\n"+
			"a : A+ B | A+ C ;");
		this.checkMatchedAlt(lg, g, "aac", 2);
	}

	@Test
public  testRecursiveLeftPrefix():  void {
		let  lg = new  LexerGrammar(
			"lexer grammar L;\n" +
			"A : 'a' ;\n" +
			"B : 'b' ;\n" +
			"C : 'c' ;\n" +
			"LP : '(' ;\n" +
			"RP : ')' ;\n" +
			"INT : '0'..'9'+ ;\n"
		);
		let  g = new  Grammar(
			"parser grammar T;\n"+
			"tokens {A,B,C,LP,RP,INT}\n" +
			"a : e B | e C ;\n" +
			"e : LP e RP\n" +
			"  | INT\n" +
			"  ;");
		this.checkMatchedAlt(lg, g, "34b", 1);
		this.checkMatchedAlt(lg, g, "34c", 2);
		this.checkMatchedAlt(lg, g, "(34)b", 1);
		this.checkMatchedAlt(lg, g, "(34)c", 2);
		this.checkMatchedAlt(lg, g, "((34))b", 1);
		this.checkMatchedAlt(lg, g, "((34))c", 2);
	}

	public  checkMatchedAlt(lg: LexerGrammar, /* final */  g: Grammar,
								inputString: string,
								expected: number):  void
	{
		let  lexatn = createATN(lg, true);
		let  lexInterp = new  LexerATNSimulator(lexatn, [ new  DFA(lexatn.modeToStartState.get(Lexer.DEFAULT_MODE)) ],null);
		let  types = getTokenTypesViaATN(inputString, lexInterp);
//		System.out.println(types);

		g.importVocab(lg);

		let  f = new  ParserATNFactory(g);
		let  atn = f.createATN();

		let  input = new  MockIntTokenStream(types);
//		System.out.println("input="+input.types);
		let  interp = new  ParserInterpreterForTesting(g, input);
		let  startState = atn.ruleToStartState[g.getRule("a").index];
		if ( startState.transition(0).target instanceof BlockStartState ) {
			startState = startState.transition(0).target;
		}

		let  dot = new  DOTGenerator(g);
//		System.out.println(dot.getDOT(atn.ruleToStartState[g.getRule("a").index]));
		let  r = g.getRule("e");
//		if ( r!=null ) System.out.println(dot.getDOT(atn.ruleToStartState[r.index]));

		let  result = interp.matchATN(input, startState);
		assertEquals(expected, result);
	}
}
