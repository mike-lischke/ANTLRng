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



import { java } from "../../../../../../lib/java/java";
import { ATNState } from "./ATNState";
import { Transition } from "./Transition";
import { IntervalSet } from "../misc/IntervalSet";




export  class RangeTransition extends Transition {
	public readonly  from:  number;
	public readonly  to:  number;

	public constructor(target: ATNState, from: number, to: number) {
		super(target);
		this.from = from;
		this.to = to;
	}

	public getSerializationType = (): number => {
		return Transition.RANGE;
	}

	public label = (): IntervalSet => { return IntervalSet.of(this.from, this.to); }

	public matches = (symbol: number, minVocabSymbol: number, maxVocabSymbol: number): boolean => {
		return symbol >= this.from && symbol <= this.to;
	}

	public toString = (): string => {
		return new  java.lang.StringBuilder("'")
				.appendCodePoint(this.from)
				.append("'..'")
				.appendCodePoint(this.to)
				.append("'")
				.toString();
	}
}
