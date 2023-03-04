/* java2ts: keep */

/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { java, JavaObject, S } from "jree";

/**
 * Wrapper for {@link ByteBuffer} / {@link CharBuffer} / {@link IntBuffer}.
 *
 * Because Java lacks generics on primitive types, these three types
 * do not share an interface, so we have to write one manually.
 */
export class CodePointBuffer extends JavaObject {
    public static Type = class Type extends java.lang.Enum<Type> {
        public static readonly BYTE: Type = new Type(S`BYTE`, 0);
        public static readonly CHAR: Type = new Type(S`CHAR`, 1);
        public static readonly INT: Type = new Type(S`INT`, 2);
    };

    public static Builder = ((_$outer) => {
        return class Builder extends JavaObject {
            private type: CodePointBuffer.Type;
            private byteBuffer: java.nio.ByteBuffer | null;
            private charBuffer: java.nio.CharBuffer | null;
            private intBuffer: java.nio.IntBuffer | null;
            private prevHighSurrogate: number;

            public constructor(initialBufferSize: number) {
                super();
                this.type = CodePointBuffer.Type.BYTE;
                this.byteBuffer = java.nio.ByteBuffer.allocate(initialBufferSize);
                this.charBuffer = null;
                this.intBuffer = null;
                this.prevHighSurrogate = -1;
            }

            public build = (): CodePointBuffer => {
                switch (this.type) {
                    case CodePointBuffer.Type.BYTE: {
                        this.byteBuffer!.flip();
                        break;
                    }

                    case CodePointBuffer.Type.CHAR: {
                        this.charBuffer!.flip();
                        break;
                    }

                    case CodePointBuffer.Type.INT: {
                        this.intBuffer!.flip();
                        break;
                    }

                    default:

                }

                return new CodePointBuffer(this.type, this.byteBuffer, this.charBuffer, this.intBuffer);
            };

            public ensureRemaining = (remainingNeeded: number): void => {
                switch (this.type) {
                    case CodePointBuffer.Type.BYTE: {
                        if (this.byteBuffer!.remaining() < remainingNeeded) {
                            const newCapacity = this.roundUpToNextPowerOfTwo(this.byteBuffer!.capacity() +
                                remainingNeeded);
                            const newBuffer: java.nio.ByteBuffer = java.nio.ByteBuffer.allocate(newCapacity);
                            this.byteBuffer!.flip();
                            newBuffer.put(this.byteBuffer!);
                            this.byteBuffer = newBuffer;
                        }
                        break;
                    }

                    case CodePointBuffer.Type.CHAR: {
                        if (this.charBuffer!.remaining() < remainingNeeded) {
                            const newCapacity = this.roundUpToNextPowerOfTwo(this.charBuffer!.capacity() +
                                remainingNeeded);
                            const newBuffer: java.nio.CharBuffer = java.nio.CharBuffer.allocate(newCapacity);
                            this.charBuffer!.flip();
                            newBuffer.put(this.charBuffer!);
                            this.charBuffer = newBuffer;
                        }
                        break;
                    }

                    case CodePointBuffer.Type.INT: {
                        if (this.intBuffer!.remaining() < remainingNeeded) {
                            const newCapacity = this.roundUpToNextPowerOfTwo(this.intBuffer!.capacity() +
                                remainingNeeded);
                            const newBuffer: java.nio.IntBuffer = java.nio.IntBuffer.allocate(newCapacity);
                            this.intBuffer!.flip();
                            newBuffer.put(this.intBuffer!);
                            this.intBuffer = newBuffer;
                        }
                        break;
                    }

                    default:

                }
            };

            public append = (utf16In: java.nio.CharBuffer): void => {
                this.ensureRemaining(utf16In.remaining());
                if (utf16In.hasArray()) {
                    this.appendArray(utf16In);
                } else {
                    // TODO
                    throw new java.lang.UnsupportedOperationException(S`TODO`);
                }
            };

            protected getType = (): CodePointBuffer.Type => {
                return this.type;
            };

            protected getByteBuffer = (): java.nio.ByteBuffer | null => {
                return this.byteBuffer;
            };

            protected getCharBuffer = (): java.nio.CharBuffer | null => {
                return this.charBuffer;
            };

            protected getIntBuffer = (): java.nio.IntBuffer | null => {
                return this.intBuffer;
            };

            private roundUpToNextPowerOfTwo = (i: number): number => {
                const nextPowerOfTwo: number = 32 - java.lang.Integer.numberOfLeadingZeros(i - 1);

                return Number(Math.pow(2, nextPowerOfTwo));
            };

            private appendArray = (utf16In: java.nio.CharBuffer): void => {
                switch (this.type) {
                    case CodePointBuffer.Type.BYTE: {
                        this.appendArrayByte(utf16In);
                        break;
                    }

                    case CodePointBuffer.Type.CHAR: {
                        this.appendArrayChar(utf16In);
                        break;
                    }

                    case CodePointBuffer.Type.INT: {
                        this.appendArrayInt(utf16In);
                        break;
                    }

                    default:

                }
            };

            private appendArrayByte = (utf16In: java.nio.CharBuffer): void => {
                const input: Uint16Array = utf16In.array();
                let inOffset: number = utf16In.arrayOffset() + utf16In.position();
                const inLimit: number = utf16In.arrayOffset() + utf16In.limit();

                const outByte = this.byteBuffer!.array();
                let outOffset: number = this.byteBuffer!.arrayOffset() + this.byteBuffer!.position();

                while (inOffset < inLimit) {
                    const c: java.lang.char = input[inOffset];
                    if (c <= 0xFF) {
                        outByte[outOffset] = Number((c & 0xFF));
                    } else {
                        utf16In.position(inOffset - utf16In.arrayOffset());
                        this.byteBuffer!.position(outOffset - this.byteBuffer!.arrayOffset());
                        if (!java.lang.Character.isHighSurrogate(c)) {
                            this.byteToCharBuffer(utf16In.remaining());
                            this.appendArrayChar(utf16In);

                            return;
                        } else {
                            this.byteToIntBuffer(utf16In.remaining());
                            this.appendArrayInt(utf16In);

                            return;
                        }
                    }
                    inOffset++;
                    outOffset++;
                }

                utf16In.position(inOffset - utf16In.arrayOffset());
                this.byteBuffer!.position(outOffset - this.byteBuffer!.arrayOffset());
            };

            private appendArrayChar = (utf16In: java.nio.CharBuffer): void => {
                const input = utf16In.array();
                let inOffset: number = utf16In.arrayOffset() + utf16In.position();
                const inLimit: number = utf16In.arrayOffset() + utf16In.limit();

                const outChar: Uint16Array = this.charBuffer!.array();
                let outOffset: number = this.charBuffer!.arrayOffset() + this.charBuffer!.position();

                while (inOffset < inLimit) {
                    const c: java.lang.char = input[inOffset];
                    if (!java.lang.Character.isHighSurrogate(c)) {
                        outChar[outOffset] = c;
                    } else {
                        utf16In.position(inOffset - utf16In.arrayOffset());
                        this.charBuffer!.position(outOffset - this.charBuffer!.arrayOffset());
                        this.charToIntBuffer(utf16In.remaining());
                        this.appendArrayInt(utf16In);

                        return;
                    }
                    inOffset++;
                    outOffset++;
                }

                utf16In.position(inOffset - utf16In.arrayOffset());
                this.charBuffer!.position(outOffset - this.charBuffer!.arrayOffset());
            };

            private appendArrayInt = (utf16In: java.nio.CharBuffer): void => {
                const input: Uint16Array = utf16In.array();
                let inOffset: number = utf16In.arrayOffset() + utf16In.position();
                const inLimit: number = utf16In.arrayOffset() + utf16In.limit();

                const outInt: Int32Array = this.intBuffer!.array();
                let outOffset: number = this.intBuffer!.arrayOffset() + this.intBuffer!.position();

                while (inOffset < inLimit) {
                    const c: java.lang.char = input[inOffset];
                    inOffset++;
                    if (this.prevHighSurrogate !== -1) {
                        if (java.lang.Character.isLowSurrogate(c)) {
                            outInt[outOffset] = java.lang.Character.toCodePoint(this.prevHighSurrogate, c);
                            outOffset++;
                            this.prevHighSurrogate = -1;
                        } else {
                            // Dangling high surrogate
                            outInt[outOffset] = this.prevHighSurrogate;
                            outOffset++;
                            if (java.lang.Character.isHighSurrogate(c)) {
                                this.prevHighSurrogate = c & 0xFFFF;
                            } else {
                                outInt[outOffset] = c & 0xFFFF;
                                outOffset++;
                                this.prevHighSurrogate = -1;
                            }
                        }
                    } else {
                        if (java.lang.Character.isHighSurrogate(c)) {
                            this.prevHighSurrogate = c & 0xFFFF;
                        } else {
                            outInt[outOffset] = c & 0xFFFF;
                            outOffset++;
                        }
                    }

                }

                if (this.prevHighSurrogate !== -1) {
                    // Dangling high surrogate
                    outInt[outOffset] = this.prevHighSurrogate & 0xFFFF;
                    outOffset++;
                }

                utf16In.position(inOffset - utf16In.arrayOffset());
                this.intBuffer!.position(outOffset - this.intBuffer!.arrayOffset());
            };

            private byteToCharBuffer = (toAppend: number): void => {
                this.byteBuffer!.flip();
                // CharBuffers hold twice as much per unit as ByteBuffers, so start with half the capacity.
                const newBuffer = java.nio.CharBuffer.allocate(Math.max(this.byteBuffer!.remaining() + toAppend,
                    this.byteBuffer!.capacity() / 2));
                while (this.byteBuffer!.hasRemaining()) {
                    newBuffer.put((this.byteBuffer!.get() & 0xFF));
                }
                this.type = CodePointBuffer.Type.CHAR;
                this.byteBuffer = null;
                this.charBuffer = newBuffer;
            };

            private byteToIntBuffer = (toAppend: number): void => {
                this.byteBuffer!.flip();
                // IntBuffers hold four times as much per unit as ByteBuffers, so start with one quarter the capacity.
                const newBuffer = java.nio.IntBuffer.allocate(Math.max(this.byteBuffer!.remaining() + toAppend,
                    this.byteBuffer!.capacity() / 4));
                while (this.byteBuffer!.hasRemaining()) {
                    newBuffer.put(this.byteBuffer!.get() & 0xFF);
                }
                this.type = CodePointBuffer.Type.INT;
                this.byteBuffer = null;
                this.intBuffer = newBuffer;
            };

            private charToIntBuffer = (toAppend: number): void => {
                this.charBuffer!.flip();
                // IntBuffers hold two times as much per unit as ByteBuffers, so start with one half the capacity.
                const newBuffer = java.nio.IntBuffer.allocate(Math.max(this.charBuffer!.remaining() + toAppend,
                    this.charBuffer!.capacity() / 2));
                while (this.charBuffer!.hasRemaining()) {
                    newBuffer.put(this.charBuffer!.get() & 0xFFFF);
                }
                this.type = CodePointBuffer.Type.INT;
                this.charBuffer = null;
                this.intBuffer = newBuffer;
            };
        };
    })(this);

