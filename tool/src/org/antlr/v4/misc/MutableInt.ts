/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */


/* eslint-disable jsdoc/require-returns, jsdoc/require-param */



export  class MutableInt extends java.lang.Number implements Comparable<MutableInt> {
	public  v:  number;

	public  constructor(v: number) { this.v = v; }

	@Override
public override  equals(o: Object):  boolean {
		if ( o instanceof java.lang.Number ) {
 return this.v === (o as java.lang.Number).intValue();
}

		return false;
	}

	@Override
public override  hashCode():  number { return this.v; }

	@Override
public  compareTo(o: MutableInt):  number { return this.v-o.intValue(); }
	@Override
public override  intValue():  number { return this.v; }
	@Override
public override  longValue():  bigint { return this.v; }
	@Override
public override  floatValue():  number { return this.v; }
	@Override
public override  doubleValue():  number { return this.v; }

	@Override
public override  toString():  string {
		return string.valueOf(this.v);
	}
}
