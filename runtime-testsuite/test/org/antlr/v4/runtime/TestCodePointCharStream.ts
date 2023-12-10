/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */




import { JavaObject, java } from "jree";
import { CodePointCharStream, CharStreams, Interval } from "antlr4ng";
import { junit } from "junit.ts";

type IllegalStateException = java.lang.IllegalStateException;
const IllegalStateException = java.lang.IllegalStateException;
type StringBuilder = java.lang.StringBuilder;
const StringBuilder = java.lang.StringBuilder;



export  class TestCodePointCharStream extends JavaObject {
	@Test
public  emptyBytesHasSize0():  void {
		let  s = CharStreams.fromString("");
		org.junit.jupiter.api.Assert.assertEquals(0, s.size());
		org.junit.jupiter.api.Assert.assertEquals(0, s.index());
		org.junit.jupiter.api.Assert.assertEquals("", s.toString());
	}

	@Test
public  emptyBytesLookAheadReturnsEOF():  void {
		let  s = CharStreams.fromString("");
		org.junit.jupiter.api.Assert.assertEquals(java.util.stream.IntStream.EOF, s.LA(1));
		org.junit.jupiter.api.Assert.assertEquals(0, s.index());
	}

	@Test
public  consumingEmptyStreamShouldThrow():  void {
		let  s = CharStreams.fromString("");
		let  illegalStateException = assertThrows(
				IllegalStateException.class,
				s.consume
		);
		org.junit.jupiter.api.Assert.assertEquals("cannot consume EOF", illegalStateException.getMessage());
	}

	@Test
public  singleLatinCodePointHasSize1():  void {
		let  s = CharStreams.fromString("X");
		org.junit.jupiter.api.Assert.assertEquals(1, s.size());
	}

	@Test
public  consumingSingleLatinCodePointShouldMoveIndex():  void {
		let  s = CharStreams.fromString("X");
		org.junit.jupiter.api.Assert.assertEquals(0, s.index());
		s.consume();
		org.junit.jupiter.api.Assert.assertEquals(1, s.index());
	}

	@Test
public  consumingPastSingleLatinCodePointShouldThrow():  void {
		let  s = CharStreams.fromString("X");
		s.consume();
		let  illegalStateException = assertThrows(IllegalStateException.class, s.consume);
		org.junit.jupiter.api.Assert.assertEquals("cannot consume EOF", illegalStateException.getMessage());
	}

	@Test
public  singleLatinCodePointLookAheadShouldReturnCodePoint():  void {
		let  s = CharStreams.fromString("X");
		org.junit.jupiter.api.Assert.assertEquals('X', s.LA(1));
		org.junit.jupiter.api.Assert.assertEquals(0, s.index());
	}

	@Test
public  multipleLatinCodePointsLookAheadShouldReturnCodePoints():  void {
		let  s = CharStreams.fromString("XYZ");
		org.junit.jupiter.api.Assert.assertEquals('X', s.LA(1));
		org.junit.jupiter.api.Assert.assertEquals(0, s.index());
		org.junit.jupiter.api.Assert.assertEquals('Y', s.LA(2));
		org.junit.jupiter.api.Assert.assertEquals(0, s.index());
		org.junit.jupiter.api.Assert.assertEquals('Z', s.LA(3));
		org.junit.jupiter.api.Assert.assertEquals(0, s.index());
	}

	@Test
public  singleLatinCodePointLookAheadPastEndShouldReturnEOF():  void {
		let  s = CharStreams.fromString("X");
		org.junit.jupiter.api.Assert.assertEquals(java.util.stream.IntStream.EOF, s.LA(2));
	}

	@Test
public  singleCJKCodePointHasSize1():  void {
		let  s = CharStreams.fromString("\u611B");
		org.junit.jupiter.api.Assert.assertEquals(1, s.size());
		org.junit.jupiter.api.Assert.assertEquals(0, s.index());
	}

	@Test
public  consumingSingleCJKCodePointShouldMoveIndex():  void {
		let  s = CharStreams.fromString("\u611B");
		org.junit.jupiter.api.Assert.assertEquals(0, s.index());
		s.consume();
		org.junit.jupiter.api.Assert.assertEquals(1, s.index());
	}

