/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

/* eslint-disable @typescript-eslint/naming-convention, @typescript-eslint/unified-signatures */

import { Appendable, CharSequence, CodePoint } from "../lang";
import { AutoCloseable } from "./AutoCloseable";
import { Closeable } from "./Closeable";
import { Flushable } from "./Flushable";

export abstract class Writer implements Closeable, Flushable, Appendable, AutoCloseable {
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
    public abstract write(c: CodePoint): void;

    /**
     * Writes an array of characters.
     *
     * @param  array
     *         Array of characters to be written
     *
     * @throws  IOException
     *          If an I/O error occurs
     */
    public abstract write(array: Uint32Array): void;

    /**
     * Writes a portion of an array of characters.
     *
     * @param  array
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
    public abstract write(array: Uint32Array, off: number, len: number): void;

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
    public abstract write(str: string): void;

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
    public abstract write(str: string, off: number, len: number): void;

    public abstract append(c: CodePoint): this;

    public abstract append(csq: CharSequence): this;

    public abstract append(csq: CharSequence, start: number, end: number): this;

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
