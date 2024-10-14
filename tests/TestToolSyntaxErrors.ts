/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */


/* eslint-disable jsdoc/require-returns, jsdoc/require-param */





export  class TestToolSyntaxErrors {
	protected static readonly  A = [
	    // INPUT
		"grammar A;\n" +
		"",
		// YIELDS
		"error(" + ErrorType.NO_RULES.code + "): A.g4::: grammar A has no rules\n",

		"lexer grammar A;\n" +
		"",
		"error(" + ErrorType.NO_RULES.code + "): A.g4::: grammar A has no rules\n",

		"A;",
		"error(" + ErrorType.SYNTAX_ERROR.code + "): A.g4:1:0: syntax error: 'A' came as a complete surprise to me\n",

		"grammar ;",
		"error(" + ErrorType.SYNTAX_ERROR.code + "): A.g4:1:8: syntax error: ';' came as a complete surprise to me while looking for an identifier\n",

		"grammar A\n" +
		"a : ID ;\n",
		"error(" + ErrorType.SYNTAX_ERROR.code + "): A.g4:2:0: syntax error: missing SEMI at 'a'\n",

		"grammar A;\n" +
		"a : ID ;;\n"+
		"b : B ;",
		"error(" + ErrorType.SYNTAX_ERROR.code + "): A.g4:2:8: syntax error: ';' came as a complete surprise to me\n",

		"grammar A;;\n" +
		"a : ID ;\n",
		"error(" + ErrorType.SYNTAX_ERROR.code + "): A;.g4:1:10: syntax error: ';' came as a complete surprise to me\n",

		"grammar A;\n" +
		"a @init : ID ;\n",
		"error(" + ErrorType.SYNTAX_ERROR.code + "): A.g4:2:8: syntax error: mismatched input ':' expecting ACTION while matching rule preamble\n",

		"grammar A;\n" +
		"a  ( A | B ) D ;\n" +
		"b : B ;",
		"error(" + ErrorType.SYNTAX_ERROR.code + "): A.g4:2:3: syntax error: '(' came as a complete surprise to me while matching rule preamble\n" +
		"error(" + ErrorType.SYNTAX_ERROR.code + "): A.g4:2:11: syntax error: mismatched input ')' expecting SEMI while matching a rule\n" +
		"error(" + ErrorType.SYNTAX_ERROR.code + "): A.g4:2:15: syntax error: mismatched input ';' expecting COLON while matching a lexer rule\n",
    ];

	@Test
public  AllErrorCodesDistinct():  void {
		let  errorTypes = ErrorType.class.getEnumConstants();
		for (let  i = 0; i < errorTypes.length; i++) {
			for (let  j = i + 1; j < errorTypes.length; j++) {
				assertNotEquals(errorTypes[i].code, errorTypes[j].code);
			}
		}
	}

	@Test
public  testA():  void { testErrors(TestToolSyntaxErrors.A, true); }

	@Test
public  testExtraColon():  void {
		let  pair =  [
			"grammar A;\n" +
			"a : : A ;\n" +
			"b : B ;",
			"error(" + ErrorType.SYNTAX_ERROR.code + "): A.g4:2:4: syntax error: ':' came as a complete surprise to me while matching alternative\n",
		];
		testErrors(pair, true);
	}

	@Test
public  testMissingRuleSemi():  void {
		let  pair =  [
			"grammar A;\n" +
			"a : A \n" +
			"b : B ;",
			"error(" + ErrorType.SYNTAX_ERROR.code + "): A.g4:3:0: syntax error: unterminated rule (missing ';') detected at 'b :' while looking for rule element\n",
		];
		testErrors(pair, true);
	}

	@Test
public  testMissingRuleSemi2():  void {
		let  pair =  [
			"lexer grammar A;\n" +
			"A : 'a' \n" +
			"B : 'b' ;",
			"error(" + ErrorType.SYNTAX_ERROR.code + "): A.g4:3:2: syntax error: unterminated rule (missing ';') detected at ': 'b'' while looking for lexer rule element\n",
		];
		testErrors(pair, true);
	}

	@Test
public  testMissingRuleSemi3():  void {
		let  pair =  [
			"grammar A;\n" +
			"a : A \n" +
			"b[int i] returns [int y] : B ;",
			"error(" + ErrorType.SYNTAX_ERROR.code + "): A.g4:3:9: syntax error: unterminated rule (missing ';') detected at 'returns int y' while looking for rule element\n"
		];
		testErrors(pair, true);
	}

	@Test
public  testMissingRuleSemi4():  void {
		let  pair =  [
			"grammar A;\n" +
			"a : b \n" +
			"  catch [Exception e] {...}\n" +
			"b : B ;\n",

			"error(" + ErrorType.SYNTAX_ERROR.code + "): A.g4:2:4: syntax error: unterminated rule (missing ';') detected at 'b catch' while looking for rule element\n"
		];
		testErrors(pair, true);
	}

