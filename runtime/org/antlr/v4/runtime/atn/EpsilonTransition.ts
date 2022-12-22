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


import { S } from "../../../../../../lib/templates";


export  class EpsilonTransition extends Transition {

	private readonly  outermostPrecedenceReturn:  number;

	/* eslint-disable constructor-super, @typescript-eslint/no-unsafe-call */
public constructor(target: ATNState| null);

	public constructor(target: ATNState| null, outermostPrecedenceReturn: number);
/* @ts-expect-error, because of the super() call in the closure. */
public constructor(target: ATNState | null, outermostPrecedenceReturn?: number) {
const $this = (target: ATNState | null, outermostPrecedenceReturn?: number): void => {
if (outermostPrecedenceReturn === undefined) {
		$this(target, -1);
	}
 else  {

/* @ts-expect-error, because of the super() call in the closure. */
		super(target);
		this.outermostPrecedenceReturn = outermostPrecedenceReturn;
	}
};

$this(target, outermostPrecedenceReturn);

}
/* eslint-enable constructor-super, @typescript-eslint/no-unsafe-call */

	/**
	  @returns the rule index of a precedence rule for which this transition is
	 * returning from, where the precedence value is 0; otherwise, -1.
	 *
	 * @see ATNConfig#isPrecedenceFilterSuppressed()
	 * @see ParserATNSimulator#applyPrecedenceFilter(ATNConfigSet)
	 *
	 */
	public outermostPrecedenceReturn = ():  number => {
		return this.outermostPrecedenceReturn;
	}

	public getSerializationType = ():  number => {
		return Transition.EPSILON;
	}

	public isEpsilon = ():  boolean => { return true; }

	public matches = (symbol: number, minVocabSymbol: number, maxVocabSymbol: number):  boolean => {
		return false;
	}

	public toString = ():  java.lang.String | null => {
		return S`epsilon`;
	}
}
