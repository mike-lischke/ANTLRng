/*
 * Copyright (c) 2012-2022 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import * as path from "path";
import * as fs from "fs";

export class FileUtils {
    public static writeFile(dir: string, fileName: string, content: string): void {
        try {
            fs.writeFileSync(path.join(dir, fileName), content, { encoding: "utf-8" });
        } catch (ioe) {
            if (ioe instanceof Error) {
                console.error("can't write file");
                console.error(ioe.stack);
            } else {
                throw ioe;
            }
        }
    }

    public static readFile(dir: string, fileName: string): string | null {
        try {
            return fs.readFileSync(dir + "/" + fileName, { encoding: "utf-8" });
        } catch (ioe) {
            if (ioe instanceof Error) {
                console.error("can't read file");
                console.error(ioe.stack);
            } else {
                throw ioe;
            }
        }

        return null;
    }

    public static mkdir(dir: string): void {
        fs.mkdirSync(dir, { recursive: true });
    }

    public static deleteDirectory(f: string): void {
        const stat = fs.statSync(f);
        if (stat.isDirectory() && !stat.isSymbolicLink()) {
            fs.rmdirSync(f, { recursive: true });
        } else {
            fs.unlinkSync(f);
        }
    }

    public static isLink(path: string): boolean {
        try {
            return fs.lstatSync(path).isSymbolicLink();
        } catch (e) {
            return false;
        }
    }

    public static copyFileOrFolder(from: string, to: string): void {
        const stat = fs.statSync(from);
        if (stat.isDirectory()) {
            fs.mkdirSync(to, { recursive: true });
            fs.readdirSync(from).forEach((f) => {
                FileUtils.copyFileOrFolder(path.join(from, f), path.join(to, f));
            });
        } else {
            fs.copyFileSync(from, to);
        }
    }
}
