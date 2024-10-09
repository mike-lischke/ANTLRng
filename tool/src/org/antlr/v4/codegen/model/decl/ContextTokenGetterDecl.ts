/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { ContextGetterDecl } from "./ContextGetterDecl.js";
import { OutputModelFactory } from "../../OutputModelFactory.js";

/** {@code public Token X() { }} */
export class ContextTokenGetterDecl extends ContextGetterDecl {
    public optional: boolean;

    public constructor(factory: OutputModelFactory, name: string, optional: boolean, signature?: boolean) {
        super(factory, name, signature);
        this.optional = optional;
    }

    public override getSignatureDecl(): ContextGetterDecl {
        return new ContextTokenGetterDecl(this.factory!, this.name, this.optional, true);
    }
}
