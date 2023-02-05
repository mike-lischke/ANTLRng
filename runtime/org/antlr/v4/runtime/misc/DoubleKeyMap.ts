/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */




import { java,JavaObject } from "jree";




/** Sometimes we need to map a key to a value but key is two pieces of data.
 *  This nested hash table saves creating a single key each time we access
 *  map; avoids mem creation.
 */
export class DoubleKeyMap<Key1, Key2, Value> extends JavaObject {
	protected  data: java.util.Map<Key1, java.util.Map<Key2, Value>> | null = new  java.util.LinkedHashMap<Key1, java.util.Map<Key2, Value>>();

	public put = (k1: Key1| null, k2: Key2| null, v: Value| null):  Value | null => {
		 let  data2: java.util.Map<Key2, Value> = this.data.get(k1);
		 let  prev: Value = null;
		if ( data2===null ) {
			data2 = new  java.util.LinkedHashMap<Key2, Value>();
			this.data.put(k1, data2);
		}
		else {
			prev = data2.get(k2);
		}
		data2.put(k2, v);
		return prev;
	}

	public get(k1: Key1| null):  java.util.Map<Key2, Value> | null;

	public get(k1: Key1| null, k2: Key2| null):  Value | null;


	public get(k1: Key1 | null, k2?: Key2 | null):  java.util.Map<Key2, Value> | null |  Value | null {
if (k2 === undefined) { return this.data.get(k1); }
 else  {
		 let  data2: java.util.Map<Key2, Value> = this.data.get(k1);
		if ( data2===null ) {
 return null;
}

		return data2.get(k2);
	}

}


	/** Get all values associated with primary key */
	public values = (k1: Key1| null):  java.util.Collection<Value> | null => {
		 let  data2: java.util.Map<Key2, Value> = this.data.get(k1);
		if ( data2===null ) {
 return null;
}

		return data2.values();
	}

	/** get all primary keys */
	public keySet():  java.util.Set<Key1> | null;

	/** get all secondary keys associated with a primary key */
	public keySet(k1: Key1| null):  java.util.Set<Key2> | null;


	/** get all primary keys */
	public keySet(k1?: Key1 | null):  java.util.Set<Key1> | null |  java.util.Set<Key2> | null {
if (k1 === undefined) {
		return this.data.keySet();
	}
 else  {
		 let  data2: java.util.Map<Key2, Value> = this.data.get(k1);
		if ( data2===null ) {
 return null;
}

		return data2.keySet();
	}

}

}
