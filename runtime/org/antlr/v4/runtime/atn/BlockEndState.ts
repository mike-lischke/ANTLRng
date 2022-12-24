/* java2ts: keep */

/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { ATNState } from "./ATNState";
import { BlockStartState } from "./BlockStartState";

/** Terminal node of a simple {@code (a|b|c)} block. */
export class BlockEndState extends ATNState {
    public startState: BlockStartState | null = null;

    public getStateType = (): number => {
        return ATNState.BLOCK_END;
    };
}
