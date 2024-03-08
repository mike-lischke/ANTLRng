/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */


/* eslint-disable jsdoc/require-returns, jsdoc/require-param */


import { ScopeParser } from "./ScopeParser.js";
import { Tool } from "../Tool.js";
import { ErrorType } from "../tool/ErrorType.js";



export  class ToolANTLRLexer extends ANTLRLexer {
	public  tool:  Tool;

	public  constructor(input: CharStream, tool: Tool) {
		super(input);
		this.tool = tool;
	}

	@Override
public  displayRecognitionError(tokenNames: string[], e: RecognitionException):  void {
		let  msg = getErrorMessage(e, tokenNames);
		this.tool.errMgr.syntaxError(ErrorType.SYNTAX_ERROR, getSourceName(), e.token, e, msg);
	}

	@Override
public  grammarError(etype: ErrorType, token: Token,... args: Object[]):  void {
		this.tool.errMgr.grammarError(etype, getSourceName(), token, ScopeParser.splitDecls.#block#.args);
	}
}
