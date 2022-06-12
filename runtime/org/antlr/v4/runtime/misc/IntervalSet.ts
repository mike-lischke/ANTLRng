/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/*
 eslint-disable @typescript-eslint/no-namespace, @typescript-eslint/naming-convention,
 max-classes-per-file, jsdoc/check-tag-names, @typescript-eslint/no-empty-function,
 @typescript-eslint/restrict-plus-operands, @typescript-eslint/unified-signatures, @typescript-eslint/member-ordering,
 no-underscore-dangle
*/

/* cspell: disable */



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
export  class IntervalSet extends  IntSet {
	public static readonly  COMPLETE_CHAR_SET?:  IntervalSet = IntervalSet.of(Lexer.MIN_CHAR_VALUE, Lexer.MAX_CHAR_VALUE);

	public static readonly  EMPTY_SET?:  IntervalSet = new  IntervalSet();

	/** The list of sorted, disjoint intervals. */
    protected intervals?:  java.util.List<Interval>;

    protected readonly:  boolean;

	public constructor(intervals: java.util.List<Interval>);

	public constructor(set: IntervalSet);

	public constructor(...els: number);
public constructor(intervalsOrSetOrEls: java.util.List<Interval> | IntervalSet | number) {
const $this = (intervalsOrSetOrEls: java.util.List<Interval> | IntervalSet | number): void => {
if (intervalsOrSetOrEls instanceof java.util.List) {
const intervals = intervalsOrSetOrEls as java.util.List<Interval>;
		super();
this.intervals = intervals;
	}
 else if (intervalsOrSetOrEls instanceof IntervalSet) {
const set = intervalsOrSetOrEls as IntervalSet;
		$this();
		this.addAll(set);
	}
 else  {
let els = intervalsOrSetOrEls as number;
		super();
if ( els===undefined ) {
			this.intervals = new  java.util.ArrayList<Interval>(2); // most sets are 1 or 2 elements
		}
		else {
			this.intervals = new  java.util.ArrayList<Interval>(els.length);
			for (let e of els) this.add(e);
		}
	}
};

$this(intervalsOrSetOrEls);

}


	/** Create a set with a single element, el. */

    public static of(a: number): IntervalSet;

    /** Create a set with all ints within range [a..b] (inclusive) */
	public static of(a: number, b: number): IntervalSet;


	/** Create a set with a single element, el. */

    public static of(a: number, b?: number):  IntervalSet {
if (b === undefined) {
		let  s: IntervalSet = new  IntervalSet();
        s.add(a);
        return s;
    }
 else  {
		let  s: IntervalSet = new  IntervalSet();
		s.add(a,b);
		return s;
	}

}


	public clear = (): void => {
        if ( this.readonly ) {
 throw new  java.lang.IllegalStateException("can't alter readonly IntervalSet");
}

		this.intervals.clear();
	}

    /** Add a single element to the set.  An isolated element is stored
     *  as a range el..el.
     */
    public add(el: number): void;

	// copy on write so we can cache a..a intervals and sets of that
	protected add(addition: Interval): void;

    /** Add interval; i.e., add all integers from a to b to set.
     *  If b&lt;a, do nothing.
     *  Keep list in sorted order (by left range value).
     *  If overlap, combine ranges.  For example,
     *  If this is {1..5, 10..20}, adding 6..7 yields
     *  {1..5, 6..7, 10..20}.  Adding 4..8 yields {1..8, 10..20}.
     */
    public add(a: number, b: number): void;


