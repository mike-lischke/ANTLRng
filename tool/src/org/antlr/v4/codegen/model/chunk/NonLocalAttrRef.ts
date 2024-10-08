/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { SymbolRefChunk } from "./SymbolRefChunk.js";
import { StructDecl } from "../decl/StructDecl.js";

export class NonLocalAttrRef extends SymbolRefChunk {
    public ruleName: string;
    public ruleIndex: number;

    public constructor(ctx: StructDecl, ruleName: string, name: string, escapedName: string, ruleIndex: number) {
        super(ctx, name, escapedName);
        this.ruleName = ruleName;
        this.ruleIndex = ruleIndex;
    }
}
