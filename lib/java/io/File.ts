/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, Mike Lischke
 *
 * See LICENSE file for more info.
 */

/** cspell: ignore mkdirs */

import path from "path";
import fs from "fs";

export class File {
    public static readonly separator = path.sep;
    public static readonly separatorChar = path.sep;
    public static readonly pathSeparator = path.sep;

    private path: string;

    public constructor(pathName: string);
    public constructor(parent: string | undefined, child: string);
    // eslint-disable-next-line @typescript-eslint/unified-signatures
    public constructor(parent: File, child: string);
    // eslint-disable-next-line @typescript-eslint/unified-signatures
    public constructor(uri: URL);
    public constructor(pathNameOrParentOrUrl?: string | File | URL, child?: string) {
        if (!pathNameOrParentOrUrl) {
            this.path = path.resolve(child);
        } else if (typeof pathNameOrParentOrUrl === "string") {
            this.path = path.resolve(pathNameOrParentOrUrl, child);
        } else if (pathNameOrParentOrUrl instanceof File) {
            this.path = path.resolve(pathNameOrParentOrUrl.path, child);
        } else {
            this.path = pathNameOrParentOrUrl.pathname;
        }
    }

    public isAbsolute(): boolean {
        return true;
    }

    public getAbsolutePath(): string {
        return this.path;
    }

    public getParentFile(): File {
        return new File(path.dirname(this.path));
    }

    public mkdirs(): boolean {
        fs.mkdirSync(this.path, { recursive: true });

        return true;
    }
}

