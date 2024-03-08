/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */


/* eslint-disable jsdoc/require-returns, jsdoc/require-param */


import { TestSetInline } from "./TestSetInline.js";
import { SrcOp } from "./SrcOp.js";
import { OutputModelObject } from "./OutputModelObject.js";
import { ModelElement } from "./ModelElement.js";
import { CodeBlockForAlt } from "./CodeBlockForAlt.js";
import { Choice } from "./Choice.js";
import { CaptureNextTokenType } from "./CaptureNextTokenType.js";
import { OutputModelFactory } from "../OutputModelFactory.js";
import { IntervalSet } from "antlr4ng";
import { GrammarAST } from "../../tool/ast/GrammarAST.js";



/** */
export abstract  class LL1Loop extends Choice {
	/** The state associated wih the (A|B|...) block not loopback, which
	 *  is super.stateNumber
	 */
	public  blockStartStateNumber:  number;
	public  loopBackStateNumber:  number;

	@ModelElement
public  loopExpr:  OutputModelObject;
	@ModelElement
public  iteration:  Array<SrcOp>;

	public  constructor(factory: OutputModelFactory,
				   blkAST: GrammarAST,
				   alts: Array<CodeBlockForAlt>)
	{
		super(factory, blkAST, alts);
	}

	public  addIterationOp(op: SrcOp):  void {
		if ( this.iteration===null ) {
 this.iteration = new  Array<SrcOp>();
}

		this.iteration.add(op);
	}

	public  addCodeForLoopLookaheadTempVar(look: IntervalSet):  SrcOp {
		let  expr = this.addCodeForLookaheadTempVar(look);
		if (expr !== null) {
			let  nextType = new  CaptureNextTokenType($outer.factory, expr.varName);
			this.addIterationOp(nextType);
		}
		return expr;
	}
}
