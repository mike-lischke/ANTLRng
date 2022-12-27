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
import { AbstractEqualityComparator } from "./AbstractEqualityComparator";
import { ObjectEqualityComparator } from "./ObjectEqualityComparator";


import { JavaObject } from "../../../../../../lib/java/lang/Object";
import { S } from "../../../../../../lib/templates";
import { MurmurHash } from "../../../../../../lib/MurmurHash";


/** {@link Set} implementation with closed hashing (open addressing). */
export  class Array2DHashSet<T> extends JavaObject implements java.util.Set<T> {
	public static readonly  INITAL_CAPACITY:  number = 16; // must be power of 2
	public static readonly  INITAL_BUCKET_CAPACITY:  number = 8;
	public static readonly  LOAD_FACTOR:  number = 0.75;


	protected readonly  comparator:  AbstractEqualityComparator< T> | null;

	protected buckets:  T[][] | null;

	/** How many elements in set */
	protected n:  number = 0;

	protected currentPrime:  number = 1; // jump by 4 primes each expand or whatever

	/** when to expand */
	protected threshold:  number;
	protected readonly  initialCapacity:  number;
	protected readonly  initialBucketCapacity:  number;

	/* eslint-disable constructor-super, @typescript-eslint/no-unsafe-call */
public constructor();

	public constructor(comparator: AbstractEqualityComparator< T>| null);

	public constructor(comparator: AbstractEqualityComparator< T>| null, initialCapacity: number, initialBucketCapacity: number);
/* @ts-expect-error, because of the super() call in the closure. */
public constructor(comparator?: AbstractEqualityComparator< T> | null, initialCapacity?: number, initialBucketCapacity?: number) {
const $this = (comparator?: AbstractEqualityComparator< T> | null, initialCapacity?: number, initialBucketCapacity?: number): void => {
if (comparator === undefined) {
		$this(null, Array2DHashSet.INITAL_CAPACITY, Array2DHashSet.INITAL_BUCKET_CAPACITY);
	}
 else if (comparator instanceof AbstractEqualityComparator && initialCapacity === undefined) {
		$this(comparator, Array2DHashSet.INITAL_CAPACITY, Array2DHashSet.INITAL_BUCKET_CAPACITY);
	}
 else  {

/* @ts-expect-error, because of the super() call in the closure. */
		super();
if (comparator === null) {
			comparator = ObjectEqualityComparator.INSTANCE;
		}

		this.comparator = comparator;
		this.initialCapacity = initialCapacity;
		this.initialBucketCapacity = initialBucketCapacity;
		this.buckets = this.createBuckets(initialCapacity);
		this.threshold = Number(Math.floor(initialCapacity * Array2DHashSet.LOAD_FACTOR));
	}
};

$this(comparator, initialCapacity, initialBucketCapacity);

}
/* eslint-enable constructor-super, @typescript-eslint/no-unsafe-call */

	/**
	 * Add {@code o} to set if not there; return existing value if already
	 * there. This method performs the same operation as {@link #add} aside from
	 * the return value.
	 */
	public readonly  getOrAdd = (o: T| null):  T | null => {
		if ( this.n > this.threshold ) {
 this.expand();
}

		return this.getOrAddImpl(o);
	}

	protected getOrAddImpl = (o: T| null):  T | null => {
		let  b: number = this.getBucket(o);
		let  bucket: T[] = this.buckets[b];

		// NEW BUCKET
		if ( bucket===null ) {
			bucket = this.createBucket(this.initialBucketCapacity);
			bucket[0] = o;
			this.buckets[b] = bucket;
			this.n++;
			return o;
		}

		// LOOK FOR IT IN BUCKET
		for (let  i: number=0; i<bucket.length; i++) {
			let  existing: T = bucket[i];
			if ( existing===null ) { // empty slot; not there, add.
				bucket[i] = o;
				this.n++;
				return o;
			}
			if ( this.comparator.equals(existing, o) ) {
 return existing;
}
 // found existing, quit
		}

		// FULL BUCKET, expand and add to end
		let  oldLength: number = bucket.length;
		bucket = java.util.Arrays.copyOf(bucket, bucket.length * 2);
		this.buckets[b] = bucket;
		bucket[oldLength] = o; // add to end
		this.n++;
		return o;
	}

