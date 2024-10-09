/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { OutputModelFactory } from "../OutputModelFactory.js";
import { ParserFile } from "./ParserFile.js";
import { Recognizer } from "./Recognizer.js";
import { RuleFunction } from "./RuleFunction.js";

export class Parser extends Recognizer {
    public file: ParserFile;

    public funcs = new Array<RuleFunction>();

    public constructor(factory: OutputModelFactory, file: ParserFile) {
        super(factory);
        this.file = file; // who contains us?
    }
}
