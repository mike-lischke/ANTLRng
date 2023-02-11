/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { JavaObject, java, S } from "jree";
import { CharStream } from "./CharStream";
import { Recognizer } from "./Recognizer";
import { Token } from "./Token";
import { TokenSource } from "./TokenSource";
import { WritableToken } from "./WritableToken";
import { Interval } from "./misc/Interval";
import { Pair } from "./misc/Pair";
import { ATNSimulator } from "./atn";

export class CommonToken extends JavaObject implements WritableToken, java.io.Serializable {
    /**
     * An empty {@link Pair} which is used as the default value of
     * {@link #source} for tokens that do not have a source.
     */
    protected static readonly EMPTY_SOURCE = new Pair<TokenSource, CharStream>(null, null);

    /**
     * This is the backing field for {@link #getType} and {@link #setType}.
     */
    protected type: number;

    /**
     * This is the backing field for {@link #getLine} and {@link #setLine}.
     */
    protected line = 0;

    /**
     * This is the backing field for {@link #getCharPositionInLine} and
     * {@link #setCharPositionInLine}.
     */
    protected charPositionInLine = -1; // set to invalid position

    /**
     * This is the backing field for {@link #getChannel} and
     * {@link #setChannel}.
     */
    protected channel: number = Token.DEFAULT_CHANNEL;

    /**
     * This is the backing field for {@link #getTokenSource} and
     * {@link #getInputStream}.
     *
     * <p>
     * These properties share a field to reduce the memory footprint of
     * {@link CommonToken}. Tokens created by a {@link CommonTokenFactory} from
     * the same source and input stream share a reference to the same
     * {@link Pair} containing these values.</p>
     */

    protected source: Pair<TokenSource, CharStream> | null;

    /**
     * This is the backing field for {@link #getText} when the token text is
     * explicitly set in the constructor or via {@link #setText}.
     *
     * @see #getText()
     */
    protected text: java.lang.String | null = null;

    /**
     * This is the backing field for {@link #getTokenIndex} and
     * {@link #setTokenIndex}.
     */
    protected index = -1;

    /**
     * This is the backing field for {@link #getStartIndex} and
     * {@link #setStartIndex}.
     */
    protected start = 0;

    /**
     * This is the backing field for {@link #getStopIndex} and
     * {@link #setStopIndex}.
     */
    protected stop = 0;

    /**
     * Constructs a new {@link CommonToken} with the specified token type.
     *
     * @param type The token type.
     */
    public constructor(type: number);
    /**
     * Constructs a new {@link CommonToken} as a copy of another {@link Token}.
     *
     * <p>
     * If {@code oldToken} is also a {@link CommonToken} instance, the newly
     * constructed token will share a reference to the {@link #text} field and
     * the {@link Pair} stored in {@link #source}. Otherwise, {@link #text} will
     * be assigned the result of calling {@link #getText}, and {@link #source}
     * will be constructed from the result of {@link Token#getTokenSource} and
     * {@link Token#getInputStream}.</p>
     *
     * @param oldToken The token to copy.
     */
    public constructor(oldToken: Token);
    /**
     * Constructs a new {@link CommonToken} with the specified token type and
     * text.
     *
     * @param type The token type.
     * @param text The text of the token.
     */
    public constructor(type: number, text: java.lang.String | null);
    public constructor(source: Pair<TokenSource, CharStream>, type: number, channel: number, start: number,
        stop: number);
    public constructor(typeOrOldTokenOrSource: number | Token | Pair<TokenSource, CharStream>,
        textOrType?: java.lang.String | number | null, channel?: number, start?: number, stop?: number) {
        super();
        if (typeof typeOrOldTokenOrSource === "number") {
            this.type = typeOrOldTokenOrSource;
            this.source = CommonToken.EMPTY_SOURCE;
            this.text = textOrType as java.lang.String;
            if (this.text) {
                this.channel = Token.DEFAULT_CHANNEL;
            }
        } else if (typeOrOldTokenOrSource instanceof Pair<TokenSource, CharStream>) {
            this.source = typeOrOldTokenOrSource;
            this.type = textOrType as number;
            this.channel = channel!;
            this.start = start!;
            this.stop = stop!;
            if (this.source.a) {
                this.line = this.source.a.getLine();
                this.charPositionInLine = this.source.a.getCharPositionInLine();
            }
        } else {
            const oldToken = typeOrOldTokenOrSource;

            this.type = oldToken.getType();
            this.line = oldToken.getLine();
            this.index = oldToken.getTokenIndex();
            this.charPositionInLine = oldToken.getCharPositionInLine();
            this.channel = oldToken.getChannel();
            this.start = oldToken.getStartIndex();
            this.stop = oldToken.getStopIndex();

            if (oldToken instanceof CommonToken) {
                this.text = oldToken.text;
                this.source = oldToken.source;
            } else {
                this.text = oldToken.getText();
                this.source = new Pair<TokenSource, CharStream>(oldToken.getTokenSource(), oldToken.getInputStream());
            }
        }
    }

