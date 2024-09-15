/* java2ts: keep */

/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { printf } from "fast-printf";

import { Character } from "../support/Character.js";

/**
 * Utility class to escape Unicode code points using various languages' syntax.
 */
export class UnicodeEscapes {
    public static escapeCodePoint(codePoint: number, language: string): string {
        switch (language) {
            case "CSharp":
            case "Python3":
            case "Cpp":
            case "Go":
            case "PHP": {
                const format = Character.isSupplementaryCodePoint(codePoint) ? "\\U%08X" : "\\u%04X";
                return printf(format, codePoint);
            }

            case "Swift": {
                return printf("\\u{%04X}", codePoint);
            }

            default: {
                if (Character.isSupplementaryCodePoint(codePoint)) {
                    // char is not an 'integral' type, so we have to explicitly convert
                    // to int before passing to the %X formatter or else it throws.
                    return printf("\\u%04X", Number(Character.highSurrogate(codePoint))) +
                        printf("\\u%04X", Number(Character.lowSurrogate(codePoint)));
                }

                return printf("\\u%04X", codePoint);
            }
        }
    }
}
