/* java2ts: keep */

/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { CommonToken, type Token } from "antlr4ng";

import { GrammarASTVisitor } from "./GrammarASTVisitor.js";
import { GrammarASTWithOptions } from "./GrammarASTWithOptions.js";
import { RuleElementAST } from "./RuleElementAST.js";

export class RuleRefAST extends GrammarASTWithOptions implements RuleElementAST {
    public constructor(node: RuleRefAST);
    public constructor(t: Token);
    public constructor(type: number, t?: Token);
    public constructor(...args: unknown[]) {
        if (typeof args[0] === "number") {
            const [type, t] = args as [number, Token | undefined];

            super(type, t);
        } else {
            const [node] = args as [RuleRefAST | Token];

            super(node);
        }
    }

    /** Dup token too since we overwrite during LR rule transform */

    public override dupNode(): RuleRefAST {
        const r = new RuleRefAST(this);
        // In LR transform, we alter original token stream to make e -> e[n]
        // Since we will be altering the dup, we need dup to have the
        // original token.  We can set this tree (the original) to have
        // a new token.
        r.token = this.token;
        this.token = CommonToken.fromToken(r.token!);

        return r;
    }

    public override visit<T>(v: GrammarASTVisitor<T>): T {
        return v.visit(this);
    }
}
