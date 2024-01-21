/* java2ts: keep */

/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

// cspell: disable

import { CommonTokenStream, TokenStreamRewriter, Interval, CharStreams, Lexer, CharStream } from "antlr4ng";

import { Test } from "../../../utils/decorators.js";
import { assertEquals, assertNotNull } from "../../../utils/junit.js";

import { T1 } from "../../../generated/T1.js";
import { T2 } from "../../../generated/T2.js";
import { T3 } from "../../../generated/T3.js";

/**
 * @param lexerClass The lexer class to use.
 * @param input The input to lex.
 *
 * @returns A new TokenStreamRewriter instance.
 */
const createRewriter = <T extends Lexer>(lexerClass: new (input: CharStream) => T, input: string) => {
    const chars = CharStreams.fromString(input);

    const lexer: T = new lexerClass(chars);
    const tokens = new CommonTokenStream(lexer);
    tokens.fill();

    return new TokenStreamRewriter(tokens);
};

export class TestTokenStreamRewriter {

    @Test
    public testInsertBeforeIndex0(): void {
        const tokens = createRewriter(T1, "abc");
        tokens.insertBefore(0, "0");
        const result = tokens.getText();
        const expecting = "0abc";
        assertEquals(expecting, result);
    }

    @Test
    public testInsertAfterLastIndex(): void {
        const tokens = createRewriter(T1, "abc");
        tokens.insertAfter(2, "x");
        const result = tokens.getText();
        const expecting = "abcx";
        assertEquals(expecting, result);
    }

    @Test
    public test2InsertBeforeAfterMiddleIndex(): void {
        const tokens = createRewriter(T1, "abc");
        tokens.insertBefore(1, "x");
        tokens.insertAfter(1, "x");
        const result = tokens.getText();
        const expecting = "axbxc";
        assertEquals(expecting, result);
    }

    @Test
    public testReplaceIndex0(): void {
        const tokens = createRewriter(T1, "abc");
        tokens.replaceSingle(0, "x");
        const result = tokens.getText();
        const expecting = "xbc";
        assertEquals(expecting, result);
    }

    @Test
    public testReplaceLastIndex(): void {
        const tokens = createRewriter(T1, "abc");
        tokens.replaceSingle(2, "x");
        const result = tokens.getText();
        const expecting = "abx";
        assertEquals(expecting, result);
    }

    @Test
    public testReplaceMiddleIndex(): void {
        const tokens = createRewriter(T1, "abc");
        tokens.replaceSingle(1, "x");
        const result = tokens.getText();
        const expecting = "axc";
        assertEquals(expecting, result);
    }

    @Test
    public testToStringStartStop(): void {
        const tokens = createRewriter(T2, "x = 3 * 0;");
        tokens.replace(4, 8, "0");

        const stream = tokens.getTokenStream() as CommonTokenStream;
        stream.fill();

        // replace 3 * 0 with 0
        let result = stream.getText();
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
        const tokens = createRewriter(T3, "x = 3 * 0 + 2 * 0;");

        let result = tokens.getTokenStream().getText();
        let expecting = "x = 3 * 0 + 2 * 0;";
        assertEquals(expecting, result);

        tokens.replace(4, 8, "0");

        const stream = tokens.getTokenStream() as CommonTokenStream;
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
        const tokens = createRewriter(T1, "abc");

        tokens.replaceSingle(1, "x");
        tokens.replaceSingle(1, "y");
        const result = tokens.getText();
        const expecting = "ayc";
        assertEquals(expecting, result);
    }

    @Test
    public test2ReplaceMiddleIndex1InsertBefore(): void {
        const tokens = createRewriter(T1, "abc");
        tokens.insertBefore(0, "_");
        tokens.replaceSingle(1, "x");
        tokens.replaceSingle(1, "y");
        const result = tokens.getText();
        const expecting = "_ayc";
        assertEquals(expecting, result);
    }

    @Test
    public testReplaceThenDeleteMiddleIndex(): void {
        const tokens = createRewriter(T1, "abc");
        tokens.replaceSingle(1, "x");
        tokens.delete(1);
        const result = tokens.getText();
        const expecting = "ac";
        assertEquals(expecting, result);
    }

    @Test
    public testInsertInPriorReplace(): void {
        const tokens = createRewriter(T1, "abc");
        tokens.replace(0, 2, "x");
        tokens.insertBefore(1, "0");
        let exc = null;
        try {
            tokens.getText();
        } catch (iae) {
            if (iae instanceof Error) {
                exc = iae;
            } else {
                throw iae;
            }
        }
        const expecting = "insert op <InsertBeforeOp@[@1,1:1='b',<2>,1:1]:\"0\"> within boundaries of previous " +
            "<ReplaceOp@[@0,0:0='a',<1>,1:0]..[@2,2:2='c',<3>,1:2]:\"x\">";
        assertNotNull(exc);
        assertEquals(expecting, exc?.message);
    }

