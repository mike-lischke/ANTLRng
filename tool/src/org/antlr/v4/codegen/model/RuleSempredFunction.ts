/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { Rule } from "../../tool/Rule.js";
import { OutputModelFactory } from "../OutputModelFactory.js";
import { RuleActionFunction } from "./RuleActionFunction.js";

export class RuleSempredFunction extends RuleActionFunction {
    public constructor(factory: OutputModelFactory, r: Rule, ctxType: string) {
        super(factory, r, ctxType);
    }
}
