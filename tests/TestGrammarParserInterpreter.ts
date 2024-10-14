/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/* eslint-disable jsdoc/require-returns, jsdoc/require-param */


import { ANTLRInputStream, CommonTokenStream, InterpreterRuleContext, LexerInterpreter, ParseTree } from "antlr4ng";



/** Tests to ensure GrammarParserInterpreter subclass of ParserInterpreter
 *  hasn't messed anything up.
 */
export  class TestGrammarParserInterpreter {
	public static readonly  lexerText = "lexer grammar L;\n" +
										   "PLUS : '+' ;\n" +
										   "MULT : '*' ;\n" +
										   "ID : [a-z]+ ;\n" +
										   "INT : [0-9]+ ;\n" +
										   "WS : [ \\r\\t\\n]+ ;\n";

	@Test
public  testAlts():  void {
		let  lg = new  LexerGrammar(TestGrammarParserInterpreter.lexerText);
		let  g = new  Grammar(
			"parser grammar T;\n" +
			"s : ID\n"+
			"  | INT{;}\n"+
			"  ;\n",
			lg);
		this.testInterp(lg, g, "s", "a",		"(s:1 a)");
		this.testInterp(lg, g, "s", "3", 	"(s:2 3)");
	}

	@Test
public  testAltsAsSet():  void {
		let  lg = new  LexerGrammar(TestGrammarParserInterpreter.lexerText);
		let  g = new  Grammar(
			"parser grammar T;\n" +
			"s : ID\n"+
			"  | INT\n"+
			"  ;\n",
			lg);
		this.testInterp(lg, g, "s", "a",		"(s:1 a)");
		this.testInterp(lg, g, "s", "3", 	"(s:1 3)");
	}

	@Test
public  testAltsWithLabels():  void {
		let  lg = new  LexerGrammar(TestGrammarParserInterpreter.lexerText);
		let  g = new  Grammar(
			"parser grammar T;\n" +
			"s : ID  # foo\n" +
			"  | INT # bar\n" +
			"  ;\n",
			lg);
		// it won't show the labels here because my simple node text provider above just shows the alternative
		this.testInterp(lg, g, "s", "a",		"(s:1 a)");
		this.testInterp(lg, g, "s", "3", 	"(s:2 3)");
	}

	@Test
public  testOneAlt():  void {
		let  lg = new  LexerGrammar(TestGrammarParserInterpreter.lexerText);
		let  g = new  Grammar(
			"parser grammar T;\n" +
			"s : ID\n"+
			"  ;\n",
			lg);
		this.testInterp(lg, g, "s", "a",		"(s:1 a)");
	}


	@Test
public  testLeftRecursionWithMultiplePrimaryAndRecursiveOps():  void {
		let  lg = new  LexerGrammar(TestGrammarParserInterpreter.lexerText);
		let  g = new  Grammar(
			"parser grammar T;\n" +
			"s : e EOF ;\n" +
			"e : e MULT e\n" +
			"  | e PLUS e\n" +
			"  | INT\n" +
			"  | ID\n" +
			"  ;\n",
			lg);

		this.testInterp(lg, g, "s", "a",		"(s:1 (e:4 a) <EOF>)");
		this.testInterp(lg, g, "e", "a",		"(e:4 a)");
		this.testInterp(lg, g, "e", "34",	"(e:3 34)");
		this.testInterp(lg, g, "e", "a+1",	"(e:2 (e:4 a) + (e:3 1))");
		this.testInterp(lg, g, "e", "1+2*a",	"(e:2 (e:3 1) + (e:1 (e:3 2) * (e:4 a)))");
	}

	protected  testInterp(lg: LexerGrammar, g: Grammar,
	                                  startRule: string, input: string,
	                                  expectedParseTree: string): InterpreterRuleContext
	{
		let  lexEngine = lg.createLexerInterpreter(new  ANTLRInputStream(input));
		let  tokens = new  CommonTokenStream(lexEngine);
		let  parser = g.createGrammarParserInterpreter(tokens);
		let  t = parser.parse(g.rules.get(startRule).index);
		let  nodeTextProvider = new  InterpreterTreeTextProvider(g.getRuleNames());
		let  treeStr = Trees.toStringTree(t, nodeTextProvider);
//		System.out.println("parse tree: "+treeStr);
		assertEquals(expectedParseTree, treeStr);
		return t as InterpreterRuleContext;
	}
}
