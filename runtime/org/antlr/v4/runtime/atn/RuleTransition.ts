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
import { RuleStartState } from "./RuleStartState";
import { Transition } from "./Transition";




/** */
export  class RuleTransition extends Transition {
	/** Ptr to the rule definition object for this rule ref */
	public readonly  ruleIndex:  number;     // no Rule object at runtime

	public readonly  precedence:  number;

	/** What node to begin computations following ref to rule */
	public followState?:  ATNState;

	/**
	 * @deprecated Use
	 * {@link #RuleTransition(RuleStartState, int, int, ATNState)} instead.
	 */
	/* eslint-disable constructor-super, @typescript-eslint/no-unsafe-call */
public constructor(ruleStart: RuleStartState,
						  ruleIndex: number,
						  followState: ATNState);

	public constructor(ruleStart: RuleStartState,
						  ruleIndex: number,
						  precedence: number,
						  followState: ATNState);
/* @ts-expect-error, because of the super() call in the closure. */
public constructor(ruleStart: RuleStartState, ruleIndex: number, followStateOrPrecedence: ATNState | number, followState?: ATNState) {
const $this = (ruleStart: RuleStartState, ruleIndex: number, followStateOrPrecedence: ATNState | number, followState?: ATNState): void => {
if (followStateOrPrecedence instanceof ATNState && followState === undefined)
	{
const followState = followStateOrPrecedence as ATNState;
		$this(ruleStart, ruleIndex, 0, followState);
	}
 else 
	{
let precedence = followStateOrPrecedence as number;
/* @ts-expect-error, because of the super() call in the closure. */
		super(ruleStart);
		this.ruleIndex = ruleIndex;
		this.precedence = precedence;
		this.followState = followState;
	}
};

$this(ruleStart, ruleIndex, followStateOrPrecedence, followState);

}
/* eslint-enable constructor-super, @typescript-eslint/no-unsafe-call */

	public getSerializationType = (): number => {
		return Transition.RULE;
	}

	public isEpsilon = (): boolean => { return true; }

	public matches = (symbol: number, minVocabSymbol: number, maxVocabSymbol: number): boolean => {
		return false;
	}
}
