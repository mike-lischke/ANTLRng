/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import type { Token } from "antlr4ng";

import { GrammarASTVisitor } from "./GrammarASTVisitor.js";
import { GrammarASTWithOptions } from "./GrammarASTWithOptions.js";

export class BlockAST extends GrammarASTWithOptions {
    // TODO: maybe I need a Subrule object like Rule so these options mov to that?
    /** What are the default options for a subrule? */
    public static readonly defaultBlockOptions = new Map<string, string>();

    public static readonly defaultLexerBlockOptions = new Map<string, string>();

    public constructor(node: BlockAST);
    public constructor(t: Token, text?: string);
    public constructor(type: number, t?: Token, text?: string);
    public constructor(...args: unknown[]) {
        if (args.length === 1) {
            if (args[0] instanceof BlockAST) {
                const [node] = args as [BlockAST];

                super(node);
            } else {
                super(args[0] as Token); // or number, but that doesn't matter here.
            }
        } else {
            let type;
            let t;
            let text;
            if (typeof args[0] === "number") {
                [type, t, text] = args as [number, Token | undefined, string | undefined];
            } else {
                [t, text] = args as [Token, string | undefined];
                type = t.type;
            }
            super(type, t, text);
        }
    }

    public override dupNode(): BlockAST {
        return new BlockAST(this);
    }

    public override visit<T>(v: GrammarASTVisitor<T>): T {
        return v.visit(this);
    }
}
