/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/* eslint-disable jsdoc/require-returns, jsdoc/require-param */

import { CodeGenerator } from "../CodeGenerator.js";
import { Target } from "../Target.js";
import { HashSet } from "antlr4ng";

export  class JavaTarget extends Target {

    protected static readonly  reservedWords = new  HashSet(java.util.Arrays.asList(
        "abstract", "assert", "boolean", "break", "byte", "case", "catch",
        "char", "class", "const", "continue", "default", "do", "double", "else",
        "enum", "extends", "false", "final", "finally", "float", "for", "goto",
        "if", "implements", "import", "instanceof", "int", "interface",
        "long", "native", "new", "null", "package", "private", "protected",
        "public", "return", "short", "static", "strictfp", "super", "switch",
        "synchronized", "this", "throw", "throws", "transient", "true", "try",
        "void", "volatile", "while",

		// misc
        "rule", "parserRule",
    ));
	/**
	 * The Java target can cache the code generation templates.
	 */
    private static readonly  targetTemplates = new  ThreadLocal<STGroup>();

    public  constructor(gen: CodeGenerator) {
        super(gen);
    }

    @Override
    public override  getReservedWords():  java.util.Set<string> {
        return JavaTarget.reservedWords;
    }

    @Override
    public override  getSerializedATNSegmentLimit():  number {
		// 65535 is the class file format byte limit for a UTF-8 encoded string literal
		// 3 is the maximum number of bytes it takes to encode a value in the range 0-0xFFFF
        return 65535 / 3;
    }

    @Override
    public override  isATNSerializedAsInts():  boolean {
        return false;
    }
}