    private type: CodePointBuffer.Type;
    private byteBuffer: java.nio.ByteBuffer | null;
    private charBuffer: java.nio.CharBuffer | null;
    private intBuffer: java.nio.IntBuffer | null;

    private constructor(type: CodePointBuffer.Type, byteBuffer: java.nio.ByteBuffer | null,
        charBuffer: java.nio.CharBuffer | null, intBuffer: java.nio.IntBuffer | null) {
        super();
        this.type = type;
        this.byteBuffer = byteBuffer;
        this.charBuffer = charBuffer;
        this.intBuffer = intBuffer;
    }

    public static builder = (initialBufferSize: number): CodePointBuffer.Builder => {
        return new this.Builder(initialBufferSize);
    };

    public withBytes = (byteBuffer: java.nio.ByteBuffer): CodePointBuffer => {
        return new CodePointBuffer(CodePointBuffer.Type.BYTE, byteBuffer, null, null);
    };

    public withChars = (charBuffer: java.nio.CharBuffer): CodePointBuffer => {
        return new CodePointBuffer(CodePointBuffer.Type.CHAR, null, charBuffer, null);
    };

    public withInts = (intBuffer: java.nio.IntBuffer): CodePointBuffer => {
        return new CodePointBuffer(CodePointBuffer.Type.INT, null, null, intBuffer);
    };

