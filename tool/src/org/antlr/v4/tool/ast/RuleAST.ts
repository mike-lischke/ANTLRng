/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */


/* eslint-disable jsdoc/require-returns, jsdoc/require-param */


import { GrammarASTWithOptions } from "./GrammarASTWithOptions.js";
import { GrammarASTVisitor } from "./GrammarASTVisitor.js";
import { GrammarAST } from "./GrammarAST.js";
import { ActionAST } from "./ActionAST.js";
import { Grammar } from "../Grammar.js";



export  class RuleAST extends GrammarASTWithOptions {
	public  constructor(node: RuleAST);

	public  constructor(t: Token);
    public  constructor(type: number);
    public constructor(...args: unknown[]) {
		switch (args.length) {
			case 1: {
				const [node] = args as [RuleAST];


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

			default: {
				throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
			}
		}
	}


	public  isLexerRule():  boolean {
		let  name = this.getRuleName();
		return name!==null && Grammar.isTokenName(name);
	}

	public  getRuleName():  string {
		let  nameNode = java.util.prefs.AbstractPreferences.getChild(0) as GrammarAST;
		if ( nameNode!==null ) {
 return nameNode.getText();
}

		return null;
	}

	@Override
public override  dupNode():  RuleAST { return new  RuleAST(this); }

	public  getLexerAction():  ActionAST {
		let  blk = getFirstChildWithType(ANTLRParser.BLOCK);
		if ( blk.getChildCount()===1 ) {
			let  onlyAlt = blk.getChild(0);
			let  lastChild = onlyAlt.getChild(onlyAlt.getChildCount()-1);
			if ( lastChild.getType()===ANTLRParser.ACTION ) {
				return lastChild as ActionAST;
			}
		}
		return null;
	}

	@Override
public override  visit(v: GrammarASTVisitor):  Object { return v.visit(this); }
}
