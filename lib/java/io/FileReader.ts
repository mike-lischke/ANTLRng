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
import { FileInputStream } from "./FileInputStream";
import { InputStreamReader } from "./InputStreamReader";

export class FileReader extends InputStreamReader {
    /**
     * Creates a new {@code FileReader}, given the name of the file to read,
     * using the {@link Charset#defaultCharset() default charset}.
     *
     * @param      fileName the name of the file to read
     * @throws     FileNotFoundException  if the named file does not exist,
     *             is a directory rather than a regular file,
     *             or for some other reason cannot be opened for
     *             reading.
     * @see        Charset#defaultCharset()
     */
    public constructor(fileName: string);
    /**
     * Creates a new {@code FileReader}, given the {@code File} to read,
     * using the {@linkplain Charset#defaultCharset() default charset}.
     *
     * @param      file the {@code File} to read
     * @throws     FileNotFoundException  if the file does not exist,
     *             is a directory rather than a regular file,
     *             or for some other reason cannot be opened for
     *             reading.
     * @see        Charset#defaultCharset()
     */
    public constructor(file: File);
    /**
     * Creates a new {@code FileReader}, given the {@code FileDescriptor} to read,
     * using the {@linkplain Charset#defaultCharset() default charset}.
     *
     * @param fd the {@code FileDescriptor} to read
     * @see Charset#defaultCharset()
     */
    public constructor(fd: FileDescriptor);
    /**
     * Creates a new {@code FileReader}, given the name of the file to read
     * and the {@linkplain Charset charset}.
     *
     * @param      fileName the name of the file to read
     * @param      charset the {@linkplain Charset charset}
     * @throws     IOException  if the named file does not exist,
     *             is a directory rather than a regular file,
     *             or for some other reason cannot be opened for
     *             reading.
     */
    public constructor(fileName: string, charset: Charset);
    /**
     * Creates a new {@code FileReader}, given the {@code File} to read and
     * the {@linkplain Charset charset}.
     *
     * @param      file the {@code File} to read
     * @param      charset the {@linkplain Charset charset}
     * @throws     IOException  if the file does not exist,
     *             is a directory rather than a regular file,
     *             or for some other reason cannot be opened for
     *             reading.
     */
    public constructor(file: File, charset: Charset);
    public constructor(fileNameOrFileOrFd: string | File | FileDescriptor, charset?: Charset) {
        if (typeof fileNameOrFileOrFd === "string") {
            super(new FileInputStream(fileNameOrFileOrFd), charset);
        } else if (fileNameOrFileOrFd instanceof File) {
            super(new FileInputStream(fileNameOrFileOrFd), charset);
        } else {
            super(new FileInputStream(fileNameOrFileOrFd), charset);
        }
    }

}
