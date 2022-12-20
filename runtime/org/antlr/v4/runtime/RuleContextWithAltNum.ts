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




import { ParserRuleContext } from "./ParserRuleContext";
import { ATN } from "./atn/ATN";




/** A handy class for use with
 *
 *  options {contextSuperClass=org.antlr.v4.runtime.RuleContextWithAltNum;}
 *
 *  that provides a backing field / impl for the outer alternative number
 *  matched for an internal parse tree node.
 *
 *  I'm only putting into Java runtime as I'm certain I'm the only one that
 *  will really every use this.
 */
export  class RuleContextWithAltNum extends ParserRuleContext {
	public altNum:  number;
	public constructor();

	public constructor(parent: ParserRuleContext| null, invokingStateNumber: number);
public constructor(parent?: ParserRuleContext | null, invokingStateNumber?: number) {
if (parent === undefined) { super();
this.altNum = ATN.INVALID_ALT_NUMBER; }
 else  {
		super(parent, invokingStateNumber);
	}

}

	public getAltNumber = ():  number => { return this.altNum; }
	public setAltNumber = (altNum: number):  void => { this.altNum = altNum; }
}
