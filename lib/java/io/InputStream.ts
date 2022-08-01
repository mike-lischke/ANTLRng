/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

/* eslint-disable @typescript-eslint/unified-signatures */
/* eslint-disable jsdoc/require-returns */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/naming-convention */

/* cspell: ignore readlimit */

import { NotImplementedError } from "../../NotImplementedError";
import { IndexOutOfBoundsException } from "../lang";
import { Closeable } from "./Closeable";
import { IOException } from "./IOException";

export abstract class InputStream implements Closeable {
    // MAX_SKIP_BUFFER_SIZE is used to determine the maximum buffer size to
    // use when skipping.
    private static readonly MAX_SKIP_BUFFER_SIZE = 2048;

    /**
     * Returns an estimate of the number of bytes that can be read (or skipped over) from this input stream without
     * blocking by the next invocation of a method for this input stream.
     */
    public available(): number {
        return 0;
    }

    /** Closes this input stream and releases any system resources associated with the stream. */
    public close(): void {
        // Overridden by descendants.
    }

    /**
     * Marks the current position in this input stream.
     *
     * @param readlimit The maximum limit of bytes that can be read before the mark position becomes invalid.
     */
    public mark(readlimit: number): void {
        // Overridden by descendants.
    }

    /** Tests if this input stream supports the mark and reset methods. */
    public markSupported(): boolean {
        return false;
    }

    /** Repositions this stream to the position at the time the mark method was last called on this input stream. */
    public reset(): void {
        throw new IOException("mark/reset not supported");
    }

    /**
     * Skips over and discards n bytes of data from this input stream.
     *
     * @param n The number of bytes to skip. If < 1 nothing is skipped.
     */
    public skip(n: number): number {
        let remaining = n;

        if (n <= 0) {
            return 0;
        }

        const size = Math.min(InputStream.MAX_SKIP_BUFFER_SIZE, remaining);
        const skipBuffer = Buffer.alloc(size);
        while (remaining > 0) {
            const nr = this.read(skipBuffer, 0, Math.min(size, remaining));
            if (nr < 0) {
                break;
            }
            remaining -= nr;
        }

        return n - remaining;
    }

    /** Reads the next byte of data from the input stream. */
    public abstract read(): number;

    /** Reads some number of bytes from the input stream and stores them into the buffer b. */
    public abstract read(b: Uint8Array): number;

    /** Reads up to len bytes of data from the input stream into an array of bytes. */
    public abstract read(b: Uint8Array, off: number, len: number): number;

}
