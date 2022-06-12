/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */


/*
 eslint-disable @typescript-eslint/no-namespace, @typescript-eslint/naming-convention,
 max-classes-per-file, jsdoc/check-tag-names, @typescript-eslint/no-empty-function,
 @typescript-eslint/restrict-plus-operands, @typescript-eslint/unified-signatures, @typescript-eslint/member-ordering,
 no-underscore-dangle
*/

/* cspell: disable */



import { java } from "../../../../../lib/java/java";
import { BufferedTokenStream } from "./BufferedTokenStream";
import { CharStream } from "./CharStream";
import { CodePointBuffer } from "./CodePointBuffer";
import { CodePointCharStream } from "./CodePointCharStream";
import { IntStream } from "./IntStream";




/** This class represents the primary interface for creating {@link CharStream}s
 *  from a variety of sources as of 4.7.  The motivation was to support
 *  Unicode code points > U+FFFF.  {@link ANTLRInputStream} and
 *  {@link ANTLRFileStream} are now deprecated in favor of the streams created
 *  by this interface.
 *
 *  DEPRECATED: {@code new ANTLRFileStream("myinputfile")}
 *  NEW:        {@code CharStreams.fromFileName("myinputfile")}
 *
 *  WARNING: If you use both the deprecated and the new streams, you will see
 *  a nontrivial performance degradation. This speed hit is because the
 *  {@link Lexer}'s internal code goes from a monomorphic to megamorphic
 *  dynamic dispatch to get characters from the input stream. Java's
 *  on-the-fly compiler (JIT) is unable to perform the same optimizations
 *  so stick with either the old or the new streams, if performance is
 *  a primary concern. See the extreme debugging and spelunking
 *  needed to identify this issue in our timing rig:
 *
 *      https://github.com/antlr/antlr4/pull/1781
 *
 *  The ANTLR character streams still buffer all the input when you create
 *  the stream, as they have done for ~20 years. If you need unbuffered
 *  access, please note that it becomes challenging to create
 *  parse trees. The parse tree has to point to tokens which will either
 *  point into a stale location in an unbuffered stream or you have to copy
 *  the characters out of the buffer into the token. That defeats the purpose
 *  of unbuffered input. Per the ANTLR book, unbuffered streams are primarily
 *  useful for processing infinite streams *during the parse.*
 *
 *  The new streams also use 8-bit buffers when possible so this new
 *  interface supports character streams that use half as much memory
 *  as the old {@link ANTLRFileStream}, which assumed 16-bit characters.
 *
 *  A big shout out to Ben Hamilton (github bhamiltoncx) for his superhuman
 *  efforts across all targets to get true Unicode 3.1 support for U+10FFFF.
 *
 *  @since 4.7
 */
export  class CharStreams {
	private static readonly  DEFAULT_BUFFER_SIZE:  number = 4096;

	// Utility class; do not construct.
	private constructor() { }

	/**
	 * Creates a {@link CharStream} given a path to a UTF-8
	 * encoded file on disk.
	 *
	 * Reads the entire contents of the file into the result before returning.
	 */
	public static fromPath(path: Path): CharStream;

	/**
	 * Creates a {@link CharStream} given a path to a file on disk and the
	 * charset of the bytes contained in the file.
	 *
	 * Reads the entire contents of the file into the result before returning.
	 */
	public static fromPath(path: Path, charset: Charset): CharStream;


	/**
	 * Creates a {@link CharStream} given a path to a UTF-8
	 * encoded file on disk.
	 *
	 * Reads the entire contents of the file into the result before returning.
	 */
	public static fromPath(path: Path, charset?: Charset):  CharStream {
if (charset === undefined) {
		return CharStreams.fromPath(path, StandardCharsets.UTF_8);
	}
 else  {
		let  size: bigint = Files.size(path);
		try (ReadableByteChannel channel = Files.newByteChannel(path)) {
			return CharStreams.fromChannel(
				BufferedTokenStream.nextTokenOnChannel.channel,
				charset,
				CharStreams.DEFAULT_BUFFER_SIZE,
				CodingErrorAction.REPLACE,
				path.toString(),
				size);
		}
	}

}


	/**
	 * Creates a {@link CharStream} given a string containing a
	 * path to a UTF-8 file on disk.
	 *
	 * Reads the entire contents of the file into the result before returning.
	 */
	public static fromFileName(fileName: string): CharStream;

	/**
	 * Creates a {@link CharStream} given a string containing a
	 * path to a file on disk and the charset of the bytes
	 * contained in the file.
	 *
	 * Reads the entire contents of the file into the result before returning.
	 */
	public static fromFileName(fileName: string, charset: Charset): CharStream;


	/**
	 * Creates a {@link CharStream} given a string containing a
	 * path to a UTF-8 file on disk.
	 *
	 * Reads the entire contents of the file into the result before returning.
	 */
	public static fromFileName(fileName: string, charset?: Charset):  CharStream {
if (charset === undefined) {
		return CharStreams.fromPath(Paths.get(fileName), StandardCharsets.UTF_8);
	}
 else  {
		return CharStreams.fromPath(Paths.get(fileName), charset);
	}

}



