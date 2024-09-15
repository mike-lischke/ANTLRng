/* java2ts: keep */

/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { HashMap } from "antlr4ng";

/** Count how many of each key we have; not thread safe */
export class FrequencySet<T> extends HashMap<T, number> {
    public count(key: T): number {
        const value = this.get(key);
        if (value === undefined) {
            return 0;
        }

        return value;
    }

    public add(key: T): void {
        const value = this.get(key) ?? 0;
        this.set(key, value + 1);
    }
}