	@Test
public  consumingPastSingleCJKCodePointShouldThrow():  void {
		let  s = CharStreams.fromString("\u611B");
		s.consume();
		let  illegalStateException = assertThrows(IllegalStateException.class, s.consume);
		org.junit.jupiter.api.Assert.assertEquals("cannot consume EOF", illegalStateException.getMessage());
	}

	@Test
public  singleCJKCodePointLookAheadShouldReturnCodePoint():  void {
		let  s = CharStreams.fromString("\u611B");
		org.junit.jupiter.api.Assert.assertEquals(0x611B, s.LA(1));
		org.junit.jupiter.api.Assert.assertEquals(0, s.index());
	}

	@Test
public  singleCJKCodePointLookAheadPastEndShouldReturnEOF():  void {
		let  s = CharStreams.fromString("\u611B");
		org.junit.jupiter.api.Assert.assertEquals(java.util.stream.IntStream.EOF, s.LA(2));
		org.junit.jupiter.api.Assert.assertEquals(0, s.index());
	}

	@Test
public  singleEmojiCodePointHasSize1():  void {
		let  s = CharStreams.fromString(
				new  StringBuilder().appendCodePoint(0x1F4A9).toString());
		org.junit.jupiter.api.Assert.assertEquals(1, s.size());
		org.junit.jupiter.api.Assert.assertEquals(0, s.index());
	}

	@Test
public  consumingSingleEmojiCodePointShouldMoveIndex():  void {
		let  s = CharStreams.fromString(
				new  StringBuilder().appendCodePoint(0x1F4A9).toString());
		org.junit.jupiter.api.Assert.assertEquals(0, s.index());
		s.consume();
		org.junit.jupiter.api.Assert.assertEquals(1, s.index());
	}

	@Test
public  consumingPastEndOfEmojiCodePointWithShouldThrow():  void {
		let  s = CharStreams.fromString(
				new  StringBuilder().appendCodePoint(0x1F4A9).toString());
		org.junit.jupiter.api.Assert.assertEquals(0, s.index());
		s.consume();
		org.junit.jupiter.api.Assert.assertEquals(1, s.index());
		let  illegalStateException = assertThrows(IllegalStateException.class, s.consume);
		org.junit.jupiter.api.Assert.assertEquals("cannot consume EOF", illegalStateException.getMessage());
	}

	@Test
public  singleEmojiCodePointLookAheadShouldReturnCodePoint():  void {
		let  s = CharStreams.fromString(
				new  StringBuilder().appendCodePoint(0x1F4A9).toString());
		org.junit.jupiter.api.Assert.assertEquals(0x1F4A9, s.LA(1));
		org.junit.jupiter.api.Assert.assertEquals(0, s.index());
	}

	@Test
public  singleEmojiCodePointLookAheadPastEndShouldReturnEOF():  void {
		let  s = CharStreams.fromString(
				new  StringBuilder().appendCodePoint(0x1F4A9).toString());
		org.junit.jupiter.api.Assert.assertEquals(java.util.stream.IntStream.EOF, s.LA(2));
		org.junit.jupiter.api.Assert.assertEquals(0, s.index());
	}

	@Test
public  getTextWithLatin():  void {
		let  s = CharStreams.fromString("0123456789");
		org.junit.jupiter.api.Assert.assertEquals("34567", s.getText(Interval.of(3, 7)));
	}

	@Test
public  getTextWithCJK():  void {
		let  s = CharStreams.fromString("01234\u40946789");
		org.junit.jupiter.api.Assert.assertEquals("34\u409467", s.getText(Interval.of(3, 7)));
	}

	@Test
public  getTextWithEmoji():  void {
		let  s = CharStreams.fromString(
				new  StringBuilder("01234")
					.appendCodePoint(0x1F522)
					.append("6789")
					.toString());
		org.junit.jupiter.api.Assert.assertEquals("34\uD83D\uDD2267", s.getText(Interval.of(3, 7)));
	}

