/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { type Token, type TokenStream } from "antlr4ng";

import { grammarOptions } from "../../grammar-options.js";
import type { GrammarType } from "../../support/GrammarType.js";
import type { IGrammarRootAST } from "../../types.js";
import { GrammarASTVisitor } from "./GrammarASTVisitor.js";
import { GrammarASTWithOptions } from "./GrammarASTWithOptions.js";

/** This is the root node for a grammar (for the top level grammarSpec rule). */
export class GrammarRootAST extends GrammarASTWithOptions implements IGrammarRootAST {
    public grammarType: GrammarType;
    public hasErrors = false;

    /** Track stream used to create this tree */
    public readonly tokenStream: TokenStream;
    public fileName: string;

    public constructor(node: GrammarRootAST);
    public constructor(t: Token, tokenStream: TokenStream);
    public constructor(type: number, t: Token, tokenStream: TokenStream);
    public constructor(type: number, t: Token, text: string, tokenStream: TokenStream);
    public constructor(...args: unknown[]) {
        switch (args.length) {
            case 1: {
                const [node] = args as [GrammarRootAST];

                super(node);
                this.grammarType = node.grammarType;
                this.hasErrors = node.hasErrors;
                this.tokenStream = node.tokenStream;

                break;
            }

            case 2: {
                const [t, tokenStream] = args as [Token, TokenStream | undefined];

                super(t);
                if (!tokenStream) {
                    throw new Error("tokenStream");
                }

                this.tokenStream = tokenStream;

                break;
            }

            case 3: {
                const [type, t, tokenStream] = args as [number, Token, TokenStream | undefined];

                super(type, t);
                if (!tokenStream) {
                    throw new Error("tokenStream");
                }

                this.tokenStream = tokenStream;

                break;
            }

            case 4: {
                const [type, t, text, tokenStream] = args as [number, Token, string, TokenStream | undefined];

                super(type, t, text);
                if (!tokenStream) {
                    throw new Error("tokenStream");
                }

                this.tokenStream = tokenStream;

                break;
            }

            default: {
                throw new Error("Invalid number of arguments");
            }
        }
    }

    public getGrammarName(): string | null {
        const t = this.getChild(0);
        if (t !== null) {
            return t.getText();
        }

        return null;
    }

    public override getOptionString(key: string): string | undefined {
        // Standard options.
        if (typeof grammarOptions[key] === "string") {
            return grammarOptions[key];
        }

        // Defines.
        const define = grammarOptions.define?.[key];
        if (define !== undefined) {
            return define;
        }

        return super.getOptionString(key);
    }

    public override visit<T>(v: GrammarASTVisitor<T>): T {
        return v.visit(this);
    }

    public override dupNode(): GrammarRootAST {
        return new GrammarRootAST(this);
    }

}
