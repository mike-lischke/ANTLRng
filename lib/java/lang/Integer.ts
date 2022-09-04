/*
 * This file is released under the MIT license.
 * Copyright (c) 2021, 2022, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { Class } from ".";
import { MurmurHash } from "../../MurmurHash";
import { NotImplementedError } from "../../NotImplementedError";
import { IllegalArgumentException } from "./IllegalArgumentException";

/* eslint-disable @typescript-eslint/naming-convention */

export class Integer {
    public static readonly MAX_VALUE = Number.MAX_SAFE_INTEGER;
    public static readonly MIN_VALUE = Number.MIN_SAFE_INTEGER;
    public static readonly SIZE = 32;

    // Should also be read only, but initializing this field here leads to an exception (Class undefined).
    // Instead we initialize this field in a static initializer, deferred to the next run loop after loading this class.
    public static /*readonly*/ TYPE: Class<Integer>;

    private value: number;

    // Constructs a newly allocated Integer object that represents the specified int or string value.
    public constructor(value: number | string) {
        if (typeof value === "string") {
            this.value = parseInt(value, 10);
        } else if (Number.isInteger(value)) {
            this.value = value;
        } else {
            throw new IllegalArgumentException();
        }
    }

    // Returns the number of one-bits in the two's complement binary representation of the specified int value.
    public static bitCount(i: number): number {
        if (Number.isInteger(i)) {
            i = i - ((i >> 1) & 0x55555555);
            i = (i & 0x33333333) + ((i >> 2) & 0x33333333);

            return ((i + (i >> 4) & 0xF0F0F0F) * 0x1010101) >> 24;
        }

        throw new IllegalArgumentException();
    }

    // Compares two int values numerically.
    public static compare(x: number, y: number): number {
        if (!Number.isInteger(x) || !Number.isInteger(y)) {
            throw new IllegalArgumentException();
        }

        return x - y;
    }

    // Decodes a String into an Integer.
    public static decode(_nm: string): number {
        throw new NotImplementedError();
    }

    // Determines the integer value of the system property with the specified name.
    public static getInteger(_nm: string, _val?: number): Integer {
        throw new NotImplementedError();
    }

    // Returns an int value with at most a single one-bit, in the position of the highest-order ("leftmost") one-bit
    // in the specified int value.
    public static highestOneBit(_i: number): number {
        throw new NotImplementedError();
    }

    // Returns an int value with at most a single one-bit, in the position of the lowest-order ("rightmost") one-bit
    // in the specified int value.
    public static lowestOneBit(_i: number): number {
        throw new NotImplementedError();
    }

    // Returns the number of zero bits preceding the highest-order ("leftmost") one-bit in the two's complement binary
    // representation of the specified int value.
    public static numberOfLeadingZeros(_i: number): number {
        throw new NotImplementedError();
    }

    // Returns the number of zero bits following the lowest-order ("rightmost") one-bit in the two's complement binary
    // representation of the specified int value.
    public static numberOfTrailingZeros(_i: number): number {
        throw new NotImplementedError();
    }

    // Returns the value obtained by reversing the order of the bits in the two's complement binary representation of
    // the specified int value.
    public static reverse(i: number): number {
        i = ((i & 0x55555555) << 1) | ((i & 0xAAAAAAAA) >> 1);
        i = ((i & 0x33333333) << 2) | ((i & 0xCCCCCCCC) >> 2);
        i = ((i & 0x0F0F0F0F) << 4) | ((i & 0xF0F0F0F0) >> 4);
        i = ((i & 0x00FF00FF) << 8) | ((i & 0xFF00FF00) >> 8);
        i = ((i & 0x0000FFFF) << 16) | ((i & 0xFFFF0000) >> 16);

        return i >>> 0;
    }

