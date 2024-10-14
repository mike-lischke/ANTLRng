/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { IntervalSet } from "antlr4ng";
import { GrammarAST } from "../../tool/ast/GrammarAST.js";
import { OutputModelFactory } from "../OutputModelFactory.js";
import { CaptureNextTokenType } from "./CaptureNextTokenType.js";
import { Choice } from "./Choice.js";
import { CodeBlockForAlt } from "./CodeBlockForAlt.js";
import { OutputModelObject } from "./OutputModelObject.js";
import { SrcOp } from "./SrcOp.js";

export abstract class LL1Loop extends Choice {

    /**
     * The state associated wih the (A|B|...) block not loopback, which
     *  is super.stateNumber
     */
    public blockStartStateNumber: number;
    public loopBackStateNumber: number;

    public loopExpr: OutputModelObject | null;

    public iteration: SrcOp[] = [];

    public constructor(factory: OutputModelFactory,
        blkAST: GrammarAST,
        alts: CodeBlockForAlt[]) {
        super(factory, blkAST, alts);
    }

    public addIterationOp(op: SrcOp): void {
        this.iteration.push(op);
    }

    public addCodeForLoopLookaheadTempVar(look: IntervalSet): SrcOp | null {
        const expr = this.addCodeForLookaheadTempVar(look);
        if (expr) {
            const nextType = new CaptureNextTokenType(this.factory!, expr.varName);
            this.addIterationOp(nextType);
        }

        return expr;
    }
}
