/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */


/* eslint-disable jsdoc/require-returns, jsdoc/require-param */


import { ErrorType } from "./ErrorType.js";
import { ANTLRMessage } from "./ANTLRMessage.js";



/** A problem with the symbols and/or meaning of a grammar such as rule
 *  redefinition. Any msg where we can point to a location in the grammar.
 */
export  class GrammarSemanticsMessage extends ANTLRMessage {
    public  constructor(etype: ErrorType,
                                   fileName: string,
                                   offendingToken: Token,...
                                   args: Object[])
    {
        super(etype,offendingToken,this.args);
        this.fileName = fileName;
		if ( offendingToken!==null ) {
            this.line = offendingToken.getLine();
            this.charPosition = offendingToken.getCharPositionInLine();
        }
    }
}

