/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */


/* eslint-disable jsdoc/require-returns, jsdoc/require-param */


import { RuleElementAST } from "./RuleElementAST.js";
import { GrammarASTWithOptions } from "./GrammarASTWithOptions.js";
import { GrammarASTVisitor } from "./GrammarASTVisitor.js";



export  class RuleRefAST extends GrammarASTWithOptions implements RuleElementAST {
	public  constructor(node: RuleRefAST);

	public  constructor(t: Token);
    public  constructor(type: number);
    public  constructor(type: number, t: Token);
    public constructor(...args: unknown[]) {
		switch (args.length) {
			case 1: {
				const [node] = args as [RuleRefAST];


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

			default: {
				throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
			}
		}
	}


	/** Dup token too since we overwrite during LR rule transform */
	@Override
public override  dupNode():  RuleRefAST {
		let  r = new  RuleRefAST(this);
		// In LR transform, we alter original token stream to make e -> e[n]
		// Since we will be altering the dup, we need dup to have the
		// original token.  We can set this tree (the original) to have
		// a new token.
		r.token = this.token;
		this.token = new  CommonToken(r.token);
		return r;
	}

	@Override
public override  visit(v: GrammarASTVisitor):  Object { return v.visit(this); }
}
