/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, Mike Lischke
 *
 * See LICENSE file for more info.
 */

import { OutputStream } from "./OutputStream";

// Internal class to provide print stream like access to stdout and stderr.
export class SystemOutputStream extends OutputStream {

    public constructor(private forErrors: boolean) {
        super();
    }

    public close(): void {
        // no-op
    }

    public flush(): void {
        // The stream auto-flushes.
    }

    public write(b: Uint8Array | number): void;
    public write(b: Uint8Array, off: number, len: number): void;
    public write(b: Uint8Array | number, off?: number, len?: number): void {
        if (typeof b === "number") {
            const s = String.fromCodePoint(b);
            this.forErrors ? process.stderr.write(s) : process.stdout.write(s);
        } else {
            const offset = off ?? 0;
            const length = len ?? b.length;
            this.forErrors
                ? process.stderr.write(b.subarray(offset, length))
                : process.stdout.write(b.subarray(offset, length));
        }
    }
}
