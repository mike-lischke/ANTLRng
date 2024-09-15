/* java2ts: keep */

/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import type { Token } from "antlr4ng";

import { GrammarAST } from "./GrammarAST.js";
import { GrammarASTVisitor } from "./GrammarASTVisitor.js";
import { RuleElementAST } from "./RuleElementAST.js";

export class RangeAST extends GrammarAST implements RuleElementAST {

    public constructor(nodeOrToken: RangeAST | Token) {
        super(nodeOrToken);
    }

    public override dupNode(): RangeAST {
        return new RangeAST(this);
    }

    public override visit<T>(v: GrammarASTVisitor<T>): T {
        return v.visit(this);
    }
}
