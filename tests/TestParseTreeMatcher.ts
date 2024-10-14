/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */


/* eslint-disable jsdoc/require-returns, jsdoc/require-param */


import { Lexer, NoViableAltException, Parser, Token, ParseTreeMatch, ParseTreePattern, ParseTreePatternMatcher } from "antlr4ng";



export  class TestParseTreeMatcher {

	private static  checkPatternMatch(grammar: string, startRule: string,
											input: string, pattern: string,
											grammarName: string):  ParseTreeMatch;

	private static  checkPatternMatch(grammar: string, startRule: string,
											input: string, pattern: string,
											grammarName: string, invertMatch: boolean):  ParseTreeMatch;
private static checkPatternMatch(...args: unknown[]):  ParseTreeMatch {
		switch (args.length) {
			case 5: {
				const [grammar, startRule, input, pattern, grammarName] = args as [string, string, string, string, string];


		return TestParseTreeMatcher.checkPatternMatch(grammar, startRule, input, pattern, grammarName, false);
	

				break;
			}

			case 6: {
				const [grammar, startRule, input, pattern, grammarName, invertMatch] = args as [string, string, string, string, string, boolean];


		let  grammarFileName = grammarName+".g4";
		let  parserName = grammarName+"Parser";
		let  lexerName = grammarName+"Lexer";
		let  runOptions = createOptionsForJavaToolTests(grammarFileName, grammar, parserName, lexerName,
				false, false, startRule, input,
				false, false, Stage.Execute);
		 {
// This holds the final error to throw (if any).
let error: java.lang.Throwable | undefined;

 const runner: JavaRunner  = new  JavaRunner()
try {
	try  {
			let  executedState = runner.run(runOptions) as JavaExecutedState;
			let  compiledState = executedState.previousState as JavaCompiledState;
			let  parser = compiledState.initializeDummyLexerAndParser().b;

			let  p = parser.compileParseTreePattern(pattern, parser.getRuleIndex(startRule));

			let  match = p.match(executedState.parseTree);
			let  matched = match.succeeded();
			if ( invertMatch ) {
 assertFalse(matched);
}

			else {
 assertTrue(matched);
}

			return match;
		}
	finally {
	error = closeResources([runner]);
	}
} catch(e) {
	error = handleResourceError(e, error);
} finally {
	throwResourceError(error);
}
}

	

				break;
			}

			default: {
				throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
			}
		}
	}


	private static  getPatternMatcher(
			grammarFileName: string, grammar: string, parserName: string, lexerName: string, startRule: string
	):  ParseTreePatternMatcher {
		let  runOptions = createOptionsForJavaToolTests(grammarFileName, grammar, parserName, lexerName,
				false, false, startRule, null,
				false, false, Stage.Compile);
		 {
// This holds the final error to throw (if any).
let error: java.lang.Throwable | undefined;

 const runner: JavaRunner  = new  JavaRunner()
try {
	try  {
			let  compiledState =  runner.run(runOptions) as JavaCompiledState;

			let  lexerParserPair = compiledState.initializeDummyLexerAndParser();

			return new  ParseTreePatternMatcher(lexerParserPair.a, lexerParserPair.b);
		}
	finally {
	error = closeResources([runner]);
	}
} catch(e) {
	error = handleResourceError(e, error);
} finally {
	throwResourceError(error);
}
}

	}
	@Test
public  testChunking():  void {
		let  m = new  ParseTreePatternMatcher(null, null);
		assertEquals("[ID, ' = ', expr, ' ;']", m.split("<ID> = <expr> ;").toString());
		assertEquals("[' ', ID, ' = ', expr]", m.split(" <ID> = <expr>").toString());
		assertEquals("[ID, ' = ', expr]", m.split("<ID> = <expr>").toString());
		assertEquals("[expr]", m.split("<expr>").toString());
		assertEquals("['<x> foo']", m.split("\\<x\\> foo").toString());
		assertEquals("['foo <x> bar ', tag]", m.split("foo \\<x\\> bar <tag>").toString());
	}

	@Test
public  testDelimiters():  void {
		let  m = new  ParseTreePatternMatcher(null, null);
		m.setDelimiters("<<", ">>", "$");
		let  result = m.split("<<ID>> = <<expr>> ;$<< ick $>>").toString();
		assertEquals("[ID, ' = ', expr, ' ;<< ick >>']", result);
	}

