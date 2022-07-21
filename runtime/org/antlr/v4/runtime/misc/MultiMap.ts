/* java2ts: keep */

/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { java } from "../../../../../../lib/java/java";
import { HashableType } from "./MurmurHash";

export class MultiMap<K, V extends HashableType> extends java.util.HashMap<K, java.util.List<V>> {

    public map = (key: K, value: V): void => {
        let elementsForKey: java.util.List<V> = this.get(key);
        if (elementsForKey === undefined) {
            elementsForKey = new java.util.ArrayList<V>();
            super.put(key, elementsForKey);
        }
        elementsForKey.add(value);
    };

    public getPairs = (): Array<[K, V]> => {
        const pairs: Array<[K, V]> = [];
        for (const key of this.keySet()) {
            for (const value of this.get(key)) {
                pairs.push([key, value]);
            }
        }

        return pairs;
    };
}
