/* java2ts: keep */

/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { java } from "jree";

import { ATNState } from "./ATNState";
import { Transition } from "./Transition";
import { IntervalSet } from "../misc/IntervalSet";

/** TODO: make all transitions sets? no, should remove set edges */
export class AtomTransition extends Transition {
    /** The token type or character value; or, signifies special label. */
    public readonly labelValue: number;

    public constructor(target: ATNState, label: number) {
        super(target);
        this.labelValue = label;
    }

    public getSerializationType = (): number => {
        return Transition.ATOM;
    };

    public override label = (): IntervalSet => {
        return IntervalSet.of(this.labelValue);
    };

    public matches = (symbol: number, _minVocabSymbol: number, _maxVocabSymbol: number): boolean => {
        return this.labelValue === symbol;
    };

    public override toString = (): java.lang.String => {
        return java.lang.String.valueOf(this.label);
    };
}
