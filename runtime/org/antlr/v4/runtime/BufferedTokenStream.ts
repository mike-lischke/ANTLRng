/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */




import { JavaObject, java, S } from "jree";
import { IntStream } from "./IntStream";
import { Lexer } from "./Lexer";
import { RuleContext } from "./RuleContext";
import { Token } from "./Token";
import { TokenSource } from "./TokenSource";
import { TokenStream } from "./TokenStream";
import { WritableToken } from "./WritableToken";
import { Interval } from "./misc/Interval";




/**
 * This implementation of {@link TokenStream} loads tokens from a
 * {@link TokenSource} on-demand, and places the tokens in a buffer to provide
 * access to any previous token by index.
 *
 * <p>
 * This token stream ignores the value of {@link Token#getChannel}. If your
 * parser requires the token stream filter tokens to only those on a particular
 * channel, such as {@link Token#DEFAULT_CHANNEL} or
 * {@link Token#HIDDEN_CHANNEL}, use a filtering token stream such a
 * {@link CommonTokenStream}.</p>
 */
export class BufferedTokenStream extends JavaObject implements TokenStream {
	/**
	 * The {@link TokenSource} from which tokens for this stream are fetched.
	 */
    protected tokenSource:  TokenSource | null;

	/**
	 * A collection of all tokens fetched from the token source. The list is
	 * considered a complete view of the input once {@link #fetchedEOF} is set
	 * to `true`.
	 */
    protected tokens:  java.util.List<Token> | null = new  java.util.ArrayList<Token>(100);

	/**
	 * The index into {@link #tokens} of the current token (next token to
	 * {@link #consume}). {@link #tokens}{@code [}{@link #p}{@code ]} should be
	 * {@link #LT LT(1)}.
	 *
	 * <p>This field is set to -1 when the stream is first constructed or when
	 * {@link #setTokenSource} is called, indicating that the first token has
	 * not yet been fetched from the token source. For additional information,
	 * see the documentation of {@link IntStream} for a description of
	 * Initializing Methods.</p>
	 */
    protected p:  number = -1;

	/**
	 * Indicates whether the {@link Token#EOF} token has been fetched from
	 * {@link #tokenSource} and added to {@link #tokens}. This field improves
	 * performance for the following cases:
	 *
	 * <ul>
	 * <li>{@link #consume}: The lookahead check in {@link #consume} to prevent
	 * consuming the EOF symbol is optimized by checking the values of
	 * {@link #fetchedEOF} and {@link #p} instead of calling {@link #LA}.</li>
	 * <li>{@link #fetch}: The check to prevent adding multiple EOF symbols into
	 * {@link #tokens} is trivial with this field.</li>
	 * <ul>
	 */
	protected fetchedEOF:  boolean;

    public constructor(tokenSource: TokenSource| null) {
		super();
if (tokenSource === null) {
			throw new  java.lang.NullPointerException(S`tokenSource cannot be null`);
		}
        this.tokenSource = tokenSource;
    }

    public getTokenSource = ():  TokenSource | null => { return this.tokenSource; }

	public index = ():  number => { return this.p; }

    public mark = ():  number => {
		return 0;
	}

	public release = (marker: number):  void => {
		// no resources to release
	}

	/**
	 * This method resets the token stream back to the first token in the
	 * buffer. It is equivalent to calling {@link #seek}{@code (0)}.
	 *
	 * @see #setTokenSource(TokenSource)
	 * @deprecated Use {@code seek(0)} instead.
	 */
	public reset = ():  void => {
        this.seek(0);
    }

    public seek = (index: number):  void => {
        this.lazyInit();
        this.p = this.adjustSeekIndex(index);
    }

    public size = ():  number => { return this.tokens.size(); }

    public consume = ():  void => {
		let  skipEofCheck: boolean;
		if (this.p >= 0) {
			if (this.fetchedEOF) {
				// the last token in tokens is EOF. skip check if p indexes any
				// fetched token except the last.
				skipEofCheck = this.p < this.tokens.size() - 1;
			}
			else {
				// no EOF token in tokens. skip check if p indexes a fetched token.
				skipEofCheck = this.p < this.tokens.size();
			}
		}
		else {
			// not yet initialized
			skipEofCheck = false;
		}

		if (!skipEofCheck && this.LA(1) === IntStream.EOF) {
			throw new  java.lang.IllegalStateException(S`cannot consume EOF`);
		}

		if (this.sync(this.p + 1)) {
			this.p = this.adjustSeekIndex(this.p + 1);
		}
    }

