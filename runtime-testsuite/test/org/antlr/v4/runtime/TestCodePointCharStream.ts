/* java2ts: keep */

/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { java, JavaObject } from "jree";
import { CharStreams, Interval, IntStream } from "antlr4ng";
import { assertEquals, assertThrows } from "../../../../../junit.js";

type IllegalStateException = java.lang.IllegalStateException;
const IllegalStateException = java.lang.IllegalStateException;
type StringBuilder = java.lang.StringBuilder;
const StringBuilder = java.lang.StringBuilder;

import { Test } from "../../../../../decorators.js";

export class TestCodePointCharStream extends JavaObject {
    @Test
    public emptyBytesHasSize0(): void {
        const s = CharStreams.fromString("");
        assertEquals(0, s.size);
        assertEquals(0, s.index);
        assertEquals("", s.toString());
    }

    @Test
    public emptyBytesLookAheadReturnsEOF(): void {
        const s = CharStreams.fromString("");
        assertEquals(IntStream.EOF, s.LA(1));
        assertEquals(0, s.index);
    }

    @Test
    public consumingEmptyStreamShouldThrow(): void {
        const s = CharStreams.fromString("");
        const illegalStateException = assertThrows(IllegalStateException, () => { s.consume(); });
        assertEquals("cannot consume EOF", `${illegalStateException.getMessage()}`);
    }

    @Test
    public singleLatinCodePointHasSize1(): void {
        const s = CharStreams.fromString("X");
        assertEquals(1, s.size);
    }

    @Test
    public consumingSingleLatinCodePointShouldMoveIndex(): void {
        const s = CharStreams.fromString("X");
        assertEquals(0, s.index);
        s.consume();
        assertEquals(1, s.index);
    }

    @Test
    public consumingPastSingleLatinCodePointShouldThrow(): void {
        const s = CharStreams.fromString("X");
        s.consume();
        const illegalStateException = assertThrows(IllegalStateException, () => { s.consume(); });
        assertEquals("cannot consume EOF", `${illegalStateException.getMessage()}`);
    }

    @Test
    public singleLatinCodePointLookAheadShouldReturnCodePoint(): void {
        const s = CharStreams.fromString("X");
        assertEquals("X", String.fromCodePoint(s.LA(1)));
        assertEquals(0, s.index);
    }

    @Test
    public multipleLatinCodePointsLookAheadShouldReturnCodePoints(): void {
        const s = CharStreams.fromString("XYZ");
        assertEquals("X", String.fromCodePoint(s.LA(1)));
        assertEquals(0, s.index);
        assertEquals("Y", String.fromCodePoint(s.LA(2)));
        assertEquals(0, s.index);
        assertEquals("Z", String.fromCodePoint(s.LA(3)));
        assertEquals(0, s.index);
    }

    @Test
    public singleLatinCodePointLookAheadPastEndShouldReturnEOF(): void {
        const s = CharStreams.fromString("X");
        assertEquals(IntStream.EOF, s.LA(2));
    }

    @Test
    public singleCJKCodePointHasSize1(): void {
        const s = CharStreams.fromString("\u611B");
        assertEquals(1, s.size);
        assertEquals(0, s.index);
    }

    @Test
    public consumingSingleCJKCodePointShouldMoveIndex(): void {
        const s = CharStreams.fromString("\u611B");
        assertEquals(0, s.index);
        s.consume();
        assertEquals(1, s.index);
    }

    @Test
    public consumingPastSingleCJKCodePointShouldThrow(): void {
        const s = CharStreams.fromString("\u611B");
        s.consume();
        const illegalStateException = assertThrows(IllegalStateException, () => { s.consume(); });
        assertEquals("cannot consume EOF", `${illegalStateException.getMessage()}`);
    }

    @Test
    public singleCJKCodePointLookAheadShouldReturnCodePoint(): void {
        const s = CharStreams.fromString("\u611B");
        assertEquals(0x611B, s.LA(1));
        assertEquals(0, s.index);
    }

    @Test
    public singleCJKCodePointLookAheadPastEndShouldReturnEOF(): void {
        const s = CharStreams.fromString("\u611B");
        assertEquals(IntStream.EOF, s.LA(2));
        assertEquals(0, s.index);
    }

    @Test
    public singleEmojiCodePointHasSize1(): void {
        const s = CharStreams.fromString(`${new StringBuilder().appendCodePoint(0x1F4A9)}`);
        assertEquals(1, s.size);
        assertEquals(0, s.index);
    }