	public get = (o: T| null):  T | null => {
		if ( o===null ) {
 return o;
}

		let  b: number = this.getBucket(o);
		let  bucket: T[] = this.buckets[b];
		if ( bucket===null ) {
 return null;
}
 // no bucket
		for (let e of bucket) {
			if ( e===null ) {
 return null;
}
 // empty slot; not there
			if ( this.comparator.equals(e, o) ) {
 return e;
}

		}
		return null;
	}

	protected readonly  getBucket = (o: T| null):  number => {
		let  hash: number = this.comparator.hashCode(o);
		let  b: number = hash & (this.buckets.length-1); // assumes len is power of 2
		return b;
	}

	public hashCode = ():  number => {
		let  hash: number = MurmurHash.initialize();
		for (let bucket of this.buckets) {
			if ( bucket===null ) {
 continue;
}

			for (let o of bucket) {
				if ( o===null ) {
 break;
}

				hash = MurmurHash.update(hash, this.comparator.hashCode(o));
			}
		}

		hash = MurmurHash.finish(hash, this.size());
		return hash;
	}

	public equals = (o: java.lang.Object| null):  boolean => {
		if (o === this) {
 return true;
}

		if ( !(o instanceof Array2DHashSet) ) {
 return false;
}

		let  other: Array2DHashSet<unknown> = o as Array2DHashSet<unknown>;
		if ( other.size() !== this.size() ) {
 return false;
}

		let  same: boolean = this.containsAll(other);
		return same;
	}

	protected expand = ():  void => {
		let  old: T[][] = this.buckets;
		this.currentPrime += 4;
		let  newCapacity: number = this.buckets.length * 2;
		let  newTable: T[][] = this.createBuckets(newCapacity);
		let  newBucketLengths: Int32Array = new   Array<number>(newTable.length);
		this.buckets = newTable;
		this.threshold = Number((newCapacity * Array2DHashSet.LOAD_FACTOR));
//		System.out.println("new size="+newCapacity+", thres="+threshold);
		// rehash all existing entries
		let  oldSize: number = this.size();
		for (let bucket of old) {
			if ( bucket===null ) {
				continue;
			}

			for (let o of bucket) {
				if ( o===null ) {
					break;
				}

				let  b: number = this.getBucket(o);
				let  bucketLength: number = newBucketLengths[b];
				let  newBucket: T[];
				if (bucketLength === 0) {
					// new bucket
					newBucket = this.createBucket(this.initialBucketCapacity);
					newTable[b] = newBucket;
				}
				else {
					newBucket = newTable[b];
					if (bucketLength === newBucket.length) {
						// expand
						newBucket = java.util.Arrays.copyOf(newBucket, newBucket.length * 2);
						newTable[b] = newBucket;
					}
				}

				newBucket[bucketLength] = o;
				newBucketLengths[b]++;
			}
		}

		/* assert n == oldSize; */ 
	}

	public readonly  add = (t: T| null):  boolean => {
		let  existing: T = this.getOrAdd(t);
		return existing===t;
	}

	public readonly  size = ():  number => {
		return this.n;
	}

	public readonly  isEmpty = ():  boolean => {
		return this.n===0;
	}

	public readonly  contains = (o: java.lang.Object| null):  boolean => {
		return this.containsFast(this.asElementType(o));
	}

	public containsFast = (obj: T| null):  boolean => {
		if (obj === null) {
			return false;
		}

		return this.get(obj) !== null;
	}

