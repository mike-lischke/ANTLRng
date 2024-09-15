/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { OutputModelObject } from "./OutputModelObject.js";
import { ModelElement } from "./ModelElement.js";
import { Action } from "./Action.js";
import { OutputModelFactory } from "../OutputModelFactory.js";
import { Rule } from "../../tool/Rule.js";
import { LinkedHashMap as HashMap } from "antlr4ng";

export class RuleActionFunction extends OutputModelObject {
    public readonly name: string;
    public readonly escapedName: string;
    public readonly ctxType: string;
    public readonly ruleIndex: number;

    /** Map actionIndex to Action */
    @ModelElement
    public actions =
        new LinkedHashMap<number, Action>();

    public constructor(factory: OutputModelFactory, r: Rule, ctxType: string) {
        super(factory);
        this.name = r.name;
        this.escapedName = factory.getGenerator().getTarget().escapeIfNeeded(this.name);
        this.ruleIndex = r.index;
        this.ctxType = ctxType;
    }
}
