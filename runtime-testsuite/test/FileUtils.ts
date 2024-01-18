/*
 * Copyright (c) 2012-2022 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { java, JavaObject, closeResources, handleResourceError, throwResourceError, S } from "jree";
import { RuntimeTestUtils } from "./RuntimeTestUtils.js";
import { Utils } from "antlr4ng";

type String = java.lang.String;
const String = java.lang.String;
type IOException = java.io.IOException;
const IOException = java.io.IOException;
type System = java.lang.System;
const System = java.lang.System;
type Path = java.nio.file.Path;
type Files = java.nio.file.Files;
const Files = java.nio.file.Files;
type StandardCharsets = java.nio.charset.StandardCharsets;
const StandardCharsets = java.nio.charset.StandardCharsets;
type PrintWriter = java.io.PrintWriter;
const PrintWriter = java.io.PrintWriter;
type File = java.io.File;
const File = java.io.File;
type BasicFileAttributes = java.nio.file.attribute.BasicFileAttributes;
type LinkOption = java.nio.file.LinkOption;
const LinkOption = java.nio.file.LinkOption;
type DosFileAttributes = java.nio.file.attribute.DosFileAttributes;

import { Test, Override } from "../decorators.js";

export class FileUtils extends JavaObject {
    public static writeFile(dir: String, fileName: String, content: String): void {
        try {
            Utils.writeFile(dir + RuntimeTestUtils.FileSeparator + fileName, content, "UTF-8");
        } catch (ioe) {
            if (ioe instanceof IOException) {
                System.err.println("can't write file");
                ioe.printStackTrace(System.err);
            } else {
                throw ioe;
            }
        }
    }

    public static readFile(dir: String, fileName: String): String {
        try {
            return String.copyValueOf(Utils.readFile(dir + "/" + fileName, "UTF-8"));
        } catch (ioe) {
            if (ioe instanceof IOException) {
                System.err.println("can't read file");
                ioe.printStackTrace(System.err);
            } else {
                throw ioe;
            }
        }

        return null;
    }

    public static replaceInFile(sourcePath: Path, target: String, replacement: String): void;

    public static replaceInFile(sourcePath: Path, destPath: Path, target: String, replacement: String): void;
    public static replaceInFile(...args: unknown[]): void {
        switch (args.length) {
            case 3: {
                const [sourcePath, target, replacement] = args as [Path, String, String];

                FileUtils.replaceInFile(sourcePath, sourcePath, target, replacement);

                break;
            }

            case 4: {
                const [sourcePath, destPath, target, replacement] = args as [Path, Path, String, String];

                const content = new String(Files.readAllBytes(sourcePath), StandardCharsets.UTF_8);
                const newContent = content.replace(target, replacement);
                {
                    // This holds the final error to throw (if any).
                    let error: java.lang.Throwable | undefined;

                    const out: PrintWriter = new PrintWriter(destPath.toString());
                    try {
                        try {
                            java.io.FileDescriptor.out.println(newContent);
                        }
                        finally {
                            error = closeResources([out]);
                        }
                    } catch (e) {
                        error = handleResourceError(e, error);
                    } finally {
                        throwResourceError(error);
                    }
                }

                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }

    public static mkdir(dir: String): void {
        const f = new File(dir);
        //noinspection ResultOfMethodCallIgnored
        f.mkdirs();
    }

    public static deleteDirectory(f: File): void {
        if (f.isDirectory() && !FileUtils.isLink(f.toPath())) {
            const files = f.listFiles();
            if (files !== null) {
                for (const c of files) {

                    FileUtils.deleteDirectory(c);
                }

            }
        }
        if (!f.delete()) {

            throw new IOException("Failed to delete file: " + f);
        }

    }

    public static isLink(path: Path): boolean {
        try {
            const attrs = Files.readAttributes(path, BasicFileAttributes.class, LinkOption.NOFOLLOW_LINKS);

            return attrs.isSymbolicLink() || (attrs instanceof DosFileAttributes && attrs.isOther());
        } catch (ignored) {
            if (ignored instanceof IOException) {
                return false;
            } else {
                throw ignored;
            }
        }
    }
}
