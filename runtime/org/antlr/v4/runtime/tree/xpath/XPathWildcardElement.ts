/* java2ts: keep */

/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { java } from "jree";
import { XPath } from "./XPath";
import { XPathElement } from "./XPathElement";
import { ParseTree } from "../ParseTree";
import { Trees } from "../Trees";

export class XPathWildcardElement extends XPathElement {
    public constructor() {
        super(XPath.WILDCARD);
    }

    public evaluate = (t: ParseTree): java.util.Collection<ParseTree> => {
        if (this.invert) {
            return new java.util.ArrayList<ParseTree>();
        }
        // !* is weird but valid (empty)
        const kids: java.util.List<ParseTree> = new java.util.ArrayList<ParseTree>();
        for (const c of Trees.getChildren(t)) {
            kids.add(c as ParseTree);
        }

        return kids;
    };
}
