/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { ActionChunk } from "./ActionChunk.js";
import { StructDecl } from "../decl/StructDecl.js";

export class RulePropertyRef extends ActionChunk {
    public label: string;

    public constructor(ctx: StructDecl, label: string) {
        super(ctx);
        this.label = label;
    }
}
