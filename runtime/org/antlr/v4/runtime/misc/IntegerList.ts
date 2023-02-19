/* java2ts: keep */

/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/* eslint-disable @typescript-eslint/naming-convention, no-underscore-dangle */

import { codePointsToString, java, JavaObject } from "jree";

/**
 * @author Sam Harwell
 */
export class IntegerList extends JavaObject {

    private static readonly EMPTY_DATA = new Int32Array();

    private static readonly INITIAL_SIZE: number = 4;
    private static readonly MAX_ARRAY_SIZE: number = java.lang.Integer.MAX_VALUE - 8;

    private _data: Int32Array;

    private _size: number;

    public constructor(capacityOrList?: number | IntegerList | java.util.Collection<java.lang.Integer>) {
        let data: Int32Array;
        let size = 0;
        if (capacityOrList === undefined) {
            data = IntegerList.EMPTY_DATA;
        } else if (typeof capacityOrList === "number") {
            if (capacityOrList < 0) {
                throw new java.lang.IllegalArgumentException();
            }

            if (capacityOrList === 0) {
                data = IntegerList.EMPTY_DATA;
            } else {
                data = new Int32Array(capacityOrList);
                size = capacityOrList;
            }
        } else if (capacityOrList instanceof IntegerList) {
            data = capacityOrList._data.slice();
            size = capacityOrList._size;
        } else {
            data = new Int32Array(capacityOrList.size());
            let i = 0;
            for (const value of capacityOrList) {
                data[i++] = value.intValue();
            }
        }

        super();
        this._data = data;
        this._size = size;

    }

    public readonly add = (value: number): void => {
        if (this._data.length === this._size) {
            this.ensureCapacity(this._size + 1);
        }

        this._data[this._size] = value;
        this._size++;
    };

    public addAll(arrayOrList: Int32Array | IntegerList | java.util.Collection<java.lang.Integer>): void {
        if (arrayOrList instanceof Int32Array) {
            this.ensureCapacity(this._size + arrayOrList.length);
            this._data.set(arrayOrList, 0);
            this._size += arrayOrList.length;
        } else if (arrayOrList instanceof IntegerList) {
            this.ensureCapacity(this._size + arrayOrList._size);
            this._data.set(arrayOrList._data, 0);
            this._size += arrayOrList._size;
        } else {
            this.ensureCapacity(this._size + arrayOrList.size());
            let current = 0;
            for (const x of arrayOrList) {
                this._data[this._size + current] = x.intValue();
                current++;
            }
            this._size += arrayOrList.size();
        }
    }

    public readonly get = (index: number): number => {
        if (index < 0 || index >= this._size) {
            throw new java.lang.IndexOutOfBoundsException();
        }

        return this._data[index];
    };

    public readonly contains = (value: number): boolean => {
        for (let i = 0; i < this._size; i++) {
            if (this._data[i] === value) {
                return true;
            }
        }

        return false;
    };

    public readonly set = (index: number, value: number): number => {
        if (index < 0 || index >= this._size) {
            throw new java.lang.IndexOutOfBoundsException();
        }

        const previous: number = this._data[index];
        this._data[index] = value;

        return previous;
    };

    public readonly removeAt = (index: number): number => {
        const value = this.get(index);
        this._data.copyWithin(index, index + 1);
        this._data[this._size - 1] = 0;
        this._size--;

        return value;
    };

    public readonly removeRange = (fromIndex: number, toIndex: number): void => {
        if (fromIndex < 0 || toIndex < 0 || fromIndex > this._size || toIndex > this._size) {
            throw new java.lang.IndexOutOfBoundsException();
        }

        if (fromIndex > toIndex) {
            throw new java.lang.IllegalArgumentException();
        }

        this._data.copyWithin(fromIndex, toIndex);

        const count = toIndex - fromIndex;
        this._data.fill(0, this._size - count);
        this._size -= count;
    };

    public readonly isEmpty = (): boolean => {
        return this._size === 0;
    };

    public readonly size = (): number => {
        return this._size;
    };

    public readonly trimToSize = (): void => {
        if (this._data.length === this._size) {
            return;
        }

        this._data = this._data.slice(0, this._size);
    };

    public readonly clear = (): void => {
        this._data.fill(0);
        this._size = 0;
    };

