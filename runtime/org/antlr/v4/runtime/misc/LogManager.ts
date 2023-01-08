/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */




import { java } from "../../../../../../lib/java/java";


import { JavaObject } from "../../../../../../lib/java/lang/Object";
import { S } from "../../../../../../lib/templates";


export  class LogManager extends JavaObject {
    protected static Record =  class Record extends JavaObject {
		protected  timestamp: bigint;
		protected  location: java.lang.StackTraceElement | null;
		protected  component: java.lang.String | null;
		protected  msg: java.lang.String | null;
		public constructor() {
			super();
this.timestamp = java.lang.System.currentTimeMillis();
			this.location = new  java.lang.Throwable().getStackTrace()[0];
		}

		public toString = ():  java.lang.String | null => {
            let  buf: java.lang.StringBuilder = new  java.lang.StringBuilder();
            buf.append(new  SimpleDateFormat(S`yyyy-MM-dd HH:mm:ss:SSS`).format(new  Date(this.timestamp)));
            buf.append(S` `);
            buf.append(this.component);
            buf.append(S` `);
            buf.append(this.location.getFileName());
            buf.append(S`:`);
            buf.append(this.location.getLineNumber());
            buf.append(S` `);
            buf.append(this.msg);
            return buf.toString();
		}
	};


	protected records:  java.util.List<LogManager.Record> | null;

    public log(msg: java.lang.String| null):  void;

	public log(component: java.lang.String| null, msg: java.lang.String| null):  void;


	public log(msgOrComponent: java.lang.String | null, msg?: java.lang.String | null):  void {
if (msg === undefined) { this.log(null, msg); }
 else  {
let component = msgOrComponent as java.lang.String;
		let  r: LogManager.Record = new  LogManager.Record();
		r.component = component;
		r.msg = msg;
		if ( this.records===null ) {
			this.records = new  java.util.ArrayList<LogManager.Record>();
		}
		this.records.add(r);
	}

}


    public save():  java.lang.String | null;

    public save(filename: java.lang.String| null):  void;


    public save(filename?: java.lang.String | null):  java.lang.String | null |  void {
if (filename === undefined) {
        //String dir = System.getProperty("java.io.tmpdir");
        let  dir: java.lang.String = S`.`;
        let  defaultFilename: java.lang.String =
            dir + S`/antlr-` +
            new  SimpleDateFormat(S`yyyy-MM-dd-HH.mm.ss`).format(new  Date()) + S`.log`;
        this.save(defaultFilename);
        return defaultFilename;
    }
 else  {
        let  fw: java.io.FileWriter = new  java.io.FileWriter(filename);
        let  bw: java.io.BufferedWriter = new  java.io.BufferedWriter(fw);
        try {
            bw.write(this.toString());
        }
        finally {
            bw.close();
        }
    }

}


    public toString = ():  java.lang.String | null => {
        if ( this.records===null ) {
 return S``;
}

        let  nl: java.lang.String = java.lang.System.getProperty(S`line.separator`);
        let  buf: java.lang.StringBuilder = new  java.lang.StringBuilder();
        for (let r of this.records) {
            buf.append(r);
            buf.append(nl);
        }
        return buf.toString();
    }

    public static main = (args: java.lang.String[]| null):  void => {
        let  mgr: LogManager = new  LogManager();
        mgr.log(S`atn`, S`test msg`);
        mgr.log(S`dfa`, S`test msg 2`);
        java.lang.System.out.println(mgr);
        mgr.save();
    }
}

// eslint-disable-next-line @typescript-eslint/no-namespace, no-redeclare
export namespace LogManager {
	// @ts-expect-error, because of protected inner class.
	export type Record = InstanceType<typeof LogManager.Record>;
}