	@Test
public  testInvertedTags():  void {
		let  m= new  ParseTreePatternMatcher(null, null);
		let  result = null;
		try {
			m.split(">expr<");
		} catch (iae) {
if (iae instanceof IllegalArgumentException) {
			result = iae.getMessage();
		} else {
	throw iae;
	}
}
		let  expected = "tag delimiters out of order in pattern: >expr<";
		assertEquals(expected, result);
	}

	@Test
public  testUnclosedTag():  void {
		let  m = new  ParseTreePatternMatcher(null, null);
		let  result = null;
		try {
			m.split("<expr hi mom");
		} catch (iae) {
if (iae instanceof IllegalArgumentException) {
			result = iae.getMessage();
		} else {
	throw iae;
	}
}
		let  expected = "unterminated tag in pattern: <expr hi mom";
		assertEquals(expected, result);
	}

	@Test
public  testExtraClose():  void {
		let  m = new  ParseTreePatternMatcher(null, null);
		let  result = null;
		try {
			m.split("<expr> >");
		} catch (iae) {
if (iae instanceof IllegalArgumentException) {
			result = iae.getMessage();
		} else {
	throw iae;
	}
}
		let  expected = "missing start tag in pattern: <expr> >";
		assertEquals(expected, result);
	}

	@Test
public  testTokenizingPattern():  void {
		let  grammar =
			"grammar X1;\n" +
			"s : ID '=' expr ';' ;\n" +
			"expr : ID | INT ;\n" +
			"ID : [a-z]+ ;\n" +
			"INT : [0-9]+ ;\n" +
			"WS : [ \\r\\n\\t]+ -> skip ;\n";
		let  m = TestParseTreeMatcher.getPatternMatcher("X1.g4", grammar, "X1Parser", "X1Lexer", "s");

		let  tokens = m.tokenize("<ID> = <expr> ;");
		assertEquals("[ID:3, [@-1,1:1='=',<1>,1:1], expr:7, [@-1,1:1=';',<2>,1:1]]", tokens.toString());
	}

	@Test
public  testCompilingPattern():  void {
		let  grammar =
			"grammar X2;\n" +
			"s : ID '=' expr ';' ;\n" +
			"expr : ID | INT ;\n" +
			"ID : [a-z]+ ;\n" +
			"INT : [0-9]+ ;\n" +
			"WS : [ \\r\\n\\t]+ -> skip ;\n";
		let  m = TestParseTreeMatcher.getPatternMatcher("X2.g4", grammar, "X2Parser", "X2Lexer", "s");

		let  t = m.compile("<ID> = <expr> ;", m.getParser().getRuleIndex("s"));
		assertEquals("(s <ID> = (expr <expr>) ;)", t.getPatternTree().toStringTree(m.getParser()));
	}

	@Test
public  testCompilingPatternConsumesAllTokens():  void {
		let  grammar =
			"grammar X2;\n" +
			"s : ID '=' expr ';' ;\n" +
			"expr : ID | INT ;\n" +
			"ID : [a-z]+ ;\n" +
			"INT : [0-9]+ ;\n" +
			"WS : [ \\r\\n\\t]+ -> skip ;\n";
		let  m = TestParseTreeMatcher.getPatternMatcher("X2.g4", grammar, "X2Parser", "X2Lexer", "s");

		let  failed = false;
		try {
			m.compile("<ID> = <expr> ; extra", m.getParser().getRuleIndex("s"));
		} catch (e) {
if (e instanceof ParseTreePatternMatcher.StartRuleDoesNotConsumeFullPattern) {
			failed = true;
		} else {
	throw e;
	}
}
		assertTrue(failed);
	}

	@Test
public  testPatternMatchesStartRule():  void {
		let  grammar =
			"grammar X2;\n" +
			"s : ID '=' expr ';' ;\n" +
			"expr : ID | INT ;\n" +
			"ID : [a-z]+ ;\n" +
			"INT : [0-9]+ ;\n" +
			"WS : [ \\r\\n\\t]+ -> skip ;\n";
		let  m = TestParseTreeMatcher.getPatternMatcher("X2.g4", grammar, "X2Parser", "X2Lexer", "s");

		let  failed = false;
		try {
			m.compile("<ID> ;", m.getParser().getRuleIndex("s"));
		} catch (e) {
if (e instanceof java.util.InputMismatchException) {
			failed = true;
		} else {
	throw e;
	}
}
		assertTrue(failed);
	}

