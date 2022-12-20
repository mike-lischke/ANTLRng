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




import { DecisionState } from "./DecisionState";
import { StarLoopbackState } from "./StarLoopbackState";




export  class StarLoopEntryState extends DecisionState {
	public loopBackState:  StarLoopbackState | null;

	/**
	 * Indicates whether this state can benefit from a precedence DFA during SLL
	 * decision making.
	 *
	 * <p>This is a computed property that is calculated during ATN deserialization
	 * and stored for use in {@link ParserATNSimulator} and
	 * {@link ParserInterpreter}.</p>
	 *
	 * @see DFA#isPrecedenceDfa()
	 */
	public isPrecedenceDecision:  boolean;

	public getStateType = ():  number => {
		return ATNState.STAR_LOOP_ENTRY;
	}
}
