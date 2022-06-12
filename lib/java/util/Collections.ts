/*
 * This file is released under the MIT license.
 * Copyright (c) 2021, Mike Lischke
 *
 * See LICENSE file for more info.
 */

import { ArrayList, Comparator, List } from ".";

/* eslint-disable @typescript-eslint/naming-convention */

export abstract class Collections {
    public static readonly EMPTY_LIST = new ArrayList();
    public static readonly EMPTY_MAP = new Map();
    public static readonly EMPTY_SET = new Set();

    public static unmodifiableMap<T extends Map<unknown, unknown>>(map: T): Readonly<T> {
        return map;
    }

    public static unmodifiableList<T>(list: List<T>): Readonly<List<T>> {
        return list;
    }

    public static reverse<T>(list: List<T>): void {
        const array = list.toArray().reverse();
        list.clear();
        for (const entry of array) {
            list.add(entry);
        }
    }

    public static emptyList<T>(): List<T> {
        return new ArrayList<T>();
    }

    public static sort<T>(list: List<T>, c: Comparator<T>): List<T> {
        const array = new ArrayList<T>(list).toArray();
        array.sort((a, b) => {
            return c.compare(a, b);
        });

        return new ArrayList<T>(array);
    }
}