    public readonly toArray = (): Int32Array => {
        if (this._size === 0) {
            return IntegerList.EMPTY_DATA;
        }

        return java.util.Arrays.copyOf(this._data, this._size);
    };

    public readonly sort = (): void => {
        this._data.sort();
    };

    /**
     * Compares the specified object with this list for equality.  Returns
     * `true` if and only if the specified object is also an {@link IntegerList},
     * both lists have the same size, and all corresponding pairs of elements in
     * the two lists are equal.  In other words, two lists are defined to be
     * equal if they contain the same elements in the same order.
     * <p>
     * This implementation first checks if the specified object is this
     * list. If so, it returns `true`; if not, it checks if the
     * specified object is an {@link IntegerList}. If not, it returns {@code false};
     * if so, it checks the size of both lists. If the lists are not the same size,
     * it returns {@code false}; otherwise it iterates over both lists, comparing
     * corresponding pairs of elements.  If any comparison returns {@code false},
     * this method returns {@code false}.
     *
     * @param o the object to be compared for equality with this list
     * @returns `true` if the specified object is equal to this list
     */
    public equals = (o: java.lang.Object | null): boolean => {
        if (o === this) {
            return true;
        }

        if (!(o instanceof IntegerList)) {
            return false;
        }

        const other: IntegerList = o;
        if (this._size !== other._size) {
            return false;
        }

        for (let i = 0; i < this._size; i++) {
            if (this._data[i] !== other._data[i]) {
                return false;
            }
        }

        return true;
    };

    /**
     * Returns the hash code value for this list.
     *
     * <p>This implementation uses exactly the code that is used to define the
     * list hash function in the documentation for the {@link List#hashCode}
     * method.</p>
     *
     * @returns the hash code value for this list
     */
    public hashCode = (): number => {
        let hashCode = 1;
        for (let i = 0; i < this._size; i++) {
            hashCode = 31 * hashCode + this._data[i];
        }

        return hashCode;
    };

    /**
     * @returns a string representation of this list.
     */
    public toString = (): java.lang.String => {
        return java.util.Arrays.toString(this.toArray());
    };

    public binarySearch(key: number): number;
    public binarySearch(fromIndex: number, toIndex: number, key: number): number;
    public binarySearch(keyOrFromIndex: number, toIndex?: number, key?: number): number {
        if (toIndex === undefined) {
            return java.util.Arrays.binarySearch(this._data, 0, this._size, keyOrFromIndex);
        } else {
            const fromIndex = keyOrFromIndex;
            if (fromIndex < 0 || toIndex < 0 || fromIndex > this._size || toIndex > this._size) {
                throw new java.lang.IndexOutOfBoundsException();
            }

            if (fromIndex > toIndex) {
                throw new java.lang.IllegalArgumentException();
            }

            return java.util.Arrays.binarySearch(this._data, fromIndex, toIndex, key!);
        }

    }

    /**
     * Convert the int list to a char array where values > 0x7FFFF take 2 bytes. TODO?????
     *  If all values are less
     *  than the 0x7FFF 16-bit code point limit (1 bit taken to indicate then this is just a char array
     *  of 16-bit char as usual. For values in the supplementary range, encode
     * them as two UTF-16 code units.
     *
     * @returns tbd
     */
    public readonly toCharArray = (): Uint16Array => {
        const s = codePointsToString(new Uint32Array(this._data));
        const result = new Uint16Array(s.length);
        for (let i = 0; i < s.length; ++i) {
            result[i] = s.charCodeAt(i);
        }

        return result;
    };

    private ensureCapacity = (capacity: number): void => {
        if (capacity < 0 || capacity > IntegerList.MAX_ARRAY_SIZE) {
            throw new java.lang.OutOfMemoryError();
        }

        let newLength: number;
        if (this._data.length === 0) {
            newLength = IntegerList.INITIAL_SIZE;
        } else {
            newLength = this._data.length;
        }

        while (newLength < capacity) {
            newLength = newLength * 2;
            if (newLength < 0 || newLength > IntegerList.MAX_ARRAY_SIZE) {
                newLength = IntegerList.MAX_ARRAY_SIZE;
            }
        }

        this._data = java.util.Arrays.copyOf(this._data, newLength);
    };
}
