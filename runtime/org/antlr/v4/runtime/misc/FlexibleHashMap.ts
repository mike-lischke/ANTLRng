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


/** A limited map (many unsupported operations) that lets me use
 *  varying hashCode/equals.
 */
export  class FlexibleHashMap<K,V> extends JavaObject implements java.util.Map<K, V> {
	public static readonly  INITAL_CAPACITY:  number = 16; // must be power of 2
	public static readonly  INITAL_BUCKET_CAPACITY:  number = 8;
	public static readonly  LOAD_FACTOR:  number = 0.75;

	public static Entry =  class Entry<K, V> extends JavaObject {
		public readonly  key:  K | null;
		public value:  V | null;

		public constructor(key: K| null, value: V| null) { super();
this.key = key; this.value = value; }

		public toString = ():  java.lang.String | null => {
			return this.key.toString()+S`:`+this.value.toString();
		}
	};



	protected readonly  comparator:  AbstractEqualityComparator< K> | null;

	protected buckets:  LinkedList<FlexibleHashMap.Entry<K, V>>[] | null;

	/** How many elements in set */
	protected n:  number = 0;

	protected currentPrime:  number = 1; // jump by 4 primes each expand or whatever

	/** when to expand */
	protected threshold:  number;
	protected readonly  initialCapacity:  number;
	protected readonly  initialBucketCapacity:  number;

	/* eslint-disable constructor-super, @typescript-eslint/no-unsafe-call */
public constructor();

	public constructor(comparator: AbstractEqualityComparator< K>| null);

	public constructor(comparator: AbstractEqualityComparator< K>| null, initialCapacity: number, initialBucketCapacity: number);
/* @ts-expect-error, because of the super() call in the closure. */
public constructor(comparator?: AbstractEqualityComparator< K> | null, initialCapacity?: number, initialBucketCapacity?: number) {
const $this = (comparator?: AbstractEqualityComparator< K> | null, initialCapacity?: number, initialBucketCapacity?: number): void => {
if (comparator === undefined) {
		$this(null, FlexibleHashMap.INITAL_CAPACITY, FlexibleHashMap.INITAL_BUCKET_CAPACITY);
	}
 else if (comparator instanceof AbstractEqualityComparator && initialCapacity === undefined) {
		$this(comparator, FlexibleHashMap.INITAL_CAPACITY, FlexibleHashMap.INITAL_BUCKET_CAPACITY);
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
		this.threshold = Number(Math.floor(initialCapacity * FlexibleHashMap.LOAD_FACTOR));
		this.buckets = FlexibleHashMap.createEntryListArray(initialBucketCapacity);
	}
};

$this(comparator, initialCapacity, initialBucketCapacity);

}
/* eslint-enable constructor-super, @typescript-eslint/no-unsafe-call */

	private static createEntryListArray =  <K, V>(length: number):  LinkedList<FlexibleHashMap.Entry<K, V>>[] | null => {
		/* @SuppressWarnings("unchecked") */ 
		let  result: LinkedList<FlexibleHashMap.Entry<K, V>>[] = new   Array<LinkedList<unknown>>(length) as LinkedList<FlexibleHashMap.Entry<K, V>>[];
		return result;
	}

	protected getBucket = (key: K| null):  number => {
		let  hash: number = this.comparator.hashCode(key);
		let  b: number = hash & (this.buckets.length-1); // assumes len is power of 2
		return b;
	}

	public get = (key: java.lang.Object| null):  V | null => {
		/* @SuppressWarnings("unchecked") */ 
		let  typedKey: K = key as K;
		if ( key===null ) {
 return null;
}

		let  b: number = this.getBucket(typedKey);
		let  bucket: LinkedList<FlexibleHashMap.Entry<K, V>> = this.buckets[b];
		if ( bucket===null ) {
 return null;
}
 // no bucket
		for (let e of bucket) {
			if ( this.comparator.equals(e.key, typedKey) ) {
				return e.value;
			}
		}
		return null;
	}

	public put = (key: K| null, value: V| null):  V | null => {
		if ( key===null ) {
 return null;
}

		if ( this.n > this.threshold ) {
 this.expand();
}

		let  b: number = this.getBucket(key);
		let  bucket: LinkedList<FlexibleHashMap.Entry<K, V>> = this.buckets[b];
		if ( bucket===null ) {
			bucket = this.buckets[b] = new  LinkedList<FlexibleHashMap.Entry<K, V>>();
		}
		for (let e of bucket) {
			if ( this.comparator.equals(e.key, key) ) {
				let  prev: V = e.value;
				e.value = value;
				this.n++;
				return prev;
			}
		}
		// not there
		bucket.add(new  FlexibleHashMap.Entry<K, V>(key, value));
		this.n++;
		return null;
	}

