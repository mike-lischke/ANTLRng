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

    public constructor(factory: OutputModelFactory, name: string, ctxName: string, optional: boolean);

    public constructor(factory: OutputModelFactory, name: string, ctxName: string, optional: boolean, signature: boolean);
    public constructor(...args: unknown[]) {
        switch (args.length) {
            case 4: {
                const [factory, name, ctxName, optional] = args as [OutputModelFactory, string, string, boolean];

                this(factory, name, ctxName, optional, false);

                break;
            }

            case 5: {
                const [factory, name, ctxName, optional, signature] = args as [OutputModelFactory, string, string, boolean, boolean];

                super(factory, name, signature);
                this.ctxName = ctxName;
                this.optional = optional;

                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }

    public override  getSignatureDecl(): ContextGetterDecl {
        return new ContextRuleGetterDecl($outer.factory, $outer.name, this.ctxName, this.optional, true);
    }
}
