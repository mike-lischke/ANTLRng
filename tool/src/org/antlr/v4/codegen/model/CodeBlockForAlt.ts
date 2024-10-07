/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { OutputModelFactory } from "../OutputModelFactory.js";
import { CodeBlock } from "./decl/CodeBlock.js";

/** Contains Rewrite block (usually as last op) */
export class CodeBlockForAlt extends CodeBlock {

    public constructor(factory: OutputModelFactory) {
        super(factory);
    }
}
