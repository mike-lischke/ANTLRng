/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { RecognitionException, type IntStream } from "antlr4ng";

/** A semantic predicate failed during validation.  Validation of predicates
 *  occurs when normally parsing the alternative just like matching a token.
 *  Disambiguating predicate evaluation occurs when we hoist a predicate into
 *  a prediction decision.
 */
export class FailedPredicateException extends RecognitionException {
    public ruleName: string;
    public predicateText: string;

    public constructor(input: IntStream, ruleName: string, predicateText: string) {
        super({ message: "", recognizer: null, input: null, ctx: null });
        this.ruleName = ruleName;
        this.predicateText = predicateText;
    }
}
