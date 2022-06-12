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



import { CharStream } from "./CharStream";
import { Recognizer } from "./Recognizer";
import { Token } from "./Token";
import { TokenSource } from "./TokenSource";
import { WritableToken } from "./WritableToken";
import { Interval } from "./misc/Interval";
import { Pair } from "./misc/Pair";




export  class CommonToken implements WritableToken {
	/**
	 * An empty {@link Pair} which is used as the default value of
	 * {@link #source} for tokens that do not have a source.
	 */
	protected static readonly  EMPTY_SOURCE?:  Pair<TokenSource, CharStream> =
		new  Pair<TokenSource, CharStream>(undefined, undefined);

	/**
	 * This is the backing field for {@link #getType} and {@link #setType}.
	 */
	protected type:  number;

	/**
	 * This is the backing field for {@link #getLine} and {@link #setLine}.
	 */
	protected line:  number;

	/**
	 * This is the backing field for {@link #getCharPositionInLine} and
	 * {@link #setCharPositionInLine}.
	 */
	protected charPositionInLine:  number = -1; // set to invalid position

	/**
	 * This is the backing field for {@link #getChannel} and
	 * {@link #setChannel}.
	 */
	protected channel:  number=Token.DEFAULT_CHANNEL;

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

	protected source?:  Pair<TokenSource, CharStream>;

	/**
	 * This is the backing field for {@link #getText} when the token text is
	 * explicitly set in the constructor or via {@link #setText}.
	 *
	 * @see #getText()
	 */
	protected text?:  string;

	/**
	 * This is the backing field for {@link #getTokenIndex} and
	 * {@link #setTokenIndex}.
	 */
	protected index:  number = -1;

	/**
	 * This is the backing field for {@link #getStartIndex} and
	 * {@link #setStartIndex}.
	 */
	protected start:  number;

	/**
	 * This is the backing field for {@link #getStopIndex} and
	 * {@link #setStopIndex}.
	 */
	protected stop:  number;

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
	public constructor(type: number, text: string);

	public constructor(source: Pair<TokenSource, CharStream>, type: number, channel: number, start: number, stop: number);
public constructor(typeOrOldTokenOrSource: number | Token | Pair<TokenSource, CharStream>, textOrType?: string | number, channel?: number, start?: number, stop?: number) {
if (typeof typeOrOldTokenOrSource === "number" && textOrType === undefined) {
const type = typeOrOldTokenOrSource as number;
		super();
this.type = type;
		this.source = CommonToken.EMPTY_SOURCE;
	}
 else if (typeOrOldTokenOrSource instanceof Token && textOrType === undefined) {
const oldToken = typeOrOldTokenOrSource as Token;
		super();
this.type = oldToken.getType();
		this.line = oldToken.getLine();
		this.index = oldToken.getTokenIndex();
		this.charPositionInLine = oldToken.getCharPositionInLine();
		this.channel = oldToken.getChannel();
		this.start = oldToken.getStartIndex();
		this.stop = oldToken.getStopIndex();

		if (oldToken instanceof CommonToken) {
			this.text = (oldToken as CommonToken).text;
			this.source = (oldToken as CommonToken).source;
		}
		else {
			this.text = oldToken.getText();
			this.source = new  Pair<TokenSource, CharStream>(oldToken.getTokenSource(), oldToken.getInputStream());
		}
	}
 else if (typeof typeOrOldTokenOrSource === "number" && typeof textOrType === "string" && channel === undefined) {
const type = typeOrOldTokenOrSource as number;
const text = textOrType as string;
		super();
this.type = type;
		this.channel = Token.DEFAULT_CHANNEL;
		this.text = text;
		this.source = CommonToken.EMPTY_SOURCE;
	}
 else  {
let source = typeOrOldTokenOrSource as Pair<TokenSource, CharStream>;
let type = textOrType as number;
		super();
this.source = source;
		this.type = type;
		this.channel = channel;
		this.start = start;
		this.stop = stop;
		if (source.a !== undefined) {
			this.line = source.a.getLine();
			this.charPositionInLine = source.a.getCharPositionInLine();
		}
	}

}


	public getType = (): number => {
		return this.type;
	}

	public setLine = (line: number): void => {
		this.line = line;
	}

	public getText = (): string => {
		if ( this.text!==undefined ) {
			return this.text;
		}

		let  input: CharStream = this.getInputStream();
		if ( input===undefined ) {
 return undefined;
}

		let  n: number = input.size();
		if ( this.start<n && this.stop<n) {
			return input.getText(Interval.of(this.start,this.stop));
		}
		else {
			return "<EOF>";
		}
	}

	/**
	 * Explicitly set the text for this token. If {code text} is not
	 * {@code null}, then {@link #getText} will return this value rather than
	 * extracting the text from the input.
	 *
	 * @param text The explicit text of the token, or {@code null} if the text
	 * should be obtained from the input along with the start and stop indexes
	 * of the token.
	 */
	public setText = (text: string): void => {
		this.text = text;
	}

	public getLine = (): number => {
		return this.line;
	}

	public getCharPositionInLine = (): number => {
		return this.charPositionInLine;
	}

	public setCharPositionInLine = (charPositionInLine: number): void => {
		this.charPositionInLine = charPositionInLine;
	}

	public getChannel = (): number => {
		return this.channel;
	}

	public setChannel = (channel: number): void => {
		this.channel = channel;
	}

	public setType = (type: number): void => {
		this.type = type;
	}

	public getStartIndex = (): number => {
		return this.start;
	}

	public setStartIndex = (start: number): void => {
		this.start = start;
	}

	public getStopIndex = (): number => {
		return this.stop;
	}

	public setStopIndex = (stop: number): void => {
		this.stop = stop;
	}

	public getTokenIndex = (): number => {
		return this.index;
	}

	public setTokenIndex = (index: number): void => {
		this.index = index;
	}

	public getTokenSource = (): TokenSource => {
		return this.source.a;
	}

	public getInputStream = (): CharStream => {
		return this.source.b;
	}

	public toString(): string;

	public toString(r: Recognizer<unknown, unknown>): string;


	public toString(r?: Recognizer<unknown, unknown>):  string {
if (r === undefined) {
		return this.toString(undefined);
	}
 else  {
		let  channelStr: string = "";
		if ( this.channel>0 ) {
			channelStr=",channel="+this.channel;
		}
		let  txt: string = this.getText();
		if ( txt!==undefined ) {
			txt = txt.replace("\n","\\n");
			txt = txt.replace("\r","\\r");
			txt = txt.replace("\t","\\t");
		}
		else {
			txt = "<no text>";
		}
		let  typeString: string = String(this.type);
		if ( r!==undefined ) {
			typeString = r.getVocabulary().getDisplayName(this.type);
		}
		return "[@"+this.getTokenIndex()+","+this.start+":"+this.stop+"='"+txt+"',<"+typeString+">"+channelStr+","+this.line+":"+this.getCharPositionInLine()+"]";
	}

}

}