    public position(): number;
    public position(newPosition: number): void;
    public position(newPosition?: number): number | void {
        if (newPosition === undefined) {
            switch (this.type) {
                case CodePointBuffer.Type.BYTE: {
                    return this.byteBuffer!.position();
                }

                case CodePointBuffer.Type.CHAR: {
                    return this.charBuffer!.position();
                }

                case CodePointBuffer.Type.INT: {
                    return this.intBuffer!.position();
                }

                default:

            }
            throw new java.lang.UnsupportedOperationException(S`Not reached`);
        } else {
            switch (this.type) {
                case CodePointBuffer.Type.BYTE: {
                    this.byteBuffer!.position(newPosition);
                    break;
                }

                case CodePointBuffer.Type.CHAR: {
                    this.charBuffer!.position(newPosition);
                    break;
                }

                case CodePointBuffer.Type.INT: {
                    this.intBuffer!.position(newPosition);
                    break;
                }

                default:

            }
        }

    }

    public remaining = (): number => {
        switch (this.type) {
            case CodePointBuffer.Type.BYTE: {
                return this.byteBuffer!.remaining();
            }

            case CodePointBuffer.Type.CHAR: {
                return this.charBuffer!.remaining();
            }

            case CodePointBuffer.Type.INT: {
                return this.intBuffer!.remaining();
            }

            default:

        }
        throw new java.lang.UnsupportedOperationException(S`Not reached`);
    };

