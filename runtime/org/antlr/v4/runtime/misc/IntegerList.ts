/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */



import { java } from "../../../../../../lib/java/java";


import { JavaObject } from "../../../../../../lib/java/lang/Object";


/**
 *
 * @author Sam Harwell
 */
export  class IntegerList extends JavaObject {

	private readonly  static EMPTY_DATA:  Int32Array = new   Array<number>(0);

	private static readonly  INITIAL_SIZE:  number = 4;
	private static readonly  MAX_ARRAY_SIZE:  number = java.lang.Integer.MAX_VALUE - 8;


	private _data:  Int32Array;

	private _size:  number;

	/* eslint-disable constructor-super, @typescript-eslint/no-unsafe-call */
public constructor();

	public constructor(capacity: number);

	public constructor(list: IntegerList| null);

	public constructor(list: java.util.Collection<java.lang.Integer>| null);
/* @ts-expect-error, because of the super() call in the closure. */
public constructor(capacityOrList?: number | IntegerList | java.util.Collection<java.lang.Integer> | null) {
const $this = (capacityOrList?: number | IntegerList | java.util.Collection<java.lang.Integer> | null): void => {
if (capacityOrList === undefined) {

/* @ts-expect-error, because of the super() call in the closure. */
		super();
this._data = IntegerList.EMPTY_DATA;
	}
 else if (typeof capacityOrList === "number") {
const capacity = capacityOrList as number;
/* @ts-expect-error, because of the super() call in the closure. */
		super();
if (capacity < 0) {
			throw new  java.lang.IllegalArgumentException();
		}

		if (capacity === 0) {
			this._data = IntegerList.EMPTY_DATA;
		}
		else {
			this._data = new   Array<number>(capacity);
		}
	}
 else if (capacityOrList instanceof IntegerList) {
const list = capacityOrList as IntegerList;
/* @ts-expect-error, because of the super() call in the closure. */
		super();
this._data = list._data.clone();
		this._size = list._size;
	}
 else  {
let list = capacityOrList as java.util.Collection<java.lang.Integer>;
		$this(list.size());
		for (let value of list) {
			this.add(value);
		}
	}
};

$this(capacityOrList);

}
/* eslint-enable constructor-super, @typescript-eslint/no-unsafe-call */

	public readonly  add = (value: number):  void => {
		if (this._data.length === this._size) {
			this.ensureCapacity(this._size + 1);
		}

		this._data[this._size] = value;
		this._size++;
	}

	public readonly  addAll(array: Int32Array):  void;

	public readonly  addAll(list: IntegerList| null):  void;

	public readonly  addAll(list: java.util.Collection<java.lang.Integer>| null):  void;


	public readonly  addAll(arrayOrList: Int32Array | IntegerList | java.util.Collection<java.lang.Integer> | null):  void {
if (arrayOrList instanceof Int32Array) {
const array = arrayOrList as Int32Array;
		this.ensureCapacity(this._size + array.length);
		java.lang.System.arraycopy(array, 0, this._data, this._size, array.length);
		this._size += array.length;
	}
 else if (arrayOrList instanceof IntegerList) {
const list = arrayOrList as IntegerList;
		this.ensureCapacity(this._size + list._size);
		java.lang.System.arraycopy(list._data, 0, this._data, this._size, list._size);
		this._size += list._size;
	}
 else  {
let list = arrayOrList as java.util.Collection<java.lang.Integer>;
		this.ensureCapacity(this._size + list.size());
		let  current: number = 0;
    		for (let x of list) {
      			this._data[this._size + current] = x;
      			current++;
    		}
    		this._size += list.size();
	}

}


	public readonly  get = (index: number):  number => {
		if (index < 0 || index >= this._size) {
			throw new  java.lang.IndexOutOfBoundsException();
		}

		return this._data[index];
	}

	public readonly  contains = (value: number):  boolean => {
		for (let  i: number = 0; i < this._size; i++) {
			if (this._data[i] === value) {
				return true;
			}
		}

		return false;
	}

	public readonly  set = (index: number, value: number):  number => {
		if (index < 0 || index >= this._size) {
			throw new  java.lang.IndexOutOfBoundsException();
		}

		let  previous: number = this._data[index];
		this._data[index] = value;
		return previous;
	}

	public readonly  removeAt = (index: number):  number => {
		let  value: number = this.get(index);
		java.lang.System.arraycopy(this._data, index + 1, this._data, index, this._size - index - 1);
		this._data[this._size - 1] = 0;
		this._size--;
		return value;
	}

	public readonly  removeRange = (fromIndex: number, toIndex: number):  void => {
		if (fromIndex < 0 || toIndex < 0 || fromIndex > this._size || toIndex > this._size) {
			throw new  java.lang.IndexOutOfBoundsException();
		}
		if (fromIndex > toIndex) {
			throw new  java.lang.IllegalArgumentException();
		}

		java.lang.System.arraycopy(this._data, toIndex, this._data, fromIndex, this._size - toIndex);
		java.util.Arrays.fill(this._data, this._size - (toIndex - fromIndex), this._size, 0);
		this._size -= (toIndex - fromIndex);
	}

	public readonly  isEmpty = ():  boolean => {
		return this._size === 0;
	}

	public readonly  size = ():  number => {
		return this._size;
	}

	public readonly  trimToSize = ():  void => {
		if (this._data.length === this._size) {
			return;
		}

		this._data = java.util.Arrays.copyOf(this._data, this._size);
	}

