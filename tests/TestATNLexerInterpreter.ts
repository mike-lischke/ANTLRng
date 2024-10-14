/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */


/* eslint-disable jsdoc/require-returns, jsdoc/require-param */


import { Token, Lexer, CharStreams, CharStream, ATN, ATNState, LexerATNSimulator, DFA, Utils } from "antlr4ng";



/**
 * Lexer rules are little quirky when it comes to wildcards. Problem
 * stems from the fact that we want the longest match to win among
 * several rules and even within a rule. However, that conflicts
 * with the notion of non-greedy, which by definition tries to match
 * the fewest possible. During ATN construction, non-greedy loops
 * have their entry and exit branches reversed so that the ATN
 * simulator will see the exit branch 1st, giving it a priority. The
 * 1st path to the stop state kills any other paths for that rule
 * that begin with the wildcard. In general, this does everything we
 * want, but occasionally there are some quirks as you'll see from
 * the tests below.
 */
export  class TestATNLexerInterpreter {

	private static  getTokenTypes(lg: LexerGrammar, atn: ATN, input: CharStream):  Array<string> {
		let  interp = new  LexerATNSimulator(atn,  [new  DFA(atn.modeToStartState.get(Lexer.DEFAULT_MODE))], null);
		let  tokenTypes = new  Array();
		let  ttype: number;
		let  hitEOF = false;
		do {
			if ( hitEOF ) {
				tokenTypes.add("EOF");
				break;
			}
			let  t = input.LA(1);
			ttype = interp.match(input, Lexer.DEFAULT_MODE);
			if ( ttype=== Token.EOF ) {
				tokenTypes.add("EOF");
			}
			else {
				tokenTypes.add(lg.typeToTokenList.get(ttype));
			}

			if ( t=== java.util.stream.IntStream.EOF ) {
				hitEOF = true;
			}
		} while ( ttype!==Token.EOF );
		return tokenTypes;
	}
	@Test
public  testLexerTwoRules():  void {
		let  lg = new  LexerGrammar(
			"lexer grammar L;\n"+
			"A : 'a' ;\n" +
			"B : 'b' ;\n");
		let  expecting = "A, B, A, B, EOF";
		this.checkLexerMatches(lg, "abab", expecting);
	}

	@Test
public  testShortLongRule():  void {
		let  lg = new  LexerGrammar(
			"lexer grammar L;\n"+
			"A : 'xy'\n" +
			"  | 'xyz'\n" + // this alt is preferred since there are no non-greedy configs
			"  ;\n" +
			"Z : 'z'\n" +
			"  ;\n");
		this.checkLexerMatches(lg, "xy", "A, EOF");
		this.checkLexerMatches(lg, "xyz", "A, EOF");
	}

	@Test
public  testShortLongRule2():  void {
		let  lg = new  LexerGrammar(
			"lexer grammar L;\n"+
			"A : 'xyz'\n" +  // make sure nongreedy mech cut off doesn't kill this alt
			"  | 'xy'\n" +
			"  ;\n");
		this.checkLexerMatches(lg, "xy", "A, EOF");
		this.checkLexerMatches(lg, "xyz", "A, EOF");
	}

	@Test
public  testWildOnEndFirstAlt():  void {
		let  lg = new  LexerGrammar(
			"lexer grammar L;\n"+
			"A : 'xy' .\n" + // should pursue '.' since xyz hits stop first, before 2nd alt
			"  | 'xy'\n" +
			"  ;\n" +
			"Z : 'z'\n" +
			"  ;\n");
		this.checkLexerMatches(lg, "xy", "A, EOF");
		this.checkLexerMatches(lg, "xyz", "A, EOF");
	}

