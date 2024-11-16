/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { ModelElement } from "../../misc/ModelElement.js";
import { ActionAST } from "../../tool/ast/ActionAST.js";
import { OutputModelFactory } from "../OutputModelFactory.js";
import { Action } from "./Action.js";
import { SrcOp } from "./SrcOp.js";

export class ExceptionClause extends SrcOp {
    @ModelElement
    public catchArg: Action;

    @ModelElement
    public catchAction: Action;

    public constructor(factory: OutputModelFactory,
        catchArg: ActionAST,
        catchAction: ActionAST) {
        super(factory, catchArg);
        this.catchArg = new Action(factory, catchArg);
        this.catchAction = new Action(factory, catchAction);
    }
}
