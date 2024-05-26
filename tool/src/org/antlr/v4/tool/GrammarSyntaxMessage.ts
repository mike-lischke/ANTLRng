/* java2ts: keep */

/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/* eslint-disable jsdoc/require-returns, jsdoc/require-param */

import type { RecognitionException, Token } from "antlr4ng";

import { ANTLRMessage } from "./ANTLRMessage.js";
import { ErrorType } from "./ErrorType.js";

/**
 * A problem with the syntax of your antlr grammar such as
 *  "The '{' came as a complete surprise to me at this point in your program"
 */
export class GrammarSyntaxMessage extends ANTLRMessage {
    public constructor(type: ErrorType,
        fileName: string,
        offendingToken: Token,
        antlrException: RecognitionException, ...args: unknown[]) {
        super(type, antlrException, offendingToken, args);
        this.fileName = fileName;
        if (offendingToken !== null) {
            this.line = offendingToken.line;
            this.charPosition = offendingToken.column;
        }
    }

    public override  getCause(): RecognitionException {
        return super.getCause() as RecognitionException;
    }
}
