/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */


/* eslint-disable jsdoc/require-returns, jsdoc/require-param */


import { Rule } from "./Rule.js";
import { ErrorType } from "./ErrorType.js";
import { ANTLRMessage } from "./ANTLRMessage.js";



export  class LeftRecursionCyclesMessage extends ANTLRMessage {
	public  constructor(fileName: string, cycles: Collection< Collection<Rule>>) {
		super(ErrorType.LEFT_RECURSION_CYCLES, LeftRecursionCyclesMessage.getStartTokenOfFirstRule(cycles), cycles);
		this.fileName = fileName;
	}

	protected static  getStartTokenOfFirstRule(cycles: Collection< Collection<Rule>>):  Token {
	    if (cycles === null) {
	        return null;
	    }

	    for (let collection of cycles) {
	        if (collection === null) {
	            return null;
	        }

	        for (let rule of collection) {
	            if (rule.ast !== null) {
	                return rule.ast.getToken();
	            }
	        }
	    }
		return null;
	}
}