	@Test
public  testMissingRuleSemi5():  void {
		let  pair =  [
			"grammar A;\n" +
			"a : A \n" +
			"  catch [Exception e] {...}\n",

			"error(" + ErrorType.SYNTAX_ERROR.code + "): A.g4:2:4: syntax error: unterminated rule (missing ';') detected at 'A catch' while looking for rule element\n"
		];
		testErrors(pair, true);
	}

	@Test
public  testBadRulePrequelStart():  void {
		let  pair =  [
			"grammar A;\n" +
			"a @ options {k=1;} : A ;\n" +
			"b : B ;",

			"error(" + ErrorType.SYNTAX_ERROR.code + "): A.g4:2:4: syntax error: 'options {' came as a complete surprise to me while looking for an identifier\n"
		];
		testErrors(pair, true);
	}

	@Test
public  testBadRulePrequelStart2():  void {
		let  pair =  [
			"grammar A;\n" +
			"a } : A ;\n" +
			"b : B ;",

			"error(" + ErrorType.SYNTAX_ERROR.code + "): A.g4:2:2: syntax error: '}' came as a complete surprise to me while matching rule preamble\n"
		];
		testErrors(pair, true);
	}

	@Test
public  testModeInParser():  void {
		let  pair =  [
			"grammar A;\n" +
			"a : A ;\n" +
			"mode foo;\n" +
			"b : B ;",

			"error(" + ErrorType.SYNTAX_ERROR.code + "): A.g4:4:0: syntax error: 'b' came as a complete surprise to me\n" +
			"error(" + ErrorType.SYNTAX_ERROR.code + "): A.g4:4:6: syntax error: mismatched input ';' expecting COLON while matching a lexer rule\n"
		];
		testErrors(pair, true);
	}

	/**
	 * This is a regression test for antlr/antlr4#243
	 * "Generate a good message for unterminated strings"
	 * https://github.com/antlr/antlr4/issues/243
	 */
	@Test
public  testUnterminatedStringLiteral():  void {
		let  pair =  [
			"grammar A;\n" +
			"a : 'x\n" +
			"  ;\n",

			"error(" + ErrorType.UNTERMINATED_STRING_LITERAL.code + "): A.g4:2:4: unterminated string literal\n"
		];
		testErrors(pair, true);
	}

	/**
	 * This is a regression test for antlr/antlr4#262
	 * "Parser Rule Name Starting With an Underscore"
	 * https://github.com/antlr/antlr4/issues/262
	 */
	@Test
public  testParserRuleNameStartingWithUnderscore():  void {
		let  pair =  [
			"grammar A;\n" +
			"_a : 'x' ;\n",

			"error(" + ErrorType.SYNTAX_ERROR.code + "): A.g4:2:0: syntax error: '_' came as a complete surprise to me\n"
		];
		testErrors(pair, true);
	}

	/**
	 * This is a regression test for antlr/antlr4#194
	 * "NullPointerException on 'options{}' in grammar file"
	 * https://github.com/antlr/antlr4/issues/194
	 */
	@Test
public  testEmptyGrammarOptions():  void {
		let  pair =  [
			"grammar A;\n" +
			"options {}\n" +
			"a : 'x' ;\n",

			""
		];
		testErrors(pair, true);
	}

	/**
	 * This is a "related" regression test for antlr/antlr4#194
	 * "NullPointerException on 'options{}' in grammar file"
	 * https://github.com/antlr/antlr4/issues/194
	 */
	@Test
public  testEmptyRuleOptions():  void {
		let  pair =  [
			"grammar A;\n" +
			"a options{} : 'x' ;\n",

			""
		];
		testErrors(pair, true);
	}

	/**
	 * This is a "related" regression test for antlr/antlr4#194
	 * "NullPointerException on 'options{}' in grammar file"
	 * https://github.com/antlr/antlr4/issues/194
	 */
	@Test
public  testEmptyBlockOptions():  void {
		let  pair =  [
			"grammar A;\n" +
			"a : (options{} : 'x') ;\n",

			""
		];
		testErrors(pair, true);
	}

	@Test
public  testEmptyTokensBlock():  void {
		let  pair =  [
			"grammar A;\n" +
			"tokens {}\n" +
			"a : 'x' ;\n",

			""
		];
		testErrors(pair, true);
	}

	/**
	 * This is a regression test for antlr/antlr4#190
	 * "NullPointerException building lexer grammar using bogus 'token' action"
	 * https://github.com/antlr/antlr4/issues/190
	 */
	@Test
public  testInvalidLexerCommand():  void {
		let  pair =  [
			"grammar A;\n" +
			"tokens{Foo}\n" +
			"b : Foo ;\n" +
			"X : 'foo1' -> popmode;\n" + // "meant" to use -> popMode
			"Y : 'foo2' -> token(Foo);", // "meant" to use -> type(Foo)

			"error(" + ErrorType.INVALID_LEXER_COMMAND.code + "): A.g4:4:14: lexer command popmode does not exist or is not supported by the current target\n" +
			"error(" + ErrorType.INVALID_LEXER_COMMAND.code + "): A.g4:5:14: lexer command token does not exist or is not supported by the current target\n"
		];
		testErrors(pair, true);
	}

