/*
 * This file is released under the MIT license.
 * Copyright (c) 2021, 2022, Mike Lischke
 *
 * See LICENSE file for more info.
 */

import { java } from "../java";

import { NotImplementedError } from "../../NotImplementedError";

export class HashMap<K, V> extends Map<K, V> implements java.util.Map<K, V> {

    public isEmpty(): boolean {
        return this.size === 0;
    }

    public putAll(m: java.util.Map<K, V>): void {
        const set = m.entrySet();
        set.forEach((value) => {
            this.set(value[0], value[1]);
        });
    }

    public containsKey(key: K): boolean {
        return this.has(key);
    }

    /**
     * @param value The value to search.
     *
     * @returns true if this map maps at least one keys to the specified value.
     */
    public containsValue(value: V): boolean {
        this.forEach((candidate: V) => {
            if (candidate === value) {
                return true;
            }
        });

        return false;
    }

    public remove(key: K): V | undefined {
        const value = this.get(key);
        if (value !== undefined) {
            this.delete(key);
        }

        return value;
    }

    /**
     * Compares the specified object with this map for equality.
     *
     * @param o The value to compare against.
     *
     * @returns True if the given value and this instance are equal (same instance or same values).
     */
    public equals(o: unknown): boolean {
        if (!(o instanceof HashMap)) {
            return false;
        }

        if (o === this || o.hashCode() === this.hashCode()) {
            return true;
        }

        return false;
    }

    public hashCode(): number {
        throw new NotImplementedError();
    }

    /**
     * @returns a set view of the mappings contained in this map.
     */
    public entrySet(): Set<[K, V]> {
        const result = new Set<[K, V]>();
        for (const tuple of this) {
            result.add(tuple);
        }

        return result;
    }

    /**
     * @param key The key for which to return a value.
     * @param defaultValue A value to return, if the key cannot be found.
     * @returns the value to which the specified key is mapped, or defaultValue if this map contains no mapping
     *          for the key.
     */
    public getOrDefault(key: K, defaultValue: V): V {
        return this.get(key) ?? defaultValue;
    }

    /**
     * @returns a Set view of the keys contained in this map.
     */
    public keySet(): Set<K> {
        return new Set(this.keys());
    }

    /**
     * Alias to .set()
     *
     * @param key The key for which to set a new value.
     * @param value The new value to set.
     *
     * @returns This map.
     */
    public put(key: K, value: V): V {
        this.set(key, value);

        return value;
    }
}
