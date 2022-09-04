/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { java } from "../java";
import { Collection } from "./Collection";

// eslint-disable-next-line @typescript-eslint/naming-convention
export interface Map<K, V> {
    /** Removes all of the mappings from this map (optional operation). */
    clear(): void;

    /** Returns true if this map contains a mapping for the specified key. */
    containsKey(key: K): boolean;

    /** Returns true if this map maps one or more keys to the specified value. */
    containsValue(value: V): boolean;

    /** Returns a Set view of the mappings contained in this map. */
    entrySet(): java.util.Set<Map.Entry<K, V>>;

    /** Compares the specified object with this map for equality. */
    equals(o: unknown): boolean;

    /** Returns the value to which the specified key is mapped, or null if this map contains no mapping for the key. */
    get(key: K): V | undefined;

    /** Returns the hash code value for this map. */
    hashCode(): number;

    /** Returns true if this map contains no key-value mappings. */
    isEmpty(): boolean;

    /** Returns a Set view of the keys contained in this map. */
    keySet(): java.util.Set<K>;

    /** Associates the specified value with the specified key in this map (optional operation). */
    put(key: K, value: V): V;

    /** Copies all of the mappings from the specified map to this map (optional operation). */
    putAll(m: java.util.Map<K, V>): void;

    /** Removes the mapping for a key from this map if it is present (optional operation). */
    remove(key: K): V | undefined;

    /** Returns the number of key-value mappings in this map. */
    size(): number;

    /** Returns a Collection view of the values contained in this map. */
    values(): Collection<V>;
}

// eslint-disable-next-line @typescript-eslint/no-namespace, no-redeclare
export namespace Map {
    export abstract class Entry<K, V> {
        /** Compares the specified object with this entry for equality. */
        public abstract equals(o: unknown): boolean;

        /** Returns the key corresponding to this entry. */
        public abstract getKey(): K;

        /** Returns the value corresponding to this entry. */
        public abstract getValue(): V;

        /** Returns the hash code value for this map entry. */
        public abstract hashCode(): number;

        /** Replaces the value corresponding to this entry with the specified value (optional operation). */
        public abstract setValue(value: V): V;
    }
}
