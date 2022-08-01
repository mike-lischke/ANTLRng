/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

/* eslint-disable @typescript-eslint/unified-signatures */

import { CharSequence, CodePoint, IllegalArgumentException, IndexOutOfBoundsException, System } from "../lang";
import { IOException } from "./IOException";
import { Writer } from "./Writer";

export class BufferedWriter extends Writer {

    private static readonly defaultCharBufferSize = 8192;

    private out?: Writer;

    private cb: Uint32Array;
    private nChars: CodePoint;
    private nextChar: CodePoint;

    /**
     * Creates a new buffered character-output stream that uses an output
     * buffer of the given size.
     *
     * @param  out  A Writer
     * @param  sz   Output-buffer size, a positive integer
     *
     * @throws     IllegalArgumentException  If {@code sz <= 0}
     */
    public constructor(out: Writer, sz = BufferedWriter.defaultCharBufferSize) {
        super(out);
        if (sz <= 0) {
            throw new IllegalArgumentException("Buffer size <= 0");
        }

        this.cb = new Uint32Array(sz);
        this.nChars = sz;
        this.nextChar = 0;
    }

    /**
     * Flushes the output buffer to the underlying character stream, without
     * flushing the stream itself.  This method is non-private only so that it
     * may be invoked by PrintStream.
     */
    public flushBuffer(): void {
        // synchronized(lock) {
        this.ensureOpen();
        if (this.nextChar === 0) {
            return;
        }

        this.out.write(this.cb, 0, this.nextChar);
        this.nextChar = 0;
        // }
    }

    /**
     * Writes a single character.
     *
     * @param c
     * @throws     IOException  If an I/O error occurs
     */
    public write(c: CodePoint): void;
    public write(buffer: Uint32Array): void;
    /**
     * Writes a portion of an array of characters.
     *
     * <p> Ordinarily this method stores characters from the given array into
     * this stream's buffer, flushing the buffer to the underlying stream as
     * needed.  If the requested length is at least as large as the buffer,
     * however, then this method will flush the buffer and write the characters
     * directly to the underlying stream.  Thus redundant
     * {@code BufferedWriter}s will not copy data unnecessarily.
     *
     * @param  buffer  A character array
     * @param  offset   Offset from which to start reading characters
     * @param  len   Number of characters to write
     *
     * @param offset
     * @param length
     * @throws  IndexOutOfBoundsException
     *          If {@code off} is negative, or {@code len} is negative,
     *          or {@code offset + len} is negative or greater than the length
     *          of the given array
     *
     * @throws  IOException  If an I/O error occurs
     */
    public write(buffer: Uint32Array, offset: number, length: number): void;
    public write(s: string): void;
    /**
     * Writes a portion of a String.
     *
     * @param  s     String to be written
     * @param  offset   Offset from which to start reading characters
     * @param  length   Number of characters to be written
     *
     * @throws  IndexOutOfBoundsException
     *          If {@code offset} is negative,
     *          or {@code offset + len} is greater than the length
     *          of the given string
     *
     * @throws  IOException  If an I/O error occurs
     */
    public write(s: string, offset: number, length: number): void;
    public write(cOrBufferOrS: CodePoint | Uint32Array | string, offset?: number, length?: number): void {
        this.ensureOpen();
        if (typeof cOrBufferOrS === "number") {
            if (this.nextChar >= this.nChars) {
                this.flushBuffer();
            }
            this.cb[this.nextChar++] = cOrBufferOrS;
        } else {
            if ((offset < 0) || (length < 0) || (offset + length > cOrBufferOrS.length)) {
                throw new IndexOutOfBoundsException();
            } else if (length === 0) {
                return;
            }

            offset ??= 0;
            if (cOrBufferOrS instanceof Uint32Array) {
                length ??= cOrBufferOrS.length;

                if (length >= this.nChars) {
                    /* If the request length exceeds the size of the output buffer,
                       flush the buffer and then write the data directly.  In this
                       way buffered streams will cascade harmlessly. */
                    this.flushBuffer();
                    this.out.write(cOrBufferOrS, offset, length);

                    return;
                }

                let b = offset;
                const t = offset + length;
                while (b < t) {
                    const d = Math.min(this.nChars - this.nextChar, t - b);
                    this.cb.set(cOrBufferOrS.subarray(b, b + d));
                    b += d;
                    this.nextChar += d;
                    if (this.nextChar >= this.nChars) {
                        this.flushBuffer();
                    }
                }
            } else {
                length ??= cOrBufferOrS.length;

                let b = offset;
                const t = offset + length;
                while (b < t) {
                    const d = Math.min(this.nChars - this.nextChar, t - b);
                    for (const c of cOrBufferOrS.substring(b, b + d)) {
                        this.cb[this.nextChar++] = c.codePointAt(0);
                    }

                    b += d;
                    if (this.nextChar >= this.nChars) {
                        this.flushBuffer();
                    }
                }
            }
        }
    }

    public append(c: CodePoint): this;
    public append(csq: CharSequence): this;
    public append(csq: CharSequence, start: number, end: number): this;
    public append(cOrCsq: CodePoint | CharSequence, start?: number, end?: number): this {
        if (typeof cOrCsq === "number") {
            this.write(cOrCsq);
        } else {
            start ??= 0;
            end ??= cOrCsq.length();

            this.write(cOrCsq.subSequence(start, end).toString());
        }

        return this;
    }

    /**
     * Writes a line separator.  The line separator string is defined by the
     * system property {@code line.separator}, and is not necessarily a single
     * newline ('\n') character.
     *
     * @throws     IOException  If an I/O error occurs
     */
    public newLine(): void {
        this.write(System.lineSeparator());
    }

    /**
     * Flushes the stream.
     *
     * @throws     IOException  If an I/O error occurs
     */
    public flush(): void {
        // synchronized(lock) {
        this.flushBuffer();
        this.out.flush();
        // }
    }

    public close(): void {
        // synchronized(lock) {
        if (this.out === undefined) {
            return;
        }

        try {
            this.flushBuffer();
        } finally {
            this.out.close();
            this.out = undefined;
            this.cb = undefined;
        }
        // }
    }

    /** Checks to make sure that the stream has not been closed */
    private ensureOpen(): void {
        if (this.out === undefined) {
            throw new IOException("Stream closed");
        }
    }

}