	@Test
public  testWildOnEndLastAlt():  void {
		let  lg = new  LexerGrammar(
			"lexer grammar L;\n"+
			"A : 'xy'\n" +
			"  | 'xy' .\n" +  // this alt is preferred since there are no non-greedy configs
			"  ;\n" +
			"Z : 'z'\n" +
			"  ;\n");
		this.checkLexerMatches(lg, "xy", "A, EOF");
		this.checkLexerMatches(lg, "xyz", "A, EOF");
	}

	@Test
public  testWildcardNonQuirkWhenSplitBetweenTwoRules():  void {
		let  lg = new  LexerGrammar(
			"lexer grammar L;\n"+
			"A : 'xy' ;\n" +
			"B : 'xy' . 'z' ;\n");
		this.checkLexerMatches(lg, "xy", "A, EOF");
		this.checkLexerMatches(lg, "xyqz", "B, EOF");
	}

	@Test
public  testLexerLoops():  void {
		let  lg = new  LexerGrammar(
			"lexer grammar L;\n"+
			"INT : '0'..'9'+ ;\n" +
			"ID : 'a'..'z'+ ;\n");
		let  expecting = "ID, INT, ID, INT, EOF";
		this.checkLexerMatches(lg, "a34bde3", expecting);
	}

	@Test
public  testLexerNotSet():  void {
		let  lg = new  LexerGrammar(
			"lexer grammar L;\n"+
			"ID : ~('a'|'b')\n ;");
		let  expecting = "ID, EOF";
		this.checkLexerMatches(lg, "c", expecting);
	}

	@Test
public  testLexerSetUnicodeBMP():  void {
		let  lg = new  LexerGrammar(
			"lexer grammar L;\n"+
			"ID : ('\u611B'|'\u611C')\n ;");
		let  expecting = "ID, EOF";
		this.checkLexerMatches(lg, "\u611B", expecting);
	}

	@Test
public  testLexerNotSetUnicodeBMP():  void {
		let  lg = new  LexerGrammar(
			"lexer grammar L;\n"+
			"ID : ~('\u611B'|'\u611C')\n ;");
		let  expecting = "ID, EOF";
		this.checkLexerMatches(lg, "\u611D", expecting);
	}

		@Test
public  testLexerNotSetUnicodeBMPMatchesSMP():  void {
		let  lg = new  LexerGrammar(
			"lexer grammar L;\n"+
			"ID : ~('\u611B'|'\u611C')\n ;");
		let  expecting = "ID, EOF";
		this.checkLexerMatches(lg, new  StringBuilder().appendCodePoint(0x1F4A9).toString(), expecting);
	}

	@Test
public  testLexerSetUnicodeSMP():  void {
		let  lg = new  LexerGrammar(
			"lexer grammar L;\n"+
			"ID : ('\\u{1F4A9}'|'\\u{1F4AA}')\n ;");
		let  expecting = "ID, EOF";
		this.checkLexerMatches(lg, new  StringBuilder().appendCodePoint(0x1F4A9).toString(), expecting);
	}

	@Test
public  testLexerNotBMPSetMatchesUnicodeSMP():  void {
		let  lg = new  LexerGrammar(
			"lexer grammar L;\n"+
			"ID : ~('a'|'b')\n ;");
		let  expecting = "ID, EOF";
		this.checkLexerMatches(lg, new  StringBuilder().appendCodePoint(0x1F4A9).toString(), expecting);
	}

	@Test
public  testLexerNotBMPSetMatchesBMP():  void {
		let  lg = new  LexerGrammar(
			"lexer grammar L;\n"+
			"ID : ~('a'|'b')\n ;");
		let  expecting = "ID, EOF";
		this.checkLexerMatches(lg, "\u611B", expecting);
	}

	@Test
public  testLexerNotBMPSetMatchesSMP():  void {
		let  lg = new  LexerGrammar(
			"lexer grammar L;\n"+
			"ID : ~('a'|'b')\n ;");
		let  expecting = "ID, EOF";
		this.checkLexerMatches(lg, new  StringBuilder().appendCodePoint(0x1F4A9).toString(), expecting);
	}

