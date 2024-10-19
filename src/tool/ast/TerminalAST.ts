/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import type { Token } from "antlr4ng";

import { GrammarASTVisitor } from "./GrammarASTVisitor.js";
import { GrammarASTWithOptions } from "./GrammarASTWithOptions.js";

export class TerminalAST extends GrammarASTWithOptions {

    public constructor(node: TerminalAST);
    public constructor(t: Token);
    public constructor(type: number, t?: Token);
    public constructor(...args: unknown[]) {
        if (typeof args[0] === "number") {
            const [type, t] = args as [number, Token | undefined];

            super(type, t);
        } else {
            const [node] = args as [TerminalAST | Token];

            super(node);
        }
    }

    public override dupNode(): TerminalAST {
        return new TerminalAST(this);
    }

    public override visit<T>(v: GrammarASTVisitor<T>): T {
        return v.visit(this);
    }
}
