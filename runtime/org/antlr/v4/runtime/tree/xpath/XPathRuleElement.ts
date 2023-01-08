/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */




import { java } from "../../../../../../../lib/java/java";
import { XPathElement } from "./XPathElement";
import { ParserRuleContext } from "../../ParserRuleContext";
import { ParseTree } from "../ParseTree";
import { Tree } from "../Tree";
import { Trees } from "../Trees";




export  class XPathRuleElement extends XPathElement {
	protected ruleIndex:  number;
	public constructor(ruleName: java.lang.String| null, ruleIndex: number) {
		super(ruleName);
		this.ruleIndex = ruleIndex;
	}

	public evaluate = (t: ParseTree| null):  java.util.Collection<ParseTree> | null => {
				// return all children of t that match nodeName
		let  nodes: java.util.List<ParseTree> = new  java.util.ArrayList<ParseTree>();
		for (let c of Trees.getChildren(t)) {
			if ( c instanceof ParserRuleContext ) {
				let  ctx: ParserRuleContext = c as ParserRuleContext;
				if ( (ctx.getRuleIndex() === this.ruleIndex && !this.invert) ||
					 (ctx.getRuleIndex() !== this.ruleIndex && this.invert) )
				{
					nodes.add(ctx);
				}
			}
		}
		return nodes;
	}
}
