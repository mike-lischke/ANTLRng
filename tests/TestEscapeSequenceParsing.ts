/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */


/* eslint-disable jsdoc/require-returns, jsdoc/require-param */


import { IntervalSet } from "antlr4ng";



export  class TestEscapeSequenceParsing {
	@Test
public  testParseEmpty():  void {
		assertEquals(
				EscapeSequenceParsing.Result.Type.INVALID,
				EscapeSequenceParsing.parseEscape("", 0).type);
	}

	@Test
public  testParseJustBackslash():  void {
		assertEquals(
				EscapeSequenceParsing.Result.Type.INVALID,
				EscapeSequenceParsing.parseEscape("\\", 0).type);
	}

	@Test
public  testParseInvalidEscape():  void {
		assertEquals(
				EscapeSequenceParsing.Result.Type.INVALID,
				EscapeSequenceParsing.parseEscape("\\z", 0).type);
	}

	@Test
public  testParseNewline():  void {
		assertEquals(
				new  Result(Result.Type.CODE_POINT, '\n', IntervalSet.EMPTY_SET, 0,2),
				EscapeSequenceParsing.parseEscape("\\n", 0));
	}

	@Test
public  testParseTab():  void {
		assertEquals(
				new  Result(Result.Type.CODE_POINT, '\t', IntervalSet.EMPTY_SET, 0,2),
				EscapeSequenceParsing.parseEscape("\\t", 0));
	}

	@Test
public  testParseUnicodeTooShort():  void {
		assertEquals(
				EscapeSequenceParsing.Result.Type.INVALID,
				EscapeSequenceParsing.parseEscape("\\uABC", 0).type);
	}

	@Test
public  testParseUnicodeBMP():  void {
		assertEquals(
				new  Result(Result.Type.CODE_POINT, 0xABCD, IntervalSet.EMPTY_SET, 0,6),
				EscapeSequenceParsing.parseEscape("\\uABCD", 0));
	}

	@Test
public  testParseUnicodeSMPTooShort():  void {
		assertEquals(
				EscapeSequenceParsing.Result.Type.INVALID,
				EscapeSequenceParsing.parseEscape("\\u{}", 0).type);
	}

	@Test
public  testParseUnicodeSMPMissingCloseBrace():  void {
		assertEquals(
				EscapeSequenceParsing.Result.Type.INVALID,
				EscapeSequenceParsing.parseEscape("\\u{12345", 0).type);
	}

	@Test
public  testParseUnicodeTooBig():  void {
		assertEquals(
				EscapeSequenceParsing.Result.Type.INVALID,
				EscapeSequenceParsing.parseEscape("\\u{110000}", 0).type);
	}

	@Test
public  testParseUnicodeSMP():  void {
		assertEquals(
				new  Result(Result.Type.CODE_POINT, 0x10ABCD, IntervalSet.EMPTY_SET, 0,10),
				EscapeSequenceParsing.parseEscape("\\u{10ABCD}", 0));
	}

	@Test
public  testParseUnicodePropertyTooShort():  void {
		assertEquals(
				EscapeSequenceParsing.Result.Type.INVALID,
				EscapeSequenceParsing.parseEscape("\\p{}", 0).type);
	}

	@Test
public  testParseUnicodePropertyMissingCloseBrace():  void {
		assertEquals(
				EscapeSequenceParsing.Result.Type.INVALID,
				EscapeSequenceParsing.parseEscape("\\p{1234", 0).type);
	}

	@Test
public  testParseUnicodeProperty():  void {
		assertEquals(
				new  Result(Result.Type.PROPERTY, -1, IntervalSet.of(66560, 66639), 0,11),
				EscapeSequenceParsing.parseEscape("\\p{Deseret}", 0));
	}

	@Test
public  testParseUnicodePropertyInvertedTooShort():  void {
		assertEquals(
				EscapeSequenceParsing.Result.Type.INVALID,
				EscapeSequenceParsing.parseEscape("\\P{}", 0).type);
	}

	@Test
public  testParseUnicodePropertyInvertedMissingCloseBrace():  void {
		assertEquals(
				EscapeSequenceParsing.Result.Type.INVALID,
				EscapeSequenceParsing.parseEscape("\\P{Deseret", 0).type);
	}

	@Test
public  testParseUnicodePropertyInverted():  void {
		let  expected = IntervalSet.of(0, 66559);
		expected.add(66640, Character.MAX_CODE_POINT);
		assertEquals(
				new  Result(Result.Type.PROPERTY, -1, expected, 0, 11),
				EscapeSequenceParsing.parseEscape("\\P{Deseret}", 0));
	}
}