	@Test
public  testLexerCommandArgumentValidation():  void {
		let  pair =  [
			"grammar A;\n" +
			"tokens{Foo}\n" +
			"b : Foo ;\n" +
			"X : 'foo1' -> popMode(Foo);\n" + // "meant" to use -> popMode
			"Y : 'foo2' -> type;", // "meant" to use -> type(Foo)

			"error(" + ErrorType.UNWANTED_LEXER_COMMAND_ARGUMENT.code + "): A.g4:4:14: lexer command popMode does not take any arguments\n" +
			"error(" + ErrorType.MISSING_LEXER_COMMAND_ARGUMENT.code + "): A.g4:5:14: missing argument for lexer command type\n"
		];
		testErrors(pair, true);
	}

	@Test
public  testRuleRedefinition():  void {
		let  pair =  [
			"grammar Oops;\n" +
			"\n" +
			"ret_ty : A ;\n" +
			"ret_ty : B ;\n" +
			"\n" +
			"A : 'a' ;\n" +
			"B : 'b' ;\n",

			"error(" + ErrorType.RULE_REDEFINITION.code + "): Oops.g4:4:0: rule ret_ty redefinition; previous at line 3\n"
		];
		testErrors(pair, true);
	}

	@Test
public  testEpsilonClosureAnalysis():  void {
		let  grammar =
			"grammar A;\n"
			+ "x : ;\n"
			+ "y1 : x+;\n"
			+ "y2 : x*;\n"
			+ "z1 : ('foo' | 'bar'? 'bar2'?)*;\n"
			+ "z2 : ('foo' | 'bar' 'bar2'? | 'bar2')*;\n";
		let  expected =
			"error(" + ErrorType.EPSILON_CLOSURE.code + "): A.g4:3:0: rule y1 contains a closure with at least one alternative that can match an empty string\n" +
			"error(" + ErrorType.EPSILON_CLOSURE.code + "): A.g4:4:0: rule y2 contains a closure with at least one alternative that can match an empty string\n" +
			"error(" + ErrorType.EPSILON_CLOSURE.code + "): A.g4:5:0: rule z1 contains a closure with at least one alternative that can match an empty string\n";

		let  pair =  [
			grammar,
			expected
		];

		testErrors(pair, true);
	}

	// Test for https://github.com/antlr/antlr4/issues/1203
	@Test
public  testEpsilonNestedClosureAnalysis():  void {
		let  grammar =
			"grammar T;\n"+
			"s : (a a)* ;\n"+
			"a : 'foo'* ;\n";
		let  expected =
			"error(" + ErrorType.EPSILON_CLOSURE.code + "): T.g4:2:0: rule s contains a closure with at least one alternative that can match an empty string\n";

		let  pair =  [
			grammar,
			expected
		];

		testErrors(pair, true);
	}

	// Test for https://github.com/antlr/antlr4/issues/2860, https://github.com/antlr/antlr4/issues/1105
	@Test
public  testEpsilonClosureInLexer():  void {
		let  grammar =
				"lexer grammar T;\n" +
				"TOKEN: '\\'' FRAGMENT '\\'';\n" +
				"fragment FRAGMENT: ('x'|)+;";

		let  expected =
			"error(" + ErrorType.EPSILON_CLOSURE.code + "): T.g4:3:9: rule FRAGMENT contains a closure with at least one alternative that can match an empty string\n";

		let  pair =  [
				grammar,
				expected
		];

		testErrors(pair, true);
	}

	// Test for https://github.com/antlr/antlr4/issues/3359
	@Test
public  testEofClosure():  void {
		let  grammar =
				"lexer grammar EofClosure;\n" +
				"EofClosure: 'x' EOF*;\n" +
				"EofInAlternative: 'y' ('z' | EOF);";

		let  expected =
			"error(" + ErrorType.EOF_CLOSURE.code + "): EofClosure.g4:2:0: rule EofClosure contains a closure with at least one alternative that can match EOF\n";

		let  pair =  [
				grammar,
				expected
		];

		testErrors(pair, true);
	}

	// Test for https://github.com/antlr/antlr4/issues/1203
	@Test
public  testEpsilonOptionalAndClosureAnalysis():  void {
		let  grammar =
			"grammar T;\n"+
			"s : (a a)? ;\n"+
			"a : 'foo'* ;\n";
		let  expected =
			"warning(" + ErrorType.EPSILON_OPTIONAL.code + "): T.g4:2:0: rule s contains an optional block with at least one alternative that can match an empty string\n";

		let  pair =  [
			grammar,
			expected
		];

		testErrors(pair, true);
	}

