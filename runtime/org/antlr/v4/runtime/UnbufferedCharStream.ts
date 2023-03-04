/* java2ts: keep */

/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { java, JavaObject, S } from "jree";
import { CharStream } from "./CharStream";
import { IntStream } from "./IntStream";
import { Interval } from "./misc/Interval";

/**
 * Do not buffer up the entire char stream. It does keep a small buffer
 *  for efficiency and also buffers while a mark exists (set by the
 *  lookahead prediction in parser). "Unbuffered" here refers to fact
 *  that it doesn't buffer all data, not that's it's on demand loading of char.
 *
 *  Before 4.7, this class used the default environment encoding to convert
 *  bytes to UTF-16, and held the UTF-16 bytes in the buffer as chars.
 *
 *  As of 4.7, the class uses UTF-8 by default, and the buffer holds Unicode
 *  code points in the buffer as ints.
 */
export class UnbufferedCharStream extends JavaObject implements CharStream {
    /** The name or source of this char stream. */
    public name: java.lang.String | null = null;

    /**
     * A moving window buffer of the data being scanned. While there's a marker,
     * we keep adding to buffer. Otherwise, {@link #consume consume()} resets so
     * we start filling at index 0 again.
     */
    protected data: Uint32Array;

    /**
     * The number of characters currently in {@link #data data}.
     *
     * <p>This is not the buffer capacity, that's {@code data.length}.</p>
     */
    protected n = 0;

    /**
     * 0..n-1 index into {@link #data data} of next character.
     *
     * <p>The {@code LA(1)} character is {@code data[p]}. If {@code p == n}, we are
     * out of buffered characters.</p>
     */
    protected p = 0;

    /**
     * Count up with {@link #mark mark()} and down with
     * {@link #release release()}. When we {@code release()} the last mark,
     * {@code numMarkers} reaches 0 and we reset the buffer. Copy
     * {@code data[p]..data[n-1]} to {@code data[0]..data[(n-1)-p]}.
     */
    protected numMarkers = 0;

    /**
     * This is the {@code LA(-1)} character for the current position.
     */
    protected lastChar = -1;

    /**
     * When {@code numMarkers > 0}, this is the {@code LA(-1)} character for the
     * first character in {@link #data data}. Otherwise, this is unspecified.
     */
    protected lastCharBufferStart = 0;

    /**
     * Absolute character index. It's the index of the character about to be
     * read via {@code LA(1)}. Goes from 0 to the number of characters in the
     * entire stream, although the stream size is unknown before the end is
     * reached.
     */
    protected currentCharIndex = 0;

    protected input: java.io.Reader | null = null;

