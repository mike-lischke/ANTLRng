/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */


/* eslint-disable jsdoc/require-returns, jsdoc/require-param */


import { CodeGenerator } from "../CodeGenerator.js";
import { Target } from "../Target.js";
import { HashSet } from "antlr4ng";



export  class JavaScriptTarget extends Target {
	/** Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Lexical_grammar */
	protected static readonly  reservedWords = new  HashSet(Arrays.asList(
		"break", "case", "class", "catch", "const", "continue", "debugger",
		"default", "delete", "do", "else", "export", "extends", "finally", "for",
		"function", "if", "import", "in", "instanceof", "let", "new", "return",
		"super", "switch", "this", "throw", "try", "typeof", "var", "void",
		"while", "with", "yield",

		//future reserved
		"enum", "await", "implements", "package", "protected", "static",
		"interface", "private", "public",

		//future reserved in older standards
		"abstract", "boolean", "byte", "char", "double", "final", "float",
		"goto", "int", "long", "native", "short", "synchronized", "transient",
		"volatile",

		//literals
		"null", "true", "false",

		// misc
		"rule", "parserRule"
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
		return false;
	}

	@Override
public override  isATNSerializedAsInts():  boolean {
		return true;
	}

	@Override
protected override  getReservedWords():  Set<string> {
		return JavaScriptTarget.reservedWords;
	}
}
