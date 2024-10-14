/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */


/* eslint-disable jsdoc/require-returns, jsdoc/require-param */


import { Token, HashSet } from "antlr4ng";



export  class TestTokenTypeAssignment {
	@Test
public  testParserSimpleTokens():  void {
		let  g = new  Grammar(
				"parser grammar t;\n"+
				"a : A | B;\n" +
				"b : C ;");
		let  rules = "a, b";
		let  tokenNames = "A, B, C";
		this.checkSymbols(g, rules, tokenNames);
	}

	@Test
public  testParserTokensSection():  void {
		let  g = new  Grammar(
				"parser grammar t;\n" +
				"tokens {\n" +
				"  C,\n" +
				"  D" +
				"}\n"+
				"a : A | B;\n" +
				"b : C ;");
		let  rules = "a, b";
		let  tokenNames = "A, B, C, D";
		this.checkSymbols(g, rules, tokenNames);
	}

	@Test
public  testLexerTokensSection():  void {
		let  g = new  LexerGrammar(
				"lexer grammar t;\n" +
				"tokens {\n" +
				"  C,\n" +
				"  D" +
				"}\n"+
				"A : 'a';\n" +
				"C : 'c' ;");
		let  rules = "A, C";
		let  tokenNames = "A, C, D";
		this.checkSymbols(g, rules, tokenNames);
	}

	@Test
public  testCombinedGrammarLiterals():  void {
		let  g = new  Grammar(
				"grammar t;\n"+
				"a : 'begin' b 'end';\n" +
				"b : C ';' ;\n" +
				"ID : 'a' ;\n" +
				"FOO : 'foo' ;\n" +  // "foo" is not a token name
				"C : 'c' ;\n");        // nor is 'c'
		let  rules = "a, b";
		let  tokenNames = "C, FOO, ID, 'begin', 'end', ';'";
		this.checkSymbols(g, rules, tokenNames);
	}

	@Test
public  testLiteralInParserAndLexer():  void {
		// 'x' is token and char in lexer rule
		let  g = new  Grammar(
				"grammar t;\n" +
				"a : 'x' E ; \n" +
				"E: 'x' '0' ;\n");

		let  literals = "['x']";
		let  foundLiterals = g.stringLiteralToTypeMap.keySet().toString();
		assertEquals(literals, foundLiterals);

		foundLiterals = g.implicitLexer.stringLiteralToTypeMap.keySet().toString();
		assertEquals("['x']", foundLiterals); // pushed in lexer from parser

		let  typeToTokenName = g.getTokenDisplayNames();
		let  tokens = new  LinkedHashSet<string>();
		for (let t of typeToTokenName) {
 if ( t!==null ) {
 tokens.add(t);
}

}

		assertEquals("[<INVALID>, 'x', E]", tokens.toString());
	}

	@Test
public  testPredDoesNotHideNameToLiteralMapInLexer():  void {
		// 'x' is token and char in lexer rule
		let  g = new  Grammar(
				"grammar t;\n" +
				"a : 'x' X ; \n" +
				"X: 'x' {true}?;\n"); // must match as alias even with pred

		assertEquals("{'x'=1}", g.stringLiteralToTypeMap.toString());
		assertEquals("{EOF=-1, X=1}", g.tokenNameToTypeMap.toString());

		// pushed in lexer from parser
		assertEquals("{'x'=1}", g.implicitLexer.stringLiteralToTypeMap.toString());
		assertEquals("{EOF=-1, X=1}", g.implicitLexer.tokenNameToTypeMap.toString());
	}

	@Test
public  testCombinedGrammarWithRefToLiteralButNoTokenIDRef():  void {
		let  g = new  Grammar(
				"grammar t;\n"+
				"a : 'a' ;\n" +
				"A : 'a' ;\n");
		let  rules = "a";
		let  tokenNames = "A, 'a'";
		this.checkSymbols(g, rules, tokenNames);
	}

	@Test
public  testSetDoesNotMissTokenAliases():  void {
		let  g = new  Grammar(
				"grammar t;\n"+
				"a : 'a'|'b' ;\n" +
				"A : 'a' ;\n" +
				"B : 'b' ;\n");
		let  rules = "a";
		let  tokenNames = "A, 'a', B, 'b'";
		this.checkSymbols(g, rules, tokenNames);
	}

	// T E S T  L I T E R A L  E S C A P E S

	@Test
public  testParserCharLiteralWithEscape():  void {
		let  g = new  Grammar(
				"grammar t;\n"+
				"a : '\\n';\n");
		let  literals = g.stringLiteralToTypeMap.keySet();
		// must store literals how they appear in the antlr grammar
		assertEquals("'\\n'", literals.toArray()[0]);
	}

	@Test
public  testParserCharLiteralWithBasicUnicodeEscape():  void {
		let  g = new  Grammar(
				"grammar t;\n"+
				"a : '\\uABCD';\n");
		let  literals = g.stringLiteralToTypeMap.keySet();
		// must store literals how they appear in the antlr grammar
		assertEquals("'\\uABCD'", literals.toArray()[0]);
	}

	@Test
public  testParserCharLiteralWithExtendedUnicodeEscape():  void {
		let  g = new  Grammar(
				"grammar t;\n"+
				"a : '\\u{1ABCD}';\n");
		let  literals = g.stringLiteralToTypeMap.keySet();
		// must store literals how they appear in the antlr grammar
		assertEquals("'\\u{1ABCD}'", literals.toArray()[0]);
	}

	protected  checkSymbols(g: Grammar,
								rulesStr: string,
								allValidTokensStr: string):  void
	{
		let  typeToTokenName = g.getTokenNames();
		let  tokens = new  HashSet<string>();
		for (let  i = 0; i < typeToTokenName.length; i++) {
			let  t = typeToTokenName[i];
			if ( t!==null ) {
				if (t.startsWith(Grammar.AUTO_GENERATED_TOKEN_NAME_PREFIX)) {
					tokens.add(g.getTokenDisplayName(i));
				}
				else {
					tokens.add(t);
				}
			}
		}

		// make sure expected tokens are there
		let  st = new  StringTokenizer(allValidTokensStr, ", ");
		while ( st.hasMoreTokens() ) {
			let  tokenName = st.nextToken();
			assertTrue(g.getTokenType(tokenName) !== Token.INVALID_TYPE, "token "+tokenName+" expected, but was undefined");
			tokens.remove(tokenName);
		}
		// make sure there are not any others (other than <EOF> etc...)
		for (let tokenName of tokens) {
			assertTrue(g.getTokenType(tokenName) < Token.MIN_USER_TOKEN_TYPE, "unexpected token name "+tokenName);
		}

		// make sure all expected rules are there
		st = new  StringTokenizer(rulesStr, ", ");
		let  n = 0;
		while ( st.hasMoreTokens() ) {
			let  ruleName = st.nextToken();
			assertNotNull(g.getRule(ruleName), "rule "+ruleName+" expected");
			n++;
		}
		//System.out.println("rules="+rules);
		// make sure there are no extra rules
		assertEquals(n, g.rules.size(), "number of rules mismatch; expecting "+n+"; found "+g.rules.size());
	}
}
