/* java2ts: keep */

/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { ATNState } from "./ATNState";
import { DecisionState } from "./DecisionState";
import { StarLoopbackState } from "./StarLoopbackState";

export class StarLoopEntryState extends DecisionState {
    public loopBackState?: StarLoopbackState;

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
    public isPrecedenceDecision: boolean;

    public getStateType = (): number => {
        return ATNState.STAR_LOOP_ENTRY;
    };
}
