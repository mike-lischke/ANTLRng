/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { Decl } from "./Decl.js";
import { OutputModelFactory } from "../../OutputModelFactory.js";

export class RuleContextDecl extends Decl {
    public ctxName: string;
    public isImplicit: boolean;

    public constructor(factory: OutputModelFactory, name: string, ctxName: string) {
        super(factory, name);
        this.ctxName = ctxName;
    }
}
