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




import { ATNConfigSet } from "./ATNConfigSet";
import { DecisionEventInfo } from "./DecisionEventInfo";
import { SemanticContext } from "./SemanticContext";
import { TokenStream } from "../TokenStream";




/**
 * This class represents profiling event information for semantic predicate
 * evaluations which occur during prediction.
 *
 * @see ParserATNSimulator#evalSemanticContext
 *
 *
 */
export  class PredicateEvalInfo extends DecisionEventInfo {
	/**
	 * The semantic context which was evaluated.
	 */
	public readonly  semctx:  SemanticContext | null;
	/**
	 * The alternative number for the decision which is guarded by the semantic
	 * context {@link #semctx}. Note that other ATN
	 * configurations may predict the same alternative which are guarded by
	 * other semantic contexts and/or {@link SemanticContext#NONE}.
	 */
	public readonly  predictedAlt:  number;
	/**
	 * The result of evaluating the semantic context {@link #semctx}.
	 */
	public readonly  evalResult:  boolean;

	/**
	 * Constructs a new instance of the {@link PredicateEvalInfo} class with the
	 * specified detailed predicate evaluation information.
	 *
	 * @param decision The decision number
	 * @param input The input token stream
	 * @param startIndex The start index for the current prediction
	 * @param stopIndex The index at which the predicate evaluation was
	 * triggered. Note that the input stream may be reset to other positions for
	 * the actual evaluation of individual predicates.
	 * @param semctx The semantic context which was evaluated
	 * @param evalResult The results of evaluating the semantic context
	 * @param predictedAlt The alternative number for the decision which is
	 * guarded by the semantic context {@code semctx}. See {@link #predictedAlt}
	 * for more information.
	 * @param fullCtx {@code true} if the semantic context was
	 * evaluated during LL prediction; otherwise, {@code false} if the semantic
	 * context was evaluated during SLL prediction
	 *
	 * @see ParserATNSimulator#evalSemanticContext(SemanticContext, ParserRuleContext, int, boolean)
	 * @see SemanticContext#eval(Recognizer, RuleContext)
	 */
	public constructor(decision: number,
							 input: TokenStream| null, startIndex: number, stopIndex: number,
							 semctx: SemanticContext| null,
							 evalResult: boolean,
							 predictedAlt: number,
							 fullCtx: boolean)
	{
		super(decision, new  ATNConfigSet(), input, startIndex, stopIndex, fullCtx);
		this.semctx = semctx;
		this.evalResult = evalResult;
		this.predictedAlt = predictedAlt;
	}
}