    @Test
    public testInsertThenReplaceSameIndex(): void {
        const tokens = createRewriter(T1, "abc");
        const stream = tokens.getTokenStream() as CommonTokenStream;

        tokens.insertBefore(0, "0");
        tokens.replaceSingle(0, "x");
        stream.fill();

        // supercedes insert at 0
        const result = tokens.getText();
        const expecting = "0xbc";
        assertEquals(expecting, result);
    }

    @Test
    public test2InsertMiddleIndex(): void {
        const tokens = createRewriter(T1, "abc");
        tokens.insertBefore(1, "x");
        tokens.insertBefore(1, "y");
        const result = tokens.getText();
        const expecting = "ayxbc";
        assertEquals(expecting, result);
    }

    @Test
    public test2InsertThenReplaceIndex0(): void {
        const tokens = createRewriter(T1, "abc");
        tokens.insertBefore(0, "x");
        tokens.insertBefore(0, "y");
        tokens.replaceSingle(0, "z");
        const result = tokens.getText();
        const expecting = "yxzbc";
        assertEquals(expecting, result);
    }

    @Test
    public testReplaceThenInsertBeforeLastIndex(): void {
        const tokens = createRewriter(T1, "abc");
        tokens.replaceSingle(2, "x");
        tokens.insertBefore(2, "y");
        const result = tokens.getText();
        const expecting = "abyx";
        assertEquals(expecting, result);
    }

    @Test
    public testInsertThenReplaceLastIndex(): void {
        const tokens = createRewriter(T1, "abc");
        tokens.insertBefore(2, "y");
        tokens.replaceSingle(2, "x");
        const result = tokens.getText();
        const expecting = "abyx";
        assertEquals(expecting, result);
    }

    @Test
    public testReplaceThenInsertAfterLastIndex(): void {
        const tokens = createRewriter(T1, "abc");
        tokens.replaceSingle(2, "x");
        tokens.insertAfter(2, "y");
        const result = tokens.getText();
        const expecting = "abxy";
        assertEquals(expecting, result);
    }

    @Test
    public testReplaceRangeThenInsertAtLeftEdge(): void {
        const tokens = createRewriter(T1, "abcccba");
        tokens.replace(2, 4, "x");
        tokens.insertBefore(2, "y");
        const result = tokens.getText();
        const expecting = "abyxba";
        assertEquals(expecting, result);
    }

    @Test
    public testReplaceRangeThenInsertAtRightEdge(): void {
        const tokens = createRewriter(T1, "abcccba");
        const stream = tokens.getTokenStream() as CommonTokenStream;

        tokens.replace(2, 4, "x");
        tokens.insertBefore(4, "y");
        stream.fill(); // no effect; within range of a replace
        let exc = null;
        try {
            tokens.getText();
        } catch (iae) {
            if (iae instanceof Error) {
                exc = iae;
            } else {
                throw iae;
            }
        }
        const expecting = "insert op <InsertBeforeOp@[@4,4:4='c',<3>,1:4]:\"y\"> within boundaries of previous " +
            "<ReplaceOp@[@2,2:2='c',<3>,1:2]..[@4,4:4='c',<3>,1:4]:\"x\">";
        assertNotNull(exc);
        assertEquals(expecting, exc?.message);
    }

    @Test
    public testReplaceRangeThenInsertAfterRightEdge(): void {
        const tokens = createRewriter(T1, "abcccba");
        tokens.replace(2, 4, "x");
        tokens.insertAfter(4, "y");
        const result = tokens.getText();
        const expecting = "abxyba";
        assertEquals(expecting, result);
    }

    @Test
    public testReplaceAll(): void {
        const tokens = createRewriter(T1, "abcccba");
        tokens.replace(0, 6, "x");
        const result = tokens.getText();
        const expecting = "x";
        assertEquals(expecting, result);
    }

    @Test
    public testReplaceSubsetThenFetch(): void {
        const tokens = createRewriter(T1, "abcccba");
        tokens.replace(2, 4, "xyz");
        const result = tokens.getText(Interval.of(0, 6));
        const expecting = "abxyzba";
        assertEquals(expecting, result);
    }

