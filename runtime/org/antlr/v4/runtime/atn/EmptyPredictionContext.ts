/* java2ts: keep */

/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { java, S } from "jree";

import { SingletonPredictionContext } from "./SingletonPredictionContext";
import { PredictionContext } from "./PredictionContext";

export class EmptyPredictionContext extends SingletonPredictionContext {
    static #instance: EmptyPredictionContext | null = null;

    /**
     * Represents {@code $} in local context prediction, which means wildcard.
     * {@code *+x = *}.
     *
     * @returns the empty context
     */
    // eslint-disable-next-line @typescript-eslint/naming-convention
    public static get Instance(): EmptyPredictionContext {
        if (this.#instance === null) {
            this.#instance = new EmptyPredictionContext();
        }

        return this.#instance;
    }

    private constructor() {
        super(null, PredictionContext.EMPTY_RETURN_STATE);
    }

    public override isEmpty = (): boolean => { return true; };

    public override size = (): number => {
        return 1;
    };

    public override getParent = (_index: number): PredictionContext | null => {
        return null;
    };

    public override getReturnState = (_index: number): number => {
        return this.returnState;
    };

    public override equals = (o: unknown): boolean => {
        return this === o;
    };

    public override toString = (): java.lang.String => {
        return S`$`;
    };
}
