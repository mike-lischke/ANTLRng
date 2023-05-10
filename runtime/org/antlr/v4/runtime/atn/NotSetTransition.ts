/* java2ts: keep */

/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { java, S } from "jree";

import { ATNState } from "./ATNState";
import { SetTransition } from "./SetTransition";
import { Transition } from "./Transition";
import { IntervalSet } from "../misc/IntervalSet";

export class NotSetTransition extends SetTransition {
    public constructor(target: ATNState, set: IntervalSet) {
        super(target, set);
    }

    public override getSerializationType = (): number => {
        return Transition.NOT_SET;
    };

    public override matches = (symbol: number, minVocabSymbol: number, maxVocabSymbol: number): boolean => {
        return symbol >= minVocabSymbol
            && symbol <= maxVocabSymbol
            && !super.matches(symbol, minVocabSymbol, maxVocabSymbol);
    };

    public override toString = (): java.lang.String => {
        return S`~${super.toString()}`;
    };
}
