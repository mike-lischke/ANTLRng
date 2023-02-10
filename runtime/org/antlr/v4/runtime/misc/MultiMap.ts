/* java2ts: keep */

/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { java } from "jree";
import { Pair } from "./Pair";

export class MultiMap<K, V> extends java.util.LinkedHashMap<K, java.util.List<V>> {
    public map = (key: K, value: V): void => {
        let elementsForKey = this.get(key);
        if (elementsForKey === null) {
            elementsForKey = new java.util.ArrayList<V>();
            super.put(key, elementsForKey);
        }
        elementsForKey.add(value);
    };

    public getPairs = (): java.util.List<Pair<K, V>> | null => {
        const pairs: java.util.List<Pair<K, V>> = new java.util.ArrayList<Pair<K, V>>();
        for (const key of this.keySet()) {
            const values = this.get(key);
            if (values) {
                for (const value of values) {
                    pairs.add(new Pair<K, V>(key, value));
                }
            }
        }

        return pairs;
    };
}