	@Test
public  testPatternMatchesStartRule2():  void {
		let  grammar =
			"grammar X2;\n" +
			"s : ID '=' expr ';' | expr ';' ;\n" +
			"expr : ID | INT ;\n" +
			"ID : [a-z]+ ;\n" +
			"INT : [0-9]+ ;\n" +
			"WS : [ \\r\\n\\t]+ -> skip ;\n";
		let  m = TestParseTreeMatcher.getPatternMatcher("X2.g4", grammar, "X2Parser", "X2Lexer", "s");

		let  failed = false;
		try {
			m.compile("<ID> <ID> ;", m.getParser().getRuleIndex("s"));
		} catch (e) {
if (e instanceof NoViableAltException) {
			failed = true;
		} else {
	throw e;
	}
}
		assertTrue(failed);
	}

	@Test
public  testHiddenTokensNotSeenByTreePatternParser():  void {
		let  grammar =
			"grammar X2;\n" +
			"s : ID '=' expr ';' ;\n" +
			"expr : ID | INT ;\n" +
			"ID : [a-z]+ ;\n" +
			"INT : [0-9]+ ;\n" +
			"WS : [ \\r\\n\\t]+ -> channel(HIDDEN) ;\n";
		let  m = TestParseTreeMatcher.getPatternMatcher("X2.g4", grammar, "X2Parser", "X2Lexer", "s");

		let  t = m.compile("<ID> = <expr> ;", m.getParser().getRuleIndex("s"));
		assertEquals("(s <ID> = (expr <expr>) ;)", t.getPatternTree().toStringTree(m.getParser()));
	}

	@Test
public  testCompilingMultipleTokens():  void {
		let  grammar =
			"grammar X2;\n" +
			"s : ID '=' ID ';' ;\n" +
			"ID : [a-z]+ ;\n" +
			"WS : [ \\r\\n\\t]+ -> skip ;\n";
		let  m =	TestParseTreeMatcher.getPatternMatcher("X2.g4", grammar, "X2Parser", "X2Lexer", "s");

		let  t = m.compile("<ID> = <ID> ;", m.getParser().getRuleIndex("s"));
		let  results = t.getPatternTree().toStringTree(m.getParser());
		let  expected = "(s <ID> = <ID> ;)";
		assertEquals(expected, results);
	}

	@Test
public  testIDNodeMatches():  void {
		let  grammar =
			"grammar X3;\n" +
			"s : ID ';' ;\n" +
			"ID : [a-z]+ ;\n" +
			"WS : [ \\r\\n\\t]+ -> skip ;\n";

		let  input = "x ;";
		let  pattern = "<ID>;";
		TestParseTreeMatcher.checkPatternMatch(grammar, "s", input, pattern, "X3");
	}

	@Test
public  testIDNodeWithLabelMatches():  void {
		let  grammar =
			"grammar X8;\n" +
			"s : ID ';' ;\n" +
			"ID : [a-z]+ ;\n" +
			"WS : [ \\r\\n\\t]+ -> skip ;\n";

		let  input = "x ;";
		let  pattern = "<id:ID>;";
		let  m = TestParseTreeMatcher.checkPatternMatch(grammar, "s", input, pattern, "X8");
		assertEquals("{ID=[x], id=[x]}", m.getLabels().toString());
		assertNotNull(m.get("id"));
		assertNotNull(m.get("ID"));
		assertEquals("x", m.get("id").getText());
		assertEquals("x", m.get("ID").getText());
		assertEquals("[x]", m.getAll("id").toString());
		assertEquals("[x]", m.getAll("ID").toString());

		assertNull(m.get("undefined"));
		assertEquals("[]", m.getAll("undefined").toString());
	}

	@Test
public  testLabelGetsLastIDNode():  void {
		let  grammar =
			"grammar X9;\n" +
			"s : ID ID ';' ;\n" +
			"ID : [a-z]+ ;\n" +
			"WS : [ \\r\\n\\t]+ -> skip ;\n";

		let  input = "x y;";
		let  pattern = "<id:ID> <id:ID>;";
		let  m = TestParseTreeMatcher.checkPatternMatch(grammar, "s", input, pattern, "X9");
		assertEquals("{ID=[x, y], id=[x, y]}", m.getLabels().toString());
		assertNotNull(m.get("id"));
		assertNotNull(m.get("ID"));
		assertEquals("y", m.get("id").getText());
		assertEquals("y", m.get("ID").getText());
		assertEquals("[x, y]", m.getAll("id").toString());
		assertEquals("[x, y]", m.getAll("ID").toString());

		assertNull(m.get("undefined"));
		assertEquals("[]", m.getAll("undefined").toString());
	}

