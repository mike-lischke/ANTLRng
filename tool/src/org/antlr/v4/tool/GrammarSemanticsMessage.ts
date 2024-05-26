/* java2ts: keep */

/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import type { Token } from "antlr4ng";

import { ANTLRMessage } from "./ANTLRMessage.js";
import { ErrorType } from "./ErrorType.js";

/**
 * A problem with the symbols and/or meaning of a grammar such as rule
 *  redefinition. Any msg where we can point to a location in the grammar.
 */
export class GrammarSemanticsMessage extends ANTLRMessage {
    public constructor(errorType: ErrorType, fileName: string, offendingToken: Token | null, ...args: unknown[]) {
        super(errorType, offendingToken, args);
        this.fileName = fileName;
        if (offendingToken !== null) {
            this.line = offendingToken.line;
            this.charPosition = offendingToken.column;
        }
    }
}
