/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import type { IntervalSet } from "antlr4ng";

import { propertyAliases, propertyCodePointRanges } from "../../../../../../src/generated/UnicodeData.js";

/**
 * Determines the Unicode codepoint range for a given Unicode attribute.
 *
 * @param propertyCodeOrAlias The code to look up. Two forms are supported:
 *
 * 1. A simple identifier, which is looked up in all available enumerations (general categories, binary properties,
 *   scripts, blocks). General categories can be abbreviated (e.g. "Lu" for "Uppercase_Letter").
 * 2. An key/value pair (e.g. "General_Category=Uppercase_Letter", "Script=Latin", bidi_class=Arabic_letter etc.),
 *    which limits the search to the given enumeration.
 *
 * Unicode blocks haven a few more options. The code type "block" can also be written as "blk" (e.g. "blk=Basic_Latin").
 *
 * Unicode property names are not case sensitive and the letters "_" and "-" can be used interchangeably.
 *
 * @returns the {@link IntervalSet} of Unicode code point ranges which have that property.
 */
export const getPropertyCodePoints = (propertyCodeOrAlias: string): IntervalSet | undefined => {
    propertyCodeOrAlias = propertyCodeOrAlias.toLowerCase().replace("-", "_");
    let result = propertyCodePointRanges.get(propertyCodeOrAlias);
    if (!result) {
        const propertyCode = propertyAliases.get(propertyCodeOrAlias);
        if (propertyCode) {
            result = propertyCodePointRanges.get(propertyCode);
        }
    }

    return result;
};

// ## Unicode data extracted from Unicode 15.1.0 ##
