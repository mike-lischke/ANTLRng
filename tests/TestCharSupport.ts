/*
 * Copyright (c) 2012-2019 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */


/* eslint-disable jsdoc/require-returns, jsdoc/require-param */


import { IntervalSet } from "antlr4ng";



export  class TestCharSupport {
	@Test
public  testGetANTLRCharLiteralForChar():  void {
		assertEquals("'<INVALID>'",
			CharSupport.getANTLRCharLiteralForChar(-1));
		assertEquals("'\\n'",
			CharSupport.getANTLRCharLiteralForChar('\n'));
		assertEquals("'\\\\'",
			CharSupport.getANTLRCharLiteralForChar('\\'));
		assertEquals("'\\''",
			CharSupport.getANTLRCharLiteralForChar('\''));
		assertEquals("'b'",
			CharSupport.getANTLRCharLiteralForChar('b'));
		assertEquals("'\\uFFFF'",
			CharSupport.getANTLRCharLiteralForChar(0xFFFF));
		assertEquals("'\\u{10FFFF}'",
			CharSupport.getANTLRCharLiteralForChar(0x10FFFF));
	}

	@Test
public  testGetCharValueFromGrammarCharLiteral():  void {
		assertEquals(-1,
			CharSupport.getCharValueFromGrammarCharLiteral(null));
		assertEquals(-1,
			CharSupport.getCharValueFromGrammarCharLiteral(""));
		assertEquals(-1,
			CharSupport.getCharValueFromGrammarCharLiteral("b"));
		assertEquals(111,
			CharSupport.getCharValueFromGrammarCharLiteral("foo"));
	}

	@Test
public  testGetStringFromGrammarStringLiteral():  void {
		assertNull(CharSupport
			.getStringFromGrammarStringLiteral("foo\\u{bbb"));
		assertNull(CharSupport
			.getStringFromGrammarStringLiteral("foo\\u{[]bb"));
		assertNull(CharSupport
			.getStringFromGrammarStringLiteral("foo\\u[]bb"));
		assertNull(CharSupport
			.getStringFromGrammarStringLiteral("foo\\ubb"));

		assertEquals("oo»b", CharSupport
			.getStringFromGrammarStringLiteral("foo\\u{bb}bb"));
	}

	@Test
public  testGetCharValueFromCharInGrammarLiteral():  void {
		assertEquals(102,
			CharSupport.getCharValueFromCharInGrammarLiteral("f"));

		assertEquals(-1,
			CharSupport.getCharValueFromCharInGrammarLiteral("\' "));
		assertEquals(-1,
			CharSupport.getCharValueFromCharInGrammarLiteral("\\ "));
		assertEquals(39,
			CharSupport.getCharValueFromCharInGrammarLiteral("\\\'"));
		assertEquals(10,
			CharSupport.getCharValueFromCharInGrammarLiteral("\\n"));

		assertEquals(-1,
			CharSupport.getCharValueFromCharInGrammarLiteral("foobar"));
		assertEquals(4660,
			CharSupport.getCharValueFromCharInGrammarLiteral("\\u1234"));
		assertEquals(18,
			CharSupport.getCharValueFromCharInGrammarLiteral("\\u{12}"));

		assertEquals(-1,
			CharSupport.getCharValueFromCharInGrammarLiteral("\\u{"));
		assertEquals(-1,
			CharSupport.getCharValueFromCharInGrammarLiteral("foo"));
	}

	@Test
public  testParseHexValue():  void {
		assertEquals(-1, CharSupport.parseHexValue("foobar", -1, 3));
		assertEquals(-1, CharSupport.parseHexValue("foobar", 1, -1));
		assertEquals(-1, CharSupport.parseHexValue("foobar", 1, 3));
		assertEquals(35, CharSupport.parseHexValue("123456", 1, 3));
	}

	@Test
public  testCapitalize():  void {
		assertEquals("Foo", CharSupport.capitalize("foo"));
	}

	@Test
public  testGetIntervalSetEscapedString():  void {
		assertEquals("",
			CharSupport.getIntervalSetEscapedString(new  IntervalSet()));
		assertEquals("'\\u0000'",
			CharSupport.getIntervalSetEscapedString(new  IntervalSet(0)));
		assertEquals("'\\u0001'..'\\u0003'",
			CharSupport.getIntervalSetEscapedString(new  IntervalSet(3, 1, 2)));
	}

	@Test
public  testGetRangeEscapedString():  void {
		assertEquals("'\\u0002'..'\\u0004'",
			CharSupport.getRangeEscapedString(2, 4));
		assertEquals("'\\u0002'",
			CharSupport.getRangeEscapedString(2, 2));
	}
}
