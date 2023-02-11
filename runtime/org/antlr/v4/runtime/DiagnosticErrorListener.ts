/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */




import { java, S } from "jree";
import { ANTLRErrorListener } from "./ANTLRErrorListener";
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
	 * When `true`, only exactly known ambiguities are reported.
	 */
	protected readonly exactOnly:  boolean;

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
	 * @param exactOnly `true` to report only exact ambiguities, otherwise
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

	public reportAmbiguity = (recognizer: Parser| null,
								dfa: DFA| null,
								startIndex: number,
								stopIndex: number,
								exact: boolean,
								ambigAlts: java.util.BitSet| null,
								configs: ATNConfigSet| null):  void =>
	{
		if (this.exactOnly && !exact) {
			return;
		}

		let  format: java.lang.String = S`reportAmbiguity d=%s: ambigAlts=%s, input='%s'`;
		let  decision: java.lang.String = this.getDecisionDescription(recognizer, dfa);
		let  conflictingAlts: java.util.BitSet = this.getConflictingAlts(ambigAlts, configs);
		let  text: java.lang.String = recognizer.getTokenStream().getText(Interval.of(startIndex, stopIndex));
		let  message: java.lang.String = java.lang.String.format(format, decision, conflictingAlts, text);
		recognizer.notifyErrorListeners(message);
	}

	public reportAttemptingFullContext = (recognizer: Parser| null,
											dfa: DFA| null,
											startIndex: number,
											stopIndex: number,
											conflictingAlts: java.util.BitSet| null,
											configs: ATNConfigSet| null):  void =>
	{
		let  format: java.lang.String = S`reportAttemptingFullContext d=%s, input='%s'`;
		let  decision: java.lang.String = this.getDecisionDescription(recognizer, dfa);
		let  text: java.lang.String = recognizer.getTokenStream().getText(Interval.of(startIndex, stopIndex));
		let  message: java.lang.String = java.lang.String.format(format, decision, text);
		recognizer.notifyErrorListeners(message);
	}

	public reportContextSensitivity = (recognizer: Parser| null,
										 dfa: DFA| null,
										 startIndex: number,
										 stopIndex: number,
										 prediction: number,
										 configs: ATNConfigSet| null):  void =>
	{
		let  format: java.lang.String = S`reportContextSensitivity d=%s, input='%s'`;
		let  decision: java.lang.String = this.getDecisionDescription(recognizer, dfa);
		let  text: java.lang.String = recognizer.getTokenStream().getText(Interval.of(startIndex, stopIndex));
		let  message: java.lang.String = java.lang.String.format(format, decision, text);
		recognizer.notifyErrorListeners(message);
	}

	protected getDecisionDescription = (recognizer: Parser| null, dfa: DFA| null):  java.lang.String | null => {
		let  decision: number = dfa.decision;
		let  ruleIndex: number = dfa.atnStartState.ruleIndex;

		let  ruleNames: java.lang.String[] = recognizer.getRuleNames();
		if (ruleIndex < 0 || ruleIndex >= ruleNames.length) {
			return java.lang.String.valueOf(decision);
		}

		let  ruleName: java.lang.String = ruleNames[ruleIndex];
		if (ruleName === null || ruleName.isEmpty()) {
			return java.lang.String.valueOf(decision);
		}

		return java.lang.String.format(S`%d (%s)`, decision, ruleName);
	}

	/**
	 * Computes the set of conflicting or ambiguous alternatives from a
	 * configuration set, if that information was not already provided by the
	 * parser.
	 *
	 * @param reportedAlts The set of conflicting or ambiguous alternatives, as
	 * reported by the parser.
	 * @param configs The conflicting or ambiguous configuration set.
	 * @returns Returns {@code reportedAlts} if it is not {@code null}, otherwise
	 * returns the set of alternatives represented in {@code configs}.
	 */
	protected getConflictingAlts = (reportedAlts: java.util.BitSet| null, configs: ATNConfigSet| null):  java.util.BitSet | null => {
		if (reportedAlts !== null) {
			return reportedAlts;
		}

		let  result: java.util.BitSet = new  java.util.BitSet();
		for (let config of configs) {
			result.set(config.alt);
		}

		return result;
	}
}
