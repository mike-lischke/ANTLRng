/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */



import { java, JavaObject } from "jree";
import { ANTLRInputStream, CommonTokenStream, LexerInterpreter, TokenStreamRewriter, Interval } from "antlr4ng";

type String = java.lang.String;
const String = java.lang.String;
type Exception = java.lang.Exception;
const Exception = java.lang.Exception;
type IllegalArgumentException = java.lang.IllegalArgumentException;
const IllegalArgumentException = java.lang.IllegalArgumentException;

import { Test, Override } from "../../../decorators.js";


export class TestTokenStreamRewriter extends JavaObject {

    /** Public default constructor used by TestRig */
    public constructor() {
        super();
    }

    @Test
    public testInsertBeforeIndex0(): void {
        let g = new LexerGrammar(
            "lexer grammar T;\n" +
            "A : 'a';\n" +
            "B : 'b';\n" +
            "C : 'c';\n");
        let lexEngine = g.createLexerInterpreter(new ANTLRInputStream("abc"));
        let stream = new CommonTokenStream(lexEngine);
        stream.fill();
        let tokens = new TokenStreamRewriter(stream);
        tokens.insertBefore(0, "0");
        let result = tokens.getText();
        let expecting = "0abc";
        assertEquals(expecting, result);
    }

    @Test
    public testInsertAfterLastIndex(): void {
        let g = new LexerGrammar(
            "lexer grammar T;\n" +
            "A : 'a';\n" +
            "B : 'b';\n" +
            "C : 'c';\n");
        let input = "abc";
        let lexEngine = g.createLexerInterpreter(new ANTLRInputStream(input));
        let stream = new CommonTokenStream(lexEngine);
        stream.fill();
        let tokens = new TokenStreamRewriter(stream);
        tokens.insertAfter(2, "x");
        let result = tokens.getText();
        let expecting = "abcx";
        assertEquals(expecting, result);
    }

    @Test
    public test2InsertBeforeAfterMiddleIndex(): void {
        let g = new LexerGrammar(
            "lexer grammar T;\n" +
            "A : 'a';\n" +
            "B : 'b';\n" +
            "C : 'c';\n");
        let input = "abc";
        let lexEngine = g.createLexerInterpreter(new ANTLRInputStream(input));
        let stream = new CommonTokenStream(lexEngine);
        stream.fill();
        let tokens = new TokenStreamRewriter(stream);
        tokens.insertBefore(1, "x");
        tokens.insertAfter(1, "x");
        let result = tokens.getText();
        let expecting = "axbxc";
        assertEquals(expecting, result);
    }

    @Test
    public testReplaceIndex0(): void {
        let g = new LexerGrammar(
            "lexer grammar T;\n" +
            "A : 'a';\n" +
            "B : 'b';\n" +
            "C : 'c';\n");
        let input = "abc";
        let lexEngine = g.createLexerInterpreter(new ANTLRInputStream(input));
        let stream = new CommonTokenStream(lexEngine);
        stream.fill();
        let tokens = new TokenStreamRewriter(stream);
        tokens.replace(0, "x");
        let result = tokens.getText();
        let expecting = "xbc";
        assertEquals(expecting, result);
    }

    @Test
    public testReplaceLastIndex(): void {
        let g = new LexerGrammar(
            "lexer grammar T;\n" +
            "A : 'a';\n" +
            "B : 'b';\n" +
            "C : 'c';\n");
        let input = "abc";
        let lexEngine = g.createLexerInterpreter(new ANTLRInputStream(input));
        let stream = new CommonTokenStream(lexEngine);
        stream.fill();
        let tokens = new TokenStreamRewriter(stream);
        tokens.replace(2, "x");
        let result = tokens.getText();
        let expecting = "abx";
        assertEquals(expecting, result);
    }

    @Test
    public testReplaceMiddleIndex(): void {
        let g = new LexerGrammar(
            "lexer grammar T;\n" +
            "A : 'a';\n" +
            "B : 'b';\n" +
            "C : 'c';\n");
        let input = "abc";
        let lexEngine = g.createLexerInterpreter(new ANTLRInputStream(input));
        let stream = new CommonTokenStream(lexEngine);
        stream.fill();
        let tokens = new TokenStreamRewriter(stream);
        tokens.replace(1, "x");
        let result = tokens.getText();
        let expecting = "axc";
        assertEquals(expecting, result);
    }

