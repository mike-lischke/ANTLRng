/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/* eslint-disable jsdoc/require-returns, jsdoc/require-param */

import { CodeBlockForAlt } from "./CodeBlockForAlt.js";
import { Choice } from "./Choice.js";
import { OutputModelFactory } from "../OutputModelFactory.js";
import { BlockStartState } from "antlr4ng";
import { GrammarAST } from "../../tool/ast/GrammarAST.js";

export  class AltBlock extends Choice {
//	@ModelElement public ThrowNoViableAlt error;

    public  constructor(factory: OutputModelFactory,
        blkOrEbnfRootAST: GrammarAST,
        alts: CodeBlockForAlt[])
    {
        super(factory, blkOrEbnfRootAST, alts);
        this.decision = (blkOrEbnfRootAST.atnState as BlockStartState).decision;
		// interp.predict() throws exception
//		this.error = new ThrowNoViableAlt(factory, blkOrEbnfRootAST, null);
    }
}