	@Test
public  testLexerNotSMPSetMatchesBMP():  void {
		let  lg = new  LexerGrammar(
			"lexer grammar L;\n"+
			"ID : ~('\\u{1F4A9}'|'\\u{1F4AA}')\n ;");
		let  expecting = "ID, EOF";
		this.checkLexerMatches(lg, "\u611B", expecting);
	}

	@Test
public  testLexerNotSMPSetMatchesSMP():  void {
		let  lg = new  LexerGrammar(
			"lexer grammar L;\n"+
			"ID : ~('\\u{1F4A9}'|'\\u{1F4AA}')\n ;");
		let  expecting = "ID, EOF";
		this.checkLexerMatches(lg, new  StringBuilder().appendCodePoint(0x1D7C0).toString(), expecting);
	}

	@Test
public  testLexerRangeUnicodeSMP():  void {
		let  lg = new  LexerGrammar(
			"lexer grammar L;\n"+
			"ID : ('\\u{1F4A9}'..'\\u{1F4B0}')\n ;");
		let  expecting = "ID, EOF";
		this.checkLexerMatches(lg, new  StringBuilder().appendCodePoint(0x1F4AF).toString(), expecting);
	}

	@Test
public  testLexerRangeUnicodeBMPToSMP():  void {
		let  lg = new  LexerGrammar(
			"lexer grammar L;\n"+
			"ID : ('\\u611B'..'\\u{1F4B0}')\n ;");
		let  expecting = "ID, EOF";
		this.checkLexerMatches(lg, new  StringBuilder().appendCodePoint(0x12001).toString(), expecting);
	}

	@Test
public  testLexerKeywordIDAmbiguity():  void {
		let  lg = new  LexerGrammar(
			"lexer grammar L;\n"+
			"KEND : 'end' ;\n" +
			"ID : 'a'..'z'+ ;\n" +
			"WS : (' '|'\\n')+ ;");
		let  expecting = "ID, EOF";
		//checkLexerMatches(lg, "e", expecting);
		expecting = "KEND, EOF";
		this.checkLexerMatches(lg, "end", expecting);
		expecting = "ID, EOF";
		this.checkLexerMatches(lg, "ending", expecting);
		expecting = "ID, WS, KEND, WS, ID, EOF";
		this.checkLexerMatches(lg, "a end bcd", expecting);
	}

	@Test
public  testLexerRuleRef():  void {
		let  lg = new  LexerGrammar(
			"lexer grammar L;\n"+
			"INT : DIGIT+ ;\n" +
			"fragment DIGIT : '0'..'9' ;\n" +
			"WS : (' '|'\\n')+ ;");
		let  expecting = "INT, WS, INT, EOF";
		this.checkLexerMatches(lg, "32 99", expecting);
	}

	@Test
public  testRecursiveLexerRuleRef():  void {
		let  lg = new  LexerGrammar(
			"lexer grammar L;\n"+
			"CMT : '/*' (CMT | ~'*')+ '*/' ;\n" +
			"WS : (' '|'\\n')+ ;");
		let  expecting = "CMT, WS, CMT, EOF";
		this.checkLexerMatches(lg, "/* ick */\n/* /*nested*/ */", expecting);
	}

	@Test
public  testRecursiveLexerRuleRefWithWildcard():  void {
		let  lg = new  LexerGrammar(
			"lexer grammar L;\n"+
			"CMT : '/*' (CMT | .)*? '*/' ;\n" +
			"WS : (' '|'\\n')+ ;");

		let  expecting = "CMT, WS, CMT, WS, EOF";
		this.checkLexerMatches(lg,
						  "/* ick */\n" +
						  "/* /* */\n" +
						  "/* /*nested*/ */\n",
						  expecting);
	}

	@Test
public  testLexerWildcardGreedyLoopByDefault():  void {
		let  lg = new  LexerGrammar(
			"lexer grammar L;\n"+
			"CMT : '//' .* '\\n' ;\n");
		let  expecting = "CMT, EOF";
		this.checkLexerMatches(lg, "//x\n//y\n", expecting);
	}