	public iterator = ():  java.util.Iterator<T> | null => {
		return new  SetIterator(this.toArray());
	}

	public toArray():  T[] | null;

	public toArray <U>(a: U[]| null):  U[] | null;


	public toArray(a?: U[] | null):  T[] | null |  U[] | null {
if (a === undefined) {
		let  a: T[] = this.createBucket(this.size());
		let  i: number = 0;
		for (let bucket of this.buckets) {
			if ( bucket===null ) {
				continue;
			}

			for (let o of bucket) {
				if ( o===null ) {
					break;
				}

				a[i++] = o;
			}
		}

		return a;
	}
 else  {
		if (a.length < this.size()) {
			a = java.util.Arrays.copyOf(a, this.size());
		}

		let  i: number = 0;
		for (let bucket of this.buckets) {
			if ( bucket===null ) {
				continue;
			}

			for (let o of bucket) {
				if ( o===null ) {
					break;
				}

				/* @SuppressWarnings("unchecked") */  // array store will check this
				let  targetElement: U = o as U;
				a[i++] = targetElement;
			}
		}
		return a;
	}

}


	public readonly  remove = (o: java.lang.Object| null):  boolean => {
		return this.removeFast(this.asElementType(o));
	}

	public removeFast = (obj: T| null):  boolean => {
		if (obj === null) {
			return false;
		}

		let  b: number = this.getBucket(obj);
		let  bucket: T[] = this.buckets[b];
		if ( bucket===null ) {
			// no bucket
			return false;
		}

		for (let  i: number=0; i<bucket.length; i++) {
			let  e: T = bucket[i];
			if ( e===null ) {
				// empty slot; not there
				return false;
			}

			if ( this.comparator.equals(e, obj) ) {          // found it
				// shift all elements to the right down one
				java.lang.System.arraycopy(bucket, i+1, bucket, i, bucket.length-i-1);
				bucket[bucket.length - 1] = null;
				this.n--;
				return true;
			}
		}

		return false;
	}

	public containsAll = (collection: java.util.Collection<unknown>| null):  boolean => {
		if ( collection instanceof Array2DHashSet ) {
			let  s: Array2DHashSet<unknown> = collection as Array2DHashSet<unknown>;
			for (let bucket of s.buckets) {
				if ( bucket===null ) {
 continue;
}

				for (let o of bucket) {
					if ( o===null ) {
 break;
}

					if ( !this.containsFast(this.asElementType(o)) ) {
 return false;
}

				}
			}
		}
		else {
			for (let o of collection) {
				if ( !this.containsFast(this.asElementType(o)) ) {
 return false;
}

			}
		}
		return true;
	}

	public addAll = (c: java.util.Collection< T>| null):  boolean => {
		let  changed: boolean = false;
		for (let o of c) {
			let  existing: T = this.getOrAdd(o);
			if ( existing!==o ) {
 changed=true;
}

		}
		return changed;
	}

	public retainAll = (c: java.util.Collection<unknown>| null):  boolean => {
		let  newsize: number = 0;
		for (let bucket of this.buckets) {
			if (bucket === null) {
				continue;
			}

			let  i: number;
			let  j: number;
			for (i = 0, j = 0; i < bucket.length; i++) {
				if (bucket[i] === null) {
					break;
				}

				if (!c.contains(bucket[i])) {
					// removed
					continue;
				}

				// keep
				if (i !== j) {
					bucket[j] = bucket[i];
				}

				j++;
				newsize++;
			}

			newsize += j;

			while (j < i) {
				bucket[j] = null;
				j++;
			}
		}

		let  changed: boolean = newsize !== this.n;
		this.n = newsize;
		return changed;
	}

	public removeAll = (c: java.util.Collection<unknown>| null):  boolean => {
		let  changed: boolean = false;
		for (let o of c) {
			changed |= this.removeFast(this.asElementType(o));
		}

		return changed;
	}

