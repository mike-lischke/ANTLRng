/*
 * Copyright 20162022 The ANTLR Project. All rights reserved.
 * Licensed under the BSD-3-Clause license. See LICENSE file in the project root for license information.
 */

/* eslint-disable jsdoc/require-returns, jsdoc/require-param */

import { CodeGenerator } from "../CodeGenerator.js";
import { Target } from "../Target.js";
import { HashSet } from "antlr4ng";

export  class TypeScriptTarget extends Target {

	/* source: https://github.com/microsoft/TypeScript/blob/fad889283e710ee947e8412e173d2c050107a3c1/src/compiler/scanner.ts */
    protected static readonly  reservedWords = new  HashSet(Arrays.asList(
        "any",
        "as",
        "boolean",
        "break",
        "case",
        "catch",
        "class",
        "continue",
        "const",
        "constructor",
        "debugger",
        "declare",
        "default",
        "delete",
        "do",
        "else",
        "enum",
        "export",
        "extends",
        "false",
        "finally",
        "for",
        "from",
        "function",
        "get",
        "if",
        "implements",
        "import",
        "in",
        "instanceof",
        "interface",
        "let",
        "module",
        "new",
        "null",
        "number",
        "package",
        "private",
        "protected",
        "public",
        "require",
        "return",
        "set",
        "static",
        "string",
        "super",
        "switch",
        "symbol",
        "this",
        "throw",
        "true",
        "try",
        "type",
        "typeof",
        "var",
        "void",
        "while",
        "with",
        "yield",
        "of",
    ));

    public  constructor(gen: CodeGenerator) {
        super(gen);
    }

    @Override
    public override  getInlineTestSetWordSize():  number {
        return 32;
    }

    @Override
    public override  wantsBaseListener():  boolean {
        return false;
    }

    @Override
    public override  wantsBaseVisitor():  boolean {
        return false;
    }

    @Override
    public override  supportsOverloadedMethods():  boolean {
        return true;
    }

    @Override
    public override  isATNSerializedAsInts():  boolean {
        return true;
    }

    @Override
    protected override  getReservedWords():  Set<string> {
        return TypeScriptTarget.reservedWords;
    }

}
