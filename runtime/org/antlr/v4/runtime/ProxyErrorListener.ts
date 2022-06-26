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



import { java } from "../../../../../lib/java/java";
import { ANTLRErrorListener } from "./ANTLRErrorListener";
import { Parser } from "./Parser";
import { RecognitionException } from "./RecognitionException";
import { Recognizer } from "./Recognizer";
import { ATNConfigSet } from "./atn/ATNConfigSet";
import { DFA } from "./dfa/DFA";




/**
 * This implementation of {@link ANTLRErrorListener} dispatches all calls to a
 * collection of delegate listeners. This reduces the effort required to support multiple
 * listeners.
 *
 * @author Sam Harwell
 */
export  class ProxyErrorListener extends  ANTLRErrorListener {
	private readonly  delegates?:  java.util.Collection< ANTLRErrorListener>;

	public constructor(delegates: java.util.Collection< ANTLRErrorListener>) {
		super();
if (delegates === undefined) {
			throw new  java.lang.NullPointerException("delegates");
		}

		this.delegates = delegates;
	}

	public syntaxError = (recognizer: Recognizer<unknown, unknown>,
							offendingSymbol: object,
							line: number,
							charPositionInLine: number,
							msg: string,
							e: RecognitionException): void =>
	{
		for (let listener of this.delegates) {
			listener.syntaxError(recognizer, offendingSymbol, line, charPositionInLine, msg, e);
		}
	}

	public reportAmbiguity = (recognizer: Parser,
								dfa: DFA,
								startIndex: number,
								stopIndex: number,
								exact: boolean,
								ambigAlts: BitSet,
								configs: ATNConfigSet): void =>
	{
		for (let listener of this.delegates) {
			listener.reportAmbiguity(recognizer, dfa, startIndex, stopIndex, exact, ambigAlts, configs);
		}
	}

	public reportAttemptingFullContext = (recognizer: Parser,
											dfa: DFA,
											startIndex: number,
											stopIndex: number,
											conflictingAlts: BitSet,
											configs: ATNConfigSet): void =>
	{
		for (let listener of this.delegates) {
			listener.reportAttemptingFullContext(recognizer, dfa, startIndex, stopIndex, conflictingAlts, configs);
		}
	}

	public reportContextSensitivity = (recognizer: Parser,
										 dfa: DFA,
										 startIndex: number,
										 stopIndex: number,
										 prediction: number,
										 configs: ATNConfigSet): void =>
	{
		for (let listener of this.delegates) {
			listener.reportContextSensitivity(recognizer, dfa, startIndex, stopIndex, prediction, configs);
		}
	}
}
