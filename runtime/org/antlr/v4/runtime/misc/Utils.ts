/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */


/*
 eslint-disable @typescript-eslint/no-namespace, @typescript-eslint/naming-convention,
 max-classes-per-file, jsdoc/check-tag-names, @typescript-eslint/no-empty-function,
 @typescript-eslint/restrict-plus-operands, @typescript-eslint/unified-signatures, @typescript-eslint/member-ordering,
 no-underscore-dangle
*/

/* cspell: disable */



import { java } from "../../../../../../lib/java/java";
import { IntegerList } from "./IntegerList";
import { IntervalSet } from "./IntervalSet";




export  class Utils {
    // Seriously: why isn't this built in to java? ugh!
    public static join <T>(iter: Iterator<T>, separator: string): string;

	public static join <T>(array: T[], separator: string): string;

    // Seriously: why isn't this built in to java? ugh!
    public static join <T>(iterOrArray: Iterator<T> | T[], separator: string):  string {
if (iterOrArray instanceof Iterator && ) {
const iter = iterOrArray as Iterator<T>;
        let  buf: java.lang.StringBuilder = new  java.lang.StringBuilder();
        while ( iter.hasNext() ) {
            buf.append(iter.next());
            if ( iter.hasNext() ) {
                buf.append(separator);
            }
        }
        return buf.toString();
    }
 else  {
let array = iterOrArray as T[];
		let  builder: java.lang.StringBuilder = new  java.lang.StringBuilder();
		for (let  i: number = 0; i < array.length; i++) {
			builder.append(array[i]);
			if (i < array.length - 1) {
				builder.append(separator);
			}
		}

		return builder.toString();
	}

}


	public static numNonnull = (data: object[]): number => {
		let  n: number = 0;
		if ( data === undefined ) {
 return n;
}

		for (let o of data) {
			if ( o!==undefined ) {
 n++;
}

		}
		return n;
	}

	public  static removeAllElements =  <T>(data: java.util.Collection<T>, value: T): void => {
		if ( data===undefined ) {
 return;
}

		while ( data.contains(value) ) data.remove(value);
	}

	public static escapeWhitespace = (s: string, escapeSpaces: boolean): string => {
		let  buf: java.lang.StringBuilder = new  java.lang.StringBuilder();
		for (let c of s.toCharArray()) {
			if ( c===' ' && escapeSpaces ) {
 buf.append('\u00B7');
}

			else { if ( c==='\t' ) {
 buf.append("\\t");
}

			else { if ( c==='\n' ) {
 buf.append("\\n");
}

			else { if ( c==='\r' ) {
 buf.append("\\r");
}

			else { buf.append(c);
}

}

}

}

		}
		return buf.toString();
	}

	public static writeFile(fileName: string, content: string): void;

	public static writeFile(fileName: string, content: string, encoding: string): void;


	public static writeFile(fileName: string, content: string, encoding?: string):  void {
if (encoding === undefined) {
		Utils.writeFile(fileName, content, undefined);
	}
 else  {
		let  f: java.io.File = new  java.io.File(fileName);
		let  fos: java.io.FileOutputStream = new  java.io.FileOutputStream(f);
		let  osw: OutputStreamWriter;
		if (encoding !== undefined) {
			osw = new  OutputStreamWriter(fos, encoding);
		}
		else {
			osw = new  OutputStreamWriter(fos);
		}

		try {
			osw.write(content);
		}
		finally {
			osw.close();
		}
	}

}



	public static readFile(fileName: string): number[];


	public static readFile(fileName: string, encoding: string): number[];



	public static readFile(fileName: string, encoding?: string):  number[] {
if (encoding === undefined) {
		return Utils.readFile(fileName, undefined);
	}
 else  {
		let  f: java.io.File = new  java.io.File(fileName);
		let  size: number = Number(f.length());
		let  isr: InputStreamReader;
		let  fis: FileInputStream = new  FileInputStream(fileName);
		if ( encoding!==undefined ) {
			isr = new  InputStreamReader(fis, encoding);
		}
		else {
			isr = new  InputStreamReader(fis);
		}
		let  data: number[] = undefined;
		try {
			data = new   Array<number>(size);
			let  n: number = isr.read(data);
			if (n < data.length) {
				data = java.util.Arrays.copyOf(data, n);
			}
		}
		finally {
			isr.close();
		}
		return data;
	}

}


	/** Convert array of strings to string&rarr;index map. Useful for
	 *  converting rulenames to name&rarr;ruleindex map.
	 */
	public static toMap = (keys: string[]): Map<string, java.lang.Integer> => {
		let  m: Map<string, java.lang.Integer> = new  java.util.HashMap<string, java.lang.Integer>();
		for (let  i: number=0; i<keys.length; i++) {
			m.set(keys[i], i);
		}
		return m;
	}

	public static toCharArray = (data: IntegerList): number[] => {
		if ( data===undefined ) {
 return undefined;
}

		return data.toCharArray();
	}

	public static toSet = (bits: BitSet): IntervalSet => {
		let  s: IntervalSet = new  IntervalSet();
		let  i: number = bits.nextSetBit(0);
		while ( i >= 0 ) {
			s.add(i);
			i = bits.nextSetBit(i+1);
		}
		return s;
	}

	/** @since 4.6 */
	public static expandTabs = (s: string, tabSize: number): string => {
		if ( s===undefined ) {
 return undefined;
}

		let  buf: java.lang.StringBuilder = new  java.lang.StringBuilder();
		let  col: number = 0;
		for (let  i: number = 0; i<s.length; i++) {
			let  c: number = s.charAt(i);
			switch ( c ) {
				case '\n' :
					col = 0;
					buf.append(c);
					break;
				case '\t' :
					let  n: number = tabSize-col%tabSize;
					col+=n;
					buf.append(Utils.spaces(n));
					break;
				default :
					col++;
					buf.append(c);
					break;
			}
		}
		return buf.toString();
	}

	/** @since 4.6 */
	public static spaces = (n: number): string => {
		return Utils.sequence(n, " ");
	}

	/** @since 4.6 */
	public static newlines = (n: number): string => {
		return Utils.sequence(n, "\n");
	}

	/** @since 4.6 */
	public static sequence = (n: number, s: string): string => {
		let  buf: java.lang.StringBuilder = new  java.lang.StringBuilder();
		for (let  sp: number=1; sp<=n; sp++) buf.append(s);
		return buf.toString();
	}

	/** @since 4.6 */
	public static count = (s: string, x: number): number => {
		let  n: number = 0;
		for (let  i: number = 0; i<s.length; i++) {
			if ( s.charAt(i)===x ) {
				n++;
			}
		}
		return n;
	}
}
