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



import { IntStream } from "./IntStream";
import { ParserRuleContext } from "./ParserRuleContext";
import { Recognizer } from "./Recognizer";
import { RuleContext } from "./RuleContext";
import { Token } from "./Token";
import { IntervalSet } from "./misc/IntervalSet";




/** The root of the ANTLR exception hierarchy. In general, ANTLR tracks just
 *  3 kinds of errors: prediction errors, failed predicate errors, and
 *  mismatched input errors. In each case, the parser knows where it is
 *  in the input, where it is in the ATN, the rule invocation stack,
 *  and what kind of problem occurred.
 */
export  class RecognitionException extends java.lang.RuntimeException {
	/** The {@link Recognizer} where this exception originated. */
	private readonly  recognizer?:  Recognizer<unknown, unknown>;

	private readonly  ctx?:  RuleContext;

	private readonly  input?:  IntStream;

	/**
	 * The current {@link Token} when an error occurred. Since not all streams
	 * support accessing symbols by index, we have to track the {@link Token}
	 * instance itself.
	 */
	private offendingToken?:  Token;

	private offendingState:  number = -1;

	public constructor(recognizer: Recognizer<unknown, unknown>,
								input: IntStream,
								ctx: ParserRuleContext);

	public constructor(message: string,
								recognizer: Recognizer<unknown, unknown>,
								input: IntStream,
								ctx: ParserRuleContext);
public constructor(recognizerOrMessage: Recognizer<unknown, unknown> | string, inputOrRecognizer: IntStream | Recognizer<unknown, unknown>, ctxOrInput: ParserRuleContext | IntStream, ctx?: ParserRuleContext) {
if (recognizerOrMessage instanceof Recognizer && inputOrRecognizer instanceof IntStream && ctxOrInput instanceof ParserRuleContext && ctx === undefined)
	{
const recognizer = recognizerOrMessage as Recognizer<unknown, unknown>;
const input = inputOrRecognizer as IntStream;
const ctx = ctxOrInput as ParserRuleContext;
		super();
this.recognizer = recognizer;
		this.input = input;
		this.ctx = ctx;
		if ( recognizer!==undefined ) {
 this.offendingState = recognizer.getState();
}

	}
 else 
	{
let message = recognizerOrMessage as string;
let recognizer = inputOrRecognizer as Recognizer<unknown, unknown>;
let input = ctxOrInput as IntStream;
		super(message);
		this.recognizer = recognizer;
		this.input = input;
		this.ctx = ctx;
		if ( recognizer!==undefined ) {
 this.offendingState = recognizer.getState();
}

	}

}


	/**
	 * Get the ATN state number the parser was in at the time the error
	 * occurred. For {@link NoViableAltException} and
	 * {@link LexerNoViableAltException} exceptions, this is the
	 * {@link DecisionState} number. For others, it is the state whose outgoing
	 * edge we couldn't match.
	 *
	 * <p>If the state number is not known, this method returns -1.</p>
	 */
	public getOffendingState = (): number => {
		return this.offendingState;
	}

	protected readonly  setOffendingState = (offendingState: number): void => {
		this.offendingState = offendingState;
	}

	/**
	 * Gets the set of input symbols which could potentially follow the
	 * previously matched symbol at the time this exception was thrown.
	 *
	 * <p>If the set of expected tokens is not known and could not be computed,
	 * this method returns {@code null}.</p>
	 *
	 * @return The set of token types that could potentially follow the current
	 * state in the ATN, or {@code null} if the information is not available.
	 */
	public getExpectedTokens = (): IntervalSet => {
		if (this.recognizer !== undefined) {
			return this.recognizer.getATN().getExpectedTokens(this.offendingState, this.ctx);
		}

		return undefined;
	}

	/**
	 * Gets the {@link RuleContext} at the time this exception was thrown.
	 *
	 * <p>If the context is not available, this method returns {@code null}.</p>
	 *
	 * @return The {@link RuleContext} at the time this exception was thrown.
	 * If the context is not available, this method returns {@code null}.
	 */
	public getCtx = (): RuleContext => {
		return this.ctx;
	}

	/**
	 * Gets the input stream which is the symbol source for the recognizer where
	 * this exception was thrown.
	 *
	 * <p>If the input stream is not available, this method returns {@code null}.</p>
	 *
	 * @return The input stream which is the symbol source for the recognizer
	 * where this exception was thrown, or {@code null} if the stream is not
	 * available.
	 */
	public getInputStream = (): IntStream => {
		return this.input;
	}


	public getOffendingToken = (): Token => {
		return this.offendingToken;
	}

	protected readonly  setOffendingToken = (offendingToken: Token): void => {
		this.offendingToken = offendingToken;
	}

	/**
	 * Gets the {@link Recognizer} where this exception occurred.
	 *
	 * <p>If the recognizer is not available, this method returns {@code null}.</p>
	 *
	 * @return The recognizer where this exception occurred, or {@code null} if
	 * the recognizer is not available.
	 */
	public getRecognizer = (): Recognizer<unknown, unknown> => {
		return this.recognizer;
	}
}