    @Test
    public testReplaceThenReplaceSuperset(): void {
        const tokens = createRewriter(T1, "abcccba");
        const stream = tokens.getTokenStream() as CommonTokenStream;
        tokens.replace(2, 4, "xyz");
        tokens.replace(3, 5, "foo");
        stream.fill();

        // overlaps, error
        let exc = null;
        try {
            tokens.getText();
        } catch (iae) {
            if (iae instanceof Error) {
                exc = iae;
            } else {
                throw iae;
            }
        }
        const expecting = "replace op boundaries of <ReplaceOp@[@3,3:3='c',<3>,1:3]..[@5,5:5='b',<2>,1:5]:\"foo\"> " +
            "overlap with previous <ReplaceOp@[@2,2:2='c',<3>,1:2]..[@4,4:4='c',<3>,1:4]:\"xyz\">";
        assertNotNull(exc);
        assertEquals(expecting, exc?.message);
    }

    @Test
    public testReplaceThenReplaceLowerIndexedSuperset(): void {
        const tokens = createRewriter(T1, "abcccba");
        const stream = tokens.getTokenStream() as CommonTokenStream;
        tokens.replace(2, 4, "xyz");
        tokens.replace(1, 3, "foo");
        stream.fill();

        // overlap, error
        let exc = null;
        try {
            tokens.getText();
        } catch (iae) {
            if (iae instanceof Error) {
                exc = iae;
            } else {
                throw iae;
            }
        }
        const expecting = "replace op boundaries of <ReplaceOp@[@1,1:1='b',<2>,1:1]..[@3,3:3='c',<3>,1:3]:\"foo\"> " +
            "overlap with previous <ReplaceOp@[@2,2:2='c',<3>,1:2]..[@4,4:4='c',<3>,1:4]:\"xyz\">";
        assertNotNull(exc);
        assertEquals(expecting, exc?.message);
    }

    @Test
    public testReplaceSingleMiddleThenOverlappingSuperset(): void {
        const tokens = createRewriter(T1, "abcba");
        tokens.replace(2, 2, "xyz");
        tokens.replace(0, 3, "foo");
        const result = tokens.getText();
        const expecting = "fooa";
        assertEquals(expecting, result);
    }

    @Test
    public testCombineInserts(): void {
        const tokens = createRewriter(T1, "abc");
        tokens.insertBefore(0, "x");
        tokens.insertBefore(0, "y");
        const result = tokens.getText();
        const expecting = "yxabc";
        assertEquals(expecting, result);
    }

    @Test
    public testCombine3Inserts(): void {
        const tokens = createRewriter(T1, "abc");
        tokens.insertBefore(1, "x");
        tokens.insertBefore(0, "y");
        tokens.insertBefore(1, "z");
        const result = tokens.getText();
        const expecting = "yazxbc";
        assertEquals(expecting, result);
    }

    @Test
    public testCombineInsertOnLeftWithReplace(): void {
        const tokens = createRewriter(T1, "abc");
        const stream = tokens.getTokenStream() as CommonTokenStream;
        tokens.replace(0, 2, "foo");
        tokens.insertBefore(0, "z");
        stream.fill();

        // combine with left edge of rewrite
        const result = tokens.getText();
        const expecting = "zfoo";
        assertEquals(expecting, result);
    }

    @Test
    public testCombineInsertOnLeftWithDelete(): void {
        const tokens = createRewriter(T1, "abc");
        const stream = tokens.getTokenStream() as CommonTokenStream;
        tokens.delete(0, 2);
        tokens.insertBefore(0, "z");
        stream.fill();

        // combine with left edge of rewrite
        const result = tokens.getText();
        const expecting = "z";
        stream.fill();

        // make sure combo is not znull
        assertEquals(expecting, result);
    }

    @Test
    public testDisjointInserts(): void {
        const tokens = createRewriter(T1, "abc");
        tokens.insertBefore(1, "x");
        tokens.insertBefore(2, "y");
        tokens.insertBefore(0, "z");
        const result = tokens.getText();
        const expecting = "zaxbyc";
        assertEquals(expecting, result);
    }

    @Test
    public testOverlappingReplace(): void {
        const tokens = createRewriter(T1, "abc");
        const stream = tokens.getTokenStream() as CommonTokenStream;
        tokens.replace(1, 2, "foo");
        tokens.replace(0, 3, "bar");
        stream.fill();

        // wipes prior nested replace
        const result = tokens.getText();
        const expecting = "bar";
        assertEquals(expecting, result);
    }

    @Test
    public testOverlappingReplace2(): void {
        const tokens = createRewriter(T1, "abcc");
        const stream = tokens.getTokenStream() as CommonTokenStream;
        tokens.replace(0, 3, "bar");
        tokens.replace(1, 2, "foo");
        stream.fill();

        // cannot split earlier replace
        let exc = null;
        try {
            tokens.getText();
        } catch (iae) {
            if (iae instanceof Error) {
                exc = iae;
            } else {
                throw iae;
            }
        }
        const expecting = "replace op boundaries of <ReplaceOp@[@1,1:1='b',<2>,1:1]..[@2,2:2='c',<3>,1:2]:\"foo\"> " +
            "overlap with previous <ReplaceOp@[@0,0:0='a',<1>,1:0]..[@3,3:3='c',<3>,1:3]:\"bar\">";
        assertNotNull(exc);
        assertEquals(expecting, exc?.message);
    }

