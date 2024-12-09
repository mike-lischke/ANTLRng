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
        let introducer = "\\u";
        let text = "";

        switch (language) {
            case "CSharp":
            case "Python3":
            case "Cpp":
            case "Go":
            case "PHP": {
                if (Character.isSupplementaryCodePoint(codePoint)) {
                    introducer = "\\U";
                    text = printf("%08x", codePoint);
                } else {
                    text = printf("%04x", codePoint);
                }

                break;
            }

            case "Swift": {
                text = printf("{%04x}", codePoint);

                break;
            }

            default: {
                if (Character.isSupplementaryCodePoint(codePoint)) {
                    // char is not an 'integral' type, so we have to explicitly convert
                    // to int before passing to the %X formatter or else it throws.
                    return introducer + printf("%04x", Number(Character.highSurrogate(codePoint))).toUpperCase() +
                        introducer + printf("%04x", Number(Character.lowSurrogate(codePoint))).toUpperCase();
                } else {
                    text = printf("%04x", codePoint);
                }
            }
        }

        return introducer + text.toUpperCase();
    }
}