    // Returns the value obtained by reversing the order of the bytes in the two's complement representation of the
    // specified int value.
    public static reverseBytes(i: number): number {
        if (!Number.isInteger(i)) {
            throw new IllegalArgumentException();
        }

        return ((i & 0xFF) << 24) | ((i & 0xFF00) << 8) | ((i & 0xFF0000) >> 8) | ((i & 0xFF0000) >> 24);
    }

    // Returns the value obtained by rotating the two's complement binary representation of the specified int value
    // left by the specified number of bits.
    public static rotateLeft(i: number, distance: number): number {
        if (!Number.isInteger(i)) {
            throw new IllegalArgumentException();
        }

        return i << distance;
    }

    // Returns the value obtained by rotating the two's complement binary representation of the specified int value
    // right by the specified number of bits.
    public static rotateRight(i: number, distance: number): number {
        if (!Number.isInteger(i)) {
            throw new IllegalArgumentException();
        }

        return i >> distance;
    }

    // Returns the signum function of the specified int value.
    public static signum(i: number): number {
        return i < 0 ? -1 : (i > 0) ? 1 : 0;
    }

    // Returns a string representation of the integer argument as an unsigned integer in base 2.
    public static toBinaryString(i: number): string {
        if (!Number.isInteger(i)) {
            throw new IllegalArgumentException();
        }

        return i.toString(2);
    }

    // Returns a string representation of the integer argument as an unsigned integer in base 16.
    public static toHexString(i: number): string {
        if (!Number.isInteger(i)) {
            throw new IllegalArgumentException();
        }

        return i.toString(16);

    }

    // Returns a string representation of the integer argument as an unsigned integer in base 8.
    public static toOctalString(i: number): string {
        if (!Number.isInteger(i)) {
            throw new IllegalArgumentException();
        }

        return i.toString(8);

    }

    // Returns a string representation of the first argument in the radix specified by the second argument.
    public static toString(i: number, radix?: number): string {
        if (!Number.isInteger(i)) {
            throw new IllegalArgumentException();
        }

        return i.toString(radix);

    }

    // Returns an Integer object holding the value given or extracted from the specified String when parsed with the
    // radix given by the second argument.
    public static valueOf(i: number): Integer;
    public static valueOf(s: string, radix?: number): Integer;
    public static valueOf(value: number | string, radix?: number): Integer {
        if (typeof value === "number") {
            return new Integer(value);
        }

        const i = parseInt(value, radix);

        return new Integer(i);
    }

    public static parseInt(s: string, radix = 10): number {
        return parseInt(s, radix);
    }

    // Returns the value of this Integer as a byte.
    public byteValue(): number {
        return this.value & 0xFF;
    }

    // Compares two Integer objects numerically.
    public compareTo(anotherInteger: Integer): number {
        return this.value - anotherInteger.value;
    }

    // Returns the value of this Integer as a double.
    public doubleValue(): number {
        return this.value;
    }

    // Compares this object to the specified object.
    public equals(obj?: object): boolean {
        if (obj instanceof Integer) {
            return this.value === obj.value;
        }

        return false;
    }

    // Returns the value of this Integer as a float.
    public floatValue(): number {
        return this.value;
    }

    // Returns a hash code for this Integer.
    public hashCode(): number {
        let hash = MurmurHash.initialize(11);
        hash = MurmurHash.update(hash, this.value);
        hash = MurmurHash.finish(hash, 1);

        return hash;
    }

    // Returns the value of this Integer as an int.
    public intValue(): number {
        return this.value & 0xFFFFFFFF;
    }

    // Returns the value of this Integer as a long.
    public longValue(): number {
        return this.value;
    }

    // Returns the value of this Integer as a short.
    public shortValue(): number {
        return this.value & 0xFFFF;
    }

    // Returns a String object representing this Integer's value.
    public toString(): string {
        return this.value.toString();
    }

    public valueOf(): number {
        return this.value;
    }

    static {
        // Defer initializing the TYPE field, to ensure the Class class is loaded before using it.
        setTimeout(() => {
            Integer.TYPE = new Class(Integer);
            Object.freeze(Integer);
        }, 0);
    }

}
