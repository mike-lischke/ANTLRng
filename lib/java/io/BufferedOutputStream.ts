/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { IllegalArgumentException } from "../lang";
import { FilterOutputStream } from "./FilterOutputStream";
import { OutputStream } from "./OutputStream";

export class BufferedOutputStream extends FilterOutputStream {

    protected buf: Uint8Array;
    protected count = 0;

    public constructor(out: OutputStream, size?: number) {
        super(out);

        this.buf = new Uint8Array(size ?? 0xFFFF);
    }

    public write(b: Uint8Array): void;
    public write(b: Uint8Array, off: number, len: number): void;
    // eslint-disable-next-line @typescript-eslint/unified-signatures
    public write(b: number): void;
    public write(b: Uint8Array | number, off?: number, len?: number): void {
        if (typeof b === "number") {
            this.buf[this.count++] = b & 0xFF;
            if (this.count === this.buf.length) {
                this.flush();
            }
        } else {
            const offset = off ?? 0;
            const length = len ?? b.length;
            if (offset + length > b.length) {
                throw new IllegalArgumentException("The specified values exceed the size of the specified source.");
            }

            const data = b.subarray(offset, offset + length);

            // Write the new data directly if it exceeds the buffer size.
            if (this.count + data.length >= this.buf.length) {
                this.flush();

                this.out.write(data);
            } else {
                this.buf.set(data, this.count);
                this.count += data.length;
            }

            if (this.count === this.buf.length) {
                this.flush();
            }
        }
    }

    public flush(): void {
        if (this.count > 0) {
            this.out.write(this.buf, 0, this.count);
            this.count = 0;
        }
    }

    public close(): void {
        this.out.close();
    }
}
