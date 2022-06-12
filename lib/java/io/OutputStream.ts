/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, Mike Lischke
 *
 * See LICENSE file for more info.
 */

export abstract class OutputStream /* implements Closable, Flushable, AutoClosable */ {
    // Closes this output stream and releases any system resources associated with this stream.
    public abstract close(): void;

    // Flushes this output stream and forces any buffered output bytes to be written out.
    public abstract flush(): void;

    // Writes b.length bytes from the specified byte array to this output stream.
    public abstract write(b: Uint8Array): void;

    // Writes len bytes from the specified byte array starting at offset off to this output stream.
    public abstract write(b: Uint8Array, off: number, len: number): void;

    // Writes the specified byte to this output stream.
    // eslint-disable-next-line @typescript-eslint/unified-signatures
    public abstract write(b: number): void;
}
