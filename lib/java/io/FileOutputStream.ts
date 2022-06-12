/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, Mike Lischke
 *
 * See LICENSE file for more info.
 */

import { OutputStream } from "./OutputStream";
import { File } from "./File";
import { FileDescriptor } from "./FileDescriptor";
import { FileDescriptorImpl } from "./FileDescriptorImpl";
import { FileNotFoundException } from "./FileNotFoundException";
import { IOException } from "./IOException";
import { Throwable } from "../lang";

export class FileOutputStream extends OutputStream {

    private descriptor: FileDescriptorImpl;

    // Creates a file output stream to write to the file represented by the specified File object.
    public constructor(file: File, append?: boolean);
    // Creates a file output stream to write to the specified file descriptor, which represents an existing connection
    // to an actual file in the file system.
    public constructor(fdObj: FileDescriptor);
    // Creates a file output stream to write to the file with the specified name.
    // eslint-disable-next-line @typescript-eslint/unified-signatures
    public constructor(name: string, append?: boolean);
    public constructor(fileOrFdObjOrName: File | FileDescriptor | string, append?: boolean) {
        super();

        try {
            if (fileOrFdObjOrName instanceof FileDescriptor) {
                this.descriptor = fileOrFdObjOrName as FileDescriptorImpl;
            } else {
                const name = fileOrFdObjOrName instanceof File
                    ? fileOrFdObjOrName.getAbsolutePath()
                    : fileOrFdObjOrName;
                if (append) {
                    this.descriptor = FileDescriptorImpl.fromPath(name, "a", "0400");
                } else {
                    this.descriptor = FileDescriptorImpl.fromPath(name, "w", "0200");
                }
            }
        } catch (error) {
            throw new FileNotFoundException("Create open or create file", new Throwable(String(error)));
        }
    }

    // Closes this output stream and releases any system resources associated with this stream.
    public close(): void {
        try {
            this.flush();
            this.descriptor.close();
        } catch (error) {
            throw new FileNotFoundException("Cannot close file", new Throwable(String(error)));
        }
    }

    // Flushes this output stream and forces any buffered output bytes to be written out.
    public flush(): void {
        this.descriptor.sync();
    }

    // Writes b.length bytes from the specified byte array to this output stream.
    public write(b: Uint8Array): void;
    // Writes len bytes from the specified byte array starting at offset off to this output stream.
    public write(b: Uint8Array, off: number, len: number): void;
    // Writes the specified byte to this output stream.
    // eslint-disable-next-line @typescript-eslint/unified-signatures
    public write(b: number): void;
    public write(b: Uint8Array | number, off?: number, len?: number): void {
        try {
            if (typeof b === "number") {
                this.descriptor.write(b);
            } else {
                this.descriptor.write(b, off, len);
            }
        } catch (error) {
            throw new IOException("Cannot write data to file", new Throwable(String(error)));
        }
    }

    public getFD(): FileDescriptor {
        return this.descriptor;
    }
}
