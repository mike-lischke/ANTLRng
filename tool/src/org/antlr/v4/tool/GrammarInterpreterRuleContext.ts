/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/* eslint-disable jsdoc/require-returns, jsdoc/require-param */


import { InterpreterRuleContext, ParserRuleContext } from "antlr4ng";



/** An {@link InterpreterRuleContext} that knows which alternative
 *  for a rule was matched.
 *
 *  @see GrammarParserInterpreter
 *  @since 4.5.1
 */
export  class GrammarInterpreterRuleContext extends InterpreterRuleContext {
	protected  outerAltNum = 1;

	public  constructor(parent: ParserRuleContext, invokingStateNumber: number, ruleIndex: number) {
		super(parent, invokingStateNumber, ruleIndex);
	}

	/** The predicted outermost alternative for the rule associated
	 *  with this context object.  If this node left recursive, the true original
	 *  outermost alternative is returned.
	 */
	public  getOuterAltNum():  number { return this.outerAltNum; }

	public  setOuterAltNum(outerAltNum: number):  void {
		this.outerAltNum = outerAltNum;
	}

	@Override
public override  getAltNumber():  number {
		// override here and called old functionality; makes it backward compatible vs changing names
		return this.getOuterAltNum();
	}

	@Override
public override  setAltNumber(altNumber: number):  void {
		this.setOuterAltNum(altNumber);
	}
}
