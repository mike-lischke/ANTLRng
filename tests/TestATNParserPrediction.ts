/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */


/* eslint-disable jsdoc/require-returns, jsdoc/require-param */


import { Lexer, NoViableAltException, ParserRuleContext, TokenStream, ATN, LexerATNSimulator, PredictionContextCache, DFA, IntegerList } from "antlr4ng";



// NOTICE: TOKENS IN LEXER, PARSER MUST BE SAME OR TOKEN TYPE MISMATCH
// NOTICE: TOKENS IN LEXER, PARSER MUST BE SAME OR TOKEN TYPE MISMATCH
// NOTICE: TOKENS IN LEXER, PARSER MUST BE SAME OR TOKEN TYPE MISMATCH

export  class TestATNParserPrediction {
	@Test
public  testAorB():  void {
		let  lg = new  LexerGrammar(
		"lexer grammar L;\n" +
		"A : 'a' ;\n" +
		"B : 'b' ;\n" +
		"C : 'c' ;\n");
		let  g = new  Grammar(
		"parser grammar T;\n"+
		"a : A{;} | B ;");
		let  decision = 0;
		this.checkPredictedAlt(lg, g, decision, "a", 1);
		this.checkPredictedAlt(lg, g, decision, "b", 2);

		// After matching these inputs for decision, what is DFA after each prediction?
		let  inputs = [
		"a",
		"b",
		"a"
		];
		let  dfa = [
		"s0-'a'->:s1=>1\n",

		"s0-'a'->:s1=>1\n" +
		"s0-'b'->:s2=>2\n",

		"s0-'a'->:s1=>1\n" + // don't change after it works
		"s0-'b'->:s2=>2\n",
		];
		this.checkDFAConstruction(lg, g, decision, inputs, dfa);
	}

	@Test
public  testEmptyInput():  void {
		let  lg = new  LexerGrammar(
		"lexer grammar L;\n" +
		"A : 'a' ;\n" +
		"B : 'b' ;\n" +
		"C : 'c' ;\n");
		let  g = new  Grammar(
		"parser grammar T;\n"+
		"a : A | ;");
		let  decision = 0;
		this.checkPredictedAlt(lg, g, decision, "a", 1);
		this.checkPredictedAlt(lg, g, decision, "", 2);

		// After matching these inputs for decision, what is DFA after each prediction?
		let  inputs = [
		"a",
		"",
		];
		let  dfa = [
		"s0-'a'->:s1=>1\n",

		"s0-EOF->:s2=>2\n" +
		"s0-'a'->:s1=>1\n",
		];
		this.checkDFAConstruction(lg, g, decision, inputs, dfa);
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
		this.checkPredictedAlt(lg, g, 0, "a", 1);
		this.checkPredictedAlt(lg, g, 0, "ab", 2);
		this.checkPredictedAlt(lg, g, 0, "abc", 2);

		let  inputs = [
		"a",
		"ab",
		"abc"
		];
		let  dfa = [
		"s0-'a'->s1\n" +
		"s1-EOF->:s2=>1\n",

		"s0-'a'->s1\n" +
		"s1-EOF->:s2=>1\n" +
		"s1-'b'->:s3=>2\n",

		"s0-'a'->s1\n" +
		"s1-EOF->:s2=>1\n" +
		"s1-'b'->:s3=>2\n"
		];
		this.checkDFAConstruction(lg, g, 0, inputs, dfa);
	}

	@Test
public  testRuleRefxory():  void {
		let  lg = new  LexerGrammar(
		"lexer grammar L;\n" +
		"A : 'a' ;\n" +
		"B : 'b' ;\n" +
		"C : 'c' ;\n");
		let  g = new  Grammar(
		"parser grammar T;\n"+
		"a : x | y ;\n" +
		"x : A ;\n" +
		"y : B ;\n");
		let  decision = 0;
		this.checkPredictedAlt(lg, g, decision, "a", 1);
		this.checkPredictedAlt(lg, g, decision, "b", 2);

		// After matching these inputs for decision, what is DFA after each prediction?
		let  inputs = [
		"a",
		"b",
		"a"
		];
		let  dfa = [
		"s0-'a'->:s1=>1\n",

		"s0-'a'->:s1=>1\n" +
		"s0-'b'->:s2=>2\n",

		"s0-'a'->:s1=>1\n" + // don't change after it works
		"s0-'b'->:s2=>2\n",
		];
		this.checkDFAConstruction(lg, g, decision, inputs, dfa);
	}

