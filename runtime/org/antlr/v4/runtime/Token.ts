/* java2ts: keep */

/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { java } from "jree";
import { CharStream } from "./CharStream";
import { IntStream } from "./IntStream";
import { TokenSource } from "./TokenSource";

/**
 * A token has properties: text, type, line, character position in the line
 *  (so we can ignore tabs), token channel, index, and source from which
 *  we obtained this token.
 */
export interface Token {

    /**
     * Get the text of the token.
     */
    getText(): java.lang.String | null;

    /** Get the token type of the token */
    getType(): number;

    /**
     * The line number on which the 1st character of this token was matched,
     *  line=1..n
     */
    getLine(): number;

    /**
     * The index of the first character of this token relative to the
     *  beginning of the line at which it occurs, 0..n-1
     */
    getCharPositionInLine(): number;

    /**
     * Return the channel this token. Each token can arrive at the parser
     *  on a different channel, but the parser only "tunes" to a single channel.
     *  The parser ignores everything not on DEFAULT_CHANNEL.
     */
    getChannel(): number;

    /**
     * An index from 0..n-1 of the token object in the input stream.
     *  This must be valid in order to print token streams and
     *  use TokenRewriteStream.
     *
     *  Return -1 to indicate that this token was conjured up since
     *  it doesn't have a valid index.
     */
    getTokenIndex(): number;

    /**
     * The starting character index of the token
     *  This method is optional; return -1 if not implemented.
     */
    getStartIndex(): number;

    /**
     * The last character index of the token.
     *  This method is optional; return -1 if not implemented.
     */
    getStopIndex(): number;

    /**
      Gets the {@link TokenSource} which created this token.
     */
    getTokenSource(): TokenSource | null;

    /**
     * Gets the {@link CharStream} from which this token was derived.
     */
    getInputStream(): CharStream | null;
}

export namespace Token {
    export const INVALID_TYPE = 0;
    export const EPSILON = -2;
    export const MIN_USER_TOKEN_TYPE = 1;
    export const EOF = -1;
    export const DEFAULT_CHANNEL = 0;
    export const HIDDEN_CHANNEL = 1;
    export const MIN_USER_CHANNEL_VALUE = 2;
}

export const isToken = (candidate: unknown): candidate is Token => {
    return (candidate as Token).getTokenSource !== undefined;
};
