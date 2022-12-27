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
import { RuleContext } from "./RuleContext";
import { Token } from "./Token";
import { TokenSource } from "./TokenSource";
import { TokenStream } from "./TokenStream";
import { WritableToken } from "./WritableToken";
import { Interval } from "./misc/Interval";


import { JavaObject } from "../../../../../lib/java/lang/Object";
import { S } from "../../../../../lib/templates";


export  class UnbufferedTokenStream<T extends Token> extends JavaObject implements TokenStream {
	protected tokenSource:  TokenSource | null;

	/**
	 * A moving window buffer of the data being scanned. While there's a marker,
	 * we keep adding to buffer. Otherwise, {@link #consume consume()} resets so
	 * we start filling at index 0 again.
	 */
	protected tokens:  Token[] | null;

	/**
	 * The number of tokens currently in {@link #tokens tokens}.
	 *
	 * <p>This is not the buffer capacity, that's {@code tokens.length}.</p>
	 */
	protected n:  number;

	/**
	 * 0..n-1 index into {@link #tokens tokens} of next token.
	 *
	 * <p>The {@code LT(1)} token is {@code tokens[p]}. If {@code p == n}, we are
	 * out of buffered tokens.</p>
	 */
	protected p:  number=0;

	/**
	 * Count up with {@link #mark mark()} and down with
	 * {@link #release release()}. When we {@code release()} the last mark,
	 * {@code numMarkers} reaches 0 and we reset the buffer. Copy
	 * {@code tokens[p]..tokens[n-1]} to {@code tokens[0]..tokens[(n-1)-p]}.
	 */
	protected numMarkers:  number = 0;

	/**
	 * This is the {@code LT(-1)} token for the current position.
	 */
	protected lastToken:  Token | null;

	/**
	 * When {@code numMarkers > 0}, this is the {@code LT(-1)} token for the
	 * first token in {@link #tokens}. Otherwise, this is {@code null}.
	 */
	protected lastTokenBufferStart:  Token | null;

	/**
	 * Absolute token index. It's the index of the token about to be read via
	 * {@code LT(1)}. Goes from 0 to the number of tokens in the entire stream,
	 * although the stream size is unknown before the end is reached.
	 *
	 * <p>This value is used to set the token indexes if the stream provides tokens
	 * that implement {@link WritableToken}.</p>
	 */
	protected currentTokenIndex:  number = 0;

	/* eslint-disable constructor-super, @typescript-eslint/no-unsafe-call */
public constructor(tokenSource: TokenSource| null);

	public constructor(tokenSource: TokenSource| null, bufferSize: number);
/* @ts-expect-error, because of the super() call in the closure. */
public constructor(tokenSource: TokenSource | null, bufferSize?: number) {
const $this = (tokenSource: TokenSource | null, bufferSize?: number): void => {
if (bufferSize === undefined) {
		$this(tokenSource, 256);
	}
 else  {

/* @ts-expect-error, because of the super() call in the closure. */
		super();
this.tokenSource = tokenSource;
		this.tokens = new   Array<Token>(bufferSize);
		this.n = 0;
		this.fill(1); // prime the pump
	}
};

$this(tokenSource, bufferSize);

}
/* eslint-enable constructor-super, @typescript-eslint/no-unsafe-call */

	public get = (i: number):  Token | null => { // get absolute index
		let  bufferStartIndex: number = this.getBufferStartIndex();
		if (i < bufferStartIndex || i >= bufferStartIndex + this.n) {
			throw new  java.lang.IndexOutOfBoundsException(S`get(`+i+S`) outside buffer: `+
			                    bufferStartIndex+S`..`+(bufferStartIndex+this.n));
		}
		return this.tokens[i - bufferStartIndex];
	}

	public LT = (i: number):  Token | null => {
		if ( i===-1 ) {
			return this.lastToken;
		}

		this.sync(i);
        let  index: number = this.p + i - 1;
        if ( index < 0 ) {
			throw new  java.lang.IndexOutOfBoundsException(S`LT(`+i+S`) gives negative index`);
		}

		if ( index >= this.n ) {
			/* assert n > 0 && tokens[n-1].getType() == Token.EOF; */ 
			return this.tokens[this.n-1];
		}

		return this.tokens[index];
	}

	public LA = (i: number):  number => {
		return this.LT(i).getType();
	}

	public getTokenSource = ():  TokenSource | null => {
		return this.tokenSource;
	}


	public getText():  java.lang.String | null;


	public getText(ctx: RuleContext| null):  java.lang.String | null;


	public getText(interval: Interval| null):  java.lang.String | null;


	public getText(start: Token| null, stop: Token| null):  java.lang.String | null;



	public getText(ctxOrIntervalOrStart?: RuleContext | Interval | Token | null, stop?: Token | null):  java.lang.String | null {
if (ctxOrIntervalOrStart === undefined) {
		return S``;
	}
 else if (ctxOrIntervalOrStart instanceof RuleContext && stop === undefined) {
const ctx = ctxOrIntervalOrStart as RuleContext;
		return this.getText(ctx.getSourceInterval());
	}
 else if (ctxOrIntervalOrStart instanceof Interval && stop === undefined) {
const interval = ctxOrIntervalOrStart as Interval;
		let  bufferStartIndex: number = this.getBufferStartIndex();
		let  bufferStopIndex: number = bufferStartIndex + this.tokens.length - 1;

		let  start: number = interval.a;
		let  stop: number = interval.b;
		if (start < bufferStartIndex || stop > bufferStopIndex) {
			throw new  java.lang.UnsupportedOperationException(S`interval `+interval+S` not in token buffer window: `+
													bufferStartIndex+S`..`+bufferStopIndex);
		}

		let  a: number = start - bufferStartIndex;
		let  b: number = stop - bufferStartIndex;

		let  buf: java.lang.StringBuilder = new  java.lang.StringBuilder();
		for (let  i: number = a; i <= b; i++) {
			let  t: Token = this.tokens[i];
			buf.append(t.getText());
		}

		return buf.toString();
	}
 else  {
let start = ctxOrIntervalOrStart as Token;
		return this.getText(Interval.of(start.getTokenIndex(), stop.getTokenIndex()));
	}

}