	@Test
public  testOptionalRuleChasesGlobalFollow():  void {
		let  lg = new  LexerGrammar(
		"lexer grammar L;\n" +
		"A : 'a' ;\n" +
		"B : 'b' ;\n" +
		"C : 'c' ;\n");
		let  g = new  Grammar(
		"parser grammar T;\n"+
		"tokens {A,B,C}\n" +
		"a : x B ;\n" +
		"b : x C ;\n" +
		"x : A | ;\n");
		let  decision = 0;
		this.checkPredictedAlt(lg, g, decision, "a", 1);
		this.checkPredictedAlt(lg, g, decision, "b", 2);
		this.checkPredictedAlt(lg, g, decision, "c", 2);

		// After matching these inputs for decision, what is DFA after each prediction?
		let  inputs = [
		"a",
		"b",
		"c",
		"c",
		];
		let  dfa = [
		"s0-'a'->:s1=>1\n",

		"s0-'a'->:s1=>1\n" +
		"s0-'b'->:s2=>2\n",

		"s0-'a'->:s1=>1\n" +
		"s0-'b'->:s2=>2\n" +
		"s0-'c'->:s3=>2\n",

		"s0-'a'->:s1=>1\n" +
		"s0-'b'->:s2=>2\n" +
		"s0-'c'->:s3=>2\n",
		];
		this.checkDFAConstruction(lg, g, decision, inputs, dfa);
	}

	@Test
public  testLL1Ambig():  void {
		let  lg = new  LexerGrammar(
		"lexer grammar L;\n" +
		"A : 'a' ;\n" +
		"B : 'b' ;\n" +
		"C : 'c' ;\n");
		let  g = new  Grammar(
		"parser grammar T;\n"+
		"a : A | A | A B ;");
		let  decision = 0;
		this.checkPredictedAlt(lg, g, decision, "a", 1);
		this.checkPredictedAlt(lg, g, decision, "ab", 3);

		// After matching these inputs for decision, what is DFA after each prediction?
		let  inputs = [
		"a",
		"ab",
		"ab"
		];
		let  dfa = [
		"s0-'a'->s1\n" +
		"s1-EOF->:s2^=>1\n",

		"s0-'a'->s1\n" +
		"s1-EOF->:s2^=>1\n" +
		"s1-'b'->:s3=>3\n",

		"s0-'a'->s1\n" +
		"s1-EOF->:s2^=>1\n" +
		"s1-'b'->:s3=>3\n",
		];
		this.checkDFAConstruction(lg, g, decision, inputs, dfa);
	}

	@Test
public  testLL2Ambig():  void {
		let  lg = new  LexerGrammar(
		"lexer grammar L;\n" +
		"A : 'a' ;\n" +
		"B : 'b' ;\n" +
		"C : 'c' ;\n");
		let  g = new  Grammar(
		"parser grammar T;\n"+
		"a : A B | A B | A B C ;");
		let  decision = 0;
		this.checkPredictedAlt(lg, g, decision, "ab", 1);
		this.checkPredictedAlt(lg, g, decision, "abc", 3);

		// After matching these inputs for decision, what is DFA after each prediction?
		let  inputs = [
		"ab",
		"abc",
		"ab"
		];
		let  dfa = [
		"s0-'a'->s1\n" +
		"s1-'b'->s2\n" +
		"s2-EOF->:s3^=>1\n",

		"s0-'a'->s1\n" +
		"s1-'b'->s2\n" +
		"s2-EOF->:s3^=>1\n" +
		"s2-'c'->:s4=>3\n",

		"s0-'a'->s1\n" +
		"s1-'b'->s2\n" +
		"s2-EOF->:s3^=>1\n" +
		"s2-'c'->:s4=>3\n",
		];
		this.checkDFAConstruction(lg, g, decision, inputs, dfa);
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
		let  decision = 0;
		this.checkPredictedAlt(lg, g, decision, "34b", 1);
		this.checkPredictedAlt(lg, g, decision, "34c", 2);
		this.checkPredictedAlt(lg, g, decision, "((34))b", 1);
		this.checkPredictedAlt(lg, g, decision, "((34))c", 2);

		// After matching these inputs for decision, what is DFA after each prediction?
		let  inputs = [
		"34b",
		"34c",
		"((34))b",
		"((34))c"
		];
		let  dfa = [
		"s0-INT->s1\n" +
		"s1-'b'->:s2=>1\n",

		"s0-INT->s1\n" +
		"s1-'b'->:s2=>1\n" +
		"s1-'c'->:s3=>2\n",

		"s0-'('->s4\n" +
		"s0-INT->s1\n" +
		"s1-'b'->:s2=>1\n" +
		"s1-'c'->:s3=>2\n" +
		"s4-'('->s5\n" +
		"s5-INT->s6\n" +
		"s6-')'->s7\n" +
		"s7-')'->s1\n",

		"s0-'('->s4\n" +
		"s0-INT->s1\n" +
		"s1-'b'->:s2=>1\n" +
		"s1-'c'->:s3=>2\n" +
		"s4-'('->s5\n" +
		"s5-INT->s6\n" +
		"s6-')'->s7\n" +
		"s7-')'->s1\n",
		];
		this.checkDFAConstruction(lg, g, decision, inputs, dfa);
	}

