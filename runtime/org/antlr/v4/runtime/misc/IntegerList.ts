/* java2ts: keep */

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

/**
 *
 * @author Sam Harwell
 */
export class IntegerList {

    private static readonly EMPTY_DATA: number[] = [];

    private static readonly INITIAL_SIZE = 4;
    private static readonly MAX_ARRAY_SIZE = java.lang.Integer.MAX_VALUE - 8;

    private _data: number[];
    private _size: number;

    public constructor();
    public constructor(capacity: number);
    public constructor(list: IntegerList);
    public constructor(list: java.util.Collection<java.lang.Integer>);
    public constructor(capacityOrList?: number | IntegerList | java.util.Collection<java.lang.Integer>) {
        const $this = (capacityOrList?: number | IntegerList | java.util.Collection<java.lang.Integer>): void => {
            if (capacityOrList === undefined) {
                this._data = IntegerList.EMPTY_DATA;
            } else if (typeof capacityOrList === "number") {
                const capacity = capacityOrList;
                if (capacity < 0) {
                    throw new java.lang.IllegalArgumentException();
                }

                if (capacity === 0) {
                    this._data = IntegerList.EMPTY_DATA;
                } else {
                    this._data = new Array<number>(capacity);
                }
            } else if (capacityOrList instanceof IntegerList) {
                const list = capacityOrList;
                this._data = [...list._data];
                this._size = list._size;
            } else {
                const list = capacityOrList;
                $this(list.size());
                for (const value of list) {
                    this.add(value.valueOf());
                }
            }
        };

        $this(capacityOrList);

    }

    public readonly add = (value: number): void => {
        if (this._data.length === this._size) {
            this.ensureCapacity(this._size + 1);
        }

        this._data[this._size] = value;
        this._size++;
    };

    public addAll(array: number[]): void;
    public addAll(list: IntegerList): void;
    public addAll(list: java.util.Collection<java.lang.Integer>): void;
    public addAll(arrayOrList: number[] | IntegerList | java.util.Collection<java.lang.Integer>): void {
        if (Array.isArray(arrayOrList)) {
            const array = arrayOrList;
            this.ensureCapacity(this._size + array.length);
            java.lang.System.arraycopy(array, 0, this._data, this._size, array.length);
            this._size += array.length;
        } else if (arrayOrList instanceof IntegerList) {
            const list = arrayOrList;
            this.ensureCapacity(this._size + list._size);
            java.lang.System.arraycopy(list._data, 0, this._data, this._size, list._size);
            this._size += list._size;
        } else {
            const list = arrayOrList;
            this.ensureCapacity(this._size + list.size());
            let current = 0;
            for (const x of list) {
                this._data[this._size + current] = x.valueOf();
                current++;
            }
            this._size += list.size();
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
        const value: number = this.get(index);
        java.lang.System.arraycopy(this._data, index + 1, this._data, index, this._size - index - 1);
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

        java.lang.System.arraycopy(this._data, toIndex, this._data, fromIndex, this._size - toIndex);
        this._data.fill(0, this._size - (toIndex - fromIndex), this._size);
        this._size -= (toIndex - fromIndex);
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

        this._data = java.util.Arrays.copyOf(this._data, this._size);
    };

    public readonly clear = (): void => {
        this._data.fill(0);
        this._size = 0;
    };

    public readonly toArray = (): number[] => {
        if (this._size === 0) {
            return IntegerList.EMPTY_DATA;
        }

        return java.util.Arrays.copyOf(this._data, this._size);
    };

    public readonly sort = (): void => {
        java.util.Arrays.sort(this._data);
    };

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
     *
     * @returns true if the specified object is equal to this list
     */
    public equals = (o: object): boolean => {
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
    public toString = (): string => {
        return this.toArray().toString();
    };

    public binarySearch(key: number): number;
    public binarySearch(fromIndex: number, toIndex: number, key: number): number;
    public binarySearch(keyOrFromIndex: number, toIndex?: number, key?: number): number {
        if (toIndex === undefined) {
            return java.util.Arrays.binarySearch(this._data, key);
        } else {
            const fromIndex = keyOrFromIndex;
            if (fromIndex < 0 || toIndex < 0 || fromIndex > this._size || toIndex > this._size) {
                throw new java.lang.IndexOutOfBoundsException();
            }

            if (fromIndex > toIndex) {
                throw new java.lang.IllegalArgumentException();
            }

            return java.util.Arrays.binarySearch(this._data, fromIndex, toIndex, key);
        }
    }

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

    /**
     * Convert the int list to a char array.
     *
     * @returns The constructed array.
     */
    public readonly toCharArray = (): Uint32Array => {
        return Uint32Array.from(this._data);
    };
}
