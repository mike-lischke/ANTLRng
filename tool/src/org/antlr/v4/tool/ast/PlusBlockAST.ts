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

export class PlusBlockAST extends GrammarAST implements RuleElementAST, QuantifierAST {
    private readonly _greedy: boolean;

    public constructor(node: PlusBlockAST);
    public constructor(type: number, t: Token, nonGreedy: Token);
    public constructor(...args: unknown[]) {
        switch (args.length) {
            case 1: {
                const [node] = args as [PlusBlockAST];

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

    public override dupNode(): PlusBlockAST {
        return new PlusBlockAST(this);
    }

    public override visit<T>(v: GrammarASTVisitor<T>): T {
        return v.visit(this);
    }
}
