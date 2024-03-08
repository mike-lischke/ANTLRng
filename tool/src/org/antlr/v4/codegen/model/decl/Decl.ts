/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */


/* eslint-disable jsdoc/require-returns, jsdoc/require-param */


import { StructDecl } from "./StructDecl.js";
import { ContextGetterDecl } from "./ContextGetterDecl.js";
import { OutputModelFactory } from "../../OutputModelFactory.js";
import { SrcOp } from "../SrcOp.js";



/** */
export  class Decl extends SrcOp {
	public readonly  name:  string;
	public readonly  escapedName:  string;
	public readonly  decl:  string; 	// whole thing if copied from action
	public  isLocal:  boolean; // if local var (not in RuleContext struct)
	public  ctx:  StructDecl;  // which context contains us? set by addDecl

	public  constructor(factory: OutputModelFactory, name: string);

	public  constructor(factory: OutputModelFactory, name: string, decl: string);
    public constructor(...args: unknown[]) {
		switch (args.length) {
			case 2: {
				const [factory, name] = args as [OutputModelFactory, string];


		this(factory, name, null);
	

				break;
			}

			case 3: {
				const [factory, name, decl] = args as [OutputModelFactory, string, string];


		super(factory);
		this.name = name;
		this.escapedName = factory.getGenerator().getTarget().escapeIfNeeded(name);
		this.decl = decl;
	

				break;
			}

			default: {
				throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
			}
		}
	}


	@Override
public override  hashCode():  number {
		return this.name.hashCode();
	}

	/** If same name, can't redefine, unless it's a getter */
	@Override
public override  equals(obj: Object):  boolean {
		if ( this===obj ) {
 return true;
}

		if ( !(obj instanceof Decl) ) {
 return false;
}

		// A() and label A are different
		if ( obj instanceof ContextGetterDecl ) {
 return false;
}

		return this.name.equals(( obj as Decl).name);
	}
}
