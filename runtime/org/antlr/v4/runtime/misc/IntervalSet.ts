/* java2ts: keep */

/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/* eslint-disable @typescript-eslint/naming-convention */

import { java, S, JavaObject, MurmurHash } from "jree";

import { IntegerList } from "./IntegerList";
import { Interval } from "./Interval";
import { IntSet } from "./IntSet";
import { Lexer } from "../Lexer";
import { Token } from "../Token";
import { Vocabulary } from "../Vocabulary";

import { I, S } from "../../../../../../lib/templates";

/**
 * This class implements the {@link IntSet} backed by a sorted array of
 * non-overlapping intervals. It is particularly efficient for representing
 * large collections of numbers, where the majority of elements appear as part
 * of a sequential range of numbers that are all part of the set. For example,
 * the set { 1, 2, 3, 4, 7, 8 } may be represented as { [1, 4], [7, 8] }.
 *
 * <p>
 * This class is able to represent sets containing any combination of values in
 * the range {@link Integer#MIN_VALUE} to {@link Integer#MAX_VALUE}
 * (inclusive).</p>
 */
export class IntervalSet extends JavaObject implements IntSet {
    public static readonly COMPLETE_CHAR_SET = IntervalSet.of(Lexer.MIN_CHAR_VALUE, Lexer.MAX_CHAR_VALUE);
    public static readonly EMPTY_SET = new IntervalSet();

    /** The list of sorted, disjoint intervals. */
    protected intervals: java.util.List<Interval>;

    #readOnly = false;

    public constructor(intervals: java.util.List<Interval> | IntervalSet);
    public constructor(...els: number[]);
    public constructor(...intervalsOrSetOrEls: unknown[]) {
        super();

        if (intervalsOrSetOrEls.length === 1) {
            if (intervalsOrSetOrEls[0] instanceof IntervalSet) {
                this.intervals = new java.util.ArrayList<Interval>(2); // most sets are 1 or 2 elements
                this.addAll(intervalsOrSetOrEls[0]);
            } else {
                this.intervals = intervalsOrSetOrEls[0] as java.util.List<Interval>;
            }
        } else {
            this.intervals = new java.util.ArrayList<Interval>(intervalsOrSetOrEls.length);
            for (const e of intervalsOrSetOrEls) {
                this.add(e as number);
            }
        }
    }

    /**
     * Create a set with a single element a or  all ints within range [a..b] (inclusive)
     *
     * @param a tbd
     * @param b tbd
     *
     * @returns tbd
     */
    public static of(a: number, b?: number): IntervalSet {
        if (b === undefined) {
            const s = new IntervalSet();
            s.add(a);

            return s;
        } else {
            const s = new IntervalSet();
            s.add(a, b);

            return s;
        }
    }

    /**
     * Compute the set difference between two interval sets. The specific
     * operation is {@code left - right}. If either of the input sets is
     * {@code null}, it is treated as though it was an empty set.
     *
     * @param left tbd
     * @param right tbd
     *
     * @returns tbd
     */
    public static subtract = (left: IntervalSet | null, right: IntervalSet | null): IntervalSet => {
        if (left === null || left.isNil()) {
            return new IntervalSet();
        }

        const result: IntervalSet = new IntervalSet(left);
        if (right === null || right.isNil()) {
            // right set has no elements; just return the copy of the current set
            return result;
        }

        let resultI = 0;
        let rightI = 0;
        while (resultI < result.intervals.size() && rightI < right.intervals.size()) {
            const resultInterval: Interval = result.intervals.get(resultI);
            const rightInterval: Interval = right.intervals.get(rightI);

            // operation: (resultInterval - rightInterval) and update indexes

            if (rightInterval.b < resultInterval.a) {
                rightI++;
                continue;
            }

            if (rightInterval.a > resultInterval.b) {
                resultI++;
                continue;
            }

            let beforeCurrent: Interval | null = null;
            let afterCurrent: Interval | null = null;
            if (rightInterval.a > resultInterval.a) {
                beforeCurrent = new Interval(resultInterval.a, rightInterval.a - 1);
            }

            if (rightInterval.b < resultInterval.b) {
                afterCurrent = new Interval(rightInterval.b + 1, resultInterval.b);
            }

            if (beforeCurrent !== null) {
                if (afterCurrent !== null) {
                    // split the current interval into two
                    result.intervals.set(resultI, beforeCurrent);
                    result.intervals.add(resultI + 1, afterCurrent);
                    resultI++;
                    rightI++;
                    continue;
                } else {
                    // replace the current interval
                    result.intervals.set(resultI, beforeCurrent);
                    resultI++;
                    continue;
                }
            } else {
                if (afterCurrent !== null) {
                    // replace the current interval
                    result.intervals.set(resultI, afterCurrent);
                    rightI++;
                    continue;
                } else {
                    // remove the current interval (thus no need to increment resultI)
                    result.intervals.remove(resultI);
                    continue;
                }
            }
        }

        // If rightI reached right.intervals.size(), no more intervals to subtract from result.
        // If resultI reached result.intervals.size(), we would be subtracting from an empty set.
        // Either way, we are done.
        return result;
    };

