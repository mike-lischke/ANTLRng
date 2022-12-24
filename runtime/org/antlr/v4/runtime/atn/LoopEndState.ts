/* java2ts: keep */

/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { ATNState } from "./ATNState";

/** Mark the end of a * or + loop. */
export class LoopEndState extends ATNState {
    public loopBackState: ATNState | null = null;

    public getStateType = (): number => {
        return ATNState.LOOP_END;
    };
}
