/* java2ts: keep */

/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { ATNState } from "./ATNState";
import { RuleStartState } from "./RuleStartState";
import { Transition } from "./Transition";

/** */
export class RuleTransition extends Transition {
    /** Ptr to the rule definition object for this rule ref */
    public readonly ruleIndex: number;     // no Rule object at runtime

    public readonly precedence: number;

    /** What node to begin computations following ref to rule */
    public followState: ATNState;

    /**
     * @deprecated Use
     * {@link #RuleTransition(RuleStartState, int, int, ATNState)} instead.
     */
    public constructor(ruleStart: RuleStartState, ruleIndex: number, followState: ATNState);
    public constructor(ruleStart: RuleStartState, ruleIndex: number, precedence: number, followState: ATNState);
    public constructor(ruleStart: RuleStartState, ruleIndex: number, followStateOrPrecedence: ATNState | number,
        followState?: ATNState | null) {
        super(ruleStart);
        this.ruleIndex = ruleIndex;
        if (typeof followStateOrPrecedence === "number") {
            this.precedence = followStateOrPrecedence;
            this.followState = followState!;
        } else {
            this.precedence = 0;
            this.followState = followStateOrPrecedence;
        }
    }

    public getSerializationType = (): number => {
        return Transition.RULE;
    };

    public isEpsilon = (): boolean => { return true; };

    public matches = (_symbol: number, _minVocabSymbol: number, _maxVocabSymbol: number): boolean => {
        return false;
    };
}
