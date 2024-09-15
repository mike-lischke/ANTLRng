/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { RuleElement } from "./RuleElement.js";
import { Loop } from "./Loop.js";
import { CodeBlockForAlt } from "./CodeBlockForAlt.js";
import { Choice } from "./Choice.js";
import { OutputModelFactory } from "../OutputModelFactory.js";
import { StarLoopEntryState } from "antlr4ng";
import { GrammarAST } from "../../tool/ast/GrammarAST.js";

export class StarBlock extends Loop {
    public loopLabel: string;

    public constructor(factory: OutputModelFactory,
        blkOrEbnfRootAST: GrammarAST,
        alts: CodeBlockForAlt[]) {
        super(factory, blkOrEbnfRootAST, alts);
        this.loopLabel = factory.getGenerator().getTarget().getLoopLabel(blkOrEbnfRootAST);
        const star = blkOrEbnfRootAST.atnState as StarLoopEntryState;
        this.loopBackStateNumber = star.loopBackState.stateNumber;
        $outer.decision = star.decision;
    }
}
