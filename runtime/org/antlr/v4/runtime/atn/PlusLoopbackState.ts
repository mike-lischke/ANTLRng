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

import { DecisionState } from "./DecisionState";




/** Decision state for {@code A+} and {@code (A|B)+}.  It has two transitions:
 *  one to the loop back to start of the block and one to exit.
 */
export  class PlusLoopbackState extends DecisionState {

	public getStateType = (): number => {
		return ATNState.PLUS_LOOP_BACK;
	}
}
