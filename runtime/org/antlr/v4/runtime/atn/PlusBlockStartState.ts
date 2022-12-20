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


import { BlockStartState } from "./BlockStartState";
import { PlusLoopbackState } from "./PlusLoopbackState";




/** Start of {@code (A|B|...)+} loop. Technically a decision state, but
 *  we don't use for code generation; somebody might need it, so I'm defining
 *  it for completeness. In reality, the {@link PlusLoopbackState} node is the
 *  real decision-making note for {@code A+}.
 */
export  class PlusBlockStartState extends BlockStartState {
	public loopBackState:  PlusLoopbackState | null;

	public getStateType = ():  number => {
		return ATNState.PLUS_BLOCK_START;
	}
}
