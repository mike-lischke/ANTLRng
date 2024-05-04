/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/* eslint-disable jsdoc/require-returns, jsdoc/require-param */

import { Decl } from "./Decl.js";
import { OutputModelFactory } from "../../OutputModelFactory.js";
import { MurmurHash } from "antlr4ng";

export abstract  class ContextGetterDecl extends Decl { // assume no args

    public readonly  signature:  boolean;
    public  constructor(factory: OutputModelFactory, name: string);

    public  constructor(factory: OutputModelFactory, name: string, signature: boolean);
    public constructor(...args: unknown[]) {
        switch (args.length) {
            case 2: {
                const [factory, name] = args as [OutputModelFactory, string];

                this(factory, name, false);

                break;
            }

            case 3: {
                const [factory, name, signature] = args as [OutputModelFactory, string, boolean];

                super(factory, name);
                this.signature = signature;

                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }

	/**
	 * Not used for output; just used to distinguish between decl types
	 *  to avoid dups.
	 */
    public  getArgType():  string { return ""; }

    @Override
    public override  hashCode():  number {
        let  hash = MurmurHash.initialize();
        hash = MurmurHash.update(hash, this.name);
        hash = MurmurHash.update(hash, this.getArgType());
        hash = MurmurHash.finish(hash, 2);

        return hash;
    }

	/**
	 * Make sure that a getter does not equal a label. X() and X are ok.
	 *  OTOH, treat X() with two diff return values as the same.  Treat
	 *  two X() with diff args as different.
	 */
    @Override
    public override  equals(obj: Object):  boolean {
        if ( this===obj ) {
            return true;
        }

		// A() and label A are different
        if ( !(obj instanceof ContextGetterDecl) ) {
            return false;
        }

        return this.name.equals(( obj as Decl).name) &&
				this.getArgType().equals(( obj).getArgType());
    }
    protected abstract  getSignatureDecl():  ContextGetterDecl; ;
}
