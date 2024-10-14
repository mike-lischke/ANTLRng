/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { Rule } from "../../tool/Rule.js";
import { OutputModelFactory } from "../OutputModelFactory.js";
import { Action } from "./Action.js";
import { OutputModelObject } from "./OutputModelObject.js";

export class RuleActionFunction extends OutputModelObject {
    public readonly name: string;
    public readonly escapedName: string;
    public readonly ctxType: string;
    public readonly ruleIndex: number;

    /** Map actionIndex to Action */
    public actions = new Map<number, Action>();

    public constructor(factory: OutputModelFactory, r: Rule, ctxType: string) {
        super(factory);
        this.name = r.name;
        this.escapedName = factory.getGenerator()!.getTarget().escapeIfNeeded(this.name);
        this.ruleIndex = r.index;
        this.ctxType = ctxType;
    }
}
