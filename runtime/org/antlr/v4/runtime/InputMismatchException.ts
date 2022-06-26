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




/** This signifies any kind of mismatched input exceptions such as
 *  when the current input does not match the expected token.
 */
export  class InputMismatchException extends RecognitionException {
	public constructor(recognizer: Parser);

	public constructor(recognizer: Parser, state: number, ctx: ParserRuleContext);
public constructor(recognizer: Parser, state?: number, ctx?: ParserRuleContext) {
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