	@Test
public  testLexerWildcardLoopExplicitNonGreedy():  void {
		let  lg = new  LexerGrammar(
			"lexer grammar L;\n"+
			"CMT : '//' .*? '\\n' ;\n");
		let  expecting = "CMT, CMT, EOF";
		this.checkLexerMatches(lg, "//x\n//y\n", expecting);
	}

	@Test
public  testLexerEscapeInString():  void {
		let  lg = new  LexerGrammar(
			"lexer grammar L;\n"+
			"STR : '[' ('~' ']' | .)* ']' ;\n");
		this.checkLexerMatches(lg, "[a~]b]", "STR, EOF");
		this.checkLexerMatches(lg, "[a]", "STR, EOF");
	}

	@Test
public  testLexerWildcardGreedyPlusLoopByDefault():  void {
		let  lg = new  LexerGrammar(
			"lexer grammar L;\n"+
			"CMT : '//' .+ '\\n' ;\n");
		let  expecting = "CMT, EOF";
		this.checkLexerMatches(lg, "//x\n//y\n", expecting);
	}

	@Test
public  testLexerWildcardExplicitNonGreedyPlusLoop():  void {
		let  lg = new  LexerGrammar(
			"lexer grammar L;\n"+
			"CMT : '//' .+? '\\n' ;\n");
		let  expecting = "CMT, CMT, EOF";
		this.checkLexerMatches(lg, "//x\n//y\n", expecting);
	}

	// does not fail since ('*/')? can't match and have rule succeed
	@Test
public  testLexerGreedyOptionalShouldWorkAsWeExpect():  void {
		let  lg = new  LexerGrammar(
			"lexer grammar L;\n"+
			"CMT : '/*' ('*/')? '*/' ;\n");
		let  expecting = "CMT, EOF";
		this.checkLexerMatches(lg, "/**/", expecting);
	}

	@Test
public  testGreedyBetweenRules():  void {
		let  lg = new  LexerGrammar(
			"lexer grammar L;\n"+
			"A : '<a>' ;\n" +
			"B : '<' .+ '>' ;\n");
		let  expecting = "B, EOF";
		this.checkLexerMatches(lg, "<a><x>", expecting);
	}

	@Test
public  testNonGreedyBetweenRules():  void {
		let  lg = new  LexerGrammar(
			"lexer grammar L;\n"+
			"A : '<a>' ;\n" +
			"B : '<' .+? '>' ;\n");
		let  expecting = "A, B, EOF";
		this.checkLexerMatches(lg, "<a><x>", expecting);
	}

	@Test
public  testEOFAtEndOfLineComment():  void {
		let  lg = new  LexerGrammar(
			"lexer grammar L;\n"+
			"CMT : '//' ~('\\n')* ;\n");
		let  expecting = "CMT, EOF";
		this.checkLexerMatches(lg, "//x", expecting);
	}

	@Test
public  testEOFAtEndOfLineComment2():  void {
		let  lg = new  LexerGrammar(
			"lexer grammar L;\n"+
			"CMT : '//' ~('\\n'|'\\r')* ;\n");
		let  expecting = "CMT, EOF";
		this.checkLexerMatches(lg, "//x", expecting);
	}

	/** only positive sets like (EOF|'\n') can match EOF and not in wildcard or ~foo sets
	 *  EOF matches but does not advance cursor.
	 */
	@Test
public  testEOFInSetAtEndOfLineComment():  void {
		let  lg = new  LexerGrammar(
			"lexer grammar L;\n"+
			"CMT : '//' .* (EOF|'\\n') ;\n");
		let  expecting = "CMT, EOF";
		this.checkLexerMatches(lg, "//", expecting);
	}

