/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { OutputModelFactory } from "../../OutputModelFactory.js";
import { RuleContextDecl } from "./RuleContextDecl.js";

export class RuleContextListDecl extends RuleContextDecl {
    public constructor(factory: OutputModelFactory, name: string, ctxName: string) {
        super(factory, name, ctxName);
        this.isImplicit = false;
    }
}
