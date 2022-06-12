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



import { java } from "../../../../../../../lib/java/java";
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
export  class XPathLexer extends Lexer {
	public static readonly 
		TOKEN_REF:  number=1;
public static readonly  RULE_REF:  number=2;
public static readonly  ANYWHERE:  number=3;
public static readonly  ROOT:  number=4;
public static readonly  WILDCARD:  number=5;
public static readonly  BANG:  number=6;
public static readonly  ID:  number=7;
public static readonly 
		STRING:  number=8;
	public static modeNames?:  string[] = [
		"DEFAULT_MODE"
	];

	public static readonly  ruleNames?:  string[] = [
		"ANYWHERE", "ROOT", "WILDCARD", "BANG", "ID", "NameChar", "NameStartChar",
		"STRING"
	];

	private static readonly  _LITERAL_NAMES?:  string[] = [
		undefined, undefined, undefined, "'//'", "'/'", "'*'", "'!'"
	];
	private static readonly  _SYMBOLIC_NAMES?:  string[] = [
		undefined, "TOKEN_REF", "RULE_REF", "ANYWHERE", "ROOT", "WILDCARD", "BANG",
		"ID", "STRING"
	];
	public static readonly  VOCABULARY?:  Vocabulary = new  VocabularyImpl(XPathLexer._LITERAL_NAMES, XPathLexer._SYMBOLIC_NAMES);

	/**
	 * @deprecated Use {@link #VOCABULARY} instead.
	 */
	public static readonly  tokenNames?:  string[];

	public getGrammarFileName = (): string => { return "XPathLexer.g4"; }

	public getRuleNames = (): string[] => { return XPathLexer.ruleNames; }

	public getModeNames = (): string[] => { return XPathLexer.modeNames; }

	public getTokenNames = (): string[] => {
		return XPathLexer.tokenNames;
	}

	public getVocabulary = (): Vocabulary => {
		return XPathLexer.VOCABULARY;
	}

	public getATN = (): ATN => {
		return undefined;
	}

	protected line:  number = 1;
	protected charPositionInLine:  number = 0;

	public constructor(input: CharStream) {
		super(input);
	}

	public nextToken = (): Token => {
		Lexer._tokenStartCharIndex = Lexer._input.index();
		let  t: CommonToken = undefined;
		while ( t===undefined ) {
			switch ( Lexer._input.LA(1) ) {
				case '/':
					this.consume();
					if ( Lexer._input.LA(1)==='/' ) {
						this.consume();
						t = new  CommonToken(XPathLexer.ANYWHERE, "//");
					}
					else {
						t = new  CommonToken(XPathLexer.ROOT, "/");
					}
					break;
				case '*':
					this.consume();
					t = new  CommonToken(XPathLexer.WILDCARD, "*");
					break;
				case '!':
					this.consume();
					t = new  CommonToken(XPathLexer.BANG, "!");
					break;
				case '\'':
					let  s: string = this.matchString();
					t = new  CommonToken(XPathLexer.STRING, s);
					break;
				case CharStream.EOF :
					return new  CommonToken(Token.EOF, "<EOF>");
				default:
					if ( this.isNameStartChar(Lexer._input.LA(1)) ) {
						let  id: string = this.matchID();
						if ( java.lang.Character.isUpperCase(id.charAt(0)) ) {
 t = new  CommonToken(XPathLexer.TOKEN_REF, id);
}

						else { t = new  CommonToken(XPathLexer.RULE_REF, id);
}

					}
					else {
						throw new  LexerNoViableAltException(this, Lexer._input, Lexer._tokenStartCharIndex, undefined);
					}
					break;
			}
		}
		t.setStartIndex(Lexer._tokenStartCharIndex);
		t.setCharPositionInLine(Lexer._tokenStartCharIndex);
		t.setLine(this.line);
		return t;
	}

	public consume = (): void => {
		let  curChar: number = Lexer._input.LA(1);
		if ( curChar==='\n' ) {
			this.line++;
			this.charPositionInLine=0;
		}
		else {
			this.charPositionInLine++;
		}
		Lexer._input.consume();
	}

	public getCharPositionInLine = (): number => {
		return this.charPositionInLine;
	}

	public matchID = (): string => {
		let  start: number = Lexer._input.index();
		this.consume(); // drop start char
		while ( this.isNameChar(Lexer._input.LA(1)) ) {
			this.consume();
		}
		return Lexer._input.getText(Interval.of(start,Lexer._input.index()-1));
	}

	public matchString = (): string => {
		let  start: number = Lexer._input.index();
		this.consume(); // drop first quote
		while ( Lexer._input.LA(1)!=='\'' ) {
			this.consume();
		}
		this.consume(); // drop last quote
		return Lexer._input.getText(Interval.of(start,Lexer._input.index()-1));
	}

	public isNameChar = (c: number): boolean => { return java.lang.Character.isUnicodeIdentifierPart(c); }

	public isNameStartChar = (c: number): boolean => { return java.lang.Character.isUnicodeIdentifierStart(c); }
	static {
		XPathLexer.tokenNames = new   Array<string>(XPathLexer._SYMBOLIC_NAMES.length);
		for (let  i: number = 0; i < XPathLexer.tokenNames.length; i++) {
			XPathLexer.tokenNames[i] = XPathLexer.VOCABULARY.getLiteralName(i);
			if (XPathLexer.tokenNames[i] === undefined) {
				XPathLexer.tokenNames[i] = XPathLexer.VOCABULARY.getSymbolicName(i);
			}

			if (XPathLexer.tokenNames[i] === undefined) {
				XPathLexer.tokenNames[i] = "<INVALID>";
			}
		}
	}
}
