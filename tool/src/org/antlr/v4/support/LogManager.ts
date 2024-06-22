/* java2ts: keep */

import { writeFileSync } from "fs";
import { join } from "path";

/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/* eslint-disable jsdoc/require-returns, jsdoc/require-param */

// cspell: disable

export class LogManager {
    private static Record = class Record {
        public component: string | null = null;
        public msg: string;

        protected timestamp: Date;
        protected location: string;

        public constructor() {
            this.timestamp = new Date();

            const stack = new Error().stack?.split("\n") ?? [];
            this.location = stack.length > 1 ? stack[1] : "<no location>";
        }

        public toString(): string {
            let result = "";
            result += this.timestamp.toISOString();
            result += " ";
            result += this.component;
            result += " ";
            result += "<filename goes here>";
            result += ":";
            result += "<line number goes here>";
            result += " ";
            result += this.msg;

            return result.toString();
        }
    };

    private records: Array<InstanceType<typeof LogManager.Record>> = [];

    public log(msg: string): void;
    public log(component: string, msg: string): void;
    public log(...args: unknown[]): void {
        let component: string | null = null;
        let msg: string;

        if (args.length === 1) {
            msg = args[0] as string;
        } else {
            component = args[0] as string;
            msg = args[1] as string;
        }

        const r = new LogManager.Record();
        r.component = component;
        r.msg = msg;
        this.records.push(r);
    }

    public save(filename?: string): string {
        if (!filename) {
            filename = join(".", "antlr-" + Date.now() + ".log");
        }

        writeFileSync(filename, this.toString());

        return filename;
    }

    public toString(): string {
        return this.records.join("\n");
    }
}
