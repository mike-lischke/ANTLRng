/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/* eslint-disable jsdoc/require-returns, jsdoc/require-param */

import { CodeGenerator } from "../CodeGenerator.js";
import { Target } from "../Target.js";
import { HashSet, HashMap } from "antlr4ng";

export  class Python3Target extends Target {
    protected static readonly  reservedWords = new  HashSet(java.util.Arrays.asList(
        "abs", "all", "and", "any", "apply", "as", "assert",
        "bin", "bool", "break", "buffer", "bytearray",
        "callable", "chr", "class", "classmethod", "coerce", "compile", "complex", "continue",
        "def", "del", "delattr", "dict", "dir", "divmod",
        "elif", "else", "enumerate", "eval", "execfile", "except",
        "file", "filter", "finally", "float", "for", "format", "from", "frozenset",
        "getattr", "global", "globals",
        "hasattr", "hash", "help", "hex",
        "id", "if", "import", "in", "input", "int", "intern", "is", "isinstance", "issubclass", "iter",
        "lambda", "len", "list", "locals",
        "map", "max", "min", "memoryview",
        "next", "nonlocal", "not",
        "object", "oct", "open", "or", "ord",
        "pass", "pow", "print", "property",
        "raise", "range", "raw_input", "reduce", "reload", "repr", "return", "reversed", "round",
        "set", "setattr", "slice", "sorted", "staticmethod", "str", "sum", "super",
        "try", "tuple", "type",
        "unichr", "unicode",
        "vars",
        "with", "while",
        "yield",
        "zip",
        "__import__",
        "True", "False", "None",

		// misc
        "rule", "parserRule",
    ));

    protected static readonly  targetCharValueEscape:  Map<Character, string>;

    public  constructor(gen: CodeGenerator) {
        super(gen);
    }

    @Override
    public override  getTargetCharValueEscape():  Map<Character, string> {
        return Python3Target.targetCharValueEscape;
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
        return false;
    }

    @Override
    protected override  getReservedWords():  java.util.Set<string> {
        return Python3Target.reservedWords;
    }
	 static {
		// https://docs.python.org/3/reference/lexical_analysis.html#string-and-bytes-literals
        const  map = new  HashMap();
        Python3Target.addEscapedChar(map, "\\");
        Python3Target.addEscapedChar(map, "'");
        Python3Target.addEscapedChar(map, '\"');
        Python3Target.addEscapedChar(map, Number(0x0007), "a");
        Python3Target.addEscapedChar(map, Number(0x0008), "b");
        Python3Target.addEscapedChar(map, "\f", "f");
        Python3Target.addEscapedChar(map, "\n", "n");
        Python3Target.addEscapedChar(map, "\r", "r");
        Python3Target.addEscapedChar(map, "\t", "t");
        Python3Target.addEscapedChar(map, Number(0x000B), "v");
        Python3Target.targetCharValueEscape = map;
    }
}
