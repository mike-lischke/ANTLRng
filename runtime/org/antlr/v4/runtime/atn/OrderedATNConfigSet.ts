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
import { ATNConfigSet } from "./ATNConfigSet";
import { ObjectEqualityComparator } from "../misc/ObjectEqualityComparator";




/**
 *
 * @author Sam Harwell
 */
export  class OrderedATNConfigSet extends ATNConfigSet {

	public constructor() {
		super();
this.configLookup = new  OrderedATNConfigSet.LexerConfigHashSet();
	}

	public static LexerConfigHashSet =  class LexerConfigHashSet extends ATNConfigSet.AbstractConfigHashSet {
		public constructor() {
			super(ObjectEqualityComparator.INSTANCE);
		}
	};

}

// eslint-disable-next-line @typescript-eslint/no-namespace, no-redeclare
export namespace OrderedATNConfigSet {
	export type LexerConfigHashSet = InstanceType<typeof OrderedATNConfigSet.LexerConfigHashSet>;
}


