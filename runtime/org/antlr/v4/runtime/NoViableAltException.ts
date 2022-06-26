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



import { Parser } from "./Parser";
import { ParserRuleContext } from "./ParserRuleContext";
import { RecognitionException } from "./RecognitionException";
import { Token } from "./Token";
import { TokenStream } from "./TokenStream";
import { ATNConfigSet } from "./atn/ATNConfigSet";




/** Indicates that the parser could not decide which of two or more paths
 *  to take based upon the remaining input. It tracks the starting token
 *  of the offending input and also knows where the parser was
 *  in the various paths when the error. Reported by reportNoViableAlternative()
 */
export  class NoViableAltException extends RecognitionException {
	/** Which configurations did we try at input.index() that couldn't match input.LT(1)? */

	private readonly  deadEndConfigs?:  ATNConfigSet;

	/** The token object at the start index; the input stream might
	 * 	not be buffering tokens so get a reference to it. (At the
	 *  time the error occurred, of course the stream needs to keep a
	 *  buffer all of the tokens but later we might not have access to those.)
	 */

	private readonly  startToken?:  Token;

	/* eslint-disable constructor-super, @typescript-eslint/no-unsafe-call */
public constructor(recognizer: Parser);

	public constructor(recognizer: Parser,
								input: TokenStream,
								startToken: Token,
								offendingToken: Token,
								deadEndConfigs: ATNConfigSet,
								ctx: ParserRuleContext);
/* @ts-expect-error, because of the super() call in the closure. */
public constructor(recognizer: Parser, input?: TokenStream, startToken?: Token, offendingToken?: Token, deadEndConfigs?: ATNConfigSet, ctx?: ParserRuleContext) {
const $this = (recognizer: Parser, input?: TokenStream, startToken?: Token, offendingToken?: Token, deadEndConfigs?: ATNConfigSet, ctx?: ParserRuleContext): void => {
if (input === undefined) { // LL(1) error
		$this(recognizer,
			 recognizer.getInputStream(),
			 recognizer.getCurrentToken(),
			 recognizer.getCurrentToken(),
			 undefined,
			 recognizer._ctx);
	}
 else 
	{

/* @ts-expect-error, because of the super() call in the closure. */
		super(recognizer, input, ctx);
		this.deadEndConfigs = deadEndConfigs;
		this.startToken = startToken;
		this.setOffendingToken(offendingToken);
	}
};

$this(recognizer, input, startToken, offendingToken, deadEndConfigs, ctx);

}
/* eslint-enable constructor-super, @typescript-eslint/no-unsafe-call */


	public getStartToken = (): Token => {
		return this.startToken;
	}


	public getDeadEndConfigs = (): ATNConfigSet => {
		return this.deadEndConfigs;
	}

}
