/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { LL1Loop } from "./LL1Loop.js";
import { CodeBlockForAlt } from "./CodeBlockForAlt.js";
import { Choice } from "./Choice.js";
import { OutputModelFactory } from "../OutputModelFactory.js";
import { StarLoopEntryState, IntervalSet } from "antlr4ng";
import { GrammarAST } from "../../tool/ast/GrammarAST.js";

/** */
export class LL1StarBlockSingleAlt extends LL1Loop {
    public constructor(factory: OutputModelFactory, starRoot: GrammarAST, alts: CodeBlockForAlt[]) {
        super(factory, starRoot, alts);

        const star = starRoot.atnState as StarLoopEntryState;
        this.loopBackStateNumber = star.loopBackState.stateNumber;
        this.decision = star.decision;
        const altLookSets = factory.getGrammar().decisionLOOK.get($outer.decision);
        /* assert altLookSets.length == 2; */
        const enterLook = altLookSets[0];
        const exitLook = altLookSets[1];
        this.loopExpr = this.addCodeForLoopLookaheadTempVar(enterLook);
    }
}
