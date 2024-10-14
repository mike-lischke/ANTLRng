/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */


/* eslint-disable jsdoc/require-returns, jsdoc/require-param */


import { ANTLRInputStream, CommonTokenStream, LexerInterpreter, ParserRuleContext, DecisionInfo, LookaheadEventInfo, ParseTree } from "antlr4ng";



export  class TestLookaheadTrees {
	public static readonly  lexerText =
		"lexer grammar L;\n" +
		"DOT  : '.' ;\n" +
		"SEMI : ';' ;\n" +
		"BANG : '!' ;\n" +
		"PLUS : '+' ;\n" +
		"LPAREN : '(' ;\n" +
		"RPAREN : ')' ;\n" +
		"MULT : '*' ;\n" +
		"ID : [a-z]+ ;\n" +
		"INT : [0-9]+ ;\n" +
		"WS : [ \\r\\t\\n]+ ;\n";

	@Test
public  testAlts():  void {
		let  lg = new  LexerGrammar(TestLookaheadTrees.lexerText);
		let  g = new  Grammar(
			"parser grammar T;\n" +
			"s : e SEMI EOF ;\n" +
			"e : ID DOT ID\n"+
			"  | ID LPAREN RPAREN\n"+
			"  ;\n",
			lg);

		let  startRuleName = "s";
		let  decision = 0;

		this.testLookaheadTrees(lg, g, "a.b;", startRuleName, decision,
						    ["(e:1 a . b)", "(e:2 a <error .>)"]);
	}

	@Test
public  testAlts2():  void {
		let  lg = new  LexerGrammar(TestLookaheadTrees.lexerText);
		let  g = new  Grammar(
			"parser grammar T;\n" +
			"s : e? SEMI EOF ;\n" +
			"e : ID\n" +
			"  | e BANG" +
			"  ;\n",
			lg);

		let  startRuleName = "s";
		let  decision = 1; // (...)* in e.

		this.testLookaheadTrees(lg, g, "a;", startRuleName, decision,
						    ["(e:2 (e:1 a) <error ;>)", // Decision for alt 1 is error as no ! char, but alt 2 (exit) is good.
										 "(s:1 (e:1 a) ; <EOF>)"]); // root s:1 is included to show ';' node
	}

	@Test
public  testIncludeEOF():  void {
		let  lg = new  LexerGrammar(TestLookaheadTrees.lexerText);
		let  g = new  Grammar(
			"parser grammar T;\n" +
			"s : e ;\n" +
			"e : ID DOT ID EOF\n"+
			"  | ID DOT ID EOF\n"+
			"  ;\n",
			lg);

		let  decision = 0;
		this.testLookaheadTrees(lg, g, "a.b", "s", decision,
						    ["(e:1 a . b <EOF>)", "(e:2 a . b <EOF>)"]);
	}

	@Test
public  testCallLeftRecursiveRule():  void {
		let  lg = new  LexerGrammar(TestLookaheadTrees.lexerText);
		let  g = new  Grammar(
			"parser grammar T;\n" +
			"s : a BANG EOF;\n" +
			"a : e SEMI \n" +
			"  | ID SEMI \n" +
			"  ;" +
			"e : e MULT e\n" +
			"  | e PLUS e\n" +
			"  | e DOT e\n" +
			"  | ID\n" +
			"  | INT\n" +
			"  ;\n",
			lg);

		let  decision = 0;
		this.testLookaheadTrees(lg, g, "x;!", "s", decision,
						    ["(a:1 (e:4 x) ;)",
										 "(a:2 x ;)"]); // shouldn't include BANG, EOF
		decision = 2; // (...)* in e
		this.testLookaheadTrees(lg, g, "x+1;!", "s", decision,
						    ["(e:1 (e:4 x) <error +>)",
										 "(e:2 (e:4 x) + (e:5 1))",
										 "(e:3 (e:4 x) <error +>)"]);
	}

	public  testLookaheadTrees(lg: LexerGrammar, g: Grammar,
								   input: string,
								   startRuleName: string,
								   decision: number,
								   expectedTrees: string[]):  void
	{
		let  startRuleIndex = g.getRule(startRuleName).index;
		let  nodeTextProvider =
					new  InterpreterTreeTextProvider(g.getRuleNames());

		let  lexEngine = lg.createLexerInterpreter(new  ANTLRInputStream(input));
		let  tokens = new  CommonTokenStream(lexEngine);
		let  parser = g.createGrammarParserInterpreter(tokens);
		parser.setProfile(true);
		let  t = parser.parse(startRuleIndex);

		let  decisionInfo = parser.getParseInfo().getDecisionInfo()[decision];
		let  lookaheadEventInfo = decisionInfo.SLL_MaxLookEvent;

		let  lookaheadParseTrees =
			GrammarParserInterpreter.getLookaheadParseTrees(g, parser, tokens, startRuleIndex, lookaheadEventInfo.decision,
															lookaheadEventInfo.startIndex, lookaheadEventInfo.stopIndex);

		assertEquals(expectedTrees.length, lookaheadParseTrees.size());
		for (let  i = 0; i < lookaheadParseTrees.size(); i++) {
			let  lt = lookaheadParseTrees.get(i);
			assertEquals(expectedTrees[i], Trees.toStringTree(lt, nodeTextProvider));
		}
	}
}
