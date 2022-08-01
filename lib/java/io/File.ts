/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

/** cspell: ignore mkdirs */

/* eslint-disable @typescript-eslint/unified-signatures */

import path from "path";
import fs from "fs";

import { Comparable } from "../lang";

export class File implements Comparable<File> {
    public static readonly separator = path.sep;
    public static readonly separatorChar = path.sep;
    public static readonly pathSeparator = path.sep;

    private path: string;

    public constructor(parent: File, child: string);
    public constructor(pathName: string);
    public constructor(parent: string | undefined, child: string);
    public constructor(uri: URL);
    public constructor(parentOrPathNameOrUri?: File | string | URL, child?: string) {
        if (!parentOrPathNameOrUri) {
            this.path = path.normalize(child);
        } else if (typeof parentOrPathNameOrUri === "string") {
            this.path = path.resolve(path.normalize(parentOrPathNameOrUri), path.normalize(child));
        } else if (parentOrPathNameOrUri instanceof File) {
            this.path = path.resolve(path.normalize(parentOrPathNameOrUri.path), path.normalize(child));
        } else {
            this.path = parentOrPathNameOrUri.pathname;
        }
    }

    public isAbsolute(): boolean {
        return path.isAbsolute(this.path);
    }

    public getPath(): string {
        return this.path;
    }

    public getAbsolutePath(): string {
        return path.resolve(this.path);
    }

    public getParentFile(): File {
        return new File(path.dirname(this.path));
    }

    public mkdirs(): boolean {
        fs.mkdirSync(this.path, { recursive: true });

        return true;
    }

    public compareTo(other: File): number {
        return this.path.localeCompare(other.path);
    }
}

