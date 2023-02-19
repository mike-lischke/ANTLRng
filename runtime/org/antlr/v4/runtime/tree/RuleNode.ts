/* java2ts: keep */

/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { ParseTree } from "./ParseTree";
import { RuleContext } from "../RuleContext";

export interface RuleNode extends ParseTree {
    getRuleContext: () => RuleContext | null;
}

export const isRuleNode = (o: unknown): o is RuleNode => {
    return typeof (o as RuleNode).getRuleContext === "function";
};
