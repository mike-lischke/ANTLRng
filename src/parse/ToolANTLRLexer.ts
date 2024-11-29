/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import type { CharStream, RecognitionException, Token } from "antlr4ng";

import { ANTLRv4Lexer } from "../generated/ANTLRv4Lexer.js";

import type { Tool } from "../Tool.js";
import { ErrorType } from "../tool/ErrorType.js";

export class ToolANTLRLexer extends ANTLRv4Lexer {
    public constructor(input: CharStream, private tool: Tool) {
        super(input);
    }

    public displayRecognitionError(tokenNames: string[], e: RecognitionException): void {
        const msg = e.message;
        this.tool.errorManager.syntaxError(ErrorType.SYNTAX_ERROR, this.sourceName, e.offendingToken!, e, msg);
    }

    public grammarError(errorType: ErrorType, token: Token, ...args: object[]): void {
        this.tool.errorManager.grammarError(errorType, this.sourceName, token, args);
    }
}
