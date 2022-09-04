/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { MurmurHash } from "../../MurmurHash";
import { IllegalArgumentException } from "../lang";
import { InvalidMarkException } from "./InvalidMarkException";

/* eslint-disable jsdoc/require-returns */

export abstract class Buffer<T> {
    protected currentCapacity = 0;
    protected currentPosition = 0;
    protected currentLimit = 0;
    protected currentMark = -1;

    /** @returns this buffer's capacity. */
    public capacity(): number {
        return this.currentCapacity;
    }

    /** Clears this buffer. */
    public clear(): this {
        this.currentPosition = 0;
        this.currentLimit = this.currentCapacity;
        this.currentMark = -1;

        return this;
    }

    /** Flips this buffer. */
    public flip(): this {
        this.currentLimit = this.currentPosition;
        this.currentPosition = 0;
        this.currentMark = -1;

        return this;
    }

    /** Tells whether there are any elements between the current position and the limit. */
    public hasRemaining(): boolean {
        return this.currentLimit > this.currentPosition;
    }

    /** Returns this buffer's limit. */
    public get limit(): number {
        return this.currentLimit;
    }

    /**
     * Sets this buffer's limit.
     *
     * @param newLimit The new limit.
     */
    public set limit(newLimit: number) {
        if (newLimit < 0 || newLimit > this.currentCapacity) {
            throw new IllegalArgumentException();
        }

        this.currentLimit = newLimit;
        if (this.currentPosition > newLimit) {
            this.currentPosition = newLimit;
        }
        if (this.currentMark > newLimit) {
            this.currentMark = -1;
        }
    }

    /** Sets this buffer's mark at its position. */
    public mark(): this {
        this.currentMark = this.currentPosition;

        return this;
    }

    /** Returns this buffer's position. */
    public get position(): number {
        return this.currentPosition;
    }

    /**
     * Sets this buffer's position.
     *
     * @param newPosition The new position;
     */
    public set position(newPosition: number) {
        if (newPosition > this.currentLimit || newPosition < 0) {
            throw new IllegalArgumentException();
        }

        if (this.currentMark > newPosition) {
            this.currentMark = -1;
        }
        this.currentPosition = newPosition;
    }

    /** Returns the number of elements between the current position and the limit. */
    public remaining(): number {
        const diff = this.currentLimit - this.currentPosition;

        return diff < 0 ? 0 : diff;
    }

    /** Resets this buffer's position to the previously-marked position. */
    public reset(): this {
        if (this.currentMark < 0) {
            throw new InvalidMarkException("No mark is set");
        }
        this.currentPosition = this.currentMark;

        return this;
    }

    /** Rewinds this buffer. */
    public rewind(): this {
        this.currentPosition = 0;
        this.currentMark = -1;

        return this;
    }

    /** Returns the current hash code of this buffer. */
    public hashCode(): number {
        let hash = MurmurHash.initialize();
        hash = MurmurHash.update(hash, this.currentCapacity);
        hash = MurmurHash.update(hash, this.currentPosition);
        hash = MurmurHash.update(hash, this.currentLimit);
        hash = MurmurHash.update(hash, this.currentMark);
        hash = MurmurHash.finish(hash, 4);

        return hash;
    }

    /** Returns the array that backs this buffer (optional operation). */
    public abstract array(): T;

    /**
     * Returns the offset within this buffer's backing array of the first element of the buffer  (optional operation).
     */
    public abstract arrayOffset(): number;

    /** Tells whether or not this buffer is backed by an accessible array. */
    public abstract hasArray(): boolean;

    /** Tells whether or not this buffer is direct. */
    public abstract isDirect(): boolean;

    /** Tells whether or not this buffer is read-only. */
    public abstract isReadOnly(): boolean;
}
