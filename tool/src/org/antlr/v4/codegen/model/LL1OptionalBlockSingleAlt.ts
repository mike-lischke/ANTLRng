/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { DecisionState } from "antlr4ng";
import { GrammarAST } from "../../tool/ast/GrammarAST.js";
import { OutputModelFactory } from "../OutputModelFactory.js";
import { CodeBlockForAlt } from "./CodeBlockForAlt.js";
import { LL1Choice } from "./LL1Choice.js";
import { SrcOp } from "./SrcOp.js";

/** (A B C)? */
export class LL1OptionalBlockSingleAlt extends LL1Choice {

    public expr: SrcOp | null;

    public followExpr: SrcOp[]; // might not work in template if size>1

    public constructor(factory: OutputModelFactory,
        blkAST: GrammarAST,
        alts: CodeBlockForAlt[]) {
        super(factory, blkAST, alts);
        this.decision = (blkAST.atnState as DecisionState).decision;

        /** Lookahead for each alt 1..n */
        const altLookSets = factory.getGrammar().decisionLOOK[this.decision];
        this.altLook = this.getAltLookaheadAsStringLists(altLookSets);
        const look = altLookSets[0];
        const followLook = altLookSets[1];

        const expecting = look.or([followLook]);
        this.error = this.getThrowNoViableAlt(factory, blkAST, expecting);

        this.expr = this.addCodeForLookaheadTempVar(look);
        this.followExpr = factory.getLL1Test(followLook, blkAST);
    }
}
