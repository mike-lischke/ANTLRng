/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { ContextGetterDecl } from "./ContextGetterDecl.js";

/**
 * {@code public List<Token> X() { }
 *  public Token X(int i) { }}
 */
export class ContextTokenListGetterDecl extends ContextGetterDecl {
    public override getSignatureDecl(): ContextGetterDecl {
        return new ContextTokenListGetterDecl(this.factory!, this.name, true);
    }
}
