/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, Mike Lischke
 *
 * See LICENSE file for more info.
 */

import os from "os";

import { Console, PrintStream } from "../io";
import { SystemOutputStream } from "../io/SystemOutputStream";

const consoleInstance = new Console();
const errorStream = new PrintStream(new SystemOutputStream(true));
const outputStream = new PrintStream(new SystemOutputStream(false));

// A partial implementation of Java's System type.
export class System {
    public static arraycopy<T>(src: T[], srcPos: number, dest: T[], destPos: number, count: number): void {
        dest.splice(destPos, count, ...src.slice(srcPos, srcPos + count));
    }

    public static console(): Console {
        return consoleInstance;
    }

    public static get err(): PrintStream {
        return errorStream;
    }

    public static get out(): PrintStream {
        return outputStream;
    }

    public static getProperty(key: string, def?: string): string | undefined {
        switch (key) {
            case "user.dir": {
                return process.cwd();
            }

            case "user.home": {
                return process.env.HOME;
            }

            case "user.name": {
                return process.env.USER;
            }

            case "line.separator": {
                return os.EOL;
            }

            default: {
                return def;
            }
        }
    }
}