	@Test
public  testEpsilonOptionalAnalysis():  void {
		let  grammar =
			"grammar A;\n"
			+ "x : ;\n"
			+ "y  : x?;\n"
			+ "z1 : ('foo' | 'bar'? 'bar2'?)?;\n"
			+ "z2 : ('foo' | 'bar' 'bar2'? | 'bar2')?;\n";
		let  expected =
			"warning(" + ErrorType.EPSILON_OPTIONAL.code + "): A.g4:3:0: rule y contains an optional block with at least one alternative that can match an empty string\n" +
			"warning(" + ErrorType.EPSILON_OPTIONAL.code + "): A.g4:4:0: rule z1 contains an optional block with at least one alternative that can match an empty string\n";

		let  pair =  [
			grammar,
			expected
		];

		testErrors(pair, true);
	}

	/**
	 * This is a regression test for antlr/antlr4#315
	 * "Inconsistent lexer error msg for actions"
	 * https://github.com/antlr/antlr4/issues/315
	 */
	@Test
public  testActionAtEndOfOneLexerAlternative():  void {
		let  grammar =
			"grammar A;\n" +
			"stat : 'start' CharacterLiteral 'end' EOF;\n" +
			"\n" +
			"// Lexer\n" +
			"\n" +
			"CharacterLiteral\n" +
			"    :   '\\'' SingleCharacter '\\''\n" +
			"    |   '\\'' ~[\\r\\n] {notifyErrorListeners(\"unclosed character literal\");}\n" +
			"    ;\n" +
			"\n" +
			"fragment\n" +
			"SingleCharacter\n" +
			"    :   ~['\\\\\\r\\n]\n" +
			"    ;\n" +
			"\n" +
			"WS   : [ \\r\\t\\n]+ -> skip ;\n";
		let  expected =
			"";

		let  pair =  [ grammar, expected ];
		testErrors(pair, true);
	}

	/**
	 * This is a regression test for antlr/antlr4#308 "NullPointer exception"
	 * https://github.com/antlr/antlr4/issues/308
	 */
	@Test
public  testDoubleQuotedStringLiteral():  void {
		let  grammar =
			"lexer grammar A;\n"
			+ "WHITESPACE : (\" \" | \"\\t\" | \"\\n\" | \"\\r\" | \"\\f\");\n";
		let  expected =
			"error(" + ErrorType.SYNTAX_ERROR.code + "): A.g4:2:14: syntax error: '\"' came as a complete surprise to me\n" +
			"error(" + ErrorType.SYNTAX_ERROR.code + "): A.g4:2:16: syntax error: '\"' came as a complete surprise to me\n" +
			"error(" + ErrorType.SYNTAX_ERROR.code + "): A.g4:2:20: syntax error: '\"' came as a complete surprise to me\n" +
			"error(" + ErrorType.SYNTAX_ERROR.code + "): A.g4:2:21: syntax error: '\\' came as a complete surprise to me\n" +
			"error(" + ErrorType.SYNTAX_ERROR.code + "): A.g4:2:23: syntax error: '\"' came as a complete surprise to me\n" +
			"error(" + ErrorType.SYNTAX_ERROR.code + "): A.g4:2:27: syntax error: '\"' came as a complete surprise to me\n" +
			"error(" + ErrorType.SYNTAX_ERROR.code + "): A.g4:2:28: syntax error: '\\' came as a complete surprise to me\n" +
			"error(" + ErrorType.SYNTAX_ERROR.code + "): A.g4:2:30: syntax error: '\"' came as a complete surprise to me\n" +
			"error(" + ErrorType.SYNTAX_ERROR.code + "): A.g4:2:34: syntax error: '\"' came as a complete surprise to me\n" +
			"error(" + ErrorType.SYNTAX_ERROR.code + "): A.g4:2:35: syntax error: '\\' came as a complete surprise to me\n" +
			"error(" + ErrorType.SYNTAX_ERROR.code + "): A.g4:2:37: syntax error: '\"' came as a complete surprise to me\n" +
			"error(" + ErrorType.SYNTAX_ERROR.code + "): A.g4:2:41: syntax error: '\"' came as a complete surprise to me\n" +
			"error(" + ErrorType.SYNTAX_ERROR.code + "): A.g4:2:42: syntax error: '\\' came as a complete surprise to me\n" +
			"error(" + ErrorType.SYNTAX_ERROR.code + "): A.g4:2:44: syntax error: '\"' came as a complete surprise to me\n";

		let  pair =  [
			grammar,
			expected
		];

		testErrors(pair, true);
	}

