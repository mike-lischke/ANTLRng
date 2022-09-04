/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { HashMap } from "../lib/java/util";

describe("HashMap Tests", () => {
    it("Basic Map Operations", () => {
        const m = new HashMap<string, number>();

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

        m.clear();
        expect(m.size()).toBe(0);
        expect(m.isEmpty()).toBeTruthy();
    });

    it("Hash Code and Equality", () => {
        const m = new HashMap<string, string>(200);
        expect(m.size()).toBe(0);
        m.put("", null);
        expect(m.get("")).toBeNull();

        m.put("▤▦▧", "squares");
        m.put("♩♪♫♬", "music notes");
        m.put("abcdefghijklmnopqrstuvwxyz", "latin alphabet");
        m.put("ᬠᬣᬦᬪᬫᬬᬭ", "balinese");
        m.put("1234567890", "numbers");
        expect(m.hashCode()).toBe(2427096705);

        m.put("Accentuate the positive", "");
        expect(m.hashCode()).toBe(3806309279);

        const m2 = new HashMap(m);
        expect(m2.hashCode()).toBe(3806309279);
        expect(m.equals(m2)).toBeTruthy();

        m2.put("Some", "more");
        expect(m.equals(m2)).toBeFalsy();
    });

    it("Load Test", () => {
        const m = new HashMap<number, number>(20000);
        for (let i = 0; i < 100000; ++i) {
            m.put(i, 2 * i);
        }

        expect(m.size()).toBe(100000);
        expect(m.hashCode()).toBe(267327352994);
    });

});
