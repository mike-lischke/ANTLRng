/* java2ts: keep */

/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { java } from "../../../../../../lib/java/java";
import { S } from "../../../../../../lib/templates";

import { ATNState } from "./ATNState";
import { Transition } from "./Transition";

export class WildcardTransition extends Transition {
    public constructor(target: ATNState | null) {
        super(target);
    }

    public getSerializationType = (): number => {
        return Transition.WILDCARD;
    };

    public matches = (symbol: number, minVocabSymbol: number, maxVocabSymbol: number): boolean => {
        return symbol >= minVocabSymbol && symbol <= maxVocabSymbol;
    };

    public toString = (): java.lang.String => {
        return S`.`;
    };
}
