/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */



import { JavaObject } from "jree";
import { ANTLRInputStream, BufferedTokenStream, CharStream, Token } from "antlr4ng";

import { Test, Override } from "../../../../../../../../decorators.js";


/**
 * This class contains tests for specific API functionality in {@link TokenStream} and derived types.
 */
export  class TestTokenStream extends JavaObject {

	/**
	 * This is a targeted regression test for antlr/antlr4#1584 ({@link BufferedTokenStream} cannot be reused after EOF).
	 */
	@Test
public  testBufferedTokenStreamReuseAfterFill():  void {
		let  firstInput = new  ANTLRInputStream("A");
		let  tokenStream = new  BufferedTokenStream(new  VisitorBasicLexer(firstInput));
		tokenStream.fill();
		assertEquals(2, tokenStream.size());
		assertEquals(VisitorBasicLexer.A, tokenStream.get(0).getType());
		assertEquals(Token.EOF, tokenStream.get(1).getType());

		let  secondInput = new  ANTLRInputStream("AA");
		tokenStream.setTokenSource(new  VisitorBasicLexer(secondInput));
		tokenStream.fill();
		assertEquals(3, tokenStream.size());
		assertEquals(VisitorBasicLexer.A, tokenStream.get(0).getType());
		assertEquals(VisitorBasicLexer.A, tokenStream.get(1).getType());
		assertEquals(Token.EOF, tokenStream.get(2).getType());
	}
}
