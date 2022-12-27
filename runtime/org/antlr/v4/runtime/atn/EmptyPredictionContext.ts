/* java2ts: keep */

/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { PredictionContext } from "./PredictionContext";
import { SingletonPredictionContext } from "./SingletonPredictionContext";

import { S } from "../../../../../../lib/templates";
import { java } from "../../../../../../lib/java/java";

export class EmptyPredictionContext extends SingletonPredictionContext {
    /**
     * Represents {@code $} in local context prediction, which means wildcard.
     * {@code *+x = *}.
     */
    // eslint-disable-next-line @typescript-eslint/naming-convention
    public static readonly Instance: EmptyPredictionContext = new EmptyPredictionContext();

    private constructor() {
        super(null, PredictionContext.EMPTY_RETURN_STATE);
    }

    public isEmpty = (): boolean => { return true; };

    public size = (): number => {
        return 1;
    };

    public getParent = (_index: number): PredictionContext | null => {
        return null;
    };

    public getReturnState = (_index: number): number => {
        return this.returnState;
    };

    public equals = (o: unknown): boolean => {
        return this === o;
    };

    public toString = (): java.lang.String => {
        return S`$`;
    };
}
