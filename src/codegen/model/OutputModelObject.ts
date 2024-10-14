/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { OutputModelFactory } from "../OutputModelFactory.js";
import { GrammarAST } from "../../tool/ast/GrammarAST.js";

export abstract class OutputModelObject {
    public factory?: OutputModelFactory;
    public ast?: GrammarAST;

    public constructor(factory?: OutputModelFactory, ast?: GrammarAST) {
        this.factory = factory;
        this.ast = ast;
    }
}
