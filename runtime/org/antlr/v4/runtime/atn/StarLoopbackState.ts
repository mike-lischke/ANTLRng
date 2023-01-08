/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */


import { ATNState } from "./ATNState";
import { StarLoopEntryState } from "./StarLoopEntryState";




export  class StarLoopbackState extends ATNState {
	public readonly  getLoopEntryState = ():  StarLoopEntryState | null => {
		return this.transition(0).target as StarLoopEntryState;
	}

	public getStateType = ():  number => {
		return ATNState.STAR_LOOP_BACK;
	}
}
