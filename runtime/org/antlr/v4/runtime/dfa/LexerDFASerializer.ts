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




import { DFA } from "./DFA";
import { DFASerializer } from "./DFASerializer";
import { VocabularyImpl } from "../VocabularyImpl";


import { S } from "../../../../../../lib/templates";


export  class LexerDFASerializer extends DFASerializer {
	public constructor(dfa: DFA| null) {
		super(dfa, VocabularyImpl.EMPTY_VOCABULARY);
	}

	protected getEdgeLabel = (i: number):  java.lang.String | null => {
		return new  java.lang.StringBuilder(S`'`)
				.appendCodePoint(i)
				.append(S`'`)
				.toString();
	}
}