    @Test
    public testToStringStartStop(): void {
        let g = new LexerGrammar(
            "lexer grammar T;\n" +
            "ID : 'a'..'z'+;\n" +
            "INT : '0'..'9'+;\n" +
            "SEMI : ';';\n" +
            "MUL : '*';\n" +
            "ASSIGN : '=';\n" +
            "WS : ' '+;\n");
        // Tokens: 0123456789
        // Input:  x = 3 * 0;
        let input = "x = 3 * 0;";
        let lexEngine = g.createLexerInterpreter(new ANTLRInputStream(input));
        let stream = new CommonTokenStream(lexEngine);
        stream.fill();
        let tokens = new TokenStreamRewriter(stream);
        tokens.replace(4, 8, "0");
        stream.fill();
        // replace 3 * 0 with 0

        let result = tokens.getTokenStream().getText();
        let expecting = "x = 3 * 0;";
        assertEquals(expecting, result);

        result = tokens.getText();
        expecting = "x = 0;";
        assertEquals(expecting, result);

        result = tokens.getText(Interval.of(0, 9));
        expecting = "x = 0;";
        assertEquals(expecting, result);

        result = tokens.getText(Interval.of(4, 8));
        expecting = "0";
        assertEquals(expecting, result);
    }

    @Test
    public testToStringStartStop2(): void {
        let g = new LexerGrammar(
            "lexer grammar T;\n" +
            "ID : 'a'..'z'+;\n" +
            "INT : '0'..'9'+;\n" +
            "SEMI : ';';\n" +
            "ASSIGN : '=';\n" +
            "PLUS : '+';\n" +
            "MULT : '*';\n" +
            "WS : ' '+;\n");
        // Tokens: 012345678901234567
        // Input:  x = 3 * 0 + 2 * 0;
        let input = "x = 3 * 0 + 2 * 0;";
        let lexEngine = g.createLexerInterpreter(new ANTLRInputStream(input));
        let stream = new CommonTokenStream(lexEngine);
        stream.fill();
        let tokens = new TokenStreamRewriter(stream);

        let result = tokens.getTokenStream().getText();
        let expecting = "x = 3 * 0 + 2 * 0;";
        assertEquals(expecting, result);

        tokens.replace(4, 8, "0");
        stream.fill();
        // replace 3 * 0 with 0
        result = tokens.getText();
        expecting = "x = 0 + 2 * 0;";
        assertEquals(expecting, result);

        result = tokens.getText(Interval.of(0, 17));
        expecting = "x = 0 + 2 * 0;";
        assertEquals(expecting, result);

        result = tokens.getText(Interval.of(4, 8));
        expecting = "0";
        assertEquals(expecting, result);

        result = tokens.getText(Interval.of(0, 8));
        expecting = "x = 0";
        assertEquals(expecting, result);

        result = tokens.getText(Interval.of(12, 16));
        expecting = "2 * 0";
        assertEquals(expecting, result);

        tokens.insertAfter(17, "// comment");
        result = tokens.getText(Interval.of(12, 18));
        expecting = "2 * 0;// comment";
        assertEquals(expecting, result);

        result = tokens.getText(Interval.of(0, 8));
        stream.fill();
        // try again after insert at end
        expecting = "x = 0";
        assertEquals(expecting, result);
    }


    @Test
    public test2ReplaceMiddleIndex(): void {
        let g = new LexerGrammar(
            "lexer grammar T;\n" +
            "A : 'a';\n" +
            "B : 'b';\n" +
            "C : 'c';\n");
        let input = "abc";
        let lexEngine = g.createLexerInterpreter(new ANTLRInputStream(input));
        let stream = new CommonTokenStream(lexEngine);
        stream.fill();
        let tokens = new TokenStreamRewriter(stream);
        tokens.replace(1, "x");
        tokens.replace(1, "y");
        let result = tokens.getText();
        let expecting = "ayc";
        assertEquals(expecting, result);
    }

    @Test
    public test2ReplaceMiddleIndex1InsertBefore(): void {
        let g = new LexerGrammar(
            "lexer grammar T;\n" +
            "A : 'a';\n" +
            "B : 'b';\n" +
            "C : 'c';\n");
        let input = "abc";
        let lexEngine = g.createLexerInterpreter(new ANTLRInputStream(input));
        let stream = new CommonTokenStream(lexEngine);
        stream.fill();
        let tokens = new TokenStreamRewriter(stream);
        tokens.insertBefore(0, "_");
        tokens.replace(1, "x");
        tokens.replace(1, "y");
        let result = tokens.getText();
        let expecting = "_ayc";
        assertEquals(expecting, result);
    }