    public clear = (): void => {
        if (this.#readOnly) {
            throw new java.lang.IllegalStateException(S`can't alter readonly IntervalSet`);
        }

        this.intervals.clear();
    };

    /**
     * Add a single element or an interval to the set. An isolated element is stored as a range el..el.
     */
    public add(addition: Interval | number): void;
    /**
     * Add interval; i.e., add all integers from a to b to set.
     *  If b&lt;a, do nothing.
     *  Keep list in sorted order (by left range value).
     *  If overlap, combine ranges.  For example,
     *  If this is {1..5, 10..20}, adding 6..7 yields
     *  {1..5, 6..7, 10..20}.  Adding 4..8 yields {1..8, 10..20}.
     */
    public add(a: number, b: number): void;
    public add(additionOrA: number | Interval, b?: number): void {
        if (this.#readOnly) {
            throw new java.lang.IllegalStateException(S`can't alter readonly IntervalSet`);
        }

        if (additionOrA instanceof Interval) {
            const addition = additionOrA;
            if (addition.b < addition.a) {
                return;
            }

            // find position in list
            // Use iterators as we modify list in place
            for (let iter = this.intervals.listIterator(); iter.hasNext();) {
                const r = iter.next();
                if (addition.equals(r)) {
                    return;
                }

                if (addition.adjacent(r) || !addition.disjoint(r)) {
                    // next to each other, make a single larger interval
                    const bigger: Interval = addition.union(r);
                    iter.set(bigger);
                    // make sure we didn't just create an interval that
                    // should be merged with next interval in list
                    while (iter.hasNext()) {
                        const next: Interval = iter.next();
                        if (!bigger.adjacent(next) && bigger.disjoint(next)) {
                            break;
                        }

                        // if we bump up against or overlap next, merge
                        iter.remove();   // remove this one
                        iter.previous(); // move backwards to what we just set
                        iter.set(bigger.union(next)); // set to 3 merged ones
                        iter.next(); // first call to next after previous duplicates the result
                    }

                    return;
                }
                if (addition.startsBeforeDisjoint(r)) {
                    // insert before r
                    iter.previous();
                    iter.add(addition);

                    return;
                }
                // if disjoint and after r, a future iteration will handle it
            }

            // ok, must be after last interval (and disjoint from last interval)
            // just add it
            this.intervals.add(addition);
        } else {
            this.add(Interval.of(additionOrA, b ?? additionOrA));
        }
    }

    public addAll = (set: IntSet | null): IntSet => {
        if (set === null) {
            return this;
        }

        if (set instanceof IntervalSet) {
            const other: IntervalSet = set;
            // walk set and add each interval
            const n: number = other.intervals.size();
            for (let i = 0; i < n; i++) {
                const I: Interval = other.intervals.get(i);
                this.add(I.a, I.b);
            }
        } else {
            for (const value of set.toList()) {
                this.add(value.valueOf());
            }
        }

        return this;
    };

