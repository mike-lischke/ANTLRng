/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */


/*
 eslint-disable @typescript-eslint/no-namespace, @typescript-eslint/naming-convention, no-redeclare,
 max-classes-per-file, jsdoc/check-tag-names, @typescript-eslint/no-empty-function,
 @typescript-eslint/restrict-plus-operands, @typescript-eslint/unified-signatures, @typescript-eslint/member-ordering,
 no-underscore-dangle, max-len
*/

/* cspell: disable */

import { CharStream } from "./CharStream";
import { IntStream } from "./IntStream";
import { TokenSource } from "./TokenSource";




/** A token has properties: text, type, line, character position in the line
 *  (so we can ignore tabs), token channel, index, and source from which
 *  we obtained this token.
 */
export abstract class Token {
	public static readonly INVALID_TYPE:  number = 0;

    /** During lookahead operations, this "token" signifies we hit rule end ATN state
     *  and did not follow it despite needing to.
     */
    public static readonly EPSILON:  number = -2;

	public static readonly MIN_USER_TOKEN_TYPE:  number = 1;

    public static readonly EOF:  number = IntStream.EOF;

	/** All tokens go to the parser (unless skip() is called in that rule)
	 *  on a particular "channel".  The parser tunes to a particular channel
	 *  so that whitespace etc... can go to the parser on a "hidden" channel.
	 */
	public static readonly DEFAULT_CHANNEL:  number = 0;

	/** Anything on different channel than DEFAULT_CHANNEL is not parsed
	 *  by parser.
	 */
	public static readonly HIDDEN_CHANNEL:  number = 1;

	/**
	 * This is the minimum constant value which can be assigned to a
	 * user-defined token channel.
	 *
	 * <p>
	 * The non-negative numbers less than {@link #MIN_USER_CHANNEL_VALUE} are
	 * assigned to the predefined channels {@link #DEFAULT_CHANNEL} and
	 * {@link #HIDDEN_CHANNEL}.</p>
	 *
	 * @see Token#getChannel()
	 */
	public static readonly MIN_USER_CHANNEL_VALUE:  number = 2;

	/**
	 * Get the text of the token.
	 */
	public  abstract getText: () => string;

	/** Get the token type of the token */
	public  abstract getType: () => number;

	/** The line number on which the 1st character of this token was matched,
	 *  line=1..n
	 */
	public  abstract getLine: () => number;

	/** The index of the first character of this token relative to the
	 *  beginning of the line at which it occurs, 0..n-1
	 */
	public  abstract getCharPositionInLine: () => number;

	/** Return the channel this token. Each token can arrive at the parser
	 *  on a different channel, but the parser only "tunes" to a single channel.
	 *  The parser ignores everything not on DEFAULT_CHANNEL.
	 */
	public  abstract getChannel: () => number;

	/** An index from 0..n-1 of the token object in the input stream.
	 *  This must be valid in order to print token streams and
	 *  use TokenRewriteStream.
	 *
	 *  Return -1 to indicate that this token was conjured up since
	 *  it doesn't have a valid index.
	 */
	public  abstract getTokenIndex: () => number;

	/** The starting character index of the token
	 *  This method is optional; return -1 if not implemented.
	 */
	public  abstract getStartIndex: () => number;

	/** The last character index of the token.
	 *  This method is optional; return -1 if not implemented.
	 */
	public  abstract getStopIndex: () => number;

	/** Gets the {@link TokenSource} which created this token.
	 */
	public  abstract getTokenSource: () => TokenSource;

	/**
	 * Gets the {@link CharStream} from which this token was derived.
	 */
	public  abstract getInputStream: () => CharStream;
}
