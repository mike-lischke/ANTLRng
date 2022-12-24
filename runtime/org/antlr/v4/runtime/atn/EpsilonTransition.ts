/* java2ts: keep */

/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { ATNState } from "./ATNState";
import { Transition } from "./Transition";

import { S } from "../../../../../../lib/templates";
import { java } from "../../../../../../lib/java/java";

export class EpsilonTransition extends Transition {

    readonly #outermostPrecedenceReturn: number;

    public constructor(target: ATNState, outermostPrecedenceReturn?: number) {
        super(target);
        this.#outermostPrecedenceReturn = outermostPrecedenceReturn ?? -1;
    }

    /**
      @returns the rule index of a precedence rule for which this transition is
     * returning from, where the precedence value is 0; otherwise, -1.
     *
     * @see ATNConfig#isPrecedenceFilterSuppressed()
     * @see ParserATNSimulator#applyPrecedenceFilter(ATNConfigSet)
     *
     */
    public outermostPrecedenceReturn = (): number => {
        return this.#outermostPrecedenceReturn;
    };

    public getSerializationType = (): number => {
        return Transition.EPSILON;
    };

    public isEpsilon = (): boolean => { return true; };

    public matches = (_symbol: number, _minVocabSymbol: number, _maxVocabSymbol: number): boolean => {
        return false;
    };

    public toString = (): java.lang.String => {
        return S`epsilon`;
    };
}
