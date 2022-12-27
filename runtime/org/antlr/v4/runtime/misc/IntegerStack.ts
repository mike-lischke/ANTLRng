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


import { IntegerList } from "./IntegerList";




/**
 *
 * @author Sam Harwell
 */
export  class IntegerStack extends IntegerList {

	public constructor();

	public constructor(capacity: number);

	public constructor(list: IntegerStack| null);
public constructor(capacityOrList?: number | IntegerStack | null) {
if (capacityOrList === undefined) {
	super();
}
 else if (typeof capacityOrList === "number") {
const capacity = capacityOrList as number;
		super(capacity);
	}
 else  {
let list = capacityOrList as IntegerStack;
		super(list);
	}

}


	public readonly  push = (value: number):  void => {
		this.add(value);
	}

	public readonly  pop = ():  number => {
		return this.removeAt(this.size() - 1);
	}

	public readonly  peek = ():  number => {
		return this.get(this.size() - 1);
	}

}