    @Test
    public testReplaceThenDeleteMiddleIndex(): void {
        let g = new LexerGrammar(
            "lexer grammar T;\n" +
            "A : 'a';\n" +
            "B : 'b';\n" +
            "C : 'c';\n");
        let input = "abc";
        let lexEngine = g.createLexerInterpreter(new ANTLRInputStream(input));
        let stream = new CommonTokenStream(lexEngine);
        stream.fill();
        let tokens = new TokenStreamRewriter(stream);
        tokens.replace(1, "x");
        tokens.delete(1);
        let result = tokens.getText();
        let expecting = "ac";
        assertEquals(expecting, result);
    }

    @Test
    public testInsertInPriorReplace(): void {
        let g = new LexerGrammar(
            "lexer grammar T;\n" +
            "A : 'a';\n" +
            "B : 'b';\n" +
            "C : 'c';\n");
        let input = "abc";
        let lexEngine = g.createLexerInterpreter(new ANTLRInputStream(input));
        let stream = new CommonTokenStream(lexEngine);
        stream.fill();
        let tokens = new TokenStreamRewriter(stream);
        tokens.replace(0, 2, "x");
        tokens.insertBefore(1, "0");
        let exc = null;
        try {
            tokens.getText();
        } catch (iae) {
            if (iae instanceof IllegalArgumentException) {
                exc = iae;
            } else {
                throw iae;
            }
        }
        let expecting = "insert op <InsertBeforeOp@[@1,1:1='b',<2>,1:1]:\"0\"> within boundaries of previous <ReplaceOp@[@0,0:0='a',<1>,1:0]..[@2,2:2='c',<3>,1:2]:\"x\">";
        assertNotNull(exc);
        assertEquals(expecting, exc.getMessage());
    }

    @Test
    public testInsertThenReplaceSameIndex(): void {
        let g = new LexerGrammar(
            "lexer grammar T;\n" +
            "A : 'a';\n" +
            "B : 'b';\n" +
            "C : 'c';\n");
        let input = "abc";
        let lexEngine = g.createLexerInterpreter(new ANTLRInputStream(input));
        let stream = new CommonTokenStream(lexEngine);
        stream.fill();
        let tokens = new TokenStreamRewriter(stream);
        tokens.insertBefore(0, "0");
        tokens.replace(0, "x");
        stream.fill();
        // supercedes insert at 0
        let result = tokens.getText();
        let expecting = "0xbc";
        assertEquals(expecting, result);
    }

    @Test
    public test2InsertMiddleIndex(): void {
        let g = new LexerGrammar(
            "lexer grammar T;\n" +
            "A : 'a';\n" +
            "B : 'b';\n" +
            "C : 'c';\n");
        let input = "abc";
        let lexEngine = g.createLexerInterpreter(new ANTLRInputStream(input));
        let stream = new CommonTokenStream(lexEngine);
        stream.fill();
        let tokens = new TokenStreamRewriter(stream);
        tokens.insertBefore(1, "x");
        tokens.insertBefore(1, "y");
        let result = tokens.getText();
        let expecting = "ayxbc";
        assertEquals(expecting, result);
    }

    @Test
    public test2InsertThenReplaceIndex0(): void {
        let g = new LexerGrammar(
            "lexer grammar T;\n" +
            "A : 'a';\n" +
            "B : 'b';\n" +
            "C : 'c';\n");
        let input = "abc";
        let lexEngine = g.createLexerInterpreter(new ANTLRInputStream(input));
        let stream = new CommonTokenStream(lexEngine);
        stream.fill();
        let tokens = new TokenStreamRewriter(stream);
        tokens.insertBefore(0, "x");
        tokens.insertBefore(0, "y");
        tokens.replace(0, "z");
        let result = tokens.getText();
        let expecting = "yxzbc";
        assertEquals(expecting, result);
    }