	/**
	 * This is a regression test for https://github.com/antlr/antlr4/issues/1815
	 * "Null ptr exception in SqlBase.g4"
	 */
	@Test
public  testDoubleQuoteInTwoStringLiterals():  void {
		let  grammar =
			"lexer grammar A;\n" +
			"STRING : '\\\"' '\\\"' 'x' ;";
		let  expected =
			"error(" + ErrorType.INVALID_ESCAPE_SEQUENCE.code + "): A.g4:2:10: invalid escape sequence \\\"\n"+
			"error(" + ErrorType.INVALID_ESCAPE_SEQUENCE.code + "): A.g4:2:15: invalid escape sequence \\\"\n";

		let  pair =  [
			grammar,
			expected
		];

		testErrors(pair, true);
	}

	/**
	 * This test ensures that the {@link ErrorType#INVALID_ESCAPE_SEQUENCE}
	 * error is not reported for escape sequences that are known to be valid.
	 */
	@Test
public  testValidEscapeSequences():  void {
		let  grammar =
			"lexer grammar A;\n" +
			"NORMAL_ESCAPE : '\\b \\t \\n \\f \\r \\' \\\\';\n" +
			"UNICODE_ESCAPE : '\\u0001 \\u00A1 \\u00a1 \\uaaaa \\uAAAA';\n";
		let  expected =
			"";

		let  pair =  [
			grammar,
			expected
		];

		testErrors(pair, true);
	}

	/**
	 * This is a regression test for antlr/antlr4#507 "NullPointerException When
	 * Generating Code from Grammar".
	 * https://github.com/antlr/antlr4/issues/507
	 */
	@Test
public  testInvalidEscapeSequences():  void {
		let  grammar =
			"lexer grammar A;\n" +
			"RULE : 'Foo \\uAABG \\x \\u';\n";
		let  expected =
			"error(" + ErrorType.INVALID_ESCAPE_SEQUENCE.code + "): A.g4:2:12: invalid escape sequence \\uAABG\n" +
			"error(" + ErrorType.INVALID_ESCAPE_SEQUENCE.code + "): A.g4:2:19: invalid escape sequence \\x\n" +
			"error(" + ErrorType.INVALID_ESCAPE_SEQUENCE.code + "): A.g4:2:22: invalid escape sequence \\u\n";

		let  pair =  [
			grammar,
			expected
		];

		testErrors(pair, true);
	}

	/**
	 * This is a regression test for antlr/antlr4#959 "NullPointerException".
	 * https://github.com/antlr/antlr4/issues/959
	 */
	@Test
public  testNotAllowedEmptyStrings():  void {
		let  grammar =
			"lexer grammar T;\n" +
			"Error0: '''test''';\n" +
			"Error1: '' 'test';\n" +
			"Error2: 'test' '';\n" +
			"Error3: '';\n" +
			"NotError: ' ';";
		let  expected =
			"error(" + ErrorType.EMPTY_STRINGS_AND_SETS_NOT_ALLOWED.code + "): T.g4:2:8: string literals and sets cannot be empty: ''\n" +
			"error(" + ErrorType.EMPTY_STRINGS_AND_SETS_NOT_ALLOWED.code + "): T.g4:2:16: string literals and sets cannot be empty: ''\n" +
			"error(" + ErrorType.EMPTY_STRINGS_AND_SETS_NOT_ALLOWED.code + "): T.g4:3:8: string literals and sets cannot be empty: ''\n" +
			"error(" + ErrorType.EMPTY_STRINGS_AND_SETS_NOT_ALLOWED.code + "): T.g4:4:15: string literals and sets cannot be empty: ''\n" +
			"error(" + ErrorType.EMPTY_STRINGS_AND_SETS_NOT_ALLOWED.code + "): T.g4:5:8: string literals and sets cannot be empty: ''\n";

		let  pair =  [
				grammar,
				expected
		];

		testErrors(pair, true);
	}

