/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */


/*
 eslint-disable @typescript-eslint/no-namespace, @typescript-eslint/naming-convention,
 max-classes-per-file, jsdoc/check-tag-names, @typescript-eslint/no-empty-function,
 @typescript-eslint/restrict-plus-operands, @typescript-eslint/unified-signatures, @typescript-eslint/member-ordering,
 no-underscore-dangle
*/

/* cspell: disable */



import { java } from "../../../../../../lib/java/java";
import { DecisionInfo } from "./DecisionInfo";
import { ProfilingATNSimulator } from "./ProfilingATNSimulator";
import { DFA } from "../dfa/DFA";




/**
 * This class provides access to specific and aggregate statistics gathered
 * during profiling of a parser.
 *
 * @since 4.3
 */
export  class ParseInfo {
	protected readonly  atnSimulator?:  ProfilingATNSimulator;

	public constructor(atnSimulator: ProfilingATNSimulator) {
		this.atnSimulator = atnSimulator;
	}

	/**
	 * Gets an array of {@link DecisionInfo} instances containing the profiling
	 * information gathered for each decision in the ATN.
	 *
	 * @return An array of {@link DecisionInfo} instances, indexed by decision
	 * number.
	 */
	public getDecisionInfo = (): DecisionInfo[] => {
		return this.atnSimulator.getDecisionInfo();
	}

	/**
	 * Gets the decision numbers for decisions that required one or more
	 * full-context predictions during parsing. These are decisions for which
	 * {@link DecisionInfo#LL_Fallback} is non-zero.
	 *
	 * @return A list of decision numbers which required one or more
	 * full-context predictions during parsing.
	 */
	public getLLDecisions = (): java.util.List<java.lang.Integer> => {
		let  decisions: DecisionInfo[] = this.atnSimulator.getDecisionInfo();
		let  LL: java.util.List<java.lang.Integer> = new  java.util.ArrayList<java.lang.Integer>();
		for (let  i: number=0; i<decisions.length; i++) {
			let  fallBack: bigint = decisions[i].LL_Fallback;
			if ( fallBack>0 ) {
 LL.add(i);
}

		}
		return LL;
	}

	/**
	 * Gets the total time spent during prediction across all decisions made
	 * during parsing. This value is the sum of
	 * {@link DecisionInfo#timeInPrediction} for all decisions.
	 */
	public getTotalTimeInPrediction = (): bigint => {
		let  decisions: DecisionInfo[] = this.atnSimulator.getDecisionInfo();
		let  t: bigint = 0;
		for (let  i: number=0; i<decisions.length; i++) {
			t += decisions[i].timeInPrediction;
		}
		return t;
	}

	/**
	 * Gets the total number of SLL lookahead operations across all decisions
	 * made during parsing. This value is the sum of
	 * {@link DecisionInfo#SLL_TotalLook} for all decisions.
	 */
	public getTotalSLLLookaheadOps = (): bigint => {
		let  decisions: DecisionInfo[] = this.atnSimulator.getDecisionInfo();
		let  k: bigint = 0;
		for (let  i: number = 0; i < decisions.length; i++) {
			k += decisions[i].SLL_TotalLook;
		}
		return k;
	}

	/**
	 * Gets the total number of LL lookahead operations across all decisions
	 * made during parsing. This value is the sum of
	 * {@link DecisionInfo#LL_TotalLook} for all decisions.
	 */
	public getTotalLLLookaheadOps = (): bigint => {
		let  decisions: DecisionInfo[] = this.atnSimulator.getDecisionInfo();
		let  k: bigint = 0;
		for (let  i: number = 0; i < decisions.length; i++) {
			k += decisions[i].LL_TotalLook;
		}
		return k;
	}

	/**
	 * Gets the total number of ATN lookahead operations for SLL prediction
	 * across all decisions made during parsing.
	 */
	public getTotalSLLATNLookaheadOps = (): bigint => {
		let  decisions: DecisionInfo[] = this.atnSimulator.getDecisionInfo();
		let  k: bigint = 0;
		for (let  i: number = 0; i < decisions.length; i++) {
			k += decisions[i].SLL_ATNTransitions;
		}
		return k;
	}

	/**
	 * Gets the total number of ATN lookahead operations for LL prediction
	 * across all decisions made during parsing.
	 */
	public getTotalLLATNLookaheadOps = (): bigint => {
		let  decisions: DecisionInfo[] = this.atnSimulator.getDecisionInfo();
		let  k: bigint = 0;
		for (let  i: number = 0; i < decisions.length; i++) {
			k += decisions[i].LL_ATNTransitions;
		}
		return k;
	}

	/**
	 * Gets the total number of ATN lookahead operations for SLL and LL
	 * prediction across all decisions made during parsing.
	 *
	 * <p>
	 * This value is the sum of {@link #getTotalSLLATNLookaheadOps} and
	 * {@link #getTotalLLATNLookaheadOps}.</p>
	 */
	public getTotalATNLookaheadOps = (): bigint => {
		let  decisions: DecisionInfo[] = this.atnSimulator.getDecisionInfo();
		let  k: bigint = 0;
		for (let  i: number = 0; i < decisions.length; i++) {
			k += decisions[i].SLL_ATNTransitions;
			k += decisions[i].LL_ATNTransitions;
		}
		return k;
	}

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
	 */
	public getDFASize(decision?: number):  number {
if (decision === undefined) {
		let  n: number = 0;
		let  decisionToDFA: DFA[] = this.atnSimulator.decisionToDFA;
		for (let  i: number = 0; i < decisionToDFA.length; i++) {
			n += this.getDFASize(i);
		}
		return n;
	}
 else  {
		let  decisionToDFA: DFA = this.atnSimulator.decisionToDFA[decision];
		return decisionToDFA.states.size();
	}

}

}
