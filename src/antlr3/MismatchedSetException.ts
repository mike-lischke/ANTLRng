/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { RecognitionException, type BitSet, type IntStream } from "antlr4ng";

export class MismatchedSetException extends RecognitionException {
    public expecting: BitSet | null;

    public constructor(expecting: BitSet | null, input?: IntStream) {
        super({ message: "", recognizer: null, input: null, ctx: null });
        this.expecting = expecting;
    }
}
