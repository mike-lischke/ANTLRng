/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

/* eslint-disable @typescript-eslint/unified-signatures */
/* eslint-disable jsdoc/require-returns */

import { MurmurHash } from "../../MurmurHash";

import { Buffer, BufferOverflowException, ReadOnlyBufferException } from ".";
import { Comparable, IllegalArgumentException, IndexOutOfBoundsException } from "../lang";
import { ByteOrder } from "./ByteOrder";
import { BufferUnderflowException } from "./BufferUnderflowException";

export class ByteBuffer extends Buffer<Uint8Array> implements Comparable<ByteBuffer> {
    private buffer: Uint8Array;

    private readOnly = false;
    private byteOrder: ByteOrder;

    private constructor(capacity: number);
    private constructor(buffer: Uint8Array, offset?: number, length?: number);
    private constructor(capacityOrBuffer: number | Uint8Array, offset?: number, length?: number) {
        super();
        this.byteOrder = ByteOrder.byteOrder;

        const start = offset ?? 0;

        if (typeof capacityOrBuffer === "number") {
            this.buffer = new Uint8Array(capacityOrBuffer).fill(0);
            this.currentCapacity = capacityOrBuffer;
            this.currentLimit = capacityOrBuffer;
        } else {
            const end = start + (length ?? capacityOrBuffer.length);

            this.buffer = capacityOrBuffer;
            this.currentCapacity = capacityOrBuffer.length;
            this.currentLimit = end;
            this.currentPosition = offset;
        }
    }

    /**
     * Allocates a new char buffer.
     *
     * @param capacity The new buffer capacity.
     *
     * @returns The allocated char buffer.
     */
    public static allocate(capacity: number): ByteBuffer {
        return new ByteBuffer(capacity);
    }

    public static wrap(array: Uint8Array): ByteBuffer;
    public static wrap(array: Uint8Array, start: number, end: number): ByteBuffer;
    public static wrap(array: Uint8Array, start?: number, end?: number): ByteBuffer {
        return new ByteBuffer(array, start, end);
    }

    /** Returns the byte array that backs this buffer  (optional operation). */
    public array(): Uint8Array {
        return this.buffer;
    }

    /**
     * Returns the offset within this buffer's backing array of the first element of the buffer  (optional operation).
     */
    public arrayOffset(): number {
        return 0;
    }

    public isDirect(): boolean {
        return false;
    }

    public isReadOnly(): boolean {
        return this.readOnly;
    }

    /** Creates a view of this byte buffer as a char buffer. */
    // public abstract asCharBuffer(): CharBuffer;

    /** Creates a view of this byte buffer as a double buffer. */
    // abstract asDoubleBuffer(): DoubleBuffer;

    /** Creates a view of this byte buffer as a float buffer. */
    // abstract FloatBuffer	asFloatBuffer()

    /** Creates a view of this byte buffer as an int buffer. */
    // abstract asIntBuffer(): IntBuffer;

    /** Creates a view of this byte buffer as a long buffer. */
    // abstract asLongBuffer(): LongBuffer;

    /** Creates a new, read - only byte buffer that shares this buffer's content. */
    public asReadOnlyBuffer(): ByteBuffer {
        const result = this.duplicate();
        result.readOnly = true;

        return result;
    }

    /** Creates a view of this byte buffer as a short buffer. */
    // abstract asShortBuffer(): ShortBuffer;

    /** Compacts this buffer(optional operation). */
    // abstract compact(): ByteBuffer;

    /**
     * Compares this buffer to another.
     *
     * @param that tbd
     */
    public compareTo(that: ByteBuffer): number {
        const other = that.buffer.subarray(that.currentPosition, that.currentLimit);
        const me = this.buffer.subarray(this.currentPosition, this.currentLimit);

        const count = Math.max(other.length, me.length);
        for (let i = 0; i < count; ++i) {
            if (i === me.length) {
                return -1;
            }

            if (i === other.length) {
                return 1;
            }

            if (other[i] < me[i]) {
                return -1;
            }

            if (other[i] > me[i]) {
                return 1;
            }
        }

        return 0;
    }

