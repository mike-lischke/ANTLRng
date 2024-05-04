/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/* eslint-disable jsdoc/require-returns, jsdoc/require-param */

import { ActionChunk } from "./ActionChunk.js";
import { StructDecl } from "../decl/StructDecl.js";

/** */
export  class ActionText extends ActionChunk {
    public  text:  string;

    public  constructor(ctx: StructDecl, text: string) {
        super(ctx);
        this.text = text;
    }
}
