/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */


/* eslint-disable jsdoc/require-returns, jsdoc/require-param */


import { IntegerList, HashMap } from "antlr4ng";
import { GrammarAST } from "../tool/ast/GrammarAST.js";



/** */
export  class Utils {
	public static readonly  INTEGER_POOL_MAX_VALUE = 1000;

    public static  stripFileExtension(name: string):  string {
        if ( name===null ) {
 return null;
}

        let  lastDot = name.lastIndexOf('.');
        if ( lastDot<0 ) {
 return name;
}

        return name.substring(0, lastDot);
    }

	public static  join(a: Object[], separator: string):  string {
		let  buf = new  StringBuilder();
		for (let  i=0; i<a.length; i++) {
			let  o = a[i];
			buf.append(o.toString());
			if ( (i+1)<a.length ) {
				buf.append(separator);
			}
		}
		return buf.toString();
	}

	public static  sortLinesInString(s: string):  string {
		let  lines[] = s.split("\n");
		java.util.Arrays.sort(lines);
		let  linesL = java.util.Arrays.asList(lines);
		let  buf = new  StringBuilder();
		for (let l of linesL) {
			buf.append(l);
			buf.append('\n');
		}
		return buf.toString();
	}

	public static  nodesToStrings <T extends GrammarAST>(nodes: Array<T>):  Array<string> {
		if ( nodes === null ) {
 return null;
}

		let  a = new  Array<string>();
		for (let t of nodes) {
 a.add(t.getText());
}

		return a;
	}

//	public static <T> List<T> list(T... values) {
//		List<T> x = new ArrayList<T>(values.length);
//		for (T v : values) {
//			if ( v!=null ) x.add(v);
//		}
//		return x;
//	}

	public static  writeSerializedATNIntegerHistogram(filename: string, serializedATN: IntegerList):  void {
		let  histo = new  HashMap();
		for (let i of serializedATN.toArray()) {
			if ( histo.containsKey(i) ) {
				histo.put(i, histo.get(i) + 1);
			}
			else {
				histo.put(i, 1);
			}
		}
		let  sorted = new  java.util.TreeMap(histo);

		let  output = "";
		output += "value,count\n";
		for (let key of sorted.keySet()) {
			output += key+","+sorted.get(key)+"\n";
		}
		try {
			Files.write(Paths.get(filename), output.getBytes(StandardCharsets.UTF_8));
		} catch (ioe) {
if (ioe instanceof IOException) {
			System.err.println(ioe);
		} else {
	throw ioe;
	}
}
	}

	public static  capitalize(s: string):  string {
		return Character.toUpperCase(s.charAt(0)) + s.substring(1);
	}

	public static  decapitalize(s: string):  string {
		return Character.toLowerCase(s.charAt(0)) + s.substring(1);
	}

	/** apply methodName to list and return list of results. method has
	 *  no args.  This pulls data out of a list essentially.
	 */
	public static  select <From,To>(list: Array<From>, selector: Utils.Func1<From, To>):  Array<To> {
		if ( list===null ) {
 return null;
}

		let  b = new  Array<To>();
		for (let f of list) {
			b.add(selector.exec(f));
		}
		return b;
	}

	/** Find exact object type or subclass of cl in list */
	public static  find <T>(ops: Array<unknown>, cl: Class<T>):  T {
		for (let o of ops) {
			if ( cl.isInstance(o) ) {
 return cl.cast(o);
}

//			if ( o.getClass() == cl ) return o;
		}
		return null;
	}

	public static  indexOf <T>(elems: Array< T>, filter: Utils.Filter<T>):  number {
		for (let  i=0; i<elems.size(); i++) {
			if ( filter.select(elems.get(i)) ) {
 return i;
}

		}
		return -1;
	}

	public static  lastIndexOf <T>(elems: Array< T>, filter: Utils.Filter<T>):  number {
		for (let  i=elems.size()-1; i>=0; i--) {
			if ( filter.select(elems.get(i)) ) {
 return i;
}

		}
		return -1;
	}

	public static  setSize(list: Array<unknown>, size: number):  void {
		if (size < list.size()) {
			list.subList(size, list.size()).clear();
		}
		else {
			while (size > list.size()) {
				list.add(null);
			}
		}
	}

}

// eslint-disable-next-line @typescript-eslint/no-namespace, no-redeclare
export namespace Utils {
	export  interface Filter<T> {
		  select(t: T): boolean;
	}

	export  interface Func0<TResult> {
		  exec(): TResult;
	}

	export  interface Func1<T1, TResult> {
		  exec(arg1: T1): TResult;
	}

}


