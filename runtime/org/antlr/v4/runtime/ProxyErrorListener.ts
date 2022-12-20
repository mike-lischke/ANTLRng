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


import { JavaObject } from "../../../../../lib/java/lang/Object";


/**
 * This implementation of {@link ANTLRErrorListener} dispatches all calls to a
 * collection of delegate listeners. This reduces the effort required to support multiple
 * listeners.
 *
 * @author Sam Harwell
 */
export  class ProxyErrorListener extends JavaObject implements ANTLRErrorListener {
	private readonly  delegates:  java.util.Collection< ANTLRErrorListener> | null;

	public constructor(delegates: java.util.Collection< ANTLRErrorListener>| null) {
		super();
if (delegates === null) {
			throw new  java.lang.NullPointerException("delegates");
		}

		this.delegates = delegates;
	}

	public syntaxError = (recognizer: Recognizer<unknown, unknown>| null,
							offendingSymbol: java.lang.Object| null,
							line: number,
							charPositionInLine: number,
							msg: java.lang.String| null,
							e: RecognitionException| null):  void =>
	{
		for (let listener of this.delegates) {
			listener.syntaxError(recognizer, offendingSymbol, line, charPositionInLine, msg, e);
		}
	}

	public reportAmbiguity = (recognizer: Parser| null,
								dfa: DFA| null,
								startIndex: number,
								stopIndex: number,
								exact: boolean,
								ambigAlts: java.util.BitSet| null,
								configs: ATNConfigSet| null):  void =>
	{
		for (let listener of this.delegates) {
			listener.reportAmbiguity(recognizer, dfa, startIndex, stopIndex, exact, ambigAlts, configs);
		}
	}

	public reportAttemptingFullContext = (recognizer: Parser| null,
											dfa: DFA| null,
											startIndex: number,
											stopIndex: number,
											conflictingAlts: java.util.BitSet| null,
											configs: ATNConfigSet| null):  void =>
	{
		for (let listener of this.delegates) {
			listener.reportAttemptingFullContext(recognizer, dfa, startIndex, stopIndex, conflictingAlts, configs);
		}
	}

	public reportContextSensitivity = (recognizer: Parser| null,
										 dfa: DFA| null,
										 startIndex: number,
										 stopIndex: number,
										 prediction: number,
										 configs: ATNConfigSet| null):  void =>
	{
		for (let listener of this.delegates) {
			listener.reportContextSensitivity(recognizer, dfa, startIndex, stopIndex, prediction, configs);
		}
	}
}
