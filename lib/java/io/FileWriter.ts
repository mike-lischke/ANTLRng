/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

/* eslint-disable @typescript-eslint/unified-signatures */

import { Charset } from "../nio/charset";
import { File } from "./File";
import { FileDescriptor } from "./FileDescriptor";
import { FileOutputStream } from "./FileOutputStream";
import { OutputStreamWriter } from "./OutputStreamWriter";

export class FileWriter extends OutputStreamWriter {
    public constructor(fileName: string);
    public constructor(fileName: string, append: boolean);
    public constructor(file: File);
    public constructor(file: File, append: boolean);
    public constructor(fd: FileDescriptor);
    public constructor(fileName: string, charset: Charset);
    public constructor(fileName: string, charset: Charset, append: boolean);
    public constructor(file: File, charset: Charset);
    public constructor(file: File, charset: Charset, append: boolean);
    public constructor(fileNameOrFileOrFd: string | File | FileDescriptor, appendOrCharset?: boolean | Charset,
        append?: boolean) {
        let doAppend = false;
        let charset;
        if (typeof appendOrCharset === "boolean") {
            doAppend = appendOrCharset;
        } else if (append !== undefined) {
            doAppend = append;
            charset = appendOrCharset;
        }

        let stream: FileOutputStream;
        if (typeof fileNameOrFileOrFd === "string") {
            stream = new FileOutputStream(fileNameOrFileOrFd, doAppend);
        } else if (fileNameOrFileOrFd instanceof File) {
            stream = new FileOutputStream(fileNameOrFileOrFd, doAppend);
        } else {
            stream = new FileOutputStream(fileNameOrFileOrFd);
        }

        super(stream, charset);
    }
}
