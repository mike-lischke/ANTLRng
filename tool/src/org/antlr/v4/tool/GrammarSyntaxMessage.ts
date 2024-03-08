/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */


/* eslint-disable jsdoc/require-returns, jsdoc/require-param */


import { ErrorType } from "./ErrorType.js";
import { ANTLRMessage } from "./ANTLRMessage.js";



/** A problem with the syntax of your antlr grammar such as
 *  "The '{' came as a complete surprise to me at this point in your program"
 */
export  class GrammarSyntaxMessage extends ANTLRMessage {
	public  constructor(etype: ErrorType,
								fileName: string,
								offendingToken: Token,
								antlrException: RecognitionException,...
								args: Object[])
	{
		super(etype, antlrException, offendingToken, this.args);
		this.fileName = fileName;
		this.offendingToken = offendingToken;
		if ( offendingToken!==null ) {
			this.line = offendingToken.getLine();
			this.charPosition = offendingToken.getCharPositionInLine();
		}
	}

    @SuppressWarnings(["ThrowableResultOfMethodCallIgnored"])
@SuppressWarnings(["ThrowableResultOfMethodCallIgnored"])

    @Override
public override  getCause():  RecognitionException {
        return super.getCause() as RecognitionException;
    }
}
