/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */


/* eslint-disable jsdoc/require-returns, jsdoc/require-param */


import { AltAST } from "../tool/ast/AltAST.js";



export  class LeftRecursiveRuleAltInfo {
	public  altNum:  number; // original alt index (from 1)
	public  leftRecursiveRuleRefLabel:  string;
	public  altLabel:  string;
	public readonly  isListLabel:  boolean;
	public  altText:  string;
	public  altAST:  AltAST; // transformed ALT
	public  originalAltAST:  AltAST;
	public  nextPrec:  number;

	public  constructor(altNum: number, altText: string);

	public  constructor(altNum: number, altText: string,
									leftRecursiveRuleRefLabel: string,
									altLabel: string,
									isListLabel: boolean,
									originalAltAST: AltAST);
    public constructor(...args: unknown[]) {
		switch (args.length) {
			case 2: {
				const [altNum, altText] = args as [number, string];


		this(altNum, altText, null, null, false, null);
	

				break;
			}

			case 6: {
				const [altNum, altText, leftRecursiveRuleRefLabel, altLabel, isListLabel, originalAltAST] = args as [number, string, string, string, boolean, AltAST];


		this.altNum = altNum;
		this.altText = altText;
		this.leftRecursiveRuleRefLabel = leftRecursiveRuleRefLabel;
		this.altLabel = altLabel;
		this.isListLabel = isListLabel;
		this.originalAltAST = originalAltAST;
	

				break;
			}

			default: {
				throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
			}
		}
	}

}
