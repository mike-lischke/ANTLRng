/* java2ts: keep */

/*
 * Copyright (c) 2012-2022 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import path from "path";
import os from "os";
import { readFileSync } from "fs";

import { OSType } from "./OSType.js";

export abstract class RuntimeTestUtils {
    public static readonly NewLine = os.EOL;
    public static readonly PathSeparator = path.delimiter;
    public static readonly FileSeparator = path.sep;
    public static readonly TempDirectory = os.tmpdir();

    public static readonly runtimePath = "runtime/";
    public static readonly runtimeTestsuitePath = "runtime-testsuite";
    public static readonly resourcePath = "runtime-testsuite/resources";

    private static readonly resourceCache = new Map<string, string>();
    private static detectedOS: OSType = OSType.Invalid;

    public static isWindows(): boolean {
        return RuntimeTestUtils.getOS() === OSType.Windows;
    }

    public static getOS(): OSType {
        if (RuntimeTestUtils.detectedOS === OSType.Invalid) {
            switch (os.type()) {
                case "Windows_NT":
                    RuntimeTestUtils.detectedOS = OSType.Windows;
                    break;

                case "Linux":
                    RuntimeTestUtils.detectedOS = OSType.Linux;
                    break;

                case "Darwin":
                    RuntimeTestUtils.detectedOS = OSType.Mac;
                    break;

                default:
                    RuntimeTestUtils.detectedOS = OSType.Unknown;
                    break;
            }
        }

        return RuntimeTestUtils.detectedOS;
    }

    public static getTextFromResource(name: string): string {
        let text = RuntimeTestUtils.resourceCache.get(name);
        if (!text) {
            const resPath = path.join(RuntimeTestUtils.resourcePath, name);
            text = readFileSync(resPath, "utf8");
            RuntimeTestUtils.resourceCache.set(name, text);
        }

        return text;
    }

    public static joinLines(...args: string[]): string {
        let result = "";
        for (const arg of args) {
            result += arg;
            if (!arg.endsWith("\n")) {
                result += "\n";
            }
        }

        return result;
    }
}
