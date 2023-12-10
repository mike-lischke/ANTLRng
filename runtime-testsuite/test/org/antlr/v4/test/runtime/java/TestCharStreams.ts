/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */




import { java, JavaObject, closeResources, handleResourceError, throwResourceError, type byte } from "jree";
import { CharStream, CharStreams } from "antlr4ng";

type Path = java.nio.file.Path;
type File = java.io.File;
const File = java.io.File;
type Files = java.nio.file.Files;
const Files = java.nio.file.Files;
type StandardCharsets = java.nio.charset.StandardCharsets;
const StandardCharsets = java.nio.charset.StandardCharsets;
type InputStream = java.io.InputStream;
const InputStream = java.io.InputStream;
type SeekableByteChannel = java.nio.channels.SeekableByteChannel;
type CodingErrorAction = java.nio.charset.CodingErrorAction;
const CodingErrorAction = java.nio.charset.CodingErrorAction;
type CharacterCodingException = java.nio.charset.CharacterCodingException;
const CharacterCodingException = java.nio.charset.CharacterCodingException;
type Reader = java.io.Reader;
const Reader = java.io.Reader;
type Charset = java.nio.charset.Charset;
const Charset = java.nio.charset.Charset;

import { Test, Override } from "../../../../../../../decorators.js";


export  class TestCharStreams extends JavaObject {
	@Test
public  fromBMPStringHasExpectedSize():  void {
		let  s = CharStreams.fromString("hello");
		assertEquals(5, s.size());
		assertEquals(0, s.index());
		assertEquals("hello", s.toString());
	}

	@Test
public  fromSMPStringHasExpectedSize():  void {
		let  s = CharStreams.fromString(
				"hello \uD83C\uDF0E");
		assertEquals(7, s.size());
		assertEquals(0, s.index());
		assertEquals("hello \uD83C\uDF0E", s.toString());
	}

	@Test
public  fromBMPUTF8PathHasExpectedSize(/* @TempDir */  tempDir: Path):  void {
		let  test = new  File(tempDir.toString(), "test").toPath();
		Files.write(test, "hello".getBytes(StandardCharsets.UTF_8));
		let  s = CharStreams.fromPath(test);
		assertEquals(5, s.size());
		assertEquals(0, s.index());
		assertEquals("hello", s.toString());
		assertEquals(test.toString(), s.getSourceName());
	}

	@Test
public  fromSMPUTF8PathHasExpectedSize(/* @TempDir */  tempDir: Path):  void {
		let  p = this.getTestFile(tempDir);
		Files.write(p, "hello \uD83C\uDF0E".getBytes(StandardCharsets.UTF_8));
		let  s = CharStreams.fromPath(p);
		assertEquals(7, s.size());
		assertEquals(0, s.index());
		assertEquals("hello \uD83C\uDF0E", s.toString());
		assertEquals(p.toString(), s.getSourceName());
	}

	@Test
public  fromBMPUTF8InputStreamHasExpectedSize(/* @TempDir */  tempDir: Path):  void {
		let  p = this.getTestFile(tempDir);
		Files.write(p, "hello".getBytes(StandardCharsets.UTF_8));
		try {
// This holds the final error to throw (if any).
let error: java.lang.Throwable | undefined;

 const is: InputStream  = Files.newInputStream(p)
try {
	try  {
			let  s = CharStreams.fromStream(CharStreams.fromStream.is);
			assertEquals(5, s.size());
			assertEquals(0, s.index());
			assertEquals("hello", s.toString());
		}
	finally {
	error = closeResources([is]);
	}
} catch(e) {
	error = handleResourceError(e, error);
} finally {
	throwResourceError(error);
}
}

	}

	@Test
public  fromSMPUTF8InputStreamHasExpectedSize(/* @TempDir */  tempDir: Path):  void {
		let  p = this.getTestFile(tempDir);
		Files.write(p, "hello \uD83C\uDF0E".getBytes(StandardCharsets.UTF_8));
		try {
// This holds the final error to throw (if any).
let error: java.lang.Throwable | undefined;

 const is: InputStream  = Files.newInputStream(p)
try {
	try  {
			let  s = CharStreams.fromStream(CharStreams.fromStream.is);
			assertEquals(7, s.size());
			assertEquals(0, s.index());
			assertEquals("hello \uD83C\uDF0E", s.toString());
		}
	finally {
	error = closeResources([is]);
	}
} catch(e) {
	error = handleResourceError(e, error);
} finally {
	throwResourceError(error);
}
}

	}

