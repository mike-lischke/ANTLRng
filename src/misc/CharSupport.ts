/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { IntervalSet } from "antlr4ng";

import { Character } from "../support/Character.js";

export class CharSupport {
    /**
     * When converting ANTLR char and string literals, here is the
     *  value set of escape chars.
     */
    public static readonly ANTLRLiteralEscapedCharValue: Record<string, number> = {};

    private static readonly validEscapeCharacters: string = `btn\\fr"'`;
    /**
     * @param c The code point to convert to an ANTLR char literal.
     *
     * @returns a string representing the escaped char for code c.  E.g., If c
     *  has value 0x100, you will get "\\u0100".  ASCII gets the usual
     *  char (non-hex) representation.  Non-ASCII characters are spit out
     *  as \\uXXXX or \\u{XXXXXX} escapes.
     */
    public static getANTLRCharLiteralForChar(c: number): string {
        let result: string;
        if (c < 0) {
            result = "<INVALID>";
        } else {
            const char = String.fromCodePoint(c);
            if (this.validEscapeCharacters.includes(char)) {
                result = char;
            } else {
                if (Character.UnicodeBlock.of(c) === Character.UnicodeBlock.BASIC_LATIN &&
                    !Character.isISOControl(c)) {
                    if (c === 0x5C) { // escape \ itself
                        result = "\\\\";
                    } else {
                        if (c === 0x27) { // escape single quote
                            result = "\\'";
                        } else {
                            result = char;
                        }
                    }
                } else {
                    if (c <= 0xFFFF) {
                        // Unicode escape sequence with 4 characters.
                        result = "\\u" + ("0000" + c.toString(16).toUpperCase()).slice(-4);
                    } else {
                        // Codepoint escape sequence with 6 characters.
                        result = "\\u{" + ("000000" + c.toString(16).toUpperCase()).slice(-6) + "}";
                    }
                }
            }
        }

        return "'" + result + "'";
    }

    /**
     * Given a literal like (the 3 char sequence with single quotes) 'a',
     * return the int value of 'a'. Convert escape sequences here also.
     *
     * @param literal The char literal to convert.
     *
     * @returns the code point value of the char literal or -1 if not a single char literal.
     */
    public static getCharValueFromGrammarCharLiteral(literal: string): number {
        if (literal.length < 3) {
            return -1;
        }

        return CharSupport.getCharValueFromCharInGrammarLiteral(literal.substring(1, literal.length - 1));
    }

    public static getStringFromGrammarStringLiteral(literal: string): string | null {
        let buffer = "";
        let i = 1; // skip first quote
        const n = literal.length - 1; // skip last quote
        while (i < n) { // scan all but last quote
            let end = i + 1;
            if (literal.charAt(i) === "\\") {
                end = i + 2;
                if (i + 1 < n && literal.charAt(i + 1) === "u") {
                    if (i + 2 < n && literal.charAt(i + 2) === "{") { // extended escape sequence
                        end = i + 3;
                        while (true) {
                            if (end + 1 > n) {
                                return null;
                            }
                            // invalid escape sequence.
                            const charAt = literal.charAt(end++);
                            if (charAt === "}") {
                                break;
                            }

                            if (!Character.isDigit(charAt.codePointAt(0)!) && !(charAt >= "a" && charAt <= "f")
                                && !(charAt >= "A" && charAt <= "F")) {
                                return null; // invalid escape sequence.
                            }
                        }
                    } else {
                        for (end = i + 2; end < i + 6; end++) {
                            if (end > n) {
                                return null;
                            }
                            // invalid escape sequence.
                            const charAt = literal.charAt(end);
                            if (!Character.isDigit(charAt.codePointAt(0)!) && !(charAt >= "a" && charAt <= "f")
                                && !(charAt >= "A" && charAt <= "F")) {
                                return null; // invalid escape sequence.
                            }
                        }
                    }
                }
            }

            if (end > n) {
                return null; // invalid escape sequence.
            }

            const esc = literal.substring(i, end);
            const c = CharSupport.getCharValueFromCharInGrammarLiteral(esc);
            if (c === -1) {
                return null; // invalid escape sequence.
            } else {
                buffer += String.fromCodePoint(c);
            }

            i = end;
        }

        return buffer;
    }

    /**
     * Given char x or \\t or \\u1234 return the char value. Unnecessary escapes like '\{' yield -1.
     *
     * @param cstr The char to convert.
     *
     * @returns the code point value of the char or -1 if not a single char literal.
     */
    public static getCharValueFromCharInGrammarLiteral(cstr: string): number {
        switch (cstr.length) {
            case 1: { // 'x'
                return cstr.codePointAt(0)!;
            }

            // no escape char
            case 2: {
                if (!cstr.startsWith("\\")) {
                    return -1;
                }

                // '\x'  (antlr lexer will catch invalid char)
                const escChar = cstr.codePointAt(0)!;
                if (escChar === 0x27) { // '
                    return escChar;
                }

                // escape quote only in string literals.
                return this.validEscapeCharacters.includes(cstr[0]) ? escChar : -1;
            }

            case 6: {
                // '\\u1234' or '\\u{12}'
                if (!cstr.startsWith("\\u")) {
                    return -1;
                }

                let startOff: number;
                let endOff: number;
                if (cstr.charAt(2) === "{") {
                    startOff = 3;
                    endOff = cstr.indexOf("}");
                } else {
                    startOff = 2;
                    endOff = cstr.length;
                }

                return CharSupport.parseHexValue(cstr, startOff, endOff);
            }

            default: {
                if (cstr.startsWith("\\u{")) {
                    return CharSupport.parseHexValue(cstr, 3, cstr.indexOf("}"));
                }

                return -1;
            }

        }
    }

    public static parseHexValue(cstr: string, startOff: number, endOff: number): number {
        if (startOff < 0 || endOff < 0) {
            return -1;
        }

        const unicodeChars = cstr.substring(startOff, endOff);
        const result = parseInt(unicodeChars, 16);

        return result;
    }

    public static capitalize(s: string): string {
        return Character.toUpperCase(s.charAt(0)) + s.substring(1);
    }

    public static getIntervalSetEscapedString(intervalSet: IntervalSet): string {
        const parts: string[] = [];
        for (const interval of intervalSet) {
            parts.push(CharSupport.getRangeEscapedString(interval.start, interval.stop));
        }

        return parts.join(" | ");
    }

    public static getRangeEscapedString(codePointStart: number, codePointEnd: number): string {
        return codePointStart !== codePointEnd
            ? CharSupport.getANTLRCharLiteralForChar(codePointStart) + ".." +
            CharSupport.getANTLRCharLiteralForChar(codePointEnd)
            : CharSupport.getANTLRCharLiteralForChar(codePointStart);
    }

    static {
        CharSupport.ANTLRLiteralEscapedCharValue.n = 0x0A; // '\n'
        CharSupport.ANTLRLiteralEscapedCharValue.r = 0x0D; // '\r'
        CharSupport.ANTLRLiteralEscapedCharValue.t = 0x09; // '\t'
        CharSupport.ANTLRLiteralEscapedCharValue.b = 0x08; // '\b'
        CharSupport.ANTLRLiteralEscapedCharValue.f = 0x0C; // '\f'
        CharSupport.ANTLRLiteralEscapedCharValue["\\"] = 0x5C; // '\\'
        CharSupport.ANTLRLiteralEscapedCharValue[0x5C] = 0x5C;
    }
};
