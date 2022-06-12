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

/**
 * This interface provides an abstract concept of object equality independent of
 * {@link Object#equals} (object equality) and the {@code ==} operator
 * (reference equality). It can be used to provide algorithm-specific unordered
 * comparisons without requiring changes to the object itself.
 *
 * @author Sam Harwell
 */
export abstract class EqualityComparator<T> {

    /**
     * This method returns a hash code for the specified object.
     *
     * @param obj The object.
     * @return The hash code for {@code obj}.
     */
    public abstract hashCode: (obj: T) => number;

    /**
     * This method tests if two objects are equal.
     *
     * @param a The first object to compare.
     * @param b The second object to compare.
     *
     * @returns True if `a` equals `b`, otherwise false.
     */
    public abstract equals: (a: T, b: T) => boolean;

}
