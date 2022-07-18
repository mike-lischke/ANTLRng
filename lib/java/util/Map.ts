/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, Mike Lischke
 *
 * See LICENSE file for more info.
 */

// eslint-disable-next-line @typescript-eslint/naming-convention
export interface Map<K, V> {
    /** Removes all of the mappings from this map (optional operation). */
    clear(): void;

    /** Returns true if this map contains a mapping for the specified key. */
    containsKey(key: K): boolean;

    /** Returns true if this map maps one or more keys to the specified value. */
    containsValue(value: V): boolean;

    /** Returns a Set view of the mappings contained in this map. */
    entrySet(): Set<[K, V]>;

    /** Compares the specified object with this map for equality. */
    equals(o: unknown): boolean;

    /** Returns the value to which the specified key is mapped, or null if this map contains no mapping for the key. */
    get(key: K): V | undefined;

    /** Returns the hash code value for this map. */
    hashCode(): number;

    /** Returns true if this map contains no key-value mappings. */
    isEmpty(): boolean;

    /** Returns a Set view of the keys contained in this map. */
    keySet(): Set<K>;

    /** Associates the specified value with the specified key in this map (optional operation). */
    put(key: K, value: V): V;

    /** Copies all of the mappings from the specified map to this map (optional operation). */
    putAll(m: Map<K, V>): void;

    /** Removes the mapping for a key from this map if it is present (optional operation). */
    remove(key: K): V | undefined;

    /** Returns the number of key-value mappings in this map. */
    size: number;

    /** Returns a Collection view of the values contained in this map. */
    values(): IterableIterator<V>;
}
