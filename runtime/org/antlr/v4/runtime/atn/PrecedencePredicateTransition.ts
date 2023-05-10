/* java2ts: keep */

/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { java, S } from "jree";
import { AbstractPredicateTransition } from "./AbstractPredicateTransition";
import { ATNState } from "./ATNState";
import { SemanticContext } from "./SemanticContext";
import { Transition } from "./Transition";

/**
 * @author Sam Harwell
 */
export class PrecedencePredicateTransition extends AbstractPredicateTransition {
    public readonly precedence: number;

    public constructor(target: ATNState, precedence: number) {
        super(target);
        this.precedence = precedence;
    }

    public getSerializationType = (): number => {
        return Transition.PRECEDENCE;
    };

    public override isEpsilon = (): boolean => {
        return true;
    };

    public matches = (_symbol: number, _minVocabSymbol: number, _maxVocabSymbol: number): boolean => {
        return false;
    };

    public getPredicate = (): SemanticContext.PrecedencePredicate => {
        return new SemanticContext.PrecedencePredicate(this.precedence);
    };

    public override toString = (): java.lang.String => {
        return S`${this.precedence} >= _p`;
    };

}