	/**
	 * Creates a {@link CharStream} given an opened {@link InputStream}
	 * containing UTF-8 bytes.
	 *
	 * Reads the entire contents of the {@code InputStream} into
	 * the result before returning, then closes the {@code InputStream}.
	 */
	public static fromStream(is: InputStream): CharStream;

	/**
	 * Creates a {@link CharStream} given an opened {@link InputStream} and the
	 * charset of the bytes contained in the stream.
	 *
	 * Reads the entire contents of the {@code InputStream} into
	 * the result before returning, then closes the {@code InputStream}.
	 */
	public static fromStream(is: InputStream, charset: Charset): CharStream;

	public static fromStream(is: InputStream, charset: Charset, inputSize: bigint): CharStream;



	/**
	 * Creates a {@link CharStream} given an opened {@link InputStream}
	 * containing UTF-8 bytes.
	 *
	 * Reads the entire contents of the {@code InputStream} into
	 * the result before returning, then closes the {@code InputStream}.
	 */
	public static fromStream(is: InputStream, charset?: Charset, inputSize?: bigint):  CharStream {
if (charset === undefined) {
		return CharStreams.fromStream(is, StandardCharsets.UTF_8);
	}
 else if (charset instanceof Charset && inputSize === undefined) {
		return CharStreams.fromStream(is, charset, -1);
	}
 else  {
		try (ReadableByteChannel channel = Channels.newChannel(is)) {
			return CharStreams.fromChannel(
				BufferedTokenStream.nextTokenOnChannel.channel,
				charset,
				CharStreams.DEFAULT_BUFFER_SIZE,
				CodingErrorAction.REPLACE,
				IntStream.UNKNOWN_SOURCE_NAME,
				inputSize);
		}
	}

}


	/**
	 * Creates a {@link CharStream} given an opened {@link ReadableByteChannel}
	 * containing UTF-8 bytes.
	 *
	 * Reads the entire contents of the {@code channel} into
	 * the result before returning, then closes the {@code channel}.
	 */
	public static fromChannel(channel: ReadableByteChannel): CharStream;

	/**
	 * Creates a {@link CharStream} given an opened {@link ReadableByteChannel} and the
	 * charset of the bytes contained in the channel.
	 *
	 * Reads the entire contents of the {@code channel} into
	 * the result before returning, then closes the {@code channel}.
	 */
	public static fromChannel(channel: ReadableByteChannel, charset: Charset): CharStream;

	/**
	 * Creates a {@link CharStream} given an opened {@link ReadableByteChannel}
	 * containing UTF-8 bytes.
	 *
	 * Reads the entire contents of the {@code channel} into
	 * the result before returning, then closes the {@code channel}.
	 */
	public static fromChannel(
		channel: ReadableByteChannel,
		bufferSize: number,
		decodingErrorAction: CodingErrorAction,
		sourceName: string): CodePointCharStream;

	public static fromChannel(
		channel: ReadableByteChannel,
		charset: Charset,
		bufferSize: number,
		decodingErrorAction: CodingErrorAction,
		sourceName: string,
		inputSize: bigint): CodePointCharStream;


