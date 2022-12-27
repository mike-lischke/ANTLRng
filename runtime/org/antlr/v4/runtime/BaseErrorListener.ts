/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/* eslint-disable @typescript-eslint/no-unused-vars */

import { java } from "../../../../../lib/java/java";
import { JavaObject } from "../../../../../lib/java/lang/Object";

import { ANTLRErrorListener } from "./ANTLRErrorListener";
import { Parser } from "./Parser";
import { RecognitionException } from "./RecognitionException";
import { Recognizer } from "./Recognizer";
import { ATNConfigSet } from "./atn/ATNConfigSet";
import { DFA } from "./dfa/DFA";
import { ATNSimulator } from "./atn";

/**
 * Provides an empty default implementation of {@link ANTLRErrorListener}. The
 * default implementation of each method does nothing, but can be overridden as
 * necessary.
 *
 * @author Sam Harwell
 */
export class BaseErrorListener extends JavaObject implements ANTLRErrorListener {
    public syntaxError = <T extends ATNSimulator>(recognizer: Recognizer<unknown, T>,
        offendingSymbol: unknown,
        line: number,
        charPositionInLine: number,
        msg: java.lang.String,
        e: RecognitionException): void => {
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
