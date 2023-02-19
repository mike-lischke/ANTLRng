/* java2ts: keep */

/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { java } from "jree";

import { CharStream } from "./CharStream";
import { TokenSource } from "./TokenSource";
import { Pair } from "./misc/Pair";
import { Token } from "./Token";

/**
 * The default mechanism for creating tokens. It's used by default in Lexer and
 *  the error handling strategy (to create missing tokens).  Notifying the parser
 *  of a new factory means that it notifies its token source and error strategy.
 */
export interface TokenFactory<Symbol extends Token> {
    /**
     * This is the method used to create tokens in the lexer and in the
     *  error handling strategy. If text!=null, than the start and stop positions
     *  are wiped to -1 in the text override is set in the CommonToken.
     */
    create(source: Pair<TokenSource, CharStream>, type: number, text: java.lang.String | null,
        channel: number, start: number, stop: number,
        line: number, charPositionInLine: number): Symbol;

    /** Generically useful */
    create(type: number, text: java.lang.String | null): Symbol;
}
