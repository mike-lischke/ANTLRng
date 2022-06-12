/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, Mike Lischke
 *
 * See LICENSE file for more info.
 */

import { ListIterator } from ".";
import { IndexOutOfBoundsException, NoSuchElementException } from "../lang";

export class ArrayListIterator<T> implements ListIterator<T> {

    private nextBufferIndex = 0;

    // Holds the direction we navigated last (either by calling next() or previous()).
    private movedForward = false;

    public constructor(private buffer: T[], startIndex?: number) {
        if (startIndex !== undefined) {
            if (startIndex < 0 || startIndex >= buffer.length) {
                throw new IndexOutOfBoundsException();
            }

            this.nextBufferIndex = startIndex;
        }
    }

    public add(element: T): void {
        this.buffer.push(element);
    }

    public hasNext(): boolean {
        return this.nextBufferIndex < this.buffer.length;
    }

    public hasPrevious(): boolean {
        return this.nextBufferIndex > 0;
    }

    public next(): T {
        if (this.nextBufferIndex === this.buffer.length) {
            throw new NoSuchElementException();
        }

        this.movedForward = true;

        return this.buffer[this.nextBufferIndex++];
    }

    public nextIndex(): number {
        return this.nextBufferIndex;
    }

    public previous(): T {
        if (this.nextBufferIndex === 0) {
            throw new NoSuchElementException();
        }

        this.movedForward = false;

        return this.buffer[--this.nextBufferIndex];
    }

    public previousIndex(): number {
        return this.nextBufferIndex - 1;
    }

    public remove(): void {
        if (this.movedForward) {
            // Index was moved to next element.
            this.buffer.splice(this.nextBufferIndex - 1, 1);
        } else {
            // Index at last returned element.
            this.buffer.splice(this.nextBufferIndex, 1);
        }
    }

    public set(element: T): void {
        if (this.movedForward) {
            // Index was moved to next element.
            this.buffer[this.nextBufferIndex - 1] = element;
        } else {
            // Index at last returned element.
            this.buffer[this.nextBufferIndex] = element;
        }
    }

}

