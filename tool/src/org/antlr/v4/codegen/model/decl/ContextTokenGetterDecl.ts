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

    public constructor(factory: OutputModelFactory, name: string, optional: boolean);

    public constructor(factory: OutputModelFactory, name: string, optional: boolean, signature: boolean);
    public constructor(...args: unknown[]) {
        switch (args.length) {
            case 3: {
                const [factory, name, optional] = args as [OutputModelFactory, string, boolean];

                this(factory, name, optional, false);

                break;
            }

            case 4: {
                const [factory, name, optional, signature] = args as [OutputModelFactory, string, boolean, boolean];

                super(factory, name, signature);
                this.optional = optional;

                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }

    @Override
    public override  getSignatureDecl(): ContextGetterDecl {
        return new ContextTokenGetterDecl($outer.factory, $outer.name, this.optional, true);
    }
}
