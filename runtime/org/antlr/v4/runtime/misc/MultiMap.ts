/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */




import { java } from "jree";
import { Pair } from "./Pair";




export class MultiMap<K, V> extends java.util.LinkedHashMap<K, java.util.List<V>> {
	public map = (key: K| null, value: V| null):  void => {
		 let  elementsForKey: java.util.List<V> = this.get(key);
		if ( elementsForKey===null ) {
			elementsForKey = new  java.util.ArrayList<V>();
			super.put(key, elementsForKey);
		}
		elementsForKey.add(value);
	}

	public getPairs = ():  java.util.List<Pair<K,V>> | null => {
		 let  pairs: java.util.List<Pair<K,V>> = new  java.util.ArrayList<Pair<K,V>>();
		for (let key of this.keySet()) {
			for (let value of this.get(key)) {
				pairs.add(new  Pair<K,V>(key, value));
			}
		}
		return pairs;
	}
}
