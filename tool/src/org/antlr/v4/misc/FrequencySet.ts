/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */


/* eslint-disable jsdoc/require-returns, jsdoc/require-param */


import { MutableInt } from "./MutableInt.js";
import { HashMap } from "antlr4ng";



/** Count how many of each key we have; not thread safe */
export  class FrequencySet<T> extends HashMap<T, MutableInt> {
	public  count(key: T):  number {
		let  value = this.get(key);
		if (value === null) {
 return 0;
}

		return value.v;
	}
	public  add(key: T):  void {
		let  value = this.get(key);
		if (value === null) {
			value = new  MutableInt(1);
			this.put(key, value);
		}
		else {
			value.v++;
		}
	}
}