    /** Make sure index {@code i} in tokens has a token.
	 *
	 * @returns `true` if a token is located at index {@code i}, otherwise
	 *    {@code false}.
	 * @see #get(int i)
	 */
    protected sync = (i: number):  boolean => {
		/* assert i >= 0; */ 
        let  n: number = i - this.tokens.size() + 1; // how many more elements we need?
        //System.out.println("sync("+i+") needs "+n);
        if ( n > 0 ) {
			let  fetched: number = this.fetch(n);
			return fetched >= n;
		}

		return true;
    }

    /** Add {@code n} elements to buffer.
	 *
	 * @returns The actual number of elements added to the buffer.
	 */
    protected fetch = (n: number):  number => {
		if (this.fetchedEOF) {
			return 0;
		}

        for (let  i: number = 0; i < n; i++) {
            let  t: Token = this.tokenSource.nextToken();
            if ( t instanceof WritableToken ) {
                (t as WritableToken).setTokenIndex(this.tokens.size());
            }
            this.tokens.add(t);
            if ( t.getType()===Token.EOF ) {
				this.fetchedEOF = true;
				return i + 1;
			}
        }

		return n;
    }

    public get(i: number):  Token | null;

	/** Get all tokens from start..stop inclusively */
	public get(start: number, stop: number):  java.util.List<Token> | null;


    public get(iOrStart: number, stop?: number):  Token | null |  java.util.List<Token> | null {
if (stop === undefined) {
        if ( i < 0 || i >= this.tokens.size() ) {
            throw new  java.lang.IndexOutOfBoundsException(S`token index `+i+S` out of range 0..`+(this.tokens.size()-1));
        }
        return this.tokens.get(i);
    }
 else  {
let start = iOrStart as number;
		if ( start<0 || stop<0 ) {
 return null;
}

		this.lazyInit();
		let  subset: java.util.List<Token> = new  java.util.ArrayList<Token>();
		if ( stop>=this.tokens.size() ) {
 stop = this.tokens.size()-1;
}

		for (let  i: number = start; i <= stop; i++) {
			let  t: Token = this.tokens.get(i);
			if ( t.getType()===Token.EOF ) {
 break;
}

			subset.add(t);
		}
		return subset;
	}

}


	public LA = (i: number):  number => { return this.LT(i).getType(); }

    protected LB = (k: number):  Token | null => {
        if ( (this.p-k)<0 ) {
 return null;
}

        return this.tokens.get(this.p-k);
    }


    public LT = (k: number):  Token | null => {
        this.lazyInit();
        if ( k===0 ) {
 return null;
}

        if ( k < 0 ) {
 return this.LB(-k);
}


		let  i: number = this.p + k - 1;
		this.sync(i);
        if ( i >= this.tokens.size() ) { // return EOF token
            // EOF must be last token
            return this.tokens.get(this.tokens.size()-1);
        }
//		if ( i>range ) range = i;
        return this.tokens.get(i);
    }

	/**
	 * Allowed derived classes to modify the behavior of operations which change
	 * the current stream position by adjusting the target token index of a seek
	 * operation. The default implementation simply returns {@code i}. If an
	 * exception is thrown in this method, the current stream index should not be
	 * changed.
	 *
	 * <p>For example, {@link CommonTokenStream} overrides this method to ensure that
	 * the seek target is always an on-channel token.</p>
	 *
	 * @param i The target token index.
	 * @returns The adjusted target token index.
	 */
	protected adjustSeekIndex = (i: number):  number => {
		return i;
	}

	protected readonly lazyInit = ():  void => {
		if (this.p === -1) {
			this.setup();
		}
	}

    protected setup = ():  void => {
		this.sync(0);
		this.p = this.adjustSeekIndex(0);
	}

    /** Reset this token stream by setting its token source. */
    public setTokenSource = (tokenSource: TokenSource| null):  void => {
        this.tokenSource = tokenSource;
        this.tokens.clear();
        this.p = -1;
        this.fetchedEOF = false;
    }

    public getTokens():  java.util.List<Token> | null;

    public getTokens(start: number, stop: number):  java.util.List<Token> | null;

    /** Given a start and stop index, return a List of all tokens in
     *  the token type BitSet.  Return null if no tokens were found.  This
     *  method looks at both on and off channel tokens.
     */
    public getTokens(start: number, stop: number, types: java.util.Set<java.lang.Integer>| null):  java.util.List<Token> | null;

    public getTokens(start: number, stop: number, ttype: number):  java.util.List<Token> | null;


