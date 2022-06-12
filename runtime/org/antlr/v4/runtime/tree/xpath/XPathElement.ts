/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */


/*
 eslint-disable @typescript-eslint/no-namespace, @typescript-eslint/naming-convention,
 max-classes-per-file, jsdoc/check-tag-names, @typescript-eslint/no-empty-function,
 @typescript-eslint/restrict-plus-operands, @typescript-eslint/unified-signatures, @typescript-eslint/member-ordering,
 no-underscore-dangle
*/

/* cspell: disable */



import { java } from "../../../../../../../lib/java/java";
import { ParseTree } from "../ParseTree";




export  class XPathElement {
	protected nodeName?:  string;
	protected invert:  boolean;

	/** Construct element like {@code /ID} or {@code ID} or {@code /*} etc...
	 *  op is null if just node
	 */
	public constructor(nodeName: string) {
		this.nodeName = nodeName;
	}

	/**
	 * Given tree rooted at {@code t} return all nodes matched by this path
	 * element.
	 */
	public abstract evaluate: (t: ParseTree) => java.util.Collection<ParseTree>;

	public toString = (): string => {
		let  inv: string = this.invert ? "!" : "";
		return this.getClass().getSimpleName()+"["+inv+this.nodeName+"]";
	}

	private getClass(): java.lang.Class<XPathElement> {
    // java2ts: auto generated
    return new java.lang.Class(XPathElement);
}

}
