/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { SrcOp } from "./SrcOp.js";
import { OutputModelFactory } from "../OutputModelFactory.js";
import { IntervalSet } from "antlr4ng";
import { GrammarAST } from "../../tool/ast/GrammarAST.js";

export class ThrowRecognitionException extends SrcOp {
    public decision: number;
    public grammarFile: string;
    public grammarLine: number;
    public grammarCharPosInLine: number;

    public constructor(factory: OutputModelFactory, ast: GrammarAST, expecting?: IntervalSet) {
        super(factory, ast);
        this.grammarLine = ast.getLine();
        this.grammarLine = ast.getCharPositionInLine();
        this.grammarFile = factory.getGrammar()!.fileName;
    }
}
