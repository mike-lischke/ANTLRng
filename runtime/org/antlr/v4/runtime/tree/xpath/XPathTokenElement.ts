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
import { XPathElement } from "./XPathElement";
import { ParseTree } from "../ParseTree";
import { TerminalNode } from "../TerminalNode";
import { Tree } from "../Tree";
import { Trees } from "../Trees";




export  class XPathTokenElement extends XPathElement {
	protected tokenType:  number;
	public constructor(tokenName: string, tokenType: number) {
		super(tokenName);
		this.tokenType = tokenType;
	}

	public evaluate = (t: ParseTree): java.util.Collection<ParseTree> => {
		// return all children of t that match nodeName
		let  nodes: java.util.List<ParseTree> = new  java.util.ArrayList<ParseTree>();
		for (let c of Trees.getChildren(t)) {
			if ( c instanceof TerminalNode ) {
				let  tnode: TerminalNode = c as TerminalNode;
				if ( (tnode.getSymbol().getType() === this.tokenType && !this.invert) ||
					 (tnode.getSymbol().getType() !== this.tokenType && this.invert) )
				{
					nodes.add(tnode);
				}
			}
		}
		return nodes;
	}
}
