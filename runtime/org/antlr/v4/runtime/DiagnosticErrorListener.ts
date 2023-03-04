/* java2ts: keep */

/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { java, S } from "jree";
import { BaseErrorListener } from "./BaseErrorListener";
import { Parser } from "./Parser";
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
export class DiagnosticErrorListener extends BaseErrorListener {
    /**
     * When `true`, only exactly known ambiguities are reported.
     */
    protected readonly exactOnly: boolean;

    /**
     * Initializes a new instance of {@link DiagnosticErrorListener} which only
     * reports exact ambiguities.
     */
    public constructor();
    /**
     * Initializes a new instance of {@link DiagnosticErrorListener}, specifying
     * whether all ambiguities or only exact ambiguities are reported.
     *
     * @param exactOnly `true` to report only exact ambiguities, otherwise
     * {@code false} to report all ambiguities.
     */
    public constructor(exactOnly: boolean);
    public constructor(exactOnly?: boolean) {
        super();
        this.exactOnly = exactOnly ?? true;
    }

    public reportAmbiguity = (recognizer: Parser,
        dfa: DFA,
        startIndex: number,
        stopIndex: number,
        exact: boolean,
        ambigAlts: java.util.BitSet | null,
        configs: ATNConfigSet): void => {
        if (this.exactOnly && !exact) {
            return;
        }

        const format = S`reportAmbiguity d=%s: ambigAlts=%s, input='%s'`;
        const decision = this.getDecisionDescription(recognizer, dfa);
        const conflictingAlts = this.getConflictingAlts(ambigAlts, configs);
        const text = recognizer.getTokenStream()!.getText(Interval.of(startIndex, stopIndex));
        const message = java.lang.String.format(format, decision, conflictingAlts, text);
        recognizer.notifyErrorListeners(message);
    };

    public reportAttemptingFullContext = (recognizer: Parser,
        dfa: DFA,
        startIndex: number,
        stopIndex: number,
        conflictingAlts: java.util.BitSet | null,
        configs: ATNConfigSet | null): void => {
        const format = S`reportAttemptingFullContext d=%s, input='%s'`;
        const decision = this.getDecisionDescription(recognizer, dfa);
        const text = recognizer.getTokenStream()!.getText(Interval.of(startIndex, stopIndex));
        const message = java.lang.String.format(format, decision, text);
        recognizer.notifyErrorListeners(message);
    };

    public reportContextSensitivity = (recognizer: Parser,
        dfa: DFA,
        startIndex: number,
        stopIndex: number,
        prediction: number,
        configs: ATNConfigSet | null): void => {
        const format = S`reportContextSensitivity d=%s, input='%s'`;
        const decision = this.getDecisionDescription(recognizer, dfa);
        const text = recognizer.getTokenStream()!.getText(Interval.of(startIndex, stopIndex));
        const message = java.lang.String.format(format, decision, text);
        recognizer.notifyErrorListeners(message);
    };

    protected getDecisionDescription = (recognizer: Parser, dfa: DFA): java.lang.String => {
        const decision = dfa.decision;
        const ruleIndex = dfa.atnStartState!.ruleIndex;

        const ruleNames = recognizer.getRuleNames();
        if (ruleIndex < 0 || ruleIndex >= ruleNames.length) {
            return java.lang.String.valueOf(decision);
        }

        const ruleName: java.lang.String = ruleNames[ruleIndex];
        if (ruleName === null || ruleName.isEmpty()) {
            return java.lang.String.valueOf(decision);
        }

        return java.lang.String.format(S`%d (%s)`, decision, ruleName);
    };

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
    protected getConflictingAlts = (reportedAlts: java.util.BitSet | null,
        configs: ATNConfigSet): java.util.BitSet | null => {
        if (reportedAlts !== null) {
            return reportedAlts;
        }

        const result = new java.util.BitSet();
        for (const config of configs) {
            result.set(config.alt);
        }

        return result;
    };
}
