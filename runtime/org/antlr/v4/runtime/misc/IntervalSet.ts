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

/* eslint-disable jsdoc/require-returns */

import { java } from "../../../../../../lib/java/java";

import { IntegerList } from "./IntegerList";
import { Interval } from "./Interval";
import { IntSet } from "./IntSet";
import { MurmurHash } from "./MurmurHash";
import { Lexer } from "../Lexer";
import { Token } from "../Token";
import { Vocabulary } from "../Vocabulary";
import { VocabularyImpl } from "../VocabularyImpl";

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
export class IntervalSet extends IntSet {
    public static readonly COMPLETE_CHAR_SET?: IntervalSet = IntervalSet.of(Lexer.MIN_CHAR_VALUE, Lexer.MAX_CHAR_VALUE);

    public static readonly EMPTY_SET?: IntervalSet = new IntervalSet();

    /** The list of sorted, disjoint intervals. */
    protected intervals?: java.util.List<Interval>;

    protected readonly: boolean;

    /* eslint-disable constructor-super, @typescript-eslint/no-unsafe-call */
    public constructor(intervals: java.util.List<Interval>);
    public constructor(set: IntervalSet);
    public constructor(...els: number[]);
    /* @ts-expect-error, because of the super() call in the closure. */
    public constructor(...intervalsOrSetOrEls: unknown[]) {
        const $this = (...intervalsOrSetOrEls: unknown[]): void => {
            if (intervalsOrSetOrEls.length === 1 && intervalsOrSetOrEls[0] instanceof java.util.List) {
                const intervals = intervalsOrSetOrEls[0] as java.util.List<Interval>;
                /* @ts-expect-error, because of the super() call in the closure. */
                super();
                this.intervals = intervals;
            } else if (intervalsOrSetOrEls.length === 1 && intervalsOrSetOrEls[0] instanceof IntervalSet) {
                const set = intervalsOrSetOrEls[0];
                $this();
                this.addAll(set);
            } else {
                const els = intervalsOrSetOrEls as number[];
                /* @ts-expect-error, because of the super() call in the closure. */
                super();
                if (els === undefined) {
                    this.intervals = new java.util.ArrayList<Interval>(2); // most sets are 1 or 2 elements
                } else {
                    this.intervals = new java.util.ArrayList<Interval>(els.length);
                    for (const e of els) { this.add(e); }
                }
            }
        };

        $this(...intervalsOrSetOrEls);

    }
    /* eslint-enable constructor-super, @typescript-eslint/no-unsafe-call */

    /** Create a set with a single element, el. */
    public static of(a: number): IntervalSet;
    /** Create a set with all ints within range [a..b] (inclusive) */
    public static of(a: number, b: number): IntervalSet;
    /**
     * Create a set with a single element, el.
     *
     * @param a tbd
     * @param b tbd
     */
    public static of(a: number, b?: number): IntervalSet {
        if (b === undefined) {
            const s: IntervalSet = new IntervalSet();
            s.add(a);

            return s;
        } else {
            const s: IntervalSet = new IntervalSet();
            s.add(a, b);

            return s;
        }

    }

    public clear = (): void => {
        if (this.readonly) {
            throw new java.lang.IllegalStateException("can't alter readonly IntervalSet");
        }

        this.intervals.clear();
    };

