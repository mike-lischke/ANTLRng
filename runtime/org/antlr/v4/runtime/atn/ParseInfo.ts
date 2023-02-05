/* java2ts: keep */

/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { JavaObject } from "jree";

import { DecisionInfo } from "./DecisionInfo";
import { ProfilingATNSimulator } from "./ProfilingATNSimulator";

/**
 * This class provides access to specific and aggregate statistics gathered
 * during profiling of a parser.
 */
export class ParseInfo extends JavaObject {
    protected readonly atnSimulator: ProfilingATNSimulator;

    public constructor(atnSimulator: ProfilingATNSimulator) {
        super();
        this.atnSimulator = atnSimulator;
    }

    /**
     * Gets an array of {@link DecisionInfo} instances containing the profiling
     * information gathered for each decision in the ATN.
     *
      @returns An array of {@link DecisionInfo} instances, indexed by decision
     * number.
     */
    public getDecisionInfo = (): DecisionInfo[] | null => {
        return this.atnSimulator.getDecisionInfo();
    };

    /**
     * Gets the decision numbers for decisions that required one or more
     * full-context predictions during parsing. These are decisions for which
     * {@link DecisionInfo#LL_Fallback} is non-zero.
     *
      @returns A list of decision numbers which required one or more
     * full-context predictions during parsing.
     */
    public getLLDecisions = (): number[] => {
        const decisions = this.atnSimulator.getDecisionInfo();
        const result: number[] = [];
        for (let i = 0; i < decisions.length; i++) {
            const fallBack = decisions[i].LL_Fallback;
            if (fallBack > 0) {
                result.push(i);
            }
        }

        return result;
    };

    /**
     * Gets the total time spent during prediction across all decisions made
     * during parsing. This value is the sum of
     * {@link DecisionInfo#timeInPrediction} for all decisions.
     *
     * @returns tbd
     */
    public getTotalTimeInPrediction = (): bigint => {
        const decisions = this.atnSimulator.getDecisionInfo();

        return decisions.reduce((previous, currentValue) => {
            return previous += currentValue.timeInPrediction;
        }, 0n);
    };

    /**
     * Gets the total number of SLL lookahead operations across all decisions
     * made during parsing. This value is the sum of
     * {@link DecisionInfo#SLL_TotalLook} for all decisions.
     *
     * @returns tbd
     */
    public getTotalSLLLookaheadOps = (): bigint => {
        const decisions = this.atnSimulator.getDecisionInfo();

        return decisions.reduce((previous, currentValue) => {
            return previous += currentValue.SLL_TotalLook;
        }, 0n);
    };

    /**
     * Gets the total number of LL lookahead operations across all decisions
     * made during parsing. This value is the sum of
     * {@link DecisionInfo#LL_TotalLook} for all decisions.
     *
     * @returns tbd
     */
    public getTotalLLLookaheadOps = (): bigint => {
        const decisions = this.atnSimulator.getDecisionInfo();

        return decisions.reduce((previous, currentValue) => {
            return previous += currentValue.LL_TotalLook;
        }, 0n);
    };

    /**
     * Gets the total number of ATN lookahead operations for SLL prediction
     * across all decisions made during parsing.
     *
     * @returns tbd
     */
    public getTotalSLLATNLookaheadOps = (): bigint => {
        const decisions = this.atnSimulator.getDecisionInfo();

        return decisions.reduce((previous, currentValue) => {
            return previous += currentValue.SLL_ATNTransitions;
        }, 0n);
    };

    /**
     * Gets the total number of ATN lookahead operations for LL prediction
     * across all decisions made during parsing.
     *
     * @returns tbd
     */
    public getTotalLLATNLookaheadOps = (): bigint => {
        const decisions = this.atnSimulator.getDecisionInfo();

        return decisions.reduce((previous, currentValue) => {
            return previous += currentValue.LL_ATNTransitions;
        }, 0n);
    };

    /**
     * Gets the total number of ATN lookahead operations for SLL and LL
     * prediction across all decisions made during parsing.
     *
     * This value is the sum of {@link #getTotalSLLATNLookaheadOps} and
     * {@link #getTotalLLATNLookaheadOps}.
     *
     * @returns tbd
     */
    public getTotalATNLookaheadOps = (): bigint => {
        const decisions = this.atnSimulator.getDecisionInfo();

        return decisions.reduce((previous, currentValue) => {
            return previous += currentValue.SLL_ATNTransitions + currentValue.LL_ATNTransitions;
        }, 0n);
    };

    public getDFASize(decision?: number): number {
        if (decision === undefined) {
            let n = 0;
            const decisionToDFA = this.atnSimulator.decisionToDFA;
            for (let i = 0; i < decisionToDFA.length; i++) {
                n += this.getDFASize(i);
            }

            return n;
        } else {
            const decisionToDFA = this.atnSimulator.decisionToDFA[decision];

            return decisionToDFA.states.size();
        }
    }
}