    /** Useful for subclasses that pull char from other than this.input. */
    public constructor();
    public constructor(bufferSize: number);
    public constructor(input: java.io.InputStream);
    public constructor(input: java.io.Reader);
    public constructor(input: java.io.InputStream, bufferSize: number);
    public constructor(input: java.io.Reader, bufferSize: number);
    public constructor(input: java.io.InputStream, bufferSize: number, charset: java.nio.charset.Charset);
    public constructor(...args: unknown[]) {
        super();

        switch (args.length) {
            case 0: {
                this.n = 0;
                this.data = new Uint32Array(256);

                break;
            }

            case 1: {
                if (typeof args[0] === "number") {
                    this.n = 0;
                    this.data = new Uint32Array(args[0]);
                } else if (args[0] instanceof java.io.InputStream) {
                    const [input] = args as [java.io.InputStream];
                    this.data = new Uint32Array(256);
                    this.input = new java.io.InputStreamReader(input, java.nio.charset.StandardCharsets.UTF_8);
                    this.fill(1); // prime
                } else {
                    const [input] = args as [java.io.Reader];
                    this.data = new Uint32Array(256);
                    this.input = input;
                    this.fill(1); // prime
                }

                break;
            }

            case 2: {
                if (args[0] instanceof java.io.InputStream) {
                    const [input, bufferSize] = args as [java.io.InputStream, number];
                    this.data = new Uint32Array(bufferSize);
                    this.input = new java.io.InputStreamReader(input, java.nio.charset.StandardCharsets.UTF_8);
                    this.fill(1); // prime
                } else {
                    const [input, bufferSize] = args as [java.io.Reader, number];
                    this.data = new Uint32Array(bufferSize);
                    this.input = input;
                    this.fill(1); // prime
                }

                break;
            }
            case 3: {
                const [input, bufferSize, charset] = args as [java.io.InputStream, number, java.nio.charset.Charset];

                this.data = new Uint32Array(bufferSize);
                this.input = new java.io.InputStreamReader(input, charset);
                this.fill(1); // prime

                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }

    public consume = (): void => {
        if (this.LA(1) === IntStream.EOF) {
            throw new java.lang.IllegalStateException(S`cannot consume EOF`);
        }

        // buf always has at least data[p==0] in this method due to ctor
        this.lastChar = this.data[this.p];   // track last char for LA(-1)

        if (this.p === this.n - 1 && this.numMarkers === 0) {
            this.n = 0;
            this.p = -1; // p++ will leave this at 0
            this.lastCharBufferStart = this.lastChar;
        }

        this.p++;
        this.currentCharIndex++;
        this.sync(1);
    };

    // eslint-disable-next-line @typescript-eslint/naming-convention
    public LA = (i: number): number => {
        if (i === -1) {
            return this.lastChar;
        }
        // special case
        this.sync(i);
        const index: number = this.p + i - 1;
        if (index < 0) {
            throw new java.lang.IndexOutOfBoundsException();
        }

        if (index >= this.n) {
            return IntStream.EOF;
        }

        return this.data[index];
    };

    /**
     * Return a marker that we can release later.
     *
     * <p>The specific marker value used for this class allows for some level of
     * protection against misuse where {@code seek()} is called on a mark or
     * {@code release()} is called in the wrong order.</p>
     *
     * @returns A marker value that should be passed to {@link #release}.
     */
    public mark = (): number => {
        if (this.numMarkers === 0) {
            this.lastCharBufferStart = this.lastChar;
        }

        const mark: number = -this.numMarkers - 1;
        this.numMarkers++;

        return mark;
    };

    /**
     * Decrement number of markers, resetting buffer if we hit 0.
     *
     * @param marker The marker returned by a call to {@link #mark}.
     */
    public release = (marker: number): void => {
        const expectedMark: number = -this.numMarkers;
        if (marker !== expectedMark) {
            throw new java.lang.IllegalStateException(S`release() called with an invalid marker.`);
        }

        this.numMarkers--;
        if (this.numMarkers === 0 && this.p > 0) { // release buffer when we can, but don't do unnecessary work
            // Copy data[p]..data[n-1] to data[0]..data[(n-1)-p], reset pointers.
            // p is last valid char; move nothing if p==n as we have no valid char
            this.data.copyWithin(0, this.p, this.n - this.p); // shift n-p char from p to 0
            this.n = this.n - this.p;
            this.p = 0;
            this.lastCharBufferStart = this.lastChar;
        }
    };

    public index = (): number => {
        return this.currentCharIndex;
    };

    /**
     * Seek to absolute character index, which might not be in the current
     *  sliding window.  Move {@code p} to {@code index-bufferStartIndex}.
     *
     * @param index The absolute character index to seek to.
     */
    public seek = (index: number): void => {
        if (index === this.currentCharIndex) {
            return;
        }

        if (index > this.currentCharIndex) {
            this.sync(index - this.currentCharIndex);
            index = Math.min(index, this.getBufferStartIndex() + this.n - 1);
        }

        // index == to bufferStartIndex should set p to 0
        const i: number = index - this.getBufferStartIndex();
        if (i < 0) {
            throw new java.lang.IllegalArgumentException(S`cannot seek to negative index ${index}`);
        }
        else {
            if (i >= this.n) {
                const text = `seek to index outside buffer: ${index} not in ${this.getBufferStartIndex()}..` +
                    `${(this.getBufferStartIndex() + this.n)}`;
                throw new java.lang.UnsupportedOperationException(S`${text}`);
            }
        }

        this.p = i;
        this.currentCharIndex = index;
        if (this.p === 0) {
            this.lastChar = this.lastCharBufferStart;
        }
        else {
            this.lastChar = this.data[this.p - 1];
        }
    };

    public size = (): number => {
        throw new java.lang.UnsupportedOperationException(S`Unbuffered stream cannot know its size`);
    };

    public getSourceName = (): java.lang.String => {
        if (this.name === null || this.name.isEmpty()) {
            return IntStream.UNKNOWN_SOURCE_NAME;
        }

        return this.name;
    };

    public getText = (interval: Interval): java.lang.String => {
        if (interval.a < 0 || interval.b < interval.a - 1) {
            throw new java.lang.IllegalArgumentException(S`invalid interval`);
        }

        const bufferStartIndex: number = this.getBufferStartIndex();
        if (this.n > 0 && this.data[this.n - 1] === java.lang.Character.MAX_VALUE) {
            if (interval.a + interval.length() > bufferStartIndex + this.n) {
                throw new java.lang.IllegalArgumentException(S`the interval extends past the end of the stream`);
            }
        }

        if (interval.a < bufferStartIndex || interval.b >= bufferStartIndex + this.n) {
            const text = `interval${interval} outside buffer: ${bufferStartIndex}..${(bufferStartIndex + this.n - 1)}`;
            throw new java.lang.UnsupportedOperationException(S`${text}`);
        }

        // convert from absolute to local index
        const i = interval.a - bufferStartIndex;

        return new java.lang.String(this.data, i, interval.length());
    };

    public toString: () => java.lang.JavaString = () => {
        return new java.lang.String(super.toString());
    };

    /**
     * Make sure we have 'need' elements from current position {@link #p p}.
     * Last valid {@code p} index is {@code data.length-1}. {@code p+need-1} is
     * the char index 'need' elements ahead. If we need 1 element,
     * {@code (p+1-1)==p} must be less than {@code data.length}.
     *
     * @param want The minimum number of elements remaining in the buffer.
     */
    protected sync = (want: number): void => {
        const need: number = (this.p + want - 1) - this.n + 1; // how many more elements we need?
        if (need > 0) {
            this.fill(need);
        }
    };

    /**
     * Add {@code n} characters to the buffer. Returns the number of characters
     * actually added to the buffer. If the return value is less than {@code n},
     * then EOF was reached before {@code n} characters could be added.
     *
     * @param n The number of characters to add.
     *
     * @returns The actual number of characters added to the buffer.
     */
    protected fill = (n: number): number => {
        for (let i = 0; i < n; i++) {
            if (this.n > 0 && this.data[this.n - 1] === IntStream.EOF) {
                return i;
            }

            try {
                const c: number = this.nextChar();
                if (c > java.lang.Character.MAX_VALUE || c === IntStream.EOF) {
                    this.add(c);
                } else {
                    const ch: java.lang.char = c;
                    if (java.lang.Character.isLowSurrogate(ch)) {
                        throw new java.lang.RuntimeException(
                            S`Invalid UTF - 16(low surrogate with no preceding high surrogate)`);
                    } else {
                        if (java.lang.Character.isHighSurrogate(ch)) {
                            const lowSurrogate: number = this.nextChar();
                            if (lowSurrogate > java.lang.Character.MAX_VALUE) {
                                throw new java.lang.RuntimeException(
                                    S`Invalid UTF - 16(high surrogate followed by code point > U + FFFF`);
                            } else {
                                if (lowSurrogate === IntStream.EOF) {
                                    throw new java.lang.RuntimeException(
                                        S`Invalid UTF - 16(dangling high surrogate at end of file)`);
                                } else {
                                    const lowSurrogateChar: java.lang.char = lowSurrogate;
                                    if (java.lang.Character.isLowSurrogate(lowSurrogateChar)) {
                                        this.add(java.lang.Character.toCodePoint(ch, lowSurrogateChar));
                                    } else {
                                        throw new java.lang.RuntimeException(
                                            S`Invalid UTF - 16(dangling high surrogate`);
                                    }
                                }
                            }

                        }
                        else {
                            this.add(c);
                        }
                    }

                }
            } catch (ioe) {
                if (ioe instanceof java.io.IOException) {
                    throw new java.lang.RuntimeException(ioe);
                } else {
                    throw ioe;
                }
            }
        }

        return n;
    };

    /**
     * Override to provide different source of characters than
     * {@link #input input}.
     *
     * @returns The next character from the input stream, or -1 if the end of
     */
    protected nextChar = (): number => {
        return this.input!.read();
    };

    protected add = (c: number): void => {
        if (this.n >= this.data.length) {
            this.data = java.util.Arrays.copyOf(this.data, this.data.length * 2);
        }
        this.data[this.n++] = c;
    };

    protected readonly getBufferStartIndex = (): number => {
        return this.currentCharIndex - this.p;
    };
}