    public getTokens(start?: number, stop?: number, typesOrTtype?: java.util.Set<java.lang.Integer> | number | null):  java.util.List<Token> | null {
if (start === undefined) { return this.tokens; }
 else if (typeof start === "number" && typeof stop === "number" && typesOrTtype === undefined) {
        return this.getTokens(start, stop, null);
    }
 else if (typeof start === "number" && typeof stop === "number" && typesOrTtype instanceof java.util.Set) {
const types = typesOrTtype as java.util.Set<java.lang.Integer>;
        this.lazyInit();
		if ( start<0 || stop>=this.tokens.size() ||
			 stop<0  || start>=this.tokens.size() )
		{
			throw new  java.lang.IndexOutOfBoundsException(S`start `+start+S` or stop `+stop+
												S` not in 0..`+(this.tokens.size()-1));
		}
        if ( start>stop ) {
 return null;
}


        // list = tokens[start:stop]:{T t, t.getType() in types}
        let  filteredTokens: java.util.List<Token> = new  java.util.ArrayList<Token>();
        for (let  i: number=start; i<=stop; i++) {
            let  t: Token = this.tokens.get(i);
            if ( types===null || types.contains(t.getType()) ) {
                filteredTokens.add(t);
            }
        }
        if ( filteredTokens.isEmpty() ) {
            filteredTokens = null;
        }
        return filteredTokens;
    }
 else  {
let ttype = typesOrTtype as number;
		let  s: java.util.HashSet<java.lang.Integer> = new  java.util.HashSet<java.lang.Integer>(ttype);
		s.add(ttype);
		return this.getTokens(start,stop, s);
    }

}


	/**
	 * Given a starting index, return the index of the next token on channel.
	 * Return {@code i} if {@code tokens[i]} is on channel. Return the index of
	 * the EOF token if there are no tokens on channel between {@code i} and
	 * EOF.
	 */
	protected nextTokenOnChannel = (i: number, channel: number):  number => {
		this.sync(i);
		if (i >= this.size()) {
			return this.size() - 1;
		}

		let  token: Token = this.tokens.get(i);
		while ( token.getChannel()!==channel ) {
			if ( token.getType()===Token.EOF ) {
				return i;
			}

			i++;
			this.sync(i);
			token = this.tokens.get(i);
		}

		return i;
	}

	/**
	 * Given a starting index, return the index of the previous token on
	 * channel. Return {@code i} if {@code tokens[i]} is on channel. Return -1
	 * if there are no tokens on channel between {@code i} and 0.
	 *
	 * <p>
	 * If {@code i} specifies an index at or after the EOF token, the EOF token
	 * index is returned. This is due to the fact that the EOF token is treated
	 * as though it were on every channel.</p>
	 */
	protected previousTokenOnChannel = (i: number, channel: number):  number => {
		this.sync(i);
		if (i >= this.size()) {
			// the EOF token is on every channel
			return this.size() - 1;
		}

		while (i >= 0) {
			let  token: Token = this.tokens.get(i);
			if (token.getType() === Token.EOF || token.getChannel() === channel) {
				return i;
			}

			i--;
		}

		return i;
	}

	/** Collect all hidden tokens (any off-default channel) to the right of
	 *  the current token up until we see a token on DEFAULT_TOKEN_CHANNEL
	 *  or EOF.
	 */
	public getHiddenTokensToRight(tokenIndex: number):  java.util.List<Token> | null;

	/** Collect all tokens on specified channel to the right of
	 *  the current token up until we see a token on DEFAULT_TOKEN_CHANNEL or
	 *  EOF. If channel is -1, find any non default channel token.
	 */
	public getHiddenTokensToRight(tokenIndex: number, channel: number):  java.util.List<Token> | null;


	/** Collect all tokens on specified channel to the right of
	 *  the current token up until we see a token on DEFAULT_TOKEN_CHANNEL or
	 *  EOF. If channel is -1, find any non default channel token.
	 */
	public getHiddenTokensToRight(tokenIndex: number, channel?: number):  java.util.List<Token> | null {
if (channel === undefined) {
		return this.getHiddenTokensToRight(tokenIndex, -1);
	}
 else  {
		this.lazyInit();
		if ( tokenIndex<0 || tokenIndex>=this.tokens.size() ) {
			throw new  java.lang.IndexOutOfBoundsException(tokenIndex+S` not in 0..`+(this.tokens.size()-1));
		}

		let  nextOnChannel: number =
			this.nextTokenOnChannel(tokenIndex + 1, Lexer.DEFAULT_TOKEN_CHANNEL);
		let  to: number;
		let  from: number = tokenIndex+1;
		// if none onchannel to right, nextOnChannel=-1 so set to = last token
		if ( nextOnChannel === -1 ) {
 to = this.size()-1;
}

		else {
 to = nextOnChannel;
}


		return this.filterForChannel(from, to, channel);
	}

}


