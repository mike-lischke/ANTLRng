/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { CodeBlockForAlt } from "./CodeBlockForAlt.js";
import { Choice } from "./Choice.js";
import { OutputModelFactory } from "../OutputModelFactory.js";
import { BlockStartState } from "antlr4ng";
import { GrammarAST } from "../../tool/ast/GrammarAST.js";

export class AltBlock extends Choice {
    public constructor(factory: OutputModelFactory,
        blkOrEbnfRootAST: GrammarAST,
        alts: CodeBlockForAlt[]) {
        super(factory, blkOrEbnfRootAST, alts);
        this.decision = (blkOrEbnfRootAST.atnState as BlockStartState).decision;
    }
}
