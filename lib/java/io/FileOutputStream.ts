/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

// eslint-disable-next-line max-classes-per-file
import * as fs from "fs/promises";

import { OutputStream } from "./OutputStream";
import { File } from "./File";
import { FileDescriptor } from "./FileDescriptor";
import { FileNotFoundException } from "./FileNotFoundException";
import { IOException } from "./IOException";
import { IndexOutOfBoundsException, Throwable } from "../lang";
import { writeSync } from "fs";

export class FileOutputStream extends OutputStream {

    private fd: FileDescriptor;
    private path: string;
    private closed = true;

    /** Creates a file output stream to write to the file represented by the specified File object. */
    public constructor(file: File, append?: boolean);
    /**
     * Creates a file output stream to write to the specified file descriptor, which represents an existing connection
     * to an actual file in the file system.
     */
    public constructor(fdObj: FileDescriptor);
    /** Creates a file output stream to write to the file with the specified name. */
    // eslint-disable-next-line @typescript-eslint/unified-signatures
    public constructor(name: string, append?: boolean);
    public constructor(fileOrFdObjOrName: File | FileDescriptor | string, append?: boolean) {
        super();

        try {
            if (fileOrFdObjOrName instanceof FileDescriptor) {
                this.fd = fileOrFdObjOrName;
            } else {
                this.path = fileOrFdObjOrName instanceof File
                    ? fileOrFdObjOrName.getAbsolutePath()
                    : fileOrFdObjOrName;
                this.fd = new FileDescriptor();
                this.open(append ?? false);
            }
        } catch (error) {
            throw new FileNotFoundException("Create open or create file", Throwable.fromError(error));
        }
    }

    /** Closes this output stream and releases any system resources associated with this stream. */
    public close(): void {
        if (this.closed) {
            return;
        }

        this.closed = true;
        this.fd.closeAll(new class {
            public constructor(private fd: FileDescriptor) { }

            public close(): void {
                this.fd.close();
            }
        }(this.fd));
    }

    /** Flushes this output stream and forces any buffered output bytes to be written out. */
    public flush(): void {
        this.fd.sync();
    }

    /** Writes b.length bytes from the specified byte array to this output stream. */
    public write(b: Uint8Array): void;
    /** Writes len bytes from the specified byte array starting at offset off to this output stream. */
    public write(b: Uint8Array, offset: number, length: number): void;
    /** Writes the specified byte to this output stream. */
    // eslint-disable-next-line @typescript-eslint/unified-signatures
    public write(b: number): void;
    public write(b: Uint8Array | number, offset?: number, length?: number): void {
        try {
            if (typeof b === "number") {
                const buffer = new Uint8Array(1);
                buffer[0] = b;
                writeSync(this.fd.handle.fd, buffer, 0, 1);
            } else {
                offset ??= 0;
                length ??= b.length;
                if (offset < 0 || length < 0 || offset + length > b.length) {
                    throw new IndexOutOfBoundsException();
                }

                writeSync(this.fd.handle.fd, b, offset, length);
            }
        } catch (error) {
            throw new IOException("Cannot write data to file", Throwable.fromError(error));
        }
    }

    public getFD(): FileDescriptor {
        return this.fd;
    }

    private open(append: boolean): void {
        fs.open(this.path, append ? "as" : "w", 0x400).then((handle) => {
            this.fd.handle = handle;
            this.closed = false;
        }).catch((reason) => {
            throw new IOException("Cannot open file", Throwable.fromError(reason));
        });
    }
}
