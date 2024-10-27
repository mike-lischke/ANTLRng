/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import type { Token } from "antlr4ng";

import { AttributeDict } from "./AttributeDict.js";

/**
 * Track the names of attributes defined in arg lists, return values,scope blocks etc...
 */
export interface IAttribute {
    /** The entire declaration such as "String foo" or "x:int" */
    decl?: string;

    /** The type; might be empty such as for Python which has no static typing */
    type?: string;

    /** The name of the attribute "foo" */
    name?: string;

    /** A {@link Token} giving the position of the name of this attribute in the grammar. */
    token?: Token;

    /** The optional attribute initialization expression */
    initValue?: string;

    /** Who contains us? */
    dict?: AttributeDict;

}
