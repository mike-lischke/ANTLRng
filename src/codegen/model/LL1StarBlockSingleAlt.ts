/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { StarLoopEntryState } from "antlr4ng";
import { GrammarAST } from "../../tool/ast/GrammarAST.js";
import { OutputModelFactory } from "../OutputModelFactory.js";
import { CodeBlockForAlt } from "./CodeBlockForAlt.js";
import { LL1Loop } from "./LL1Loop.js";

export class LL1StarBlockSingleAlt extends LL1Loop {
    public constructor(factory: OutputModelFactory, starRoot: GrammarAST, alts: CodeBlockForAlt[]) {
        super(factory, starRoot, alts);

        const star = starRoot.atnState as StarLoopEntryState;
        this.loopBackStateNumber = star.loopBackState.stateNumber;
        this.decision = star.decision;
        const altLookSets = factory.getGrammar()!.decisionLOOK[this.decision];

        const enterLook = altLookSets[0];
        this.loopExpr = this.addCodeForLoopLookaheadTempVar(enterLook);
    }
}
