/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */


/* eslint-disable jsdoc/require-returns, jsdoc/require-param */


import { RuleElementAST } from "./RuleElementAST.js";
import { GrammarASTWithOptions } from "./GrammarASTWithOptions.js";
import { GrammarASTVisitor } from "./GrammarASTVisitor.js";
import { GrammarAST } from "./GrammarAST.js";
import { AttributeResolver } from "../AttributeResolver.js";



export  class ActionAST extends GrammarASTWithOptions implements RuleElementAST {
	public  resolver:  AttributeResolver;
	public  chunks:  Array<Token>;
    // Alt, rule, grammar space
	protected  scope = null; // useful for ANTLR IDE developers

	public  constructor(node: ActionAST);

	public  constructor(t: Token);
    public  constructor(type: number);
    public  constructor(type: number, t: Token);
    public constructor(...args: unknown[]) {
		switch (args.length) {
			case 1: {
				const [node] = args as [ActionAST];


		super(node);
		this.resolver = node.resolver;
		this.chunks = node.chunks;
	

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


	@Override
public override  dupNode():  ActionAST { return new  ActionAST(this); }

	@Override
public override  visit(v: GrammarASTVisitor):  Object { return v.visit(this); }

	public  setScope(scope: GrammarAST):  void {
		this.scope = scope;
	}

	public  getScope():  GrammarAST {
		return this.scope;
	}


}
