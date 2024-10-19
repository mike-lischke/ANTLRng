/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import type { Token } from "antlr4ng";

import { GrammarAST } from "./GrammarAST.js";
import { GrammarASTVisitor } from "./GrammarASTVisitor.js";

export class NotAST extends GrammarAST {

    public constructor(typeOrNode: number | NotAST, t?: Token) {
        if (typeOrNode instanceof NotAST) {
            super(typeOrNode);
        } else {
            super(typeOrNode, t);
        }
    }

    public override dupNode(): NotAST {
        return new NotAST(this);
    }

    public override visit<T>(v: GrammarASTVisitor<T>): T {
        return v.visit(this);
    }
}
