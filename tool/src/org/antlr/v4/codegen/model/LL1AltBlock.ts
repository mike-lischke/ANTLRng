/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { LL1Choice } from "./LL1Choice.js";
import { CodeBlockForAlt } from "./CodeBlockForAlt.js";
import { OutputModelFactory } from "../OutputModelFactory.js";
import { DecisionState, IntervalSet } from "antlr4ng";
import { GrammarAST } from "../../tool/ast/GrammarAST.js";

/** (A | B | C) */
export class LL1AltBlock extends LL1Choice {
    public constructor(factory: OutputModelFactory, blkAST: GrammarAST, alts: CodeBlockForAlt[]) {
        super(factory, blkAST, alts);
        this.decision = (blkAST.atnState as DecisionState).decision;

        /** Lookahead for each alt 1..n */
        const altLookSets = factory.getGrammar().decisionLOOK.get($outer.decision);
        this.altLook = $outer.getAltLookaheadAsStringLists(altLookSets);

        const expecting = IntervalSet.or(altLookSets); // combine alt sets
        this.error = $outer.getThrowNoViableAlt(factory, blkAST, expecting);
    }
}