	@Test
public  testEOFSuffixInSecondRule():  void {
		let  lg = new  LexerGrammar(
			"lexer grammar L;\n"+
			"A : 'a' ;\n"+ // shorter than 'a' EOF, despite EOF being 0 width
			"B : 'a' EOF ;\n");
		let  expecting = "B, EOF";
		this.checkLexerMatches(lg, "a", expecting);
	}

	@Test
public  testEOFSuffixInFirstRule():  void {
		let  lg = new  LexerGrammar(
			"lexer grammar L;\n"+
			"A : 'a' EOF ;\n"+
			"B : 'a';\n");
		let  expecting = "A, EOF";
		this.checkLexerMatches(lg, "a", expecting);
	}

	@Test
public  testEOFByItself():  void {
		let  lg = new  LexerGrammar(
			"lexer grammar L;\n"+
			"DONE : EOF ;\n"+
			"A : 'a';\n");
		let  expecting = "A, DONE, EOF";
		this.checkLexerMatches(lg, "a", expecting);
	}

	@Test
public  testLexerCaseInsensitive():  void {
		let  lg = new  LexerGrammar(
			"lexer grammar L;\n" +
			"\n" +
			"options { caseInsensitive = true; }\n" +
			"\n" +
			"WS:             [ \\t\\r\\n] -> skip;\n" +
			"\n" +
			"SIMPLE_TOKEN:           'and';\n" +
			"TOKEN_WITH_SPACES:      'as' 'd' 'f';\n" +
			"TOKEN_WITH_DIGITS:      'INT64';\n" +
			"TOKEN_WITH_UNDERSCORE:  'TOKEN_WITH_UNDERSCORE';\n" +
			"BOOL:                   'true' | 'FALSE';\n" +
			"SPECIAL:                '==';\n" +
			"SET:                    [a-z0-9]+;\n" +   // [a-zA-Z0-9]
			"RANGE:                  ('а'..'я')+;"
			);

		let  inputString =
			"and AND aND\n" +
			"asdf ASDF\n" +
			"int64\n" +
			"token_WITH_underscore\n" +
			"TRUE FALSE\n" +
			"==\n" +
			"A0bcDE93\n" +
			"АБВабв\n";

		let  expecting = Utils.join( [
			"SIMPLE_TOKEN", "SIMPLE_TOKEN", "SIMPLE_TOKEN",
			"TOKEN_WITH_SPACES", "TOKEN_WITH_SPACES",
			"TOKEN_WITH_DIGITS",
			"TOKEN_WITH_UNDERSCORE",
			"BOOL", "BOOL",
			"SPECIAL",
			"SET",
			"RANGE",
			"EOF"
		],
		", WS, ");

		this.checkLexerMatches(lg, inputString, expecting);
	}

	@Test
public  testLexerCaseInsensitiveLiteralWithNegation():  void {
		let  grammar =
				"lexer grammar L;\n" +
				"options { caseInsensitive = true; }\n" +
				"LITERAL_WITH_NOT:   ~'f';\n";     // ~('f' | 'F)
		let  executedState = execLexer("L.g4", grammar, "L", "F");

		assertEquals("line 1:0 token recognition error at: 'F'\n", executedState.errors);
	}

	@Test
public  testLexerCaseInsensitiveSetWithNegation():  void {
		let  grammar =
				"lexer grammar L;\n" +
				"options { caseInsensitive = true; }\n" +
				"SET_WITH_NOT: ~[a-c];\n";        // ~[a-cA-C]
		let  executedState = execLexer("L.g4", grammar, "L", "B");

		assertEquals("line 1:0 token recognition error at: 'B'\n", executedState.errors);
	}

	@Test
public  testLexerCaseInsensitiveFragments():  void {
		let  lg = new  LexerGrammar(
				"lexer grammar L;\n" +
				"options { caseInsensitive = true; }\n" +
				"TOKEN_0:         FRAGMENT 'd'+;\n" +
				"TOKEN_1:         FRAGMENT 'e'+;\n" +
				"FRAGMENT:        'abc';\n");

		let  inputString =
				"ABCDDD";

		let  expecting = "TOKEN_0, EOF";

		this.checkLexerMatches(lg, inputString, expecting);
	}

