/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { DecisionState, IntervalSet } from "antlr4ng";

import { GrammarAST } from "../../tool/ast/GrammarAST.js";
import { OutputModelFactory } from "../OutputModelFactory.js";
import { CodeBlockForAlt } from "./CodeBlockForAlt.js";
import { LL1Choice } from "./LL1Choice.js";

/** (A | B | C) */
export class LL1AltBlock extends LL1Choice {
    public constructor(factory: OutputModelFactory, blkAST: GrammarAST, alts: CodeBlockForAlt[]) {
        super(factory, blkAST, alts);
        this.decision = (blkAST.atnState as DecisionState).decision;

        /** Lookahead for each alt 1..n */
        const altLookSets = factory.getGrammar()!.decisionLOOK[this.decision];
        this.altLook = this.getAltLookaheadAsStringLists(altLookSets);

        const expecting = IntervalSet.or(altLookSets); // combine alt sets
        this.error = this.getThrowNoViableAlt(factory, blkAST, expecting);
    }
}
