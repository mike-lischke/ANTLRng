/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */




import { java } from "jree";
import { XPathElement } from "./XPathElement";
import { ParseTree } from "../ParseTree";
import { TerminalNode } from "../TerminalNode";
import { Tree } from "../Tree";
import { Trees } from "../Trees";




export class XPathTokenElement extends XPathElement {
	protected tokenType:  number;
	public constructor(tokenName: java.lang.String| null, tokenType: number) {
		super(tokenName);
		this.tokenType = tokenType;
	}

	public evaluate = (t: ParseTree| null):  java.util.Collection<ParseTree> | null => {
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
