/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/* eslint-disable jsdoc/require-returns, jsdoc/require-param */

import { LinkedHashMap as HashMap } from "antlr4ng";

/**
 * I need the get-element-i functionality so I'm subclassing
 *  LinkedHashMap.
 */
export  class OrderedHashMap<K,V> extends LinkedHashMap<K,V> {
	/** Track the elements as they are added to the set */
    protected  elements = new  Array<K>();

    public  getKey(i: number):  K { return this.elements.get(i); }

    public  getElement(i: number):  V { return this.get(this.elements.get(i)); }

    @Override
    public override  put(key: K, value: V):  V {
        this.elements.add(key);

        return super.put(key, value);
    }

    @Override
    public override  putAll(m: Map< K,  V>):  void {
        for (const entry of m.entrySet()) {
            this.put(entry.getKey(), entry.getValue());
        }
    }

    @Override
    public override  remove(key: Object):  V {
        this.elements.remove(key);

        return super.remove(key);
    }

    @Override
    public override  clear():  void {
        this.elements.clear();
        super.clear();
    }
}
