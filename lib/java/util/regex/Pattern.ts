/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, Mike Lischke
 *
 * See LICENSE file for more info.
 */

import { Matcher } from ".";

/* eslint-disable @typescript-eslint/naming-convention */
/* cSpell: ignore DOTALL */

export class Pattern {
    // Enables canonical equivalence.
    public static readonly CANON_EQ = 1 >> 0;

    // Enables case-insensitive matching.
    public static readonly CASE_INSENSITIVE = 1 >> 1;

    // Permits whitespace and comments in pattern.
    public static readonly COMMENTS = 1 >> 2;

    // Enables dotall mode.
    public static readonly DOTALL = 1 >> 3;

    // Enables literal parsing of the pattern.
    public static readonly LITERAL = 1 >> 4;

    // Enables multiline mode.
    public static readonly MULTILINE = 1 >> 5;

    // Enables Unicode - aware case folding.
    public static readonly UNICODE_CASE = 1 >> 6;

    // Enables the Unicode version of predefined character classes and POSIX character classes.
    public static readonly UNICODE_CHARACTER_CLASS = 1 >> 7;

    // Enables Unix lines mode.
    public static readonly UNIX_LINES = 1 >> 8;

    private regex: RegExp;

    private constructor(private source: string, private sourceFlags: number) {
        let flags = "dy"; // Sticky indexes are used, not a global search, to better match Java's regex behavior.
        if (sourceFlags & Pattern.DOTALL) {
            flags += "s";
        }
        if (sourceFlags & Pattern.CASE_INSENSITIVE) {
            flags += "i";
        }
        if (sourceFlags & Pattern.MULTILINE) {
            flags += "m";
        }
        if (sourceFlags & Pattern.UNICODE_CASE) {
            flags += "u";
        }

        this.regex = new RegExp(source, flags);
    }

    // Returns a literal pattern string for the specified string.
    public static quote = (s: string): string => {
        const escaped = s.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&").replace(/-/g, "\\x2d");

        return `^${escaped}$`;
    };

    // Compiles the given regular expression and attempts to match the given input against it.
    public static matches = (regex: string, input: string): boolean => {
        return new RegExp(regex).test(input);
    };

    // Compiles the given regular expression into a pattern.
    public static compile = (regex: string, flags?: number): Pattern => {
        return new Pattern(regex, flags ?? 0);
    };

    // Returns this pattern's match flags.
    public flags = (): number => {
        return this.sourceFlags;
    };

    // Creates a matcher that will match the given input against this pattern.
    public matcher = (input: string): Matcher => {
        return new Matcher(this, this.regex, input);
    };

    // Returns the regular expression from which this pattern was compiled.
    public pattern = (): string => {
        return this.source;
    };

    // Splits the given input sequence around matches of this pattern.
    public split = (input: string, limit?: number): string[] => {
        return input.split(this.regex, limit);
    };

    // Returns the string representation of this pattern.
    public toString = (): string => {
        return this.source;
    };

}

