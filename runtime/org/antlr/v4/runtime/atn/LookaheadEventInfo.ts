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
import { TokenStream } from "../TokenStream";




/**
 * This class represents profiling event information for tracking the lookahead
 * depth required in order to make a prediction.
 *
 *
 */
export  class LookaheadEventInfo extends DecisionEventInfo {
	/** The alternative chosen by adaptivePredict(), not necessarily
	 *  the outermost alt shown for a rule; left-recursive rules have
	 *  user-level alts that differ from the rewritten rule with a (...) block
	 *  and a (..)* loop.
	 */
	public predictedAlt:  number;

	/**
	 * Constructs a new instance of the {@link LookaheadEventInfo} class with
	 * the specified detailed lookahead information.
	 *
	 * @param decision The decision number
	 * @param configs The final configuration set containing the necessary
	 * information to determine the result of a prediction, or {@code null} if
	 * the final configuration set is not available
	 * @param input The input token stream
	 * @param startIndex The start index for the current prediction
	 * @param stopIndex The index at which the prediction was finally made
	 * @param fullCtx {@code true} if the current lookahead is part of an LL
	 * prediction; otherwise, {@code false} if the current lookahead is part of
	 * an SLL prediction
	 */
	public constructor(decision: number,
							  configs: ATNConfigSet| null,
							  predictedAlt: number,
							  input: TokenStream| null, startIndex: number, stopIndex: number,
							  fullCtx: boolean)
	{
		super(decision, configs, input, startIndex, stopIndex, fullCtx);
		this.predictedAlt = predictedAlt;
	}
}
