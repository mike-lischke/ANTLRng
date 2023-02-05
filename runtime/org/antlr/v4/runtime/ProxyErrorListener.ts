/* java2ts: keep */

/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

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
 * This implementation of {@link ANTLRErrorListener} dispatches all calls to a
 * collection of delegate listeners. This reduces the effort required to support multiple
 * listeners.
 *
 * @author Sam Harwell
 */
export class ProxyErrorListener extends JavaObject implements ANTLRErrorListener {
    private readonly delegates: java.util.Collection<ANTLRErrorListener>;

    public constructor(delegates: java.util.Collection<ANTLRErrorListener> | null) {
        super();
        if (delegates === null) {
            throw new java.lang.NullPointerException(S`delegates`);
        }

        this.delegates = delegates;
    }

    public syntaxError = <S extends Token, T extends ATNSimulator>(recognizer: Recognizer<S, T>,
        offendingSymbol: S | null, line: number, charPositionInLine: number, msg: java.lang.String,
        e: RecognitionException<S, T> | null): void => {
        for (const listener of this.delegates) {
            listener.syntaxError(recognizer, offendingSymbol, line, charPositionInLine, msg, e);
        }
    };

    public reportAmbiguity = (recognizer: Parser,
        dfa: DFA,
        startIndex: number,
        stopIndex: number,
        exact: boolean,
        ambigAlts: java.util.BitSet | null,
        configs: ATNConfigSet): void => {
        for (const listener of this.delegates) {
            listener.reportAmbiguity(recognizer, dfa, startIndex, stopIndex, exact, ambigAlts, configs);
        }
    };

    public reportAttemptingFullContext = (recognizer: Parser,
        dfa: DFA,
        startIndex: number,
        stopIndex: number,
        conflictingAlts: java.util.BitSet | null,
        configs: ATNConfigSet): void => {
        for (const listener of this.delegates) {
            listener.reportAttemptingFullContext(recognizer, dfa, startIndex, stopIndex, conflictingAlts, configs);
        }
    };

    public reportContextSensitivity = (recognizer: Parser,
        dfa: DFA,
        startIndex: number,
        stopIndex: number,
        prediction: number,
        configs: ATNConfigSet): void => {
        for (const listener of this.delegates) {
            listener.reportContextSensitivity(recognizer, dfa, startIndex, stopIndex, prediction, configs);
        }
    };
}
