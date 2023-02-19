/* java2ts: keep */

/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/* eslint-disable @typescript-eslint/naming-convention */

import { JavaObject, java, S, I } from "jree";
import { IntStream } from "./IntStream";
import { Lexer } from "./Lexer";
import { RuleContext } from "./RuleContext";
import { Token } from "./Token";
import { TokenSource } from "./TokenSource";
import { TokenStream } from "./TokenStream";
import { isWritableToken } from "./WritableToken";
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
    protected tokenSource: TokenSource;

    /**
     * A collection of all tokens fetched from the token source. The list is
     * considered a complete view of the input once {@link #fetchedEOF} is set
     * to `true`.
     */
    protected tokens: java.util.List<Token> = new java.util.ArrayList<Token>(100);

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
    protected p = -1;

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
    protected fetchedEOF = false;

    public constructor(tokenSource: TokenSource | null) {
        super();
        if (tokenSource === null) {
            throw new java.lang.NullPointerException(S`tokenSource cannot be null`);
        }
        this.tokenSource = tokenSource;
    }

    public getTokenSource = (): TokenSource => {
        return this.tokenSource;
    };

    public index = (): number => {
        return this.p;
    };

    public mark = (): number => {
        return 0;
    };

    public release = (marker: number): void => {
        // no resources to release
    };

    /**
     * This method resets the token stream back to the first token in the
     * buffer. It is equivalent to calling {@link #seek}{@code (0)}.
     *
     * @see #setTokenSource(TokenSource)
     * @deprecated Use {@code seek(0)} instead.
     */
    public reset = (): void => {
        this.seek(0);
    };

    public seek = (index: number): void => {
        this.lazyInit();
        this.p = this.adjustSeekIndex(index);
    };

    public size = (): number => {
        return this.tokens.size();
    };

    public consume = (): void => {
        let skipEofCheck: boolean;
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
            throw new java.lang.IllegalStateException(S`cannot consume EOF`);
        }

        if (this.sync(this.p + 1)) {
            this.p = this.adjustSeekIndex(this.p + 1);
        }
    };

    public get(i: number): Token | null;
    /** Get all tokens from start..stop inclusively */
    public get(start: number, stop: number): java.util.List<Token> | null;
    public get(...args: unknown[]): Token | null | java.util.List<Token> | null {
        switch (args.length) {
            case 1: {
                const i = args[0] as number;
                if (i < 0 || i >= this.tokens.size()) {
                    throw new java.lang.IndexOutOfBoundsException(
                        S`token index ${i} out of range 0..${(this.tokens.size() - 1)}`);
                }

                return this.tokens.get(i);
            }

            case 2: {
                const start = args[0] as number;
                let stop = args[1] as number;
                if (start < 0 || stop < 0) {
                    return null;
                }

                this.lazyInit();
                const subset: java.util.List<Token> = new java.util.ArrayList<Token>();
                if (stop >= this.tokens.size()) {
                    stop = this.tokens.size() - 1;
                }

                for (let i = start; i <= stop; i++) {
                    const t = this.tokens.get(i);
                    if (t.getType() === Token.EOF) {
                        break;
                    }

                    subset.add(t);
                }

                return subset;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }

    public LA = (i: number): number => {
        return this.LT(i)!.getType();
    };

    public LT = (k: number): Token | null => {
        this.lazyInit();
        if (k === 0) {
            return null;
        }

        if (k < 0) {
            return this.LB(-k);
        }

        const i: number = this.p + k - 1;
        this.sync(i);
        if (i >= this.tokens.size()) { // return EOF token
            // EOF must be last token
            return this.tokens.get(this.tokens.size() - 1);
        }

        //		if ( i>range ) range = i;
        return this.tokens.get(i);
    };

    /**
     * Reset this token stream by setting its token source.
     *
     * @param tokenSource The new token source.
     */
    public setTokenSource = (tokenSource: TokenSource): void => {
        this.tokenSource = tokenSource;
        this.tokens.clear();
        this.p = -1;
        this.fetchedEOF = false;
    };

    public getTokens(): java.util.List<Token> | null;
    public getTokens(start: number, stop: number): java.util.List<Token> | null;
    /**
     * Given a start and stop index, return a List of all tokens in
     *  the token type BitSet.  Return null if no tokens were found.  This
     *  method looks at both on and off channel tokens.
     */
    public getTokens(start: number, stop: number,
        types: java.util.Set<java.lang.Integer> | null): java.util.List<Token> | null;
    public getTokens(start: number, stop: number, ttype: number): java.util.List<Token> | null;
    public getTokens(...args: unknown[]): java.util.List<Token> | null {
        switch (args.length) {
            case 0: {
                return this.tokens;
            }

            case 2:
            case 3: {
                const start = args[0] as number;
                const stop = args[1] as number;

                if (args.length === 3 && typeof args[2] === "number") {
                    const ttype = args[2];
                    const s = new java.util.HashSet<java.lang.Integer>(ttype);
                    s.add(I`{ttype}`);

                    return this.getTokens(start, stop, s);
                } else {
                    const types = args.length === 3 ? args[2] as java.util.Set<java.lang.Integer> : null;
                    this.lazyInit();
                    if (start < 0 || stop >= this.tokens.size() ||
                        stop < 0 || start >= this.tokens.size()) {
                        throw new java.lang.IndexOutOfBoundsException(
                            S`start ${start} or stop ${stop} not in 0..${(this.tokens.size() - 1)}`);
                    }

                    if (start > stop) {
                        return null;
                    }

                    let filteredTokens: java.util.List<Token> | null = new java.util.ArrayList<Token>();
                    for (let i = start; i <= stop; i++) {
                        const t = this.tokens.get(i);
                        if (types === null || types.contains(I`${t.getType()}`)) {
                            filteredTokens.add(t);
                        }
                    }

                    if (filteredTokens.isEmpty()) {
                        filteredTokens = null;
                    }

                    return filteredTokens;
                }
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }

    /**
     * Collect all hidden tokens (any off-default channel) to the right of
     *  the current token up until we see a token on DEFAULT_TOKEN_CHANNEL
     *  or EOF.
     */
    public getHiddenTokensToRight(tokenIndex: number): java.util.List<Token> | null;

    /**
     * Collect all tokens on specified channel to the right of
     *  the current token up until we see a token on DEFAULT_TOKEN_CHANNEL or
     *  EOF. If channel is -1, find any non default channel token.
     */
    public getHiddenTokensToRight(tokenIndex: number, channel: number): java.util.List<Token> | null;
    public getHiddenTokensToRight(tokenIndex: number, channel?: number): java.util.List<Token> | null {
        channel ??= -1;
        this.lazyInit();
        if (tokenIndex < 0 || tokenIndex >= this.tokens.size()) {
            throw new java.lang.IndexOutOfBoundsException(S`${tokenIndex} not in 0..${(this.tokens.size() - 1)}`);
        }

        const nextOnChannel = this.nextTokenOnChannel(tokenIndex + 1, Lexer.DEFAULT_TOKEN_CHANNEL);
        let to: number;
        const from = tokenIndex + 1;

        // if none on-channel to right, nextOnChannel=-1 so set to = last token
        if (nextOnChannel === -1) {
            to = this.size() - 1;
        } else {
            to = nextOnChannel;
        }

        return this.filterForChannel(from, to, channel);
    }

    /**
     * Collect all hidden tokens (any off-default channel) to the left of
     *  the current token up until we see a token on DEFAULT_TOKEN_CHANNEL.
     */
    public getHiddenTokensToLeft(tokenIndex: number): java.util.List<Token> | null;
    /**
     * Collect all tokens on specified channel to the left of
     *  the current token up until we see a token on DEFAULT_TOKEN_CHANNEL.
     *  If channel is -1, find any non default channel token.
     */
    public getHiddenTokensToLeft(tokenIndex: number, channel: number): java.util.List<Token> | null;
    public getHiddenTokensToLeft(tokenIndex: number, channel?: number): java.util.List<Token> | null {
        channel ??= -1;

        this.lazyInit();
        if (tokenIndex < 0 || tokenIndex >= this.tokens.size()) {
            throw new java.lang.IndexOutOfBoundsException(S`${tokenIndex} not in 0..${(this.tokens.size() - 1)}`);
        }

        if (tokenIndex === 0) {
            // obviously no tokens can appear before the first token
            return null;
        }

        const prevOnChannel: number =
            this.previousTokenOnChannel(tokenIndex - 1, Lexer.DEFAULT_TOKEN_CHANNEL);
        if (prevOnChannel === tokenIndex - 1) {
            return null;
        }

        // if none on-channel to left, prevOnChannel=-1 then from=0
        const from = prevOnChannel + 1;
        const to = tokenIndex - 1;

        return this.filterForChannel(from, to, channel);
    }

    public getSourceName = (): java.lang.String => {
        return this.tokenSource.getSourceName();
    };

    /** Get the text of all tokens in this buffer. */
    public getText(): java.lang.String;
    public getText(interval: Interval): java.lang.String;
    public getText(ctx: RuleContext): java.lang.String;
    public getText(start: Token, stop: Token): java.lang.String;
    public getText(...args: unknown[]): java.lang.String {
        switch (args.length) {
            case 0: {
                return this.getText(Interval.of(0, this.size() - 1));
            }

            case 1: {
                if (args[0] instanceof Interval) {
                    const interval = args[0];
                    const start = interval.a;
                    let stop = interval.b;
                    if (start < 0 || stop < 0) {
                        return S``;
                    }

                    this.sync(stop);
                    if (stop >= this.tokens.size()) {
                        stop = this.tokens.size() - 1;
                    }

                    const buf: java.lang.StringBuilder = new java.lang.StringBuilder();
                    for (let i: number = start; i <= stop; i++) {
                        const t: Token = this.tokens.get(i);
                        if (t.getType() === Token.EOF) {
                            break;
                        }

                        buf.append(t.getText());
                    }

                    return buf.toString();
                } else {
                    const ctx = args[0] as RuleContext;

                    return this.getText(ctx.getSourceInterval());
                }
            }

            case 2: {
                const start = args[0] as Token;
                const stop = args[1] as Token;

                if (start !== null && stop !== null) {
                    return this.getText(Interval.of(start.getTokenIndex(), stop.getTokenIndex()));
                }

                return S``;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }

    /** Get all tokens from lexer until EOF */
    public fill = (): void => {
        this.lazyInit();
        const blockSize = 1000;
        while (true) {
            const fetched: number = this.fetch(blockSize);
            if (fetched < blockSize) {
                return;
            }
        }
    };

    /**
     * Make sure index {@code i} in tokens has a token.
     *
     * @param i The index into the tokens list.
     *
     * @returns `true` if a token is located at index {@code i}, otherwise {@code false}.
     * @see #get(int i)
     */
    protected sync = (i: number): boolean => {
        const n: number = i - this.tokens.size() + 1; // how many more elements we need?
        if (n > 0) {
            const fetched: number = this.fetch(n);

            return fetched >= n;
        }

        return true;
    };

    /**
     * Add {@code n} elements to buffer.
     *
     * @param n The number of elements to add.
     * @returns The actual number of elements added to the buffer.
     */
    protected fetch = (n: number): number => {
        if (this.fetchedEOF) {
            return 0;
        }

        for (let i = 0; i < n; i++) {
            const t = this.tokenSource.nextToken();

            if (isWritableToken(t)) {
                t.setTokenIndex(this.tokens.size());
            }

            this.tokens.add(t);
            if (t.getType() === Token.EOF) {
                this.fetchedEOF = true;

                return i + 1;
            }
        }

        return n;
    };

    protected LB = (k: number): Token | null => {
        if ((this.p - k) < 0) {
            return null;
        }

        return this.tokens.get(this.p - k);
    };

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
    protected adjustSeekIndex = (i: number): number => {
        return i;
    };

    protected readonly lazyInit = (): void => {
        if (this.p === -1) {
            this.setup();
        }
    };

    protected setup = (): void => {
        this.sync(0);
        this.p = this.adjustSeekIndex(0);
    };

    /**
     * Given a starting index, return the index of the next token on channel.
     * Return {@code i} if {@code tokens[i]} is on channel. Return the index of
     * the EOF token if there are no tokens on channel between {@code i} and
     * EOF.
     *
     * @param i The index to begin looking for tokens on channel.
     * @param channel The channel to check.
     *
     * @returns The index of the next token on channel.
     */
    protected nextTokenOnChannel = (i: number, channel: number): number => {
        this.sync(i);
        if (i >= this.size()) {
            return this.size() - 1;
        }

        let token: Token = this.tokens.get(i);
        while (token.getChannel() !== channel) {
            if (token.getType() === Token.EOF) {
                return i;
            }

            i++;
            this.sync(i);
            token = this.tokens.get(i);
        }

        return i;
    };

    /**
     * Given a starting index, return the index of the previous token on
     * channel. Return {@code i} if {@code tokens[i]} is on channel. Return -1
     * if there are no tokens on channel between {@code i} and 0.
     *
     * <p>
     * If {@code i} specifies an index at or after the EOF token, the EOF token
     * index is returned. This is due to the fact that the EOF token is treated
     * as though it were on every channel.</p>
     *
     * @param i The index to begin looking for tokens on channel.
     * @param channel The channel to check.
     *
     * @returns The index of the previous token on channel.
     */
    protected previousTokenOnChannel = (i: number, channel: number): number => {
        this.sync(i);
        if (i >= this.size()) {
            // the EOF token is on every channel
            return this.size() - 1;
        }

        while (i >= 0) {
            const token: Token = this.tokens.get(i);
            if (token.getType() === Token.EOF || token.getChannel() === channel) {
                return i;
            }

            i--;
        }

        return i;
    };

    protected filterForChannel = (from: number, to: number, channel: number): java.util.List<Token> | null => {
        const hidden: java.util.List<Token> = new java.util.ArrayList<Token>();
        for (let i: number = from; i <= to; i++) {
            const t: Token = this.tokens.get(i);
            if (channel === -1) {
                if (t.getChannel() !== Lexer.DEFAULT_TOKEN_CHANNEL) {
                    hidden.add(t);
                }

            }
            else {
                if (t.getChannel() === channel) {
                    hidden.add(t);
                }

            }
        }
        if (hidden.size() === 0) {
            return null;
        }

        return hidden;
    };
}
