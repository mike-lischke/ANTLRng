/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */




import { JavaObject, java, S } from "jree";
import { CharStream } from "./CharStream";
import { CommonTokenFactory } from "./CommonTokenFactory";
import { Token } from "./Token";
import { TokenFactory } from "./TokenFactory";
import { TokenSource } from "./TokenSource";
import { Pair } from "./misc/Pair";




/**
 * Provides an implementation of {@link TokenSource} as a wrapper around a list
 * of {@link Token} objects.
 *
 * <p>If the final token in the list is an {@link Token#EOF} token, it will be used
 * as the EOF token for every call to {@link #nextToken} after the end of the
 * list is reached. Otherwise, an EOF token will be created.</p>
 */
export class ListTokenSource extends JavaObject implements TokenSource {
	/**
	 * The wrapped collection of {@link Token} objects to return.
	 */
	protected readonly tokens:  java.util.List< Token> | null;

	/**
	 * The name of the input source. If this value is {@code null}, a call to
	 * {@link #getSourceName} should return the source name used to create the
	 * the next token in {@link #tokens} (or the previous token if the end of
	 * the input has been reached).
	 */
	private readonly sourceName:  java.lang.String | null;

	/**
	 * The index into {@link #tokens} of token to return by the next call to
	 * {@link #nextToken}. The end of the input is indicated by this value
	 * being greater than or equal to the number of items in {@link #tokens}.
	 */
	protected i:  number;

	/**
	 * This field caches the EOF token for the token source.
	 */
	protected eofToken:  Token | null;

	/**
	 * This is the backing field for {@link #getTokenFactory} and
	 * {@link setTokenFactory}.
	 */
	private _factory:  TokenFactory<unknown> | null = CommonTokenFactory.DEFAULT;

	/**
	 * Constructs a new {@link ListTokenSource} instance from the specified
	 * collection of {@link Token} objects.
	 *
	 * @param tokens The collection of {@link Token} objects to provide as a
	 * {@link TokenSource}.
	 * @exception NullPointerException if {@code tokens} is {@code null}
	 */
	/* eslint-disable constructor-super, @typescript-eslint/no-unsafe-call */
public constructor(tokens: java.util.List< Token>| null);

	/**
	 * Constructs a new {@link ListTokenSource} instance from the specified
	 * collection of {@link Token} objects and source name.
	 *
	 * @param tokens The collection of {@link Token} objects to provide as a
	 * {@link TokenSource}.
	 * @param sourceName The name of the {@link TokenSource}. If this value is
	 * {@code null}, {@link #getSourceName} will attempt to infer the name from
	 * the next {@link Token} (or the previous token if the end of the input has
	 * been reached).
	 *
	 * @exception NullPointerException if {@code tokens} is {@code null}
	 */
	public constructor(tokens: java.util.List< Token>| null, sourceName: java.lang.String| null);
/* @ts-expect-error, because of the super() call in the closure. */
public constructor(tokens: java.util.List< Token> | null, sourceName?: java.lang.String | null) {
const $this = (tokens: java.util.List< Token> | null, sourceName?: java.lang.String | null): void => {
if (sourceName === undefined) {
		$this(tokens, null);
	}
 else  {

/* @ts-expect-error, because of the super() call in the closure. */
		super();
if (tokens === null) {
			throw new  java.lang.NullPointerException(S`tokens cannot be null`);
		}

		this.tokens = tokens;
		this.sourceName = sourceName;
	}
};

$this(tokens, sourceName);

}
/* eslint-enable constructor-super, @typescript-eslint/no-unsafe-call */

	/**
	 */
	public getCharPositionInLine = ():  number => {
		if (this.i < this.tokens.size()) {
			return this.tokens.get(this.i).getCharPositionInLine();
		}
		else {
 if (this.eofToken !== null) {
			return this.eofToken.getCharPositionInLine();
		}
		else {
 if (this.tokens.size() > 0) {
			// have to calculate the result from the line/column of the previous
			// token, along with the text of the token.
			let  lastToken: Token = this.tokens.get(this.tokens.size() - 1);
			let  tokenText: java.lang.String = lastToken.getText();
			if (tokenText !== null) {
				let  lastNewLine: number = tokenText.lastIndexOf('\n');
				if (lastNewLine >= 0) {
					return tokenText.length() - lastNewLine - 1;
				}
			}

			return lastToken.getCharPositionInLine() + lastToken.getStopIndex() - lastToken.getStartIndex() + 1;
		}
}

}


		// only reach this if tokens is empty, meaning EOF occurs at the first
		// position in the input
		return 0;
	}

	/**
	 */
	public nextToken = ():  Token | null => {
		if (this.i >= this.tokens.size()) {
			if (this.eofToken === null) {
				let  start: number = -1;
				if (this.tokens.size() > 0) {
					let  previousStop: number = this.tokens.get(this.tokens.size() - 1).getStopIndex();
					if (previousStop !== -1) {
						start = previousStop + 1;
					}
				}

				let  stop: number = Math.max(-1, start - 1);
				this.eofToken = this._factory.create(new  Pair<TokenSource, CharStream>(this, this.getInputStream()), Token.EOF, S`EOF`, Token.DEFAULT_CHANNEL, start, stop, this.getLine(), this.getCharPositionInLine());
			}

			return this.eofToken;
		}

		let  t: Token = this.tokens.get(this.i);
		if (this.i === this.tokens.size() - 1 && t.getType() === Token.EOF) {
			this.eofToken = t;
		}

		this.i++;
		return t;
	}

	/**
	 */
	public getLine = ():  number => {
		if (this.i < this.tokens.size()) {
			return this.tokens.get(this.i).getLine();
		}
		else {
 if (this.eofToken !== null) {
			return this.eofToken.getLine();
		}
		else {
 if (this.tokens.size() > 0) {
			// have to calculate the result from the line/column of the previous
			// token, along with the text of the token.
			let  lastToken: Token = this.tokens.get(this.tokens.size() - 1);
			let  line: number = lastToken.getLine();

			let  tokenText: java.lang.String = lastToken.getText();
			if (tokenText !== null) {
				for (let  i: number = 0; i < tokenText.length(); i++) {
					if (tokenText.charAt(i) === '\n') {
						line++;
					}
				}
			}

			// if no text is available, assume the token did not contain any newline characters.
			return line;
		}
}

}


		// only reach this if tokens is empty, meaning EOF occurs at the first
		// position in the input
		return 1;
	}

	/**
	 */
	public getInputStream = ():  CharStream | null => {
		if (this.i < this.tokens.size()) {
			return this.tokens.get(this.i).getInputStream();
		}
		else {
 if (this.eofToken !== null) {
			return this.eofToken.getInputStream();
		}
		else {
 if (this.tokens.size() > 0) {
			return this.tokens.get(this.tokens.size() - 1).getInputStream();
		}
}

}


		// no input stream information is available
		return null;
	}

	/**
	 */
	public getSourceName = ():  java.lang.String | null => {
		if (this.sourceName !== null) {
			return this.sourceName;
		}

		let  inputStream: CharStream = this.getInputStream();
		if (inputStream !== null) {
			return inputStream.getSourceName();
		}

		return S`List`;
	}

	/**
	 */
	public setTokenFactory = (factory: TokenFactory<unknown>| null):  void => {
		this._factory = factory;
	}

	/**
	 */
	public getTokenFactory = ():  TokenFactory<unknown> | null => {
		return this._factory;
	}
}
