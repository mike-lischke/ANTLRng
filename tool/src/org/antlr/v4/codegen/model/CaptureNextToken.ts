/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { SrcOp } from "./SrcOp.js";
import { OutputModelFactory } from "../OutputModelFactory.js";

export class CaptureNextToken extends SrcOp {
    public varName: string;
    public constructor(factory: OutputModelFactory, varName: string) {
        super(factory);
        this.varName = varName;
    }
}
