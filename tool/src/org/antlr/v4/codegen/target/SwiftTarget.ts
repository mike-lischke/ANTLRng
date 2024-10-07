/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

// cspell: ignore associatedtype deinit typealias nonmutating

import { format } from "../../misc/helpers.js";
import { Target, type char } from "../Target.js";

export class SwiftTarget extends Target {
    // https://docs.swift.org/swift-book/LanguageGuide/StringsAndCharacters.html
    protected static readonly targetCharValueEscape = new Map<number, string>([
        [0, "0"],
        [0x5C, "\\"],
        [0x09, "t"],
        [0x0A, "n"],
        [0x0D, "r"],
        [0x22, "\""],
        [0x27, "'"],
    ]);

    protected static readonly reservedWords = new Set([
        "associatedtype", "class", "deinit", "enum", "extension", "func", "import", "init", "inout", "internal",
        "let", "operator", "private", "protocol", "public", "static", "struct", "subscript", "typealias", "var",
        "break", "case", "continue", "default", "defer", "do", "else", "fallthrough", "for", "guard", "if",
        "in", "repeat", "return", "switch", "where", "while",
        "as", "catch", "dynamicType", "false", "is", "nil", "rethrows", "super", "self", "Self", "throw", "throws",
        "true", "try", "__COLUMN__", "__FILE__", "__FUNCTION__", "__LINE__", "#column", "#file", "#function", "#line",
        "_", "#available", "#else", "#elseif", "#endif", "#if", "#selector",
        "associativity", "convenience", "dynamic", "didSet", "final", "get", "infix", "indirect", "lazy",
        "left", "mutating", "none", "nonmutating", "optional", "override", "postfix", "precedence",
        "prefix", "Protocol", "required", "right", "set", "Type", "unowned", "weak", "willSet",

        "rule", "parserRule",
    ]);

    public override  getTargetCharValueEscape(): Map<char, string> {
        return SwiftTarget.targetCharValueEscape;
    }

    protected override  get reservedWords(): Set<string> {
        return SwiftTarget.reservedWords;
    }

    protected override  escapeWord(word: string): string {
        return "`" + word + "`";
    }

    protected override  escapeChar(v: number): string {
        return format("\\u{%X}", v);
    }
}
