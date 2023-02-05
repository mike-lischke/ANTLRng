/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */




import { JavaObject } from "jree";
import { CharStream } from "./CharStream";
import { CommonToken } from "./CommonToken";
import { TokenFactory } from "./TokenFactory";
import { TokenSource } from "./TokenSource";
import { Interval } from "./misc/Interval";
import { Pair } from "./misc/Pair";




/**
 * This default implementation of {@link TokenFactory} creates
 * {@link CommonToken} objects.
 */
export class CommonTokenFactory extends JavaObject implements TokenFactory<CommonToken> {
	/**
	 * The default {@link CommonTokenFactory} instance.
	 *
	 * <p>
	 * This token factory does not explicitly copy token text when constructing
	 * tokens.</p>
	 */
	public readonly  DEFAULT:  TokenFactory<CommonToken> | null = new  CommonTokenFactory();

	/**
	 * Indicates whether {@link CommonToken#setText} should be called after
	 * constructing tokens to explicitly set the text. This is useful for cases
	 * where the input stream might not be able to provide arbitrary substrings
	 * of text from the input after the lexer creates a token (e.g. the
	 * implementation of {@link CharStream#getText} in
	 * {@link UnbufferedCharStream} throws an
	 * {@link UnsupportedOperationException}). Explicitly setting the token text
	 * allows {@link Token#getText} to be called at any time regardless of the
	 * input stream implementation.
	 *
	 * <p>
	 * The default value is {@code false} to avoid the performance and memory
	 * overhead of copying text for every token unless explicitly requested.</p>
	 */
	protected readonly  copyText:  boolean;

	/**
	 * Constructs a {@link CommonTokenFactory} with the specified value for
	 * {@link #copyText}.
	 *
	 * <p>
	 * When {@code copyText} is {@code false}, the {@link #DEFAULT} instance
	 * should be used instead of constructing a new instance.</p>
	 *
	 * @param copyText The value for {@link #copyText}.
	 */
	/* eslint-disable constructor-super, @typescript-eslint/no-unsafe-call */


	/**
	 * Constructs a {@link CommonTokenFactory} with {@link #copyText} set to
	 * {@code false}.
	 *
	 * <p>
	 * The {@link #DEFAULT} instance should be used instead of calling this
	 * directly.</p>
	 */
	public constructor();public constructor(copyText: boolean);
/* @ts-expect-error, because of the super() call in the closure. */
public constructor(copyText?: boolean) {
const $this = (copyText?: boolean): void => {
if (copyText === undefined) { $this(false); }
 else  {

/* @ts-expect-error, because of the super() call in the closure. */ super();
this.copyText = copyText; }
};

$this(copyText);

}
/* eslint-enable constructor-super, @typescript-eslint/no-unsafe-call */

	public create(type: number, text: java.lang.String| null):  CommonToken | null;

	public create(source: Pair<TokenSource, CharStream>| null, type: number, text: java.lang.String| null,
							  channel: number, start: number, stop: number,
							  line: number, charPositionInLine: number):  CommonToken | null;


	public create(typeOrSource: number | Pair<TokenSource, CharStream> | null, textOrType: java.lang.String | number | null, text?: java.lang.String | null, channel?: number, start?: number, stop?: number, line?: number, charPositionInLine?: number):  CommonToken | null {
if (typeof typeOrSource === "number" && textOrType instanceof java.lang.String && text === undefined) {
const type = typeOrSource as number;
const text = textOrType as java.lang.String;
		return new  CommonToken(type, text);
	}
 else 
	{
let source = typeOrSource as Pair<TokenSource, CharStream>;
let type = textOrType as number;
		 let  t: CommonToken = new  CommonToken(source, type, channel, start, stop);
		t.setLine(line);
		t.setCharPositionInLine(charPositionInLine);
		if ( text!==null ) {
			t.setText(text);
		}
		else {
 if ( this.copyText && source.b !== null ) {
			t.setText(source.b.getText(Interval.of(start,stop)));
		}
}


		return t;
	}

}

}
