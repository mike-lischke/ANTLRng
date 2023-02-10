/* java2ts: keep */

/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { java, S } from "jree";

import { BaseErrorListener } from "./BaseErrorListener";
import { RecognitionException } from "./RecognitionException";
import { Recognizer } from "./Recognizer";

import { ATNSimulator } from "./atn";
import { Token } from "./Token";

/**
 *
 * @author Sam Harwell
 */
export class ConsoleErrorListener extends BaseErrorListener {
    /**
     * Provides a default instance of {@link ConsoleErrorListener}.
     */
    public static readonly INSTANCE = new ConsoleErrorListener();

    /**
     *
     * <p>
     * This implementation prints messages to {@link System#err} containing the
     * values of {@code line}, {@code charPositionInLine}, and {@code msg} using
     * the following format.</p>
     *
     * <pre>
     * line <em>line</em>:<em>charPositionInLine</em> <em>msg</em>
     * </pre>
     *
     * @param recognizer tbd
     * @param offendingSymbol tbd
     * @param line tbd
     * @param charPositionInLine tbd
     * @param msg tbd
     * @param _e tbd
     */
    public syntaxError = <S extends Token, T extends ATNSimulator>(recognizer: Recognizer<S, T> | null,
        offendingSymbol: unknown,
        line: number,
        charPositionInLine: number,
        msg: java.lang.String | null,
        _e: RecognitionException<S, T> | null): void => {
        java.lang.System.err.println(S`line ${line}:${charPositionInLine} ${msg}`);
    };

}
