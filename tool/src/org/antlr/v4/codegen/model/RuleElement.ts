/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { SrcOp } from "./SrcOp.js";
import { OutputModelFactory } from "../OutputModelFactory.js";
import { GrammarAST } from "../../tool/ast/GrammarAST.js";

export class RuleElement extends SrcOp {
    /** Associated ATN state for this rule elements (action, token, ruleref, ...) */
    public stateNumber: number;

    public constructor(factory: OutputModelFactory, ast: GrammarAST) {
        super(factory, ast);
        if (ast !== null && ast.atnState !== null) {
            this.stateNumber = ast.atnState.stateNumber;
        }

    }

}
