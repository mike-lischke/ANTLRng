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




export  class LogManager {
    protected static Record = class Record {
		public  timestamp: bigint;
		public  location?: StackTraceElement;
		public  component?: string;
		public  msg?: string;
		public constructor() {
			this.timestamp = java.lang.System.currentTimeMillis();
			this.location = new  java.lang.Throwable().getStackTrace()[0];
		}

		public toString = (): string => {
            let  buf: java.lang.StringBuilder = new  java.lang.StringBuilder();
            buf.append(new  SimpleDateFormat("yyyy-MM-dd HH:mm:ss:SSS").format(new  Date(this.timestamp)));
            buf.append(" ");
            buf.append(this.component);
            buf.append(" ");
            buf.append(this.location.getFileName());
            buf.append(":");
            buf.append(this.location.getLineNumber());
            buf.append(" ");
            buf.append(this.msg);
            return buf.toString();
		}
	};


	protected records?:  java.util.List<LogManager.Record>;

    public log(msg: string): void;

	public log(component: string, msg: string): void;


	public log(msgOrComponent: string, msg?: string):  void {
if (msg === undefined) { this.log(undefined, msg); }
 else  {
let component = msgOrComponent as string;
		let  r: LogManager.Record = new  LogManager.Record();
		r.component = component;
		r.msg = msg;
		if ( this.records===undefined ) {
			this.records = new  java.util.ArrayList<LogManager.Record>();
		}
		this.records.add(r);
	}

}


    public save(): string;

    public save(filename: string): void;


    public save(filename?: string):  string |  void {
if (filename === undefined) {
        //String dir = System.getProperty("java.io.tmpdir");
        let  dir: string = ".";
        let  defaultFilename: string =
            dir + "/antlr-" +
            new  SimpleDateFormat("yyyy-MM-dd-HH.mm.ss").format(new  Date()) + ".log";
        this.save(defaultFilename);
        return defaultFilename;
    }
 else  {
        let  fw: FileWriter = new  FileWriter(filename);
        let  bw: BufferedWriter = new  BufferedWriter(fw);
        try {
            bw.write(this.toString());
        }
        finally {
            bw.close();
        }
    }

}


    public toString = (): string => {
        if ( this.records===undefined ) {
 return "";
}

        let  nl: string = java.lang.System.getProperty("line.separator");
        let  buf: java.lang.StringBuilder = new  java.lang.StringBuilder();
        for (let r of this.records) {
            buf.append(r);
            buf.append(nl);
        }
        return buf.toString();
    }

    public static main = (args: string[]): void => {
        let  mgr: LogManager = new  LogManager();
        mgr.log("atn", "test msg");
        mgr.log("dfa", "test msg 2");
        java.lang.System.out.println(mgr);
        mgr.save();
    }
}

namespace LogManager {

type Record = InstanceType<typeof LogManager.Record>;
}


