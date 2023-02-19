/* java2ts: keep */

/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { java } from "jree";
import { Token } from "./Token";

/**
 * This interface provides access to all of the information about a token by
 * exposing the properties of the token as getter methods.
 */
export interface WritableToken extends Token {
    setText(text: java.lang.String | null): void;

    setType(ttype: number): void;

    setLine(line: number): void;

    setCharPositionInLine(pos: number): void;

    setChannel(channel: number): void;

    setTokenIndex(index: number): void;

    toString(): java.lang.String;
}

export const isWritableToken = (obj: unknown): obj is WritableToken => {
    const candidate = obj as WritableToken;

    return (candidate.getChannel !== undefined) && (candidate.setText !== undefined);
};
