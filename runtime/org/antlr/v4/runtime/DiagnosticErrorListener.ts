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



import { BaseErrorListener } from "./BaseErrorListener";
import { Parser } from "./Parser";
import { ATNConfig } from "./atn/ATNConfig";
import { ATNConfigSet } from "./atn/ATNConfigSet";
import { DFA } from "./dfa/DFA";
import { Interval } from "./misc/Interval";




/**
 * This implementation of {@link ANTLRErrorListener} can be used to identify
 * certain potential correctness and performance problems in grammars. "Reports"
 * are made by calling {@link Parser#notifyErrorListeners} with the appropriate
 * message.
 *
 * <ul>
 * <li><b>Ambiguities</b>: These are cases where more than one path through the
 * grammar can match the input.</li>
 * <li><b>Weak context sensitivity</b>: These are cases where full-context
 * prediction resolved an SLL conflict to a unique alternative which equaled the
 * minimum alternative of the SLL conflict.</li>
 * <li><b>Strong (forced) context sensitivity</b>: These are cases where the
 * full-context prediction resolved an SLL conflict to a unique alternative,
 * <em>and</em> the minimum alternative of the SLL conflict was found to not be
 * a truly viable alternative. Two-stage parsing cannot be used for inputs where
 * this situation occurs.</li>
 * </ul>
 *
 * @author Sam Harwell
 */
export  class DiagnosticErrorListener extends BaseErrorListener {
	/**
	 * When {@code true}, only exactly known ambiguities are reported.
	 */
	protected readonly  exactOnly:  boolean;

	/**
	 * Initializes a new instance of {@link DiagnosticErrorListener} which only
	 * reports exact ambiguities.
	 */
	/* eslint-disable constructor-super, @typescript-eslint/no-unsafe-call */
public constructor();

	/**
	 * Initializes a new instance of {@link DiagnosticErrorListener}, specifying
	 * whether all ambiguities or only exact ambiguities are reported.
	 *
	 * @param exactOnly {@code true} to report only exact ambiguities, otherwise
	 * {@code false} to report all ambiguities.
	 */
	public constructor(exactOnly: boolean);
/* @ts-expect-error, because of the super() call in the closure. */
public constructor(exactOnly?: boolean) {
const $this = (exactOnly?: boolean): void => {
if (exactOnly === undefined) {
		$this(true);
	}
 else  {

/* @ts-expect-error, because of the super() call in the closure. */
		super();
this.exactOnly = exactOnly;
	}
};

$this(exactOnly);

}
/* eslint-enable constructor-super, @typescript-eslint/no-unsafe-call */

	public reportAmbiguity = (recognizer: Parser,
								dfa: DFA,
								startIndex: number,
								stopIndex: number,
								exact: boolean,
								ambigAlts: BitSet,
								configs: ATNConfigSet): void =>
	{
		if (this.exactOnly && !exact) {
			return;
		}

		let  format: string = "reportAmbiguity d=%s: ambigAlts=%s, input='%s'";
		let  decision: string = this.getDecisionDescription(recognizer, dfa);
		let  conflictingAlts: BitSet = this.getConflictingAlts(ambigAlts, configs);
		let  text: string = recognizer.getTokenStream().getText(Interval.of(startIndex, stopIndex));
		let  message: string = java.lang.StringBuilder.format(format, decision, conflictingAlts, text);
		recognizer.notifyErrorListeners(message);
	}

	public reportAttemptingFullContext = (recognizer: Parser,
											dfa: DFA,
											startIndex: number,
											stopIndex: number,
											conflictingAlts: BitSet,
											configs: ATNConfigSet): void =>
	{
		let  format: string = "reportAttemptingFullContext d=%s, input='%s'";
		let  decision: string = this.getDecisionDescription(recognizer, dfa);
		let  text: string = recognizer.getTokenStream().getText(Interval.of(startIndex, stopIndex));
		let  message: string = java.lang.StringBuilder.format(format, decision, text);
		recognizer.notifyErrorListeners(message);
	}

	public reportContextSensitivity = (recognizer: Parser,
										 dfa: DFA,
										 startIndex: number,
										 stopIndex: number,
										 prediction: number,
										 configs: ATNConfigSet): void =>
	{
		let  format: string = "reportContextSensitivity d=%s, input='%s'";
		let  decision: string = this.getDecisionDescription(recognizer, dfa);
		let  text: string = recognizer.getTokenStream().getText(Interval.of(startIndex, stopIndex));
		let  message: string = java.lang.StringBuilder.format(format, decision, text);
		recognizer.notifyErrorListeners(message);
	}

	protected getDecisionDescription = (recognizer: Parser, dfa: DFA): string => {
		let  decision: number = dfa.decision;
		let  ruleIndex: number = dfa.atnStartState.ruleIndex;

		let  ruleNames: string[] = recognizer.getRuleNames();
		if (ruleIndex < 0 || ruleIndex >= ruleNames.length) {
			return String(decision);
		}

		let  ruleName: string = ruleNames[ruleIndex];
		if (ruleName === undefined || ruleName.length === 0) {
			return String(decision);
		}

		return java.lang.StringBuilder.format("%d (%s)", decision, ruleName);
	}

	/**
	 * Computes the set of conflicting or ambiguous alternatives from a
	 * configuration set, if that information was not already provided by the
	 * parser.
	 *
	 * @param reportedAlts The set of conflicting or ambiguous alternatives, as
	 * reported by the parser.
	 * @param configs The conflicting or ambiguous configuration set.
	 * @return Returns {@code reportedAlts} if it is not {@code null}, otherwise
	 * returns the set of alternatives represented in {@code configs}.
	 */
	protected getConflictingAlts = (reportedAlts: BitSet, configs: ATNConfigSet): BitSet => {
		if (reportedAlts !== undefined) {
			return reportedAlts;
		}

		let  result: BitSet = new  BitSet();
		for (let config of configs) {
			result.set(config.alt);
		}

		return result;
	}
}
