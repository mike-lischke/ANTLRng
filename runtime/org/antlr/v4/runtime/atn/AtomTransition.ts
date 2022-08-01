/* java2ts: keep */

/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { ATNState } from "./ATNState";
import { Transition } from "./Transition";
import { IntervalSet } from "../misc/IntervalSet";

/** TODO: make all transitions sets? no, should remove set edges */
export class AtomTransition extends Transition {
    /** The token type or character value; or, signifies special label. */
    public readonly atomLabel: number;

    public constructor(target: ATNState, label: number) {
        super(target);
        this.atomLabel = label;
    }

    public getSerializationType = (): number => {
        return Transition.ATOM;
    };

    public label = (): IntervalSet => {
        return IntervalSet.of(this.atomLabel);
    };

    public matches = (symbol: number, _minVocabSymbol: number, _maxVocabSymbol: number): boolean => {
        return this.atomLabel === symbol;
    };

    public toString = (): string => {
        return String(this.atomLabel);
    };
}
