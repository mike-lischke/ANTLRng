/* java2ts: keep */

/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { java, S } from "jree";
import { DFA } from "./DFA";
import { DFASerializer } from "./DFASerializer";
import { VocabularyImpl } from "../VocabularyImpl";

export class LexerDFASerializer extends DFASerializer {
    public constructor(dfa: DFA) {
        super(dfa, VocabularyImpl.EMPTY_VOCABULARY);
    }

    protected getEdgeLabel = (i: number): java.lang.String => {
        return new java.lang.StringBuilder(S`'`)
            .appendCodePoint(i)
            .append(S`'`)
            .toString();
    };
}
