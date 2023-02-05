/* java2ts: keep */

/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { java, S } from "jree";

import { ATNState } from "./ATNState";
import { Transition } from "./Transition";

export class ActionTransition extends Transition {
    public readonly ruleIndex: number;
    public readonly actionIndex: number;
    public readonly isCtxDependent: boolean; // e.g., $i ref in action

    public constructor(target: ATNState, ruleIndex: number);
    public constructor(target: ATNState, ruleIndex: number, actionIndex: number, isCtxDependent: boolean);
    public constructor(target: ATNState, ruleIndex: number, actionIndex?: number, isCtxDependent?: boolean) {
        super(target);
        this.ruleIndex = ruleIndex;
        this.actionIndex = actionIndex ?? -1;
        this.isCtxDependent = isCtxDependent ?? false;
    }

    public getSerializationType = (): number => {
        return Transition.ACTION;
    };

    public isEpsilon = (): boolean => {
        return true; // we are to be ignored by analysis except for predicates
    };

    public matches = (_symbol: number, _minVocabSymbol: number, _maxVocabSymbol: number): boolean => {
        return false;
    };

    public toString = (): java.lang.String => {
        return S`action_${this.ruleIndex}:${this.actionIndex}`;
    };
}
