/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/* eslint-disable jsdoc/require-returns, jsdoc/require-param */

import { SymbolRefChunk } from "./SymbolRefChunk.js";
import { ActionChunk } from "./ActionChunk.js";
import { ModelElement } from "../ModelElement.js";
import { StructDecl } from "../decl/StructDecl.js";

/** */
export  class SetAttr extends SymbolRefChunk {
    @ModelElement
    public  rhsChunks:  ActionChunk[];

    public  constructor(ctx: StructDecl, name: string, escapedName: string, rhsChunks: ActionChunk[]) {
        super(ctx, name, escapedName);
        this.rhsChunks = rhsChunks;
    }
}
