/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, Mike Lischke
 *
 * See LICENSE file for more info.
 */

/* eslint-disable @typescript-eslint/naming-convention, @typescript-eslint/unified-signatures */

import { NotImplementedError } from "../../NotImplementedError";
import { Appendable, CharSequence, CodePoint, IndexOutOfBoundsException } from "../lang";
import { AutoCloseable } from "./AutoCloseable";
import { Closeable } from "./Closable";
import { Flushable } from "./Flushable";

export abstract class Writer implements Closeable, Flushable, Appendable, AutoCloseable {

    /**
     * Size of writeBuffer, must be >= 1
     */
    private static readonly WRITE_BUFFER_SIZE = 1024;

    /**
     * The object used to synchronize operations on this stream.  For
     * efficiency, a character-stream object may use an object other than
     * itself to protect critical sections.  A subclass should therefore use
     * the object in this field rather than {@code this} or a synchronized
     * method.
     * Note: this is not used in TS to synchronize anything, because there's only a single thread.
     */
    protected lock: unknown;

    /**
     * Temporary buffer used to hold writes of strings and single characters
     */
    private writeBuffer?: Uint32Array;

    /**
     * Creates a new character-stream writer whose critical sections will
     * synchronize on the given object.
     *
     * @param  lock Object to synchronize on (not used in the TS implementation).
     */
    protected constructor(lock?: unknown) {
        this.lock = lock ?? this;
    }

    /**
     * Writes a single character.  The character to be written is contained in
     * the 16 low-order bits of the given integer value; the 16 high-order bits
     * are ignored.
     *
     * <p> Subclasses that intend to support efficient single-character output
     * should override this method.
     *
     * @param  c
     *         int specifying a character to be written
     *
     * @throws  IOException
     *          If an I/O error occurs
     */
    public write(c: CodePoint): void;
    /**
     * Writes an array of characters.
     *
     * @param  cbuf
     *         Array of characters to be written
     *
     * @throws  IOException
     *          If an I/O error occurs
     */
    public write(cbuf: Uint32Array): void;
    /**
     * Writes a portion of an array of characters.
     *
     * @param  cbuf
     *         Array of characters
     *
     * @param  off
     *         Offset from which to start writing characters
     *
     * @param  len
     *         Number of characters to write
     *
     * @throws  IndexOutOfBoundsException
     *          Implementations should throw this exception
     *          if {@code off} is negative, or {@code len} is negative,
     *          or {@code off + len} is negative or greater than the length
     *          of the given array
     *
     * @throws  IOException
     *          If an I/O error occurs
     */
    public /* abstract */ write(array: Uint32Array, off: number, len: number): void;

    /**
     * Writes a string.
     *
     * @param  str
     *         String to be written
     *
     * @throws  IOException
     *          If an I/O error occurs
     */
    // eslint-disable-next-line @typescript-eslint/unified-signatures
    public write(str: string): void;
    /**
     * Writes a portion of a string.
     *
     * The implementation in this class throws an
     * {@code IndexOutOfBoundsException} for the indicated conditions;
     * overriding methods may choose to do otherwise.
     *
     * @param  str
     *         A String
     *
     * @param  off
     *         Offset from which to start writing characters
     *
     * @param  len
     *         Number of characters to write
     *
     * @throws  IndexOutOfBoundsException
     *          Implementations should throw this exception
     *          if {@code off} is negative, or {@code len} is negative,
     *          or {@code off + len} is negative or greater than the length
     *          of the given string
     *
     * @throws  IOException
     *          If an I/O error occurs
     */
    public write(str: string, off: number, len: number): void;
    public write(cOrArrayOrStr: CodePoint | Uint32Array | string, off?: number, len?: number): void {
        if (typeof cOrArrayOrStr === "number") {
            // synchronized(lock) {
            if (!this.writeBuffer) {
                this.writeBuffer = new Uint32Array(Writer.WRITE_BUFFER_SIZE);
            }

            this.writeBuffer[0] = cOrArrayOrStr;
            this.write(this.writeBuffer, 0, 1);
            // }
        } else {
            if (off < 0 || len < 0 || off + len > cOrArrayOrStr.length) {
                throw new IndexOutOfBoundsException();
            }

            if (cOrArrayOrStr instanceof Uint32Array) {
                //const start = off ?? 0;
                //const length = len ?? cOrcBufOrStr.length;

                throw new NotImplementedError("abstract");
            } else {
                // synchronized(lock) {
                const codePoints: number[] = [];
                for (const value of cOrArrayOrStr.substring(off, off + len)) {
                    codePoints.push(value.codePointAt(0));
                }

                const array = Uint32Array.from(codePoints);
                this.write(array);

                // }

            }
        }
    }

    public append(c: CodePoint): this;
    // eslint-disable-next-line @typescript-eslint/unified-signatures
    public append(csq: CharSequence): this;
    public append(csq: CharSequence, start: number, end: number): this;
    public append(cOrCsq: CodePoint | CharSequence, start?: number, end?: number): this {
        if (typeof cOrCsq === "number") {
            this.write(cOrCsq);
        } else {
            this.write(cOrCsq.toString(), start, end - start);
        }

        return this;
    }

    /**
     * Flushes the stream.  If the stream has saved any characters from the
     * various write() methods in a buffer, write them immediately to their
     * intended destination.  Then, if that destination is another character or
     * byte stream, flush it.  Thus one flush() invocation will flush all the
     * buffers in a chain of Writers and OutputStreams.
     *
     * <p> If the intended destination of this stream is an abstraction provided
     * by the underlying operating system, for example a file, then flushing the
     * stream guarantees only that bytes previously written to the stream are
     * passed to the operating system for writing; it does not guarantee that
     * they are actually written to a physical device such as a disk drive.
     *
     * @throws  IOException
     *          If an I/O error occurs
     */
    public abstract flush(): void;

    /**
     * Closes the stream, flushing it first. Once the stream has been closed,
     * further write() or flush() invocations will cause an IOException to be
     * thrown. Closing a previously closed stream has no effect.
     *
     * @throws  IOException
     *          If an I/O error occurs
     */
    public abstract close(): void;

}
