/* java2ts: keep */

/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { java, JavaObject, S } from "jree";

export class LogManager extends JavaObject {
    public static Record = class Record extends JavaObject {
        public component: java.lang.String | null = null;
        public msg: java.lang.String | null = null;

        protected timestamp: bigint;
        protected location: java.lang.StackTraceElement | null;

        public constructor() {
            super();
            this.timestamp = java.lang.System.currentTimeMillis();
            this.location = new java.lang.Throwable().getStackTrace()[0];
        }

        public toString = (): java.lang.String => {
            const buf = new java.lang.StringBuilder();
            buf.append(new java.text.SimpleDateFormat(S`yyyy-MM-dd HH:mm:ss:SSS`)
                .format(new java.util.Date(this.timestamp)));
            buf.append(S` `);
            buf.append(this.component);
            buf.append(S` `);
            buf.append(this.location?.getFileName());
            buf.append(S`:`);
            buf.append(this.location?.getLineNumber());
            buf.append(S` `);
            buf.append(this.msg);

            return buf.toString();
        };
    };

    protected records: java.util.List<LogManager.Record> | null = null;

    public static main = (args: java.lang.String[]): void => {
        const mgr = new LogManager();
        mgr.log(S`atn`, S`test msg`);
        mgr.log(S`dfa`, S`test msg 2`);
        java.lang.System.out.println(mgr);
        mgr.save();
    };

    public log(msg: java.lang.String): void;
    public log(component: java.lang.String, msg: java.lang.String): void;
    public log(msgOrComponent: java.lang.String, msg?: java.lang.String): void {
        const component = msg ? msgOrComponent : null;
        const r = new LogManager.Record();
        r.component = component;
        r.msg = msg ?? msgOrComponent;

        if (this.records === null) {
            this.records = new java.util.ArrayList<LogManager.Record>();
        }
        this.records.add(r);
    }

    public save(): java.lang.String;
    public save(filename: java.lang.String): void;
    public save(filename?: java.lang.String): java.lang.String | void {
        if (filename === undefined) {
            const time = new java.text.SimpleDateFormat(S`yyyy-MM-dd-HH.mm.ss`).format(new java.util.Date());
            const defaultFilename = S`./antlr-${time}.log`;
            this.save(defaultFilename);

            return defaultFilename;
        } else {
            const fw = new java.io.FileWriter(filename);
            const bw = new java.io.BufferedWriter(fw);
            try {
                bw.write(this.toString());
            } finally {
                bw.close();
            }
        }

    }

    public toString = (): java.lang.String => {
        if (this.records === null) {
            return S``;
        }

        const nl = java.lang.System.getProperty(S`line.separator`);
        const buf = new java.lang.StringBuilder();
        for (const r of this.records) {
            buf.append(r);
            buf.append(nl);
        }

        return buf.toString();
    };
}

// eslint-disable-next-line @typescript-eslint/no-namespace, no-redeclare
export namespace LogManager {
    export type Record = InstanceType<typeof LogManager.Record>;
}