    /** Add a single element to the set.  An isolated element is stored
     *  as a range el..el.
     */
    public add(elOrAdditionOrA: number | Interval, b?: number):  void {
if (typeof elOrAdditionOrA === "number" && b === undefined) {
const el = elOrAdditionOrA as number;
        if ( this.readonly ) {
 throw new  java.lang.IllegalStateException("can't alter readonly IntervalSet");
}

        this.add(el,el);
    }
 else if (elOrAdditionOrA instanceof Interval && b === undefined) {
const addition = elOrAdditionOrA as Interval;
        if ( this.readonly ) {
 throw new  java.lang.IllegalStateException("can't alter readonly IntervalSet");
}

		//System.out.println("add "+addition+" to "+intervals.toString());
		if ( addition.b<addition.a ) {
			return;
		}
		// find position in list
		// Use iterators as we modify list in place
		for (let  iter: java.util.ListIterator<Interval> = this.intervals.listIterator(); iter.hasNext();) {
			let  r: Interval = iter.next();
			if ( addition.equals(r) ) {
				return;
			}
			if ( addition.adjacent(r) || !addition.disjoint(r) ) {
				// next to each other, make a single larger interval
				let  bigger: Interval = addition.union(r);
				iter.set(bigger);
				// make sure we didn't just create an interval that
				// should be merged with next interval in list
				while ( iter.hasNext() ) {
					let  next: Interval = iter.next();
					if ( !bigger.adjacent(next) && bigger.disjoint(next) ) {
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
			if ( addition.startsBeforeDisjoint(r) ) {
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
	}
 else  {
let a = elOrAdditionOrA as number;
        this.add(Interval.of(a, b));
    }

}


	public addAll = (set: IntSet): IntervalSet => {
		if ( set===undefined ) {
			return this;
		}

		if (set instanceof IntervalSet) {
			let  other: IntervalSet = set as IntervalSet;
			// walk set and add each interval
			let  n: number = other.intervals.size();
			for (let  i: number = 0; i < n; i++) {
				let  I: Interval = other.intervals.get(i);
				this.add(I.a,I.b);
			}
		}
		else {
			for (let value of set.toList()) {
				this.add(value);
			}
		}

		return this;
    }

    /** {@inheritDoc} */
    public complement(vocabulary: IntSet): IntervalSet;

    public complement(minElement: number, maxElement: number): IntervalSet;


    public complement(vocabularyOrMinElement: IntSet | number, maxElement?: number):  IntervalSet {
if (vocabularyOrMinElement instanceof IntSet && maxElement === undefined) {
const vocabulary = vocabularyOrMinElement as IntSet;
		if ( vocabulary===undefined || vocabulary.isNil() ) {
			return undefined; // nothing in common with null set
		}

		let  vocabularyIS: IntervalSet;
		if (vocabulary instanceof IntervalSet) {
			vocabularyIS = vocabulary as IntervalSet;
		}
		else {
			vocabularyIS = new  IntervalSet();
			vocabularyIS.addAll(vocabulary);
		}

		return vocabularyIS.subtract(this);
    }
 else  {
let minElement = vocabularyOrMinElement as number;
        return this.complement(IntervalSet.of(minElement,maxElement));
    }

}


	/**
	 * Compute the set difference between two interval sets. The specific
	 * operation is {@code left - right}. If either of the input sets is
	 * {@code null}, it is treated as though it was an empty set.
	 */

	public static subtract = (left: IntervalSet, right: IntervalSet): IntervalSet => {
		if (left === undefined || left.isNil()) {
			return new  IntervalSet();
		}

		let  result: IntervalSet = new  IntervalSet(left);
		if (right === undefined || right.isNil()) {
			// right set has no elements; just return the copy of the current set
			return result;
		}

		let  resultI: number = 0;
		let  rightI: number = 0;
		while (resultI < result.intervals.size() && rightI < right.intervals.size()) {
			let  resultInterval: Interval = result.intervals.get(resultI);
			let  rightInterval: Interval = right.intervals.get(rightI);

			// operation: (resultInterval - rightInterval) and update indexes

			if (rightInterval.b < resultInterval.a) {
				rightI++;
				continue;
			}

			if (rightInterval.a > resultInterval.b) {
				resultI++;
				continue;
			}

			let  beforeCurrent: Interval = undefined;
			let  afterCurrent: Interval = undefined;
			if (rightInterval.a > resultInterval.a) {
				beforeCurrent = new  Interval(resultInterval.a, rightInterval.a - 1);
			}

			if (rightInterval.b < resultInterval.b) {
				afterCurrent = new  Interval(rightInterval.b + 1, resultInterval.b);
			}

			if (beforeCurrent !== undefined) {
				if (afterCurrent !== undefined) {
					// split the current interval into two
					result.intervals.set(resultI, beforeCurrent);
					result.intervals.add(resultI + 1, afterCurrent);
					resultI++;
					rightI++;
					continue;
				}
				else {
					// replace the current interval
					result.intervals.set(resultI, beforeCurrent);
					resultI++;
					continue;
				}
			}
			else {
				if (afterCurrent !== undefined) {
					// replace the current interval
					result.intervals.set(resultI, afterCurrent);
					rightI++;
					continue;
				}
				else {
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
		let  o: IntervalSet = new  IntervalSet();
		o.addAll(this);
		o.addAll(a);
		return o;
	}

    /** {@inheritDoc} */
	public and = (other: IntSet): IntervalSet => {
		if ( other===undefined ) { //|| !(other instanceof IntervalSet) ) {
			return undefined; // nothing in common with null set
		}

		let  myIntervals: java.util.List<Interval> = this.intervals;
		let  theirIntervals: java.util.List<Interval> = (other as IntervalSet).intervals;
		let  intersection: IntervalSet = undefined;
		let  mySize: number = myIntervals.size();
		let  theirSize: number = theirIntervals.size();
		let  i: number = 0;
		let  j: number = 0;
		// iterate down both interval lists looking for nondisjoint intervals
		while ( i<mySize && j<theirSize ) {
			let  mine: Interval = myIntervals.get(i);
			let  theirs: Interval = theirIntervals.get(j);
			//System.out.println("mine="+mine+" and theirs="+theirs);
			if ( mine.startsBeforeDisjoint(theirs) ) {
				// move this iterator looking for interval that might overlap
				i++;
			}
			else { if ( theirs.startsBeforeDisjoint(mine) ) {
				// move other iterator looking for interval that might overlap
				j++;
			}
			else { if ( mine.properlyContains(theirs) ) {
				// overlap, add intersection, get next theirs
				if ( intersection===undefined ) {
					intersection = new  IntervalSet();
				}
				intersection.add(mine.intersection(theirs));
				j++;
			}
			else { if ( theirs.properlyContains(mine) ) {
				// overlap, add intersection, get next mine
				if ( intersection===undefined ) {
					intersection = new  IntervalSet();
				}
				intersection.add(mine.intersection(theirs));
				i++;
			}
			else { if ( !mine.disjoint(theirs) ) {
				// overlap, add intersection
				if ( intersection===undefined ) {
					intersection = new  IntervalSet();
				}
				intersection.add(mine.intersection(theirs));
				// Move the iterator of lower range [a..b], but not
				// the upper range as it may contain elements that will collide
				// with the next iterator. So, if mine=[0..115] and
				// theirs=[115..200], then intersection is 115 and move mine
				// but not theirs as theirs may collide with the next range
				// in thisIter.
				// move both iterators to next ranges
				if ( mine.startsAfterNonDisjoint(theirs) ) {
					j++;
				}
				else { if ( theirs.startsAfterNonDisjoint(mine) ) {
					i++;
				}
}

			}
}

}

}

}

		}
		if ( intersection===undefined ) {
			return new  IntervalSet();
		}
		return intersection;
	}

    /** {@inheritDoc} */
    public contains = (el: number): boolean => {
		let  n: number = this.intervals.size();
		let  l: number = 0;
		let  r: number = n - 1;
		// Binary search for the element in the (sorted,
		// disjoint) array of intervals.
		while (l <= r) {
			let  m: number = (l + r) / 2;
			let  I: Interval = this.intervals.get(m);
			let  a: number = I.a;
			let  b: number = I.b;
			if ( b<el ) {
				l = m + 1;
			} else { if ( a>el ) {
				r = m - 1;
			} else { // el >= a && el <= b
				return true;
			}
}

		}
		return false;
    }

    /** {@inheritDoc} */
    public isNil = (): boolean => {
        return this.intervals===undefined || this.intervals.isEmpty();
    }

	/**
	 * Returns the maximum value contained in the set if not isNil().
	 *
	 * @return the maximum value contained in the set.
	 * @throws RuntimeException if set is empty
	 */
	public getMaxElement = (): number => {
		if ( this.isNil() ) {
			throw new  java.lang.RuntimeException("set is empty");
		}
		let  last: Interval = this.intervals.get(this.intervals.size()-1);
		return last.b;
	}

	/**
	 * Returns the minimum value contained in the set if not isNil().
	 *
	 * @return the minimum value contained in the set.
	 * @throws RuntimeException if set is empty
	 */
	public getMinElement = (): number => {
		if ( this.isNil() ) {
			throw new  java.lang.RuntimeException("set is empty");
		}

		return this.intervals.get(0).a;
	}

    /** Return a list of Interval objects. */
    public getIntervals = (): java.util.List<Interval> => {
        return this.intervals;
    }

	public hashCode = (): number => {
		let  hash: number = MurmurHash.initialize();
		for (let I of this.intervals) {
			hash = MurmurHash.update(hash, I.a);
			hash = MurmurHash.update(hash, I.b);
		}

		hash = MurmurHash.finish(hash, this.intervals.size() * 2);
		return hash;
	}

	/** Are two IntervalSets equal?  Because all intervals are sorted
     *  and disjoint, equals is a simple linear walk over both lists
     *  to make sure they are the same.  Interval.equals() is used
     *  by the List.equals() method to check the ranges.
     */
    public equals = (obj: object): boolean => {
        if ( obj===undefined || !(obj instanceof IntervalSet) ) {
            return false;
        }
        let  other: IntervalSet = obj as IntervalSet;
		return this.intervals.equals(other.intervals);
	}

	public toString(): string;

	public toString(elemAreChar: boolean): string;

	/**
	 * @deprecated Use {@link #toString(Vocabulary)} instead.
	 */
	public toString(tokenNames: string[]): string;

	public toString(vocabulary: Vocabulary): string;


	public toString(elemAreCharOrTokenNamesOrVocabulary?: boolean | string[] | Vocabulary):  string {
if (elemAreCharOrTokenNamesOrVocabulary === undefined) { return this.toString(false); }
 else if (typeof elemAreCharOrTokenNamesOrVocabulary === "boolean") {
const elemAreChar = elemAreCharOrTokenNamesOrVocabulary as boolean;
		let  buf: java.lang.StringBuilder = new  java.lang.StringBuilder();
		if ( this.intervals===undefined || this.intervals.isEmpty() ) {
			return "{}";
		}
		if ( this.size()>1 ) {
			buf.append("{");
		}
		let  iter: Iterator<Interval> = this.intervals.iterator();
		while (iter.hasNext()) {
			let  I: Interval = iter.next();
			let  a: number = I.a;
			let  b: number = I.b;
			if ( a===b ) {
				if ( a===Token.EOF ) {
 buf.append("<EOF>");
}

				else { if ( elemAreChar ) {
 buf.append("'").appendCodePoint(a).append("'");
}

				else { buf.append(a);
}

}

			}
			else {
				if ( elemAreChar ) {
 buf.append("'").appendCodePoint(a).append("'..'").appendCodePoint(b).append("'");
}

				else { buf.append(a).append("..").append(b);
}

			}
			if ( iter.hasNext() ) {
				buf.append(", ");
			}
		}
		if ( this.size()>1 ) {
			buf.append("}");
		}
		return buf.toString();
	}
 else if (typeof elemAreCharOrTokenNamesOrVocabulary === "string[]") {
const tokenNames = elemAreCharOrTokenNamesOrVocabulary as string[];
		return this.toString(VocabularyImpl.fromTokenNames(tokenNames));
	}
 else  {
let vocabulary = elemAreCharOrTokenNamesOrVocabulary as Vocabulary;
		let  buf: java.lang.StringBuilder = new  java.lang.StringBuilder();
		if ( this.intervals===undefined || this.intervals.isEmpty() ) {
			return "{}";
		}
		if ( this.size()>1 ) {
			buf.append("{");
		}
		let  iter: Iterator<Interval> = this.intervals.iterator();
		while (iter.hasNext()) {
			let  I: Interval = iter.next();
			let  a: number = I.a;
			let  b: number = I.b;
			if ( a===b ) {
				buf.append(this.elementName(vocabulary, a));
			}
			else {
				for (let  i: number=a; i<=b; i++) {
					if ( i>a ) {
 buf.append(", ");
}

                    buf.append(this.elementName(vocabulary, i));
				}
			}
			if ( iter.hasNext() ) {
				buf.append(", ");
			}
		}
		if ( this.size()>1 ) {
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
	 * @deprecated Use {@link #elementName(Vocabulary, int)} instead.
	 */
	protected elementName(tokenNamesOrVocabulary: string[] | Vocabulary, a: number):  string {
if (typeof tokenNamesOrVocabulary === "string[]" && ) {
const tokenNames = tokenNamesOrVocabulary as string[];
		return this.elementName(VocabularyImpl.fromTokenNames(tokenNames), a);
	}
 else  {
let vocabulary = tokenNamesOrVocabulary as Vocabulary;
		if (a === Token.EOF) {
			return "<EOF>";
		}
		else { if (a === Token.EPSILON) {
			return "<EPSILON>";
		}
		else {
			return vocabulary.getDisplayName(a);
		}
}

	}

}


    public size = (): number => {
		let  n: number = 0;
		let  numIntervals: number = this.intervals.size();
		if ( numIntervals===1 ) {
			let  firstInterval: Interval = this.intervals.get(0);
			return firstInterval.b-firstInterval.a+1;
		}
		for (let  i: number = 0; i < numIntervals; i++) {
			let  I: Interval = this.intervals.get(i);
			n += (I.b-I.a+1);
		}
		return n;
    }

	public toIntegerList = (): IntegerList => {
		let  values: IntegerList = new  IntegerList(this.size());
		let  n: number = this.intervals.size();
		for (let  i: number = 0; i < n; i++) {
			let  I: Interval = this.intervals.get(i);
			let  a: number = I.a;
			let  b: number = I.b;
			for (let  v: number=a; v<=b; v++) {
				values.add(v);
			}
		}
		return values;
	}

    public toList = (): java.util.List<java.lang.Integer> => {
		let  values: java.util.List<java.lang.Integer> = new  java.util.ArrayList<java.lang.Integer>();
		let  n: number = this.intervals.size();
		for (let  i: number = 0; i < n; i++) {
			let  I: Interval = this.intervals.get(i);
			let  a: number = I.a;
			let  b: number = I.b;
			for (let  v: number=a; v<=b; v++) {
				values.add(v);
			}
		}
		return values;
	}

	public toSet = (): Set<java.lang.Integer> => {
		let  s: Set<java.lang.Integer> = new  HashSet<java.lang.Integer>();
		for (let I of this.intervals) {
			let  a: number = I.a;
			let  b: number = I.b;
			for (let  v: number=a; v<=b; v++) {
				s.add(v);
			}
		}
		return s;
	}

	/** Get the ith element of ordered set.  Used only by RandomPhrase so
	 *  don't bother to implement if you're not doing that for a new
	 *  ANTLR code gen target.
	 */
	public get = (i: number): number => {
		let  n: number = this.intervals.size();
		let  index: number = 0;
		for (let  j: number = 0; j < n; j++) {
			let  I: Interval = this.intervals.get(j);
			let  a: number = I.a;
			let  b: number = I.b;
			for (let  v: number=a; v<=b; v++) {
				if ( index===i ) {
					return v;
				}
				index++;
			}
		}
		return -1;
	}

	public toArray = (): number[] => {
		return this.toIntegerList().toArray();
	}

	public remove = (el: number): void => {
        if ( this.readonly ) {
 throw new  java.lang.IllegalStateException("can't alter readonly IntervalSet");
}

        let  n: number = this.intervals.size();
        for (let  i: number = 0; i < n; i++) {
            let  I: Interval = this.intervals.get(i);
            let  a: number = I.a;
            let  b: number = I.b;
            if ( el<a ) {
                break; // list is sorted and el is before this interval; not here
            }
            // if whole interval x..x, rm
            if ( el===a && el===b ) {
                this.intervals.remove(i);
                break;
            }
            // if on left edge x..b, adjust left
            if ( el===a ) {
                I.a++;
                break;
            }
            // if on right edge a..x, adjust right
            if ( el===b ) {
                I.b--;
                break;
            }
            // if in middle a..x..b, split interval
            if ( el>a && el<b ) { // found in this interval
                let  oldb: number = I.b;
                I.b = el-1;      // [a..x-1]
                this.add(el+1, oldb); // add [x+1..b]
            }
        }
    }

    public isReadonly = (): boolean => {
        return this.readonly;
    }

    public setReadonly = (readonly: boolean): void => {
        if ( this.readonly && !readonly ) {
 throw new  java.lang.IllegalStateException("can't alter readonly IntervalSet");
}

        this.readonly = readonly;
    }
	static {
		IntervalSet.COMPLETE_CHAR_SET.setReadonly(true);
	}
	static {
		IntervalSet.EMPTY_SET.setReadonly(true);
	}
}