	@Test
public  fromBMPUTF8ChannelHasExpectedSize(/* @TempDir */  tempDir: Path):  void {
		let  p = this.getTestFile(tempDir);
		Files.write(p, "hello".getBytes(StandardCharsets.UTF_8));
		try {
// This holds the final error to throw (if any).
let error: java.lang.Throwable | undefined;

 const c: SeekableByteChannel  = Files.newByteChannel(p)
try {
	try  {
			let  s = CharStreams.fromChannel(
					c, 4096, CodingErrorAction.REPLACE, "foo");
			assertEquals(5, s.size());
			assertEquals(0, s.index());
			assertEquals("hello", s.toString());
			assertEquals("foo", s.getSourceName());
		}
	finally {
	error = closeResources([c]);
	}
} catch(e) {
	error = handleResourceError(e, error);
} finally {
	throwResourceError(error);
}
}

	}

	@Test
public  fromSMPUTF8ChannelHasExpectedSize(/* @TempDir */  tempDir: Path):  void {
		let  p = this.getTestFile(tempDir);
		Files.write(p, "hello \uD83C\uDF0E".getBytes(StandardCharsets.UTF_8));
		try {
// This holds the final error to throw (if any).
let error: java.lang.Throwable | undefined;

 const c: SeekableByteChannel  = Files.newByteChannel(p)
try {
	try  {
			let  s = CharStreams.fromChannel(
					c, 4096, CodingErrorAction.REPLACE, "foo");
			assertEquals(7, s.size());
			assertEquals(0, s.index());
			assertEquals("hello \uD83C\uDF0E", s.toString());
			assertEquals("foo", s.getSourceName());
		}
	finally {
	error = closeResources([c]);
	}
} catch(e) {
	error = handleResourceError(e, error);
} finally {
	throwResourceError(error);
}
}

	}

	@Test
public  fromInvalidUTF8BytesChannelReplacesWithSubstCharInReplaceMode(/* @TempDir */  tempDir: Path):  void {
		let  p = this.getTestFile(tempDir);
		let  toWrite =  [ 0xCA as byte, 0xFE as byte, 0xFE as byte, 0xED as byte ];
		Files.write(p, toWrite);
		try {
// This holds the final error to throw (if any).
let error: java.lang.Throwable | undefined;

 const c: SeekableByteChannel  = Files.newByteChannel(p)
try {
	try  {
			let  s = CharStreams.fromChannel(
					c, 4096, CodingErrorAction.REPLACE, "foo");
			assertEquals(4, s.size());
			assertEquals(0, s.index());
			assertEquals("\uFFFD\uFFFD\uFFFD\uFFFD", s.toString());
		}
	finally {
	error = closeResources([c]);
	}
} catch(e) {
	error = handleResourceError(e, error);
} finally {
	throwResourceError(error);
}
}

	}

	@Test
public  fromInvalidUTF8BytesThrowsInReportMode(/* @TempDir */  tempDir: Path):  void {
		let  p = this.getTestFile(tempDir);
		let  toWrite =  [ 0xCA as byte, 0xFE as byte ];
		Files.write(p, toWrite);
		try {
// This holds the final error to throw (if any).
let error: java.lang.Throwable | undefined;

 const c: SeekableByteChannel  = Files.newByteChannel(p)
try {
	try  {
			assertThrows(
					CharacterCodingException.class,
					() => CharStreams.fromChannel(c, 4096, CodingErrorAction.REPORT, "foo")
			);
		}
	finally {
	error = closeResources([c]);
	}
} catch(e) {
	error = handleResourceError(e, error);
} finally {
	throwResourceError(error);
}
}

	}

