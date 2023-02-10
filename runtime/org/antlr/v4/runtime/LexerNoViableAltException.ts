/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */




import { java, S } from "jree";
import { CharStream } from "./CharStream";
import { Lexer } from "./Lexer";
import { RecognitionException } from "./RecognitionException";
import { ATNConfigSet } from "./atn/ATNConfigSet";
import { Interval } from "./misc/Interval";
import { Utils } from "./misc/Utils";




export class LexerNoViableAltException extends RecognitionException {
	/** Matching attempted at what input index? */
	private readonly startIndex:  number;

	/** Which configurations did we try at input.index() that couldn't match input.LA(1)? */
	private readonly deadEndConfigs:  ATNConfigSet | null;

	public constructor(lexer: Lexer| null,
									 input: CharStream| null,
									 startIndex: number,
									 deadEndConfigs: ATNConfigSet| null) {
		super(lexer, input, null);
		this.startIndex = startIndex;
		this.deadEndConfigs = deadEndConfigs;
	}

	public getStartIndex = ():  number => {
		return this.startIndex;
	}


	public getDeadEndConfigs = ():  ATNConfigSet | null => {
		return this.deadEndConfigs;
	}

	public getInputStream = ():  CharStream | null => {
		return super.getInputStream() as CharStream;
	}

	public toString = ():  java.lang.String | null => {
		let  symbol: java.lang.String = S``;
		if (this.startIndex >= 0 && this.startIndex < this.getInputStream().size()) {
			symbol = this.getInputStream().getText(Interval.of(this.startIndex,this.startIndex));
			symbol = Utils.escapeWhitespace(symbol, false);
		}

		return java.lang.String.format(java.util.Locale.getDefault(), S`%s('%s')`, LexerNoViableAltException.class.getSimpleName(), symbol);
	}
}
