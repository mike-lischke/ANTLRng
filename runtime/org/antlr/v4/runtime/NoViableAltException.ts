/* java2ts: keep */

/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/* eslint-disable no-underscore-dangle */

import { Parser } from "./Parser";
import { ParserRuleContext } from "./ParserRuleContext";
import { RecognitionException } from "./RecognitionException";
import { Token } from "./Token";
import { TokenStream } from "./TokenStream";
import { ATNConfigSet } from "./atn/ATNConfigSet";

/**
 * Indicates that the parser could not decide which of two or more paths
 *  to take based upon the remaining input. It tracks the starting token
 *  of the offending input and also knows where the parser was
 *  in the various paths when the error. Reported by reportNoViableAlternative()
 */
export class NoViableAltException extends RecognitionException {
    /** Which configurations did we try at input.index() that couldn't match input.LT(1)? */

    private readonly deadEndConfigs: ATNConfigSet | null = null;

    /**
     * The token object at the start index; the input stream might
     * 	not be buffering tokens so get a reference to it. (At the
     *  time the error occurred, of course the stream needs to keep a
     *  buffer all of the tokens but later we might not have access to those.)
     */

    private readonly startToken: Token | null;

    public constructor(recognizer: Parser, input: TokenStream | null = null, startToken: Token | null = null,
        offendingToken: Token | null = null, deadEndConfigs: ATNConfigSet | null = null,
        ctx: ParserRuleContext | null = null) {
        super(recognizer, input ?? recognizer?.getInputStream() ?? null, ctx ?? recognizer?._ctx ?? null);

        this.deadEndConfigs = deadEndConfigs ?? null;
        this.startToken = startToken ?? recognizer?.getCurrentToken() ?? null;
        this.setOffendingToken(offendingToken ?? recognizer?.getCurrentToken() ?? null);

    }

    public getStartToken = (): Token | null => {
        return this.startToken;
    };

    public getDeadEndConfigs = (): ATNConfigSet | null => {
        return this.deadEndConfigs;
    };

}
