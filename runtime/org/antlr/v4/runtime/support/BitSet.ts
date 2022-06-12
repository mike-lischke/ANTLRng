/** java2ts: keep */

/*
 [The "BSD license"]
 Copyright (c) 2005-2009 Terence Parr
 All rights reserved.

 Redistribution and use in source and binary forms, with or without
 modification, are permitted provided that the following conditions
 are met:
 1. Redistributions of source code must retain the above copyright
     notice, this list of conditions and the following disclaimer.
 2. Redistributions in binary form must reproduce the above copyright
     notice, this list of conditions and the following disclaimer in the
     documentation and/or other materials provided with the distribution.
 3. The name of the author may not be used to endorse or promote products
     derived from this software without specific prior written permission.

 THIS SOFTWARE IS PROVIDED BY THE AUTHOR ``AS IS'' AND ANY EXPRESS OR
 IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
 OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
 IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY DIRECT, INDIRECT,
 INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT
 NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

import { java } from "../../../../../../../lib/java/java";

/*
 eslint-disable @typescript-eslint/no-namespace, @typescript-eslint/naming-convention, no-redeclare,
 max-classes-per-file, jsdoc/check-tag-names, @typescript-eslint/no-empty-function,
 @typescript-eslint/restrict-plus-operands, @typescript-eslint/unified-signatures, @typescript-eslint/member-ordering,
 no-underscore-dangle, max-len
*/

/* cspell: disable */

/**A stripped-down version of org.antlr.misc.BitSet that is just
 * good enough to handle runtime requirements such as FOLLOW sets
 * for automatic error recovery.
 */
export class BitSet extends java.lang.Cloneable {
    protected static readonly BITS = 64;    // number of bits / long
    protected static readonly LOG_BITS = 6; // 2^6 == 64

    /* We will often need to do a mod operator (i mod nbits).  Its
     * turns out that, for powers of two, this mod operation is
     * same as (i & (nbits-1)).  Since mod is slow, we use a
     * precomputed mod mask to do the mod instead.
     */
    protected static readonly MOD_MASK = BitSet.BITS - 1;

    /** The actual data bits */
    protected bits: bigint[];

    public constructor(); /** Construct a bitset of size one word (64 bits) */
    public constructor(bits_: bigint[]); /** Construction from a static array of longs */
    public constructor(items: number[]); /** Construction from a list of integers */
    /**
     * Construct a bitset given the size
     *
     * @param nbits The size of the bitset in bits
     */
    public constructor(nbits: number);
    public constructor(bits_OrItemsOrNbits?: bigint[] | number[] | number) {
        super();

        if (Array.isArray(bits_OrItemsOrNbits)) {
            if (bits_OrItemsOrNbits.length === 0) {
                this.bits = [];
            } else if (typeof bits_OrItemsOrNbits[0] === "bigint") {
                this.bits = bits_OrItemsOrNbits as bigint[];
            } else {
                this.bits = new Array<bigint>(BitSet.BITS);
                const items = bits_OrItemsOrNbits as number[];
                items.forEach((item) => {
                    this.add(item);
                });
            }
        } else {
            const nbits = bits_OrItemsOrNbits ?? BitSet.BITS;
            this.bits = new Array<bigint>(((nbits - 1) >> BitSet.LOG_BITS) + 1);
        }

    }

    public static of(a: number, b?: number, c?: number, d?: number): BitSet {
        let s: BitSet;
        if (b === undefined) {
            s = new BitSet(a + 1);
        } else if (c === undefined) {
            s = new BitSet(Math.max(a, b) + 1);
        } else {
            s = new BitSet();
        }

        s.add(a);

        if (b) {
            s.add(b);
        }

        if (c) {
            s.add(c);
        }
        if (d) {
            s.add(d);
        }

        return s;
    }

    /**
     * return this | a in a new set
     *
     * @param a tbd
     *
     * @returns tbd
     */
    public or(a?: BitSet): BitSet {
        if (a === undefined) {
            return this;
        }

        const s: BitSet = this.clone() as BitSet;
        s.orInPlace(a);

        return s;
    }

    /**
     * or this element into this set (grow as necessary to accommodate)
     *
     * @param el tbd
     */
    public add(el: number): void {
        const n: number = BitSet.wordNumber(el);
        if (n >= this.bits.length) {
            this.growToInclude(el);
        }
        this.bits[n] |= BitSet.bitMask(el);
    }

    /**
     * Grows the set to a larger number of bits.
     *
     * @param bit element that must fit in set
     */
    public growToInclude(bit: number): void {
        const newSize = Math.max(this.bits.length << 1, this.numWordsToHold(bit));
        const newbits = new Array<bigint>(newSize);
        java.lang.System.arraycopy(this.bits, 0, newbits, 0, this.bits.length);
        this.bits = newbits;
    }

