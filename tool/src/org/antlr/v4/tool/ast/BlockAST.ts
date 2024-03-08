/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */


/* eslint-disable jsdoc/require-returns, jsdoc/require-param */


import { RuleElementAST } from "./RuleElementAST.js";
import { GrammarASTWithOptions } from "./GrammarASTWithOptions.js";
import { GrammarASTVisitor } from "./GrammarASTVisitor.js";
import { HashMap } from "antlr4ng";



export  class BlockAST extends GrammarASTWithOptions implements RuleElementAST {
    // TODO: maybe I need a Subrule object like Rule so these options mov to that?
    /** What are the default options for a subrule? */
    public static readonly  defaultBlockOptions =
            new  HashMap<string, string>();

    public static readonly  defaultLexerBlockOptions =
            new  HashMap<string, string>();

	public  constructor(node: BlockAST);

	public  constructor(t: Token);
    public  constructor(type: number);
    public  constructor(type: number, t: Token);
	public  constructor(type: number, t: Token, text: string);
    public constructor(...args: unknown[]) {
		switch (args.length) {
			case 1: {
				const [node] = args as [BlockAST];


		super(node);
	

				break;
			}

			case 1: {
				const [t] = args as [Token];

 super(t); 

				break;
			}

			case 1: {
				const [type] = args as [number];

 super(type); 

				break;
			}

			case 2: {
				const [type, t] = args as [number, Token];

 super(type, t); 

				break;
			}

			case 3: {
				const [type, t, text] = args as [number, Token, string];

 super(type,t,text); 

				break;
			}

			default: {
				throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
			}
		}
	}


	@Override
public override  dupNode():  BlockAST { return new  BlockAST(this); }

	@Override
public override  visit(v: GrammarASTVisitor):  Object { return v.visit(this); }
}
