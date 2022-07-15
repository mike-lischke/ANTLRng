/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, Mike Lischke
 *
 * See LICENSE file for more info.
 */

/* eslint-disable @typescript-eslint/unified-signatures */

import { AutoCloseable } from "./AutoCloseable";
import { File } from "./File";
import { FileDescriptor } from "./FileDescriptor";
import { InputStream } from "./InputStream";

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
            this.fd = new FileDescriptor(this.path, "r", 0x444);
        } else if (typeof fileOrFdObjOrName === "string") {
            this.path = fileOrFdObjOrName;
            this.fd = new FileDescriptor(this.path, "r", 0x444);
        } else {
            this.fd = fileOrFdObjOrName;
        }

        this.fd.attach(this);
    }

    /** Reads the next byte of data from the input stream. */
    public read(): number;
    /** Reads some number of bytes from the input stream and stores them into the buffer array b. */
    public read(b: Buffer): number;
    /** Reads up to len bytes of data from the input stream into an array of bytes. */
    public read(b: Buffer, offset: number, length: number): number;
    public read(b?: Buffer, offset?: number, length?: number): number {
        if (!b) {
            const buffer = Buffer.alloc(1);
            const read = this.fd.readData(buffer);
            if (read === 0) {
                return -1;
            }

            return buffer.at(0);
        }

        return this.fd.readData(b, offset, length);
    }
}
