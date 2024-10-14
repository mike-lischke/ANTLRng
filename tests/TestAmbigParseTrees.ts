/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */


/* eslint-disable jsdoc/require-returns, jsdoc/require-param */


import { ANTLRInputStream, CommonTokenStream, LexerInterpreter, ParserInterpreter, ParserRuleContext, ATNState, AmbiguityInfo, BasicBlockStartState, DecisionInfo, DecisionState, PredictionMode, RuleStartState, Transition, ParseTree } from "antlr4ng";




export  class TestAmbigParseTrees {
	@Test
public  testParseDecisionWithinAmbiguousStartRule():  void {
		let  lg = new  LexerGrammar(
			"lexer grammar L;\n" +
			"A : 'a' ;\n" +
			"B : 'b' ;\n" +
			"C : 'c' ;\n");
		let  g = new  Grammar(
			"parser grammar T;\n" +
			"s : A x C" +
			"  | A B C" +
			"  ;" +
			"x : B ; \n",
			lg);

		this.testInterpAtSpecificAlt(lg, g, "s", 1, "abc", "(s:1 a (x:1 b) c)");
		this.testInterpAtSpecificAlt(lg, g, "s", 2, "abc", "(s:2 a b c)");
	}

	@Test
public  testAmbigAltsAtRoot():  void {
		let  lg = new  LexerGrammar(
			"lexer grammar L;\n" +
			"A : 'a' ;\n" +
			"B : 'b' ;\n" +
			"C : 'c' ;\n");
		let  g = new  Grammar(
			"parser grammar T;\n" +
			"s : A x C" +
			"  | A B C" +
			"  ;" +
			"x : B ; \n",
			lg);

		let  startRule = "s";
		let  input = "abc";
		let  expectedAmbigAlts = "{1, 2}";
		let  decision = 0;
		let  expectedOverallTree = "(s:1 a (x:1 b) c)";
		let  expectedParseTrees = ["(s:1 a (x:1 b) c)",
									   "(s:2 a b c)"];

		this.testAmbiguousTrees(lg, g, startRule, input, decision,
						   expectedAmbigAlts,
						   expectedOverallTree, expectedParseTrees);
	}

	@Test
public  testAmbigAltsNotAtRoot():  void {
		let  lg = new  LexerGrammar(
			"lexer grammar L;\n" +
			"A : 'a' ;\n" +
			"B : 'b' ;\n" +
			"C : 'c' ;\n");
		let  g = new  Grammar(
			"parser grammar T;\n" +
			"s : x ;" +
			"x : y ;" +
			"y : A z C" +
			"  | A B C" +
			"  ;" +
			"z : B ; \n",
			lg);

		let  startRule = "s";
		let  input = "abc";
		let  expectedAmbigAlts = "{1, 2}";
		let  decision = 0;
		let  expectedOverallTree = "(s:1 (x:1 (y:1 a (z:1 b) c)))";
		let  expectedParseTrees = ["(y:1 a (z:1 b) c)",
									   "(y:2 a b c)"];

		this.testAmbiguousTrees(lg, g, startRule, input, decision,
						   expectedAmbigAlts,
						   expectedOverallTree, expectedParseTrees);
	}

	@Test
public  testAmbigAltDipsIntoOuterContextToRoot():  void {
		let  lg = new  LexerGrammar(
			"lexer grammar L;\n" +
			"SELF : 'self' ;\n" +
			"ID : [a-z]+ ;\n" +
			"DOT : '.' ;\n");
		let  g = new  Grammar(
			"parser grammar T;\n" +
			"e : p (DOT ID)* ;\n"+
			"p : SELF" +
			"  | SELF DOT ID" +
			"  ;",
			lg);

		let  startRule = "e";
		let  input = "self.x";
		let  expectedAmbigAlts = "{1, 2}";
		let  decision = 1; // decision in p
		let  expectedOverallTree = "(e:1 (p:1 self) . x)";
		let  expectedParseTrees = ["(e:1 (p:1 self) . x)",
									   "(p:2 self . x)"];

		this.testAmbiguousTrees(lg, g, startRule, input, decision,
						   expectedAmbigAlts,
						   expectedOverallTree, expectedParseTrees);
	}

	@Test
public  testAmbigAltDipsIntoOuterContextBelowRoot():  void {
		let  lg = new  LexerGrammar(
			"lexer grammar L;\n" +
			"SELF : 'self' ;\n" +
			"ID : [a-z]+ ;\n" +
			"DOT : '.' ;\n");
		let  g = new  Grammar(
			"parser grammar T;\n" +
			"s : e ;\n"+
			"e : p (DOT ID)* ;\n"+
			"p : SELF" +
			"  | SELF DOT ID" +
			"  ;",
			lg);

		let  startRule = "s";
		let  input = "self.x";
		let  expectedAmbigAlts = "{1, 2}";
		let  decision = 1; // decision in p
		let  expectedOverallTree = "(s:1 (e:1 (p:1 self) . x))";
		let  expectedParseTrees = ["(e:1 (p:1 self) . x)", // shouldn't include s
									   "(p:2 self . x)"];      // shouldn't include e

		this.testAmbiguousTrees(lg, g, startRule, input, decision,
						   expectedAmbigAlts,
						   expectedOverallTree, expectedParseTrees);
	}

