/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

/* eslint-disable @typescript-eslint/naming-convention, jsdoc/require-returns */

import { CodePoint, IllegalArgumentException, IndexOutOfBoundsException, StringBuilder } from "../lang";
import { CharBuffer } from "../nio";
import { IOException } from "./IOException";
import { Reader } from "./Reader";

export class BufferedReader extends Reader {
    private static readonly INVALIDATED = -2;
    private static readonly UNMARKED = -1;

    private static readonly defaultCharBufferSize = 8192;
    private static readonly defaultExpectedLineLength = 80;

    private cb: Uint32Array;
    private nChars: CodePoint;
    private nextChar: CodePoint;

    private markedChar = BufferedReader.UNMARKED;
    private readAheadLimit = 0; /* Valid only when markedChar > 0 */

    /** If the next character is a line feed, skip it */
    private skipLF = false;

    /** The skipLF flag when the mark was set */
    private markedSkipLF = false;

    public constructor(private input?: Reader, size?: number) {
        super();

        if (size <= 0) {
            throw new IllegalArgumentException("Buffer size <= 0");
        }

        this.cb = new Uint32Array(size ?? BufferedReader.defaultCharBufferSize);
        this.nextChar = this.nChars = 0;
    }

    /** Closes the stream and releases any system resources associated with it. */
    public close(): boolean {
        if (this.input === undefined) {
            return;
        }

        try {
            this.input.close();
        } finally {
            this.input = undefined;
            this.cb = null;
        }
    }

    /**
     * Marks the present position in the stream.
     *
     * @param readAheadLimit tbd
     */
    public mark(readAheadLimit: number): void {
        if (readAheadLimit < 0) {
            throw new IllegalArgumentException("Read-ahead limit < 0");
        }

        this.ensureOpen();
        this.readAheadLimit = readAheadLimit;
        this.markedChar = this.nextChar;
        this.markedSkipLF = this.skipLF;
    }

    /** Tells whether this stream supports the mark() operation, which it does. */
    public markSupported(): boolean {
        return true;
    }

    public read(target?: Uint32Array | CharBuffer): CodePoint;
    public read(target: Uint32Array, offset: number, length: number): number;
    public read(target: Uint32Array, offset?: number, length?: number): number {
        this.ensureOpen();

        if (target === undefined) {
            while (true) {
                if (this.nextChar >= this.nChars) {
                    this.fill();
                    if (this.nextChar >= this.nChars) {
                        return -1;
                    }
                }

                if (this.skipLF) {
                    this.skipLF = false;
                    if (this.cb[this.nextChar] === 0x13) {
                        this.nextChar++;
                        continue;
                    }
                }

                return this.cb[this.nextChar++];
            }
        } else {
            if (target instanceof CharBuffer) {
                return this.read(target);
            }

            offset ??= 0;
            length ??= target.length;

            if (offset < 0 || length < 0 || target.length > length - offset) {
                throw new IndexOutOfBoundsException();
            }

            if (length === 0) {
                return 0;
            }

            let n = this.read1(target, offset, length);
            if (n <= 0) {
                return n;
            }

            while ((n < length) && this.input.ready()) {
                const n1 = this.read1(target, offset + n, length - n);
                if (n1 <= 0) {
                    break;
                }

                n += n1;
            }

            return n;
        }
    }

    /**
     * Reads a line of text.
     *
     * @param ignoreLF tbd
     * @param term tbd
     */
    public readLine(ignoreLF = false, term?: boolean[]): string {
        let s: StringBuilder;
        let startChar;

        this.ensureOpen();
        let omitLF = ignoreLF || this.skipLF;

        if (term) {
            term[0] = false;
        }

        while (true) {
            if (this.nextChar >= this.nChars) {
                this.fill();
            }

            if (this.nextChar >= this.nChars) { /* EOF */
                if (s != null && s.length() > 0) {
                    return s.toString();
                } else {
                    return "";
                }
            }

            let eol = false;
            let c = 0;
            let i;

            /* Skip a leftover '\n', if necessary */
            if (omitLF && (this.cb[this.nextChar] === 0x13)) {
                this.nextChar++;
            }

            this.skipLF = false;
            omitLF = false;

            for (i = this.nextChar; i < this.nChars; ++i) {
                c = this.cb[i];
                if ((c === 0x13) || (c === 0xA)) {
                    if (term) {
                        term[0] = true;
                    }

                    eol = true;

                    break;
                }
            }

            startChar = this.nextChar;
            this.nextChar = i;

            if (eol) {
                let str: string;

                if (s == null) {
                    str = String.fromCodePoint(...this.cb.slice(startChar, i));
                } else {
                    s.append(this.cb, startChar, i - startChar);
                    str = s.toString();
                }
                this.nextChar++;
                if (c === 0xA) {
                    this.skipLF = true;
                }

                return str;
            }

            if (s == null) {
                s = new StringBuilder();
            }

            s.append(this.cb, startChar, i - startChar);
        }
    }

