/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/* eslint-disable jsdoc/require-returns, jsdoc/require-param */

import { CodeGenerator } from "../CodeGenerator.js";
import { Target } from "../Target.js";
import { HashSet, HashMap } from "antlr4ng";

export  class PHPTarget extends Target {
    protected static readonly  reservedWords = new  HashSet(java.util.Arrays.asList(
        "abstract", "and", "array", "as",
        "break",
        "callable", "case", "catch", "class", "clone", "const", "continue",
        "declare", "default", "die", "do",
        "echo", "else", "elseif", "empty", "enddeclare", "endfor", "endforeach",
        "endif", "endswitch", "endwhile", "eval", "exit", "extends",
        "final", "finally", "for", "foreach", "function",
        "global", "goto",
        "if", "implements", "include", "include_once", "instanceof", "insteadof", "interface", "isset",
        "list",
        "namespace", "new",
        "or",
        "print", "private", "protected", "public",
        "require", "require_once", "return",
        "static", "switch",
        "throw", "trait", "try",
        "unset", "use",
        "var",
        "while",
        "xor",
        "yield",
        "__halt_compiler", "__CLASS__", "__DIR__", "__FILE__", "__FUNCTION__",
        "__LINE__", "__METHOD__", "__NAMESPACE__", "__TRAIT__",

		// misc
        "rule", "parserRule",
    ));

    protected static readonly  targetCharValueEscape:  Map<Character, string>;

    public  constructor(gen: CodeGenerator) {
        super(gen);
    }

    @Override
    public override  getTargetCharValueEscape():  Map<Character, string> {
        return PHPTarget.targetCharValueEscape;
    }

    @Override
    public override  supportsOverloadedMethods():  boolean {
        return false;
    }

    @Override
    public override  getTargetStringLiteralFromANTLRStringLiteral(generator: CodeGenerator, literal: string, addQuotes: boolean,
															   escapeSpecial: boolean):  string {
        let  targetStringLiteral = super.getTargetStringLiteralFromANTLRStringLiteral(generator, literal, addQuotes, escapeSpecial);
        targetStringLiteral = targetStringLiteral.replace("$", "\\$");

        return targetStringLiteral;
    }

    @Override
    public override  isATNSerializedAsInts():  boolean {
        return true;
    }

    @Override
    protected override  getReservedWords():  java.util.Set<string> {
        return PHPTarget.reservedWords;
    }

    @Override
    protected override  escapeChar(v: number):  string {
        return string.format("\\u{%X}", v);
    }
	 static {
		// https://www.php.net/manual/en/language.types.string.php
        const  map = new  HashMap();
        PHPTarget.addEscapedChar(map, "\n", "n");
        PHPTarget.addEscapedChar(map, "\r", "r");
        PHPTarget.addEscapedChar(map, "\t", "t");
        PHPTarget.addEscapedChar(map, Number(0x000B), "v");
        PHPTarget.addEscapedChar(map, Number(0x001B), "e");
        PHPTarget.addEscapedChar(map, "\f", "f");
        PHPTarget.addEscapedChar(map, "\\");
        PHPTarget.addEscapedChar(map, "$");
        PHPTarget.addEscapedChar(map, '\"');
        PHPTarget.targetCharValueEscape = map;
    }
}