	@Test
public  testAmbigAltInLeftRecursiveBelowStartRule():  void {
		let  lg = new  LexerGrammar(
			"lexer grammar L;\n" +
			"SELF : 'self' ;\n" +
			"ID : [a-z]+ ;\n" +
			"DOT : '.' ;\n");
		let  g = new  Grammar(
			"parser grammar T;\n" +
			"s : e ;\n" +
			"e : p | e DOT ID ;\n"+
			"p : SELF" +
			"  | SELF DOT ID" +
			"  ;",
			lg);

		let  startRule = "s";
		let  input = "self.x";
		let  expectedAmbigAlts = "{1, 2}";
		let  decision = 1; // decision in p
		let  expectedOverallTree = "(s:1 (e:2 (e:1 (p:1 self)) . x))";
		let  expectedParseTrees = ["(e:2 (e:1 (p:1 self)) . x)",
									   "(p:2 self . x)"];

		this.testAmbiguousTrees(lg, g, startRule, input, decision,
						   expectedAmbigAlts,
						   expectedOverallTree, expectedParseTrees);
	}

	@Test
public  testAmbigAltInLeftRecursiveStartRule():  void {
		let  lg = new  LexerGrammar(
			"lexer grammar L;\n" +
			"SELF : 'self' ;\n" +
			"ID : [a-z]+ ;\n" +
			"DOT : '.' ;\n");
		let  g = new  Grammar(
			"parser grammar T;\n" +
			"e : p | e DOT ID ;\n"+
			"p : SELF" +
			"  | SELF DOT ID" +
			"  ;",
			lg);

		let  startRule = "e";
		let  input = "self.x";
		let  expectedAmbigAlts = "{1, 2}";
		let  decision = 1; // decision in p
		let  expectedOverallTree = "(e:2 (e:1 (p:1 self)) . x)";
		let  expectedParseTrees = ["(e:2 (e:1 (p:1 self)) . x)",
									   "(p:2 self . x)"]; // shows just enough for self.x

		this.testAmbiguousTrees(lg, g, startRule, input, decision,
						   expectedAmbigAlts,
						   expectedOverallTree, expectedParseTrees);
	}

	public  testAmbiguousTrees(lg: LexerGrammar, g: Grammar,
								   startRule: string, input: string, decision: number,
								   expectedAmbigAlts: string,
								   overallTree: string,
								   expectedParseTrees: string[]):  void
	{
		let  nodeTextProvider = new  InterpreterTreeTextProvider(g.getRuleNames());

		let  lexEngine = lg.createLexerInterpreter(new  ANTLRInputStream(input));
		let  tokens = new  CommonTokenStream(lexEngine);
		 let  parser = g.createGrammarParserInterpreter(tokens);
		parser.setProfile(true);
		parser.getInterpreter().setPredictionMode(PredictionMode.LL_EXACT_AMBIG_DETECTION);

		// PARSE
		let  ruleIndex = g.rules.get(startRule).index;
		let  parseTree = parser.parse(ruleIndex);
		assertEquals(overallTree, Trees.toStringTree(parseTree, nodeTextProvider));
		System.out.println();

		let  decisionInfo = parser.getParseInfo().getDecisionInfo();
		let  ambiguities = decisionInfo[decision].ambiguities;
		assertEquals(1, ambiguities.size());
		let  ambiguityInfo = ambiguities.get(0);

		let  ambiguousParseTrees =
			GrammarParserInterpreter.getAllPossibleParseTrees(g,
															  parser,
															  tokens,
															  decision,
															  ambiguityInfo.ambigAlts,
															  ambiguityInfo.startIndex,
															  ambiguityInfo.stopIndex,
															  ruleIndex);
		assertEquals(expectedAmbigAlts, ambiguityInfo.ambigAlts.toString());
		assertEquals(ambiguityInfo.ambigAlts.cardinality(), ambiguousParseTrees.size());

		for (let  i = 0; i<ambiguousParseTrees.size(); i++) {
			let  t = ambiguousParseTrees.get(i);
			assertEquals(expectedParseTrees[i], Trees.toStringTree(t, nodeTextProvider));
		}
	}

	protected  testInterpAtSpecificAlt(lg: LexerGrammar, g: Grammar,
								 startRule: string, startAlt: number,
								 input: string,
								 expectedParseTree: string): void
	{
		let  lexEngine = lg.createLexerInterpreter(new  ANTLRInputStream(input));
		let  tokens = new  CommonTokenStream(lexEngine);
		let  parser = g.createGrammarParserInterpreter(tokens);
		let  ruleStartState = g.atn.ruleToStartState[g.getRule(startRule).index];
		let  tr = ruleStartState.transition(0);
		let  t2 = tr.target;
		if ( !(t2 instanceof BasicBlockStartState) ) {
			throw new  IllegalArgumentException("rule has no decision: "+startRule);
		}
		parser.addDecisionOverride((t2 as DecisionState).decision, 0, startAlt);
		let  t = parser.parse(g.rules.get(startRule).index);
		let  nodeTextProvider = new  InterpreterTreeTextProvider(g.getRuleNames());
		assertEquals(expectedParseTree, Trees.toStringTree(t, nodeTextProvider));
	}
}