	@Test
public  testInvalidCharSetsAndStringLiterals():  void {
		let  grammar =
				"lexer grammar Test;\n" +
				"INVALID_STRING_LITERAL_RANGE: 'GH'..'LM';\n" +
				"INVALID_CHAR_SET:             [\\u24\\uA2][\\{];\n" +  //https://github.com/antlr/antlr4/issues/1077
				"EMPTY_STRING_LITERAL_RANGE:   'F'..'A' | 'Z';\n" +
				"EMPTY_CHAR_SET:               [f-az][];\n" +
				"START_HYPHEN_IN_CHAR_SET:     [-z];\n" +
				"END_HYPHEN_IN_CHAR_SET:       [a-];\n" +
				"SINGLE_HYPHEN_IN_CHAR_SET:    [-];\n" +
				"VALID_STRING_LITERALS:        '\\u1234' | '\\t' | '\\'';\n" +
				"VALID_CHAR_SET:               [`\\-=\\]];" +
				"EMPTY_CHAR_SET_WITH_INVALID_ESCAPE_SEQUENCE: [\\'];";  // https://github.com/antlr/antlr4/issues/1556

		let  expected =
				"error(" + ErrorType.INVALID_LITERAL_IN_LEXER_SET.code + "): Test.g4:2:30: multi-character literals are not allowed in lexer sets: 'GH'\n" +
				"error(" + ErrorType.INVALID_LITERAL_IN_LEXER_SET.code + "): Test.g4:2:36: multi-character literals are not allowed in lexer sets: 'LM'\n" +
				"error(" + ErrorType.INVALID_ESCAPE_SEQUENCE.code + "): Test.g4:3:30: invalid escape sequence \\u24\\u\n" +
				"error(" + ErrorType.INVALID_ESCAPE_SEQUENCE.code + "): Test.g4:3:40: invalid escape sequence \\{\n" +
				"error(" + ErrorType.EMPTY_STRINGS_AND_SETS_NOT_ALLOWED.code + "): Test.g4:4:33: string literals and sets cannot be empty: 'F'..'A'\n" +
				"error(" + ErrorType.EMPTY_STRINGS_AND_SETS_NOT_ALLOWED.code + "): Test.g4:5:30: string literals and sets cannot be empty: 'f'..'a'\n" +
				"error(" + ErrorType.EMPTY_STRINGS_AND_SETS_NOT_ALLOWED.code + "): Test.g4:5:36: string literals and sets cannot be empty: []\n" +
				"error(" + ErrorType.INVALID_ESCAPE_SEQUENCE.code + "): Test.g4:10:84: invalid escape sequence \\'\n";

		let  pair =  [
				grammar,
				expected
		];

		testErrors(pair, true);
	}

	@Test
public  testInvalidUnicodeEscapesInCharSet():  void {
		let  grammar =
				"lexer grammar Test;\n" +
				"INVALID_EXTENDED_UNICODE_EMPTY: [\\u{}];\n" +
				"INVALID_EXTENDED_UNICODE_NOT_TERMINATED: [\\u{];\n" +
				"INVALID_EXTENDED_UNICODE_TOO_LONG: [\\u{110000}];\n" +
				"INVALID_UNICODE_PROPERTY_EMPTY: [\\p{}];\n" +
				"INVALID_UNICODE_PROPERTY_NOT_TERMINATED: [\\p{];\n" +
				"INVALID_INVERTED_UNICODE_PROPERTY_EMPTY: [\\P{}];\n" +
				"INVALID_UNICODE_PROPERTY_UNKNOWN: [\\p{NotAProperty}];\n" +
				"INVALID_INVERTED_UNICODE_PROPERTY_UNKNOWN: [\\P{NotAProperty}];\n" +
				"UNICODE_PROPERTY_NOT_ALLOWED_IN_RANGE: [\\p{Uppercase_Letter}-\\p{Lowercase_Letter}];\n" +
				"UNICODE_PROPERTY_NOT_ALLOWED_IN_RANGE_2: [\\p{Letter}-Z];\n" +
				"UNICODE_PROPERTY_NOT_ALLOWED_IN_RANGE_3: [A-\\p{Number}];\n" +
				"INVERTED_UNICODE_PROPERTY_NOT_ALLOWED_IN_RANGE: [\\P{Uppercase_Letter}-\\P{Number}];\n" +
				"EMOJI_MODIFIER: [\\p{Grapheme_Cluster_Break=E_Base}];\n";

		let  expected =
				"error(" + ErrorType.INVALID_ESCAPE_SEQUENCE.code + "): Test.g4:2:32: invalid escape sequence \\u{}\n" +
				"error(" + ErrorType.INVALID_ESCAPE_SEQUENCE.code + "): Test.g4:3:41: invalid escape sequence \\u{\n" +
				"error(" + ErrorType.INVALID_ESCAPE_SEQUENCE.code + "): Test.g4:4:35: invalid escape sequence \\u{110\n" +
				"error(" + ErrorType.INVALID_ESCAPE_SEQUENCE.code + "): Test.g4:5:32: invalid escape sequence \\p{}\n" +
				"error(" + ErrorType.INVALID_ESCAPE_SEQUENCE.code + "): Test.g4:6:41: invalid escape sequence \\p{\n" +
				"error(" + ErrorType.INVALID_ESCAPE_SEQUENCE.code + "): Test.g4:7:41: invalid escape sequence \\P{}\n" +
				"error(" + ErrorType.INVALID_ESCAPE_SEQUENCE.code + "): Test.g4:8:34: invalid escape sequence \\p{NotAProperty}\n" +
				"error(" + ErrorType.INVALID_ESCAPE_SEQUENCE.code + "): Test.g4:9:43: invalid escape sequence \\P{NotAProperty}\n" +
				"error(" + ErrorType.UNICODE_PROPERTY_NOT_ALLOWED_IN_RANGE.code + "): Test.g4:10:39: unicode property escapes not allowed in lexer charset range: [\\p{Uppercase_Letter}-\\p{Lowercase_Letter}]\n" +
				"error(" + ErrorType.UNICODE_PROPERTY_NOT_ALLOWED_IN_RANGE.code + "): Test.g4:11:41: unicode property escapes not allowed in lexer charset range: [\\p{Letter}-Z]\n" +
				"error(" + ErrorType.UNICODE_PROPERTY_NOT_ALLOWED_IN_RANGE.code + "): Test.g4:12:41: unicode property escapes not allowed in lexer charset range: [A-\\p{Number}]\n" +
				"error(" + ErrorType.UNICODE_PROPERTY_NOT_ALLOWED_IN_RANGE.code + "): Test.g4:13:48: unicode property escapes not allowed in lexer charset range: [\\P{Uppercase_Letter}-\\P{Number}]\n" +
				"error(" + ErrorType.INVALID_ESCAPE_SEQUENCE.code + "): Test.g4:14:16: invalid escape sequence \\p{Grapheme_Cluster_Break=E_Base}\n";

		let  pair =  [
				grammar,
				expected
		];

		testErrors(pair, true);
	}

