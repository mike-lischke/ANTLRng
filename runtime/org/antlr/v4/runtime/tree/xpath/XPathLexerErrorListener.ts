/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */


/*
 eslint-disable @typescript-eslint/no-namespace, @typescript-eslint/naming-convention,
 max-classes-per-file, jsdoc/check-tag-names, @typescript-eslint/no-empty-function,
 @typescript-eslint/restrict-plus-operands, @typescript-eslint/unified-signatures, @typescript-eslint/member-ordering,
 no-underscore-dangle
*/

/* cspell: disable */



import { BaseErrorListener } from "../../BaseErrorListener";
import { RecognitionException } from "../../RecognitionException";
import { Recognizer } from "../../Recognizer";




export  class XPathLexerErrorListener extends BaseErrorListener {
	public syntaxError = (recognizer: Recognizer<unknown, unknown>, offendingSymbol: object,
							line: number, charPositionInLine: number, msg: string,
							e: RecognitionException): void =>
	{
	}
}
