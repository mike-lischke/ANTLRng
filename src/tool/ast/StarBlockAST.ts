/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import type { Token } from "antlr4ng";

import { GrammarAST } from "./GrammarAST.js";
import { GrammarASTVisitor } from "./GrammarASTVisitor.js";
import { QuantifierAST } from "./QuantifierAST.js";

export class StarBlockAST extends GrammarAST implements QuantifierAST {
    private readonly greedy: boolean;

    public constructor(node: StarBlockAST);
    public constructor(type: number, t: Token, greedy: boolean);
    public constructor(...args: unknown[]) {
        if (typeof args[0] === "number") {
            const [type, t, greedy] = args as [number, Token, boolean];

            super(type, t);
            this.greedy = greedy;
        } else {
            const [node] = args as [StarBlockAST];

            super(node);
            this.greedy = node.greedy;
        }
    }

    public isGreedy(): boolean {
        return this.greedy;
    }

    public override dupNode(): StarBlockAST {
        return new StarBlockAST(this);
    }

    public override visit<T>(v: GrammarASTVisitor<T>): T {
        return v.visit(this);
    }
}
