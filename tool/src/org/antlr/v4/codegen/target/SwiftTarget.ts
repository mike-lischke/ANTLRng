/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { CodeGenerator } from "../CodeGenerator.js";
import { Target } from "../Target.js";
import { HashMap, HashSet } from "antlr4ng";

export class SwiftTarget extends Target {
    protected static readonly targetCharValueEscape: Map<Character, string>;

    protected static readonly reservedWords = new HashSet(Arrays.asList(
        "associatedtype", "class", "deinit", "enum", "extension", "func", "import", "init", "inout", "internal",
        "let", "operator", "private", "protocol", "public", "static", "struct", "subscript", "typealias", "var",
        "break", "case", "continue", "default", "defer", "do", "else", "fallthrough", "for", "guard", "if",
        "in", "repeat", "return", "switch", "where", "while",
        "as", "catch", "dynamicType", "false", "is", "nil", "rethrows", "super", "self", "Self", "throw", "throws",
        "true", "try", "__COLUMN__", "__FILE__", "__FUNCTION__", "__LINE__", "#column", "#file", "#function", "#line", "_", "#available", "#else", "#elseif", "#endif", "#if", "#selector",
        "associativity", "convenience", "dynamic", "didSet", "final", "get", "infix", "indirect", "lazy",
        "left", "mutating", "none", "nonmutating", "optional", "override", "postfix", "precedence",
        "prefix", "Protocol", "required", "right", "set", "Type", "unowned", "weak", "willSet",

        "rule", "parserRule",
    ));

    public constructor(gen: CodeGenerator) {
        super(gen);
    }

    @Override
    public override  getTargetCharValueEscape(): Map<Character, string> {
        return SwiftTarget.targetCharValueEscape;
    }

    @Override
    protected override  getReservedWords(): Set<string> {
        return SwiftTarget.reservedWords;
    }

    @Override
    protected override  escapeWord(word: string): string {
        return "`" + word + "`";
    }

    @Override
    protected override  escapeChar(v: number): string {
        return string.format("\\u{%X}", v);
    }

    static {
        // https://docs.swift.org/swift-book/LanguageGuide/StringsAndCharacters.html
        const map = new HashMap();
        SwiftTarget.addEscapedChar(map, "\0", "0");
        SwiftTarget.addEscapedChar(map, "\\");
        SwiftTarget.addEscapedChar(map, "\t", "t");
        SwiftTarget.addEscapedChar(map, "\n", "n");
        SwiftTarget.addEscapedChar(map, "\r", "r");
        SwiftTarget.addEscapedChar(map, '\"');
        SwiftTarget.addEscapedChar(map, "'");
        SwiftTarget.targetCharValueEscape = map;
    }
}
