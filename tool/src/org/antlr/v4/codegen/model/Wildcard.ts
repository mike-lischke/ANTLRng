/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { GrammarAST } from "../../tool/ast/GrammarAST.js";
import { OutputModelFactory } from "../OutputModelFactory.js";
import { MatchToken } from "./MatchToken.js";

export class Wildcard extends MatchToken {
    public constructor(factory: OutputModelFactory, ast: GrammarAST) {
        super(factory, ast);
    }
}
