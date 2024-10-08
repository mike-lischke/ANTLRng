/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { VisitorFile } from "./VisitorFile.js";
import { OutputModelFactory } from "../OutputModelFactory.js";

export class BaseVisitorFile extends VisitorFile {
    public constructor(factory: OutputModelFactory, fileName: string) {
        super(factory, fileName);
    }
}
