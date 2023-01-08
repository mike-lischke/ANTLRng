/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */




import { java } from "../../../../../../../lib/java/java";
import { XPath } from "./XPath";
import { XPathElement } from "./XPathElement";
import { ParseTree } from "../ParseTree";
import { Tree } from "../Tree";
import { Trees } from "../Trees";




export  class XPathWildcardElement extends XPathElement {
	public constructor() {
		super(XPath.WILDCARD);
	}

	public evaluate = (/* final */  t: ParseTree| null):  java.util.Collection<ParseTree> | null => {
		if ( this.invert ) {
 return new  java.util.ArrayList<ParseTree>();
}
 // !* is weird but valid (empty)
		let  kids: java.util.List<ParseTree> = new  java.util.ArrayList<ParseTree>();
		for (let c of Trees.getChildren(t)) {
			kids.add(c as ParseTree);
		}
		return kids;
	}
}
