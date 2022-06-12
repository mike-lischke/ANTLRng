/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */


/*
 eslint-disable @typescript-eslint/no-namespace, @typescript-eslint/naming-convention,
 max-classes-per-file, jsdoc/check-tag-names, @typescript-eslint/no-empty-function,
 @typescript-eslint/restrict-plus-operands, @typescript-eslint/unified-signatures, @typescript-eslint/member-ordering,
 no-underscore-dangle
*/

/* cspell: disable */



import { CharStream } from "./CharStream";
import { Token } from "./Token";
import { TokenSource } from "./TokenSource";
import { Pair } from "./misc/Pair";




/** The default mechanism for creating tokens. It's used by default in Lexer and
 *  the error handling strategy (to create missing tokens).  Notifying the parser
 *  of a new factory means that it notifies its token source and error strategy.
 */
export abstract class TokenFactory<Symbol extends Token> {
	/** This is the method used to create tokens in the lexer and in the
	 *  error handling strategy. If text!=null, than the start and stop positions
	 *  are wiped to -1 in the text override is set in the CommonToken.
	 */
	public  abstract create: (source: Pair<TokenSource, CharStream>, type: number, text: string,
				  channel: number, start: number, stop: number,
				  line: number, charPositionInLine: number) => Symbol;

	/** Generically useful */
	public  abstract create: (type: number, text: string) => Symbol;
}
