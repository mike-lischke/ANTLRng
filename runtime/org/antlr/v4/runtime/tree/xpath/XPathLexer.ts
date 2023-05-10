/* java2ts: keep */

/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/* eslint-disable no-underscore-dangle */

import { java, S } from "jree";

import {
    ATN, CharStream, CommonToken, Interval, Lexer, LexerNoViableAltException, Recognizer, Token, Vocabulary,
    VocabularyImpl
} from "../../";

/** Mimic the old XPathLexer from .g4 file */
export class XPathLexer extends Lexer {
    public static readonly TOKEN_REF: number = 1;
    public static readonly RULE_REF: number = 2;
    public static readonly ANYWHERE: number = 3;
    public static readonly ROOT: number = 4;
    public static readonly WILDCARD: number = 5;
    public static readonly BANG: number = 6;
    public static readonly ID: number = 7;
    public static readonly STRING = 8;

    public static readonly modeNames: string[] = [
        "DEFAULT_MODE",
    ];

    public static readonly ruleNames: string[] = [
        "ANYWHERE", "ROOT", "WILDCARD", "BANG", "ID", "NameChar", "NameStartChar", "STRING",
    ];

    /**
     * @deprecated Use {@link #VOCABULARY} instead.
     */
    public static readonly tokenNames: string[];

    private static readonly _LITERAL_NAMES: Array<string | null> = [
        null, null, null, "//", "/", "*", "!",
    ];
    private static readonly _SYMBOLIC_NAMES: Array<string | null> = [
        null, "TOKEN_REF", "RULE_REF", "ANYWHERE", "ROOT", "WILDCARD", "BANG", "ID", "STRING",
    ];

    // eslint-disable-next-line @typescript-eslint/member-ordering
    public static readonly VOCABULARY = new VocabularyImpl(XPathLexer._LITERAL_NAMES, XPathLexer._SYMBOLIC_NAMES);

    protected line = 1;
    protected charPositionInLine = 0;

    public constructor(input: CharStream) {
        super(input);
    }

    public getGrammarFileName = (): string => {
        return "XPathLexer.g4";
    };

    public getRuleNames = (): string[] => {
        return XPathLexer.ruleNames;
    };

    public override getModeNames = (): string[] => {
        return XPathLexer.modeNames;
    };

    public override getTokenNames = (): string[] => {
        return XPathLexer.tokenNames;
    };

    public override getVocabulary = (): Vocabulary => {
        return XPathLexer.VOCABULARY;
    };

    public getATN = (): ATN | null => {
        return null;
    };

    public override nextToken = (): Token => {
        this._tokenStartCharIndex = this._input!.index();
        let t: CommonToken | null = null;
        while (t === null) {
            switch (this._input!.LA(1)) {
                case 0x2F: { // '/'
                    this.consume();
                    if (this._input!.LA(1) === 0x2F) {
                        this.consume();
                        t = new CommonToken(XPathLexer.ANYWHERE, S`//`);
                    }
                    else {
                        t = new CommonToken(XPathLexer.ROOT, S`/`);
                    }
                    break;
                }

                case 0x2A: { // '*'
                    this.consume();
                    t = new CommonToken(XPathLexer.WILDCARD, S`*`);
                    break;
                }

                case 0x21: { // '!'
                    this.consume();
                    t = new CommonToken(XPathLexer.BANG, S`!`);
                    break;
                }

                case 0x27: { // "'"
                    const s = this.matchString();
                    t = new CommonToken(XPathLexer.STRING, s);
                    break;
                }

                case CharStream.EOF: {
                    return new CommonToken(Recognizer.EOF, S`<EOF>`);
                }

                default: {
                    if (this.isNameStartChar(this._input!.LA(1))) {
                        const id = this.matchID();
                        if (java.lang.Character.isUpperCase(id.charAt(0))) {
                            t = new CommonToken(XPathLexer.TOKEN_REF, id);
                        }

                        else {
                            t = new CommonToken(XPathLexer.RULE_REF, id);
                        }

                    }
                    else {
                        throw new LexerNoViableAltException(this, this._input, this._tokenStartCharIndex, null);
                    }
                    break;
                }

            }
        }
        t.setStartIndex(this._tokenStartCharIndex);
        t.setCharPositionInLine(this._tokenStartCharIndex);
        t.setLine(this.line);

        return t;
    };

    public consume = (): void => {
        const curChar: number = this._input!.LA(1);
        if (curChar === 0x0A) { // '\n'
            this.line++;
            this.charPositionInLine = 0;
        } else {
            this.charPositionInLine++;
        }
        this._input!.consume();
    };

    public override getCharPositionInLine = (): number => {
        return this.charPositionInLine;
    };

    public matchID = (): java.lang.String => {
        const start: number = this._input!.index();
        this.consume(); // drop start char
        while (this.isNameChar(this._input!.LA(1))) {
            this.consume();
        }

        return this._input!.getText(Interval.of(start, this._input!.index() - 1));
    };

    public matchString = (): java.lang.String | null => {
        const start: number = this._input!.index();
        this.consume(); // drop first quote
        while (this._input!.LA(1) !== 0x27) { // "'""
            this.consume();
        }
        this.consume(); // drop last quote

        return this._input!.getText(Interval.of(start, this._input!.index() - 1));
    };

    public isNameChar = (c: number): boolean => {
        return java.lang.Character.isUnicodeIdentifierPart(c);
    };

    public isNameStartChar = (c: number): boolean => { return java.lang.Character.isUnicodeIdentifierStart(c); };

    static {
        // @ts-ignore
        XPathLexer.tokenNames = new Array<string>(XPathLexer._SYMBOLIC_NAMES.length);
        for (let i = 0; i < XPathLexer.tokenNames.length; i++) {
            const name = XPathLexer.VOCABULARY.getLiteralName(i) ?? XPathLexer.VOCABULARY.getSymbolicName(i)
                ?? "<INVALID>";

            XPathLexer.tokenNames[i] = name;
        }
    }
}
