/* java2ts: keep */

/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { java, S } from "jree";

import { PredictionContext } from "./PredictionContext";
import { SingletonPredictionContext } from "./SingletonPredictionContext";

export class ArrayPredictionContext extends PredictionContext {
    /**
     * Parent can be null only if full ctx mode and we make an array
     *  from {@link #EMPTY} and non-empty. We merge {@link #EMPTY} by using null parent and
     *  returnState == {@link #EMPTY_RETURN_STATE}.
     */
    public readonly parents: Array<PredictionContext | null>;

    /**
     * Sorted for merge, no duplicates; if present,
     *  {@link #EMPTY_RETURN_STATE} is always last.
     */
    public readonly returnStates: Int32Array;

    public constructor(a: SingletonPredictionContext);
    public constructor(parents: Array<PredictionContext | null>, returnStates: Int32Array);
    public constructor(aOrParents: SingletonPredictionContext | Array<PredictionContext | null>,
        returnStates?: Int32Array) {
        const parents = aOrParents instanceof SingletonPredictionContext ? [aOrParents] : aOrParents;
        let states;
        if (aOrParents instanceof SingletonPredictionContext) {
            states = new Int32Array(1);
            states[0] = aOrParents.returnState;
        } else {
            states = returnStates!;
        }
        super(PredictionContext.calculateHashCode(parents, states));

        this.parents = parents;
        this.returnStates = states;
    }

    public isEmpty = (): boolean => {
        // since EMPTY_RETURN_STATE can only appear in the last position, we
        // don't need to verify that size==1
        return this.returnStates[0] === PredictionContext.EMPTY_RETURN_STATE;
    };

    public size = (): number => {
        return this.returnStates.length;
    };

    public getParent = (index: number): PredictionContext | null => {
        return this.parents ? this.parents[index] : null;
    };

    public getReturnState = (index: number): number => {
        return this.returnStates[index];
    };

    public equals = (o: unknown): boolean => {
        if (this === o) {
            return true;
        }

        if (!(o instanceof ArrayPredictionContext)) {
            return false;
        }

        if (this.hashCode() !== o.hashCode()) {
            return false; // can't be same if hash is different
        }

        return java.util.Arrays.equals(this.returnStates, o.returnStates) &&
            java.util.Arrays.equals(this.parents ?? [], o.parents ?? []);
    };

    public toString = (): java.lang.String => {
        if (this.isEmpty()) {
            return S`[]`;
        }

        const buf = new java.lang.StringBuilder();
        buf.append("[");
        for (let i = 0; i < this.returnStates.length; i++) {
            if (i > 0) {
                buf.append(", ");
            }

            if (this.returnStates[i] === PredictionContext.EMPTY_RETURN_STATE) {
                buf.append("$");
                continue;
            }

            buf.append(this.returnStates[i]);
            if (this.parents[i]) {
                buf.append(" ");
                buf.append(this.parents[i]!.toString());
            } else {
                buf.append("null");
            }
        }
        buf.append("]");

        return buf.toString();
    };
}
