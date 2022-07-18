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



import { java } from "../../../../../lib/java/java";
import { CharStream } from "./CharStream";
import { Lexer } from "./Lexer";
import { RecognitionException } from "./RecognitionException";
import { ATNConfigSet } from "./atn/ATNConfigSet";
import { Interval } from "./misc/Interval";
import { Utils } from "./misc/Utils";




export  class LexerNoViableAltException extends RecognitionException {
	/** Matching attempted at what input index? */
	private readonly  startIndex:  number;

	/** Which configurations did we try at input.index() that couldn't match input.LA(1)? */
	private readonly  deadEndConfigs?:  ATNConfigSet;

	public constructor(lexer: Lexer,
									 input: CharStream,
									 startIndex: number,
									 deadEndConfigs: ATNConfigSet) {
		super(lexer, input, undefined);
		this.startIndex = startIndex;
		this.deadEndConfigs = deadEndConfigs;
	}

	public getStartIndex = (): number => {
		return this.startIndex;
	}


	public getDeadEndConfigs = (): ATNConfigSet => {
		return this.deadEndConfigs;
	}

	public getInputStream = (): CharStream => {
		return super.getInputStream() as CharStream;
	}

	public toString = (): string => {
		let  symbol: string = "";
		if (this.startIndex >= 0 && this.startIndex < this.getInputStream().size()) {
			symbol = this.getInputStream().getText(Interval.of(this.startIndex,this.startIndex));
			symbol = Utils.escapeWhitespace(symbol, false);
		}

		return java.lang.StringBuilder.format(java.util.Locale.getDefault(), "%s('%s')", new java.lang.Class(LexerNoViableAltException).getSimpleName(), symbol);
	}
}
