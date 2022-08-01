/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { AutoCloseable } from "./AutoCloseable";
import { Closeable } from "./Closeable";
import { Flushable } from "./Flushable";

export abstract class OutputStream implements Closeable, Flushable, AutoCloseable {
    public abstract close(): void;
    public abstract flush(): void;

    // Writes b.length bytes from the specified byte array to this output stream.
    public abstract write(b: Uint8Array): void;

    // Writes len bytes from the specified byte array starting at offset off to this output stream.
    public abstract write(b: Uint8Array, off: number, len: number): void;

    // Writes the specified byte to this output stream.
    // eslint-disable-next-line @typescript-eslint/unified-signatures
    public abstract write(b: number): void;
}
