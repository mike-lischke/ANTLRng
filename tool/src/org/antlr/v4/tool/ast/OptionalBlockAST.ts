/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */


/* eslint-disable jsdoc/require-returns, jsdoc/require-param */


import { RuleElementAST } from "./RuleElementAST.js";
import { QuantifierAST } from "./QuantifierAST.js";
import { GrammarASTVisitor } from "./GrammarASTVisitor.js";
import { GrammarAST } from "./GrammarAST.js";



export  class OptionalBlockAST extends GrammarAST implements RuleElementAST, QuantifierAST {
	private readonly  _greedy:  boolean;

	public  constructor(node: OptionalBlockAST);

	public  constructor(type: number, t: Token, nongreedy: Token);
    public constructor(...args: unknown[]) {
		switch (args.length) {
			case 1: {
				const [node] = args as [OptionalBlockAST];


		super(node);
		this._greedy = node._greedy;
	

				break;
			}

			case 3: {
				const [type, t, nongreedy] = args as [number, Token, Token];


		super(type, t);
		this._greedy = nongreedy === null;
	

				break;
			}

			default: {
				throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
			}
		}
	}


	@Override
public  isGreedy():  boolean {
		return this._greedy;
	}

	@Override
public override  dupNode():  OptionalBlockAST { return new  OptionalBlockAST(this); }

	@Override
public override  visit(v: GrammarASTVisitor):  Object { return v.visit(this); }

}