    public complement(vocabulary: IntSet | null): IntervalSet | null;
    public complement(minElement: number, maxElement: number): IntervalSet;
    public complement(vocabularyOrMinElement: IntSet | number | null, maxElement?: number): IntervalSet | null {
        if (vocabularyOrMinElement === null) {
            return null; // nothing in common with null set
        }

        let vocabulary: IntSet;
        if (typeof vocabularyOrMinElement === "number") {
            vocabulary = IntervalSet.of(vocabularyOrMinElement, maxElement);
        } else {
            vocabulary = vocabularyOrMinElement;
        }

        let vocabularyIS: IntervalSet;
        if (vocabulary instanceof IntervalSet) {
            vocabularyIS = vocabulary;
        } else {
            vocabularyIS = new IntervalSet();
            vocabularyIS.addAll(vocabulary);
        }

        return vocabularyIS.subtract(this);
    }

    public subtract = (a: IntSet | null): IntervalSet => {
        if (a === null || a.isNil()) {
            return new IntervalSet(this);
        }

        if (a instanceof IntervalSet) {
            return IntervalSet.subtract(this, a);
        }

        const other = new IntervalSet();
        other.addAll(a);

        return IntervalSet.subtract(this, other);
    };

    public or = (a: IntSet | null): IntervalSet => {
        const o: IntervalSet = new IntervalSet();
        o.addAll(this);
        o.addAll(a);

        return o;
    };

    /**
     * @param other tbd
     *
     * @returns tbd
     */
    public and = (other: IntSet | null): IntervalSet | null => {
        if (other === null) {
            return null; // nothing in common with null set
        }

        const myIntervals: java.util.List<Interval> = this.intervals;
        const theirIntervals: java.util.List<Interval> = (other as IntervalSet).intervals;
        let intersection: IntervalSet | null = null;
        const mySize: number = myIntervals.size();
        const theirSize: number = theirIntervals.size();
        let i = 0;
        let j = 0;

        // iterate down both interval lists looking for non-disjoint intervals
        while (i < mySize && j < theirSize) {
            const mine: Interval = myIntervals.get(i);
            const theirs: Interval = theirIntervals.get(j);
            if (mine.startsBeforeDisjoint(theirs)) {
                // move this iterator looking for interval that might overlap
                i++;
            } else {
                if (theirs.startsBeforeDisjoint(mine)) {
                    // move other iterator looking for interval that might overlap
                    j++;
                } else {
                    if (mine.properlyContains(theirs)) {
                        // overlap, add intersection, get next theirs
                        if (intersection === null) {
                            intersection = new IntervalSet();
                        }
                        intersection.add(mine.intersection(theirs));
                        j++;
                    } else {
                        if (theirs.properlyContains(mine)) {
                            // overlap, add intersection, get next mine
                            if (intersection === null) {
                                intersection = new IntervalSet();
                            }
                            intersection.add(mine.intersection(theirs));
                            i++;
                        } else {
                            if (!mine.disjoint(theirs)) {
                                // overlap, add intersection
                                if (intersection === null) {
                                    intersection = new IntervalSet();
                                }
                                intersection.add(mine.intersection(theirs));

                                // Move the iterator of lower range [a..b], but not
                                // the upper range as it may contain elements that will collide
                                // with the next iterator. So, if mine=[0..115] and
                                // theirs=[115..200], then intersection is 115 and move mine
                                // but not theirs as theirs may collide with the next range
                                // in thisIter.
                                // move both iterators to next ranges
                                if (mine.startsAfterNonDisjoint(theirs)) {
                                    j++;
                                } else {
                                    if (theirs.startsAfterNonDisjoint(mine)) {
                                        i++;
                                    }
                                }

                            }
                        }

                    }

                }

            }

        }
        if (intersection === null) {
            return new IntervalSet() as this;
        }

        return intersection as this;
    };

    /**
     * @param el tbd
     *
     * @returns tbd
     */
    public contains = (el: number): boolean => {
        const n: number = this.intervals.size();
        let l = 0;
        let r: number = n - 1;
        // Binary search for the element in the (sorted,
        // disjoint) array of intervals.
        while (l <= r) {
            const m: number = (l + r) / 2;
            const I: Interval = this.intervals.get(m);
            const a: number = I.a;
            const b: number = I.b;
            if (b < el) {
                l = m + 1;
            } else {
                if (a > el) {
                    r = m - 1;
                } else { // el >= a && el <= b
                    return true;
                }
            }

        }

        return false;
    };

