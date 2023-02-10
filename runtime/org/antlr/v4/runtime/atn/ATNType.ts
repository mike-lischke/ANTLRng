/* java2ts: keep */

/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { S } from "jree";
import { Enum } from "jree/output/src/java/lang/Enum";

/**
 * Represents the type of recognizer an ATN applies to.
 *
 * @author Sam Harwell
 */
export class ATNType extends Enum<ATNType> {

    /**
     * A lexer grammar.
     */
    public static readonly LEXER: ATNType = new class extends ATNType {
    }(S`LEXER`, 0);

    /**
     * A parser grammar.
     */
    public static readonly PARSER: ATNType = new class extends ATNType {
    }(S`PARSER`, 1);
}
