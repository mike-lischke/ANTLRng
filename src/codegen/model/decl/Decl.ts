/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/* eslint-disable jsdoc/require-param, jsdoc/require-returns */

import { MurmurHash } from "../../../support/MurmurHash.js";
import { OutputModelFactory } from "../../OutputModelFactory.js";
import { SrcOp } from "../SrcOp.js";
import { ContextGetterDecl } from "./ContextGetterDecl.js";
import { StructDecl } from "./StructDecl.js";

export class Decl extends SrcOp {
    public readonly name: string;

    public readonly escapedName: string;

    public readonly decl?: string; // whole thing if copied from action

    public isLocal: boolean; // if local var (not in RuleContext struct)

    public ctx: StructDecl; // which context contains us? set by addDecl

    public constructor(factory: OutputModelFactory, name: string, decl?: string) {
        super(factory);
        this.name = name;
        this.escapedName = factory.getGenerator()!.getTarget().escapeIfNeeded(name);
        this.decl = decl;
    }

    public hashCode(): number {
        return MurmurHash.hashCode(this.name);
    }

    /** If same name, can't redefine, unless it's a getter */
    public equals(obj: object): boolean {
        if (this === obj) {
            return true;
        }

        if (!(obj instanceof Decl)) {
            return false;
        }

        // A() and label A are different
        if (obj instanceof ContextGetterDecl) {
            return false;
        }

        return this.name === obj.name;
    }
}
