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



import { ANTLRErrorListener } from "./ANTLRErrorListener";
import { Parser } from "./Parser";
import { RecognitionException } from "./RecognitionException";
import { Recognizer } from "./Recognizer";
import { ATNConfigSet } from "./atn/ATNConfigSet";
import { DFA } from "./dfa/DFA";




/**
 * Provides an empty default implementation of {@link ANTLRErrorListener}. The
 * default implementation of each method does nothing, but can be overridden as
 * necessary.
 *
 * @author Sam Harwell
 */
export  class BaseErrorListener implements ANTLRErrorListener {
	public syntaxError = (recognizer: Recognizer<unknown, unknown>,
							offendingSymbol: object,
							line: number,
							charPositionInLine: number,
							msg: string,
							e: RecognitionException): void =>
	{
	}

	public reportAmbiguity = (recognizer: Parser,
								dfa: DFA,
								startIndex: number,
								stopIndex: number,
								exact: boolean,
								ambigAlts: BitSet,
								configs: ATNConfigSet): void =>
	{
	}

	public reportAttemptingFullContext = (recognizer: Parser,
											dfa: DFA,
											startIndex: number,
											stopIndex: number,
											conflictingAlts: BitSet,
											configs: ATNConfigSet): void =>
	{
	}

	public reportContextSensitivity = (recognizer: Parser,
										 dfa: DFA,
										 startIndex: number,
										 stopIndex: number,
										 prediction: number,
										 configs: ATNConfigSet): void =>
	{
	}
}