	public clear = ():  void => {
		this.n = 0;
		this.buckets = this.createBuckets(this.initialCapacity);
		this.threshold = Number(Math.floor(this.initialCapacity * Array2DHashSet.LOAD_FACTOR));
	}

	public toString = ():  java.lang.String | null => {
		if ( this.size()===0 ) {
 return S`{}`;
}


		let  buf: java.lang.StringBuilder = new  java.lang.StringBuilder();
		buf.append('{');
		let  first: boolean = true;
		for (let bucket of this.buckets) {
			if ( bucket===null ) {
 continue;
}

			for (let o of bucket) {
				if ( o===null ) {
 break;
}

				if ( first ) {
 first=false;
}

				else {
 buf.append(S`, `);
}

				buf.append(o.toString());
			}
		}
		buf.append('}');
		return buf.toString();
	}

	public toTableString = ():  java.lang.String | null => {
		let  buf: java.lang.StringBuilder = new  java.lang.StringBuilder();
		for (let bucket of this.buckets) {
			if ( bucket===null ) {
				buf.append(S`null\n`);
				continue;
			}
			buf.append('[');
			let  first: boolean = true;
			for (let o of bucket) {
				if ( first ) {
 first=false;
}

				else {
 buf.append(S` `);
}

				if ( o===null ) {
 buf.append(S`_`);
}

				else {
 buf.append(o.toString());
}

			}
			buf.append(S`]\n`);
		}
		return buf.toString();
	}

	/**
	 * Return {@code o} as an instance of the element type {@code T}. If
	 * {@code o} is non-null but known to not be an instance of {@code T}, this
	 * method returns {@code null}. The base implementation does not perform any
	 * type checks; override this method to provide strong type checks for the
	 * {@link #contains} and {@link #remove} methods to ensure the arguments to
	 * the {@link EqualityComparator} for the set always have the expected
	 * types.
	 *
	 * @param o the object to try and cast to the element type of the set
	  @returns {@code o} if it could be an instance of {@code T}, otherwise
	 * {@code null}.
	 */
	protected asElementType = (o: java.lang.Object| null):  T | null => {
		return o as T;
	}

	/**
	 * Return an array of {@code T[]} with length {@code capacity}.
	 *
	 * @param capacity the length of the array to return
	  @returns the newly constructed array
	 */
	protected createBuckets = (capacity: number):  T[][] | null => {
		return new   Array<java.lang.Object>(capacity) as T[][][];
	}

	/**
	 * Return an array of {@code T} with length {@code capacity}.
	 *
	 * @param capacity the length of the array to return
	  @returns the newly constructed array
	 */
	protected createBucket = (capacity: number):  T[] | null => {
		return new   Array<java.lang.Object>(capacity) as T[];
	}

	protected SetIterator = (($outer) => {
return  class SetIterator extends JavaObject implements java.util.Iterator<T> {
		protected readonly  data:  T[] | null;
		protected  nextIndex: number = 0;
		protected  removed: boolean = true;

		public constructor(data: T[]| null) {
			super();
this.data = data;
		}

		public hasNext = ():  boolean => {
			return $outer.nextIndex < $outer.data.length;
		}

		public next = ():  T | null => {
			if (!$outer.hasNext()) {
				throw new  java.lang.NoSuchElementException();
			}

			$outer.removed = false;
			return $outer.data[$outer.nextIndex++];
		}

		public remove = ():  void => {
			if ($outer.removed) {
				throw new  java.lang.IllegalStateException();
			}

			Array2DHashSet.this.remove($outer.data[$outer.nextIndex - 1]);
			$outer.removed = true;
		}
	}
})(this);

}

// eslint-disable-next-line @typescript-eslint/no-namespace, no-redeclare
export namespace Array2DHashSet {
	// @ts-expect-error, because of protected inner class.
	export type SetIterator = InstanceType<Array2DHashSet.SetIterator>;
}


