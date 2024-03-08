/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */


/* eslint-disable jsdoc/require-returns, jsdoc/require-param */


import { StructDecl } from "./StructDecl.js";
import { OutputModelFactory } from "../../OutputModelFactory.js";
import { DispatchMethod } from "../DispatchMethod.js";
import { ListenerDispatchMethod } from "../ListenerDispatchMethod.js";
import { VisitorDispatchMethod } from "../VisitorDispatchMethod.js";
import { Rule } from "../../../tool/Rule.js";



/** A StructDecl to handle a -&gt; label on alt */
export  class AltLabelStructDecl extends StructDecl {
	public  altNum:  number;
	public  parentRule:  string;
	public  constructor(factory: OutputModelFactory, r: Rule,
							  altNum: number, label: string)
	{
		// override name set in super to the label ctx
		super(factory, r, factory.getGenerator().getTarget().getAltLabelContextStructName(label));
		this.altNum = altNum;
		this.parentRule = r.name;
		this.derivedFromName = label;
	}

	@Override
public override  addDispatchMethods(r: Rule):  void {
		this.dispatchMethods = new  Array<DispatchMethod>();
		if ( $outer.factory.getGrammar().tool.gen_listener ) {
			this.dispatchMethods.add(new  ListenerDispatchMethod($outer.factory, true));
			this.dispatchMethods.add(new  ListenerDispatchMethod($outer.factory, false));
		}
		if ( $outer.factory.getGrammar().tool.gen_visitor ) {
			this.dispatchMethods.add(new  VisitorDispatchMethod($outer.factory));
		}
	}

	@Override
public override  hashCode():  number {
		return $outer.name.hashCode();
	}

	@Override
public override  equals(obj: Object):  boolean {
		if ( obj === this ) {
 return true;
}

		if (!(obj instanceof AltLabelStructDecl)) {
 return false;
}


		return $outer.name.equals((obj as AltLabelStructDecl).name);
	}
}
