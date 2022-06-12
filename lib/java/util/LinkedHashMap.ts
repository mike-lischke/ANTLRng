/*
 * This file is released under the MIT license.
 * Copyright (c) 2021, Mike Lischke
 *
 * See LICENSE file for more info.
 */

import { HashMap } from "./HashMap";

export class LinkedHashMap<K, V> extends HashMap<K, V> {
    protected removeEldestEntry(_eldest: [K, V]): boolean {
        return false;
    }
}
