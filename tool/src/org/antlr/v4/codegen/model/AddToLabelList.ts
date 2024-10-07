/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { SrcOp } from "./SrcOp.js";
import { OutputModelFactory } from "../OutputModelFactory.js";
import { Decl } from "./decl/Decl.js";

export class AddToLabelList extends SrcOp {
    public readonly label: Decl;
    public readonly listName: string;

    public constructor(factory: OutputModelFactory, listName: string, label: Decl) {
        super(factory);
        this.label = label;
        this.listName = listName;
    }
}