	public remove = (key: java.lang.Object| null):  V | null => {
		throw new  java.lang.UnsupportedOperationException();
	}

	public putAll = (m: java.util.Map< K,  V>| null):  void => {
		throw new  java.lang.UnsupportedOperationException();
	}

	public keySet = ():  java.util.Set<K> | null => {
		throw new  java.lang.UnsupportedOperationException();
	}

	public values = ():  java.util.Collection<V> | null => {
		let  a: java.util.List<V> = new  java.util.ArrayList<V>(this.size());
		for (let bucket of this.buckets) {
			if ( bucket===null ) {
 continue;
}

			for (let e of bucket) {
				a.add(e.value);
			}
		}
		return a;
	}

	public entrySet = ():  java.util.Set<java.util.Map.Entry<K, V>> | null => {
		throw new  java.lang.UnsupportedOperationException();
	}

	public containsKey = (key: java.lang.Object| null):  boolean => {
		return this.get(key)!==null;
	}

	public containsValue = (value: java.lang.Object| null):  boolean => {
		throw new  java.lang.UnsupportedOperationException();
	}

	public hashCode = ():  number => {
		let  hash: number = MurmurHash.initialize();
		for (let bucket of this.buckets) {
			if ( bucket===null ) {
 continue;
}

			for (let e of bucket) {
				if ( e===null ) {
 break;
}

				hash = MurmurHash.update(hash, this.comparator.hashCode(e.key));
			}
		}

		hash = MurmurHash.finish(hash, this.size());
		return hash;
	}

	public equals = (o: java.lang.Object| null):  boolean => {
		throw new  java.lang.UnsupportedOperationException();
	}

	protected expand = ():  void => {
		let  old: LinkedList<FlexibleHashMap.Entry<K, V>>[] = this.buckets;
		this.currentPrime += 4;
		let  newCapacity: number = this.buckets.length * 2;
		let  newTable: LinkedList<FlexibleHashMap.Entry<K, V>>[] = FlexibleHashMap.createEntryListArray(newCapacity);
		this.buckets = newTable;
		this.threshold = Number((newCapacity * FlexibleHashMap.LOAD_FACTOR));
//		System.out.println("new size="+newCapacity+", thres="+threshold);
		// rehash all existing entries
		let  oldSize: number = this.size();
		for (let bucket of old) {
			if ( bucket===null ) {
 continue;
}

			for (let e of bucket) {
				if ( e===null ) {
 break;
}

				this.put(e.key, e.value);
			}
		}
		this.n = oldSize;
	}

	public size = ():  number => {
		return this.n;
	}

	public isEmpty = ():  boolean => {
		return this.n===0;
	}

	public clear = ():  void => {
		this.buckets = FlexibleHashMap.createEntryListArray(this.initialCapacity);
		this.n = 0;
		this.threshold = Number(Math.floor(this.initialCapacity * FlexibleHashMap.LOAD_FACTOR));
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

			for (let e of bucket) {
				if ( e===null ) {
 break;
}

				if ( first ) {
 first=false;
}

				else {
 buf.append(S`, `);
}

				buf.append(e.toString());
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
			for (let e of bucket) {
				if ( first ) {
 first=false;
}

				else {
 buf.append(S` `);
}

				if ( e===null ) {
 buf.append(S`_`);
}

				else {
 buf.append(e.toString());
}

			}
			buf.append(S`]\n`);
		}
		return buf.toString();
	}

	public static main = (args: java.lang.String[]| null):  void => {
		let  map: FlexibleHashMap<java.lang.String,java.lang.Integer> = new  FlexibleHashMap<java.lang.String,java.lang.Integer>();
		map.put(S`hi`, 1);
		map.put(S`mom`, 2);
		map.put(S`foo`, 3);
		map.put(S`ach`, 4);
		map.put(S`cbba`, 5);
		map.put(S`d`, 6);
		map.put(S`edf`, 7);
		map.put(S`mom`, 8);
		map.put(S`hi`, 9);
		java.lang.System.out.println(map);
		java.lang.System.out.println(map.toTableString());
	}
}

// eslint-disable-next-line @typescript-eslint/no-namespace, no-redeclare
export namespace FlexibleHashMap {
	export type Entry<K,V> = InstanceType<typeof FlexibleHashMap.Entry<K,V>>;
}


