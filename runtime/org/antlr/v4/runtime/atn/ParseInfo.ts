/* java2ts: keep */

/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { java } from "../../../../../../lib/java/java";
import { DecisionInfo } from "./DecisionInfo";
import { ProfilingATNSimulator } from "./ProfilingATNSimulator";
import { DFA } from "../dfa/DFA";

import { JavaObject } from "../../../../../../lib/java/lang/Object";

/**
 * This class provides access to specific and aggregate statistics gathered
 * during profiling of a parser.
 *
 *
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
    public getLLDecisions = (): java.util.List<java.lang.Integer> | null => {
        const decisions = this.atnSimulator.getDecisionInfo();
        const LL = new java.util.ArrayList<java.lang.Integer>();
        for (let i = 0; i < decisions.length; i++) {
            const fallBack: bigint = decisions[i].LL_Fallback;
            if (fallBack > 0) {
                LL.add(i);
            }

        }

        return LL;
    };

    /**
     * Gets the total time spent during prediction across all decisions made
     * during parsing. This value is the sum of
     * {@link DecisionInfo#timeInPrediction} for all decisions.
     */
    public getTotalTimeInPrediction = (): bigint => {
        const decisions: DecisionInfo[] = this.atnSimulator.getDecisionInfo();
        let t: bigint = 0;
        for (let i = 0; i < decisions.length; i++) {
            t += decisions[i].timeInPrediction;
        }

        return t;
    };

    /**
     * Gets the total number of SLL lookahead operations across all decisions
     * made during parsing. This value is the sum of
     * {@link DecisionInfo#SLL_TotalLook} for all decisions.
     */
    public getTotalSLLLookaheadOps = (): bigint => {
        const decisions: DecisionInfo[] = this.atnSimulator.getDecisionInfo();
        let k: bigint = 0;
        for (let i = 0; i < decisions.length; i++) {
            k += decisions[i].SLL_TotalLook;
        }

        return k;
    };

    /**
     * Gets the total number of LL lookahead operations across all decisions
     * made during parsing. This value is the sum of
     * {@link DecisionInfo#LL_TotalLook} for all decisions.
     */
    public getTotalLLLookaheadOps = (): bigint => {
        const decisions: DecisionInfo[] = this.atnSimulator.getDecisionInfo();
        let k: bigint = 0;
        for (let i = 0; i < decisions.length; i++) {
            k += decisions[i].LL_TotalLook;
        }

        return k;
    };

    /**
     * Gets the total number of ATN lookahead operations for SLL prediction
     * across all decisions made during parsing.
     */
    public getTotalSLLATNLookaheadOps = (): bigint => {
        const decisions: DecisionInfo[] = this.atnSimulator.getDecisionInfo();
        let k: bigint = 0;
        for (let i = 0; i < decisions.length; i++) {
            k += decisions[i].SLL_ATNTransitions;
        }

        return k;
    };

    /**
     * Gets the total number of ATN lookahead operations for LL prediction
     * across all decisions made during parsing.
     */
    public getTotalLLATNLookaheadOps = (): bigint => {
        const decisions: DecisionInfo[] = this.atnSimulator.getDecisionInfo();
        let k: bigint = 0;
        for (let i = 0; i < decisions.length; i++) {
            k += decisions[i].LL_ATNTransitions;
        }

        return k;
    };

    /**
     * Gets the total number of ATN lookahead operations for SLL and LL
     * prediction across all decisions made during parsing.
     *
     * <p>
     * This value is the sum of {@link #getTotalSLLATNLookaheadOps} and
     * {@link #getTotalLLATNLookaheadOps}.</p>
     */
    public getTotalATNLookaheadOps = (): bigint => {
        const decisions: DecisionInfo[] = this.atnSimulator.getDecisionInfo();
        let k: bigint = 0;
        for (let i = 0; i < decisions.length; i++) {
            k += decisions[i].SLL_ATNTransitions;
            k += decisions[i].LL_ATNTransitions;
        }

        return k;
    };

    /**
     * Gets the total number of DFA states stored in the DFA cache for all
     * decisions in the ATN.
     */
    public getDFASize(): number;

    /**
     * Gets the total number of DFA states stored in the DFA cache for a
     * particular decision.
     */
    public getDFASize(decision: number): number;

    /**
     * Gets the total number of DFA states stored in the DFA cache for all
     * decisions in the ATN.
     *
     * @param decision
     */
    public getDFASize(decision?: number): number {
        if (decision === undefined) {
            let n = 0;
            const decisionToDFA: DFA[] = this.atnSimulator.decisionToDFA;
            for (let i = 0; i < decisionToDFA.length; i++) {
                n += this.getDFASize(i);
            }

            return n;
        } else {
            const decisionToDFA: DFA = this.atnSimulator.decisionToDFA[decision];

            return decisionToDFA.states.size();
        }

    }

}
