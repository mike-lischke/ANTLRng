/* java2ts: keep */

/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { java } from "jree";

import { ATNSimulator, BaseErrorListener, RecognitionException, Recognizer, Token } from "../../";

export class XPathLexerErrorListener extends BaseErrorListener {
    public override syntaxError = <S extends Token, T extends ATNSimulator>(recognizer: Recognizer<T> | null,
        offendingSymbol: S | null,
        line: number, charPositionInLine: number, msg: java.lang.String | null,
        e: RecognitionException | null): void => {
        //
    };
}
