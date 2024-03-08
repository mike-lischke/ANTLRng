/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */


/* eslint-disable jsdoc/require-returns, jsdoc/require-param */


import { GrammarAST } from "./GrammarAST.js";
import { ActionAST } from "./ActionAST.js";
import { CharSupport } from "../../misc/CharSupport.js";
import { ErrorType } from "../ErrorType.js";
import { HashMap } from "antlr4ng";



export abstract  class GrammarASTWithOptions extends GrammarAST {
    protected  options:  Map<string, GrammarAST>;

	public  constructor(node: GrammarASTWithOptions);

	public  constructor(t: Token);
    public  constructor(type: number);
    public  constructor(type: number, t: Token);
    public  constructor(type: number, t: Token, text: string);
    public constructor(...args: unknown[]) {
		switch (args.length) {
			case 1: {
				const [node] = args as [GrammarASTWithOptions];


		super(node);
		this.options = node.options;
	

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


    public  setOption(key: string, node: GrammarAST):  void {
        if ( this.options===null ) {
 this.options = new  HashMap<string, GrammarAST>();
}

        this.options.put(key, node);
    }

	public  getOptionString(key: string):  string {
		let  value = this.getOptionAST(key);
		if ( value === null ) {
 return null;
}

		if ( value instanceof ActionAST ) {
			return value.getText();
		}
		else {
			let  v = value.getText();
			if ( v.startsWith("'") || v.startsWith("\"") ) {
				v = CharSupport.getStringFromGrammarStringLiteral(v);
				if (v === null) {
					this.g.tool.errMgr.grammarError(ErrorType.INVALID_ESCAPE_SEQUENCE, this.g.fileName, value.getToken(), value.getText());
					v = "";
				}
			}
			return v;
		}
	}

	/** Gets AST node holding value for option key; ignores default options
	 *  and command-line forced options.
	 */
    public  getOptionAST(key: string):  GrammarAST {
        if ( this.options===null ) {
 return null;
}

        return this.options.get(key);
    }

	public  getNumberOfOptions():  number {
		return this.options===null ? 0 : this.options.size();
	}

	@Override
public override abstract  dupNode():  GrammarASTWithOptions;


	public  getOptions():  Map<string, GrammarAST> {
		if (this.options === null) {
			return Collections.emptyMap();
		}

		return this.options;
	}
}
