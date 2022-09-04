/*
 * This file is released under the MIT license.
 * Copyright (c) 2021, 2022, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { ArrayList, Comparator, List, Collection } from ".";
import { HashableType } from "../../MurmurHash";
import { Comparable } from "../lang";

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

    public static emptyList<T extends HashableType>(): List<T> {
        return new ArrayList<T>();
    }

    public static sort<T extends HashableType>(list: List<T>, c: Comparator<T>): List<T> {
        const array = new ArrayList<T>(list).toArray();
        array.sort((a, b) => {
            return c.compare(a, b);
        });

        return new ArrayList<T>(array);
    }

    public static max<T extends Comparable<T>>(coll: Collection<T> | T[]): T | undefined {
        let result: T | undefined;
        for (const current of coll) {
            if (result === undefined) {
                result = current;
                continue;
            }

            const comparison = result.compareTo(current);
            if (comparison < 0) {
                result = current;
            }
        }

        return result;
    }

    public static min<T extends Comparable<T>>(coll: Collection<T> | T[]): T | undefined {
        let result: T | undefined;
        for (const current of coll) {
            if (result === undefined) {
                result = current;
                continue;
            }

            const comparison = result.compareTo(current);
            if (comparison > 0) {
                result = current;
            }
        }

        return result;
    }
}
