/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/* eslint-disable jsdoc/require-returns, jsdoc/require-param */


import { Token, Vocabulary, VocabularyImpl as Vocabulary } from "antlr4ng";



/**
 *
 * @author Sam Harwell
 */
export  class TestVocabulary {
	@Test
public  testEmptyVocabulary():  void {
		assertNotNull(VocabularyImpl.EMPTY_VOCABULARY);
		assertEquals("EOF", VocabularyImpl.EMPTY_VOCABULARY.getSymbolicName(Token.EOF));
		assertEquals("0", VocabularyImpl.EMPTY_VOCABULARY.getDisplayName(Token.INVALID_TYPE));
	}

	@Test
public  testVocabularyFromTokenNames():  void {
		let  tokenNames = [
			"<INVALID>",
			"TOKEN_REF", "RULE_REF", "'//'", "'/'", "'*'", "'!'", "ID", "STRING"
		];

		let  vocabulary = VocabularyImpl.fromTokenNames(tokenNames);
		assertNotNull(vocabulary);
		assertEquals("EOF", vocabulary.getSymbolicName(Token.EOF));
		for (let  i = 0; i < tokenNames.length; i++) {
			assertEquals(tokenNames[i], vocabulary.getDisplayName(i));

			if (tokenNames[i].startsWith("'")) {
				assertEquals(tokenNames[i], vocabulary.getLiteralName(i));
				assertNull(vocabulary.getSymbolicName(i));
			}
			else {
 if (Character.isUpperCase(tokenNames[i].charAt(0))) {
				assertNull(vocabulary.getLiteralName(i));
				assertEquals(tokenNames[i], vocabulary.getSymbolicName(i));
			}
			else {
				assertNull(vocabulary.getLiteralName(i));
				assertNull(vocabulary.getSymbolicName(i));
			}
}

		}
	}
}