    @Test
    public consumingSingleEmojiCodePointShouldMoveIndex(): void {
        const s = CharStreams.fromString(`${new StringBuilder().appendCodePoint(0x1F4A9)}`);
        assertEquals(0, s.index);
        s.consume();
        assertEquals(1, s.index);
    }

    @Test
    public consumingPastEndOfEmojiCodePointWithShouldThrow(): void {
        const s = CharStreams.fromString(`${new StringBuilder().appendCodePoint(0x1F4A9)}`);
        assertEquals(0, s.index);
        s.consume();
        assertEquals(1, s.index);
        const illegalStateException = assertThrows(IllegalStateException, () => { s.consume(); });
        assertEquals("cannot consume EOF", `${illegalStateException.getMessage()}`);
    }

    @Test
    public singleEmojiCodePointLookAheadShouldReturnCodePoint(): void {
        const s = CharStreams.fromString(`${new StringBuilder().appendCodePoint(0x1F4A9)}`);
        assertEquals(0x1F4A9, s.LA(1));
        assertEquals(0, s.index);
    }

    @Test
    public singleEmojiCodePointLookAheadPastEndShouldReturnEOF(): void {
        const s = CharStreams.fromString(`${new StringBuilder().appendCodePoint(0x1F4A9)}`);
        assertEquals(IntStream.EOF, s.LA(2));
        assertEquals(0, s.index);
    }

    @Test
    public getTextWithLatin(): void {
        const s = CharStreams.fromString("0123456789");
        assertEquals("34567", s.getText(Interval.of(3, 7)));
    }

    @Test
    public getTextWithCJK(): void {
        const s = CharStreams.fromString("01234\u40946789");
        assertEquals("34\u409467", s.getText(Interval.of(3, 7)));
    }

    @Test
    public getTextWithEmoji(): void {
        const s = CharStreams.fromString(`${new StringBuilder("01234").appendCodePoint(0x1F522).append("6789")}`);
        assertEquals("34\uD83D\uDD2267", s.getText(Interval.of(3, 7)));
    }

    @Test
    public toStringWithLatin(): void {
        const s = CharStreams.fromString("0123456789");
        assertEquals("0123456789", s.toString());
    }

    @Test
    public toStringWithCJK(): void {
        const s = CharStreams.fromString("01234\u40946789");
        assertEquals("01234\u40946789", s.toString());
    }

    @Test
    public toStringWithEmoji(): void {
        const s = CharStreams.fromString(`${new StringBuilder("01234").appendCodePoint(0x1F522).append("6789")}`);
        assertEquals("01234\uD83D\uDD226789", s.toString());
    }

    @Test
    public lookAheadWithLatin(): void {
        const s = CharStreams.fromString("0123456789");
        assertEquals("5", String.fromCodePoint(s.LA(6)));
    }

    @Test
    public lookAheadWithCJK(): void {
        const s = CharStreams.fromString("01234\u40946789");
        assertEquals(0x4094, s.LA(6));
    }

    @Test
    public lookAheadWithEmoji(): void {
        const s = CharStreams.fromString(`${new StringBuilder("01234").appendCodePoint(0x1F522).append("6789")}`);
        assertEquals(0x1F522, s.LA(6));
    }

    @Test
    public seekWithLatin(): void {
        const s = CharStreams.fromString("0123456789");
        s.seek(5);
        assertEquals("5", String.fromCodePoint(s.LA(1)));
    }

    @Test
    public seekWithCJK(): void {
        const s = CharStreams.fromString("01234\u40946789");
        s.seek(5);
        assertEquals(0x4094, s.LA(1));
    }

    @Test
    public seekWithEmoji(): void {
        const s = CharStreams.fromString(`${new StringBuilder("01234").appendCodePoint(0x1F522).append("6789")}`);
        s.seek(5);
        assertEquals(0x1F522, s.LA(1));
    }

    @Test
    public lookBehindWithLatin(): void {
        const s = CharStreams.fromString("0123456789");
        s.seek(6);
        assertEquals("5", String.fromCodePoint(s.LA(-1)));
    }

    @Test
    public lookBehindWithCJK(): void {
        const s = CharStreams.fromString("01234\u40946789");
        s.seek(6);
        assertEquals(0x4094, s.LA(-1));
    }

    @Test
    public lookBehindWithEmoji(): void {
        const s = CharStreams.fromString(`${new StringBuilder("01234").appendCodePoint(0x1F522).append("6789")}`);
        s.seek(6);
        assertEquals(0x1F522, s.LA(-1));
    }
};
