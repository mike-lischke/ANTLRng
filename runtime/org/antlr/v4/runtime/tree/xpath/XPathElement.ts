/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */




import { java } from "../../../../../../../lib/java/java";
import { ParseTree } from "../ParseTree";


import { JavaObject } from "../../../../../../../lib/java/lang/Object";
import { S } from "../../../../../../../lib/templates";


export abstract  class XPathElement extends JavaObject {
	protected nodeName:  java.lang.String | null;
	protected invert:  boolean;

	/** Construct element like {@code /ID} or {@code ID} or {@code /*} etc...
	 *  op is null if just node
	 */
	public constructor(nodeName: java.lang.String| null) {
		super();
this.nodeName = nodeName;
	}

	/**
	 * Given tree rooted at {@code t} return all nodes matched by this path
	 * element.
	 */
	public abstract evaluate: (t: ParseTree| null) =>  java.util.Collection<ParseTree> | null;

	public toString = ():  java.lang.String | null => {
		let  inv: java.lang.String = this.invert ? S`!` : S``;
		return getClass().getSimpleName()+S`[`+inv+this.nodeName+S`]`;
	}
}
