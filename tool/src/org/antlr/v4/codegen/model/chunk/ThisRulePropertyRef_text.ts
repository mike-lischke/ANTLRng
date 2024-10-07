/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { RulePropertyRef } from "./RulePropertyRef.js";
import { ActionChunk } from "./ActionChunk.js";
import { StructDecl } from "../decl/StructDecl.js";

export class ThisRulePropertyRef_text extends RulePropertyRef {
    public constructor(ctx: StructDecl, label: string) {
        super(ctx, label);
    }
}
