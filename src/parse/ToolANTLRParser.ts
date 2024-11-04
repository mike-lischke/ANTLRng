/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

// cspell: ignore RULEMODIFIERS

import { NoViableAltException, type Parser, type RecognitionException, type Token, type TokenStream } from "antlr4ng";

import { ANTLRv4Parser } from "../generated/ANTLRv4Parser.js";
import { Tool } from "../Tool.js";
import { ErrorManager } from "../tool/ErrorManager.js";
import { ErrorType } from "../tool/ErrorType.js";

/**
 * Override error handling for use with ANTLR tool itself; leaves
 *  nothing in grammar associated with Tool so others can use in IDEs, ...
 */
export class ToolANTLRParser extends ANTLRv4Parser {
    // Below are a number of pseudo token values, for converting a parse tree to an AST.
    public static readonly RULES = -5;
    public static readonly RULE = -6;
    public static readonly BLOCK = -7;
    public static readonly ALT = -8;
    public static readonly EPSILON = -9;
    public static readonly ELEMENT_OPTIONS = -10;
    public static readonly ARG_ACTION = -11;
    public static readonly ACTION = -12;
    public static readonly RULEMODIFIERS = -13;
    public static readonly LEXER_ALT_ACTION = -14;
    public static readonly LEXER_ACTION_CALL = -15;
    public static readonly SET = -16;
    public static readonly OPTIONAL = -17;
    public static readonly PREDICATE_OPTIONS = -18;

    public tool: Tool;

    public constructor(input: TokenStream, tool: Tool) {
        super(input);
        this.tool = tool;
    }

    public displayRecognitionError(tokenNames: string[], e: RecognitionException): void {
        const msg = this.getParserErrorMessage(this, e);
        ErrorManager.get().syntaxError(ErrorType.SYNTAX_ERROR, this.getSourceName(), e.offendingToken!, e, [msg]);
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
        ErrorManager.get().grammarError(type, this.getSourceName(), token, args);
    }
}
