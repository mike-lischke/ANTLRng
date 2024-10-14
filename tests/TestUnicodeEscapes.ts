/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */


/* eslint-disable jsdoc/require-returns, jsdoc/require-param */





export  class TestUnicodeEscapes {
	@Test
public  latinJavaEscape():  void {
		this.checkUnicodeEscape("\\u0061", 0x0061, "Java");
	}

	@Test
public  latinPythonEscape():  void {
		this.checkUnicodeEscape("\\u0061", 0x0061, "Python3");
	}

	@Test
public  latinSwiftEscape():  void {
		this.checkUnicodeEscape("\\u{0061}", 0x0061, "Swift");
	}

	@Test
public  bmpJavaEscape():  void {
		this.checkUnicodeEscape("\\uABCD", 0xABCD, "Java");
	}

	@Test
public  bmpPythonEscape():  void {
		this.checkUnicodeEscape("\\uABCD", 0xABCD, "Python3");
	}

	@Test
public  bmpSwiftEscape():  void {
		this.checkUnicodeEscape("\\u{ABCD}", 0xABCD, "Swift");
	}

	@Test
public  smpJavaEscape():  void {
		this.checkUnicodeEscape("\\uD83D\\uDCA9", 0x1F4A9, "Java");
	}

	@Test
public  smpPythonEscape():  void {
		this.checkUnicodeEscape("\\U0001F4A9", 0x1F4A9, "Python3");
	}

	@Test
public  smpSwiftEscape():  void {
		this.checkUnicodeEscape("\\u{1F4A9}", 0x1F4A9, "Swift");
	}

	private  checkUnicodeEscape(expected: string, input: number, language: string):  void {
		assertEquals(expected, UnicodeEscapes.escapeCodePoint(input, language));
	}
}
