/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */


/*
 eslint-disable @typescript-eslint/no-namespace, @typescript-eslint/naming-convention,
 max-classes-per-file, jsdoc/check-tag-names, @typescript-eslint/no-empty-function,
 @typescript-eslint/restrict-plus-operands, @typescript-eslint/unified-signatures, @typescript-eslint/member-ordering,
 no-underscore-dangle
*/

/* cspell: disable */



import { ATNState } from "./ATNState";
import { Transition } from "./Transition";
import { IntervalSet } from "../misc/IntervalSet";




/** TODO: make all transitions sets? no, should remove set edges */
export  class AtomTransition extends Transition {
	/** The token type or character value; or, signifies special label. */
	public readonly  label:  number;

	public constructor(target: ATNState, label: number) {
		super(target);
		this.label = label;
	}

	public getSerializationType = (): number => {
		return Transition.ATOM;
	}

	public label = (): IntervalSet => { return IntervalSet.of(this.label); }

	public matches = (symbol: number, minVocabSymbol: number, maxVocabSymbol: number): boolean => {
		return this.label === symbol;
	}

	public toString = (): string => {
		return String(this.label);
	}
}
