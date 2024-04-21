/* java2ts: keep */

/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/* eslint-disable jsdoc/require-returns, jsdoc/require-param */

import type { RecognitionException, TokenStream } from "antlr4ng";

import { ANTLRv4Parser } from "../../../../../../src/generated/ANTLRv4Parser.js";
import { Tool } from "../Tool.js";
import { ErrorType } from "../tool/ErrorType.js";
import { v4ParserException } from "./v4ParserException.js";

/**
 * Override error handling for use with ANTLR tool itself; leaves
 *  nothing in grammar associated with Tool so others can use in IDEs, ...
 */
export class ToolANTLRParser extends ANTLRv4Parser {
    public tool: Tool;

    public constructor(input: TokenStream, tool: Tool) {
        super(input);
        this.tool = tool;
    }

    public displayRecognitionError(tokenNames: string[], e: RecognitionException): void {
        let msg = this.getParserErrorMessage(this, e);
        if (!paraphrases.isEmpty()) {
            const paraphrase = paraphrases.peek();
            msg = msg + " while " + paraphrase;
        }
        //	List stack = getRuleInvocationStack(e, this.getClass().getName());
        //	msg += ", rule stack = "+stack;
        this.tool.errMgr.syntaxError(ErrorType.SYNTAX_ERROR, this.getSourceName(), e.offendingToken, e, msg);
    }

    public getParserErrorMessage(parser: Parser, e: RecognitionException): string {
        let msg: string;
        if (e instanceof NoViableAltException) {
            const name = parser.getTokenErrorDisplay(e.token);
            msg = name + " came as a complete surprise to me";
        }
        else {
            if (e instanceof v4ParserException) {
                msg = (e).msg;
            }
            else {
                msg = parser.getErrorMessage(e, parser.getTokenNames());
            }
        }

        return msg;
    }

    public grammarError(type: ErrorType, token: Token, ...args: unknown[]): void {
        this.tool.errMgr.grammarError(type, this.getSourceName(), token, args);
    }
}
