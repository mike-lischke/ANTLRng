/* java2ts: keep */

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
export class Attribute {
    /** The entire declaration such as "String foo" or "x:int" */
    public decl?: string;

    /** The type; might be empty such as for Python which has no static typing */
    public type = "";

    /** The name of the attribute "foo" */
    public name: string;

    /** A {@link Token} giving the position of the name of this attribute in the grammar. */
    public token: Token;

    /** The optional attribute initialization expression */
    public initValue?: string;

    /** Who contains us? */
    public dict: AttributeDict;

    public constructor(name: string, decl?: string) {
        this.name = name;
        this.decl = decl;
    }

    public toString(): string {
        if (this.initValue) {
            return this.name + ":" + this.type + "=" + this.initValue;
        }

        if (this.type) {
            return this.name + ":" + this.type;
        }

        return this.name ?? "";
    }
}
