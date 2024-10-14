/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { ATN, ATNSerializer } from "antlr4ng";

import { OutputModelFactory } from "../OutputModelFactory.js";
import { OutputModelObject } from "./OutputModelObject.js";

/**
 * Represents a serialized ATN that is just a list of signed integers; works for all targets
 *  except for java, which requires a 16-bit char encoding. See {@link SerializedJavaATN}.
 */
export class SerializedATN extends OutputModelObject {
    public serialized: number[];

    public constructor(factory: OutputModelFactory, atn?: ATN) {
        super(factory);

        if (atn) {
            this.serialized = ATNSerializer.getSerialized(atn);
        }
    }

    public getSerialized(): object {
        return this.serialized;
    }
}