    @Test
    public testReplaceThenInsertBeforeLastIndex(): void {
        let g = new LexerGrammar(
            "lexer grammar T;\n" +
            "A : 'a';\n" +
            "B : 'b';\n" +
            "C : 'c';\n");
        let input = "abc";
        let lexEngine = g.createLexerInterpreter(new ANTLRInputStream(input));
        let stream = new CommonTokenStream(lexEngine);
        stream.fill();
        let tokens = new TokenStreamRewriter(stream);
        tokens.replace(2, "x");
        tokens.insertBefore(2, "y");
        let result = tokens.getText();
        let expecting = "abyx";
        assertEquals(expecting, result);
    }

    @Test
    public testInsertThenReplaceLastIndex(): void {
        let g = new LexerGrammar(
            "lexer grammar T;\n" +
            "A : 'a';\n" +
            "B : 'b';\n" +
            "C : 'c';\n");
        let input = "abc";
        let lexEngine = g.createLexerInterpreter(new ANTLRInputStream(input));
        let stream = new CommonTokenStream(lexEngine);
        stream.fill();
        let tokens = new TokenStreamRewriter(stream);
        tokens.insertBefore(2, "y");
        tokens.replace(2, "x");
        let result = tokens.getText();
        let expecting = "abyx";
        assertEquals(expecting, result);
    }

    @Test
    public testReplaceThenInsertAfterLastIndex(): void {
        let g = new LexerGrammar(
            "lexer grammar T;\n" +
            "A : 'a';\n" +
            "B : 'b';\n" +
            "C : 'c';\n");
        let input = "abc";
        let lexEngine = g.createLexerInterpreter(new ANTLRInputStream(input));
        let stream = new CommonTokenStream(lexEngine);
        stream.fill();
        let tokens = new TokenStreamRewriter(stream);
        tokens.replace(2, "x");
        tokens.insertAfter(2, "y");
        let result = tokens.getText();
        let expecting = "abxy";
        assertEquals(expecting, result);
    }

    @Test
    public testReplaceRangeThenInsertAtLeftEdge(): void {
        let g = new LexerGrammar(
            "lexer grammar T;\n" +
            "A : 'a';\n" +
            "B : 'b';\n" +
            "C : 'c';\n");
        let input = "abcccba";
        let lexEngine = g.createLexerInterpreter(new ANTLRInputStream(input));
        let stream = new CommonTokenStream(lexEngine);
        stream.fill();
        let tokens = new TokenStreamRewriter(stream);
        tokens.replace(2, 4, "x");
        tokens.insertBefore(2, "y");
        let result = tokens.getText();
        let expecting = "abyxba";
        assertEquals(expecting, result);
    }

    @Test
    public testReplaceRangeThenInsertAtRightEdge(): void {
        let g = new LexerGrammar(
            "lexer grammar T;\n" +
            "A : 'a';\n" +
            "B : 'b';\n" +
            "C : 'c';\n");
        let input = "abcccba";
        let lexEngine = g.createLexerInterpreter(new ANTLRInputStream(input));
        let stream = new CommonTokenStream(lexEngine);
        stream.fill();
        let tokens = new TokenStreamRewriter(stream);
        tokens.replace(2, 4, "x");
        tokens.insertBefore(4, "y");
        stream.fill(); // no effect; within range of a replace
        let exc = null;
        try {
            tokens.getText();
        } catch (iae) {
            if (iae instanceof IllegalArgumentException) {
                exc = iae;
            } else {
                throw iae;
            }
        }
        let expecting = "insert op <InsertBeforeOp@[@4,4:4='c',<3>,1:4]:\"y\"> within boundaries of previous <ReplaceOp@[@2,2:2='c',<3>,1:2]..[@4,4:4='c',<3>,1:4]:\"x\">";
        assertNotNull(exc);
        assertEquals(expecting, exc.getMessage());
    }

    @Test
    public testReplaceRangeThenInsertAfterRightEdge(): void {
        let g = new LexerGrammar(
            "lexer grammar T;\n" +
            "A : 'a';\n" +
            "B : 'b';\n" +
            "C : 'c';\n");
        let input = "abcccba";
        let lexEngine = g.createLexerInterpreter(new ANTLRInputStream(input));
        let stream = new CommonTokenStream(lexEngine);
        stream.fill();
        let tokens = new TokenStreamRewriter(stream);
        tokens.replace(2, 4, "x");
        tokens.insertAfter(4, "y");
        let result = tokens.getText();
        let expecting = "abxyba";
        assertEquals(expecting, result);
    }

