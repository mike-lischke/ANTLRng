/* java2ts: keep */

/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { BlockEndState } from "./BlockEndState";
import { DecisionState } from "./DecisionState";

/**  The start of a regular {@code (...)} block. */
export abstract class BlockStartState extends DecisionState {
    public endState?: BlockEndState;
}
