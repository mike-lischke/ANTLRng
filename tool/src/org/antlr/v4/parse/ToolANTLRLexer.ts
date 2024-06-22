/* java2ts: keep */

/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/* eslint-disable jsdoc/require-returns, jsdoc/require-param */

import type { CharStream, RecognitionException, Token } from "antlr4ng";

import { ANTLRv4Lexer } from "../../../../../../src/generated/ANTLRv4Lexer.js";
import { Tool } from "../Tool.js";
import { ErrorType } from "../tool/ErrorType.js";

export class ToolANTLRLexer extends ANTLRv4Lexer {
    public tool: Tool;

    public constructor(input: CharStream, tool: Tool) {
        super(input);
        this.tool = tool;
    }

    public displayRecognitionError(tokenNames: string[], e: RecognitionException): void {
        const msg = e.message;
        this.tool.errMgr.syntaxError(ErrorType.SYNTAX_ERROR, this.sourceName, e.offendingToken!, e, msg);
    }

    public grammarError(errorType: ErrorType, token: Token, ...args: Object[]): void {
        this.tool.errMgr.grammarError(errorType, this.sourceName, token, args);
    }
}
