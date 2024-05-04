/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/* eslint-disable jsdoc/require-returns, jsdoc/require-param */

import { AttributeDict } from "./AttributeDict.js";

/**
 * Track the names of attributes defined in arg lists, return values,
 *  scope blocks etc...
 */
export  class Attribute {
    /** The entire declaration such as "String foo" or "x:int" */
    public  decl:  string;

    /** The type; might be empty such as for Python which has no static typing */
    public  type:  string;

    /** The name of the attribute "foo" */
    public  name:  string;

	/** A {@link Token} giving the position of the name of this attribute in the grammar. */
    public  token:  Token;

    /** The optional attribute initialization expression */
    public  initValue:  string;

	/** Who contains us? */
    public  dict:  AttributeDict;

    public  constructor();

    public  constructor(name: string);

    public  constructor(name: string, decl: string);
    public constructor(...args: unknown[]) {
        switch (args.length) {
            case 0: {

                break;
            }

            case 1: {
                const [name] = args as [string];

                this(name,null);

                break;
            }

            case 2: {
                const [name, decl] = args as [string, string];

                this.name = name;
                this.decl = decl;

                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }

    @Override
    public override  toString():  string {
        if ( this.initValue!==null ) {
	        return this.name+":"+this.type+"="+this.initValue;
        }
        if ( this.type!==null ) {
	        return this.name+":"+this.type;
        }

        return this.name;
    }
}