	@Test
public  testLexerCaseInsensitiveWithDifferentCultures():  void {
		// From http://www.periodni.com/unicode_utf-8_encoding.html
		let  lg = new  LexerGrammar(
				"lexer grammar L;\n" +
				"options { caseInsensitive = true; }\n" +
				"ENGLISH_TOKEN:   [a-z]+;\n" +
				"GERMAN_TOKEN:    [äéöüß]+;\n" +
				"FRENCH_TOKEN:    [àâæ-ëîïôœùûüÿ]+;\n" +
				"CROATIAN_TOKEN:  [ćčđšž]+;\n" +
				"ITALIAN_TOKEN:   [àèéìòù]+;\n" +
				"SPANISH_TOKEN:   [áéíñóúü¡¿]+;\n" +
				"GREEK_TOKEN:     [α-ω]+;\n" +
				"RUSSIAN_TOKEN:   [а-я]+;\n" +
				"WS:              [ ]+ -> skip;"
				);

		let  inputString = "abcXYZ äéöüßÄÉÖÜß àâæçÙÛÜŸ ćčđĐŠŽ àèéÌÒÙ áéÚÜ¡¿ αβγΧΨΩ абвЭЮЯ ";

		let  expecting = Utils.join( [
				"ENGLISH_TOKEN",
				"GERMAN_TOKEN",
				"FRENCH_TOKEN",
				"CROATIAN_TOKEN",
				"ITALIAN_TOKEN",
				"SPANISH_TOKEN",
				"GREEK_TOKEN",
				"RUSSIAN_TOKEN",
				"EOF" ],
				", WS, ");

		this.checkLexerMatches(lg, inputString, expecting);
	}

	@Test
public  testNotImpliedCharactersWithEnabledCaseInsensitiveOption():  void {
		let  lg = new  LexerGrammar(
				"lexer grammar L;\n" +
				"options { caseInsensitive = true; }\n" +
				"TOKEN: ('A'..'z')+;\n"
		);

		// No range transformation because of mixed character case in range borders
		let  inputString = "ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz";
		this.checkLexerMatches(lg, inputString, "TOKEN, EOF");
	}

	@Test
public  testCaseInsensitiveInLexerRule():  void {
		let  lg = new  LexerGrammar(
				"lexer grammar L;\n" +
				"TOKEN1 options { caseInsensitive=true; } : [a-f]+;\n" +
				"WS: [ ]+ -> skip;"
		);

		this.checkLexerMatches(lg, "ABCDEF", "TOKEN1, EOF");
	}

	@Test
public  testCaseInsensitiveInLexerRuleOverridesGlobalValue():  void {
		let  grammar =
				"lexer grammar L;\n" +
				"options { caseInsensitive=true; }\n" +
				"STRING options { caseInsensitive=false; } : 'N'? '\\'' (~'\\'' | '\\'\\'')* '\\'';\n";

		let  executedState = execLexer("L.g4", grammar, "L", "n'sample'");
		assertEquals("line 1:0 token recognition error at: 'n'\n", executedState.errors);
	}

	private  checkLexerMatches(lg: LexerGrammar, inputString: string, expecting: string):  void {
		let  atn = createATN(lg, true);
		let  input = CharStreams.fromString(inputString);
		let  startState = atn.modeNameToStartState.get("DEFAULT_MODE");
		let  dot = new  DOTGenerator(lg);
//		System.out.println(dot.getDOT(startState, true));

		let  tokenTypes = TestATNLexerInterpreter.getTokenTypes(lg, atn, input);

		let  result = Utils.join(tokenTypes.iterator(), ", ");
//		System.out.println(tokenTypes);
		assertEquals(expecting, result);
	}
}