	/**
	 * Creates a {@link CharStream} given an opened {@link ReadableByteChannel}
	 * containing UTF-8 bytes.
	 *
	 * Reads the entire contents of the {@code channel} into
	 * the result before returning, then closes the {@code channel}.
	 */
	public static fromChannel(channel: ReadableByteChannel, charsetOrBufferSize?: Charset | number, decodingErrorActionOrBufferSize?: CodingErrorAction | number, sourceNameOrDecodingErrorAction?: string | CodingErrorAction, sourceName?: string, inputSize?: bigint):  CharStream |  CodePointCharStream {
if (charsetOrBufferSize === undefined) {
		return CharStreams.fromChannel(channel, StandardCharsets.UTF_8);
	}
 else if (charsetOrBufferSize instanceof Charset && decodingErrorActionOrBufferSize === undefined) {
const charset = charsetOrBufferSize as Charset;
		return CharStreams.fromChannel(
			channel,
			CharStreams.DEFAULT_BUFFER_SIZE,
			CodingErrorAction.REPLACE,
			IntStream.UNKNOWN_SOURCE_NAME);
	}
 else if (typeof charsetOrBufferSize === "number" && decodingErrorActionOrBufferSize instanceof CodingErrorAction && typeof sourceNameOrDecodingErrorAction === "string" && sourceName === undefined)
	{
const bufferSize = charsetOrBufferSize as number;
const decodingErrorAction = decodingErrorActionOrBufferSize as CodingErrorAction;
const sourceName = sourceNameOrDecodingErrorAction as string;
		return CharStreams.fromChannel(channel, StandardCharsets.UTF_8, bufferSize, decodingErrorAction, sourceName, -1);
	}
 else 
	{
let charset = charsetOrBufferSize as Charset;
let bufferSize = decodingErrorActionOrBufferSize as number;
let decodingErrorAction = sourceNameOrDecodingErrorAction as CodingErrorAction;
		try {
			let  utf8BytesIn: ByteBuffer = ByteBuffer.allocate(bufferSize);
			let  utf16CodeUnitsOut: CharBuffer = CharBuffer.allocate(bufferSize);
			if (inputSize === -1) {
				inputSize = bufferSize;
			} else { if (inputSize > java.lang.Integer.MAX_VALUE) {
				// ByteBuffer et al don't support long sizes
				throw new  java.io.IOException(string.format("inputSize %d larger than max %d", inputSize, java.lang.Integer.MAX_VALUE));
			}
}

			let  codePointBufferBuilder: CodePointBuffer.Builder = CodePointBuffer.builder(Number( inputSize));
			let  decoder: CharsetDecoder = charset
					.newDecoder()
					.onMalformedInput(decodingErrorAction)
					.onUnmappableCharacter(decodingErrorAction);

			let  endOfInput: boolean = false;
			while (!endOfInput) {
				let  bytesRead: number = channel.read(utf8BytesIn);
				endOfInput = (bytesRead === -1);
				utf8BytesIn.flip();
				let  result: CoderResult = decoder.decode(
					utf8BytesIn,
					utf16CodeUnitsOut,
					endOfInput);
				if (result.isError() && decodingErrorAction.equals(CodingErrorAction.REPORT)) {
					result.throwException();
				}
				utf16CodeUnitsOut.flip();
				codePointBufferBuilder.append(utf16CodeUnitsOut);
				utf8BytesIn.compact();
				utf16CodeUnitsOut.compact();
			}
			// Handle any bytes at the end of the file which need to
			// be represented as errors or substitution characters.
			let  flushResult: CoderResult = decoder.flush(utf16CodeUnitsOut);
			if (flushResult.isError() && decodingErrorAction.equals(CodingErrorAction.REPORT)) {
				flushResult.throwException();
			}
			utf16CodeUnitsOut.flip();
			codePointBufferBuilder.append(utf16CodeUnitsOut);

			let  codePointBuffer: CodePointBuffer = codePointBufferBuilder.build();
			return CodePointCharStream.fromBuffer(codePointBuffer, sourceName);
		}
		finally {
			channel.close();
		}
	}

}


	/**
	 * Creates a {@link CharStream} given a {@link Reader}. Closes
	 * the reader before returning.
	 */
	public static fromReader(r: Reader): CodePointCharStream;

	/**
	 * Creates a {@link CharStream} given a {@link Reader} and its
	 * source name. Closes the reader before returning.
	 */
	public static fromReader(r: Reader, sourceName: string): CodePointCharStream;


	/**
	 * Creates a {@link CharStream} given a {@link Reader}. Closes
	 * the reader before returning.
	 */
	public static fromReader(r: Reader, sourceName?: string):  CodePointCharStream {
if (sourceName === undefined) {
		return CharStreams.fromReader(r, IntStream.UNKNOWN_SOURCE_NAME);
	}
 else  {
		try {
			let  codePointBufferBuilder: CodePointBuffer.Builder = CodePointBuffer.builder(CharStreams.DEFAULT_BUFFER_SIZE);
			let  charBuffer: CharBuffer = CharBuffer.allocate(CharStreams.DEFAULT_BUFFER_SIZE);
			while ((r.read(charBuffer)) !== -1) {
				charBuffer.flip();
				codePointBufferBuilder.append(charBuffer);
				charBuffer.compact();
			}
			return CodePointCharStream.fromBuffer(codePointBufferBuilder.build(), sourceName);
		}
		finally {
			r.close();
		}
	}

}


	/**
	 * Creates a {@link CharStream} given a {@link String}.
	 */
	public static fromString(s: string): CodePointCharStream;

	/**
	 * Creates a {@link CharStream} given a {@link String} and the {@code sourceName}
	 * from which it came.
	 */
	public static fromString(s: string, sourceName: string): CodePointCharStream;


	/**
	 * Creates a {@link CharStream} given a {@link String}.
	 */
	public static fromString(s: string, sourceName?: string):  CodePointCharStream {
if (sourceName === undefined) {
		return CharStreams.fromString(s, IntStream.UNKNOWN_SOURCE_NAME);
	}
 else  {
		// Initial guess assumes no code points > U+FFFF: one code
		// point for each code unit in the string
		let  codePointBufferBuilder: CodePointBuffer.Builder = CodePointBuffer.builder(s.length);
		// TODO: CharBuffer.wrap(String) rightfully returns a read-only buffer
		// which doesn't expose its array, so we make a copy.
		let  cb: CharBuffer = CharBuffer.allocate(s.length);
		cb.put(s);
		cb.flip();
		codePointBufferBuilder.append(cb);
		return CodePointCharStream.fromBuffer(codePointBufferBuilder.build(), sourceName);
	}

}

}
