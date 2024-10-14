/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { RecognitionException, type IntStream } from "antlr4ng";

/**  The recognizer did not match anything for a (..)+ loop. */
export class EarlyExitException extends RecognitionException {
    public decisionNumber: number;

    public constructor(decisionNumber: number, input?: IntStream) {
        super({ message: `@[${decisionNumber}]`, recognizer: null, input: null, ctx: null });
        this.decisionNumber = decisionNumber;
    }
}
