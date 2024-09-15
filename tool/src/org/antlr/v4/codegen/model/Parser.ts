/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { RuleFunction } from "./RuleFunction.js";
import { Recognizer } from "./Recognizer.js";
import { ParserFile } from "./ParserFile.js";
import { ModelElement } from "./ModelElement.js";
import { OutputModelFactory } from "../OutputModelFactory.js";

export class Parser extends Recognizer {
    public file: ParserFile;

    @ModelElement
    public funcs = new Array<RuleFunction>();

    public constructor(factory: OutputModelFactory, file: ParserFile) {
        super(factory);
        this.file = file; // who contains us?
    }
}
