/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/* eslint-disable jsdoc/require-returns, jsdoc/require-param */

import { MatchSet } from "./MatchSet.js";
import { OutputModelFactory } from "../OutputModelFactory.js";
import { GrammarAST } from "../../tool/ast/GrammarAST.js";

export  class MatchNotSet extends MatchSet {
    public  varName = "_la";
    public  constructor(factory: OutputModelFactory, ast: GrammarAST) {
        super(factory, ast);
    }
}
