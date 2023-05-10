/* java2ts: keep */

/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/* eslint-disable @typescript-eslint/naming-convention */

import { JavaObject, java, S } from "jree";
import { CharStream } from "./CharStream";
import { IntStream } from "./IntStream";
import { Interval } from "./misc/Interval";

/**
 * Vacuum all input from a {@link Reader}/{@link InputStream} and then treat it
 * like a {@code char[]} buffer. Can also pass in a {@link String} or
 * {@code char[]} to use.
 *
 * <p>If you need encoding, pass in stream/reader with correct encoding.</p>
 *
 * @deprecated as of 4.7 Please use {@link CharStreams} interface.
 */
export class ANTLRInputStream extends JavaObject implements CharStream {
    public static readonly READ_BUFFER_SIZE: number = 1024;
    public static readonly INITIAL_BUFFER_SIZE: number = 1024;

    /** What is name or source of this char stream? */
    public name: java.lang.String | null = null;

    /** The data being scanned */
    protected data = new Uint16Array();

    /** How many characters are actually in the buffer */
    protected n = 0;

    /** 0..n-1 index into string of next char */
    protected p = 0;

    public constructor();
    /** Copy data in string to a local char array */
    public constructor(input: java.lang.String | null);
    public constructor(r: java.io.Reader | null);
    public constructor(input: java.io.InputStream | null);
    /** This is the preferred constructor for strings as no data is copied */
    public constructor(data: Uint16Array, numberOfActualCharsInArray: number);
    public constructor(r: java.io.Reader | null, initialSize: number);
    public constructor(input: java.io.InputStream | null, initialSize: number);
    public constructor(r: java.io.Reader | null, initialSize: number, readChunkSize: number);
    public constructor(input: java.io.InputStream | null, initialSize: number, readChunkSize: number);
    public constructor(...args: unknown[]) {
        super();

        switch (args.length) {
            case 0: {
                break;
            }

            case 1: {
                if (args[0] instanceof java.lang.String) {
                    this.data = args[0].toCharArray();
                    this.n = args[0].length();
                } else if (args[0] instanceof java.io.Reader) {
                    this.load(args[0], ANTLRInputStream.INITIAL_BUFFER_SIZE, ANTLRInputStream.READ_BUFFER_SIZE);
                } else if (args[0] instanceof java.io.InputStream) {
                    this.load(new java.io.InputStreamReader(args[0]), ANTLRInputStream.INITIAL_BUFFER_SIZE,
                        ANTLRInputStream.READ_BUFFER_SIZE);
                }

                break;
            }

            case 2: {
                if (args[0] instanceof Uint16Array && typeof args[1] === "number") {
                    this.data = args[0];
                    this.n = args[1];
                } else if (args[0] instanceof java.io.Reader && typeof args[1] === "number") {
                    this.load(args[0], args[1], ANTLRInputStream.READ_BUFFER_SIZE);
                } else if (args[0] instanceof java.io.InputStream && typeof args[1] === "number") {
                    this.load(new java.io.InputStreamReader(args[0]), args[1], ANTLRInputStream.READ_BUFFER_SIZE);
                }

                break;
            }

            case 3: {
                if (args[0] instanceof java.io.Reader && typeof args[1] === "number" && typeof args[2] === "number") {
                    this.load(args[0], args[1], args[2]);
                } else if (args[0] instanceof java.io.InputStream && typeof args[1] === "number" &&
                    typeof args[2] === "number") {
                    this.load(new java.io.InputStreamReader(args[0]), args[1], args[2]);
                }

                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }

    public load(r: java.io.Reader | null, size: number, readChunkSize: number): void {
        if (r === null) {
            return;
        }

        if (size <= 0) {
            size = ANTLRInputStream.INITIAL_BUFFER_SIZE;
        }
        if (readChunkSize <= 0) {
            readChunkSize = ANTLRInputStream.READ_BUFFER_SIZE;
        }

        try {
            // alloc initial buffer size.
            this.data = new Uint16Array(size);
            // read all the data in chunks of readChunkSize
            let numRead = 0;
            let p = 0;
            do {
                if (p + readChunkSize > this.data.length) { // overflow?
                    this.data = java.util.Arrays.copyOf(this.data, this.data.length * 2);
                }

                numRead = r.read(this.data, p, readChunkSize);
                p += numRead;
            } while (numRead !== -1); // while not EOF
            // set the actual size of the data available;
            // EOF subtracted one above in p+=numRead; add one back
            this.n = p + 1;
        } finally {
            r.close();
        }
    }

    /**
     * Reset the stream so that it's in the same state it was
     *  when the object was created *except* the data array is not
     *  touched.
     */
    public reset = (): void => {
        this.p = 0;
    };

    public consume = (): void => {
        if (this.p >= this.n) {
            throw new java.lang.IllegalStateException(S`cannot consume EOF`);
        }

        if (this.p < this.n) {
            this.p++;
        }
    };

    public LA = (i: number): number => {
        if (i === 0) {
            return 0; // undefined
        }
        if (i < 0) {
            i++; // e.g., translate LA(-1) to use offset i=0; then data[p+0-1]
            if ((this.p + i - 1) < 0) {
                return IntStream.EOF; // invalid; no char before first char
            }
        }

        if ((this.p + i - 1) >= this.n) {
            //System.out.println("char LA("+i+")=EOF; p="+p);
            return IntStream.EOF;
        }

        //System.out.println("char LA("+i+")="+(char)data[p+i-1]+"; p="+p);
        //System.out.println("LA("+i+"); p="+p+" n="+n+" data.length="+data.length);
        return this.data[this.p + i - 1];
    };

    public LT = (i: number): number => {
        return this.LA(i);
    };

    /**
     * Return the current input symbol index 0..n where n indicates the
     *  last symbol has been read.  The index is the index of char to
     *  be returned from LA(1).
     *
     * @returns The current position in the input, where 0 indicates the first symbol has been consumed.
     */
    public index = (): number => {
        return this.p;
    };

    public size = (): number => {
        return this.n;
    };

    /**
     * mark/release do nothing; we have entire buffer
     *
     * @returns -1
     */
    public mark = (): number => {
        return -1;
    };

    public release = (marker: number): void => {
        // Nothing to do
    };

    /**
     * consume() ahead until p==index; can't just set p=index as we must
     *  update line and charPositionInLine. If we seek backwards, just set p
     *
     * @param index The absolute index to seek to.
     */
    public seek = (index: number): void => {
        if (index <= this.p) {
            this.p = index; // just jump; don't update stream state (line, ...)

            return;
        }

        // seek forward, consume until p hits index or n (whichever comes first)
        index = Math.min(index, this.n);
        while (this.p < index) {
            this.consume();
        }
    };

    public getText = (interval: Interval): java.lang.String => {
        const start = interval.a;
        let stop = interval.b;
        if (stop >= this.n) {
            stop = this.n - 1;
        }

        const count = stop - start + 1;
        if (start >= this.n) {
            return S``;
        }

        return new java.lang.String(this.data, start, count);
    };

    public getSourceName = (): java.lang.String => {
        if (this.name === null || this.name.isEmpty()) {
            return IntStream.UNKNOWN_SOURCE_NAME;
        }

        return this.name;
    };

    public override toString = (): java.lang.String => {
        return new java.lang.String(this.data);
    };
}