    public isNil = (): boolean => {
        return this.intervals === null || this.intervals.isEmpty();
    };

    /**
     * Returns the maximum value contained in the set if not isNil().
     *
      @returns the maximum value contained in the set.
     * @throws RuntimeException if set is empty
     */
    public getMaxElement = (): number => {
        if (this.isNil()) {
            throw new java.lang.RuntimeException(S`set is empty`);
        }
        const last: Interval = this.intervals.get(this.intervals.size() - 1);

        return last.b;
    };

    /**
     * Returns the minimum value contained in the set if not isNil().
     *
      @returns the minimum value contained in the set.
     * @throws RuntimeException if set is empty
     */
    public getMinElement = (): number => {
        if (this.isNil()) {
            throw new java.lang.RuntimeException(S`set is empty`);
        }

        return this.intervals.get(0).a;
    };

    /** @returns a list of Interval objects. */
    public getIntervals = (): java.util.List<Interval> => {
        return this.intervals;
    };

    public hashCode = (): number => {
        let hash: number = MurmurHash.initialize();
        for (const I of this.intervals) {
            hash = MurmurHash.update(hash, I.a);
            hash = MurmurHash.update(hash, I.b);
        }

        hash = MurmurHash.finish(hash, this.intervals.size() * 2);

        return hash;
    };

    /**
     * Are two IntervalSets equal?  Because all intervals are sorted
     *  and disjoint, equals is a simple linear walk over both lists
     *  to make sure they are the same.  Interval.equals() is used
     *  by the List.equals() method to check the ranges.
     *
     * @param obj tbd
     *
     * @returns tbd
     */
    public equals = (obj: unknown): boolean => {
        if (obj === null || !(obj instanceof IntervalSet)) {
            return false;
        }
        const other: IntervalSet = obj;

        return this.intervals.equals(other.intervals);
    };

    public toString(elemAreChar?: boolean): java.lang.String;
    public toString(vocabulary: Vocabulary): java.lang.String;
    public toString(elemAreCharOrVocabulary?: boolean | Vocabulary): java.lang.String {
        if (elemAreCharOrVocabulary === undefined || typeof elemAreCharOrVocabulary === "boolean") {
            const elemAreChar = elemAreCharOrVocabulary ?? false;
            if (this.intervals === null || this.intervals.isEmpty()) {
                return S`{}`;
            }

            const buf = new java.lang.StringBuilder();
            if (this.size() > 1) {
                buf.append(S`{`);
            }

            const iter = this.intervals.iterator();
            while (iter.hasNext()) {
                const I = iter.next();
                const a = I.a;
                const b = I.b;
                if (a === b) {
                    if (a === Token.EOF) {
                        buf.append(S`<EOF>`);
                    } else {
                        if (elemAreChar) {
                            buf.append(S`'`).appendCodePoint(a).append(S`'`);
                        } else {
                            buf.append(a);
                        }

                    }
                } else {
                    if (elemAreChar) {
                        buf.append(S`'`).appendCodePoint(a).append(S`'..'`).appendCodePoint(b).append(S`'`);
                    } else {
                        buf.append(a).append(S`..`).append(b);
                    }

                }
                if (iter.hasNext()) {
                    buf.append(S`, `);
                }
            }
            if (this.size() > 1) {
                buf.append(S`}`);
            }

            return buf.toString();
        } else {
            const vocabulary = elemAreCharOrVocabulary;
            if (this.intervals === null || this.intervals.isEmpty()) {
                return S`{}`;
            }

            const buf = new java.lang.StringBuilder();
            if (this.size() > 1) {
                buf.append(S`{`);
            }

            const iter = this.intervals.iterator();
            while (iter.hasNext()) {
                const I = iter.next();
                const a = I.a;
                const b = I.b;
                if (a === b) {
                    buf.append(this.elementName(vocabulary, a));
                } else {
                    for (let i: number = a; i <= b; i++) {
                        if (i > a) {
                            buf.append(S`, `);
                        }

                        buf.append(this.elementName(vocabulary, i));
                    }
                }
                if (iter.hasNext()) {
                    buf.append(S`, `);
                }
            }
            if (this.size() > 1) {
                buf.append(S`}`);
            }

            return buf.toString();
        }
    }

