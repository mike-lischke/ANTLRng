/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { CodeGenerator } from "../CodeGenerator.js";
import { Target } from "../Target.js";
import { HashSet, HashMap } from "antlr4ng";

export class CSharpTarget extends Target {
    protected static readonly reservedWords = new HashSet(java.util.Arrays.asList(
        "abstract",
        "as",
        "base",
        "bool",
        "break",
        "byte",
        "case",
        "catch",
        "char",
        "checked",
        "class",
        "const",
        "continue",
        "decimal",
        "default",
        "delegate",
        "do",
        "double",
        "else",
        "enum",
        "event",
        "explicit",
        "extern",
        "false",
        "finally",
        "fixed",
        "float",
        "for",
        "foreach",
        "goto",
        "if",
        "implicit",
        "in",
        "int",
        "interface",
        "internal",
        "is",
        "lock",
        "long",
        "namespace",
        "new",
        "null",
        "object",
        "operator",
        "out",
        "override",
        "params",
        "private",
        "protected",
        "public",
        "readonly",
        "ref",
        "return",
        "sbyte",
        "sealed",
        "short",
        "sizeof",
        "stackalloc",
        "static",
        "string",
        "struct",
        "switch",
        "this",
        "throw",
        "true",
        "try",
        "typeof",
        "uint",
        "ulong",
        "unchecked",
        "unsafe",
        "ushort",
        "using",
        "virtual",
        "values",
        "void",
        "volatile",
        "while",
    ));

    protected static readonly targetCharValueEscape: Map<Character, string>;

    public constructor(gen: CodeGenerator) {
        super(gen);
    }

    @Override
    public override  getTargetCharValueEscape(): Map<Character, string> {
        return CSharpTarget.targetCharValueEscape;
    }

    @Override
    public override  isATNSerializedAsInts(): boolean {
        return true;
    }

    @Override
    protected override  getReservedWords(): java.util.Set<string> {
        return CSharpTarget.reservedWords;
    }

    @Override
    protected override  escapeWord(word: string): string {
        return "@" + word;
    }

    @Override
    protected override  escapeChar(v: number): string {
        return string.format("\\x%X", v);
    }
    static {
        // https://docs.microsoft.com/en-us/dotnet/csharp/programming-guide/strings/#string-escape-sequences
        const map = new HashMap();
        CSharpTarget.addEscapedChar(map, "'");
        CSharpTarget.addEscapedChar(map, '\"');
        CSharpTarget.addEscapedChar(map, "\\");
        CSharpTarget.addEscapedChar(map, "\0", "0");
        CSharpTarget.addEscapedChar(map, Number(0x0007), "a");
        CSharpTarget.addEscapedChar(map, Number(0x0008), "b");
        CSharpTarget.addEscapedChar(map, "\f", "f");
        CSharpTarget.addEscapedChar(map, "\n", "n");
        CSharpTarget.addEscapedChar(map, "\r", "r");
        CSharpTarget.addEscapedChar(map, "\t", "t");
        CSharpTarget.addEscapedChar(map, Number(0x000B), "v");
        CSharpTarget.targetCharValueEscape = map;
    }
}