	@Test
public  testIDNodeWithMultipleLabelMatches():  void {
		let  grammar =
			"grammar X7;\n" +
			"s : ID ID ID ';' ;\n" +
			"ID : [a-z]+ ;\n" +
			"WS : [ \\r\\n\\t]+ -> skip ;\n";

		let  input = "x y z;";
		let  pattern = "<a:ID> <b:ID> <a:ID>;";
		let  m = TestParseTreeMatcher.checkPatternMatch(grammar, "s", input, pattern, "X7");
		assertEquals("{ID=[x, y, z], a=[x, z], b=[y]}", m.getLabels().toString());
		assertNotNull(m.get("a")); // get first
		assertNotNull(m.get("b"));
		assertNotNull(m.get("ID"));
		assertEquals("z", m.get("a").getText());
		assertEquals("y", m.get("b").getText());
		assertEquals("z", m.get("ID").getText()); // get last
		assertEquals("[x, z]", m.getAll("a").toString());
		assertEquals("[y]", m.getAll("b").toString());
		assertEquals("[x, y, z]", m.getAll("ID").toString()); // ordered

		assertEquals("xyz;", m.getTree().getText()); // whitespace stripped by lexer

		assertNull(m.get("undefined"));
		assertEquals("[]", m.getAll("undefined").toString());
	}

	@Test
public  testTokenAndRuleMatch():  void {
		let  grammar =
			"grammar X4;\n" +
			"s : ID '=' expr ';' ;\n" +
			"expr : ID | INT ;\n" +
			"ID : [a-z]+ ;\n" +
			"INT : [0-9]+ ;\n" +
			"WS : [ \\r\\n\\t]+ -> skip ;\n";

		let  input = "x = 99;";
		let  pattern = "<ID> = <expr> ;";
		TestParseTreeMatcher.checkPatternMatch(grammar, "s", input, pattern, "X4");
	}

	@Test
public  testTokenTextMatch():  void {
		let  grammar =
			"grammar X4;\n" +
			"s : ID '=' expr ';' ;\n" +
			"expr : ID | INT ;\n" +
			"ID : [a-z]+ ;\n" +
			"INT : [0-9]+ ;\n" +
			"WS : [ \\r\\n\\t]+ -> skip ;\n";

		let  input = "x = 0;";
		let  pattern = "<ID> = 1;";
		let  invertMatch = true; // 0!=1
		TestParseTreeMatcher.checkPatternMatch(grammar, "s", input, pattern, "X4", invertMatch);

		input = "x = 0;";
		pattern = "<ID> = 0;";
		invertMatch = false;
		TestParseTreeMatcher.checkPatternMatch(grammar, "s", input, pattern, "X4", invertMatch);

		input = "x = 0;";
		pattern = "x = 0;";
		invertMatch = false;
		TestParseTreeMatcher.checkPatternMatch(grammar, "s", input, pattern, "X4", invertMatch);

		input = "x = 0;";
		pattern = "y = 0;";
		invertMatch = true;
		TestParseTreeMatcher.checkPatternMatch(grammar, "s", input, pattern, "X4", invertMatch);
	}

	@Test
public  testAssign():  void {
		let  grammar =
			"grammar X5;\n" +
			"s   : expr ';'\n" +
			//"    | 'return' expr ';'\n" +
			"    ;\n" +
			"expr: expr '.' ID\n" +
			"    | expr '*' expr\n" +
			"    | expr '=' expr\n" +
			"    | ID\n" +
			"    | INT\n" +
			"    ;\n" +
			"ID : [a-z]+ ;\n" +
			"INT : [0-9]+ ;\n" +
			"WS : [ \\r\\n\\t]+ -> skip ;\n";

		let  input = "x = 99;";
		let  pattern = "<ID> = <expr>;";
		TestParseTreeMatcher.checkPatternMatch(grammar, "s", input, pattern, "X5");
	}

	@Test
public  testLRecursiveExpr():  void {
		let  grammar =
			"grammar X6;\n" +
			"s   : expr ';'\n" +
			"    ;\n" +
			"expr: expr '.' ID\n" +
			"    | expr '*' expr\n" +
			"    | expr '=' expr\n" +
			"    | ID\n" +
			"    | INT\n" +
			"    ;\n" +
			"ID : [a-z]+ ;\n" +
			"INT : [0-9]+ ;\n" +
			"WS : [ \\r\\n\\t]+ -> skip ;\n";

		let  input = "3*4*5";
		let  pattern = "<expr> * <expr> * <expr>";
		TestParseTreeMatcher.checkPatternMatch(grammar, "expr", input, pattern, "X6");
	}
}
