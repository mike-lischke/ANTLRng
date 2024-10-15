/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { PlusBlockStartState } from "antlr4ng";
import { BlockAST } from "../../tool/ast/BlockAST.js";
import { GrammarAST } from "../../tool/ast/GrammarAST.js";
import { OutputModelFactory } from "../OutputModelFactory.js";
import { CodeBlockForAlt } from "./CodeBlockForAlt.js";
import { Loop } from "./Loop.js";
import { ThrowNoViableAlt } from "./ThrowNoViableAlt.js";

export class PlusBlock extends Loop {

    public error: ThrowNoViableAlt;

    public constructor(factory: OutputModelFactory,
        plusRoot: GrammarAST,
        alts: CodeBlockForAlt[]) {
        super(factory, plusRoot, alts);
        const blkAST = plusRoot.getChild(0) as BlockAST;
        const blkStart = blkAST.atnState as PlusBlockStartState;
        const loop = blkStart.loopBackState;
        this.stateNumber = blkStart.loopBackState.stateNumber;
        this.blockStartStateNumber = blkStart.stateNumber;
        this.loopBackStateNumber = loop.stateNumber;
        this.error = this.getThrowNoViableAlt(factory, plusRoot);
        this.decision = loop.decision;
    }
}