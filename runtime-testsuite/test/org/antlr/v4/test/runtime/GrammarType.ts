/* java2ts: keep */

/*
 * Copyright (c) 2012-2022 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { java, S } from "jree";

export class GrammarType extends java.lang.Enum<GrammarType> {
    public static readonly Lexer: GrammarType = new class extends GrammarType {
    }(S`Lexer`, 0);
    public static readonly Parser: GrammarType = new class extends GrammarType {
    }(S`Parser`, 1);
    public static readonly CompositeLexer: GrammarType = new class extends GrammarType {
    }(S`CompositeLexer`, 2);
    public static readonly CompositeParser: GrammarType = new class extends GrammarType {
    }(S`CompositeParser`, 3);
}
