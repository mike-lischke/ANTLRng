/* java2ts: keep */

/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/* eslint-disable @typescript-eslint/naming-convention */

import { BufferedTokenStream } from "./BufferedTokenStream";
import { Token } from "./Token";
import { TokenSource } from "./TokenSource";

/**
 * This class extends {@link BufferedTokenStream} with functionality to filter
 * token streams to tokens on a particular channel (tokens where
 * {@link Token#getChannel} returns a particular value).
 *
 * <p>
 * This token stream provides access to all tokens by index or when calling
 * methods like {@link #getText}. The channel filtering is only used for code
 * accessing tokens via the lookahead methods {@link #LA}, {@link #LT}, and
 * {@link #LB}.</p>
 *
 * <p>
 * By default, tokens are placed on the default channel
 * ({@link Token#DEFAULT_CHANNEL}), but may be reassigned by using the
 * {@code ->channel(HIDDEN)} lexer command, or by using an embedded action to
 * call {@link Lexer#setChannel}.
 * </p>
 *
 * <p>
 * Note: lexer rules which use the {@code ->skip} lexer command or call
 * {@link Lexer#skip} do not produce tokens at all, so input text matched by
 * such a rule will not be available as part of the token stream, regardless of
 * channel.</p>we
 */
export class CommonTokenStream extends BufferedTokenStream {
    /**
     * Specifies the channel to use for filtering tokens.
     *
     * <p>
     * The default value is {@link Token#DEFAULT_CHANNEL}, which matches the
     * default channel assigned to tokens created by the lexer.</p>
     */
    protected channel = Token.DEFAULT_CHANNEL;

    /**
     * Constructs a new {@link CommonTokenStream} using the specified token
     * source and the default token channel ({@link Token#DEFAULT_CHANNEL}).
     *
     * @param tokenSource The token source.
     */
    /* eslint-disable constructor-super, @typescript-eslint/no-unsafe-call */
    public constructor(tokenSource: TokenSource);
    /**
     * Constructs a new {@link CommonTokenStream} using the specified token
     * source and filtering tokens to the specified channel. Only tokens whose
     * {@link Token#getChannel} matches {@code channel} or have the
     * {@link Token#getType} equal to {@link Token#EOF} will be returned by the
     * token stream lookahead methods.
     *
     * @param tokenSource The token source.
     * @param channel The channel to use for filtering tokens.
     */
    public constructor(tokenSource: TokenSource, channel: number);
    public constructor(...args: unknown[]) {
        const tokenSource = args[0] as TokenSource;
        super(tokenSource);

        if (args.length === 2) {
            this.channel = args[1] as number;
        }
    }

    public LT = (k: number): Token | null => {
        this.lazyInit();
        if (k === 0) {
            return null;
        }

        if (k < 0) {
            return this.LB(-k);
        }

        let i: number = this.p;
        let n = 1; // we know tokens[p] is a good one
        // find k good tokens
        while (n < k) {
            // skip off-channel tokens, but make sure to not look past EOF
            if (this.sync(i + 1)) {
                i = this.nextTokenOnChannel(i + 1, this.channel);
            }
            n++;
        }

        return this.tokens.get(i);
    };

    /**
     * Count EOF just once.
     *
     * @returns The number of on-channel tokens in the token source buffer
     */
    public getNumberOfOnChannelTokens = (): number => {
        let n = 0;
        this.fill();
        for (let i = 0; i < this.tokens.size(); i++) {
            const t: Token = this.tokens.get(i);
            if (t.getChannel() === this.channel) {
                n++;
            }

            if (t.getType() === Token.EOF) {
                break;
            }

        }

        return n;
    };

    protected adjustSeekIndex = (i: number): number => {
        return this.nextTokenOnChannel(i, this.channel);
    };

    protected LB = (k: number): Token | null => {
        if (k === 0 || (this.p - k) < 0) {
            return null;
        }

        let i: number = this.p;
        let n = 1;
        // find k good tokens looking backwards
        while (n <= k && i > 0) {
            // skip off-channel tokens
            i = this.previousTokenOnChannel(i - 1, this.channel);
            n++;
        }
        if (i < 0) {
            return null;
        }

        return this.tokens.get(i);
    };

}
