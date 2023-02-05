/* java2ts: keep */

/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { java, S, JavaObject, MurmurHash } from "jree";


import { EqualityComparator } from "./EqualityComparator";

/**
 * This default implementation of {@link EqualityComparator} uses object equality
 * for comparisons by calling {@link Object#hashCode} and {@link Object#equals}.
 *
 * @author Sam Harwell
 */
export class ObjectEqualityComparator extends EqualityComparator<JavaObject> {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    public static readonly INSTANCE = new ObjectEqualityComparator();

    /**
     *
     * <p>This implementation returns
     * {@code obj.}{@link Object#hashCode hashCode()}.</p>
     *
     * @param obj tbd
     *
     * @returns tbd
     */
    public hashCode = (obj: java.lang.Object | null): number => {
        if (obj === null) {
            return 0;
        }

        return obj.hashCode();
    };

    /**
     *
     * <p>This implementation relies on object equality. If both objects are
     * {@code null}, this method returns {@code true}. Otherwise if only
     * {@code a} is {@code null}, this method returns {@code false}. Otherwise,
     * this method returns the result of
     * {@code a.}{@link Object#equals equals}{@code (b)}.</p>
     *
     * @param a tbd
     * @param b tbd
     *
     * @returns tbd
     */
    public equals = (a: unknown, b: unknown): boolean => {
        if (a === b) {
            return true;
        }

        if (!a || !b) {
            return false;
        }

        if (a instanceof java.lang.Object) {
            return a.equals(b);
        }

        return a === b;
    };

}
