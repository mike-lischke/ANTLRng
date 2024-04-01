/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */


/* eslint-disable jsdoc/require-returns, jsdoc/require-param */


import { GrammarAST } from "../tool/ast/GrammarAST.js";
import { GrammarASTErrorNode } from "../tool/ast/GrammarASTErrorNode.js";
import { RuleAST } from "../tool/ast/RuleAST.js";
import { TerminalAST } from "../tool/ast/TerminalAST.js";



export class GrammarASTAdaptor extends CommonTreeAdaptor {
    protected input: org.antlr.runtime.CharStream; // where we can find chars ref'd by tokens in tree
    public constructor();
    public constructor(input: org.antlr.runtime.CharStream);
    public constructor(...args: unknown[]) {
        switch (args.length) {
            case 0: {


                break;
            }

            case 1: {
                const [input] = args as [org.antlr.runtime.CharStream];

                this.input = input;

                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }


    @Override
    public create(token: Token): Object;

    @Override
    public create(tokenType: number, text: string): Object;
    public create(...args: unknown[]): Object {
        switch (args.length) {
            case 1: {
                const [token] = args as [Token];


                return new GrammarAST(token);


                break;
            }

            case 2: {
                const [tokenType, text] = args as [number, string];


                let t: GrammarAST;
                if (tokenType === ANTLRParser.RULE) {
                    // needed by TreeWizard to make RULE tree
                    t = new RuleAST(new CommonToken(tokenType, text));
                }
                else {
                    if (tokenType === ANTLRParser.STRING_LITERAL) {
                        // implicit lexer construction done with wizard; needs this node type
                        // whereas grammar ANTLRParser.g can use token option to spec node type
                        t = new TerminalAST(new CommonToken(tokenType, text));
                    }
                    else {
                        t = super.create(tokenType, text) as GrammarAST;
                    }
                }

                t.token.setInputStream(this.input);
                return t;


                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }


    @Override
    public dupNode(t: Object): Object {
        if (t === null) {
            return null;
        }

        return (t as GrammarAST).dupNode(); //create(((GrammarAST)t).token);
    }

    @Override
    public errorNode(input: org.antlr.runtime.TokenStream, start: org.antlr.runtime.Token, stop: org.antlr.runtime.Token,
        e: org.antlr.runtime.RecognitionException): Object {
        return new GrammarASTErrorNode(input, start, stop, e);
    }
}
