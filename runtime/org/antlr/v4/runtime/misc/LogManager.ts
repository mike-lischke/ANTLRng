/* java2ts: keep */

/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/*
 eslint-disable @typescript-eslint/no-namespace, @typescript-eslint/naming-convention, no-redeclare,
 max-classes-per-file, jsdoc/check-tag-names, @typescript-eslint/no-empty-function,
 @typescript-eslint/restrict-plus-operands, @typescript-eslint/unified-signatures, @typescript-eslint/member-ordering,
 no-underscore-dangle, max-len
*/

/* cspell: disable */

import { java } from "../../../../../../lib/java/java";

export class LogManager {
    public static Record = class Record {
        public currentDate = new Date();
        public location?: java.lang.StackTraceElement;
        public component?: string;
        public msg?: string;

        public constructor() {
            this.location = new java.lang.Throwable().getStackTrace()[0];
        }

        public toString = (): string => {
            const buf = new java.lang.StringBuilder();
            buf.append(this.currentDate.toISOString());
            buf.append(" ");
            buf.append(this.component);
            buf.append(" ");
            buf.append(this.location.getFileName());
            buf.append(":");
            buf.append(this.location.getLineNumber());
            buf.append(" ");
            buf.append(this.msg);

            return buf.toString();
        };
    };

    protected records?: LogManager.Record[];

    public log(msg: string): void;
    public log(component: string, msg: string): void;
    public log(msgOrComponent: string, msg?: string): void {
        if (msg === undefined) { this.log(undefined, msg); } else {
            const component = msgOrComponent;
            const r = new LogManager.Record();
            r.component = component;
            r.msg = msg;
            if (this.records === undefined) {
                this.records = [];
            }

            this.records.push(r);
        }

    }

    public save(): string;

    public save(filename: string): void;

    public save(filename?: string): string | void {
        if (filename === undefined) {
            const dir = ".";
            const defaultFilename = dir + "/antlr-" + new Date().toISOString() + ".log";
            this.save(defaultFilename);

            return defaultFilename;
        } else {
            const fw = new FileWriter(filename);
            const bw = new BufferedWriter(fw);
            try {
                bw.write(this.toString());
            } finally {
                bw.close();
            }
        }

    }

    public toString = (): string => {
        if (this.records === undefined) {
            return "";
        }

        const nl = java.lang.System.getProperty("line.separator");
        const buf = new java.lang.StringBuilder();
        for (const r of this.records) {
            buf.append(r);
            buf.append(nl);
        }

        return buf.toString();
    };
}

namespace LogManager {
    export type Record = InstanceType<typeof LogManager.Record>;
}