    @Test
    public testOverlappingReplace3(): void {
        const tokens = createRewriter(T1, "abcc");
        const stream = tokens.getTokenStream() as CommonTokenStream;
        tokens.replace(1, 2, "foo");
        tokens.replace(0, 2, "bar");
        stream.fill();

        // wipes prior nested replace
        const result = tokens.getText();
        const expecting = "barc";
        assertEquals(expecting, result);
    }

    @Test
    public testOverlappingReplace4(): void {
        const tokens = createRewriter(T1, "abcc");
        const stream = tokens.getTokenStream() as CommonTokenStream;
        tokens.replace(1, 2, "foo");
        tokens.replace(1, 3, "bar");
        stream.fill();

        // wipes prior nested replace
        const result = tokens.getText();
        const expecting = "abar";
        assertEquals(expecting, result);
    }

    @Test
    public testDropIdenticalReplace(): void {
        const tokens = createRewriter(T1, "abcc");
        const stream = tokens.getTokenStream() as CommonTokenStream;
        tokens.replace(1, 2, "foo");
        tokens.replace(1, 2, "foo");
        stream.fill();

        // drop previous, identical
        const result = tokens.getText();
        const expecting = "afooc";
        assertEquals(expecting, result);
    }

    @Test
    public testDropPrevCoveredInsert(): void {
        const tokens = createRewriter(T1, "abc");
        const stream = tokens.getTokenStream() as CommonTokenStream;
        tokens.insertBefore(1, "foo");
        tokens.replace(1, 2, "foo");
        stream.fill();

        // kill prev insert
        const result = tokens.getText();
        const expecting = "afoofoo";
        assertEquals(expecting, result);
    }

    @Test
    public testLeaveAloneDisjointInsert(): void {
        const tokens = createRewriter(T1, "abcc");
        tokens.insertBefore(1, "x");
        tokens.replace(2, 3, "foo");
        const result = tokens.getText();
        const expecting = "axbfoo";
        assertEquals(expecting, result);
    }

    @Test
    public testLeaveAloneDisjointInsert2(): void {
        const tokens = createRewriter(T1, "abcc");
        tokens.replace(2, 3, "foo");
        tokens.insertBefore(1, "x");
        const result = tokens.getText();
        const expecting = "axbfoo";
        assertEquals(expecting, result);
    }

    @Test
    public testInsertBeforeTokenThenDeleteThatToken(): void {
        const tokens = createRewriter(T1, "abc");
        tokens.insertBefore(2, "y");
        tokens.delete(2);
        const result = tokens.getText();
        const expecting = "aby";
        assertEquals(expecting, result);
    }

    // Test Fix for https://github.com/antlr/antlr4/issues/550
    @Test
    public testDistinguishBetweenInsertAfterAndInsertBeforeToPreserverOrder(): void {
        const tokens = createRewriter(T1, "aa");
        tokens.insertBefore(0, "<b>");
        tokens.insertAfter(0, "</b>");
        tokens.insertBefore(1, "<b>");
        tokens.insertAfter(1, "</b>");
        const result = tokens.getText();
        const expecting = "<b>a</b><b>a</b>"; // fails with <b>a<b></b>a</b>"
        assertEquals(expecting, result);
    }

    @Test
    public testDistinguishBetweenInsertAfterAndInsertBeforeToPreserverOrder2(): void {
        const tokens = createRewriter(T1, "aa");
        tokens.insertBefore(0, "<p>");
        tokens.insertBefore(0, "<b>");
        tokens.insertAfter(0, "</p>");
        tokens.insertAfter(0, "</b>");
        tokens.insertBefore(1, "<b>");
        tokens.insertAfter(1, "</b>");
        const result = tokens.getText();
        const expecting = "<b><p>a</p></b><b>a</b>";
        assertEquals(expecting, result);
    }

    // Test Fix for https://github.com/antlr/antlr4/issues/550
    @Test
    public testPreservesOrderOfContiguousInserts(): void {
        const tokens = createRewriter(T1, "ab");
        tokens.insertBefore(0, "<p>");
        tokens.insertBefore(0, "<b>");
        tokens.insertBefore(0, "<div>");
        tokens.insertAfter(0, "</p>");
        tokens.insertAfter(0, "</b>");
        tokens.insertAfter(0, "</div>");
        tokens.insertBefore(1, "!");
        const result = tokens.getText();
        const expecting = "<div><b><p>a</p></b></div>!b";
        assertEquals(expecting, result);
    }

}
