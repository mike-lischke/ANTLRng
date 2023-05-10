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
 * TODO: this is old comment:
 *  A tree of semantic predicates from the grammar AST if label==SEMPRED.
 *  In the ATN, labels will always be exactly one predicate, but the DFA
 *  may have to combine a bunch of them as it collects predicates from
 *  multiple ATN configurations into a single DFA state.
 */
export class PredicateTransition extends AbstractPredicateTransition {
    public readonly ruleIndex: number;
    public readonly predIndex: number;
    public readonly isCtxDependent: boolean;  // e.g., $i ref in pred

    public constructor(target: ATNState, ruleIndex: number, predIndex: number, isCtxDependent: boolean) {
        super(target);
        this.ruleIndex = ruleIndex;
        this.predIndex = predIndex;
        this.isCtxDependent = isCtxDependent;
    }

    public getSerializationType = (): number => {
        return Transition.PREDICATE;
    };

    public override isEpsilon = (): boolean => { return true; };

    public matches = (_symbol: number, _minVocabSymbol: number, _maxVocabSymbol: number): boolean => {
        return false;
    };

    public getPredicate = (): SemanticContext.Predicate => {
        return new SemanticContext.Predicate(this.ruleIndex, this.predIndex, this.isCtxDependent);
    };

    public override toString = (): java.lang.String => {
        return S`pred_${this.ruleIndex}: ${this.predIndex}`;
    };

}
