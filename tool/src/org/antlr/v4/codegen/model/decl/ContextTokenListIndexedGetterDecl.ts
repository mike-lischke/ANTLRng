/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { Decl } from "./Decl.js";
import { ContextTokenListGetterDecl } from "./ContextTokenListGetterDecl.js";
import { ContextGetterDecl } from "./ContextGetterDecl.js";
import { OutputModelFactory } from "../../OutputModelFactory.js";

export class ContextTokenListIndexedGetterDecl extends ContextTokenListGetterDecl {
    public constructor(factory: OutputModelFactory, name: string);

    public constructor(factory: OutputModelFactory, name: string, signature: boolean);
    public constructor(...args: unknown[]) {
        switch (args.length) {
            case 2: {
                const [factory, name] = args as [OutputModelFactory, string];

                this(factory, name, false);

                break;
            }

            case 3: {
                const [factory, name, signature] = args as [OutputModelFactory, string, boolean];

                super(factory, name, signature);

                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }

    @Override
    public override  getArgType(): string {
        return "int";
    }

    @Override
    public override  getSignatureDecl(): ContextGetterDecl {
        return new ContextTokenListIndexedGetterDecl($outer.factory, $outer.name, true);
    }
}
