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



import { java } from "../../../../../lib/java/java";
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
export  class ListTokenSource extends  TokenSource {
	/**
	 * The wrapped collection of {@link Token} objects to return.
	 */
	protected readonly  tokens?:  java.util.List< Token>;

	/**
	 * The name of the input source. If this value is {@code null}, a call to
	 * {@link #getSourceName} should return the source name used to create the
	 * the next token in {@link #tokens} (or the previous token if the end of
	 * the input has been reached).
	 */
	private readonly  sourceName?:  string;

	/**
	 * The index into {@link #tokens} of token to return by the next call to
	 * {@link #nextToken}. The end of the input is indicated by this value
	 * being greater than or equal to the number of items in {@link #tokens}.
	 */
	protected i:  number;

	/**
	 * This field caches the EOF token for the token source.
	 */
	protected eofToken?:  Token;

	/**
	 * This is the backing field for {@link #getTokenFactory} and
	 * {@link setTokenFactory}.
	 */
	private _factory?:  TokenFactory<unknown> = CommonTokenFactory.DEFAULT;

	/**
	 * Constructs a new {@link ListTokenSource} instance from the specified
	 * collection of {@link Token} objects.
	 *
	 * @param tokens The collection of {@link Token} objects to provide as a
	 * {@link TokenSource}.
	 * @exception NullPointerException if {@code tokens} is {@code null}
	 */
	public constructor(tokens: java.util.List< Token>);

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
	public constructor(tokens: java.util.List< Token>, sourceName: string);
public constructor(tokens: java.util.List< Token>, sourceName?: string) {
const $this = (tokens: java.util.List< Token>, sourceName?: string): void => {
if (sourceName === undefined) {
		$this(tokens, undefined);
	}
 else  {
		super();
if (tokens === undefined) {
			throw new  java.lang.NullPointerException("tokens cannot be null");
		}

		this.tokens = tokens;
		this.sourceName = sourceName;
	}
};

$this(tokens, sourceName);

}


	/**
	 * {@inheritDoc}
	 */
	public getCharPositionInLine = (): number => {
		if (this.i < this.tokens.size()) {
			return this.tokens.get(this.i).getCharPositionInLine();
		}
		else { if (this.eofToken !== undefined) {
			return this.eofToken.getCharPositionInLine();
		}
		else { if (this.tokens.size() > 0) {
			// have to calculate the result from the line/column of the previous
			// token, along with the text of the token.
			let  lastToken: Token = this.tokens.get(this.tokens.size() - 1);
			let  tokenText: string = lastToken.getText();
			if (tokenText !== undefined) {
				let  lastNewLine: number = tokenText.lastIndexOf('\n');
				if (lastNewLine >= 0) {
					return tokenText.length - lastNewLine - 1;
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
	 * {@inheritDoc}
	 */
	public nextToken = (): Token => {
		if (this.i >= this.tokens.size()) {
			if (this.eofToken === undefined) {
				let  start: number = -1;
				if (this.tokens.size() > 0) {
					let  previousStop: number = this.tokens.get(this.tokens.size() - 1).getStopIndex();
					if (previousStop !== -1) {
						start = previousStop + 1;
					}
				}

				let  stop: number = Math.max(-1, start - 1);
				this.eofToken = this._factory.create(new  Pair<TokenSource, CharStream>(this, this.getInputStream()), Token.EOF, "EOF", Token.DEFAULT_CHANNEL, start, stop, this.getLine(), this.getCharPositionInLine());
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
	 * {@inheritDoc}
	 */
	public getLine = (): number => {
		if (this.i < this.tokens.size()) {
			return this.tokens.get(this.i).getLine();
		}
		else { if (this.eofToken !== undefined) {
			return this.eofToken.getLine();
		}
		else { if (this.tokens.size() > 0) {
			// have to calculate the result from the line/column of the previous
			// token, along with the text of the token.
			let  lastToken: Token = this.tokens.get(this.tokens.size() - 1);
			let  line: number = lastToken.getLine();

			let  tokenText: string = lastToken.getText();
			if (tokenText !== undefined) {
				for (let  i: number = 0; i < tokenText.length; i++) {
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
	 * {@inheritDoc}
	 */
	public getInputStream = (): CharStream => {
		if (this.i < this.tokens.size()) {
			return this.tokens.get(this.i).getInputStream();
		}
		else { if (this.eofToken !== undefined) {
			return this.eofToken.getInputStream();
		}
		else { if (this.tokens.size() > 0) {
			return this.tokens.get(this.tokens.size() - 1).getInputStream();
		}
}

}


		// no input stream information is available
		return undefined;
	}

	/**
	 * {@inheritDoc}
	 */
	public getSourceName = (): string => {
		if (this.sourceName !== undefined) {
			return this.sourceName;
		}

		let  inputStream: CharStream = this.getInputStream();
		if (inputStream !== undefined) {
			return inputStream.getSourceName();
		}

		return "List";
	}

	/**
	 * {@inheritDoc}
	 */
	public setTokenFactory = (factory: TokenFactory<unknown>): void => {
		this._factory = factory;
	}

	/**
	 * {@inheritDoc}
	 */
	public getTokenFactory = (): TokenFactory<unknown> => {
		return this._factory;
	}
}
