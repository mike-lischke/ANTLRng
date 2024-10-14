/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { ContextGetterDecl } from "./ContextGetterDecl.js";
import { OutputModelFactory } from "../../OutputModelFactory.js";

/** {@code public XContext X() { }} */
export class ContextRuleGetterDecl extends ContextGetterDecl {
    public ctxName: string;
    public optional: boolean;

    public constructor(factory: OutputModelFactory, name: string, ctxName: string, optional: boolean,
        signature?: boolean) {
        super(factory, name, signature);
        this.ctxName = ctxName;
        this.optional = optional;
    }

    public override getSignatureDecl(): ContextGetterDecl {
        return new ContextRuleGetterDecl(this.factory!, this.name, this.ctxName, this.optional, true);
    }
}