    /**
     * Add a single element to the set.  An isolated element is stored
     *  as a range el..el.
     */
    public add(el: number): void;
    // copy on write so we can cache a..a intervals and sets of that
    public add(addition: Interval): void;
    /**
     * Add interval; i.e., add all integers from a to b to set.
     *  If b&lt;a, do nothing.
     *  Keep list in sorted order (by left range value).
     *  If overlap, combine ranges.  For example,
     *  If this is {1..5, 10..20}, adding 6..7 yields
     *  {1..5, 6..7, 10..20}.  Adding 4..8 yields {1..8, 10..20}.
     */
    public add(a: number, b: number): void;
    /**
     * Add a single element to the set.  An isolated element is stored
     *  as a range el..el.
     *
     * @param elOrAdditionOrA tbd
     * @param b tbd
     */
    public add(elOrAdditionOrA: number | Interval, b?: number): void {
        if (typeof elOrAdditionOrA === "number" && b === undefined) {
            const el = elOrAdditionOrA;
            if (this.readonly) {
                throw new java.lang.IllegalStateException("can't alter readonly IntervalSet");
            }

            this.add(el, el);
        } else if (elOrAdditionOrA instanceof Interval && b === undefined) {
            const addition = elOrAdditionOrA;
            if (this.readonly) {
                throw new java.lang.IllegalStateException("can't alter readonly IntervalSet");
            }

            //System.out.println("add "+addition+" to "+intervals.toString());
            if (addition.b < addition.a) {
                return;
            }
            // find position in list
            // Use iterators as we modify list in place
            for (let iter: java.util.ListIterator<Interval> = this.intervals.listIterator(); iter.hasNext();) {
                const r: Interval = iter.next();
                if (addition.equals(r)) {
                    return;
                }
                if (addition.adjacent(r) || !(addition.disjoint(r))) {
                    // next to each other, make a single larger interval
                    const bigger: Interval = addition.union(r);
                    iter.set(bigger);
                    // make sure we didn't just create an interval that
                    // should be merged with next interval in list
                    while (iter.hasNext()) {
                        const next: Interval = iter.next();
                        if (!(bigger.adjacent(next)) && bigger.disjoint(next)) {
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
            const a = elOrAdditionOrA as number;
            this.add(Interval.of(a, b));
        }

    }

    public addAll = (set: IntSet): IntervalSet => {
        if (set === undefined) {
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

    /** {@inheritDoc} */
    public complement(vocabulary: IntSet): IntervalSet;
    public complement(minElement: number, maxElement: number): IntervalSet;
    public complement(vocabularyOrMinElement: IntSet | number, maxElement?: number): IntervalSet {
        if (vocabularyOrMinElement instanceof IntSet && maxElement === undefined) {
            const vocabulary = vocabularyOrMinElement;
            if (vocabulary === undefined || vocabulary.isNil()) {
                return undefined; // nothing in common with null set
            }

            let vocabularyIS: IntervalSet;
            if (vocabulary instanceof IntervalSet) {
                vocabularyIS = vocabulary;
            } else {
                vocabularyIS = new IntervalSet();
                vocabularyIS.addAll(vocabulary);
            }

            return vocabularyIS.subtract(this);
        } else {
            const minElement = vocabularyOrMinElement as number;

            return this.complement(IntervalSet.of(minElement, maxElement));
        }
    }

    public subtract(a?: IntSet): IntervalSet {
        if (a === undefined || a.isNil()) {
            return new IntervalSet(this);
        }

        if (a instanceof IntervalSet) {
            return IntervalSet.subtract(this, a);
        }

        const other = new IntervalSet();
        other.addAll(a);

        return IntervalSet.subtract(this, other);
    }

    /**
     * Compute the set difference between two interval sets. The specific
     * operation is {@code left - right}. If either of the input sets is
     * {@code null}, it is treated as though it was an empty set.
     *
     * @param left tbd
     * @param right tbd
     */
    public static subtract(left?: IntervalSet, right?: IntervalSet): IntervalSet {
        if (left === undefined || left.isNil()) {
            return new IntervalSet();
        }

        const result = new IntervalSet(left);
        if (right === undefined || right.isNil()) {
            // right set has no elements; just return the copy of the current set
            return result;
        }

        let resultI = 0;
        let rightI = 0;
        while (resultI < result.intervals.size() && rightI < right.intervals.size()) {
            const resultInterval = result.intervals.get(resultI);
            const rightInterval = right.intervals.get(rightI);

            // operation: (resultInterval - rightInterval) and update indexes
            if (rightInterval.b < resultInterval.a) {
                rightI++;
                continue;
            }

            if (rightInterval.a > resultInterval.b) {
                resultI++;
                continue;
            }

            let beforeCurrent;
            let afterCurrent;
            if (rightInterval.a > resultInterval.a) {
                beforeCurrent = new Interval(resultInterval.a, rightInterval.a - 1);
            }

            if (rightInterval.b < resultInterval.b) {
                afterCurrent = new Interval(rightInterval.b + 1, resultInterval.b);
            }

            if (beforeCurrent !== undefined) {
                if (afterCurrent !== undefined) {
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
                if (afterCurrent !== undefined) {
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
    }

    public or = (a: IntSet): IntervalSet => {
        const o: IntervalSet = new IntervalSet();
        o.addAll(this);
        o.addAll(a);

        return o;
    };

    /**
     * {@inheritDoc}
     *
     * @param other tbd
     */
    public and = (other: IntSet): IntervalSet => {
        if (other === undefined) { //|| !(other instanceof IntervalSet) ) {
            return undefined; // nothing in common with null set
        }

        const myIntervals: java.util.List<Interval> = this.intervals;
        const theirIntervals: java.util.List<Interval> = (other as IntervalSet).intervals;
        let intersection: IntervalSet;
        const mySize: number = myIntervals.size();
        const theirSize: number = theirIntervals.size();
        let i = 0;
        let j = 0;
        // iterate down both interval lists looking for nondisjoint intervals
        while (i < mySize && j < theirSize) {
            const mine: Interval = myIntervals.get(i);
            const theirs: Interval = theirIntervals.get(j);
            //System.out.println("mine="+mine+" and theirs="+theirs);
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
                        if (intersection === undefined) {
                            intersection = new IntervalSet();
                        }
                        intersection.add(mine.intersection(theirs));
                        j++;
                    } else {
                        if (theirs.properlyContains(mine)) {
                            // overlap, add intersection, get next mine
                            if (intersection === undefined) {
                                intersection = new IntervalSet();
                            }
                            intersection.add(mine.intersection(theirs));
                            i++;
                        } else {
                            if (!(mine.disjoint(theirs))) {
                                // overlap, add intersection
                                if (intersection === undefined) {
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
        if (intersection === undefined) {
            return new IntervalSet();
        }

        return intersection;
    };

    /**
     * {@inheritDoc}
     *
     * @param el tbd
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

    /** {@inheritDoc} */
    public isNil = (): boolean => {
        return this.intervals === undefined || this.intervals.isEmpty();
    };

    /**
     * Returns the maximum value contained in the set if not isNil().
     *
     * @return the maximum value contained in the set.
     * @throws RuntimeException if set is empty
     */
    public getMaxElement = (): number => {
        if (this.isNil()) {
            throw new java.lang.RuntimeException("set is empty");
        }
        const last: Interval = this.intervals.get(this.intervals.size() - 1);

        return last.b;
    };

    /**
     * Returns the minimum value contained in the set if not isNil().
     *
     * @return the minimum value contained in the set.
     * @throws RuntimeException if set is empty
     */
    public getMinElement = (): number => {
        if (this.isNil()) {
            throw new java.lang.RuntimeException("set is empty");
        }

        return this.intervals.get(0).a;
    };

    /** Return a list of Interval objects. */
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
     */
    public equals = (obj: unknown): boolean => {
        if (obj === undefined || !((obj instanceof IntervalSet))) {
            return false;
        }

        return this.intervals.equals(obj.intervals);
    };

    public toString(): string;
    public toString(elemAreChar: boolean): string;
    /**
     * @deprecated Use {@link #toString(Vocabulary)} instead.
     */
    public toString(tokenNames: string[]): string;
    public toString(vocabulary: Vocabulary): string;
    public toString(elemAreCharOrTokenNamesOrVocabulary?: boolean | string[] | Vocabulary): string {
        if (elemAreCharOrTokenNamesOrVocabulary === undefined) {
            return this.toString(false);
        } else if (typeof elemAreCharOrTokenNamesOrVocabulary === "boolean") {
            const elemAreChar = elemAreCharOrTokenNamesOrVocabulary;
            const buf = new java.lang.StringBuilder();
            if (this.intervals === undefined || this.intervals.isEmpty()) {
                return "{}";
            }

            if (this.size() > 1) {
                buf.append("{");
            }

            const localBuffer = new java.lang.StringBuilder();
            for (const interval of this.intervals) {
                if (localBuffer.length() > 0) {
                    localBuffer.append(", ");
                }

                const a = interval.a;
                const b = interval.b;
                if (a === b) {
                    if (a === Token.EOF) {
                        localBuffer.append("<EOF>");
                    } else {
                        if (elemAreChar) {
                            localBuffer.append("'").appendCodePoint(a).append("'");
                        } else {
                            localBuffer.append(a);
                        }

                    }

                } else {
                    if (elemAreChar) {
                        localBuffer.append("'").appendCodePoint(a).append("'..'").appendCodePoint(b).append("'");
                    } else {
                        localBuffer.append(a).append("..").append(b);
                    }
                }
            }

            buf.append(localBuffer);

            if (this.size() > 1) {
                buf.append("}");
            }

            return buf.toString();
        } else if (Array.isArray(elemAreCharOrTokenNamesOrVocabulary)) {
            const tokenNames = elemAreCharOrTokenNamesOrVocabulary;

            return this.toString(VocabularyImpl.fromTokenNames(tokenNames));
        } else {
            const vocabulary = elemAreCharOrTokenNamesOrVocabulary;
            const buf = new java.lang.StringBuilder();

            if (this.intervals === undefined || this.intervals.isEmpty()) {
                return "{}";
            }

            if (this.size() > 1) {
                buf.append("{");
            }

            const localBuffer = new java.lang.StringBuilder();
            for (const interval of this.intervals) {
                if (localBuffer.length() > 0) {
                    localBuffer.append(", ");
                }

                const a = interval.a;
                const b = interval.b;
                if (a === b) {
                    localBuffer.append(this.elementName(vocabulary, a));
                } else {
                    for (let i: number = a; i <= b; i++) {
                        if (i > a) {
                            localBuffer.append(", ");
                        }

                        localBuffer.append(this.elementName(vocabulary, i));
                    }
                }
            }

            buf.append(localBuffer);
            if (this.size() > 1) {
                buf.append("}");
            }

            return buf.toString();
        }

    }

    /**
     * @deprecated Use {@link #elementName(Vocabulary, int)} instead.
     */
    protected elementName(tokenNames: string[], a: number): string;
    protected elementName(vocabulary: Vocabulary, a: number): string;
    /**
     * @param tokenNamesOrVocabulary tbd
     * @param a tbd
     * @deprecated Use {@link #elementName(Vocabulary, int)} instead.
     */
    protected elementName(tokenNamesOrVocabulary: string[] | Vocabulary, a: number): string {
        if (Array.isArray(tokenNamesOrVocabulary)) {
            const tokenNames = tokenNamesOrVocabulary;

            return this.elementName(VocabularyImpl.fromTokenNames(tokenNames), a);
        } else {
            const vocabulary = tokenNamesOrVocabulary;
            if (a === Token.EOF) {
                return "<EOF>";
            } else {
                if (a === Token.EPSILON) {
                    return "<EPSILON>";
                } else {
                    return vocabulary.getDisplayName(a);
                }
            }
        }
    }

    public size = (): number => {
        let n = 0;
        const numIntervals = this.intervals.size();
        if (numIntervals === 1) {
            const firstInterval = this.intervals.get(0);

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

    public toList = (): number[] => {
        const values: number[] = [];
        const n: number = this.intervals.size();
        for (let i = 0; i < n; i++) {
            const interval = this.intervals.get(i);
            const a: number = interval.a;
            const b: number = interval.b;
            for (let v: number = a; v <= b; v++) {
                values.push(v);
            }
        }

        return values;
    };

    public toSet = (): Set<number> => {
        const s = new Set<number>();
        for (const I of this.intervals) {
            const a: number = I.a;
            const b: number = I.b;
            for (let v: number = a; v <= b; v++) {
                s.add(v);
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
     */
    public get = (i: number): number => {
        const n: number = this.intervals.size();
        let index = 0;
        for (let j = 0; j < n; j++) {
            const I: Interval = this.intervals.get(j);
            const a: number = I.a;
            const b: number = I.b;
            for (let v: number = a; v <= b; v++) {
                if (index === i) {
                    return v;
                }
                index++;
            }
        }

        return -(1);
    };

    public toArray = (): number[] => {
        return this.toIntegerList().toArray();
    };

    public remove = (el: number): void => {
        if (this.readonly) {
            throw new java.lang.IllegalStateException("can't alter readonly IntervalSet");
        }

        const n: number = this.intervals.size();
        for (let i = 0; i < n; i++) {
            const I: Interval = this.intervals.get(i);
            const a: number = I.a;
            const b: number = I.b;
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
                I.a++;
                break;
            }
            // if on right edge a..x, adjust right
            if (el === b) {
                I.b--;
                break;
            }
            // if in middle a..x..b, split interval
            if (el > a && el < b) { // found in this interval
                const oldb: number = I.b;
                I.b = el - 1;      // [a..x-1]
                this.add(el + 1, oldb); // add [x+1..b]
            }
        }
    };

    public isReadonly = (): boolean => {
        return this.readonly;
    };

    public setReadonly = (readonly: boolean): void => {
        if (this.readonly && !(readonly)) {
            throw new java.lang.IllegalStateException("can't alter readonly IntervalSet");
        }

        this.readonly = readonly;
    };
    static {
        IntervalSet.COMPLETE_CHAR_SET.setReadonly(true);
    }
    static {
        IntervalSet.EMPTY_SET.setReadonly(true);
    }
}
