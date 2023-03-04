/* java2ts: keep */

/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { java, JavaObject, closeResources, handleResourceError, throwResourceError, S } from "jree";
import { CharStream } from "./CharStream";
import { CodePointBuffer } from "./CodePointBuffer";
import { CodePointCharStream } from "./CodePointCharStream";
import { IntStream } from "./IntStream";

// cspell: ignore myinputfile, megamorphic, spelunking, bhamiltoncx

/**
 * This class represents the primary interface for creating {@link CharStream}s
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
 */
export class CharStreams extends JavaObject {
    private static readonly DEFAULT_BUFFER_SIZE: number = 4096;

    // Utility class; do not construct.
    private constructor() {
        super();
    }

    /**
     * Creates a {@link CharStream} given a path to a UTF-8
     * encoded file on disk.
     *
     * Reads the entire contents of the file into the result before returning.
     */
    public static fromPath(path: java.nio.file.Path | null): CharStream;
    /**
     * Creates a {@link CharStream} given a path to a file on disk and the
     * charset of the bytes contained in the file.
     *
     * Reads the entire contents of the file into the result before returning.
     */
    public static fromPath(path: java.nio.file.Path, charset: java.nio.charset.Charset | null): CharStream;
    public static fromPath(...args: unknown[]): CharStream | undefined {
        switch (args.length) {
            case 1: {
                const [path] = args as [java.nio.file.Path];

                return CharStreams.fromPath(path, java.nio.charset.StandardCharsets.UTF_8);
            }

            case 2: {
                const [path, charset] = args as [java.nio.file.Path, java.nio.charset.Charset];
                const size = java.nio.file.Files.size(path);

                // This holds the final error to throw (if any).
                let error: java.lang.Throwable | undefined;

                const channel = java.nio.file.Files.newByteChannel(path);
                try {
                    try {
                        return CharStreams.fromChannel(
                            channel,
                            charset,
                            CharStreams.DEFAULT_BUFFER_SIZE,
                            java.nio.charset.CodingErrorAction.REPLACE,
                            S`${path.toString()}`,
                            size);
                    } finally {
                        error = closeResources([channel]);
                    }
                } catch (e) {
                    error = handleResourceError(e, error);
                } finally {
                    throwResourceError(error);
                }

                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }

    /**
     * Creates a {@link CharStream} given a string containing a
     * path to a UTF-8 file on disk.
     *
     * Reads the entire contents of the file into the result before returning.
     */
    public static fromFileName(fileName: java.lang.String | null): CharStream | null;
    /**
     * Creates a {@link CharStream} given a string containing a
     * path to a file on disk and the charset of the bytes
     * contained in the file.
     *
     * Reads the entire contents of the file into the result before returning.
     */
    public static fromFileName(fileName: java.lang.String | null,
        charset: java.nio.charset.Charset | null): CharStream | null;
    public static fromFileName(...args: unknown[]): CharStream | null {
        switch (args.length) {
            case 1: {
                const [fileName] = args as [java.lang.String];

                return CharStreams.fromPath(java.nio.file.Paths.get(fileName), java.nio.charset.StandardCharsets.UTF_8);
            }

            case 2: {
                const [fileName, charset] = args as [java.lang.String, java.nio.charset.Charset];

                return CharStreams.fromPath(java.nio.file.Paths.get(fileName), charset);
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }

    /**
     * Creates a {@link CharStream} given an opened {@link InputStream}
     * containing UTF-8 bytes.
     *
     * Reads the entire contents of the {@code InputStream} into
     * the result before returning, then closes the {@code InputStream}.
     */
    public static fromStream(is: java.io.InputStream | null): CharStream;
    /**
     * Creates a {@link CharStream} given an opened {@link InputStream} and the
     * charset of the bytes contained in the stream.
     *
     * Reads the entire contents of the {@code InputStream} into
     * the result before returning, then closes the {@code InputStream}.
     */
    public static fromStream(is: java.io.InputStream, charset: java.nio.charset.Charset): CharStream;
    public static fromStream(is: java.io.InputStream, charset: java.nio.charset.Charset,
        inputSize: bigint): CharStream;
    public static fromStream(...args: unknown[]): CharStream | undefined { // Not really undefined, but may throw.
        switch (args.length) {
            case 1: {
                const [is] = args as [java.io.InputStream];

                return CharStreams.fromStream(is, java.nio.charset.StandardCharsets.UTF_8);
            }

            case 2: {
                const [is, charset] = args as [java.io.InputStream, java.nio.charset.Charset];

                return CharStreams.fromStream(is, charset, -1n);
            }

            case 3: {
                const [is, charset, inputSize] = args as [java.io.InputStream, java.nio.charset.Charset, bigint];
                // This holds the final error to throw (if any).
                let error: java.lang.Throwable | undefined;

                const channel = java.nio.channels.Channels.newChannel(is);
                try {
                    try {
                        return CharStreams.fromChannel(
                            channel,
                            charset,
                            CharStreams.DEFAULT_BUFFER_SIZE,
                            java.nio.charset.CodingErrorAction.REPLACE,
                            IntStream.UNKNOWN_SOURCE_NAME,
                            inputSize);
                    } finally {
                        error = closeResources([channel]);
                    }
                } catch (e) {
                    error = handleResourceError(e, error);
                } finally {
                    throwResourceError(error);
                }

                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
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
    public static fromChannel(channel: java.nio.channels.ReadableByteChannel): CharStream;
    /**
     * Creates a {@link CharStream} given an opened {@link ReadableByteChannel} and the
     * charset of the bytes contained in the channel.
     *
     * Reads the entire contents of the {@code channel} into
     * the result before returning, then closes the {@code channel}.
     */
    public static fromChannel(channel: java.nio.channels.ReadableByteChannel,
        charset: java.nio.charset.Charset): CharStream;
    /**
     * Creates a {@link CharStream} given an opened {@link ReadableByteChannel}
     * containing UTF-8 bytes.
     *
     * Reads the entire contents of the {@code channel} into
     * the result before returning, then closes the {@code channel}.
     */
    public static fromChannel(
        channel: java.nio.channels.ReadableByteChannel,
        bufferSize: number,
        decodingErrorAction: java.nio.charset.CodingErrorAction,
        sourceName: java.lang.String): CodePointCharStream;
    public static fromChannel(
        channel: java.nio.channels.ReadableByteChannel,
        charset: java.nio.charset.Charset,
        bufferSize: number,
        decodingErrorAction: java.nio.charset.CodingErrorAction,
        sourceName: java.lang.String,
        inputSize: bigint): CodePointCharStream;
    public static fromChannel(...args: unknown[]): CharStream | CodePointCharStream {
        switch (args.length) {
            case 1: {
                const [channel] = args as [java.nio.channels.ReadableByteChannel];

                return CharStreams.fromChannel(channel, java.nio.charset.StandardCharsets.UTF_8);
            }

            case 2: {
                const [channel, _] = args as [java.nio.channels.ReadableByteChannel, java.nio.charset.Charset];

                return CharStreams.fromChannel(
                    channel,
                    CharStreams.DEFAULT_BUFFER_SIZE,
                    java.nio.charset.CodingErrorAction.REPLACE,
                    IntStream.UNKNOWN_SOURCE_NAME,
                );
            }

            case 4: {
                const [channel, bufferSize, decodingErrorAction, sourceName] =
                    args as [java.nio.channels.ReadableByteChannel, number, java.nio.charset.CodingErrorAction,
                        java.lang.String];

                return CharStreams.fromChannel(channel, java.nio.charset.StandardCharsets.UTF_8, bufferSize,
                    decodingErrorAction, sourceName, -1n);
            }

            case 6: {
                const [channel, charset, bufferSize, decodingErrorAction, sourceName, inputSize] =
                    args as [java.nio.channels.ReadableByteChannel, java.nio.charset.Charset, number,
                        java.nio.charset.CodingErrorAction, java.lang.String, bigint];

                try {
                    const utf8BytesIn = java.nio.ByteBuffer.allocate(bufferSize);
                    const utf16CodeUnitsOut = java.nio.CharBuffer.allocate(bufferSize);
                    let size = inputSize;
                    if (inputSize === -1n) {
                        size = BigInt(bufferSize);
                    } else {
                        if (inputSize > java.lang.Integer.MAX_VALUE) {
                            // ByteBuffer et al don't support long sizes
                            throw new java.io.IOException(java.lang.String.format(S`inputSize %d larger than max %d`,
                                inputSize, java.lang.Integer.MAX_VALUE));
                        }
                    }

                    const codePointBufferBuilder: CodePointBuffer.Builder = CodePointBuffer.builder(Number(size));
                    const decoder = charset
                        .newDecoder()
                        .onMalformedInput(decodingErrorAction)
                        .onUnmappableCharacter(decodingErrorAction);

                    let endOfInput = false;
                    while (!endOfInput) {
                        const bytesRead: number = channel.read(utf8BytesIn);
                        endOfInput = (bytesRead === -1);
                        utf8BytesIn.flip();
                        const result = decoder.decode(
                            utf8BytesIn,
                            utf16CodeUnitsOut,
                            endOfInput);
                        if (result.isError() && decodingErrorAction.equals(java.nio.charset.CodingErrorAction.REPORT)) {
                            result.throwException();
                        }
                        utf16CodeUnitsOut.flip();
                        codePointBufferBuilder.append(utf16CodeUnitsOut);
                        utf8BytesIn.compact();
                        utf16CodeUnitsOut.compact();
                    }
                    // Handle any bytes at the end of the file which need to
                    // be represented as errors or substitution characters.
                    const flushResult: java.nio.charset.CoderResult = decoder.flush(utf16CodeUnitsOut);
                    if (flushResult.isError() &&
                        decodingErrorAction.equals(java.nio.charset.CodingErrorAction.REPORT)) {
                        flushResult.throwException();
                    }
                    utf16CodeUnitsOut.flip();
                    codePointBufferBuilder.append(utf16CodeUnitsOut);

                    const codePointBuffer = codePointBufferBuilder.build();

                    return CodePointCharStream.fromBuffer(codePointBuffer, sourceName);
                }
                finally {
                    channel.close();
                }
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }

    /**
     * Creates a {@link CharStream} given a {@link Reader}. Closes
     * the reader before returning.
     */
    public static fromReader(r: java.io.Reader): CodePointCharStream;
    /**
     * Creates a {@link CharStream} given a {@link Reader} and its
     * source name. Closes the reader before returning.
     */
    public static fromReader(r: java.io.Reader, sourceName: java.lang.String): CodePointCharStream;
    public static fromReader(...args: unknown[]): CodePointCharStream {
        switch (args.length) {
            case 1: {
                const [r] = args as [java.io.Reader];

                return CharStreams.fromReader(r, IntStream.UNKNOWN_SOURCE_NAME);
            }

            case 2: {
                const [r, sourceName] = args as [java.io.Reader, java.lang.String];

                try {
                    const codePointBufferBuilder = CodePointBuffer.builder(CharStreams.DEFAULT_BUFFER_SIZE);
                    const charBuffer = java.nio.CharBuffer.allocate(CharStreams.DEFAULT_BUFFER_SIZE);
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

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }

    /**
     * Creates a {@link CharStream} given a {@link String}.
     */
    public static fromString(s: java.lang.String): CodePointCharStream;
    /**
     * Creates a {@link CharStream} given a {@link String} and the {@code sourceName}
     * from which it came.
     */
    public static fromString(s: java.lang.String, sourceName: java.lang.String): CodePointCharStream;
    public static fromString(...args: unknown[]): CodePointCharStream | null {
        switch (args.length) {
            case 1: {
                const [s] = args as [java.lang.String];

                return CharStreams.fromString(s, IntStream.UNKNOWN_SOURCE_NAME);
            }

            case 2: {
                const [s, sourceName] = args as [java.lang.String, java.lang.String];

                // Initial guess assumes no code points > U+FFFF: one code
                // point for each code unit in the string
                const codePointBufferBuilder: CodePointBuffer.Builder = CodePointBuffer.builder(s.length());

                // TODO: CharBuffer.wrap(String) rightfully returns a read-only buffer
                // which doesn't expose its array, so we make a copy.
                const cb = java.nio.CharBuffer.allocate(s.length());
                cb.put(s);
                cb.flip();
                codePointBufferBuilder.append(cb);

                return CodePointCharStream.fromBuffer(codePointBufferBuilder.build(), sourceName);
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }
}
