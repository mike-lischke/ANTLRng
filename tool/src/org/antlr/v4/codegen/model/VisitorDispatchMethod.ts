/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { OutputModelObject } from "./OutputModelObject.js";
import { DispatchMethod } from "./DispatchMethod.js";
import { OutputModelFactory } from "../OutputModelFactory.js";

export class VisitorDispatchMethod extends DispatchMethod {
    public constructor(factory: OutputModelFactory) {
        super(factory);
    }
}
