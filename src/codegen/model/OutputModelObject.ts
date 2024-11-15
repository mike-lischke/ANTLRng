/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import type { IGrammarAST } from "../../types.js";
import type { OutputModelFactory } from "../OutputModelFactory.js";

export abstract class OutputModelObject {
    // Index signature to allow accessing properties by name in the output model walker.
    [key: string]: unknown;

    public factory?: OutputModelFactory;
    public ast?: IGrammarAST;

    public constructor(factory?: OutputModelFactory, ast?: IGrammarAST) {
        this.factory = factory;
        this.ast = ast;
    }
}