	/**
	 * This test ensures the {@link ErrorType#UNRECOGNIZED_ASSOC_OPTION} warning
	 * is produced as described in the documentation.
	 */
	@Test
public  testUnrecognizedAssocOption():  void {
		let  grammar =
			"grammar A;\n" +
			"x : 'x'\n" +
			"  | x '+'<assoc=right> x   // warning 157\n" +
			"  |<assoc=right> x '*' x   // ok\n" +
			"  ;\n";
		let  expected =
			"warning(" + ErrorType.UNRECOGNIZED_ASSOC_OPTION.code + "): A.g4:3:10: rule x contains an assoc terminal option in an unrecognized location\n";

		let  pair =  [
			grammar,
			expected
		];

		testErrors(pair, true);
	}

	/**
	 * This test ensures the {@link ErrorType#FRAGMENT_ACTION_IGNORED} warning
	 * is produced as described in the documentation.
	 */
	@Test
public  testFragmentActionIgnored():  void {
		let  grammar =
			"lexer grammar A;\n" +
			"X1 : 'x' -> more    // ok\n" +
			"   ;\n" +
			"Y1 : 'x' {more();}  // ok\n" +
			"   ;\n" +
			"fragment\n" +
			"X2 : 'x' -> more    // warning 158\n" +
			"   ;\n" +
			"fragment\n" +
			"Y2 : 'x' {more();}  // warning 158\n" +
			"   ;\n";
		let  expected =
			"warning(" + ErrorType.FRAGMENT_ACTION_IGNORED.code + "): A.g4:7:12: fragment rule X2 contains an action or command which can never be executed\n" +
			"warning(" + ErrorType.FRAGMENT_ACTION_IGNORED.code + "): A.g4:10:9: fragment rule Y2 contains an action or command which can never be executed\n";

		let  pair =  [
			grammar,
			expected
		];

		testErrors(pair, true);
	}

	/**
	 * This is a regression test for antlr/antlr4#500 "Array Index Out Of
	 * Bounds".
	 * https://github.com/antlr/antlr4/issues/500
	 */
	@Test
public  testTokenNamedEOF():  void {
		let  grammar =
			"lexer grammar A;\n" +
			"WS : ' ';\n" +
			" EOF : 'a';\n";
		let  expected =
			"error(" + ErrorType.RESERVED_RULE_NAME.code + "): A.g4:3:1: cannot declare a rule with reserved name EOF\n";

		let  pair =  [
			grammar,
			expected
		];

		testErrors(pair, true);
	}

	/**
	 * This is a regression test for antlr/antlr4#649 "unknown target causes
	 * null ptr exception.".
	 * https://github.com/antlr/antlr4/issues/649
	 * Stops before processing the lexer
	 */
	@Test
public  testInvalidLanguageInGrammarWithLexerCommand():  void {
		let  grammar =
			"grammar T;\n" +
			"options { language=Foo; }\n" +
			"start : 'T' EOF;\n" +
			"Something : 'something' -> channel(CUSTOM);";
		let  expected =
			"error(" + ErrorType.CANNOT_CREATE_TARGET_GENERATOR.code + "):  ANTLR cannot generate Foo code as of version " + Tool.VERSION + "\n";
		let  pair =  [
			grammar,
			expected
		];

		testErrors(pair, true);
	}

	/**
	 * This is a regression test for antlr/antlr4#649 "unknown target causes
	 * null ptr exception.".
	 * https://github.com/antlr/antlr4/issues/649
	 */
	@Test
public  testInvalidLanguageInGrammar():  void {
		let  grammar =
			"grammar T;\n" +
			"options { language=Foo; }\n" +
			"start : 'T' EOF;\n";
		let  expected =
			"error(" + ErrorType.CANNOT_CREATE_TARGET_GENERATOR.code + "):  ANTLR cannot generate Foo code as of version " + Tool.VERSION + "\n";

		let  pair =  [
			grammar,
			expected
		];

		testErrors(pair, true);
	}

