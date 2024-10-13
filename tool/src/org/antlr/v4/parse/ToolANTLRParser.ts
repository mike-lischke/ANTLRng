/* java2ts: keep */

/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { NoViableAltException, type Parser, type RecognitionException, type Token, type TokenStream } from "antlr4ng";

import { ANTLRv4Parser } from "../../../../../../src/generated/ANTLRv4Parser.js";
import { Tool } from "../Tool.js";
import { ErrorType } from "../tool/ErrorType.js";

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
        const msg = this.getParserErrorMessage(this, e);
        this.tool.errMgr.syntaxError(ErrorType.SYNTAX_ERROR, this.getSourceName(), e.offendingToken!, e, [msg]);
    }

    public getParserErrorMessage(parser: Parser, e: RecognitionException): string {
        let msg: string;
        if (e instanceof NoViableAltException) {
            msg = e.message + " came as a complete surprise to me";
        } else {
            msg = e.message;
        }

        return msg;
    }

    public grammarError(type: ErrorType, token: Token, ...args: unknown[]): void {
        this.tool.errMgr.grammarError(type, this.getSourceName(), token, args);
    }
}
