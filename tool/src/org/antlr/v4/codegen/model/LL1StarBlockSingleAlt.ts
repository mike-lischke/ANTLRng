/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */


/* eslint-disable jsdoc/require-returns, jsdoc/require-param */


import { LL1Loop } from "./LL1Loop.js";
import { CodeBlockForAlt } from "./CodeBlockForAlt.js";
import { Choice } from "./Choice.js";
import { OutputModelFactory } from "../OutputModelFactory.js";
import { StarLoopEntryState, IntervalSet } from "antlr4ng";
import { GrammarAST } from "../../tool/ast/GrammarAST.js";



/** */
export  class LL1StarBlockSingleAlt extends LL1Loop {
	public  constructor(factory: OutputModelFactory, starRoot: GrammarAST, alts: Array<CodeBlockForAlt>) {
		super(factory, starRoot, alts);

		let  star = starRoot.atnState as StarLoopEntryState;
		this.loopBackStateNumber = star.loopBackState.stateNumber;
		this.decision = star.decision;
		let  altLookSets = factory.getGrammar().decisionLOOK.get($outer.decision);
		/* assert altLookSets.length == 2; */ 
		let  enterLook = altLookSets[0];
		let  exitLook = altLookSets[1];
		this.loopExpr = this.addCodeForLoopLookaheadTempVar(enterLook);
	}
}
