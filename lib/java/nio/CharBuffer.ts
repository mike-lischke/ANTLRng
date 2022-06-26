/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, Mike Lischke
 *
 * See LICENSE file for more info.
 */

/* eslint-disable @typescript-eslint/unified-signatures */

import { Buffer, BufferOverflowException, ReadOnlyBufferException } from "./";
import {
    Appendable, CharSequence, CodePoint, Comparable, IllegalArgumentException, IndexOutOfBoundsException, Readable,
} from "../lang";
import { BufferUnderflowException } from "./BufferUnderflowException";
import hash_sum from "hash-sum";
import { ByteOrder } from "./ByteOrder";
import { NotImplementedError } from "../../NotImplementedError";

// eslint-disable-next-line @typescript-eslint/naming-convention
export class CharBuffer extends Buffer<CodePoint[]> implements Appendable, CharSequence, Comparable<CharBuffer>,
    Readable {
    private buffer: CodePoint[];

    private readOnly = false;
    private readonly byteOrder: ByteOrder;

    private constructor(capacity: number);
    private constructor(array: CodePoint[], offset?: number, length?: number);
    private constructor(capacityOrArray: number | CodePoint[], offset?: number, length?: number) {
        super();
        this.byteOrder = ByteOrder.byteOrder;

        if (typeof capacityOrArray === "number") {
            this.buffer = new Array(capacityOrArray).fill(0);
            this.currentCapacity = capacityOrArray;
            this.currentLimit = capacityOrArray;
        } else {
            this.buffer = capacityOrArray;
            this.currentCapacity = capacityOrArray.length;
            this.currentLimit = offset + length;
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
    public static allocate(capacity: number): CharBuffer {
        return new CharBuffer(capacity);
    }

    /** Wraps a char array into a buffer. */
    public static wrap(array: CodePoint[]): CharBuffer;
    /** Wraps a char array into a buffer. */
    public static wrap(array: CodePoint[], offset: number, length: number): CharBuffer;
    /** Wraps a character sequence into a buffer. */
    public static wrap(csq: CharSequence): CharBuffer;
    /** Wraps a character sequence into a buffer. */

    public static wrap(csq: CharSequence, start: number, end: number): CharBuffer;
    public static wrap(arrayOrCsq: CodePoint[] | CharSequence, offsetOrStart?: number,
        lengthOrEnd?: number): CharBuffer {
        if (Array.isArray(arrayOrCsq)) {
            if (offsetOrStart < 0 || offsetOrStart > arrayOrCsq.length || lengthOrEnd < 0
                || lengthOrEnd > arrayOrCsq.length - offsetOrStart) {
                throw new IndexOutOfBoundsException();
            }

            return new CharBuffer(arrayOrCsq, offsetOrStart, lengthOrEnd);
        } else {
            if (offsetOrStart < 0 || offsetOrStart > arrayOrCsq.length() || lengthOrEnd < offsetOrStart
                || lengthOrEnd > arrayOrCsq.length()) {
                throw new IndexOutOfBoundsException();
            }

            const array: CodePoint[] = [];
            for (let i = 0; i < arrayOrCsq.length(); ++i) {
                array.push(arrayOrCsq.charAt(i));
            }

            const buffer = new CharBuffer(array, offsetOrStart, lengthOrEnd);
            buffer.readOnly = true;
            buffer.currentPosition = offsetOrStart ?? 0;
            buffer.currentLimit = lengthOrEnd ?? arrayOrCsq.length();

            return buffer;
        }
    }

    /** Appends the specified char to this buffer(optional operation). */
    public append(c: CodePoint): this;
    /** Appends the specified character sequence to this buffer(optional operation). */
    public append(csq: CharSequence): this;
    /** Appends a subsequence of the specified character sequence to this buffer(optional operation). */
    public append(csq: CharSequence, start: number, end: number): this;
    public append(cOrCsq: CodePoint | CharSequence, start?: number, end?: number): this {
        if (this.readOnly) {
            throw new ReadOnlyBufferException();
        }

        if (typeof cOrCsq === "number") {
            if (this.position === this.limit) {
                throw new BufferOverflowException();
            }

            this.buffer[this.position++] = cOrCsq;
        } else {
            start ??= 0;
            end ??= cOrCsq.length();
            if (start < 0 || end < 0 || start > end || end > cOrCsq.length()) {
                throw new IndexOutOfBoundsException();
            }

            if (this.position + cOrCsq.length() >= this.limit) {
                throw new BufferOverflowException();
            }

            for (let i = start; i < end; ++i) {
                this.buffer[this.currentPosition++] = cOrCsq.charAt(i);
            }
        }

        return this;
    }

    /** @returns the char array that backs this buffer (optional operation). */
    public array(): CodePoint[] {
        return this.buffer;
    }

    /**
     * @returns the offset within this buffer's backing array of the first element of the buffer (optional operation).
     */
    public arrayOffset(): number {
        return 0;
    }

    /**
     * Creates a new, read - only char buffer that shares this buffer's content.
     *
     * @returns The new buffer.
     */
    public asReadOnlyBuffer(): CharBuffer {
        const buffer = new CharBuffer(this.buffer);
        buffer.readOnly = true;

        return buffer;
    }

    /**
     * Reads the character at the given index relative to the current position.
     *
     * @param index The char index.
     *
     * @returns The code point at this position.
     */
    public charAt(index: number): CodePoint {
        return this.buffer.at(index);
    }

    /**
     * Compacts this buffer(optional operation).
     *
     * @returns This buffer.
     */
    public compact(): this {
        if (this.position > 0) {
            this.buffer.copyWithin(0, this.currentPosition, this.currentLimit);
            this.currentPosition = this.currentLimit - this.currentPosition;
            this.currentLimit = this.currentCapacity;
            this.currentMark = undefined;
        }

        return this;
    }

    /**
     * Compares this buffer to another.
     *
     * @param that The other buffer.
     *
     * @returns < 0 if this buffer is less than the given buffer, 0 for equality and > 0 if larger.
     */
    public compareTo(that: CharBuffer): number {
        return this.buffer.toString().localeCompare(that.toString());
    }

    /**
     * Creates a new char buffer that shares this buffer's content.
     *
     * @returns The new buffer.
     */
    public duplicate(): CharBuffer {
        const buffer = new CharBuffer(this.buffer);
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
     * @param ob The object to compare to.
     *
     * @returns True if the the other buffer is equal to this one.
     */
    public equals(ob: unknown): boolean {
        if (ob instanceof CharBuffer) {
            return this === ob || this.buffer.toString() === ob.toString();
        }

        return false;
    }

    public get(): CodePoint;
    public get(dst: CodePoint[]): this;
    public get(dst: CodePoint[], offset: number, length: number): this;
    public get(index: number): CodePoint;
    public get(dstOrIndex?: CodePoint[] | number, offset?: number, length?: number): CodePoint | this {
        if (dstOrIndex === undefined) {
            if (this.currentPosition >= this.currentLimit) {
                throw new BufferUnderflowException();
            }

            return this.buffer[this.currentPosition++];
        } else if (typeof dstOrIndex === "number") {
            if (dstOrIndex >= this.currentLimit) {
                throw new IndexOutOfBoundsException();
            }

            return this.buffer[dstOrIndex];
        } else {
            offset ??= 0;
            length ??= dstOrIndex.length;

            if (offset + length >= this.currentLimit) {
                throw new BufferUnderflowException();
            }

            dstOrIndex.splice(offset, length,
                ...this.buffer.slice(this.currentPosition, this.currentPosition + length));

            this.currentPosition += length;

            return this;
        }
    }

    public isReadOnly(): boolean {
        return this.readOnly;
    }

    /**
     * Tells whether or not this buffer is backed by an accessible char array.
     *
     * @returns True.
     */
    public hasArray(): boolean {
        return true;
    }

    /** @returns the current hash code of this buffer. */
    public hashCode(): number {
        return parseInt(hash_sum(this.buffer.slice(this.currentPosition, this.currentLimit)), 16);
    }

    /**
     * Tells whether or not this char buffer is direct.
     *
     * @returns False.
     */
    public isDirect(): boolean {
        return false;
    }

    /** @returns the length of this character buffer. */
    public length(): number {
        return this.buffer.length;
    }

    /** @returns this buffer's byte order. */
    public order(): ByteOrder {
        return this.byteOrder;
    }

    /** Writes data to this buffer */
    public put(c: CodePoint): this;
    public put(src: CodePoint[]): this;
    public put(src: CodePoint[], offset: number, length: number): this;
    public put(src: CharBuffer): this;
    public put(index: number, c: CodePoint): this;
    public put(src: string): this;
    public put(src: string, start: number, end: number): this;
    public put(cOrSrcOrIndex: CodePoint | CodePoint[] | CharBuffer | number | string,
        offsetOrCOrStart?: number | CodePoint, lengthOrEnd?: number): this {

        if (this.readOnly) {
            throw new ReadOnlyBufferException();
        }

        if (typeof cOrSrcOrIndex === "number" && offsetOrCOrStart === undefined) {
            // A single code point, relative.
            if (this.position === this.limit) {
                throw new BufferOverflowException();
            }

            this.buffer[this.position++] = cOrSrcOrIndex;
        } else if (typeof cOrSrcOrIndex === "number" && offsetOrCOrStart !== undefined) {
            // A single code point absolute.
            if (cOrSrcOrIndex < 0 || cOrSrcOrIndex >= this.currentLimit) {
                throw new IndexOutOfBoundsException();
            }
            this.buffer[cOrSrcOrIndex] = offsetOrCOrStart;
        } else if (Array.isArray(cOrSrcOrIndex)) {
            // A code point sequence.
            const offset = offsetOrCOrStart ?? 0;
            const length = lengthOrEnd ?? cOrSrcOrIndex.length;

            if (offset < 0 || offset > cOrSrcOrIndex.length) {
                throw new IndexOutOfBoundsException();
            }

            if (this.currentPosition + offset > this.currentLimit) {
                throw new BufferOverflowException();
            }

            this.buffer.splice(this.currentPosition, length,
                ...cOrSrcOrIndex.slice(offset, offset + length));

            this.currentPosition += length;
        } else if (cOrSrcOrIndex instanceof CharBuffer) {
            const length = cOrSrcOrIndex.remaining();
            if (this.currentPosition + length > this.currentLimit) {
                throw new BufferOverflowException();
            }

            if (cOrSrcOrIndex === this) {
                throw new IllegalArgumentException();
            }

            this.buffer.splice(this.currentPosition, length,
                ...cOrSrcOrIndex.buffer.slice(cOrSrcOrIndex.currentPosition, cOrSrcOrIndex.currentLimit));

            this.currentPosition += length;
        } else {
            // A string.
            const src = cOrSrcOrIndex as string;
            const offset = offsetOrCOrStart ?? 0;
            const end = lengthOrEnd ?? src.length;
            if (this.currentPosition + end > this.currentLimit) {
                throw new BufferOverflowException();
            }

            if (offset < 0 || offset > src.length) {
                throw new IndexOutOfBoundsException();
            }

            for (let i = offset; i < end; ++i) {
                this.buffer[this.currentPosition++] = src.codePointAt(i);
            }
        }

        return this;
    }

    /**
     * Attempts to read characters into the specified character buffer.
     *
     * @param target The buffer to write the content to.
     *
     * @returns The number of characters added to the buffer, or -1 if this source of characters is at its end.
     */
    public read(target: CharBuffer): number {
        if (target.readOnly) {
            throw new ReadOnlyBufferException();
        }

        const length = Math.min(this.remaining(), target.remaining());
        const result = length === target.remaining() ? -1 : length;
        target.buffer.splice(target.currentPosition, length,
            ...this.buffer.slice(this.currentPosition, this.currentPosition + length));
        target.currentPosition += length;

        return result;
    }

    /** Creates a new char buffer whose content is a shared subsequence of this buffer's content. */
    public slice(): CharBuffer {
        throw new NotImplementedError();
    }

    /**
     * Creates a new character buffer that represents the specified subsequence of this buffer, relative to
     * the current position.
     *
     * @param start tbd
     * @param end tbd
     *
     * @returns The new char buffer.
     */
    public subSequence(start: number, end: number): CharBuffer {
        if (start < 0 || start > this.remaining() || end < start || end > this.remaining()) {
            throw new IndexOutOfBoundsException();
        }

        const buffer = new CharBuffer(this.buffer, this.currentPosition + start, this.currentPosition + end);
        buffer.readOnly = this.readOnly;

        return buffer;
    }

    /** @returns a string containing the characters in this buffer. */
    public toString(): string {
        return this.buffer.toString();
    }

}
