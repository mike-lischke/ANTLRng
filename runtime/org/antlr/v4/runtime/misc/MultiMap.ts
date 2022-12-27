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
import { Pair } from "./Pair";




export  class MultiMap<K, V> extends java.util.LinkedHashMap<K, java.util.List<V>> {
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