	public consume = ():  void => {
		if (this.LA(1) === Token.EOF) {
			throw new  java.lang.IllegalStateException(S`cannot consume EOF`);
		}

		// buf always has at least tokens[p==0] in this method due to ctor
		this.lastToken = this.tokens[this.p];   // track last token for LT(-1)

		// if we're at last token and no markers, opportunity to flush buffer
		if ( this.p === this.n-1 && this.numMarkers===0 ) {
			this.n = 0;
			this.p = -1; // p++ will leave this at 0
			this.lastTokenBufferStart = this.lastToken;
		}

		this.p++;
		this.currentTokenIndex++;
		this.sync(1);
	}

	/** Make sure we have 'need' elements from current position {@link #p p}. Last valid
	 *  {@code p} index is {@code tokens.length-1}.  {@code p+need-1} is the tokens index 'need' elements
	 *  ahead.  If we need 1 element, {@code (p+1-1)==p} must be less than {@code tokens.length}.
	 */
	protected sync = (want: number):  void => {
		let  need: number = (this.p+want-1) - this.n + 1; // how many more elements we need?
		if ( need > 0 ) {
			this.fill(need);
		}
	}

	/**
	 * Add {@code n} elements to the buffer. Returns the number of tokens
	 * actually added to the buffer. If the return value is less than {@code n},
	 * then EOF was reached before {@code n} tokens could be added.
	 */
	protected fill = (n: number):  number => {
		for (let  i: number=0; i<n; i++) {
			if (this.n > 0 && this.tokens[this.n-1].getType() === Token.EOF) {
				return i;
			}

			let  t: Token = this.tokenSource.nextToken();
			this.add(t);
		}

		return n;
	}

	protected add = (t: Token| null):  void => {
		if ( this.n>=this.tokens.length ) {
			this.tokens = java.util.Arrays.copyOf(this.tokens, this.tokens.length * 2);
		}

		if (t instanceof WritableToken) {
			(t as WritableToken).setTokenIndex(this.getBufferStartIndex() + this.n);
		}

		this.tokens[this.n++] = t;
	}

	/**
	 * Return a marker that we can release later.
	 *
	 * <p>The specific marker value used for this class allows for some level of
	 * protection against misuse where {@code seek()} is called on a mark or
	 * {@code release()} is called in the wrong order.</p>
	 */
	public mark = ():  number => {
		if (this.numMarkers === 0) {
			this.lastTokenBufferStart = this.lastToken;
		}

		let  mark: number = -this.numMarkers - 1;
		this.numMarkers++;
		return mark;
	}

	public release = (marker: number):  void => {
		let  expectedMark: number = -this.numMarkers;
		if ( marker!==expectedMark ) {
			throw new  java.lang.IllegalStateException(S`release() called with an invalid marker.`);
		}

		this.numMarkers--;
		if ( this.numMarkers===0 ) { // can we release buffer?
			if (this.p > 0) {
				// Copy tokens[p]..tokens[n-1] to tokens[0]..tokens[(n-1)-p], reset ptrs
				// p is last valid token; move nothing if p==n as we have no valid char
				java.lang.System.arraycopy(this.tokens, this.p, this.tokens, 0, this.n - this.p); // shift n-p tokens from p to 0
				this.n = this.n - this.p;
				this.p = 0;
			}

			this.lastTokenBufferStart = this.lastToken;
		}
	}

	public index = ():  number => {
		return this.currentTokenIndex;
	}

	public seek = (index: number):  void => { // seek to absolute index
		if (index === this.currentTokenIndex) {
			return;
		}

		if (index > this.currentTokenIndex) {
			this.sync(index - this.currentTokenIndex);
			index = Math.min(index, this.getBufferStartIndex() + this.n - 1);
		}

		let  bufferStartIndex: number = this.getBufferStartIndex();
		let  i: number = index - bufferStartIndex;
		if ( i < 0 ) {
			throw new  java.lang.IllegalArgumentException(S`cannot seek to negative index ` + index);
		}
		else {
 if (i >= this.n) {
			throw new  java.lang.UnsupportedOperationException(S`seek to index outside buffer: `+
													index+S` not in `+ bufferStartIndex +S`..`+(bufferStartIndex +this.n));
		}
}


		this.p = i;
		this.currentTokenIndex = index;
		if (this.p === 0) {
			this.lastToken = this.lastTokenBufferStart;
		}
		else {
			this.lastToken = this.tokens[this.p-1];
		}
	}

	public size = ():  number => {
		throw new  java.lang.UnsupportedOperationException(S`Unbuffered stream cannot know its size`);
	}

	public getSourceName = ():  java.lang.String | null => {
		return this.tokenSource.getSourceName();
	}

	protected readonly  getBufferStartIndex = ():  number => {
		return this.currentTokenIndex - this.p;
	}
}
