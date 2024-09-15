/* java2ts: keep */

/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import type { Token } from "antlr4ng";

import { GrammarAST } from "./GrammarAST.js";
import { GrammarASTVisitor } from "./GrammarASTVisitor.js";
import { QuantifierAST } from "./QuantifierAST.js";
import { RuleElementAST } from "./RuleElementAST.js";

export class StarBlockAST extends GrammarAST implements RuleElementAST, QuantifierAST {
    private readonly _greedy: boolean;

    public constructor(node: StarBlockAST);
    public constructor(type: number, t: Token, nonGreedy: Token);
    public constructor(...args: unknown[]) {
        if (typeof args[0] === "number") {
            const [type, t, nonGreedy] = args as [number, Token, Token | null];

            super(type, t);
            this._greedy = nonGreedy === null;
        } else {
            const [node] = args as [StarBlockAST];

            super(node);
            this._greedy = node._greedy;
        }
    }

    public isGreedy(): boolean {
        return this._greedy;
    }

    public override dupNode(): StarBlockAST {
        return new StarBlockAST(this);
    }

    public override visit<T>(v: GrammarASTVisitor<T>): T {
        return v.visit(this);
    }
}
