/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */


/* eslint-disable jsdoc/require-returns, jsdoc/require-param */


import { ContextRuleListGetterDecl } from "./ContextRuleListGetterDecl.js";
import { ContextGetterDecl } from "./ContextGetterDecl.js";
import { OutputModelFactory } from "../../OutputModelFactory.js";



export  class ContextRuleListIndexedGetterDecl extends ContextRuleListGetterDecl {
	public  constructor(factory: OutputModelFactory, name: string, ctxName: string);

	public  constructor(factory: OutputModelFactory, name: string, ctxName: string, signature: boolean);
    public constructor(...args: unknown[]) {
		switch (args.length) {
			case 3: {
				const [factory, name, ctxName] = args as [OutputModelFactory, string, string];


		this(factory, name, ctxName, false);
	

				break;
			}

			case 4: {
				const [factory, name, ctxName, signature] = args as [OutputModelFactory, string, string, boolean];


		super(factory, name, ctxName, signature);
	

				break;
			}

			default: {
				throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
			}
		}
	}


	@Override
public override  getArgType():  string {
		return "int";
	}

	@Override
public override  getSignatureDecl():  ContextGetterDecl {
		return new  ContextRuleListIndexedGetterDecl($outer.factory, $outer.name, this.ctxName, true);
	}
}
