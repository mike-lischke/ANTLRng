/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
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
    public constructor(factory: OutputModelFactory, name: string, ctxName: string);

    public constructor(factory: OutputModelFactory, name: string, ctxName: string, signature: boolean);
    public constructor(...args: unknown[]) {
        switch (args.length) {
            case 3: {
                const [factory, name, ctxName] = args as [OutputModelFactory, string, string];

                this(factory, name, ctxName, false);

                break;
            }

            case 4: {
                const [factory, name, ctxName, signature] = args as [OutputModelFactory, string, string, boolean];

                super(factory, name, signature);
                this.ctxName = ctxName;

                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }

    @Override
    public override  getSignatureDecl(): ContextGetterDecl {
        return new ContextRuleListGetterDecl($outer.factory, $outer.name, this.ctxName, true);
    }
}
