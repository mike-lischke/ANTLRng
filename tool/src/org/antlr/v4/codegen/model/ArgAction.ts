/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { Action } from "./Action.js";
import { OutputModelFactory } from "../OutputModelFactory.js";
import { ActionAST } from "../../tool/ast/ActionAST.js";

export class ArgAction extends Action {
    /** Context type of invoked rule */
    public ctxType: string;
    public constructor(factory: OutputModelFactory, ast: ActionAST, ctxType: string) {
        super(factory, ast);
        this.ctxType = ctxType;
    }
}
