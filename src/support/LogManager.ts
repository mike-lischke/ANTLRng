import { writeFileSync } from "fs";
import { join } from "path";

/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

export class LogManager {
    private static Record = class Record {
        protected timestamp: Date;
        protected location: string;

        #details: { component?: string, msg: string; };

        public constructor(details: { component?: string, msg: string; }) {
            this.#details = details;
            this.timestamp = new Date();

            const stack = new Error().stack?.split("\n") ?? [];
            this.location = stack.length > 1 ? stack[1] : "<no location>";
        }

        public toString(): string {
            return `${this.timestamp.toISOString()} ${this.#details.component ?? ""} <filename goes here>:` +
                `<line number goes here> ${this.location} ${this.#details.msg}`;
        }
    };

    private records: Array<InstanceType<typeof LogManager.Record>> = [];

    public log(info: { component?: string, msg: string; }): void {
        this.records.push(new LogManager.Record(info));
    }

    public save(filename?: string): string {
        if (!filename) {
            filename = join(".", `antlr-${Date.now()}.log`);
        }

        writeFileSync(filename, this.toString());

        return filename;
    }

    public toString(): string {
        return this.records.join("\n");
    }
}
