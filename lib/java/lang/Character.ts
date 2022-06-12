/*
 * This file is released under the MIT license.
 * Copyright (c) 2021, Mike Lischke
 *
 * See LICENSE file for more info.
 */

/* eslint-disable max-classes-per-file, @typescript-eslint/no-namespace, no-redeclare,
                  @typescript-eslint/naming-convention,
*/

import { CodePoint } from ".";

// A partial implementation of the Java Character class.

export class Character {
    public static isISOControl = (c: CodePoint): boolean => {
        return false;
    };

    public static isDigit(c: CodePoint): boolean {
        return String.fromCodePoint(c).match(/0-9/) !== null;
    }

    public static toString(c: CodePoint): string {
        return String.fromCodePoint(c);
    }

    public static toUpperCase(s: string): string {
        return s.toUpperCase();
    }

    public static toLowerCase(s: string): string {
        return s.toLowerCase();
    }

}

export namespace Character {
    export class UnicodeBlock {
        public static readonly BASIC_LATIN = 1;

        public static of = (c: CodePoint): number => {
            return 0;
        };

    }
}