    public getType = (): number => {
        return this.type;
    };

    public setLine = (line: number): void => {
        this.line = line;
    };

    public getText = (): java.lang.String | null => {
        if (this.text) {
            return this.text;
        }

        const input = this.getInputStream();
        if (input === null) {
            return null;
        }

        const n = input.size();
        if (this.start < n && this.stop < n) {
            return input.getText(Interval.of(this.start, this.stop));
        } else {
            return S`<EOF>`;
        }
    };

    /**
     * Explicitly set the text for this token. If {code text} is not
     * {@code null}, then {@link #getText} will return this value rather than
     * extracting the text from the input.
     *
     * @param text The explicit text of the token, or {@code null} if the text
     * should be obtained from the input along with the start and stop indexes
     * of the token.
     */
    public setText = (text: java.lang.String | null): void => {
        this.text = text;
    };

    public getLine = (): number => {
        return this.line;
    };

    public getCharPositionInLine = (): number => {
        return this.charPositionInLine;
    };

    public setCharPositionInLine = (charPositionInLine: number): void => {
        this.charPositionInLine = charPositionInLine;
    };

    public getChannel = (): number => {
        return this.channel;
    };

    public setChannel = (channel: number): void => {
        this.channel = channel;
    };

    public setType = (type: number): void => {
        this.type = type;
    };

    public getStartIndex = (): number => {
        return this.start;
    };

    public setStartIndex = (start: number): void => {
        this.start = start;
    };

    public getStopIndex = (): number => {
        return this.stop;
    };

    public setStopIndex = (stop: number): void => {
        this.stop = stop;
    };

    public getTokenIndex = (): number => {
        return this.index;
    };

    public setTokenIndex = (index: number): void => {
        this.index = index;
    };

    public getTokenSource = (): TokenSource | null => {
        return this.source?.a ?? null;
    };

    public getInputStream = (): CharStream | null => {
        return this.source?.b ?? null;
    };

    public toString(): java.lang.String;
    public toString(r: Recognizer<Token, ATNSimulator>): java.lang.String;
    public toString(r?: Recognizer<Token, ATNSimulator>): java.lang.String {
        const channelStr = this.channel > 0 ? S`, channel =${this.channel}` : S``;

        let txt = this.getText();
        if (txt !== null) {
            txt = txt.replace(S`\n`, S`\\n`);
            txt = txt.replace(S`\r`, S`\\r`);
            txt = txt.replace(S`\t`, S`\\t`);
        } else {
            txt = S`<no text>`;
        }

        let typeString = java.lang.String.valueOf(this.type);
        if (r) {
            typeString = r.getVocabulary().getDisplayName(this.type);
        }

        const text = "[@" + this.getTokenIndex() + "," + this.start + ":" + this.stop + "='" + txt + "',<" +
            typeString + ">" + channelStr + "," + this.line + ":" + this.getCharPositionInLine() + "]";

        return S`${text}`;
    }
}
