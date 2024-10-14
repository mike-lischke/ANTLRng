/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { ThrowRecognitionException } from "./ThrowRecognitionException.js";
import { OutputModelFactory } from "../OutputModelFactory.js";
import { IntervalSet } from "antlr4ng";
import { GrammarAST } from "../../tool/ast/GrammarAST.js";

export class ThrowNoViableAlt extends ThrowRecognitionException {
    public constructor(factory: OutputModelFactory, blkOrEbnfRootAST: GrammarAST,
        expecting?: IntervalSet) {
        super(factory, blkOrEbnfRootAST, expecting);
    }
}
