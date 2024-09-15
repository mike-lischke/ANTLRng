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

export class SetAST extends GrammarAST implements RuleElementAST {

    public constructor(node: SetAST);
    public constructor(type: number, t: Token, text: string);
    public constructor(...args: unknown[]) {
        if (typeof args[0] === "number") {
            const [type, t, text] = args as [number, Token, string];

            super(type, t, text);
        } else {
            const [node] = args as [SetAST];

            super(node);
        }
    }

    public override dupNode(): SetAST {
        return new SetAST(this);
    }

    public override visit<T>(v: GrammarASTVisitor<T>): T {
        return v.visit(this);
    }
}
