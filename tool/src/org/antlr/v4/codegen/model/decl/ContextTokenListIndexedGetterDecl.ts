/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { ContextGetterDecl } from "./ContextGetterDecl.js";
import { ContextTokenListGetterDecl } from "./ContextTokenListGetterDecl.js";

export class ContextTokenListIndexedGetterDecl extends ContextTokenListGetterDecl {
    public override getArgType(): string {
        return "int";
    }

    public override getSignatureDecl(): ContextGetterDecl {
        return new ContextTokenListIndexedGetterDecl(this.factory!, this.name, true);
    }
}
