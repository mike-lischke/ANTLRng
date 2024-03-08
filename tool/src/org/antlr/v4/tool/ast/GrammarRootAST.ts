/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */


/* eslint-disable jsdoc/require-returns, jsdoc/require-param */


import { GrammarASTWithOptions } from "./GrammarASTWithOptions.js";
import { GrammarASTVisitor } from "./GrammarASTVisitor.js";
import { HashMap } from "antlr4ng";



export  class GrammarRootAST extends GrammarASTWithOptions {
	public static readonly  defaultOptions = new  HashMap<string, string>();

    public  grammarType:  number; // LEXER, PARSER, GRAMMAR (combined)
	public  hasErrors:  boolean;
	/** Track stream used to create this tree */

	public readonly  tokenStream:  TokenStream;
	public  cmdLineOptions:  Map<string, string>; // -DsuperClass=T on command line
	public  fileName:  string;

	public  constructor(node: GrammarRootAST);

	public  constructor(t: Token, tokenStream: TokenStream);

	public  constructor(type: number, t: Token, tokenStream: TokenStream);

	public  constructor(type: number, t: Token, text: string, tokenStream: TokenStream);
    public constructor(...args: unknown[]) {
		switch (args.length) {
			case 1: {
				const [node] = args as [GrammarRootAST];


		super(node);
		this.grammarType = node.grammarType;
		this.hasErrors = node.hasErrors;
		this.tokenStream = node.tokenStream;
	

				break;
			}

			case 2: {
				const [t, tokenStream] = args as [Token, TokenStream];


		super(t);
		if (tokenStream === null) {
			throw new  NullPointerException("tokenStream");
		}

		this.tokenStream = tokenStream;
	

				break;
			}

			case 3: {
				const [type, t, tokenStream] = args as [number, Token, TokenStream];


		super(type, t);
		if (tokenStream === null) {
			throw new  NullPointerException("tokenStream");
		}

		this.tokenStream = tokenStream;
	

				break;
			}

			case 4: {
				const [type, t, text, tokenStream] = args as [number, Token, string, TokenStream];


		super(type,t,text);
		if (tokenStream === null) {
			throw new  NullPointerException("tokenStream");
		}

		this.tokenStream = tokenStream;
    

				break;
			}

			default: {
				throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
			}
		}
	}


	public  getGrammarName():  string {
		let  t = java.util.prefs.AbstractPreferences.getChild(0);
		if ( t!==null ) {
 return t.getText();
}

		return null;
	}

	@Override
public override  getOptionString(key: string):  string {
		if ( this.cmdLineOptions!==null && this.cmdLineOptions.containsKey(key) ) {
			return this.cmdLineOptions.get(key);
		}
		let  value = super.getOptionString(key);
		if ( value===null ) {
			value = GrammarRootAST.defaultOptions.get(key);
		}
		return value;
	}

	@Override
public override  visit(v: GrammarASTVisitor):  Object { return v.visit(this); }

	@Override
public override  dupNode():  GrammarRootAST { return new  GrammarRootAST(this); }
	 static {
		GrammarRootAST.defaultOptions.put("language","Java");
	}
}
