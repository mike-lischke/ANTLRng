/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/*
 eslint-disable @typescript-eslint/no-namespace, @typescript-eslint/naming-convention, no-redeclare,
 max-classes-per-file, jsdoc/check-tag-names, @typescript-eslint/no-empty-function,
 @typescript-eslint/restrict-plus-operands, @typescript-eslint/unified-signatures, @typescript-eslint/member-ordering,
 no-underscore-dangle, max-len
*/

/* cspell: disable */


import { BaseErrorListener } from "./BaseErrorListener";
import { RecognitionException } from "./RecognitionException";
import { Recognizer } from "./Recognizer";




/**
 *
 * @author Sam Harwell
 */
export  class ConsoleErrorListener extends BaseErrorListener {
	/**
	 * Provides a default instance of {@link ConsoleErrorListener}.
	 */
	public static readonly  INSTANCE:  ConsoleErrorListener | null = new  ConsoleErrorListener();

	/**
	 *
	 * <p>
	 * This implementation prints messages to {@link System#err} containing the
	 * values of {@code line}, {@code charPositionInLine}, and {@code msg} using
	 * the following format.</p>
	 *
	 * <pre>
	 * line <em>line</em>:<em>charPositionInLine</em> <em>msg</em>
	 * </pre>
	 */
	public syntaxError = (recognizer: Recognizer<unknown, unknown>| null,
							offendingSymbol: java.lang.Object| null,
							line: number,
							charPositionInLine: number,
							msg: java.lang.String| null,
							e: RecognitionException| null):  void =>
	{
		java.lang.System.err.println("line " + line + ":" + charPositionInLine + " " + msg);
	}

}
