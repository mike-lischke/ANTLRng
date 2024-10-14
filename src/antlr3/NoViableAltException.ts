/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { RecognitionException, type IntStream } from "antlr4ng";

export class NoViableAltException extends RecognitionException {
    public grammarDecisionDescription: string;
    public decisionNumber: number;
    public stateNumber: number;

    public constructor(grammarDecisionDescription: string, decisionNumber: number, stateNumber: number,
        input?: IntStream) {
        super({ message: `@[${grammarDecisionDescription}]`, recognizer: null, input: null, ctx: null });
        this.grammarDecisionDescription = grammarDecisionDescription;
        this.decisionNumber = decisionNumber;
        this.stateNumber = stateNumber;
    }
}
