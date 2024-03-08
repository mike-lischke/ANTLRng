/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */


/* eslint-disable jsdoc/require-returns, jsdoc/require-param */


import { v4ParserException } from "./v4ParserException.js";
import { ScopeParser } from "./ScopeParser.js";
import { Tool } from "../Tool.js";
import { ErrorType } from "../tool/ErrorType.js";



/** Override error handling for use with ANTLR tool itself; leaves
 *  nothing in grammar associated with Tool so others can use in IDEs, ...
 */
export  class ToolANTLRParser extends ANTLRParser {
	public  tool:  Tool;

	public  constructor(input: TokenStream, tool: Tool) {
		super(input);
		this.tool = tool;
	}

	@Override
public  displayRecognitionError(tokenNames: string[],
										e: RecognitionException):  void
	{
		let  msg = this.getParserErrorMessage(this, e);
		if ( !paraphrases.isEmpty() ) {
			let  paraphrase = paraphrases.peek();
			msg = msg+" while "+paraphrase;
		}
	//	List stack = getRuleInvocationStack(e, this.getClass().getName());
	//	msg += ", rule stack = "+stack;
		this.tool.errMgr.syntaxError(ErrorType.SYNTAX_ERROR, getSourceName(), e.token, e, msg);
	}

	public  getParserErrorMessage(parser: Parser, e: RecognitionException):  string {
		let  msg: string;
		if ( e instanceof NoViableAltException) {
			let  name = parser.getTokenErrorDisplay(e.token);
			msg = name+" came as a complete surprise to me";
		}
		else {
 if ( e instanceof v4ParserException) {
			msg = (e as v4ParserException).msg;
		}
		else {
			msg = parser.getErrorMessage(e, parser.getTokenNames());
		}
}

		return msg;
	}

	@Override
public  grammarError(etype: ErrorType, token: org.antlr.runtime.Token,... args: Object[]):  void {
		this.tool.errMgr.grammarError(etype, getSourceName(), token, ScopeParser.splitDecls.#block#.args);
	}
}