    @Test
    public testReplaceAll(): void {
        let g = new LexerGrammar(
            "lexer grammar T;\n" +
            "A : 'a';\n" +
            "B : 'b';\n" +
            "C : 'c';\n");
        let input = "abcccba";
        let lexEngine = g.createLexerInterpreter(new ANTLRInputStream(input));
        let stream = new CommonTokenStream(lexEngine);
        stream.fill();
        let tokens = new TokenStreamRewriter(stream);
        tokens.replace(0, 6, "x");
        let result = tokens.getText();
        let expecting = "x";
        assertEquals(expecting, result);
    }

    @Test
    public testReplaceSubsetThenFetch(): void {
        let g = new LexerGrammar(
            "lexer grammar T;\n" +
            "A : 'a';\n" +
            "B : 'b';\n" +
            "C : 'c';\n");
        let input = "abcccba";
        let lexEngine = g.createLexerInterpreter(new ANTLRInputStream(input));
        let stream = new CommonTokenStream(lexEngine);
        stream.fill();
        let tokens = new TokenStreamRewriter(stream);
        tokens.replace(2, 4, "xyz");
        let result = tokens.getText(Interval.of(0, 6));
        let expecting = "abxyzba";
        assertEquals(expecting, result);
    }

    @Test
    public testReplaceThenReplaceSuperset(): void {
        let g = new LexerGrammar(
            "lexer grammar T;\n" +
            "A : 'a';\n" +
            "B : 'b';\n" +
            "C : 'c';\n");
        let input = "abcccba";
        let lexEngine = g.createLexerInterpreter(new ANTLRInputStream(input));
        let stream = new CommonTokenStream(lexEngine);
        stream.fill();
        let tokens = new TokenStreamRewriter(stream);
        tokens.replace(2, 4, "xyz");
        tokens.replace(3, 5, "foo");
        stream.fill();
        // overlaps, error
        let exc = null;
        try {
            tokens.getText();
        } catch (iae) {
            if (iae instanceof IllegalArgumentException) {
                exc = iae;
            } else {
                throw iae;
            }
        }
        let expecting = "replace op boundaries of <ReplaceOp@[@3,3:3='c',<3>,1:3]..[@5,5:5='b',<2>,1:5]:\"foo\"> overlap with previous <ReplaceOp@[@2,2:2='c',<3>,1:2]..[@4,4:4='c',<3>,1:4]:\"xyz\">";
        assertNotNull(exc);
        assertEquals(expecting, exc.getMessage());
    }

    @Test
    public testReplaceThenReplaceLowerIndexedSuperset(): void {
        let g = new LexerGrammar(
            "lexer grammar T;\n" +
            "A : 'a';\n" +
            "B : 'b';\n" +
            "C : 'c';\n");
        let input = "abcccba";
        let lexEngine = g.createLexerInterpreter(new ANTLRInputStream(input));
        let stream = new CommonTokenStream(lexEngine);
        stream.fill();
        let tokens = new TokenStreamRewriter(stream);
        tokens.replace(2, 4, "xyz");
        tokens.replace(1, 3, "foo");
        stream.fill();
        // overlap, error
        let exc = null;
        try {
            tokens.getText();
        } catch (iae) {
            if (iae instanceof IllegalArgumentException) {
                exc = iae;
            } else {
                throw iae;
            }
        }
        let expecting = "replace op boundaries of <ReplaceOp@[@1,1:1='b',<2>,1:1]..[@3,3:3='c',<3>,1:3]:\"foo\"> overlap with previous <ReplaceOp@[@2,2:2='c',<3>,1:2]..[@4,4:4='c',<3>,1:4]:\"xyz\">";
        assertNotNull(exc);
        assertEquals(expecting, exc.getMessage());
    }

    @Test
    public testReplaceSingleMiddleThenOverlappingSuperset(): void {
        let g = new LexerGrammar(
            "lexer grammar T;\n" +
            "A : 'a';\n" +
            "B : 'b';\n" +
            "C : 'c';\n");
        let input = "abcba";
        let lexEngine = g.createLexerInterpreter(new ANTLRInputStream(input));
        let stream = new CommonTokenStream(lexEngine);
        stream.fill();
        let tokens = new TokenStreamRewriter(stream);
        tokens.replace(2, 2, "xyz");
        tokens.replace(0, 3, "foo");
        let result = tokens.getText();
        let expecting = "fooa";
        assertEquals(expecting, result);
    }

