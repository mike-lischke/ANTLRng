/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { ModelElement } from "../../../misc/ModelElement.js";
import { StructDecl } from "../decl/StructDecl.js";
import { ActionChunk } from "./ActionChunk.js";
import { SymbolRefChunk } from "./SymbolRefChunk.js";

export class SetAttr extends SymbolRefChunk {
    @ModelElement
    public rhsChunks: ActionChunk[];

    public constructor(ctx: StructDecl, name: string, escapedName: string, rhsChunks: ActionChunk[]) {
        super(ctx, name, escapedName);
        this.rhsChunks = rhsChunks;
    }
}
