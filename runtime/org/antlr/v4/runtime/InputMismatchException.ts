/* java2ts: keep */

/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { ParserATNSimulator } from "./atn";
import { Parser } from "./Parser";
import { ParserRuleContext } from "./ParserRuleContext";
import { RecognitionException } from "./RecognitionException";
import { Token } from "./Token";

/**
 * This signifies any kind of mismatched input exceptions such as
 *  when the current input does not match the expected token.
 */
export class InputMismatchException extends RecognitionException<Token, ParserATNSimulator> {
    public constructor(recognizer: Parser);
    public constructor(recognizer: Parser, state: number, ctx: ParserRuleContext | null);
    public constructor(recognizer: Parser, state?: number, ctx?: ParserRuleContext | null) {
        // eslint-disable-next-line no-underscore-dangle
        super(recognizer, recognizer.getInputStream(), ctx ?? recognizer._ctx);
        if (state) {
            this.setOffendingState(state);
        }

        this.setOffendingToken(recognizer.getCurrentToken());

    }

}
