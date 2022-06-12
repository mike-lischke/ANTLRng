/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, Mike Lischke
 *
 * See LICENSE file for more info.
 */

import fs from "fs";
import Stream from "stream";

import { FileDescriptor } from "./FileDescriptor";

// Actually implements FileDescriptor.
export class FileDescriptorImpl extends FileDescriptor {

    // Value set for file system paths.
    private fd = -1;

    // For standard streams (stdin etc.).
    private stream?: Stream;

    public static fromPath(path: string, flags: string, mode: string): FileDescriptorImpl {
        const descriptor = new FileDescriptorImpl();
        descriptor.fd = fs.openSync(path, flags, mode);

        return descriptor;
    }

    public static fromStream(stream: Stream): FileDescriptorImpl {
        const descriptor = new FileDescriptorImpl();
        descriptor.stream = stream;

        return descriptor;
    }

    public close(): void {
        // Can only close file system objects. FDs 0, 1, and 2 refer to standard streams.
        if (this.fd > 2) {
            fs.closeSync(this.fd);
        }
    }

    public sync(): void {
        if (this.fd > 2) {
            fs.fdatasyncSync(this.fd);
        }

        // A stream is automatically flushed on write.
        // TODO: wait for completion if `write` could not immediately flush.
    }

    public valid(): boolean {
        return this.fd > 2 || this.stream !== undefined;
    }

    public write(data: number): void;
    public write(data: Uint8Array, offset?: number, length?: number): void;
    public write(data: Uint8Array | number, offset?: number, length?: number): void {
        // Note: if data is a number, actually a single byte is meant.
        if (this.fd > 2) {
            let array: Uint8Array;
            if (data instanceof Uint8Array) {
                if (offset === undefined && length === undefined) {
                    array = data;
                } else {
                    array = data.subarray(offset, offset + length);
                }

            } else {
                array = new Uint8Array(1);
                array[0] = data & 0xFF;

            }
            fs.writeSync(this.fd, array);
        }
    }
}
