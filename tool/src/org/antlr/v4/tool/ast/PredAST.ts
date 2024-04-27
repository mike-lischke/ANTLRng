/* java2ts: keep */

/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/* eslint-disable jsdoc/require-returns, jsdoc/require-param */

import type { Token } from "antlr4ng";

import { ActionAST } from "./ActionAST.js";
import { GrammarASTVisitor } from "./GrammarASTVisitor.js";

export class PredAST extends ActionAST {
    public constructor(node: PredAST);

    public constructor(t: Token);
    public constructor(type: number, t?: Token);
    public constructor(...args: unknown[]) {
        if (typeof args[0] === "number") {
            const [type, t] = args as [number, Token | undefined];

            super(type, t);
        } else {
            const [node] = args as [PredAST];

            super(node);
        }
    }

    public override dupNode(): PredAST {
        return new PredAST(this);
    }

    public override visit<T>(v: GrammarASTVisitor<T>): T {
        return v.visit(this);
    }
}