    /** Creates a new byte buffer that shares this buffer's content. */
    public duplicate(): ByteBuffer {
        const buffer = new ByteBuffer(this.buffer);
        buffer.readOnly = this.readOnly;
        buffer.currentCapacity = this.currentCapacity;
        buffer.currentPosition = this.currentPosition;
        buffer.currentLimit = this.currentLimit;
        buffer.currentMark = this.currentMark;

        return buffer;
    }

    /**
     * Tells whether or not this buffer is equal to another object.
     *
     * @param ob tbd
     */
    public equals(ob: unknown): boolean {
        if (ob instanceof ByteBuffer) {
            const other = ob.buffer.subarray(ob.currentPosition, ob.currentLimit);
            const me = this.buffer.subarray(this.currentPosition, this.currentLimit);

            if (other.length !== me.length) {
                return false;
            }

            for (let i = 0; i < other.length; ++i) {
                if (other[i] !== me[i]) {
                    return false;
                }
            }

            return true;
        }

        return false;
    }

    /** Relative get method. */
    public get(): number;
    /** Absolute get method. */
    public get(index: number): number;
    /** Relative bulk get method. */
    public get(dst: Uint8Array): this;
    public get(dst: Uint8Array, offset: number, length: number): this;
    public get(indexOrDst?: number | Uint8Array, offset?: number, length?: number): this | number {
        if (indexOrDst === undefined) {
            if (this.currentPosition >= this.currentLimit) {
                throw new BufferUnderflowException();
            }

            return this.buffer[this.currentPosition++];
        } else if (typeof indexOrDst === "number") {
            if (indexOrDst >= this.currentLimit) {
                throw new IndexOutOfBoundsException();
            }

            return this.buffer[indexOrDst];
        } else {
            offset ??= 0;
            length ??= indexOrDst.length;

            if (length > this.remaining()) {
                throw new BufferUnderflowException();
            }

            if (offset < 0 || length < 0 || offset + length >= indexOrDst.length) {
                throw new IndexOutOfBoundsException();
            }

            indexOrDst.set(this.buffer.slice(this.currentPosition, this.currentPosition + length), offset);

            this.currentPosition += length;

            return this;
        }
    }

    /** Relative get method for reading a char value. */
    // abstract getChar(): char;

    /** Absolute get method for reading a char value. */
    // abstract getChar(int index): char;

    /** Relative get method for reading a double value. */
    // abstract getDouble(): double;

    /** Absolute get method for reading a double value. */
    // abstract getDouble(int index): double;

    /** Relative get method for reading a float value. */
    // abstract getFloat(): float;

    /** Absolute get method for reading a float value. */
    // abstract getFloat(int index): float;

    /** Relative get method for reading an int value. */
    // abstract getInt(): int;

    /** Absolute get method for reading an int value. */
    // abstract getInt(int index): int;

    /** Relative get method for reading a long value. */
    // abstract getLong(): long;

    /** Absolute get method for reading a long value. */
    // abstract getLong(int index): long;

    /** Relative get method for reading a short value. */
    // abstract getShort(): short;

    /** Absolute get method for reading a short value. */
    // abstract getShort(int index): short;

    /** Tells whether or not this buffer is backed by an accessible byte array. */
    public hasArray(): boolean {
        return true;
    }

    /** Returns the current hash code of this buffer. */
    public hashCode(): number {
        let hash = MurmurHash.initialize(super.hashCode());
        hash = MurmurHash.update(hash, this.readOnly);
        hash = MurmurHash.update(hash, this.byteOrder.hashCode());
        hash = MurmurHash.update(hash, this.buffer);
        hash = MurmurHash.finish(hash, 3);

        return hash;
    }

    /** Tells whether or not this byte buffer is direct. */
    // abstract isDirect(): boolean;

    /** Retrieves this buffer's byte order. */
    public get order(): ByteOrder {
        return this.byteOrder;
    }

