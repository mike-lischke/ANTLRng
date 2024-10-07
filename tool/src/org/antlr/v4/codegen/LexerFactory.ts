/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { DefaultOutputModelFactory } from "./DefaultOutputModelFactory.js";
import { CodeGenerator } from "./CodeGenerator.js";

/** */
export class LexerFactory extends DefaultOutputModelFactory {
    public constructor(gen: CodeGenerator) { super(gen); }
}