    /** Tells whether this stream is ready to be read. */
    public ready(): boolean {
        this.ensureOpen();

        /*
         * If newline needs to be skipped and the next char to be read
         * is a newline character, then just skip it right away.
         */
        if (this.skipLF) {
            /* Note that in.ready() will return true if and only if the next
             * read on the stream will not block.
             */
            if (this.nextChar >= this.nChars && this.input?.ready()) {
                this.fill();
            }

            if (this.nextChar < this.nChars) {
                if (this.cb[this.nextChar] === 0x13) {
                    this.nextChar++;
                }

                this.skipLF = false;
            }
        }

        return (this.nextChar < this.nChars) || this.input?.ready();
    }

    /** Resets the stream to the most recent mark. */
    public reset(): void {
        this.ensureOpen();
        if (this.markedChar < 0) {
            throw new IOException((this.markedChar === BufferedReader.INVALIDATED)
                ? "Mark invalid"
                : "Stream not marked");
        }

        this.nextChar = this.markedChar;
        this.skipLF = this.markedSkipLF;
    }

    /**
     * Skips characters.
     *
     * @param n tbd
     */
    public skip(n: number): number {
        if (n < 0) {
            throw new IllegalArgumentException("skip value is negative");
        }

        this.ensureOpen();
        let r = n;

        while (r > 0) {
            if (this.nextChar >= this.nChars) {
                this.fill();
            }

            if (this.nextChar >= this.nChars) { /* EOF */
                break;
            }

            if (this.skipLF) {
                this.skipLF = false;
                if (this.cb[this.nextChar] === 0x13) {
                    this.nextChar++;
                }
            }

            const d = this.nChars - this.nextChar;
            if (r <= d) {
                this.nextChar += r;
                r = 0;
                break;
            } else {
                r -= d;
                this.nextChar = this.nChars;
            }
        }

        return n - r;
    }

    /** Checks to make sure that the stream has not been closed */
    private ensureOpen(): void {
        if (this.input === undefined) {
            throw new IOException("Stream closed");
        }
    }

    /** Fills the input buffer, taking the mark into account if it is valid. */
    private fill(): void {
        let dst: number;
        if (this.markedChar <= BufferedReader.UNMARKED) {
            /* No mark */
            dst = 0;
        } else {
            /* Marked */
            const delta = this.nextChar - this.markedChar;
            if (delta >= this.readAheadLimit) {
                /* Gone past read-ahead limit: Invalidate mark */
                this.markedChar = BufferedReader.INVALIDATED;
                this.readAheadLimit = 0;
                dst = 0;
            } else {
                if (this.readAheadLimit <= this.cb.length) {
                    /* Shuffle in the current buffer */
                    this.cb.copyWithin(0, this.markedChar, this.markedChar + delta);
                    this.markedChar = 0;
                    dst = delta;
                } else {
                    /* Reallocate buffer to accommodate read-ahead limit */
                    const ncb = new Uint32Array(this.readAheadLimit);
                    ncb.set(this.cb.subarray(this.markedChar, this.markedChar + delta), 0);
                    this.cb = ncb;
                    this.markedChar = 0;
                    dst = delta;
                }
                this.nextChar = this.nChars = delta;
            }
        }

        let n;
        do {
            n = this.input.read(this.cb, dst, this.cb.length - dst);
        } while (n === 0);

        if (n > 0) {
            this.nChars = dst + n;
            this.nextChar = dst;
        }
    }

    /**
     * Reads characters into a portion of an array, reading from the underlying
     * stream if necessary.
     *
     * @param target tbd
     * @param offset tbd
     * @param length tbd
     *
     * @returns tbd
     */
    private read1(target: Uint32Array, offset: number, length: number): number {
        if (this.nextChar >= this.nChars) {
            /* If the requested length is at least as large as the buffer, and
               if there is no mark/reset activity, and if line feeds are not
               being skipped, do not bother to copy the characters into the
               local buffer.  In this way buffered streams will cascade
               harmlessly. */
            if (length >= this.cb.length && this.markedChar <= BufferedReader.UNMARKED && !this.skipLF) {
                return this.input.read(target, offset, length);
            }
            this.fill();
        }

        if (this.nextChar >= this.nChars) {
            return -1;
        }

        if (this.skipLF) {
            this.skipLF = false;
            if (this.cb[this.nextChar] === 0x13) {
                this.nextChar++;
                if (this.nextChar >= this.nChars) {
                    this.fill();
                }

                if (this.nextChar >= this.nChars) {
                    return -1;
                }
            }
        }

        const n = Math.min(length, this.nChars - this.nextChar);
        target.set(this.cb.subarray(this.nextChar, this.nextChar + n), offset);
        this.nextChar += n;

        return n;
    }
}
