/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */


import { format } from "../../misc/helpers.js";
import { CodeGenerator } from "../CodeGenerator.js";
import { Target, type char } from "../Target.js";

export class DartTarget extends Target {
    protected static readonly targetCharValueEscape = new Map<char, string>([
        [0x24, "$"],
    ]);

    protected static readonly reservedWords = new Set([
        "abstract", "dynamic", "implements", "show", "as", "else", "import", "static", "assert", "enum", "in", "super",
        "async", "export", "interface", "switch", "await", "extends", "is", "sync", "break", "external", "library",
        "this", "case", "factory", "mixin", "throw", "catch", "false", "new", "true", "class", "final", "null", "try",
        "const", "finally", "on", "typedef", "continue", "for", "operator", "var", "covariant", "Function", "part",
        "void", "default", "get", "rethrow", "while", "deferred", "hide", "return", "with", "do", "if", "set", "yield",
        "rule", "parserRule",
    ]);

    public constructor(gen: CodeGenerator) {
        super(gen);
    }


    public override  getTargetCharValueEscape(): Map<char, string> {
        return DartTarget.targetCharValueEscape;
    }


    public override  getTargetStringLiteralFromANTLRStringLiteral(generator: CodeGenerator, literal: string,
        addQuotes: boolean, escapeSpecial: boolean): string {
        return super.getTargetStringLiteralFromANTLRStringLiteral(generator, literal, addQuotes, escapeSpecial)
            .replace("$", "\\$");
    }

    public override  get reservedWords(): Set<string> {
        return DartTarget.reservedWords;
    }


    public override  isATNSerializedAsInts(): boolean {
        return true;
    }


    protected override  escapeChar(v: number): string {
        return format("\\u{%X}", v);
    }
}
