/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { GrammarAST } from "../../tool/ast/GrammarAST.js";
import { QuantifierAST } from "../../tool/ast/QuantifierAST.js";
import { OutputModelFactory } from "../OutputModelFactory.js";
import { Choice } from "./Choice.js";
import { CodeBlockForAlt } from "./CodeBlockForAlt.js";
import { SrcOp } from "./SrcOp.js";

export class Loop extends Choice {
    public blockStartStateNumber: number;
    public loopBackStateNumber: number;
    public readonly exitAlt: number;

    public iteration: SrcOp[] = [];

    public constructor(factory: OutputModelFactory,
        blkOrEbnfRootAST: GrammarAST,
        alts: CodeBlockForAlt[]) {
        super(factory, blkOrEbnfRootAST, alts);
        const nongreedy = ("isGreedy" in blkOrEbnfRootAST) && !(blkOrEbnfRootAST as QuantifierAST).isGreedy();
        this.exitAlt = nongreedy ? 1 : alts.length + 1;
    }

    public addIterationOp(op: SrcOp): void {
        this.iteration.push(op);
    }
}
