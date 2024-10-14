/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */


/* eslint-disable jsdoc/require-returns, jsdoc/require-param */


import { CharStream, IntegerList, Interval } from "antlr4ng";



/**
 *
 * @author Sam Harwell
 */
export class JavaUnicodeInputStream implements CharStream {

    private readonly source: CharStream;
    private readonly escapeIndexes = new IntegerList();
    private readonly escapeCharacters = new IntegerList();
    private readonly escapeIndirectionLevels = new IntegerList();

    private escapeListIndex: number;
    private range: number;
    private slashCount: number;

    private la1: number;

    public constructor(source: CharStream) {
        if (source === null) {
            throw new NullPointerException("source");
        }

        this.source = source;
        this.la1 = source.LA(1);
    }

    private static isHexDigit(c: number): boolean {
        return c >= '0' && c <= '9'
            || c >= 'a' && c <= 'f'
            || c >= 'A' && c <= 'F';
    }

    private static hexValue(c: number): number {
        if (c >= '0' && c <= '9') {
            return c - '0';
        }

        if (c >= 'a' && c <= 'f') {
            return c - 'a' + 10;
        }

        if (c >= 'A' && c <= 'F') {
            return c - 'A' + 10;
        }

        throw new IllegalArgumentException("c");
    }


    public size(): number {
        return this.source.size();
    }


    public index(): number {
        return this.source.index();
    }


    public getSourceName(): string {
        return this.source.getSourceName();
    }


    public getText(interval: Interval): string {
        return this.source.getText(interval);
    }


    public consume(): void {
        if (this.la1 !== '\\') {
            this.source.consume();
            this.la1 = this.source.LA(1);
            this.range = Math.max(this.range, this.source.index());
            this.slashCount = 0;
            return;
        }

        // make sure the next character has been processed
        this.LA(1);

        if (this.escapeListIndex >= this.escapeIndexes.size() || this.escapeIndexes.get(this.escapeListIndex) !== this.index()) {
            this.source.consume();
            this.slashCount++;
        }
        else {
            let indirectionLevel = this.escapeIndirectionLevels.get(this.escapeListIndex);
            for (let i = 0; i < 6 + indirectionLevel; i++) {
                this.source.consume();
            }

            this.escapeListIndex++;
            this.slashCount = 0;
        }

        this.la1 = this.source.LA(1);
        /* assert range >= index(); */
    }


    public LA(i: number): number {
        if (i === 1 && this.la1 !== '\\') {
            return this.la1;
        }

        if (i <= 0) {
            let desiredIndex = this.index() + i;
            for (let j = this.escapeListIndex - 1; j >= 0; j--) {
                if (this.escapeIndexes.get(j) + 6 + this.escapeIndirectionLevels.get(j) > desiredIndex) {
                    desiredIndex -= 5 + this.escapeIndirectionLevels.get(j);
                }

                if (this.escapeIndexes.get(j) === desiredIndex) {
                    return this.escapeCharacters.get(j);
                }
            }

            return this.source.LA(desiredIndex - this.index());
        }
        else {
            let desiredIndex = this.index() + i - 1;
            for (let j = this.escapeListIndex; j < this.escapeIndexes.size(); j++) {
                if (this.escapeIndexes.get(j) === desiredIndex) {
                    return this.escapeCharacters.get(j);
                }
                else {
                    if (this.escapeIndexes.get(j) < desiredIndex) {
                        desiredIndex += 5 + this.escapeIndirectionLevels.get(j);
                    }
                    else {
                        return this.source.LA(desiredIndex - this.index() + 1);
                    }
                }

            }

            let currentIndex = [this.index()];
            let slashCountPtr = [this.slashCount];
            let indirectionLevelPtr = [0];
            for (let j = 0; j < i; j++) {
                let previousIndex = currentIndex[0];
                let c = this.readCharAt(currentIndex, slashCountPtr, indirectionLevelPtr);
                if (currentIndex[0] > this.range) {
                    if (currentIndex[0] - previousIndex > 1) {
                        this.escapeIndexes.add(previousIndex);
                        this.escapeCharacters.add(c);
                        this.escapeIndirectionLevels.add(indirectionLevelPtr[0]);
                    }

                    this.range = currentIndex[0];
                }

                if (j === i - 1) {
                    return c;
                }
            }

            throw new IllegalStateException("shouldn't be reachable");
        }
    }


    public mark(): number {
        return this.source.mark();
    }


    public release(marker: number): void {
        this.source.release(marker);
    }


    public seek(index: number): void {
        if (index > this.range) {
            throw new UnsupportedOperationException();
        }

        this.source.seek(index);
        this.la1 = this.source.LA(1);

        this.slashCount = 0;
        while (this.source.LA(-this.slashCount - 1) === '\\') {
            this.slashCount++;
        }

        this.escapeListIndex = this.escapeIndexes.binarySearch(this.source.index());
        if (this.escapeListIndex < 0) {
            this.escapeListIndex = -this.escapeListIndex - 1;
        }
    }

    private readCharAt(nextIndexPtr: Int32Array, slashCountPtr: Int32Array, indirectionLevelPtr: Int32Array): number {
        /* assert nextIndexPtr != null && nextIndexPtr.length == 1; */
        /* assert slashCountPtr != null && slashCountPtr.length == 1; */
        /* assert indirectionLevelPtr != null && indirectionLevelPtr.length == 1; */

        let blockUnicodeEscape = (slashCountPtr[0] % 2) !== 0;

        let c0 = this.source.LA(nextIndexPtr[0] - this.index() + 1);
        if (c0 === '\\') {
            slashCountPtr[0]++;

            if (!blockUnicodeEscape) {
                let c1 = this.source.LA(nextIndexPtr[0] - this.index() + 2);
                if (c1 === 'u') {
                    let c2 = this.source.LA(nextIndexPtr[0] - this.index() + 3);
                    indirectionLevelPtr[0] = 0;
                    while (c2 === 'u') {
                        indirectionLevelPtr[0]++;
                        c2 = this.source.LA(nextIndexPtr[0] - this.index() + 3 + indirectionLevelPtr[0]);
                    }

                    let c3 = this.source.LA(nextIndexPtr[0] - this.index() + 4 + indirectionLevelPtr[0]);
                    let c4 = this.source.LA(nextIndexPtr[0] - this.index() + 5 + indirectionLevelPtr[0]);
                    let c5 = this.source.LA(nextIndexPtr[0] - this.index() + 6 + indirectionLevelPtr[0]);
                    if (JavaUnicodeInputStream.isHexDigit(c2) && JavaUnicodeInputStream.isHexDigit(c3) && JavaUnicodeInputStream.isHexDigit(c4) && JavaUnicodeInputStream.isHexDigit(c5)) {
                        let value = JavaUnicodeInputStream.hexValue(c2);
                        value = (value << 4) + JavaUnicodeInputStream.hexValue(c3);
                        value = (value << 4) + JavaUnicodeInputStream.hexValue(c4);
                        value = (value << 4) + JavaUnicodeInputStream.hexValue(c5);

                        nextIndexPtr[0] += 6 + indirectionLevelPtr[0];
                        slashCountPtr[0] = 0;
                        return value;
                    }
                }
            }
        }

        nextIndexPtr[0]++;
        return c0;
    }
}