    @Test
    public testCombineInserts(): void {
        let g = new LexerGrammar(
            "lexer grammar T;\n" +
            "A : 'a';\n" +
            "B : 'b';\n" +
            "C : 'c';\n");
        let input = "abc";
        let lexEngine = g.createLexerInterpreter(new ANTLRInputStream(input));
        let stream = new CommonTokenStream(lexEngine);
        stream.fill();
        let tokens = new TokenStreamRewriter(stream);
        tokens.insertBefore(0, "x");
        tokens.insertBefore(0, "y");
        let result = tokens.getText();
        let expecting = "yxabc";
        assertEquals(expecting, result);
    }

    @Test
    public testCombine3Inserts(): void {
        let g = new LexerGrammar(
            "lexer grammar T;\n" +
            "A : 'a';\n" +
            "B : 'b';\n" +
            "C : 'c';\n");
        let input = "abc";
        let lexEngine = g.createLexerInterpreter(new ANTLRInputStream(input));
        let stream = new CommonTokenStream(lexEngine);
        stream.fill();
        let tokens = new TokenStreamRewriter(stream);
        tokens.insertBefore(1, "x");
        tokens.insertBefore(0, "y");
        tokens.insertBefore(1, "z");
        let result = tokens.getText();
        let expecting = "yazxbc";
        assertEquals(expecting, result);
    }

    @Test
    public testCombineInsertOnLeftWithReplace(): void {
        let g = new LexerGrammar(
            "lexer grammar T;\n" +
            "A : 'a';\n" +
            "B : 'b';\n" +
            "C : 'c';\n");
        let input = "abc";
        let lexEngine = g.createLexerInterpreter(new ANTLRInputStream(input));
        let stream = new CommonTokenStream(lexEngine);
        stream.fill();
        let tokens = new TokenStreamRewriter(stream);
        tokens.replace(0, 2, "foo");
        tokens.insertBefore(0, "z");
        stream.fill();
        // combine with left edge of rewrite
        let result = tokens.getText();
        let expecting = "zfoo";
        assertEquals(expecting, result);
    }

    @Test
    public testCombineInsertOnLeftWithDelete(): void {
        let g = new LexerGrammar(
            "lexer grammar T;\n" +
            "A : 'a';\n" +
            "B : 'b';\n" +
            "C : 'c';\n");
        let input = "abc";
        let lexEngine = g.createLexerInterpreter(new ANTLRInputStream(input));
        let stream = new CommonTokenStream(lexEngine);
        stream.fill();
        let tokens = new TokenStreamRewriter(stream);
        tokens.delete(0, 2);
        tokens.insertBefore(0, "z");
        stream.fill();
        // combine with left edge of rewrite
        let result = tokens.getText();
        let expecting = "z";
        stream.fill();
        // make sure combo is not znull
        assertEquals(expecting, result);
    }

    @Test
    public testDisjointInserts(): void {
        let g = new LexerGrammar(
            "lexer grammar T;\n" +
            "A : 'a';\n" +
            "B : 'b';\n" +
            "C : 'c';\n");
        let input = "abc";
        let lexEngine = g.createLexerInterpreter(new ANTLRInputStream(input));
        let stream = new CommonTokenStream(lexEngine);
        stream.fill();
        let tokens = new TokenStreamRewriter(stream);
        tokens.insertBefore(1, "x");
        tokens.insertBefore(2, "y");
        tokens.insertBefore(0, "z");
        let result = tokens.getText();
        let expecting = "zaxbyc";
        assertEquals(expecting, result);
    }

    @Test
    public testOverlappingReplace(): void {
        let g = new LexerGrammar(
            "lexer grammar T;\n" +
            "A : 'a';\n" +
            "B : 'b';\n" +
            "C : 'c';\n");
        let input = "abcc";
        let lexEngine = g.createLexerInterpreter(new ANTLRInputStream(input));
        let stream = new CommonTokenStream(lexEngine);
        stream.fill();
        let tokens = new TokenStreamRewriter(stream);
        tokens.replace(1, 2, "foo");
        tokens.replace(0, 3, "bar");
        stream.fill();
        // wipes prior nested replace
        let result = tokens.getText();
        let expecting = "bar";
        assertEquals(expecting, result);
    }

