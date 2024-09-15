/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { LL1Loop } from "./LL1Loop.js";
import { CodeBlockForAlt } from "./CodeBlockForAlt.js";
import { OutputModelFactory } from "../OutputModelFactory.js";
import { PlusBlockStartState, IntervalSet } from "antlr4ng";
import { BlockAST } from "../../tool/ast/BlockAST.js";
import { GrammarAST } from "../../tool/ast/GrammarAST.js";

/** */
export class LL1PlusBlockSingleAlt extends LL1Loop {
    public constructor(factory: OutputModelFactory, plusRoot: GrammarAST, alts: CodeBlockForAlt[]) {
        super(factory, plusRoot, alts);

        const blkAST = plusRoot.getChild(0) as BlockAST;
        const blkStart = blkAST.atnState as PlusBlockStartState;

        $outer.stateNumber = blkStart.loopBackState.stateNumber;
        this.blockStartStateNumber = blkStart.stateNumber;
        const plus = blkAST.atnState as PlusBlockStartState;
        this.decision = plus.loopBackState.decision;
        const altLookSets = factory.getGrammar().decisionLOOK.get($outer.decision);

        const loopBackLook = altLookSets[0];
        this.loopExpr = this.addCodeForLoopLookaheadTempVar(loopBackLook);
    }
}
