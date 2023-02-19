/* java2ts: keep */

/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { java } from "jree";
import { XPathElement } from "./XPathElement";
import { ParseTree } from "../ParseTree";
import { Trees } from "../Trees";

/**
 * Either {@code ID} at start of path or {@code ...//ID} in middle of path.
 */
export class XPathRuleAnywhereElement extends XPathElement {
    protected ruleIndex: number;
    public constructor(ruleName: java.lang.String | null, ruleIndex: number) {
        super(ruleName);
        this.ruleIndex = ruleIndex;
    }

    public evaluate = (t: ParseTree): java.util.Collection<ParseTree> => {
        return Trees.findAllRuleNodes(t, this.ruleIndex);
    };
}
