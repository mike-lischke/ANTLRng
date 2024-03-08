/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */


/* eslint-disable jsdoc/require-returns, jsdoc/require-param */


import { LL1Choice } from "./LL1Choice.js";
import { LL1AltBlock } from "./LL1AltBlock.js";
import { CodeBlockForAlt } from "./CodeBlockForAlt.js";
import { OutputModelFactory } from "../OutputModelFactory.js";
import { GrammarAST } from "../../tool/ast/GrammarAST.js";



/** An optional block is just an alternative block where the last alternative
 *  is epsilon. The analysis takes care of adding to the empty alternative.
 *
 *  (A | B | C)?
 */
export  class LL1OptionalBlock extends LL1AltBlock {
	public  constructor(factory: OutputModelFactory, blkAST: GrammarAST, alts: Array<CodeBlockForAlt>) {
		super(factory, blkAST, alts);
	}
}