	@Test
public  testRecursiveLeftPrefixWithAorABIssue():  void {
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
		"a : e A | e A B ;\n" +
		"e : LP e RP\n" +
		"  | INT\n" +
		"  ;");
		let  decision = 0;
		this.checkPredictedAlt(lg, g, decision, "34a", 1);
		this.checkPredictedAlt(lg, g, decision, "34ab", 2); // PEG would miss this one!
		this.checkPredictedAlt(lg, g, decision, "((34))a", 1);
		this.checkPredictedAlt(lg, g, decision, "((34))ab", 2);

		// After matching these inputs for decision, what is DFA after each prediction?
		let  inputs = [
		"34a",
		"34ab",
		"((34))a",
		"((34))ab",
		];
		let  dfa = [
		"s0-INT->s1\n" +
		"s1-'a'->s2\n" +
		"s2-EOF->:s3=>1\n",

		"s0-INT->s1\n" +
		"s1-'a'->s2\n" +
		"s2-EOF->:s3=>1\n" +
		"s2-'b'->:s4=>2\n",

		"s0-'('->s5\n" +
		"s0-INT->s1\n" +
		"s1-'a'->s2\n" +
		"s2-EOF->:s3=>1\n" +
		"s2-'b'->:s4=>2\n" +
		"s5-'('->s6\n" +
		"s6-INT->s7\n" +
		"s7-')'->s8\n" +
		"s8-')'->s1\n",

		"s0-'('->s5\n" +
		"s0-INT->s1\n" +
		"s1-'a'->s2\n" +
		"s2-EOF->:s3=>1\n" +
		"s2-'b'->:s4=>2\n" +
		"s5-'('->s6\n" +
		"s6-INT->s7\n" +
		"s7-')'->s8\n" +
		"s8-')'->s1\n",
		];
		this.checkDFAConstruction(lg, g, decision, inputs, dfa);
	}

	@Test
public  testContinuePrediction():  void {
		// Sam found prev def of ambiguity was too restrictive.
		// E.g., (13, 1, []), (13, 2, []), (12, 2, []) should not
		// be declared ambig since (12, 2, []) can take us to
		// unambig state maybe. keep going.
		let  lg = new  LexerGrammar(
		"lexer grammar L;\n" +
		"ID : 'a'..'z' ;\n" + // one char
		"SEMI : ';' ;\n"+
		"INT : '0'..'9'+ ;\n"
		);
		let  g = new  Grammar(
		"parser grammar T;\n"+
		"tokens {ID,SEMI,INT}\n" +
		"a : (ID | ID ID?) SEMI ;");
		let  decision = 1;
		this.checkPredictedAlt(lg, g, decision, "a;", 1);
		this.checkPredictedAlt(lg, g, decision, "ab;", 2);
	}

	@Test
public  testContinuePrediction2():  void {
		// ID is ambig for first two alts, but ID SEMI lets us move forward with alt 3
		let  lg = new  LexerGrammar(
		"lexer grammar L;\n" +
		"ID : 'a'..'z' ;\n" + // one char
		"SEMI : ';' ;\n"+
		"INT : '0'..'9'+ ;\n"
		);
		let  g = new  Grammar(
		"parser grammar T;\n"+
		"tokens {ID,SEMI,INT}\n" +
		"a : ID | ID | ID SEMI ;\n");
		let  decision = 0;
		this.checkPredictedAlt(lg, g, decision, "a", 1);
		this.checkPredictedAlt(lg, g, decision, "a;", 3);
	}

	@Test
public  testAltsForLRRuleComputation():  void {
		let  g = new  Grammar(
		"grammar T;\n" +
		"e : e '*' e\n" +
		"  | INT\n" +
		"  | e '+' e\n" +
		"  | ID\n" +
		"  ;\n" +
		"ID : [a-z]+ ;\n" +
		"INT : [0-9]+ ;\n" +
		"WS : [ \\r\\t\\n]+ ;");
		let  e = g.getRule("e");
		assertTrue(e instanceof LeftRecursiveRule);
		let  lr = e as LeftRecursiveRule;
		assertEquals("[0, 2, 4]", Arrays.toString(lr.getPrimaryAlts()));
		assertEquals("[0, 1, 3]", Arrays.toString(lr.getRecursiveOpAlts()));
	}

	@Test
