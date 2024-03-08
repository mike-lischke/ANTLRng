/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */


/* eslint-disable jsdoc/require-returns, jsdoc/require-param */


import { RuleElementAST } from "./RuleElementAST.js";
import { GrammarASTVisitor } from "./GrammarASTVisitor.js";
import { GrammarAST } from "./GrammarAST.js";



export  class NotAST extends GrammarAST implements RuleElementAST {

	public  constructor(node: NotAST);

	public  constructor(type: number, t: Token);
    public constructor(...args: unknown[]) {
		switch (args.length) {
			case 1: {
				const [node] = args as [NotAST];


		super(node);
	

				break;
			}

			case 2: {
				const [type, t] = args as [number, Token];

 super(type, t); 

				break;
			}

			default: {
				throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
			}
		}
	}


	@Override
public override  dupNode():  NotAST {
		return new  NotAST(this);
	}

	@Override
public override  visit(v: GrammarASTVisitor):  Object { return v.visit(this); }
}
