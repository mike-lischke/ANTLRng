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




export class CommonToken extends JavaObject implements WritableToken, java.io.Serializable {
	/**
	 * An empty {@link Pair} which is used as the default value of
	 * {@link #source} for tokens that do not have a source.
	 */
	protected static readonly EMPTY_SOURCE:  Pair<TokenSource, CharStream> | null =
		new  Pair<TokenSource, CharStream>(null, null);

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

	protected source:  Pair<TokenSource, CharStream> | null;

	/**
	 * This is the backing field for {@link #getText} when the token text is
	 * explicitly set in the constructor or via {@link #setText}.
	 *
	 * @see #getText()
	 */
	protected text:  java.lang.String | null;

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
	public constructor(oldToken: Token| null);

	/**
	 * Constructs a new {@link CommonToken} with the specified token type and
	 * text.
	 *
	 * @param type The token type.
	 * @param text The text of the token.
	 */
	public constructor(type: number, text: java.lang.String| null);

	public constructor(source: Pair<TokenSource, CharStream>| null, type: number, channel: number, start: number, stop: number);
public constructor(typeOrOldTokenOrSource: number | Token | Pair<TokenSource, CharStream> | null, textOrType?: java.lang.String | number | null, channel?: number, start?: number, stop?: number) {
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
 else if (typeof typeOrOldTokenOrSource === "number" && textOrType instanceof java.lang.String && channel === undefined) {
const type = typeOrOldTokenOrSource as number;
const text = textOrType as java.lang.String;
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
		if (source.a !== null) {
			this.line = source.a.getLine();
			this.charPositionInLine = source.a.getCharPositionInLine();
		}
	}

}


	public getType = ():  number => {
		return this.type;
	}

	public setLine = (line: number):  void => {
		this.line = line;
	}

	public getText = ():  java.lang.String | null => {
		if ( this.text!==null ) {
			return this.text;
		}

		let  input: CharStream = this.getInputStream();
		if ( input===null ) {
 return null;
}

		let  n: number = input.size();
		if ( this.start<n && this.stop<n) {
			return input.getText(Interval.of(this.start,this.stop));
		}
		else {
			return S`<EOF>`;
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
	public setText = (text: java.lang.String| null):  void => {
		this.text = text;
	}

	public getLine = ():  number => {
		return this.line;
	}

	public getCharPositionInLine = ():  number => {
		return this.charPositionInLine;
	}

	public setCharPositionInLine = (charPositionInLine: number):  void => {
		this.charPositionInLine = charPositionInLine;
	}

	public getChannel = ():  number => {
		return this.channel;
	}

	public setChannel = (channel: number):  void => {
		this.channel = channel;
	}

	public setType = (type: number):  void => {
		this.type = type;
	}

	public getStartIndex = ():  number => {
		return this.start;
	}

	public setStartIndex = (start: number):  void => {
		this.start = start;
	}

	public getStopIndex = ():  number => {
		return this.stop;
	}

	public setStopIndex = (stop: number):  void => {
		this.stop = stop;
	}

	public getTokenIndex = ():  number => {
		return this.index;
	}

	public setTokenIndex = (index: number):  void => {
		this.index = index;
	}

	public getTokenSource = ():  TokenSource | null => {
		return this.source.a;
	}

	public getInputStream = ():  CharStream | null => {
		return this.source.b;
	}

	public toString():  java.lang.String | null;

	public toString(r: Recognizer<unknown, unknown>| null):  java.lang.String | null;


	public toString(r?: Recognizer<unknown, unknown> | null):  java.lang.String | null {
if (r === undefined) {
		return this.toString(null);
	}
 else  {
		let  channelStr: java.lang.String = S``;
		if ( this.channel>0 ) {
			channelStr=S`,channel=`+this.channel;
		}
		let  txt: java.lang.String = this.getText();
		if ( txt!==null ) {
			txt = txt.replace(S`\n`,S`\\n`);
			txt = txt.replace(S`\r`,S`\\r`);
			txt = txt.replace(S`\t`,S`\\t`);
		}
		else {
			txt = S`<no text>`;
		}
		let  typeString: java.lang.String = java.lang.String.valueOf(this.type);
		if ( r!==null ) {
			typeString = r.getVocabulary().getDisplayName(this.type);
		}
		return S`[@`+this.getTokenIndex()+S`,`+this.start+S`:`+this.stop+S`='`+txt+S`',<`+typeString+S`>`+channelStr+S`,`+this.line+S`:`+this.getCharPositionInLine()+S`]`;
	}

}

}
