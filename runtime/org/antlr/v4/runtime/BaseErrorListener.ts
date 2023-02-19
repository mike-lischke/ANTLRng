/* java2ts: keep */

/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/* eslint-disable @typescript-eslint/no-unused-vars */

import { java, S, JavaObject } from "jree";

import { ANTLRErrorListener } from "./ANTLRErrorListener";
import { Parser } from "./Parser";
import { RecognitionException } from "./RecognitionException";
import { Recognizer } from "./Recognizer";
import { ATNConfigSet } from "./atn/ATNConfigSet";
import { DFA } from "./dfa/DFA";

import { ATNSimulator } from "./atn";
import { Token } from "./Token";

/**
 * Provides an empty default implementation of {@link ANTLRErrorListener}. The
 * default implementation of each method does nothing, but can be overridden as
 * necessary.
 *
 * @author Sam Harwell
 */
export class BaseErrorListener extends JavaObject implements ANTLRErrorListener {
    public syntaxError = <S extends Token, T extends ATNSimulator>(recognizer: Recognizer<S, T> | null,
        offendingSymbol: S | null,
        line: number,
        charPositionInLine: number,
        msg: java.lang.String | null,
        e: RecognitionException | null): void => {
        //
    };

    public reportAmbiguity = (recognizer: Parser | null,
        dfa: DFA | null,
        startIndex: number,
        stopIndex: number,
        exact: boolean,
        ambigAlts: java.util.BitSet | null,
        configs: ATNConfigSet | null): void => {
        //
    };

    public reportAttemptingFullContext = (recognizer: Parser | null,
        dfa: DFA | null,
        startIndex: number,
        stopIndex: number,
        conflictingAlts: java.util.BitSet | null,
        configs: ATNConfigSet | null): void => {
        //
    };

    public reportContextSensitivity = (recognizer: Parser | null,
        dfa: DFA | null,
        startIndex: number,
        stopIndex: number,
        prediction: number,
        configs: ATNConfigSet | null): void => {
        //
    };
}