    @Test
    public testOverlappingReplace2(): void {
        let g = new LexerGrammar(
            "lexer grammar T;\n" +
            "A : 'a';\n" +
            "B : 'b';\n" +
            "C : 'c';\n");
        let input = "abcc";
        let lexEngine = g.createLexerInterpreter(new ANTLRInputStream(input));
        let stream = new CommonTokenStream(lexEngine);
        stream.fill();
        let tokens = new TokenStreamRewriter(stream);
        tokens.replace(0, 3, "bar");
        tokens.replace(1, 2, "foo");
        stream.fill();
        // cannot split earlier replace
        let exc = null;
        try {
            tokens.getText();
        } catch (iae) {
            if (iae instanceof IllegalArgumentException) {
                exc = iae;
            } else {
                throw iae;
            }
        }
        let expecting = "replace op boundaries of <ReplaceOp@[@1,1:1='b',<2>,1:1]..[@2,2:2='c',<3>,1:2]:\"foo\"> overlap with previous <ReplaceOp@[@0,0:0='a',<1>,1:0]..[@3,3:3='c',<3>,1:3]:\"bar\">";
        assertNotNull(exc);
        assertEquals(expecting, exc.getMessage());
    }

    @Test
    public testOverlappingReplace3(): void {
        let g = new LexerGrammar(
            "lexer grammar T;\n" +
            "A : 'a';\n" +
            "B : 'b';\n" +
            "C : 'c';\n");
        let input = "abcc";
        let lexEngine = g.createLexerInterpreter(new ANTLRInputStream(input));
        let stream = new CommonTokenStream(lexEngine);
        stream.fill();
        let tokens = new TokenStreamRewriter(stream);
        tokens.replace(1, 2, "foo");
        tokens.replace(0, 2, "bar");
        stream.fill();
        // wipes prior nested replace
        let result = tokens.getText();
        let expecting = "barc";
        assertEquals(expecting, result);
    }

    @Test
    public testOverlappingReplace4(): void {
        let g = new LexerGrammar(
            "lexer grammar T;\n" +
            "A : 'a';\n" +
            "B : 'b';\n" +
            "C : 'c';\n");
        let input = "abcc";
        let lexEngine = g.createLexerInterpreter(new ANTLRInputStream(input));
        let stream = new CommonTokenStream(lexEngine);
        stream.fill();
        let tokens = new TokenStreamRewriter(stream);
        tokens.replace(1, 2, "foo");
        tokens.replace(1, 3, "bar");
        stream.fill();
        // wipes prior nested replace
        let result = tokens.getText();
        let expecting = "abar";
        assertEquals(expecting, result);
    }

    @Test
    public testDropIdenticalReplace(): void {
        let g = new LexerGrammar(
            "lexer grammar T;\n" +
            "A : 'a';\n" +
            "B : 'b';\n" +
            "C : 'c';\n");
        let input = "abcc";
        let lexEngine = g.createLexerInterpreter(new ANTLRInputStream(input));
        let stream = new CommonTokenStream(lexEngine);
        stream.fill();
        let tokens = new TokenStreamRewriter(stream);
        tokens.replace(1, 2, "foo");
        tokens.replace(1, 2, "foo");
        stream.fill();
        // drop previous, identical
        let result = tokens.getText();
        let expecting = "afooc";
        assertEquals(expecting, result);
    }

    @Test
    public testDropPrevCoveredInsert(): void {
        let g = new LexerGrammar(
            "lexer grammar T;\n" +
            "A : 'a';\n" +
            "B : 'b';\n" +
            "C : 'c';\n");
        let input = "abc";
        let lexEngine = g.createLexerInterpreter(new ANTLRInputStream(input));
        let stream = new CommonTokenStream(lexEngine);
        stream.fill();
        let tokens = new TokenStreamRewriter(stream);
        tokens.insertBefore(1, "foo");
        tokens.replace(1, 2, "foo");
        stream.fill();
        // kill prev insert
        let result = tokens.getText();
        let expecting = "afoofoo";
        assertEquals(expecting, result);
    }

    @Test
    public testLeaveAloneDisjointInsert(): void {
        let g = new LexerGrammar(
            "lexer grammar T;\n" +
            "A : 'a';\n" +
            "B : 'b';\n" +
            "C : 'c';\n");
        let input = "abcc";
        let lexEngine = g.createLexerInterpreter(new ANTLRInputStream(input));
        let stream = new CommonTokenStream(lexEngine);
        stream.fill();
        let tokens = new TokenStreamRewriter(stream);
        tokens.insertBefore(1, "x");
        tokens.replace(2, 3, "foo");
        let result = tokens.getText();
        let expecting = "axbfoo";
        assertEquals(expecting, result);
    }

