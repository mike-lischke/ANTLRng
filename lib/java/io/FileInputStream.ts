/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

/* eslint-disable @typescript-eslint/unified-signatures */

import { readSync } from "fs";
import * as fs from "fs/promises";

import { IndexOutOfBoundsException, Throwable } from "../lang";
import { AutoCloseable } from "./AutoCloseable";
import { File } from "./File";
import { FileDescriptor } from "./FileDescriptor";
import { InputStream } from "./InputStream";
import { IOException } from "./IOException";

export class FileInputStream extends InputStream implements AutoCloseable {
    private fd: FileDescriptor;
    private path: string;

    /**
     * Creates a FileInputStream by opening a connection to an actual file, the file named by the File object
     * file in the file system.
     */
    public constructor(file: File);
    /**
     * Creates a FileInputStream by using the file descriptor fdObj, which represents an existing connection
     * to an actual file in the file system.
     */
    public constructor(fdObj: FileDescriptor);
    /**
     * Creates a FileInputStream by opening a connection to an actual file, the file named by the path name
     * in the file system.
     */
    public constructor(name: string);
    public constructor(fileOrFdObjOrName: File | FileDescriptor | string) {
        super();

        if (fileOrFdObjOrName instanceof File) {
            this.path = fileOrFdObjOrName.getPath();
            this.fd = new FileDescriptor();
            this.open();
        } else if (typeof fileOrFdObjOrName === "string") {
            this.path = fileOrFdObjOrName;
            this.fd = new FileDescriptor();
            this.open();
        } else {
            this.fd = fileOrFdObjOrName;
        }

        this.fd.attach(this);
    }

    /** Reads the next byte of data from the input stream. */
    public read(): number;
    /** Reads some number of bytes from the input stream and stores them into the buffer array b. */
    public read(b: Uint8Array): number;
    /** Reads up to len bytes of data from the input stream into an array of bytes. */
    public read(b: Uint8Array, offset: number, length: number): number;
    public read(b?: Uint8Array, offset?: number, length?: number): number {
        if (!b) {
            const buffer = Buffer.alloc(1);
            const read = readSync(this.fd.handle.fd, buffer, 0, 1, undefined);

            if (read === 0) {
                return -1;
            }

            return buffer.at(0);
        }

        offset ??= 0;
        length ??= b.length;

        if (offset < 0 || length < 0 || offset + length > b.length) {
            throw new IndexOutOfBoundsException();
        }

        const read = readSync(this.fd.handle.fd, b, offset ?? 0, length ?? b.length, undefined);
        if (read === 0) {
            return - 1;
        }

        return read;
    }

    public getFD(): FileDescriptor {
        return this.fd;
    }

    private open(): void {
        fs.open(this.path, "r", 0x400).then((handle) => {
            this.fd.handle = handle;
        }).catch((reason) => {
            throw new IOException("Cannot open file", Throwable.fromError(reason));
        });
    }
}
