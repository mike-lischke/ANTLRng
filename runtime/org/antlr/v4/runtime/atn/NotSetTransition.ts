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
import { SetTransition } from "./SetTransition";
import { Transition } from "./Transition";
import { IntervalSet } from "../misc/IntervalSet";




export  class NotSetTransition extends SetTransition {
	public constructor(target: ATNState, set: IntervalSet) {
		super(target, set);
	}

	public getSerializationType = (): number => {
		return Transition.NOT_SET;
	}

	public matches = (symbol: number, minVocabSymbol: number, maxVocabSymbol: number): boolean => {
		return symbol >= minVocabSymbol
			&& symbol <= maxVocabSymbol
			&& !(super.matches(symbol, minVocabSymbol, maxVocabSymbol));
	}

	public toString = (): string => {
		return '~'+super.toString();
	}
}
