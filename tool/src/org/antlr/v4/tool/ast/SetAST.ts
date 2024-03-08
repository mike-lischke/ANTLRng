/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */


/* eslint-disable jsdoc/require-returns, jsdoc/require-param */


import { RuleElementAST } from "./RuleElementAST.js";
import { GrammarASTVisitor } from "./GrammarASTVisitor.js";
import { GrammarAST } from "./GrammarAST.js";



export  class SetAST extends GrammarAST implements RuleElementAST {

	public  constructor(node: SetAST);

	public  constructor(type: number, t: Token, text: string);
    public constructor(...args: unknown[]) {
		switch (args.length) {
			case 1: {
				const [node] = args as [SetAST];


		super(node);
	

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
public override  dupNode():  SetAST {
		return new  SetAST(this);
	}

	@Override
public override  visit(v: GrammarASTVisitor):  Object { return v.visit(this); }
}
