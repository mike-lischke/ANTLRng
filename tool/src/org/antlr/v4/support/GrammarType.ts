/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/** What type of grammar is it we process currently? */
export enum GrammarType {
    /** A lexer grammar. */
    Lexer,

    /** A parser grammar. */
    Parser,

    /**
     * A combined grammar (lexer + parser in a single file).
     * Combined grammars are limited and should be avoided.
     */
    Combined
}