public  testAltsForLRRuleComputation2():  void {
		let  g = new  Grammar(
		"grammar T;\n" +
		"e : INT\n" +
		"  | e '*' e\n" +
		"  | ID\n" +
		"  ;\n" +
		"ID : [a-z]+ ;\n" +
		"INT : [0-9]+ ;\n" +
		"WS : [ \\r\\t\\n]+ ;");
		let  e = g.getRule("e");
		assertTrue(e instanceof LeftRecursiveRule);
		let  lr = e as LeftRecursiveRule;
		assertEquals("[0, 1, 3]", Arrays.toString(lr.getPrimaryAlts()));
		assertEquals("[0, 2]", Arrays.toString(lr.getRecursiveOpAlts()));
	}

	@Test
public  testAltsForLRRuleComputation3():  void {
		let  g = new  Grammar(
		"grammar T;\n" +
		"random : 'blort';\n" + // should have no effect
		"e : '--' e\n" +
		"  | e '*' e\n" +
		"  | e '+' e\n" +
		"  | e '--'\n" +
		"  | ID\n" +
		"  ;\n" +
		"ID : [a-z]+ ;\n" +
		"INT : [0-9]+ ;\n" +
		"WS : [ \\r\\t\\n]+ ;");
		let  e = g.getRule("e");
		assertTrue(e instanceof LeftRecursiveRule);
		let  lr = e as LeftRecursiveRule;
		assertEquals("[0, 1, 5]", Arrays.toString(lr.getPrimaryAlts()));
		assertEquals("[0, 2, 3, 4]", Arrays.toString(lr.getRecursiveOpAlts()));
	}

	/** first check that the ATN predicts right alt.
	 *  Then check adaptive prediction.
	 */
	public  checkPredictedAlt(lg: LexerGrammar, g: Grammar, decision: number,
	                              inputString: string, expectedAlt: number):  void
	{
		let  lexatn = createATN(lg, true);
		let  lexInterp =
		new  LexerATNSimulator(lexatn, [ new  DFA(lexatn.modeToStartState.get(Lexer.DEFAULT_MODE)) ],new  PredictionContextCache());
		let  types = getTokenTypesViaATN(inputString, lexInterp);
//		System.out.println(types);

		semanticProcess(lg);
		g.importVocab(lg);
		semanticProcess(g);

		let  f = new  ParserATNFactory(g);
		let  atn = f.createATN();

		let  dot = new  DOTGenerator(g);

		let  r = g.getRule("a");
//		if ( r!=null) System.out.println(dot.getDOT(atn.ruleToStartState[r.index]));
		r = g.getRule("b");
//		if ( r!=null) System.out.println(dot.getDOT(atn.ruleToStartState[r.index]));
		r = g.getRule("e");
//		if ( r!=null) System.out.println(dot.getDOT(atn.ruleToStartState[r.index]));
		r = g.getRule("ifstat");
//		if ( r!=null) System.out.println(dot.getDOT(atn.ruleToStartState[r.index]));
		r = g.getRule("block");
//		if ( r!=null) System.out.println(dot.getDOT(atn.ruleToStartState[r.index]));

		// Check ATN prediction
//		ParserATNSimulator interp = new ParserATNSimulator(atn);
		let  input = new  MockIntTokenStream(types);
		let  interp = new  ParserInterpreterForTesting(g, input);
		let  alt = interp.adaptivePredict(input, decision, ParserRuleContext.EMPTY);

		assertEquals(expectedAlt, alt);

		// Check adaptive prediction
		input.seek(0);
		alt = interp.adaptivePredict(input, decision, null);
		assertEquals(expectedAlt, alt);
		// run 2x; first time creates DFA in atn
		input.seek(0);
		alt = interp.adaptivePredict(input, decision, null);
		assertEquals(expectedAlt, alt);
	}

	public  checkDFAConstruction(lg: LexerGrammar, g: Grammar, decision: number,
	                                 inputString: string[], dfaString: string[]):  void
	{
//		Tool.internalOption_ShowATNConfigsInDFA = true;
		let  lexatn = createATN(lg, true);
		let  lexInterp =
		new  LexerATNSimulator(lexatn, [ new  DFA(lexatn.getDecisionState(Lexer.DEFAULT_MODE)) ], new  PredictionContextCache());

		semanticProcess(lg);
		g.importVocab(lg);
		semanticProcess(g);

		let  interp = new  ParserInterpreterForTesting(g, null);
		for (let  i=0; i<inputString.length; i++) {
			// Check DFA
			let  types = getTokenTypesViaATN(inputString[i], lexInterp);
//			System.out.println(types);
			let  input = new  MockIntTokenStream(types);
			try {
				interp.adaptivePredict(input, decision, ParserRuleContext.EMPTY);
			} catch (nvae) {
if (nvae instanceof NoViableAltException) {
				nvae.printStackTrace(System.err);
			} else {
	throw nvae;
	}
}
			let  dfa = interp.parser.decisionToDFA[decision];
			assertEquals(dfaString[i], dfa.toString(g.getVocabulary()));
		}
	}
}
