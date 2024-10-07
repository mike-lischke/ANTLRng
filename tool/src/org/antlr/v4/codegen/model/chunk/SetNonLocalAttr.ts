/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { StructDecl } from "../decl/StructDecl.js";
import { ActionChunk } from "./ActionChunk.js";
import { SetAttr } from "./SetAttr.js";

export class SetNonLocalAttr extends SetAttr {
    public ruleName: string;
    public ruleIndex: number;

    public constructor(ctx: StructDecl,
        ruleName: string, name: string, escapedName: string, ruleIndex: number,
        rhsChunks: ActionChunk[]) {
        super(ctx, name, escapedName, rhsChunks);
        this.ruleName = ruleName;
        this.ruleIndex = ruleIndex;
    }
}
