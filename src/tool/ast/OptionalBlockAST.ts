/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import type { Token } from "antlr4ng";

import { GrammarAST } from "./GrammarAST.js";
import { GrammarASTVisitor } from "./GrammarASTVisitor.js";
import { QuantifierAST } from "./QuantifierAST.js";

export class OptionalBlockAST extends GrammarAST implements QuantifierAST {
    private readonly greedy: boolean;

    public constructor(node: OptionalBlockAST);
    public constructor(type: number, t: Token, greedy: boolean);
    public constructor(...args: unknown[]) {
        switch (args.length) {
            case 1: {
                const [node] = args as [OptionalBlockAST];

                super(node);
                this.greedy = node.greedy;

                break;
            }

            case 3: {
                const [type, t, greedy] = args as [number, Token, boolean];

                super(type, t);
                this.greedy = greedy;

                break;
            }

            default: {
                throw new Error("Invalid number of arguments");
            }
        }
    }

    public isGreedy(): boolean {
        return this.greedy;
    }

    public override dupNode(): OptionalBlockAST {
        return new OptionalBlockAST(this);
    }

    public override visit<T>(v: GrammarASTVisitor<T>): T {
        return v.visit(this);
    }

}
