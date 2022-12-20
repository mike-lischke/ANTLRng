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




import { ATNState } from "./ATNState";
import { Transition } from "./Transition";
import { Token } from "../Token";
import { IntervalSet } from "../misc/IntervalSet";




/** A transition containing a set of values. */
export  class SetTransition extends Transition {
	public readonly  set:  IntervalSet | null;

	// TODO (sam): should we really allow null here?
	public constructor(target: ATNState| null, set: IntervalSet| null) {
		super(target);
		if ( set === null ) {
 set = IntervalSet.of(Token.INVALID_TYPE);
}

		this.set = set;
	}

	public getSerializationType = ():  number => {
		return Transition.SET;
	}

	public label = ():  IntervalSet | null => { return this.set; }

	public matches = (symbol: number, minVocabSymbol: number, maxVocabSymbol: number):  boolean => {
		return this.set.contains(symbol);
	}

	public toString = ():  java.lang.String | null => {
		return this.set.toString();
	}
}
