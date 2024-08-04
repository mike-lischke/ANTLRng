/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import type { IntervalSet } from "antlr4ng";

/** A mapping from category abbreviations to their long name. */
const abbreviationToLong = new Map<string, string>([
    ["Lu", "Uppercase_Letter"],
    ["Ll", "Lowercase_Letter"],
    ["Lt", "Titlecase_Letter"],
    ["LC", "Cased_Letter"],
    ["Lm", "Modifier_Letter"],
    ["Lo", "Other_Letter"],
    ["L", "Letter"],
    ["Mn", "Nonspacing_Mark"],
    ["Mc", "Spacing_Mark"],
    ["Me", "Enclosing_Mark"],
    ["M", "Mark"],
    ["Nd", "Decimal_Number"],
    ["Nl", "Letter_Number"],
    ["No", "Other_Number"],
    ["N", "Number"],
    ["Pc", "Connector_Punctuation"],
    ["Pd", "Dash_Punctuation"],
    ["Ps", "Open_Punctuation"],
    ["Pe", "Close_Punctuation"],
    ["Pi", "Initial_Punctuation"],
    ["Pf", "Final_Punctuation"],
    ["Po", "Other_Punctuation"],
    ["P", "Punctuation"],
    ["Sm", "Math_Symbol"],
    ["Sc", "Currency_Symbol"],
    ["Sk", "Modifier_Symbol"],
    ["So", "Other_Symbol"],
    ["S", "Symbol"],
    ["Zs", "Space_Separator"],
    ["Zl", "Line_Separator"],
    ["Zp", "Paragraph_Separator"],
    ["Z", "Separator"],
    ["Cc", "Control"],
    ["Cf", "Format"],
    ["Cs", "Surrogate"],
    ["Co", "Private_Use"],
    ["Cn", "Unassigned"],
    ["C", "Other"],
]);

const longToAbbreviation = new Map<string, string>([
    ["Uppercase_Letter", "Lu"],
    ["Lowercase_Letter", "Ll"],
    ["Titlecase_Letter", "Lt"],
    ["Cased_Letter", "LC"],
    ["Modifier_Letter", "Lm"],
    ["Other_Letter", "Lo"],
    ["Letter", "L"],
    ["Nonspacing_Mark", "Mn"],
    ["Spacing_Mark", "Mc"],
    ["Enclosing_Mark", "Me"],
    ["Mark", "M"],
    ["Decimal_Number", "Nd"],
    ["Letter_Number", "Nl"],
    ["Other_Number", "No"],
    ["Number", "N"],
    ["Connector_Punctuation", "Pc"],
    ["Dash_Punctuation", "Pd"],
    ["Open_Punctuation", "Ps"],
    ["Close_Punctuation", "Pe"],
    ["Initial_Punctuation", "Pi"],
    ["Final_Punctuation", "Pf"],
    ["Other_Punctuation", "Po"],
    ["Punctuation", "P"],
    ["Math_Symbol", "Sm"],
    ["Currency_Symbol", "Sc"],
    ["Modifier_Symbol", "Sk"],
    ["Other_Symbol", "So"],
    ["Symbol", "S"],
    ["Space_Separator", "Zs"],
    ["Line_Separator", "Zl"],
    ["Paragraph_Separator", "Zp"],
    ["Separator", "Z"],
    ["Control", "Cc"],
    ["Format", "Cf"],
    ["Surrogate", "Cs"],
    ["Private_Use", "Co"],
    ["Unassigned", "Cn"],
    ["Other", "C"],
]);

/**
 * @param abbreviation The Unicode category abbreviation to look up.
 *
 * @returns the long name for a short Unicode category specifier.
 */
export const categoryShortToLong = (abbreviation: string): string | undefined => {
    return abbreviationToLong.get(abbreviation);
};

/**
 * @param longName The Unicode category long name to look up.
 *
 * @returns the short name for a long Unicode category specifier.
 */
export const categoryLongToShort = (longName: string): string | undefined => {
    return longToAbbreviation.get(longName);
};

/**
 * Determines the Unicode codepoint range for a given Unicode attribute.
 *
 * @param propertyCodeOrAlias The attribute to look up. That can be:
 * - a Unicode general category code (e.g. "Lu", "Nd", "Decimal_Number", etc.)
 * - a Unicode binary property name (e.g. "ASCII", "Alphabetic", "White_Space", etc.)
 * - a Unicode script name (e.g. "Latin", "Greek", "Han", etc.)
 * - a Unicode block name (e.g. "Basic_Latin", "Greek_And_Coptic", "CJK_Unified_Ideographs", etc.)
 *
 * @returns the {@link IntervalSet} of Unicode code point ranges which have that property.
 */
export const getPropertyCodePoints = (propertyCodeOrAlias: string): IntervalSet | undefined => {
    propertyCodeOrAlias = propertyCodeOrAlias.toLowerCase().replace("-", "_");
    let result = propertyCodePointRanges.get(propertyCodeOrAlias);
    if (!result) {
        const propertyCode = propertyAliases.get(propertyCodeOrAlias);
        result = propertyCodePointRanges.get(propertyCode);
    }

    return result;
};

// ## Unicode data extracted from Unicode 15.1.0 ##