	@Test
public  testChannelDefinitionInLexer():  void {
		let  grammar =
			"lexer grammar T;\n" +
			"\n" +
			"channels {\n" +
			"	WHITESPACE_CHANNEL,\n" +
			"	COMMENT_CHANNEL\n" +
			"}\n" +
			"\n" +
			"COMMENT:    '//' ~[\\n]+ -> channel(COMMENT_CHANNEL);\n" +
			"WHITESPACE: [ \\t]+      -> channel(WHITESPACE_CHANNEL);\n";

		let  expected = "";

		let  pair = [ grammar, expected ];
		testErrors(pair, true);
	}

	@Test
public  testChannelDefinitionInParser():  void {
		let  grammar =
			"parser grammar T;\n" +
			"\n" +
			"channels {\n" +
			"	WHITESPACE_CHANNEL,\n" +
			"	COMMENT_CHANNEL\n" +
			"}\n" +
			"\n" +
			"start : EOF;\n";

		let  expected =
			"error(" + ErrorType.CHANNELS_BLOCK_IN_PARSER_GRAMMAR.code + "): T.g4:3:0: custom channels are not supported in parser grammars\n";

		let  pair = [ grammar, expected ];
		testErrors(pair, true);
	}

	@Test
public  testChannelDefinitionInCombined():  void {
		let  grammar =
			"grammar T;\n" +
			"\n" +
			"channels {\n" +
			"	WHITESPACE_CHANNEL,\n" +
			"	COMMENT_CHANNEL\n" +
			"}\n" +
			"\n" +
			"start : EOF;\n" +
			"\n" +
			"COMMENT:    '//' ~[\\n]+ -> channel(COMMENT_CHANNEL);\n" +
			"WHITESPACE: [ \\t]+      -> channel(WHITESPACE_CHANNEL);\n";

		let  expected =
			"error(" + ErrorType.CONSTANT_VALUE_IS_NOT_A_RECOGNIZED_CHANNEL_NAME.code + "): T.g4:10:35: COMMENT_CHANNEL is not a recognized channel name\n" +
			"error(" + ErrorType.CONSTANT_VALUE_IS_NOT_A_RECOGNIZED_CHANNEL_NAME.code + "): T.g4:11:35: WHITESPACE_CHANNEL is not a recognized channel name\n" +
			"error(" + ErrorType.CHANNELS_BLOCK_IN_COMBINED_GRAMMAR.code + "): T.g4:3:0: custom channels are not supported in combined grammars\n";

		let  pair = [ grammar, expected ];
		testErrors(pair, true);
	}

	/**
	 * This is a regression test for antlr/antlr4#497 now that antlr/antlr4#309
	 * is resolved.
	 * https://github.com/antlr/antlr4/issues/497
	 * https://github.com/antlr/antlr4/issues/309
	 */
	@Test
public  testChannelDefinitions():  void {
		let  grammar =
			"lexer grammar T;\n" +
			"\n" +
			"channels {\n" +
			"	WHITESPACE_CHANNEL,\n" +
			"	COMMENT_CHANNEL\n" +
			"}\n" +
			"\n" +
			"COMMENT:    '//' ~[\\n]+ -> channel(COMMENT_CHANNEL);\n" +
			"WHITESPACE: [ \\t]+      -> channel(WHITESPACE_CHANNEL);\n" +
			"NEWLINE:    '\\r'? '\\n' -> channel(NEWLINE_CHANNEL);";

		// WHITESPACE_CHANNEL and COMMENT_CHANNEL are defined, but NEWLINE_CHANNEL is not
		let  expected =
			"error(" + ErrorType.CONSTANT_VALUE_IS_NOT_A_RECOGNIZED_CHANNEL_NAME.code + "): T.g4:10:34: NEWLINE_CHANNEL is not a recognized channel name\n";

		let  pair = [ grammar, expected ];
		testErrors(pair, true);
	}

	// Test for https://github.com/antlr/antlr4/issues/1556
	@Test
public  testRangeInParserGrammar():  void {
		let  grammar =
			"grammar T;\n"+
			"a:  'A'..'Z' ;\n";
		let  expected =
			"error(" + ErrorType.TOKEN_RANGE_IN_PARSER.code + "): T.g4:2:4: token ranges not allowed in parser: 'A'..'Z'\n";

		let  pair =  [
			grammar,
			expected
		];

		testErrors(pair, true);
	}

	@Test
public  testRuleNamesAsTree():  void {
		let  grammar =
				"grammar T;\n" +
				"tree : 'X';";
		testErrors( [ grammar, "" ], true);
	}

	@Test
public  testLexerRuleLabel():  void {
		let  grammar =
				"grammar T;\n" +
				"a : A;\n" +
				"A : h=~('b'|'c') ;";
		testErrors( [
				grammar,
				"error(" + ErrorType.SYNTAX_ERROR.code + "): T.g4:3:5: syntax error: '=' came as a complete surprise to me while looking for lexer rule element\n" ], false);
	}
}
