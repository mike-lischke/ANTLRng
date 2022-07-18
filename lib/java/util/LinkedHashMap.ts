/*
 * This file is released under the MIT license.
 * Copyright (c) 2021, 2022, Mike Lischke
 *
 * See LICENSE file for more info.
 */

import { IEquatable } from "../../types";
import { HashMap } from "./HashMap";

export class LinkedHashMap<K extends IEquatable, V extends IEquatable> extends HashMap<K, V> {
    protected removeEldestEntry(_eldest: [K, V]): boolean {
        return false;
    }
}
