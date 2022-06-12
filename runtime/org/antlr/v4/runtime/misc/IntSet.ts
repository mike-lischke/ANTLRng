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

import { java } from "../../../../../../../lib/java/java";

/**
 * A generic set of integers.
 *
 * @see IntervalSet
 */
export abstract class IntSet {
    /**
     * Adds the specified value to the current set.
     *
     * @param el the value to add
     *
     * @exception IllegalStateException if the current set is read-only
     */
    public abstract add: (el: number) => void;

    /**
     * Modify the current {@link IntSet} object to contain all elements that are
     * present in itself, the specified {@code set}, or both.
     *
     * @param set The set to add to the current set. A {@code null} argument is
     * treated as though it were an empty set.
     *
     * @returns `this` (to support chained calls)
     *
     * @exception IllegalStateException if the current set is read-only
     */
    public abstract addAll: (set: IntSet) => this;

    /**
     * Return a new {@link IntSet} object containing all elements that are
     * present in both the current set and the specified set {@code a}.
     *
     * @param a The set to intersect with the current set. A {@code null}
     * argument is treated as though it were an empty set.
     *
     * @returns A new {@link IntSet} instance containing the intersection of the
     * current set and `a`. The value {@code null} may be returned in
     * place of an empty result set.
     */
    public abstract and: (a: IntSet) => this;

    /**
     * Return a new {@link IntSet} object containing all elements that are
     * present in {@code elements} but not present in the current set. The
     * following expressions are equivalent for input non-null {@link IntSet}
     * instances {@code x} and {@code y}.
     *
     * <ul>
     * <li>{@code x.complement(y)}</li>
     * <li>{@code y.subtract(x)}</li>
     * </ul>
     *
     * @param elements The set to compare with the current set. A {@code null}
     * argument is treated as though it were an empty set.
     *
     * @returns A new {@link IntSet} instance containing the elements present in
     * {@code elements} but not present in the current set. The value
     * {@code null} may be returned in place of an empty result set.
     */
    public abstract complement: (elements: IntSet) => this;

    /**
     * Return a new {@link IntSet} object containing all elements that are
     * present in the current set, the specified set {@code a}, or both.
     *
     * <p>
     * This method is similar to {@link #addAll(IntSet)}, but returns a new
     * {@link IntSet} instance instead of modifying the current set.</p>
     *
     * @param a The set to union with the current set. A {@code null} argument
     * is treated as though it were an empty set.
     *
     * @returns A new {@link IntSet} instance containing the union of the current
     * set and {@code a}. The value {@code null} may be returned in place of an
     * empty result set.
     */
    public abstract or: (a: IntSet) => this;

    /**
     * Return a new {@link IntSet} object containing all elements that are
     * present in the current set but not present in the input set {@code a}.
     * The following expressions are equivalent for input non-null
     * {@link IntSet} instances {@code x} and {@code y}.
     *
     * <ul>
     * <li>{@code y.subtract(x)}</li>
     * <li>{@code x.complement(y)}</li>
     * </ul>
     *
     * @param a The set to compare with the current set. A {@code null}
     * argument is treated as though it were an empty set.
     *
     * @returns A new {@link IntSet} instance containing the elements present in
     * {@code elements} but not present in the current set. The value
     * {@code null} may be returned in place of an empty result set.
     */
    public abstract subtract: (a: IntSet) => this;

    /**
     * Return the total number of elements represented by the current set.
     *
     * @returns the total number of elements represented by the current set,
     * regardless of the manner in which the elements are stored.
     */
    public abstract size: () => number;

    /**
     * Returns {@code true} if this set contains no elements.
     *
     *
     * @returns `true` if the current set contains no elements; otherwise `false`.
     */
    public abstract isNil: () => boolean;

    /**
     * {@inheritDoc}
     */
    public abstract equals: (obj: object) => boolean;

    /**
     * Returns {@code true} if the set contains the specified element.
     *
     * @param el The element to check for.
     * @returns `true` if the set contains `el`; otherwise `false`.
     */
    public abstract contains: (el: number) => boolean;

    /**
     * Removes the specified value from the current set. If the current set does
     * not contain the element, no changes are made.
     *
     * @param el the value to remove
     *
     * @exception IllegalStateException if the current set is read-only
     */
    public abstract remove: (el: number) => void;

    /**
     * Return a list containing the elements represented by the current set. The
     * list is returned in ascending numerical order.
     *
     *
     * @returns A list containing all element present in the current set, sorted
     * in ascending numerical order.
     */

    public abstract toList: () => java.util.List<java.lang.Integer>;

    /**
     * {@inheritDoc}
     */
    public abstract toString: () => string;
}
