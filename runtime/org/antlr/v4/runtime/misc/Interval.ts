/* java2ts: keep */

/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/* eslint-disable jsdoc/require-returns */

/** An immutable inclusive interval a..b */
export class Interval {
    public static creates = 0;
    public static misses = 0;
    public static hits = 0;
    public static outOfRange = 0;

    public static readonly INTERVAL_POOL_MAX_VALUE: number = 1000;

    public static readonly INVALID = new Interval(-1, -2);

    public static cache = new Array<Interval>(Interval.INTERVAL_POOL_MAX_VALUE + 1);

    public a: number;
    public b: number;

    public constructor(a: number, b: number) { this.a = a; this.b = b; }

    /**
     * Interval objects are used readonly so share all with the
     *  same single value a==b up to some max size.  Use an array as a perfect hash.
     *  Return shared object for 0..INTERVAL_POOL_MAX_VALUE or a new
     *  Interval object with a..a in it.  On Java.g4, 218623 IntervalSets
     *  have a..a (set with 1 element).
     *
     * @param a tbd
     * @param b tbd
     */
    public static of = (a: number, b: number): Interval => {
        // cache just a..a
        if (a !== b || a < 0 || a > Interval.INTERVAL_POOL_MAX_VALUE) {
            return new Interval(a, b);
        }
        if (Interval.cache[a] === undefined) {
            Interval.cache[a] = new Interval(a, a);
        }

        return Interval.cache[a];
    };

    /**
     * return number of elements between a and b inclusively. x..x is length 1.
     *  if b &lt; a, then length is 0.  9..10 has length 2.
     */
    public length = (): number => {
        if (this.b < this.a) {
            return 0;
        }

        return this.b - this.a + 1;
    };

    public equals = (o: object): boolean => {
        if (o === undefined || !(o instanceof Interval)) {
            return false;
        }
        const other: Interval = o;

        return this.a === other.a && this.b === other.b;
    };

    public hashCode = (): number => {
        let hash = 23;
        hash = hash * 31 + this.a;
        hash = hash * 31 + this.b;

        return hash;
    };

    /**
     * Does this start completely before other? Disjoint
     *
     * @param other tbd
     */
    public startsBeforeDisjoint = (other: Interval): boolean => {
        return this.a < other.a && this.b < other.a;
    };

    /**
     * Does this start at or before other? Nondisjoint
     *
     * @param other tbd
     */
    public startsBeforeNonDisjoint = (other: Interval): boolean => {
        return this.a <= other.a && this.b >= other.a;
    };

    /**
     * Does this.a start after other.b? May or may not be disjoint
     *
     * @param other tbd
     */
    public startsAfter = (other: Interval): boolean => { return this.a > other.a; };

    /**
     * Does this start completely after other? Disjoint
     *
     * @param other tbd
     */
    public startsAfterDisjoint = (other: Interval): boolean => {
        return this.a > other.b;
    };

    /**
     * Does this start after other? NonDisjoint
     *
     * @param other tbd
     */
    public startsAfterNonDisjoint = (other: Interval): boolean => {
        return this.a > other.a && this.a <= other.b; // this.b>=other.b implied
    };

    /**
     * Are both ranges disjoint? I.e., no overlap?
     *
     * @param other tbd
     */
    public disjoint = (other: Interval): boolean => {
        return this.startsBeforeDisjoint(other) || this.startsAfterDisjoint(other);
    };

    /**
     * Are two intervals adjacent such as 0..41 and 42..42?
     *
     * @param other tbd
     */
    public adjacent = (other: Interval): boolean => {
        return this.a === other.b + 1 || this.b === other.a - 1;
    };

    public properlyContains = (other: Interval): boolean => {
        return other.a >= this.a && other.b <= this.b;
    };

    /**
     * Return the interval computed from combining this and other
     *
     * @param other tbd
     */
    public union = (other: Interval): Interval => {
        return Interval.of(Math.min(this.a, other.a), Math.max(this.b, other.b));
    };

    /**
     * Return the interval in common between this and o
     *
     * @param other tbd
     */
    public intersection = (other: Interval): Interval => {
        return Interval.of(Math.max(this.a, other.a), Math.min(this.b, other.b));
    };

    /**
     * Return the interval with elements from this not in other;
     *  other must not be totally enclosed (properly contained)
     *  within this, which would result in two disjoint intervals
     *  instead of the single one returned by this method.
     *
     * @param other tbd
     */
    public differenceNotProperlyContained = (other: Interval): Interval | null => {
        let diff: Interval | null = null;
        // other.a to left of this.a (or same)
        if (other.startsBeforeNonDisjoint(this)) {
            diff = Interval.of(Math.max(this.a, other.b + 1),
                this.b);
        } else {
            if (other.startsAfterNonDisjoint(this)) {
                diff = Interval.of(this.a, other.a - 1);
            }
        }

        return diff;
    };

    public toString = (): string => {
        return this.a + ".." + this.b;
    };
}