    public get = (offset: number): number => {
        switch (this.type) {
            case CodePointBuffer.Type.BYTE: {
                return this.byteBuffer!.get(offset);
            }

            case CodePointBuffer.Type.CHAR: {
                return this.charBuffer!.get(offset);
            }

            case CodePointBuffer.Type.INT: {
                return this.intBuffer!.get(offset);
            }

            default:

        }
        throw new java.lang.UnsupportedOperationException(S`Not reached`);
    };

    public getType = (): CodePointBuffer.Type | null => {
        return this.type;
    };

    public arrayOffset = (): number => {
        switch (this.type) {
            case CodePointBuffer.Type.BYTE: {
                return this.byteBuffer!.arrayOffset();
            }

            case CodePointBuffer.Type.CHAR: {
                return this.charBuffer!.arrayOffset();
            }

            case CodePointBuffer.Type.INT: {
                return this.intBuffer!.arrayOffset();
            }

            default:

        }
        throw new java.lang.UnsupportedOperationException(S`Not reached`);
    };

    public byteArray = (): Uint8Array => {
        return this.byteBuffer!.array();
    };

    public charArray = (): Uint16Array => {
        return this.charBuffer!.array();
    };

    public intArray = (): Int32Array => {
        return this.intBuffer!.array();
    };

}

// eslint-disable-next-line @typescript-eslint/no-namespace, no-redeclare
export namespace CodePointBuffer {
    export type Type = InstanceType<typeof CodePointBuffer.Type>;
    export type Builder = InstanceType<typeof CodePointBuffer.Builder>;
}
