/* java2ts: keep */

/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/* eslint-disable @typescript-eslint/naming-convention */

import { java, JavaObject, S } from "jree";

import { CharStream } from "./CharStream";
import { CodePointBuffer } from "./CodePointBuffer";
import { IntStream } from "./IntStream";
import { Interval } from "./misc/Interval";

/**
 * Alternative to {@link ANTLRInputStream} which treats the input
 * as a series of Unicode code points, instead of a series of UTF-16
 * code units.
 *
 * Use this if you need to parse input which potentially contains
 * Unicode values > U+FFFF.
 */
export abstract class CodePointCharStream extends JavaObject implements CharStream {
    // 8-bit storage for code points <= U+00FF.
    public static readonly CodePoint8BitCharStream = class CodePoint8BitCharStream extends CodePointCharStream {
        public readonly byteArray: Int8Array;

        public constructor(position: number, remaining: number, name: java.lang.String | null,
            byteArray: Int8Array, _arrayOffset: number) {
            super(position, remaining, name);
            this.byteArray = byteArray;
        }

        /**
         * Return the UTF-16 encoded string for the given interval
         *
         * @param interval tbd
         *
         * @returns tbd
         */
        public getText = (interval: Interval): java.lang.String => {
            const startIdx: number = Math.min(interval.a, this.#size);
            const len: number = Math.min(interval.b - interval.a + 1, this.#size - startIdx);

            // We know the maximum code point in byteArray is U+00FF,
            // so we can treat this as if it were ISO-8859-1, aka Latin-1,
            // which shares the same code points up to 0xFF.
            return new java.lang.String(this.byteArray, startIdx, len,
                java.nio.charset.StandardCharsets.ISO_8859_1);
        };

        public LA = (i: number): number => {
            let offset: number;
            switch (java.lang.Integer.signum(i)) {
                case -1: {
                    offset = this.position + i;
                    if (offset < 0) {
                        return IntStream.EOF;
                    }

                    return this.byteArray[offset];
                }

                case 0: {
                    // Undefined
                    return 0;
                }

                case 1: {
                    offset = this.position + i - 1;
                    if (offset >= this.#size) {
                        return IntStream.EOF;
                    }

                    return this.byteArray[offset];
                }

                default:

            }
            throw new java.lang.UnsupportedOperationException(S`Not reached`);
        };

        public getInternalStorage = (): Int8Array => {
            return this.byteArray;
        };
    };

    // 16-bit internal storage for code points between U+0100 and U+FFFF.
    public static readonly CodePoint16BitCharStream = class CodePoint16BitCharStream extends CodePointCharStream {
        public readonly charArray: Uint16Array;

        public constructor(position: number, remaining: number, name: java.lang.String | null,
            charArray: Uint16Array, _arrayOffset: number) {
            super(position, remaining, name);
            this.charArray = charArray;
        }

        /**
         * Return the UTF-16 encoded string for the given interval
         *
         * @param interval tbd
         *
         * @returns tbd
         */
        public getText = (interval: Interval): java.lang.String => {
            const startIdx: number = Math.min(interval.a, this.#size);
            const len: number = Math.min(interval.b - interval.a + 1, this.#size - startIdx);

            // We know there are no surrogates in this
            // array, since otherwise we would be given a
            // 32-bit int[] array.
            //
            // So, it's safe to treat this as if it were
            // UTF-16.
            return new java.lang.String(this.charArray, startIdx, len);
        };

        public LA = (i: number): number => {
            let offset: number;
            switch (java.lang.Integer.signum(i)) {
                case -1: {
                    offset = this.position + i;
                    if (offset < 0) {
                        return IntStream.EOF;
                    }

                    return this.charArray[offset];
                }

                case 0: {
                    // Undefined
                    return 0;
                }

                case 1: {
                    offset = this.position + i - 1;
                    if (offset >= this.#size) {
                        return IntStream.EOF;
                    }

                    return this.charArray[offset];
                }

                default:

            }
            throw new java.lang.UnsupportedOperationException(S`Not reached`);
        };

        public getInternalStorage = (): Uint16Array => {
            return this.charArray;
        };
    };

    // 32-bit internal storage for code points between U+10000 and U+10FFFF.
    public static readonly CodePoint32BitCharStream = class CodePoint32BitCharStream extends CodePointCharStream {
        public readonly intArray: Int32Array;

        public constructor(position: number, remaining: number, name: java.lang.String | null,
            intArray: Int32Array, _arrayOffset: number) {
            super(position, remaining, name);
            this.intArray = intArray;
        }

        /**
         * Return the UTF-16 encoded string for the given interval
         *
         * @param interval tbd
         *
         * @returns tbd
         */
        public getText = (interval: Interval): java.lang.String => {
            const startIdx: number = Math.min(interval.a, this.#size);
            const len: number = Math.min(interval.b - interval.a + 1, this.#size - startIdx);

            // Note that we pass the int[] code points to the String constructor --
            // this is supported, and the constructor will convert to UTF-16 internally.
            return new java.lang.String(this.intArray, startIdx, len);
        };

        public LA = (i: number): number => {
            let offset: number;
            switch (java.lang.Integer.signum(i)) {
                case -1: {
                    offset = this.position + i;
                    if (offset < 0) {
                        return IntStream.EOF;
                    }

                    return this.intArray[offset];
                }

                case 0: {
                    // Undefined
                    return 0;
                }

                case 1: {
                    offset = this.position + i - 1;
                    if (offset >= this.#size) {
                        return IntStream.EOF;
                    }

                    return this.intArray[offset];
                }

                default:

            }
            throw new java.lang.UnsupportedOperationException(S`Not reached`);
        };

        public getInternalStorage = (): Int32Array => {
            return this.intArray;
        };
    };

    public readonly name: java.lang.String | null;

    // To avoid lots of virtual method calls, we directly access
    // the state of the underlying code points in the
    // CodePointBuffer.
    public position: number;

    public abstract getText: (_interval: Interval) => java.lang.String;
    public abstract LA: (i: number) => number;

    // Visible for testing.
    public abstract getInternalStorage: () => Int8Array | Uint16Array | Int32Array;

    readonly #size: number;

    // Use the factory method {@link #fromBuffer(CodePointBuffer)} to
    // construct instances of this type.
    private constructor(position: number, remaining: number, name: java.lang.String | null) {
        // TODO
        super();
        this.#size = remaining;
        this.name = name;
        this.position = 0;
    }

    /**
     * Constructs a named {@link CodePointCharStream} which provides access
     * to the Unicode code points stored in {@code codePointBuffer}.
     *
     * @param codePointBuffer The buffer for the code points.
     * @param name An optional name.
     *
     * @returns A new CodePointCharStream instance.
     */
    public static fromBuffer(codePointBuffer: CodePointBuffer, name?: java.lang.String | null): CodePointCharStream {
        name ??= IntStream.UNKNOWN_SOURCE_NAME;

        // Java lacks generics on primitive types.
        //
        // To avoid lots of calls to virtual methods in the
        // very hot code path of LA() below, we construct one
        // of three concrete subclasses.
        //
        // The concrete subclasses directly access the code
        // points stored in the underlying array (byte[],
        // char[], or int[]), so we can avoid lots of virtual
        // method calls to ByteBuffer.get(offset).
        switch (codePointBuffer.getType()) {
            case CodePointBuffer.Type.BYTE: {
                return new CodePointCharStream.CodePoint8BitCharStream(
                    codePointBuffer.position(),
                    codePointBuffer.remaining(),
                    name,
                    codePointBuffer.byteArray(),
                    codePointBuffer.arrayOffset());
            }

            case CodePointBuffer.Type.CHAR: {
                return new CodePointCharStream.CodePoint16BitCharStream(
                    codePointBuffer.position(),
                    codePointBuffer.remaining(),
                    name,
                    codePointBuffer.charArray(),
                    codePointBuffer.arrayOffset());
            }

            case CodePointBuffer.Type.INT: {
                return new CodePointCharStream.CodePoint32BitCharStream(
                    codePointBuffer.position(),
                    codePointBuffer.remaining(),
                    name,
                    new Int32Array(codePointBuffer.intArray()),
                    codePointBuffer.arrayOffset());
            }

            default:

        }

        throw new java.lang.UnsupportedOperationException(S`Not reached`);
    }

    public readonly consume = (): void => {
        if (this.#size - this.position === 0) {
            throw new java.lang.IllegalStateException(S`cannot consume EOF`);
        }
        this.position = this.position + 1;
    };

    public readonly index = (): number => {
        return this.position;
    };

    public readonly size = (): number => {
        return this.#size;
    };

    /**
     * mark/release do nothing; we have entire buffer
     *
     * @returns -1
     */
    public readonly mark = (): number => {
        return -1;
    };

    public readonly release = (_marker: number): void => {
        //
    };

    public readonly seek = (index: number): void => {
        this.position = index;
    };

    public readonly getSourceName = (): java.lang.String => {
        if (this.name === null || this.name.isEmpty()) {
            return IntStream.UNKNOWN_SOURCE_NAME;
        }

        return this.name;
    };

    public override toString(): java.lang.String {
        return this.getText(Interval.of(0, this.#size - 1));
    }

    public override clone(): CodePointCharStream {
        throw new java.lang.UnsupportedOperationException(S`Not supported`);
    }

    public [Symbol.toPrimitive](_hint: string): bigint | number | boolean | string | null {
        return this.getText(Interval.of(0, this.#size - 1)).valueOf();
    }
}

// eslint-disable-next-line @typescript-eslint/no-namespace, no-redeclare
export namespace CodePointCharStream {
    export type CodePoint8BitCharStream = InstanceType<typeof CodePointCharStream.CodePoint8BitCharStream>;
    export type CodePoint16BitCharStream = InstanceType<typeof CodePointCharStream.CodePoint16BitCharStream>;
    export type CodePoint32BitCharStream = InstanceType<typeof CodePointCharStream.CodePoint32BitCharStream>;
}
