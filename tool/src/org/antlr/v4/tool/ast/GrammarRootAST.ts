/* java2ts: keep */

/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/* eslint-disable jsdoc/require-returns, jsdoc/require-param */

import { type Token, type TokenStream } from "antlr4ng";

import { GrammarASTVisitor } from "./GrammarASTVisitor.js";
import { GrammarASTWithOptions } from "./GrammarASTWithOptions.js";

export class GrammarRootAST extends GrammarASTWithOptions {
    public static readonly defaultOptions = new Map<string, string>();

    public grammarType: number; // LEXER, PARSER, GRAMMAR (combined)
    public hasErrors: boolean;

    /** Track stream used to create this tree */
    public readonly tokenStream: TokenStream;
    public cmdLineOptions: Map<string, string>; // -DsuperClass=T on command line
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
                const [t, tokenStream] = args as [Token, TokenStream];

                super(t);
                if (tokenStream == null) {
                    throw new Error("tokenStream");
                }

                this.tokenStream = tokenStream;

                break;
            }

            case 3: {
                const [type, t, tokenStream] = args as [number, Token, TokenStream];

                super(type, t);
                if (tokenStream == null) {
                    throw new Error("tokenStream");
                }

                this.tokenStream = tokenStream;

                break;
            }

            case 4: {
                const [type, t, text, tokenStream] = args as [number, Token, string, TokenStream];

                super(type, t, text);
                if (tokenStream == null) {
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

    public override  getOptionString(key: string): string | null {
        if (this.cmdLineOptions !== null && this.cmdLineOptions.has(key)) {
            return this.cmdLineOptions.get(key) ?? null;
        }

        let value = super.getOptionString(key);
        if (value === null) {
            value = GrammarRootAST.defaultOptions.get(key) ?? null;
        }

        return value;
    }

    public override  visit<T>(v: GrammarASTVisitor<T>): T {
        return v.visit(this);
    }

    public override  dupNode(): GrammarRootAST { return new GrammarRootAST(this); }

    static {
        GrammarRootAST.defaultOptions.set("language", "Java");
    }
}
