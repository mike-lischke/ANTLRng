/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

// cspell: ignore ahex inpc insc

import type { IntervalSet } from "antlr4ng";

import {
    propertyAliases, propertyCodePointRanges, shortToLongPropertyNameMap, shortToLongPropertyValueMap
} from "../generated/UnicodeData.js";

/**
 * Determines the Unicode codepoint range for a given Unicode attribute.
 *
 * @param propertyCodeOrAlias The code to look up. Two forms are supported:
 *
 * 1. A simple identifier, which is looked up in all available enumerations (general categories, binary properties,
 *   scripts, blocks). All property names can be specified in full or abbreviated form.
 * 2. A key/value pair (e.g. "General_Category=Uppercase_Letter", "Script=Latin", bidi_class=Arabic_letter etc.),
 *    which limits the search to the given enumeration.
 *
 * Unicode property names are not case sensitive and the letters "_" and "-" can be used interchangeably, but
 * don't add any whitespace around the "=" sign.
 *
 * @returns the {@link IntervalSet} of Unicode code point ranges which have that property.
 */
export const getPropertyCodePoints = (propertyCodeOrAlias: string): IntervalSet | undefined => {
    propertyCodeOrAlias = propertyCodeOrAlias.toLowerCase().replace("-", "_");

    // Try first directly as a property specifier. This will find the full form (e.g. "line_break=alphabetic").
    let result = propertyCodePointRanges.get(propertyCodeOrAlias);
    if (result) {
        return result;
    }

    // Next try to find the property by alias. This will handle cases without property names
    // (e.g. "alphabetic" or "al").
    const parts = propertyCodeOrAlias.split("=");
    if (parts.length === 1) {
        const value = shortToLongPropertyValueMap.get(propertyCodeOrAlias) ?? propertyCodeOrAlias;
        const alias = propertyAliases.get(value);
        if (alias) {
            result = propertyCodePointRanges.get(alias);

            return result;
        }
    }

    if (parts.length === 2) {
        const propertyName = shortToLongPropertyNameMap.get(parts[0]) ?? parts[0];
        const propertyValue = shortToLongPropertyValueMap.get(parts[1]) ?? parts[1];

        result = propertyCodePointRanges.get(`${propertyName}=${propertyValue}`);
    }

    return result;
};

// ## Unicode data extracted from Unicode 15.1.0 ##