	@Test
public  fromSMPUTF8SequenceStraddlingBufferBoundary(/* @TempDir */  tempDir: Path):  void {
		let  p = this.getTestFile(tempDir);
		Files.write(p, "hello \uD83C\uDF0E".getBytes(StandardCharsets.UTF_8));
		try {
// This holds the final error to throw (if any).
let error: java.lang.Throwable | undefined;

 const c: SeekableByteChannel  = Files.newByteChannel(p)
try {
	try  {
			let  s = CharStreams.fromChannel(
					c,
					// Note this buffer size ensures the SMP code point
					// straddles the boundary of two buffers
					8,
					CodingErrorAction.REPLACE,
					"foo");
			assertEquals(7, s.size());
			assertEquals(0, s.index());
			assertEquals("hello \uD83C\uDF0E", s.toString());
		}
	finally {
	error = closeResources([c]);
	}
} catch(e) {
	error = handleResourceError(e, error);
} finally {
	throwResourceError(error);
}
}

	}

	@Test
public  fromFileName(/* @TempDir */  tempDir: Path):  void {
		let  p = this.getTestFile(tempDir);
		Files.write(p, "hello \uD83C\uDF0E".getBytes(StandardCharsets.UTF_8));
		let  s = CharStreams.fromFileName(p.toString());
		assertEquals(7, s.size());
		assertEquals(0, s.index());
		assertEquals("hello \uD83C\uDF0E", s.toString());
		assertEquals(p.toString(), s.getSourceName());

	}

	@Test
public  fromFileNameWithLatin1(/* @TempDir */  tempDir: Path):  void {
		let  p = this.getTestFile(tempDir);
		Files.write(p, "hello \u00CA\u00FE".getBytes(StandardCharsets.ISO_8859_1));
		let  s = CharStreams.fromFileName(p.toString(), StandardCharsets.ISO_8859_1);
		assertEquals(8, s.size());
		assertEquals(0, s.index());
		assertEquals("hello \u00CA\u00FE", s.toString());
		assertEquals(p.toString(), s.getSourceName());
	}

	@Test
public  fromReader(/* @TempDir */  tempDir: Path):  void {
		let  p = this.getTestFile(tempDir);
		Files.write(p, "hello \uD83C\uDF0E".getBytes(StandardCharsets.UTF_8));
		try {
// This holds the final error to throw (if any).
let error: java.lang.Throwable | undefined;

 const r: Reader  = Files.newBufferedReader(p, StandardCharsets.UTF_8)
try {
	try  {
			let  s = CharStreams.fromReader(CharStreams.fromReader.r);
			assertEquals(7, s.size());
			assertEquals(0, s.index());
			assertEquals("hello \uD83C\uDF0E", s.toString());
		}
	finally {
	error = closeResources([r]);
	}
} catch(e) {
	error = handleResourceError(e, error);
} finally {
	throwResourceError(error);
}
}

	}

	@Test
public  fromSMPUTF16LEPathSMPHasExpectedSize(/* @TempDir */  tempDir: Path):  void {
		let  p = this.getTestFile(tempDir);
		Files.write(p, "hello \uD83C\uDF0E".getBytes(StandardCharsets.UTF_16LE));
		let  s = CharStreams.fromPath(p, StandardCharsets.UTF_16LE);
		assertEquals(7, s.size());
		assertEquals(0, s.index());
		assertEquals("hello \uD83C\uDF0E", s.toString());
		assertEquals(p.toString(), s.getSourceName());
	}

	@Test
public  fromSMPUTF32LEPathSMPHasExpectedSize(/* @TempDir */  tempDir: Path):  void {
		let  p = this.getTestFile(tempDir);
		// UTF-32 isn't popular enough to have an entry in StandardCharsets.
		let  c = Charset.forName("UTF-32LE");
		Files.write(p, "hello \uD83C\uDF0E".getBytes(c));
		let  s = CharStreams.fromPath(p, c);
		assertEquals(7, s.size());
		assertEquals(0, s.index());
		assertEquals("hello \uD83C\uDF0E", s.toString());
		assertEquals(p.toString(), s.getSourceName());
	}

	private  getTestFile(dir: Path):  Path {
		return new  File(dir.toString(), "test").toPath();
	}
}