    @Test
    public testLeaveAloneDisjointInsert2(): void {
        let g = new LexerGrammar(
            "lexer grammar T;\n" +
            "A : 'a';\n" +
            "B : 'b';\n" +
            "C : 'c';\n");
        let input = "abcc";
        let lexEngine = g.createLexerInterpreter(new ANTLRInputStream(input));
        let stream = new CommonTokenStream(lexEngine);
        stream.fill();
        let tokens = new TokenStreamRewriter(stream);
        tokens.replace(2, 3, "foo");
        tokens.insertBefore(1, "x");
        let result = tokens.getText();
        let expecting = "axbfoo";
        assertEquals(expecting, result);
    }

    @Test
    public testInsertBeforeTokenThenDeleteThatToken(): void {
        let g = new LexerGrammar(
            "lexer grammar T;\n" +
            "A : 'a';\n" +
            "B : 'b';\n" +
            "C : 'c';\n");
        let input = "abc";
        let lexEngine = g.createLexerInterpreter(new ANTLRInputStream(input));
        let stream = new CommonTokenStream(lexEngine);
        stream.fill();
        let tokens = new TokenStreamRewriter(stream);
        tokens.insertBefore(2, "y");
        tokens.delete(2);
        let result = tokens.getText();
        let expecting = "aby";
        assertEquals(expecting, result);
    }

    // Test Fix for https://github.com/antlr/antlr4/issues/550
    @Test
    public testDistinguishBetweenInsertAfterAndInsertBeforeToPreserverOrder(): void {
        let g = new LexerGrammar(
            "lexer grammar T;\n" +
            "A : 'a';\n" +
            "B : 'b';\n" +
            "C : 'c';\n");
        let input = "aa";
        let lexEngine = g.createLexerInterpreter(new ANTLRInputStream(input));
        let stream = new CommonTokenStream(lexEngine);
        stream.fill();
        let tokens = new TokenStreamRewriter(stream);
        tokens.insertBefore(0, "<b>");
        tokens.insertAfter(0, "</b>");
        tokens.insertBefore(1, "<b>");
        tokens.insertAfter(1, "</b>");
        let result = tokens.getText();
        let expecting = "<b>a</b><b>a</b>"; // fails with <b>a<b></b>a</b>"
        assertEquals(expecting, result);
    }

    @Test
    public testDistinguishBetweenInsertAfterAndInsertBeforeToPreserverOrder2(): void {
        let g = new LexerGrammar(
            "lexer grammar T;\n" +
            "A : 'a';\n" +
            "B : 'b';\n" +
            "C : 'c';\n");
        let input = "aa";
        let lexEngine = g.createLexerInterpreter(new ANTLRInputStream(input));
        let stream = new CommonTokenStream(lexEngine);
        stream.fill();
        let tokens = new TokenStreamRewriter(stream);
        tokens.insertBefore(0, "<p>");
        tokens.insertBefore(0, "<b>");
        tokens.insertAfter(0, "</p>");
        tokens.insertAfter(0, "</b>");
        tokens.insertBefore(1, "<b>");
        tokens.insertAfter(1, "</b>");
        let result = tokens.getText();
        let expecting = "<b><p>a</p></b><b>a</b>";
        assertEquals(expecting, result);
    }

    // Test Fix for https://github.com/antlr/antlr4/issues/550
    @Test
    public testPreservesOrderOfContiguousInserts(): void {
        let g = new LexerGrammar(
            "lexer grammar T;\n" +
            "A : 'a';\n" +
            "B : 'b';\n" +
            "C : 'c';\n");
        let input = "ab";
        let lexEngine = g.createLexerInterpreter(new ANTLRInputStream(input));
        let stream = new CommonTokenStream(lexEngine);
        stream.fill();
        let tokens = new TokenStreamRewriter(stream);
        tokens.insertBefore(0, "<p>");
        tokens.insertBefore(0, "<b>");
        tokens.insertBefore(0, "<div>");
        tokens.insertAfter(0, "</p>");
        tokens.insertAfter(0, "</b>");
        tokens.insertAfter(0, "</div>");
        tokens.insertBefore(1, "!");
        let result = tokens.getText();
        let expecting = "<div><b><p>a</p></b></div>!b";
        assertEquals(expecting, result);
    }

}
