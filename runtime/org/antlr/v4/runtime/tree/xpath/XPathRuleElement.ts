/* java2ts: keep */

/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { java } from "jree";

import { XPathElement } from "./";
import { ParserRuleContext } from "../../";
import { ParseTree, Trees } from "../";

export class XPathRuleElement extends XPathElement {
    protected ruleIndex: number;
    public constructor(ruleName: java.lang.String | null, ruleIndex: number) {
        super(ruleName);
        this.ruleIndex = ruleIndex;
    }

    public evaluate = (t: ParseTree): java.util.Collection<ParseTree> => {
        // return all children of t that match nodeName
        const nodes: java.util.List<ParseTree> = new java.util.ArrayList<ParseTree>();
        for (const c of Trees.getChildren(t)) {
            if (c instanceof ParserRuleContext) {
                if ((c.getRuleIndex() === this.ruleIndex && !this.invert) ||
                    (c.getRuleIndex() !== this.ruleIndex && this.invert)) {
                    nodes.add(c);
                }
            }
        }

        return nodes;
    };
}
