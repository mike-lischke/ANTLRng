/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/* eslint-disable jsdoc/require-returns, jsdoc/require-param */

import { Rule } from "./Rule.js";
import { Grammar } from "./Grammar.js";
import { AttributeResolver } from "./AttributeResolver.js";
import { ANTLRToolListener } from "./ANTLRToolListener.js";
import { Tool } from "../Tool.js";
import { MultiMap } from "antlr4ng";
import { GrammarRootAST } from "./ast/GrammarRootAST.js";

/** */
export  class LexerGrammar extends Grammar {
    public static readonly  DEFAULT_MODE_NAME = "DEFAULT_MODE";

	/** The grammar from which this lexer grammar was derived (if implicit) */
    public  implicitLexerOwner:  Grammar;

	/** DEFAULT_MODE rules are added first due to grammar syntax order */
    public  modes:  MultiMap<string, Rule>;

    public  constructor(grammarText: string);

    public  constructor(tool: Tool, ast: GrammarRootAST);

    public  constructor(grammarText: string, listener: ANTLRToolListener);

    public  constructor(fileName: string, grammarText: string, listener: ANTLRToolListener);
    public constructor(...args: unknown[]) {
        switch (args.length) {
            case 1: {
                const [grammarText] = args as [string];

                super(grammarText);

                break;
            }

            case 2: {
                const [tool, ast] = args as [Tool, GrammarRootAST];

                super(tool, ast);

                break;
            }

            case 2: {
                const [grammarText, listener] = args as [string, ANTLRToolListener];

                super(grammarText, listener);

                break;
            }

            case 3: {
                const [fileName, grammarText, listener] = args as [string, string, ANTLRToolListener];

                super(fileName, grammarText, listener);

                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }

    @Override
    public override  defineRule(r: Rule):  boolean {
        if (!super.defineRule(r)) {
            return false;
        }

        if ( this.modes===null ) {
            this.modes = new  MultiMap<string, Rule>();
        }

        this.modes.map(r.mode, r);

        return true;
    }

    @Override
    public override  undefineRule(r: Rule):  boolean {
        if (!super.undefineRule(r)) {
            return false;
        }

        const  removed = this.modes.get(r.mode).remove(r);

		/* assert removed; */
        return true;
    }
}