	public readonly  clear = ():  void => {
		java.util.Arrays.fill(this._data, 0, this._size, 0);
		this._size = 0;
	}

	public readonly  toArray = ():  Int32Array => {
		if (this._size === 0) {
			return IntegerList.EMPTY_DATA;
		}

		return java.util.Arrays.copyOf(this._data, this._size);
	}

	public readonly  sort = ():  void => {
		java.util.Arrays.sort(this._data, 0, this._size);
	}

	/**
	 * Compares the specified object with this list for equality.  Returns
	 * {@code true} if and only if the specified object is also an {@link IntegerList},
	 * both lists have the same size, and all corresponding pairs of elements in
	 * the two lists are equal.  In other words, two lists are defined to be
	 * equal if they contain the same elements in the same order.
	 * <p>
	 * This implementation first checks if the specified object is this
	 * list. If so, it returns {@code true}; if not, it checks if the
	 * specified object is an {@link IntegerList}. If not, it returns {@code false};
	 * if so, it checks the size of both lists. If the lists are not the same size,
	 * it returns {@code false}; otherwise it iterates over both lists, comparing
	 * corresponding pairs of elements.  If any comparison returns {@code false},
	 * this method returns {@code false}.
	 *
	 * @param o the object to be compared for equality with this list
	  @returns {@code true} if the specified object is equal to this list
	 */
	public equals = (o: java.lang.Object| null):  boolean => {
		if (o === this) {
			return true;
		}

		if (!(o instanceof IntegerList)) {
			return false;
		}

		let  other: IntegerList = o as IntegerList;
		if (this._size !== other._size) {
			return false;
		}

		for (let  i: number = 0; i < this._size; i++) {
			if (this._data[i] !== other._data[i]) {
				return false;
			}
		}

		return true;
	}

	/**
	 * Returns the hash code value for this list.
	 *
	 * <p>This implementation uses exactly the code that is used to define the
	 * list hash function in the documentation for the {@link List#hashCode}
	 * method.</p>
	 *
	  @returns the hash code value for this list
	 */
	public hashCode = ():  number => {
		let  hashCode: number = 1;
		for (let  i: number = 0; i < this._size; i++) {
			hashCode = 31*hashCode + this._data[i];
		}

		return hashCode;
	}

	/**
	 * Returns a string representation of this list.
	 */
	public toString = ():  java.lang.String | null => {
		return java.util.Arrays.toString(this.toArray());
	}

	public readonly  binarySearch(key: number):  number;

	public readonly  binarySearch(fromIndex: number, toIndex: number, key: number):  number;


	public readonly  binarySearch(keyOrFromIndex: number, toIndex?: number, key?: number):  number {
if (toIndex === undefined) {
		return java.util.Arrays.binarySearch(this._data, 0, this._size, key);
	}
 else  {
let fromIndex = keyOrFromIndex as number;
		if (fromIndex < 0 || toIndex < 0 || fromIndex > this._size || toIndex > this._size) {
			throw new  java.lang.IndexOutOfBoundsException();
		}
		if (fromIndex > toIndex) {
        		throw new  java.lang.IllegalArgumentException();
		}

		return java.util.Arrays.binarySearch(this._data, fromIndex, toIndex, key);
	}

}


	private ensureCapacity = (capacity: number):  void => {
		if (capacity < 0 || capacity > IntegerList.MAX_ARRAY_SIZE) {
			throw new  java.lang.OutOfMemoryError();
		}

		let  newLength: number;
		if (this._data.length === 0) {
			newLength = IntegerList.INITIAL_SIZE;
		}
		else {
			newLength = this._data.length;
		}

		while (newLength < capacity) {
			newLength = newLength * 2;
			if (newLength < 0 || newLength > IntegerList.MAX_ARRAY_SIZE) {
				newLength = IntegerList.MAX_ARRAY_SIZE;
			}
		}

		this._data = java.util.Arrays.copyOf(this._data, newLength);
	}

	/** Convert the int list to a char array where values > 0x7FFFF take 2 bytes. TODO?????
	 *  If all values are less
	 *  than the 0x7FFF 16-bit code point limit (1 bit taken to indicatethen this is just a char array
	 *  of 16-bit char as usual. For values in the supplementary range, encode
	 * them as two UTF-16 code units.
	 */
	public readonly  toCharArray = ():  Uint16Array => {
		// Optimize for the common case (all data values are
		// < 0xFFFF) to avoid an extra scan
		let  resultArray: Uint16Array = new   Array<number>(this._size);
		let  resultIdx: number = 0;
		let  calculatedPreciseResultSize: boolean = false;
		for (let  i: number = 0; i < this._size; i++) {
			let  codePoint: number = this._data[i];
			// Calculate the precise result size if we encounter
			// a code point > 0xFFFF
			if (!calculatedPreciseResultSize &&
			    java.lang.Character.isSupplementaryCodePoint(codePoint)) {
				resultArray = java.util.Arrays.copyOf(resultArray, this.charArraySize());
				calculatedPreciseResultSize = true;
			}
			// This will throw IllegalArgumentException if
			// the code point is not a valid Unicode code point
			let  charsWritten: number = java.lang.Character.toChars(codePoint, resultArray, resultIdx);
			resultIdx += charsWritten;
		}
		return resultArray;
	}

	private charArraySize = ():  number => {
		let  result: number = 0;
		for (let  i: number = 0; i < this._size; i++) {
			result += java.lang.Character.charCount(this._data[i]);
		}
		return result;
	}
}