    public size = (): number => {
        let n = 0;
        const numIntervals: number = this.intervals.size();
        if (numIntervals === 1) {
            const firstInterval: Interval = this.intervals.get(0);

            return firstInterval.b - firstInterval.a + 1;
        }
        for (let i = 0; i < numIntervals; i++) {
            const I: Interval = this.intervals.get(i);
            n += (I.b - I.a + 1);
        }

        return n;
    };

    public toIntegerList = (): IntegerList => {
        const values: IntegerList = new IntegerList(this.size());
        const n: number = this.intervals.size();
        for (let i = 0; i < n; i++) {
            const I: Interval = this.intervals.get(i);
            const a: number = I.a;
            const b: number = I.b;
            for (let v: number = a; v <= b; v++) {
                values.add(v);
            }
        }

        return values;
    };

    public toList = (): java.util.List<java.lang.Integer> => {
        const values: java.util.List<java.lang.Integer> = new java.util.ArrayList<java.lang.Integer>();
        const n: number = this.intervals.size();
        for (let i = 0; i < n; i++) {
            const interval = this.intervals.get(i);
            const a = interval.a;
            const b = interval.b;
            for (let v = a; v <= b; v++) {
                values.add(I`${v}`);
            }
        }

        return values;
    };

    public toSet = (): java.util.Set<java.lang.Integer> => {
        const s = new java.util.HashSet<java.lang.Integer>();
        for (const interval of this.intervals) {
            const a = interval.a;
            const b = interval.b;
            for (let v = a; v <= b; v++) {
                s.add(I`${v}`);
            }
        }

        return s;
    };

    /**
     * Get the ith element of ordered set.  Used only by RandomPhrase so
     *  don't bother to implement if you're not doing that for a new
     *  ANTLR code gen target.
     *
     * @param i tbd
     *
     * @returns tbd
     */
    public get = (i: number): number => {
        const n: number = this.intervals.size();
        let index = 0;
        for (let j = 0; j < n; j++) {
            const interval = this.intervals.get(j);
            const a = interval.a;
            const b = interval.b;
            for (let v = a; v <= b; v++) {
                if (index === i) {
                    return v;
                }
                index++;
            }
        }

        return -1;
    };

    public toArray = (): Int32Array => {
        return this.toIntegerList().toArray();
    };

    public remove = (el: number): void => {
        if (this.#readOnly) {
            throw new java.lang.IllegalStateException(S`can't alter readonly IntervalSet`);
        }

        const n: number = this.intervals.size();
        for (let i = 0; i < n; i++) {
            const interval = this.intervals.get(i);
            const a = interval.a;
            const b = interval.b;
            if (el < a) {
                break; // list is sorted and el is before this interval; not here
            }

            // if whole interval x..x, rm
            if (el === a && el === b) {
                this.intervals.remove(i);
                break;
            }

            // if on left edge x..b, adjust left
            if (el === a) {
                interval.a++;
                break;
            }

            // if on right edge a..x, adjust right
            if (el === b) {
                interval.b--;
                break;
            }

            // if in middle a..x..b, split interval
            if (el > a && el < b) { // found in this interval
                const oldB = interval.b;
                interval.b = el - 1;      // [a..x-1]
                this.add(el + 1, oldB); // add [x+1..b]
            }
        }
    };

    public isReadonly = (): boolean => {
        return this.#readOnly;
    };

    public setReadonly = (readonly: boolean): void => {
        if (this.#readOnly && !readonly) {
            throw new java.lang.IllegalStateException(S`can't alter readonly IntervalSet`);
        }

        this.#readOnly = readonly;
    };

    protected elementName(vocabulary: Vocabulary, a: number): java.lang.String {
        if (a === Token.EOF) {
            return S`<EOF>`;
        } else {
            if (a === Token.EPSILON) {
                return S`<EPSILON>`;
            } else {
                return vocabulary.getDisplayName(a) ?? S`null`;
            }
        }
    }

    static {
        IntervalSet.COMPLETE_CHAR_SET.setReadonly(true);
        IntervalSet.EMPTY_SET.setReadonly(true);
    }
}
