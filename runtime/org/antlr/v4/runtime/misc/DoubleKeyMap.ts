/* java2ts: keep */

/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/*
 eslint-disable @typescript-eslint/no-namespace, @typescript-eslint/naming-convention,
 max-classes-per-file, jsdoc/check-tag-names, @typescript-eslint/no-empty-function,
 @typescript-eslint/restrict-plus-operands, @typescript-eslint/unified-signatures, @typescript-eslint/member-ordering,
 no-underscore-dangle
*/

/* cspell: disable */

import { java } from "../../../../../../lib/java/java";

/**
 * Sometimes we need to map a key to a value but key is two pieces of data.
 *  This nested hash table saves creating a single key each time we access
 *  map; avoids mem creation.
 */
export class DoubleKeyMap<Key1, Key2, Value> {
    public data = new java.util.LinkedHashMap<Key1, Map<Key2, Value>>();

    public put = (k1: Key1, k2: Key2, v: Value): Value => {
        let data2: Map<Key2, Value> = this.data.get(k1);
        let prev: Value;
        if (data2 === undefined) {
            data2 = new java.util.LinkedHashMap<Key2, Value>();
            this.data.set(k1, data2);
        } else {
            prev = data2.get(k2);
        }
        data2.set(k2, v);

        return prev;
    };

    public get(k1: Key1): Map<Key2, Value>;
    public get(k1: Key1, k2: Key2): Value;
    public get(k1: Key1, k2?: Key2): Map<Key2, Value> | Value {
        if (k2 === undefined) {
            return this.data.get(k1);
        } else {
            const data2: Map<Key2, Value> = this.data.get(k1);
            if (data2 === undefined) {
                return undefined;
            }

            return data2.get(k2);
        }

    }

    /**
     * Get all values associated with primary key
     *
     * @param k1 The primary key.
     *
     * @returns The values collection.
     */
    public values = (k1: Key1): java.util.Collection<Value> => {
        const data2: Map<Key2, Value> = this.data.get(k1);
        if (data2 === undefined) {
            return undefined;
        }

        return new java.util.ArrayList<Value>([...data2.values()]);
    };

    /** get all primary keys */
    public keySet(): Set<Key1>;
    /** get all secondary keys associated with a primary key */
    public keySet(k1: Key1): Set<Key2>;
    /**
     * get all primary keys
     *
     * @param k1 The primary key.
     *
     * @returns The found keys.
     */
    public keySet(k1?: Key1): Set<Key1> | Set<Key2> {
        if (k1 === undefined) {
            return this.data.keySet();
        } else {
            const data2: Map<Key2, Value> = this.data.get(k1);
            if (data2 === undefined) {
                return undefined;
            }

            return new Set(data2.keys());
        }

    }

}
