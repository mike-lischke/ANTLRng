/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */



import { S } from "jree";
import { CharStream } from "../../CharStream";
import { CommonToken } from "../../CommonToken";
import { Lexer } from "../../Lexer";
import { LexerNoViableAltException } from "../../LexerNoViableAltException";
import { Token } from "../../Token";
import { Vocabulary } from "../../Vocabulary";
import { VocabularyImpl } from "../../VocabularyImpl";
import { ATN } from "../../atn/ATN";
import { Interval } from "../../misc/Interval";




/** Mimic the old XPathLexer from .g4 file */
export class XPathLexer extends Lexer {
	public readonly 
		TOKEN_REF:  number=1;
public readonly  RULE_REF:  number=2;
public readonly  ANYWHERE:  number=3;
public readonly  ROOT:  number=4;
public readonly  WILDCARD:  number=5;
public readonly  BANG:  number=6;
public readonly  ID:  number=7;
public readonly 
		STRING:  number=8;
	public readonly  modeNames:  java.lang.String[] | null = [
		S`DEFAULT_MODE`
	];

	public readonly  ruleNames:  java.lang.String[] | null = [
		S`ANYWHERE`, S`ROOT`, S`WILDCARD`, S`BANG`, S`ID`, S`NameChar`, S`NameStartChar`,
		S`STRING`
	];

	private readonly  _LITERAL_NAMES:  java.lang.String[] | null = [
		null, null, null, S`'//'`, S`'/'`, S`'*'`, S`'!'`
	];
	private readonly  _SYMBOLIC_NAMES:  java.lang.String[] | null = [
		null, S`TOKEN_REF`, S`RULE_REF`, S`ANYWHERE`, S`ROOT`, S`WILDCARD`, S`BANG`,
		S`ID`, S`STRING`
	];
	public readonly  VOCABULARY:  Vocabulary | null = new  VocabularyImpl(XPathLexer._LITERAL_NAMES, XPathLexer._SYMBOLIC_NAMES);

	/**
	 * @deprecated Use {@link #VOCABULARY} instead.
	 */
	public readonly  tokenNames:  java.lang.String[] | null;

	public getGrammarFileName = ():  java.lang.String | null => { return S`XPathLexer.g4`; }

	public getRuleNames = ():  java.lang.String[] | null => { return XPathLexer.ruleNames; }

	public getModeNames = ():  java.lang.String[] | null => { return XPathLexer.modeNames; }

	public getTokenNames = ():  java.lang.String[] | null => {
		return XPathLexer.tokenNames;
	}

	public getVocabulary = ():  Vocabulary | null => {
		return XPathLexer.VOCABULARY;
	}

	public getATN = ():  ATN | null => {
		return null;
	}

	protected  line:  number = 1;
	protected  charPositionInLine:  number = 0;

	public constructor(input: CharStream| null) {
		super(input);
	}

	public nextToken = ():  Token | null => {
		this._tokenStartCharIndex = this._input.index();
		 let  t: CommonToken = null;
		while ( t===null ) {
			switch ( this._input.LA(1) ) {
				case '/':{
					this.consume();
					if ( this._input.LA(1)==='/' ) {
						this.consume();
						t = new  CommonToken(XPathLexer.ANYWHERE, S`//`);
					}
					else {
						t = new  CommonToken(XPathLexer.ROOT, S`/`);
					}
					break;
}

				case '*':{
					this.consume();
					t = new  CommonToken(XPathLexer.WILDCARD, S`*`);
					break;
}

				case '!':{
					this.consume();
					t = new  CommonToken(XPathLexer.BANG, S`!`);
					break;
}

				case '\'':{
					 let  s: java.lang.String = this.matchString();
					t = new  CommonToken(XPathLexer.STRING, s);
					break;
}

				case CharStream.EOF :{
					return new  CommonToken(Recognizer.EOF, S`<EOF>`);
}

				default:{
					if ( this.isNameStartChar(this._input.LA(1)) ) {
						 let  id: java.lang.String = this.matchID();
						if ( java.lang.Character.isUpperCase(id.charAt(0)) ) {
 t = new  CommonToken(XPathLexer.TOKEN_REF, id);
}

						else {
 t = new  CommonToken(XPathLexer.RULE_REF, id);
}

					}
					else {
						throw new  LexerNoViableAltException(this, this._input, this._tokenStartCharIndex, null);
					}
					break;
}

			}
		}
		t.setStartIndex(this._tokenStartCharIndex);
		t.setCharPositionInLine(this._tokenStartCharIndex);
		t.setLine(this.line);
		return t;
	}

	public consume = ():  void => {
		 let  curChar: number = this._input.LA(1);
		if ( curChar==='\n' ) {
			this.line++;
			this.charPositionInLine=0;
		}
		else {
			this.charPositionInLine++;
		}
		this._input.consume();
	}

	public getCharPositionInLine = ():  number => {
		return this.charPositionInLine;
	}

	public matchID = ():  java.lang.String | null => {
		 let  start: number = this._input.index();
		this.consume(); // drop start char
		while ( this.isNameChar(this._input.LA(1)) ) {
			this.consume();
		}
		return this._input.getText(Interval.of(start,this._input.index()-1));
	}

	public matchString = ():  java.lang.String | null => {
		 let  start: number = this._input.index();
		this.consume(); // drop first quote
		while ( this._input.LA(1)!=='\'' ) {
			this.consume();
		}
		this.consume(); // drop last quote
		return this._input.getText(Interval.of(start,this._input.index()-1));
	}

	public isNameChar = (c: number):  boolean => { return java.lang.Character.isUnicodeIdentifierPart(c); }

	public isNameStartChar = (c: number):  boolean => { return java.lang.Character.isUnicodeIdentifierStart(c); }
	static {
		XPathLexer.tokenNames = new   Array<java.lang.String>(XPathLexer._SYMBOLIC_NAMES.length);
		for ( let  i: number = 0; i < XPathLexer.tokenNames.length; i++) {
			XPathLexer.tokenNames[i] = XPathLexer.VOCABULARY.getLiteralName(i);
			if (XPathLexer.tokenNames[i] === null) {
				XPathLexer.tokenNames[i] = XPathLexer.VOCABULARY.getSymbolicName(i);
			}

			if (XPathLexer.tokenNames[i] === null) {
				XPathLexer.tokenNames[i] = S`<INVALID>`;
			}
		}
	}
}
