/* java2ts: keep */

/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/* eslint-disable jsdoc/require-returns, jsdoc/require-param */

import type { Token } from "antlr4ng";

import { GrammarAST } from "./GrammarAST.js";
import { GrammarASTVisitor } from "./GrammarASTVisitor.js";
import { QuantifierAST } from "./QuantifierAST.js";
import { RuleElementAST } from "./RuleElementAST.js";

export class OptionalBlockAST extends GrammarAST implements RuleElementAST, QuantifierAST {
    private readonly _greedy: boolean;

    public constructor(node: OptionalBlockAST);
    public constructor(type: number, t: Token, nonGreedy: Token);
    public constructor(...args: unknown[]) {
        switch (args.length) {
            case 1: {
                const [node] = args as [OptionalBlockAST];

                super(node);
                this._greedy = node._greedy;

                break;
            }

            case 3: {
                const [type, t, nonGreedy] = args as [number, Token, Token];

                super(type, t);
                this._greedy = nonGreedy === null;

                break;
            }

            default: {
                throw new Error("Invalid number of arguments");
            }
        }
    }

    public isGreedy(): boolean {
        return this._greedy;
    }

    public override dupNode(): OptionalBlockAST {
        return new OptionalBlockAST(this);
    }

    public override visit<T>(v: GrammarASTVisitor<T>): T {
        return v.visit(this);
    }

}
