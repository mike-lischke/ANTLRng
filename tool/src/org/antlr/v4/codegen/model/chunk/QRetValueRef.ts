/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { RetValueRef } from "./RetValueRef.js";
import { StructDecl } from "../decl/StructDecl.js";

/** */
export class QRetValueRef extends RetValueRef {
    public readonly dict: string;

    public constructor(ctx: StructDecl, dict: string, name: string, escapedName: string) {
        super(ctx, name, escapedName);
        this.dict = dict;
    }
}
