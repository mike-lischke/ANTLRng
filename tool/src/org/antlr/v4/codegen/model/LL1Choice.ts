/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */


/* eslint-disable jsdoc/require-returns, jsdoc/require-param */


import { TokenInfo } from "./TokenInfo.js";
import { ThrowNoViableAlt } from "./ThrowNoViableAlt.js";
import { ModelElement } from "./ModelElement.js";
import { CodeBlockForAlt } from "./CodeBlockForAlt.js";
import { Choice } from "./Choice.js";
import { OutputModelFactory } from "../OutputModelFactory.js";
import { GrammarAST } from "../../tool/ast/GrammarAST.js";



export abstract  class LL1Choice extends Choice {
	/** Token names for each alt 0..n-1 */
	public  altLook:  Array<TokenInfo[]>;
	@ModelElement
public  error:  ThrowNoViableAlt;

	public  constructor(factory: OutputModelFactory, blkAST: GrammarAST,
					 alts: Array<CodeBlockForAlt>)
	{
		super(factory, blkAST, alts);
	}
}
