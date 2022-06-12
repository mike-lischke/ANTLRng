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
import { AtomTransition } from "./AtomTransition";
import { RangeTransition } from "./RangeTransition";
import { Transition } from "./Transition";




/**
 * Utility class to create {@link AtomTransition}, {@link RangeTransition},
 * and {@link SetTransition} appropriately based on the range of the input.
 *
 * Previously, we distinguished between atom and range transitions for
 * Unicode code points <= U+FFFF and those above. We used a set
 * transition for a Unicode code point > U+FFFF. Now that we can serialize
 * 32-bit int/chars in the ATN serialization, this is no longer necessary.
 */
export  class CodePointTransitions {
	/** Return new {@link AtomTransition} */
	public static createWithCodePoint = (target: ATNState, codePoint: number): Transition => {
		return CodePointTransitions.createWithCodePointRange(target, codePoint, codePoint);
	}

	/** Return new {@link AtomTransition} if range represents one atom else {@link SetTransition}. */
	public static createWithCodePointRange = (target: ATNState, codePointFrom: number, codePointTo: number): Transition => {
		return codePointFrom === codePointTo
				? new  AtomTransition(target, codePointFrom)
				: new  RangeTransition(target, codePointFrom, codePointTo);
	}
}
