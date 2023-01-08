/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { Parser } from "./Parser";
import { ParserRuleContext } from "./ParserRuleContext";
import { RecognitionException } from "./RecognitionException";




/** This signifies any kind of mismatched input exceptions such as
 *  when the current input does not match the expected token.
 */
export  class InputMismatchException extends RecognitionException {
	public constructor(recognizer: Parser| null);

	public constructor(recognizer: Parser| null, state: number, ctx: ParserRuleContext| null);
public constructor(recognizer: Parser | null, state?: number, ctx?: ParserRuleContext | null) {
if (state === undefined) {
		super(recognizer, recognizer.getInputStream(), recognizer._ctx);
		this.setOffendingToken(recognizer.getCurrentToken());
	}
 else  {
		super(recognizer, recognizer.getInputStream(), ctx);
		this.setOffendingState(state);
		this.setOffendingToken(recognizer.getCurrentToken());
	}

}

}
