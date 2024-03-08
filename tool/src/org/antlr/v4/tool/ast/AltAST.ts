/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */


/* eslint-disable jsdoc/require-returns, jsdoc/require-param */


import { GrammarASTWithOptions } from "./GrammarASTWithOptions.js";
import { GrammarASTVisitor } from "./GrammarASTVisitor.js";
import { GrammarAST } from "./GrammarAST.js";
import { LeftRecursiveRuleAltInfo } from "../../analysis/LeftRecursiveRuleAltInfo.js";
import { Alternative } from "../Alternative.js";



/** Any ALT (which can be child of ALT_REWRITE node) */
export  class AltAST extends GrammarASTWithOptions {
	public  alt:  Alternative;

	/** If we transformed this alt from a left-recursive one, need info on it */
	public  leftRecursiveAltInfo:  LeftRecursiveRuleAltInfo;

	/** If someone specified an outermost alternative label with #foo.
	 *  Token type will be ID.
	 */
	public  altLabel:  GrammarAST;

	public  constructor(node: AltAST);

	public  constructor(t: Token);
	public  constructor(type: number);
	public  constructor(type: number, t: Token);
	public  constructor(type: number, t: Token, text: string);
    public constructor(...args: unknown[]) {
		switch (args.length) {
			case 1: {
				const [node] = args as [AltAST];


		super(node);
		this.alt = node.alt;
		this.altLabel = node.altLabel;
		this.leftRecursiveAltInfo = node.leftRecursiveAltInfo;
	

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
public override  dupNode():  AltAST { return new  AltAST(this); }

	@Override
public override  visit(v: GrammarASTVisitor):  Object { return v.visit(this); }
}
