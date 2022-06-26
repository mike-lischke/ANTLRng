/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, Mike Lischke
 *
 * See LICENSE file for more info.
 */

import { NotImplementedError } from "../../NotImplementedError";
import { CodePoint, IllegalArgumentException } from "../lang";
import { Readable } from "../lang/Readable";
import { CharBuffer } from "../nio/CharBuffer";
import { ReadOnlyBufferException } from "../nio/ReadOnlyBufferException";
import { AutoCloseable } from "./AutoCloseable";
import { Closable } from "./Closable";
import { IOException } from "./IOException";

export abstract class Reader implements Closable, AutoCloseable, Readable {
    // Maximum skip-buffer size.
    private static readonly maxSkipBufferSize = 8192;

    // Skip buffer, null until allocated.
    private skipBuffer: CodePoint[];

    // Marks the present position in the stream.
    public mark(_readAheadLimit: number): void {
        throw new IOException("mark() not supported");
    }

    // Tells whether this stream supports the mark() operation.
    public markSupported(): boolean {
        return false;
    }

    public read(target?: CodePoint[] | CharBuffer): CodePoint;
    public /* abstract */ read(target: CodePoint[], offset: number, length: number): number;
    public read(target?: CodePoint[] | CharBuffer, offset?: number, length?: number): number {
        if (target === undefined) {
            // Reads a single character.
            const temp = [0];
            this.read(temp, 0, 1);

            return temp[0];
        } else if (Array.isArray(target)) {
            // Reads characters into an array.
            if (offset !== undefined || length !== undefined) {
                // Simulate the abstract method.
                throw new NotImplementedError();
            }

            return this.read(target, 0, target.length);
        } else {
            // Attempts to read characters into the specified character buffer.
            if (target.isReadOnly()) {
                throw new ReadOnlyBufferException();
            }

            let readCount = 0;
            if (target.hasArray()) {
                const buffer = target.array();
                const pos = target.position;
                const rem = Math.max(target.limit - pos, 0);
                const off = target.arrayOffset() + pos;
                readCount = this.read(buffer, off, rem);
                if (readCount > 0) {
                    target.position = pos + readCount;
                }
            } else {
                const len = target.remaining();
                const buffer = new Array<CodePoint>(len);
                readCount = this.read(buffer, 0, len);
                if (readCount > 0) {
                    target.put(buffer, 0, readCount);
                }
            }

            return readCount;

        }
    }

    // Tells whether this stream is ready to be read.
    public ready(): boolean {
        return false;
    }

    // Resets the stream.
    public reset(): void {
        throw new IOException("reset() not supported");
    }

    // Skips characters.
    public skip(n: number): number {
        if (n < 0) {
            throw new IllegalArgumentException("skip value is negative");
        }

        const nn = Math.min(n, Reader.maxSkipBufferSize);

        // Note: the Java code wraps the following code in a synchronized block, which we apparently not need.
        if ((this.skipBuffer === undefined) || (this.skipBuffer.length < nn)) {
            this.skipBuffer = new Array(nn);
        }

        let r = n;
        while (r > 0) {
            const nc = this.read(this.skipBuffer, 0, Math.min(r, nn));
            if (nc === -1) {
                break;
            }
            r -= nc;
        }

        return n - r;

    }

    // Closes the stream and releases any system resources associated with it.
    public abstract close(): void;
}