    /** Modifies this buffer's byte order. */
    public set order(bo: ByteOrder) {
        this.byteOrder = bo;
    }

    /** Relative put method(optional operation). Only writes a byte! */
    public put(b: number): this;
    /** Absolute put method(optional operation). */
    public put(index: number, b: number): this;
    /** Relative bulk put method(optional operation). */
    public put(src: Uint8Array): this;
    /** Relative bulk put method(optional operation). */
    public put(src: Uint8Array, offset: number, length: number): this;
    /** Relative bulk put method(optional operation). */
    public put(src: ByteBuffer): this;
    public put(bOrIndexOrSrc: number | Uint8Array | ByteBuffer, bOrOffset?: number, length?: number): this {
        if (this.readOnly) {
            throw new ReadOnlyBufferException();
        }

        if (typeof bOrIndexOrSrc === "number") {
            if (bOrOffset === undefined) {
                if (this.remaining() === 0) {
                    throw new BufferOverflowException();
                }

                this.buffer[this.currentPosition++] = bOrIndexOrSrc & 0xFF;
            } else {
                if (bOrIndexOrSrc < 0 || bOrIndexOrSrc >= this.currentLimit) {
                    throw new IndexOutOfBoundsException();
                }

                this.buffer[bOrIndexOrSrc] = bOrOffset & 0xFF;
            }
        } else if (bOrIndexOrSrc instanceof ByteBuffer) {
            if (bOrIndexOrSrc === this) {
                throw new IllegalArgumentException();
            }

            const count = bOrIndexOrSrc.remaining();
            if (this.remaining() < count) {
                throw new BufferOverflowException();
            }

            this.buffer.set(bOrIndexOrSrc.buffer.subarray(bOrIndexOrSrc.currentPosition, bOrIndexOrSrc.currentLimit),
                this.currentPosition);

            this.currentPosition += count;
            bOrIndexOrSrc.currentPosition += count;
        } else {
            const array = bOrIndexOrSrc;
            const offset = bOrOffset ?? 0;
            length ??= array.length;

            if (offset < 0 || length < 0 || offset + length >= array.length) {
                throw new IndexOutOfBoundsException();
            }

            if (length > this.remaining()) {
                throw new BufferOverflowException();
            }

            this.buffer.set(array.subarray(offset, offset + length), this.currentPosition);
            this.currentPosition += length;
        }

        return this;
    }

    /** Relative put method for writing a char value(optional operation). */
    // abstract putChar(char value): ByteBuffer;

    /** Absolute put method for writing a char value(optional operation). */
    // abstract putChar(int index, char value): ByteBuffer;

    /** Relative put method for writing a double value(optional operation). */
    // abstract putDouble(double value): ByteBuffer;

    /** Absolute put method for writing a double value(optional operation). */
    // abstract putDouble(int index, double value): ByteBuffer;

    /** Relative put method for writing a float value(optional operation). */
    // abstract putFloat(float value): ByteBuffer;

    /** Absolute put method for writing a float value(optional operation). */
    // abstract putFloat(int index, float value): ByteBuffer;

    /** Relative put method for writing an int value(optional operation). */
    // abstract putInt(int value): ByteBuffer;

    /** Absolute put method for writing an int value(optional operation). */
    // abstract putInt(int index, int value): ByteBuffer;

    /** Absolute put method for writing a long value(optional operation). */
    // abstract putLong(int index, long value): ByteBuffer;

    /** Relative put method for writing a long value(optional operation). */
    // abstract putLong(long value): ByteBuffer;

    /** Absolute put method for writing a short value(optional operation). */
    // abstract putShort(int index, short value): ByteBuffer;

    /** Relative put method for writing a short value(optional operation). */
    // abstract putShort(short value): ByteBuffer;

    /** Creates a new byte buffer whose content is a shared subsequence of this buffer's content. */
    // abstract slice(): ByteBuffer;

    /** Returns a string summarizing the state of this buffer. */
    public toString(): string {
        return this.buffer.subarray(this.currentPosition, this.currentLimit).toString();
    }

}
