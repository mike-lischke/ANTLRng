/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { OutputModelObject } from "./OutputModelObject.js";
import { OutputModelFactory } from "../OutputModelFactory.js";
import { ATN, ATNSerializer, IntegerList } from "antlr4ng";

/**
 * Represents a serialized ATN that is just a list of signed integers; works for all targets
 *  except for java, which requires a 16-bit char encoding. See {@link SerializedJavaATN}.
 */
export class SerializedATN extends OutputModelObject {
    public serialized: Int32Array;

    public constructor(factory: OutputModelFactory);

    public constructor(factory: OutputModelFactory, atn: ATN);
    public constructor(...args: unknown[]) {
        switch (args.length) {
            case 1: {
                const [factory] = args as [OutputModelFactory];

                super(factory);

                break;
            }

            case 2: {
                const [factory, atn] = args as [OutputModelFactory, ATN];

                super(factory);
                const data = ATNSerializer.getSerialized(atn);
                this.serialized = data.toArray();

                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }

    public getSerialized(): object { return this.serialized; }
}
