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




import { java } from "../../../../../../lib/java/java";
import { ATNConfigSet } from "./ATNConfigSet";
import { DecisionEventInfo } from "./DecisionEventInfo";
import { TokenStream } from "../TokenStream";




/**
 * This class represents profiling event information for a context sensitivity.
 * Context sensitivities are decisions where a particular input resulted in an
 * SLL conflict, but LL prediction produced a single unique alternative.
 *
 * <p>
 * In some cases, the unique alternative identified by LL prediction is not
 * equal to the minimum represented alternative in the conflicting SLL
 * configuration set. Grammars and inputs which result in this scenario are
 * unable to use {@link PredictionMode#SLL}, which in turn means they cannot use
 * the two-stage parsing strategy to improve parsing performance for that
 * input.</p>
 *
 * @see ParserATNSimulator#reportContextSensitivity
 * @see ANTLRErrorListener#reportContextSensitivity
 *
 *
 */
export  class ContextSensitivityInfo extends DecisionEventInfo {
	/**
	 * Constructs a new instance of the {@link ContextSensitivityInfo} class
	 * with the specified detailed context sensitivity information.
	 *
	 * @param decision The decision number
	 * @param configs The final configuration set containing the unique
	 * alternative identified by full-context prediction
	 * @param input The input token stream
	 * @param startIndex The start index for the current prediction
	 * @param stopIndex The index at which the context sensitivity was
	 * identified during full-context prediction
	 */
	public constructor(decision: number,
								  configs: ATNConfigSet| null,
								  input: TokenStream| null, startIndex: number, stopIndex: number)
	{
		super( decision, configs, input, startIndex, stopIndex, true);
	}
}
