/* java2ts: keep */

/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/* eslint-disable jsdoc/require-returns , jsdoc/require-param */

import { Token, Vocabulary } from "antlr4ng";
import { CharSupport } from "./CharSupport.js";

export const INVALID_TOKEN_NAME = "<INVALID>";

/** A generic constructor type. */
export type Constructor<T = unknown> = new (...args: unknown[]) => T;

/**
 * Given a token type, get a meaningful name for it such as the ID
 * or string literal.  If this is a lexer and the ttype is in the
 * char vocabulary, compute an ANTLR-valid (possibly escaped) char literal.
 */
export const getTokenDisplayName = (ttype: number, vocabulary: Vocabulary, isLexer: boolean): string => {
    // Inside any target's char range and is lexer grammar?
    // TODO: the char range is now dynamically configurable and we need access to a lexer instance here.
    if (isLexer /*&& ttype >= Lexer.MIN_CHAR_VALUE && ttype <= Lexer.MAX_CHAR_VALUE*/) {
        return CharSupport.getANTLRCharLiteralForChar(ttype);
    }

    if (ttype === Token.EOF) {
        return "EOF";
    }

    if (ttype === Token.INVALID_TYPE) {
        return INVALID_TOKEN_NAME;
    }

    const result = vocabulary.getDisplayName(ttype);
    if (result !== null) {
        return result;
    }

    return String(ttype);
};
