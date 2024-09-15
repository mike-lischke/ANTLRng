/* java2ts: keep */

/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { CommonToken, Token } from "antlr4ng";

import { GrammarAST } from "../tool/ast/GrammarAST.js";
import { Character } from "../support/Character.js";

export const INVALID_TOKEN = CommonToken.fromType(Token.INVALID_TYPE);

export type Constructor = new (...args: unknown[]) => unknown;

export class Utils {
    public static readonly INTEGER_POOL_MAX_VALUE = 1000;

    public static stripFileExtension(name: string): string | null {
        if (name === null) {
            return null;
        }

        const lastDot = name.lastIndexOf(".");
        if (lastDot < 0) {
            return name;
        }

        return name.substring(0, lastDot);
    }

    public static sortLinesInString(s: string): string {
        const lines = s.split("\n");
        lines.sort();

        return lines.join("\n");
    }

    public static nodesToStrings<T extends GrammarAST>(nodes: T[]): string[] {
        const a = new Array<string>();
        for (const t of nodes) {
            a.push(t.getText()!);
        }

        return a;
    }

    public static capitalize(s: string): string {
        return Character.toUpperCase(s.charAt(0)) + s.substring(1);
    }

    public static decapitalize(s: string): string {
        return Character.toLowerCase(s.charAt(0)) + s.substring(1);
    }

    /**
     * apply methodName to list and return list of results. method has
     *  no args.  This pulls data out of a list essentially.
     */
    public static select<From, To>(list: From[], selector: Utils.Func1<From, To>): To[] {
        const b = new Array<To>();
        for (const f of list) {
            b.push(selector.exec(f));
        }

        return b;
    }

    /** Find exact object type or subclass of cl in list */
    public static find<T>(ops: unknown[], cl: Constructor): T | null {
        for (const o of ops) {
            if (o instanceof cl) {
                return o as T;
            }
        }

        return null;
    }

    public static indexOf<T>(elements: T[], filter: Utils.Filter<T>): number {
        for (let i = 0; i < elements.length; i++) {
            if (filter.select(elements[i])) {
                return i;
            }
        }

        return -1;
    }

    public static lastIndexOf<T>(elements: T[], filter: Utils.Filter<T>): number {
        for (let i = elements.length - 1; i >= 0; i--) {
            if (filter.select(elements[i])) {
                return i;
            }
        }

        return -1;
    }

    public static setSize(list: unknown[], size: number): void {
        const fills = size - list.length;
        if (fills < 0) {
            list.length = size;
        } else {
            for (let i = 0; i < fills; i++) {
                list.push(null);
            }
        }
    }
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Utils {
    export interface Filter<T> {
        select(t: T): boolean;
    }

    export interface Func0<TResult> {
        exec(): TResult;
    }

    export interface Func1<T1, TResult> {
        exec(arg1: T1): TResult;
    }

}
