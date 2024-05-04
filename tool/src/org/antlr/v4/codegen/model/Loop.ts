/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/* eslint-disable jsdoc/require-returns, jsdoc/require-param */

import { SrcOp } from "./SrcOp.js";
import { ModelElement } from "./ModelElement.js";
import { CodeBlockForAlt } from "./CodeBlockForAlt.js";
import { Choice } from "./Choice.js";
import { OutputModelFactory } from "../OutputModelFactory.js";
import { GrammarAST } from "../../tool/ast/GrammarAST.js";
import { QuantifierAST } from "../../tool/ast/QuantifierAST.js";

export  class Loop extends Choice {
    public  blockStartStateNumber:  number;
    public  loopBackStateNumber:  number;
    public readonly  exitAlt:  number;

    @ModelElement
    public  iteration:  SrcOp[];

    public  constructor(factory: OutputModelFactory,
        blkOrEbnfRootAST: GrammarAST,
        alts: CodeBlockForAlt[])
    {
        super(factory, blkOrEbnfRootAST, alts);
        const  nongreedy = (blkOrEbnfRootAST instanceof QuantifierAST) && !(blkOrEbnfRootAST as QuantifierAST).isGreedy();
        this.exitAlt = nongreedy ? 1 : alts.size() + 1;
    }

    public  addIterationOp(op: SrcOp):  void {
        if ( this.iteration===null ) {
            this.iteration = new  Array<SrcOp>();
        }

        this.iteration.add(op);
    }
}