    public orInPlace(a?: BitSet): void {
        if (a === undefined) {
            return;
        }
        // If this is smaller than a, grow this first
        if (a.bits.length > this.bits.length) {
            this.setSize(a.bits.length);
        }
        const min: number = Math.min(this.bits.length, a.bits.length);
        for (let i: number = min - 1; i >= 0; i--) {
            this.bits[i] |= a.bits[i];
        }
    }

    /**
     * Sets the size of a set.
     *
     * @param nwords how many words the new set should be
     */
    private setSize(nwords: number): void {
        const newbits = new Array<bigint>(nwords);
        const n = Math.min(nwords, this.bits.length);
        java.lang.System.arraycopy(this.bits, 0, newbits, 0, n);
        this.bits = newbits;
    }

    private static bitMask(bitNumber: number): bigint {
        const bitPosition = bitNumber & BitSet.MOD_MASK; // bitNumber mod BITS

        return 1n << BigInt(bitPosition);
    }

    public clone(): object {
        const s = super.clone() as BitSet;
        s.bits = new Array<bigint>(this.bits.length);
        java.lang.System.arraycopy(this.bits, 0, s.bits, 0, this.bits.length);

        return s;
    }

    public size(): number {
        let deg = 0;
        for (let i = this.bits.length - 1; i >= 0; i--) {
            const word = this.bits[i];
            if (word !== 0n) {
                for (let bit = BitSet.BITS - 1; bit >= 0; bit--) {
                    if ((word & (1n << BigInt(bit))) !== 0n) {
                        deg++;
                    }
                }
            }
        }

        return deg;
    }

    public equals(other?: unknown): boolean {
        if (other === undefined || !(other instanceof BitSet)) {
            return false;
        }

        const n = Math.min(this.bits.length, other.bits.length);

        // for any bits in common, compare
        for (let i = 0; i < n; i++) {
            if (this.bits[i] !== other.bits[i]) {
                return false;
            }
        }

        // make sure any extra bits are off
        if (this.bits.length > n) {
            for (let i: number = n + 1; i < this.bits.length; i++) {
                if (this.bits[i] !== 0n) {
                    return false;
                }
            }
        } else {
            if (other.bits.length > n) {
                for (let i: number = n + 1; i < other.bits.length; i++) {
                    if (other.bits[i] !== 0n) {
                        return false;
                    }
                }
            }
        }

        return true;
    }

    public member(el: number): boolean {
        if (el < 0) {
            return false;
        }
        const n = BitSet.wordNumber(el);
        if (n >= this.bits.length) {
            return false;
        }

        return (this.bits[n] & BitSet.bitMask(el)) !== 0n;
    }

    // remove this element from this set
    public remove(el: number): void {
        const n: number = BitSet.wordNumber(el);
        if (n < this.bits.length) {
            this.bits[n] &= ~BitSet.bitMask(el);
        }
    }

    public isNil(): boolean {
        for (let i: number = this.bits.length - 1; i >= 0; i--) {
            if (this.bits[i] !== 0n) {
                return false;
            }
        }

        return true;
    }

    private numWordsToHold(el: number): number {
        return (el >> BitSet.LOG_BITS) + 1;
    }

    public numBits(): number {
        return this.bits.length << BitSet.LOG_BITS; // num words * bits per word
    }

    /**
     * return how much space is being used by the bits array not
     *  how many actually have member bits on.
     *
     * @returns tbd
     */
    public lengthInLongWords(): number {
        return this.bits.length;
    }

    /**Is this contained within a? */
    /*
    public boolean subset(BitSet a) {
        if (a == null || !(a instanceof BitSet)) return false;
        return this.and(a).equals(this);
    }
    */

    public toArray(): number[] {
        const elems: number[] = new Array<number>(this.size());
        let en = 0;
        for (let i = 0; i < (this.bits.length << BitSet.LOG_BITS); i++) {
            if (this.member(i)) {
                elems[en++] = i;
            }
        }

        return elems;
    }

    public toPackedArray(): bigint[] {
        return this.bits;
    }

    /**
     * Determines the number of the bucket in which a given bit is located.
     *
     * @param bit The number of the bit to get its bucket for.
     *
     * @returns The bucket number.
     */
    private static wordNumber(bit: number): number {
        return bit >> BitSet.LOG_BITS; // bit / BITS
    }

    public toString(): string;
    public toString(tokenNames: string[]): string;
    public toString(tokenNames?: string[]): string {
        if (tokenNames === undefined) {
            return this.toString(undefined);
        } else {
            const buf: java.lang.StringBuilder = new java.lang.StringBuilder();
            const separator = ",";
            let havePrintedAnElement = false;
            buf.append("{");

            for (let i = 0; i < (this.bits.length << BitSet.LOG_BITS); i++) {
                if (this.member(i)) {
                    if (i > 0 && havePrintedAnElement) {
                        buf.append(separator);
                    }
                    if (tokenNames !== undefined) {
                        buf.append(tokenNames[i]);
                    } else {
                        buf.append(i);
                    }
                    havePrintedAnElement = true;
                }
            }
            buf.append("}");

            return buf.toString();
        }

    }

}
