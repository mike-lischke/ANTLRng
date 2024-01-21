/* java2ts: keep */

/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { BufferedTokenStream, CharStreams, Token, type TokenStream } from "antlr4ng";

import { Test } from "../../../utils/decorators.js";
import { VisitorBasicLexer } from "../../../generated/VisitorBasicLexer.js";
import { assertEquals } from "../../../utils/junit.js";

/**
 * This class contains tests for specific API functionality in {@link TokenStream} and derived types.
 */
export class TestTokenStream {

    /**
     * This is a targeted regression test for antlr/antlr4#1584 ({@link BufferedTokenStream}
     * cannot be reused after EOF).
     */
    @Test
    public testBufferedTokenStreamReuseAfterFill(): void {
        const firstInput = CharStreams.fromString("A");
        const tokenStream = new BufferedTokenStream(new VisitorBasicLexer(firstInput));
        tokenStream.fill();
        assertEquals(2, tokenStream.size);
        assertEquals(VisitorBasicLexer.A, tokenStream.get(0).type);
        assertEquals(Token.EOF, tokenStream.get(1).type);

        const secondInput = CharStreams.fromString("AA");
        tokenStream.setTokenSource(new VisitorBasicLexer(secondInput));
        tokenStream.fill();
        assertEquals(3, tokenStream.size);
        assertEquals(VisitorBasicLexer.A, tokenStream.get(0).type);
        assertEquals(VisitorBasicLexer.A, tokenStream.get(1).type);
        assertEquals(Token.EOF, tokenStream.get(2).type);
    }
}
