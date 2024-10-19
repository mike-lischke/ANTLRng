/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { StructDecl } from "../decl/StructDecl.js";
import { LabelRef } from "./LabelRef.js";

export class ListLabelRef extends LabelRef {
    public constructor(ctx: StructDecl, name: string, escapedName: string) {
        super(ctx, name, escapedName); 
    }
}
