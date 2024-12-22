/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { RecognitionException } from "antlr4ng";
import type { TreeNodeStream } from "./tree/TreeNodeStream.js";

export class MismatchedTreeNodeException extends RecognitionException {
    public expecting: number;

    public constructor(expecting: number, input: TreeNodeStream) {
        super({
            message: "MismatchedTreeNodeException(" + expecting + ")",
            recognizer: null,
            input: null,
            ctx: null
        });
        this.expecting = expecting;
    }
}
