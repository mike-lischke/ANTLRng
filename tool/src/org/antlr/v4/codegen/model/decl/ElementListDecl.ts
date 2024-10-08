/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { Decl } from "./Decl.js";
import { OutputModelFactory } from "../../OutputModelFactory.js";

export class ElementListDecl extends Decl {
    public constructor(factory: OutputModelFactory, name: string) {
        super(factory, name);
    }
}
