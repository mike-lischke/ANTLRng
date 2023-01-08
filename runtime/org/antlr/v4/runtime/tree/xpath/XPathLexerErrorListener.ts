/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */




import { java } from "../../../../../../../lib/java/java";
import { BaseErrorListener } from "../../BaseErrorListener";
import { RecognitionException } from "../../RecognitionException";
import { Recognizer } from "../../Recognizer";




export  class XPathLexerErrorListener extends BaseErrorListener {
	public syntaxError = (recognizer: Recognizer<unknown, unknown>| null, offendingSymbol: java.lang.Object| null,
							line: number, charPositionInLine: number, msg: java.lang.String| null,
							e: RecognitionException| null):  void =>
	{
	}
}