	/** Collect all hidden tokens (any off-default channel) to the left of
	 *  the current token up until we see a token on DEFAULT_TOKEN_CHANNEL.
	 */
	public getHiddenTokensToLeft(tokenIndex: number):  java.util.List<Token> | null;

	/** Collect all tokens on specified channel to the left of
	 *  the current token up until we see a token on DEFAULT_TOKEN_CHANNEL.
	 *  If channel is -1, find any non default channel token.
	 */
	public getHiddenTokensToLeft(tokenIndex: number, channel: number):  java.util.List<Token> | null;


	/** Collect all tokens on specified channel to the left of
	 *  the current token up until we see a token on DEFAULT_TOKEN_CHANNEL.
	 *  If channel is -1, find any non default channel token.
	 */
	public getHiddenTokensToLeft(tokenIndex: number, channel?: number):  java.util.List<Token> | null {
if (channel === undefined) {
		return this.getHiddenTokensToLeft(tokenIndex, -1);
	}
 else  {
		this.lazyInit();
		if ( tokenIndex<0 || tokenIndex>=this.tokens.size() ) {
			throw new  java.lang.IndexOutOfBoundsException(tokenIndex+S` not in 0..`+(this.tokens.size()-1));
		}

		if (tokenIndex === 0) {
			// obviously no tokens can appear before the first token
			return null;
		}

		let  prevOnChannel: number =
			this.previousTokenOnChannel(tokenIndex - 1, Lexer.DEFAULT_TOKEN_CHANNEL);
		if ( prevOnChannel === tokenIndex - 1 ) {
 return null;
}

		// if none onchannel to left, prevOnChannel=-1 then from=0
		let  from: number = prevOnChannel+1;
		let  to: number = tokenIndex-1;

		return this.filterForChannel(from, to, channel);
	}

}


	protected filterForChannel = (from: number, to: number, channel: number):  java.util.List<Token> | null => {
		let  hidden: java.util.List<Token> = new  java.util.ArrayList<Token>();
		for (let  i: number=from; i<=to; i++) {
			let  t: Token = this.tokens.get(i);
			if ( channel===-1 ) {
				if ( t.getChannel()!== Lexer.DEFAULT_TOKEN_CHANNEL ) {
 hidden.add(t);
}

			}
			else {
				if ( t.getChannel()===channel ) {
 hidden.add(t);
}

			}
		}
		if ( hidden.size()===0 ) {
 return null;
}

		return hidden;
	}

	public getSourceName = ():  java.lang.String | null => {	return this.tokenSource.getSourceName();	}

	/** Get the text of all tokens in this buffer. */

	public getText():  java.lang.String | null;

	public getText(interval: Interval| null):  java.lang.String | null;


	public getText(ctx: RuleContext| null):  java.lang.String | null;


    public getText(start: Token| null, stop: Token| null):  java.lang.String | null;


	/** Get the text of all tokens in this buffer. */

	public getText(intervalOrCtxOrStart?: Interval | RuleContext | Token | null, stop?: Token | null):  java.lang.String | null {
if (intervalOrCtxOrStart === undefined) {
		return this.getText(Interval.of(0,this.size()-1));
	}
 else if (intervalOrCtxOrStart instanceof Interval && stop === undefined) {
const interval = intervalOrCtxOrStart as Interval;
		let  start: number = interval.a;
		let  stop: number = interval.b;
		if ( start<0 || stop<0 ) {
 return S``;
}

		this.sync(stop);
        if ( stop>=this.tokens.size() ) {
 stop = this.tokens.size()-1;
}


		let  buf: java.lang.StringBuilder = new  java.lang.StringBuilder();
		for (let  i: number = start; i <= stop; i++) {
			let  t: Token = this.tokens.get(i);
			if ( t.getType()===Token.EOF ) {
 break;
}

			buf.append(t.getText());
		}
		return buf.toString();
    }
 else if (intervalOrCtxOrStart instanceof RuleContext && stop === undefined) {
const ctx = intervalOrCtxOrStart as RuleContext;
		return this.getText(ctx.getSourceInterval());
	}
 else  {
let start = intervalOrCtxOrStart as Token;
        if ( start!==null && stop!==null ) {
            return this.getText(Interval.of(start.getTokenIndex(), stop.getTokenIndex()));
        }

		return S``;
    }

}


    /** Get all tokens from lexer until EOF */
    public fill = ():  void => {
        this.lazyInit();
		 let  blockSize: number = 1000;
		while (true) {
			let  fetched: number = this.fetch(blockSize);
			if (fetched < blockSize) {
				return;
			}
		}
    }
}
