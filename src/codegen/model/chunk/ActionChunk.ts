/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { OutputModelObject } from "../OutputModelObject.js";
import { StructDecl } from "../decl/StructDecl.js";

export class ActionChunk extends OutputModelObject {

    /** Where is the ctx that defines attrs,labels etc... for this action? */
    public ctx?: StructDecl;

    public constructor(ctx?: StructDecl) {
        super();

        this.ctx = ctx;
    }
}
