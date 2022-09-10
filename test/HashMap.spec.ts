/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { java } from "../lib/java/java";
import { HashMapEntry } from "../lib/java/util/HashMapEntry";

// A test class which is not a HashMap but implements the Map interface.
class Test<K, V> implements java.util.Map<K, V> {
    public clear(): void { /**/ }
    public containsKey(_key: K): boolean { return true; }
    public containsValue(_value: V): boolean { return true; }
    public entrySet(): java.util.Set<java.util.Map.Entry<K, V>> {
        const set = new java.util.HashSet<HashMapEntry<K, V>>();
        set.add(new HashMapEntry<K, V>(null, null));

        return set;
    }
    public equals(_o: unknown): boolean { return; }
    public get(_key: K): V | undefined { return; }
    public hashCode(): number { return 0; }
    public isEmpty(): boolean { return false; }
    public keySet(): java.util.Set<K> { return; }
    public put(_key: K, _value: V): V { return; }
    public putAll(_m: java.util.Map<K, V>): void { return; }
    public remove(_key: K): V | undefined { return; }
    public size(): number { return 0; }
    public values(): java.util.Collection<V> { return; }
}

describe("HashMap Tests", () => {
    it("Basic Map Operations", () => {
        const m = new java.util.HashMap<string, number>();

        expect(m.size()).toBe(0);
        expect(m.isEmpty()).toBeTruthy();
        expect(m.containsKey("")).toBeFalsy();
        expect(m.containsKey("mike")).toBeFalsy();

        expect(m.put("mike", 42)).toBe(undefined);
        expect(m.get("mike")).toBe(42);

        expect(m.isEmpty()).toBeFalsy();

        expect(m.containsKey("mike")).toBeTruthy();
        expect(m.put("mike", 43)).toBe(42);
        expect(m.get("mike")).toBe(43);

        expect(m.put("mike2", 41)).toBe(undefined);
        expect(m.size()).toBe(2);

        expect(m.remove("mike3")).toBe(undefined);
        expect(m.size()).toBe(2);
        expect(m.remove("mike")).toBe(43);
        expect(m.size()).toBe(1);

        m.clear();
        expect(m.size()).toBe(0);
        expect(m.isEmpty()).toBeTruthy();
    });

    it("Hash Code and Equality", () => {
        const m = new java.util.HashMap<string, string>(200);
        expect(m.size()).toBe(0);
        m.put("", null);
        expect(m.get("")).toBeNull();
        expect(m.get(null)).toBeUndefined();

        m.put("▤▦▧", "squares");
        m.put("♩♪♫♬", "music notes");
        m.put("abcdefghijklmnopqrstuvwxyz", "latin alphabet");
        m.put("ᬠᬣᬦᬪᬫᬬᬭ", "balinese");
        m.put("1234567890", "numbers");
        expect(m.hashCode()).toBe(2427096705);

        m.put("Accentuate the positive", "");
        expect(m.hashCode()).toBe(3806309279);

        const m2 = new java.util.HashMap(m);
        expect(m2.hashCode()).toBe(3806309279);
        expect(m.equals(m2)).toBeTruthy();

        const m3 = m2.clone();
        expect(m.equals(m3)).toBeTruthy();

        m2.put("Some", "more");
        expect(m.equals(m2)).toBeFalsy();

        expect(m.equals(Math)).toBeFalsy();
    });

    it("Load Test", () => {
        const m = new java.util.HashMap<number, number>(20000);
        for (let i = 0; i < 100000; ++i) {
            m.put(i, 2 * i);
        }

        expect(m.size()).toBe(100000);
        expect(m.hashCode()).toBe(267327352994);

        const test = new Test<number, number>();
        expect(m.equals(test)).toBeFalsy();
        m.putAll(test);
    });

    it("Iteration and Search", () => {
        const m = new java.util.HashMap<number, number>();
        m.put(10000, 1);
        m.put(10, 1);
        m.put(100000, 1);

        const keys: number[] = [];
        for (const e of m) {
            keys.push(e.getKey());
        }

        // Insertion order is not maintained!
        expect(keys).not.toEqual([10000, 10, 1000000]);

        // Instead they are inserted (and enumerated) based on their bucket position (which in turn depends on the
        // key's hash code).
        expect(keys).not.toEqual([1000000, 10000, 10]);

        expect(m.containsValue(1)).toBeTruthy();
        expect(m.containsValue(10)).toBeFalsy();
    });

    it("Sub lists", () => {
        const m = new java.util.HashMap<string, unknown>();
        m.put("lorem", 1);
        m.put("ipsum", null);
        m.put("dolor", true);
        m.put("sit", 1);
        m.put("amet", null);

        const set = m.entrySet();
        expect(set.size()).toBe(5);

        const keys = m.keySet();
        expect(keys.size()).toBe(5);
        expect(keys.contains("ipsum")).toBeTruthy();
        expect(keys.contains("mike")).toBeFalsy();

        const values = m.values();
        expect(values.size()).toBe(3);
        expect(values.contains(null)).toBeTruthy();
    });
});
