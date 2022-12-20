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




import { ErrorNode } from "./ErrorNode";
import { TerminalNode } from "./TerminalNode";
import { ParserRuleContext } from "../ParserRuleContext";




/** This interface describes the minimal core of methods triggered
 *  by {@link ParseTreeWalker}. E.g.,
 *
 *  	ParseTreeWalker walker = new ParseTreeWalker();
 *		walker.walk(myParseTreeListener, myParseTree); <-- triggers events in your listener
 *
 *  If you want to trigger events in multiple listeners during a single
 *  tree walk, you can use the ParseTreeDispatcher object available at
 *
 * 		https://github.com/antlr/antlr4/issues/841
 */
export  interface ParseTreeListener {
	 visitTerminal: (node: TerminalNode| null) => void;
	 visitErrorNode: (node: ErrorNode| null) => void;
     enterEveryRule: (ctx: ParserRuleContext| null) => void;
     exitEveryRule: (ctx: ParserRuleContext| null) => void;
}
