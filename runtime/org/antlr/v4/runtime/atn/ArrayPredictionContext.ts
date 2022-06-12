/* java2ts: keep */

/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/*
 eslint-disable @typescript-eslint/no-namespace, @typescript-eslint/naming-convention, no-redeclare,
 max-classes-per-file, jsdoc/check-tag-names, @typescript-eslint/no-empty-function,
 @typescript-eslint/restrict-plus-operands, @typescript-eslint/unified-signatures, @typescript-eslint/member-ordering,
 no-underscore-dangle, max-len
*/

/* cspell: disable */

import { java } from "../../../../../../lib/java/java";
import { PredictionContext } from "./PredictionContext";
import { SingletonPredictionContext } from "./SingletonPredictionContext";

export class ArrayPredictionContext extends PredictionContext {
    /**
     * Parent can be null only if full ctx mode and we make an array
     *  from {@link #EMPTY} and non-empty. We merge {@link #EMPTY} by using null parent and
     *  returnState == {@link #EMPTY_RETURN_STATE}.
     */
    public readonly parents?: PredictionContext[];

    /**
     * Sorted for merge, no duplicates; if present,
     *  {@link #EMPTY_RETURN_STATE} is always last.
     */
    public readonly returnStates: number[];

    /* eslint-disable constructor-super, @typescript-eslint/no-unsafe-call */
    public constructor(a: SingletonPredictionContext);

    public constructor(parents: PredictionContext[], returnStates: number[]);
    /* @ts-expect-error, because of the super() call in the closure. */
    public constructor(aOrParents: SingletonPredictionContext | PredictionContext[], returnStates?: number[]) {
        const $this = (aOrParents: SingletonPredictionContext | PredictionContext[], returnStates?: number[]): void => {
            if (aOrParents instanceof SingletonPredictionContext && returnStates === undefined) {
                const a = aOrParents;
                $this([a.parent], [a.returnState]);
            } else {
                const parents = aOrParents as PredictionContext[];
                /* @ts-expect-error, because of the super() call in the closure. */
                super(PredictionContext.calculateHashCode(parents, returnStates));
                /* @ts-ignore */
                this.parents = parents;
                /* @ts-ignore */
                this.returnStates = returnStates;
            }
        };

        $this(aOrParents, returnStates);

    }
    /* eslint-enable constructor-super, @typescript-eslint/no-unsafe-call */

    public isEmpty = (): boolean => {
        // since EMPTY_RETURN_STATE can only appear in the last position, we
        // don't need to verify that size==1
        return this.returnStates[0] === PredictionContext.EMPTY_RETURN_STATE;
    };

    public size = (): number => {
        return this.returnStates.length;
    };

    public getParent = (index: number): PredictionContext => {
        return this.parents[index];
    };

    public getReturnState = (index: number): number => {
        return this.returnStates[index];
    };

    public equals = (o: object): boolean => {
        if (this === o) {
            return true;
        } else {
            if (!(o instanceof ArrayPredictionContext)) {
                return false;
            }
        }

        if (this.hashCode() !== o.hashCode()) {
            return false; // can't be same if hash is different
        }

        return java.util.Arrays.equals(this.returnStates, o.returnStates) &&
            java.util.Arrays.equals(this.parents, o.parents);
    };

    public toString = (): string => {
        if (this.isEmpty()) {
            return "[]";
        }

        const buf: java.lang.StringBuilder = new java.lang.StringBuilder();
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
            if (this.parents[i] !== undefined) {
                buf.append(" ");
                buf.append(this.parents[i].toString());
            } else {
                buf.append("null");
            }
        }
        buf.append("]");

        return buf.toString();
    };
}