	@Test
public  toStringWithLatin():  void {
		let  s = CharStreams.fromString("0123456789");
		org.junit.jupiter.api.Assert.assertEquals("0123456789", s.toString());
	}

	@Test
public  toStringWithCJK():  void {
		let  s = CharStreams.fromString("01234\u40946789");
		org.junit.jupiter.api.Assert.assertEquals("01234\u40946789", s.toString());
	}

	@Test
public  toStringWithEmoji():  void {
		let  s = CharStreams.fromString(
				new  StringBuilder("01234")
					.appendCodePoint(0x1F522)
					.append("6789")
					.toString());
		org.junit.jupiter.api.Assert.assertEquals("01234\uD83D\uDD226789", s.toString());
	}

	@Test
public  lookAheadWithLatin():  void {
		let  s = CharStreams.fromString("0123456789");
		org.junit.jupiter.api.Assert.assertEquals('5', s.LA(6));
	}

	@Test
public  lookAheadWithCJK():  void {
		let  s = CharStreams.fromString("01234\u40946789");
		org.junit.jupiter.api.Assert.assertEquals(0x4094, s.LA(6));
	}

	@Test
public  lookAheadWithEmoji():  void {
		let  s = CharStreams.fromString(
				new  StringBuilder("01234")
					.appendCodePoint(0x1F522)
					.append("6789")
					.toString());
		org.junit.jupiter.api.Assert.assertEquals(0x1F522, s.LA(6));
	}

	@Test
public  seekWithLatin():  void {
		let  s = CharStreams.fromString("0123456789");
		s.seek(5);
		org.junit.jupiter.api.Assert.assertEquals('5', s.LA(1));
	}

	@Test
public  seekWithCJK():  void {
		let  s = CharStreams.fromString("01234\u40946789");
		s.seek(5);
		org.junit.jupiter.api.Assert.assertEquals(0x4094, s.LA(1));
	}

	@Test
public  seekWithEmoji():  void {
		let  s = CharStreams.fromString(
				new  StringBuilder("01234")
					.appendCodePoint(0x1F522)
					.append("6789")
					.toString());
		s.seek(5);
		org.junit.jupiter.api.Assert.assertEquals(0x1F522, s.LA(1));
	}

	@Test
public  lookBehindWithLatin():  void {
		let  s = CharStreams.fromString("0123456789");
		s.seek(6);
		org.junit.jupiter.api.Assert.assertEquals('5', s.LA(-1));
	}

	@Test
public  lookBehindWithCJK():  void {
		let  s = CharStreams.fromString("01234\u40946789");
		s.seek(6);
		org.junit.jupiter.api.Assert.assertEquals(0x4094, s.LA(-1));
	}

	@Test
public  lookBehindWithEmoji():  void {
		let  s = CharStreams.fromString(
				new  StringBuilder("01234")
					.appendCodePoint(0x1F522)
					.append("6789")
					.toString());
		s.seek(6);
		org.junit.jupiter.api.Assert.assertEquals(0x1F522, s.LA(-1));
	}

	@Test
public  asciiContentsShouldUse8BitBuffer():  void {
		let  s = CharStreams.fromString("hello");
		org.junit.jupiter.api.Assert.assertTrue(s.getInternalStorage() instanceof Int8Array);
		org.junit.jupiter.api.Assert.assertEquals(5, s.size());
	}

	@Test
public  bmpContentsShouldUse16BitBuffer():  void {
		let  s = CharStreams.fromString("hello \u4E16\u754C");
		org.junit.jupiter.api.Assert.assertTrue(s.getInternalStorage() instanceof Uint16Array);
		org.junit.jupiter.api.Assert.assertEquals(8, s.size());
	}

	@Test
public  smpContentsShouldUse32BitBuffer():  void {
		let  s = CharStreams.fromString("hello \uD83C\uDF0D");
		org.junit.jupiter.api.Assert.assertTrue(s.getInternalStorage() instanceof Int32Array);
		org.junit.jupiter.api.Assert.assertEquals(7, s.size());
	}
}
