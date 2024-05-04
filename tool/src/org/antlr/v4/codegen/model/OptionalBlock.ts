/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/* eslint-disable jsdoc/require-returns, jsdoc/require-param */

import { CodeBlockForAlt } from "./CodeBlockForAlt.js";
import { Choice } from "./Choice.js";
import { AltBlock } from "./AltBlock.js";
import { OutputModelFactory } from "../OutputModelFactory.js";
import { GrammarAST } from "../../tool/ast/GrammarAST.js";

/** */
export  class OptionalBlock extends AltBlock {
    public  constructor(factory: OutputModelFactory,
						 questionAST: GrammarAST,
						 alts: CodeBlockForAlt[])
    {
        super(factory, questionAST, alts);
    }
}
