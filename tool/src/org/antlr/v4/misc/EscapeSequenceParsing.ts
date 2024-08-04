/* java2ts: keep */

/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/* eslint-disable jsdoc/require-returns, jsdoc/require-param */

import { IntervalSet } from "antlr4ng";

import { Character } from "../support/Character.js";
import { CharSupport } from "./CharSupport.js";

export enum ResultType {
    Invalid,
    CodePoint,
    Property
};

export interface EscapeParsingResult {
    type: ResultType;
    codePoint: number;
    propertyIntervalSet: IntervalSet;
    startOffset: number;
    parseLength: number;
}

/**
 * Utility class to parse escapes like:
 *   \\n
 *   \\uABCD
 *   \\u{10ABCD}
 *   \\p{Foo}
 *   \\P{Bar}
 *   \\p{Baz=Bez}
 *   \\P{Baz=Bez}
 */
export abstract class EscapeSequenceParsing {
    static #emptySet = IntervalSet.of(-1, -1);
    static #fullSet = IntervalSet.of(Character.MIN_CODE_POINT, Character.MAX_CODE_POINT);

    /**
     * Parses a single escape sequence starting at {@code startOff}.
     *
     * @returns a type of INVALID if no valid escape sequence was found, a Result otherwise.
     */
    public static parseEscape(s: string, startOff: number): EscapeParsingResult {
        let offset = startOff;
        if (offset + 2 > s.length || s.codePointAt(offset) !== 0x5C) { // backslash
            return EscapeSequenceParsing.invalid(startOff, s.length - 1);
        }

        // Move past backslash
        offset++;
        const escaped = s.codePointAt(offset)!;

        // Move past escaped code point
        offset += Character.charCount(escaped);
        if (escaped === 0x75) { // 'u'
            // \\u{1} is the shortest we support
            if (offset + 3 > s.length) {
                return EscapeSequenceParsing.invalid(startOff, s.length - 1);
            }

            let hexStartOffset: number;
            let hexEndOffset: number; // appears to be exclusive
            if (s.codePointAt(offset) === 0x7B) { // '{'
                hexStartOffset = offset + 1;
                hexEndOffset = s.indexOf("}", hexStartOffset);
                if (hexEndOffset === -1) {
                    return EscapeSequenceParsing.invalid(startOff, s.length - 1);
                }
                offset = hexEndOffset + 1;
            } else {
                if (offset + 4 > s.length) {
                    return EscapeSequenceParsing.invalid(startOff, s.length - 1);
                }
                hexStartOffset = offset;
                hexEndOffset = offset + 4;
                offset = hexEndOffset;
            }

            const codePointValue = CharSupport.parseHexValue(s, hexStartOffset, hexEndOffset);
            if (codePointValue === -1 || codePointValue > Character.MAX_CODE_POINT) {
                return EscapeSequenceParsing.invalid(startOff, startOff + 6 - 1);
            }

            return {
                type: ResultType.CodePoint,
                codePoint: codePointValue,
                propertyIntervalSet: EscapeSequenceParsing.#emptySet,
                startOffset: startOff,
                parseLength: offset - startOff,
            };
        } else {
            if (escaped === 0x70 || escaped === 0x50) { // 'p' or 'P'
                // \p{L} is the shortest we support
                if (offset + 3 > s.length) {
                    return EscapeSequenceParsing.invalid(startOff, s.length - 1);
                }

                if (s.codePointAt(offset) !== 0x7B) { // '{'
                    return EscapeSequenceParsing.invalid(startOff, offset);
                }

                const openBraceOffset = offset;
                const closeBraceOffset = s.indexOf("}", openBraceOffset);
                if (closeBraceOffset === -1) {
                    return EscapeSequenceParsing.invalid(startOff, s.length - 1);
                }

                const propertyName = s.substring(openBraceOffset + 1, closeBraceOffset);
                let propertyIntervalSet = UnicodeData.getPropertyCodePoints(propertyName);
                if (propertyIntervalSet === null || propertyIntervalSet.isNil()) {
                    return EscapeSequenceParsing.invalid(startOff, closeBraceOffset);
                }

                offset = closeBraceOffset + 1;
                if (escaped === 0x50) { // 'P'
                    propertyIntervalSet = propertyIntervalSet.complementWithVocabulary(EscapeSequenceParsing.#fullSet);
                }

                return {
                    type: ResultType.Property,
                    codePoint: -1,
                    propertyIntervalSet,
                    startOffset: startOff,
                    parseLength: offset - startOff,
                };
            } else {
                if (escaped < CharSupport.ANTLRLiteralEscapedCharValue.length) {
                    let codePoint = CharSupport.ANTLRLiteralEscapedCharValue[escaped];
                    if (codePoint === 0) {
                        if (escaped !== 0x5D && escaped !== 0x2D) { // escape ']' and '-' only in char sets.
                            return EscapeSequenceParsing.invalid(startOff, startOff + 1);
                        } else {
                            codePoint = escaped;
                        }
                    }

                    return {
                        type: ResultType.CodePoint,
                        codePoint,
                        propertyIntervalSet: EscapeSequenceParsing.#emptySet,
                        startOffset: startOff,
                        parseLength: offset - startOff,
                    };
                } else {
                    return EscapeSequenceParsing.invalid(startOff, s.length - 1);
                }
            }
        }
    }

    private static invalid(start: number, stop: number): EscapeParsingResult { // start..stop is inclusive
        return {
            type: ResultType.Invalid,
            codePoint: 0,
            propertyIntervalSet: EscapeSequenceParsing.#emptySet,
            startOffset: start,
            parseLength: stop - start + 1,
        };
    }
}
