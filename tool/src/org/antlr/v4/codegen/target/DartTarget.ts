/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/* eslint-disable jsdoc/require-returns, jsdoc/require-param */

import { CodeGenerator } from "../CodeGenerator.js";
import { Target } from "../Target.js";
import { HashMap, HashSet } from "antlr4ng";

export  class DartTarget extends Target {
    protected static readonly  targetCharValueEscape:  Map<Character, string>;

    protected static readonly  reservedWords = new  HashSet(java.util.Arrays.asList(
        "abstract", "dynamic", "implements", "show",
        "as", "else", "import", "static",
        "assert", "enum", "in", "super",
        "async", "export", "interface", "switch",
        "await", "extends", "is", "sync",
        "break", "external", "library", "this",
        "case", "factory", "mixin", "throw",
        "catch", "false", "new", "true",
        "class", "final", "null", "try",
        "const", "finally", "on", "typedef",
        "continue", "for", "operator", "var",
        "covariant", "Function", "part", "void",
        "default", "get", "rethrow", "while",
        "deferred", "hide", "return", "with",
        "do", "if", "set", "yield",

        "rule", "parserRule",
    ));

    public  constructor(gen: CodeGenerator) {
        super(gen);
    }

    @Override
    public override  getTargetCharValueEscape():  Map<Character, string> {
        return DartTarget.targetCharValueEscape;
    }

    @Override
    public override  getTargetStringLiteralFromANTLRStringLiteral(generator: CodeGenerator, literal: string, addQuotes: boolean,
															   escapeSpecial: boolean):  string {
        return super.getTargetStringLiteralFromANTLRStringLiteral(generator, literal, addQuotes, escapeSpecial).replace("$", "\\$");
    }

    public override  getReservedWords():  java.util.Set<string> {
        return DartTarget.reservedWords;
    }

    @Override
    public override  isATNSerializedAsInts():  boolean {
        return true;
    }

    @Override
    protected override  escapeChar(v: number):  string {
        return string.format("\\u{%X}", v);
    }
	 static {
        const  map = new  HashMap(DartTarget.defaultCharValueEscape);
        DartTarget.addEscapedChar(map, "$");
        DartTarget.targetCharValueEscape = map;
    }
}
