/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */


/*
 eslint-disable @typescript-eslint/no-namespace, @typescript-eslint/naming-convention,
 max-classes-per-file, jsdoc/check-tag-names, @typescript-eslint/no-empty-function,
 @typescript-eslint/restrict-plus-operands, @typescript-eslint/unified-signatures, @typescript-eslint/member-ordering,
 no-underscore-dangle
*/

/* cspell: disable */



import { java } from "../../../../../../../lib/java/java";
import { XPathElement } from "./XPathElement";
import { ParseTree } from "../ParseTree";
import { Trees } from "../Trees";




export  class XPathTokenAnywhereElement extends XPathElement {
	protected tokenType:  number;
	public constructor(tokenName: string, tokenType: number) {
		super(tokenName);
		this.tokenType = tokenType;
	}

	public evaluate = (t: ParseTree): java.util.Collection<ParseTree> => {
		return Trees.findAllTokenNodes(t, this.tokenType);
	}
}
