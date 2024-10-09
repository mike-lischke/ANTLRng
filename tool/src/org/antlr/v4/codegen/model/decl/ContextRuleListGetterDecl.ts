/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { ContextGetterDecl } from "./ContextGetterDecl.js";
import { OutputModelFactory } from "../../OutputModelFactory.js";

/**
 * {@code public List<XContext> X() { }
 *  public XContext X(int i) { }}
 */
export class ContextRuleListGetterDecl extends ContextGetterDecl {
    public ctxName: string;

    public constructor(factory: OutputModelFactory, name: string, ctxName: string, signature?: boolean) {
        super(factory, name, signature);
        this.ctxName = ctxName;
    }

    public override getSignatureDecl(): ContextGetterDecl {
        return new ContextRuleListGetterDecl(this.factory!, this.name, this.ctxName, true);
    }
}
