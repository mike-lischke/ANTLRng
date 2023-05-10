/* java2ts: keep */

/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { java, S } from "jree";

import { EmptyPredictionContext } from "./EmptyPredictionContext";
import { PredictionContext } from "./PredictionContext";

export class SingletonPredictionContext extends PredictionContext {
    public readonly parent: PredictionContext | null;
    public readonly returnState: number;

    protected constructor(parent: PredictionContext | null, returnState: number) {
        super(parent !== null
            ? PredictionContext.calculateHashCode(parent, returnState)
            : PredictionContext.calculateEmptyHashCode());
        this.parent = parent;
        this.returnState = returnState;
    }

    public static create = (parent: PredictionContext | null, returnState: number): SingletonPredictionContext => {
        if (returnState === PredictionContext.EMPTY_RETURN_STATE && parent === null) {
            // someone can pass in the bits of an array ctx that mean $
            return EmptyPredictionContext.Instance;
        }

        return new SingletonPredictionContext(parent, returnState);
    };

    public size = (): number => {
        return 1;
    };

    public getParent = (_index: number): PredictionContext | null => {
        return this.parent;
    };

    public getReturnState = (_index: number): number => {
        return this.returnState;
    };

    public equals = (o: unknown): boolean => {
        if (this === o) {
            return true;
        }

        if (!(o instanceof SingletonPredictionContext)) {
            return false;
        }

        if (this.hashCode() !== o.hashCode()) {
            return false; // can't be same if hash is different
        }

        const s: SingletonPredictionContext = o;

        return this.returnState === s.returnState &&
            (this.parent !== null && this.parent.equals(s.parent));
    };

    public override toString = (): java.lang.String => {
        const up = this.parent !== null ? this.parent.toString() : S``;
        if (up.length() === 0) {
            if (this.returnState === PredictionContext.EMPTY_RETURN_STATE) {
                return S`$`;
            }

            return java.lang.String.valueOf(this.returnState);
        }

        return S`${this.returnState} ${up}`;
    };
}
