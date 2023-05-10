/* java2ts: keep */

/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/* eslint-disable @typescript-eslint/naming-convention, no-underscore-dangle */

import { java, S } from "jree";

import { CharStream } from "./CharStream";
import { CommonTokenFactory } from "./CommonTokenFactory";
import { IntStream } from "./IntStream";
import { LexerNoViableAltException } from "./LexerNoViableAltException";
import { RecognitionException } from "./RecognitionException";
import { Recognizer } from "./Recognizer";
import { Token } from "./Token";
import { TokenFactory } from "./TokenFactory";
import { TokenSource } from "./TokenSource";
import { LexerATNSimulator } from "./atn/index";
import { IntegerStack } from "./misc/IntegerStack";
import { Interval } from "./misc/Interval";
import { Pair } from "./misc/Pair";

/**
 * A lexer is recognizer that draws input symbols from a character stream.
 *  lexer grammars result in a subclass of this object. A Lexer object
 *  uses simplified match() and error recovery mechanisms in the interest
 *  of speed.
 */
export abstract class Lexer extends Recognizer<LexerATNSimulator> implements TokenSource {
    public static DEFAULT_MODE = 0;
    public static MORE = -2;
    public static SKIP = -3;

    public static DEFAULT_TOKEN_CHANNEL = Token.DEFAULT_CHANNEL;
    public static HIDDEN = Token.HIDDEN_CHANNEL;
    public static MIN_CHAR_VALUE = 0x0000;
    public static MAX_CHAR_VALUE = 0x10FFFF;

    public _input: CharStream | null = null;

    /**
     * The goal of all lexer rules/methods is to create a token object.
     *  This is an instance variable as multiple rules may collaborate to
     *  create a single token.  nextToken will return this object after
     *  matching lexer rule(s).  If you subclass to allow multiple token
     *  emissions, then set this to the last token to be matched or
     *  something nonnull so that the auto token emit mechanism will not
     *  emit another token.
     */
    public _token: Token | null = null;

    /**
     * What character index in the stream did the current token start at?
     *  Needed, for example, to get the text for current token.  Set at
     *  the start of nextToken.
     */
    public _tokenStartCharIndex = -1;

    /** The line on which the first character of the token resides */
    public _tokenStartLine = 0;

    /** The character position of first character within the line */
    public _tokenStartCharPositionInLine = 0;

    /**
     * Once we see EOF on char stream, next token will be EOF.
     *  If you have DONE : EOF ; then you see DONE EOF.
     */
    public _hitEOF = false;

    /** The channel number for the current token */
    public _channel = 0;

    /** The token type for the current token */
    public _type = 0;

    public _modeStack: IntegerStack = new IntegerStack();
    public _mode: number = Lexer.DEFAULT_MODE;

    /**
     * You can set the text for the current token to override what is in
     *  the input char buffer.  Use setText() or can set this instance var.
     */
    public _text: java.lang.String | null = null;

    protected _tokenFactorySourcePair: Pair<TokenSource, CharStream> | null = null;

    /** How to create token objects */
    protected _factory: TokenFactory<Token> = CommonTokenFactory.DEFAULT;

    public constructor();
    public constructor(input: CharStream);
    public constructor(input?: CharStream) {
        super();
        if (input !== undefined) {
            this._input = input;
            this._tokenFactorySourcePair = new Pair<TokenSource, CharStream>(this, input);
        }
    }

    public reset = (): void => {
        // wack Lexer state variables
        if (this._input !== null) {
            this._input.seek(0); // rewind the input
        }
        this._token = null;
        this._type = Token.INVALID_TYPE;
        this._channel = Token.DEFAULT_CHANNEL;
        this._tokenStartCharIndex = -1;
        this._tokenStartCharPositionInLine = -1;
        this._tokenStartLine = -1;
        this._text = null;

        this._hitEOF = false;
        this._mode = Lexer.DEFAULT_MODE;
        this._modeStack.clear();

        this.getInterpreter()?.reset();
    };

    /**
     * @returns a token from this source; i.e., match a token on the char stream.
     */
    public nextToken = (): Token => {
        if (this._input === null) {
            throw new java.lang.IllegalStateException(S`nextToken requires a non-null input stream.`);
        }

        // Mark start location in char stream so unbuffered streams are
        // guaranteed at least have text of current token
        const tokenStartMarker = this._input.mark();
        try {
            outer:
            while (true) {
                if (this._hitEOF) {
                    this.emitEOF();

                    return this._token!;
                }

                this._token = null;
                this._channel = Token.DEFAULT_CHANNEL;
                this._tokenStartCharIndex = this._input.index();
                this._tokenStartCharPositionInLine = this.getInterpreter()?.getCharPositionInLine() ?? 0;
                this._tokenStartLine = this.getInterpreter()?.getLine() ?? 0;
                this._text = null;
                do {
                    this._type = Token.INVALID_TYPE;
                    let ttype: number;
                    try {
                        ttype = this.getInterpreter()?.match(this._input, this._mode) ?? 0;
                    } catch (e) {
                        if (e instanceof LexerNoViableAltException) {
                            this.notifyListeners(e);		// report error
                            this.recover(e);
                            ttype = Lexer.SKIP;
                        } else {
                            throw e;
                        }
                    }
                    if (this._input.LA(1) === IntStream.EOF) {
                        this._hitEOF = true;
                    }
                    if (this._type === Token.INVALID_TYPE) {
                        this._type = ttype;
                    }

                    if (this._type === Lexer.SKIP) {
                        continue outer;
                    }
                } while (this._type === Lexer.MORE);
                if (this._token === null) {
                    this.emit();
                }

                return this._token!;
            }
        } finally {
            // make sure we release marker after match or
            // unbuffered char stream will keep buffering
            this._input.release(tokenStartMarker);
        }
    };

    /**
     * Instruct the lexer to skip creating a token for current lexer rule
     *  and look for another token.  nextToken() knows to keep looking when
     *  a lexer rule finishes with token set to SKIP_TOKEN.  Recall that
     *  if token==null at end of any token rule, it creates one for you
     *  and emits it.
     */
    public skip = (): void => {
        this._type = Lexer.SKIP;
    };

    public more = (): void => {
        this._type = Lexer.MORE;
    };

    public mode = (m: number): void => {
        this._mode = m;
    };

    public pushMode = (m: number): void => {
        if (LexerATNSimulator.debug) {
            java.lang.System.out.println(S`pushMode ${m}`);
        }

        this._modeStack.push(this._mode);
        this.mode(m);
    };

    public popMode = (): number => {
        if (this._modeStack.isEmpty()) {
            throw new java.util.EmptyStackException();
        }

        if (LexerATNSimulator.debug) {
            java.lang.System.out.println(S`popMode back to ${this._modeStack.peek()}`);
        }

        this.mode(this._modeStack.pop());

        return this._mode;
    };

    public setTokenFactory = (factory: TokenFactory<Token>): void => {
        this._factory = factory;
    };

    public getTokenFactory = (): TokenFactory<Token> => {
        return this._factory;
    };

    /**
     * Set the char stream and reset the lexer
     *
     * @param input The new input {@link CharStream}
     */
    public setInputStream = (input: IntStream | null): void => {
        this._input = null;
        this._tokenFactorySourcePair = new Pair<TokenSource, CharStream>(this, this._input!);
        this.reset();
        this._input = input as CharStream;
        this._tokenFactorySourcePair = new Pair<TokenSource, CharStream>(this, this._input);
    };

    public getSourceName = (): java.lang.String => {
        return this._input!.getSourceName();
    };

    public getInputStream = (): CharStream | null => {
        return this._input;
    };

    /**
     * The standard method called to automatically emit a token at the
     *  outermost lexical rule.  The token object should point into the
     *  char buffer start..stop.  If there is a text override in 'text',
     *  use that to set the token's text.  Override this method to emit
     *  custom Token objects or provide a new factory.
     */
    public emit(): Token;
    /**
     * By default does not support multiple emits per nextToken invocation
     *  for efficiency reasons.  Subclass and override this method, nextToken,
     *  and getToken (to push tokens into a list and pull from that list
     *  rather than a single variable as this implementation does).
     */
    public emit(token: Token): void;
    public emit(token?: Token): Token | void {
        if (token === undefined) {
            token = this._factory.create(this._tokenFactorySourcePair!, this._type, this._text, this._channel,
                this._tokenStartCharIndex, this.getCharIndex() - 1, this._tokenStartLine,
                this._tokenStartCharPositionInLine);
        }

        this._token = token;

        return token;
    }

    public emitEOF = (): Token => {
        const position = this.getCharPositionInLine();
        const line = this.getLine();
        const eof = this._factory.create(this._tokenFactorySourcePair!, Token.EOF, null, Token.DEFAULT_CHANNEL,
            this._input!.index(), this._input!.index() - 1,
            line, position);
        this.emit(eof);

        return eof;
    };

    public getLine = (): number => {
        return this.getInterpreter()!.getLine();
    };

    public getCharPositionInLine = (): number => {
        return this.getInterpreter()!.getCharPositionInLine();
    };

    public setLine = (line: number): void => {
        this.getInterpreter()!.setLine(line);
    };

    public setCharPositionInLine = (charPositionInLine: number): void => {
        this.getInterpreter()!.setCharPositionInLine(charPositionInLine);
    };

    /**
     * What is the index of the current character of lookahead?
     *
     * @returns tbd
     */
    public getCharIndex = (): number => {
        return this._input!.index();
    };

    /**
     * Return the text matched so far for the current token or any
     *  text override.
     *
     * @returns tbd
     */
    public getText = (): java.lang.String => {
        if (this._text !== null) {
            return this._text;
        }

        return this.getInterpreter()!.getText(this._input!);
    };

    /**
     * Set the complete text of this token; it wipes any previous
     *  changes to the text.
     *
     * @param text the text of the token
     */
    public setText = (text: java.lang.String | null): void => {
        this._text = text;
    };

    /**
     * Override if emitting multiple tokens.
     *
     *
     * @returns tbd
     */
    public getToken = (): Token | null => {
        return this._token;
    };

    public setToken = (_token: Token | null): void => {
        this._token = _token;
    };

    public setType = (ttype: number): void => {
        this._type = ttype;
    };

    public getType = (): number => {
        return this._type;
    };

    public setChannel = (channel: number): void => {
        this._channel = channel;
    };

    public getChannel = (): number => {
        return this._channel;
    };

    public getChannelNames = (): string[] | null => { return null; };

    public getModeNames = (): string[] | null => {
        return null;
    };

    /**
     * Used to print out token names like ID during debugging and
     *  error reporting.  The generated parsers implement a method
     *  that overrides this to point to their String[] tokenNames.
     *
     * @returns tbd
     */
    public getTokenNames = (): string[] | null => {
        return null;
    };

    /**
     * @returns a list of all Token objects in input char stream.
     *  Forces load of all tokens. Does not include EOF token.
     */
    public getAllTokens = (): java.util.List<Token> | null => {
        const tokens: java.util.List<Token> = new java.util.ArrayList<Token>();
        let t = this.nextToken();
        while (t && t.getType() !== Token.EOF) {
            tokens.add(t);
            t = this.nextToken();
        }

        return tokens;
    };

    public recover(re: LexerNoViableAltException): void;
    /**
     * Lexers can normally match any char in it's vocabulary after matching
     *  a token, so do the easy thing and just kill a character and hope
     *  it all works out.  You can instead use the rule invocation stack
     *  to do sophisticated error recovery if you are in a fragment rule.
     */
    public recover(e: RecognitionException): void;
    public recover(e: LexerNoViableAltException | RecognitionException): void {
        if (e instanceof LexerNoViableAltException) {
            if (this._input?.LA(1) !== IntStream.EOF) {
                // skip a char and try again
                this.getInterpreter()?.consume(this._input!);
            }
        } else {
            // TODO: Do we lose character or line position information?
            this._input?.consume();
        }

    }

    public notifyListeners = (e: LexerNoViableAltException): void => {
        const text = this._input!.getText(Interval.of(this._tokenStartCharIndex, this._input!.index()));
        const msg = S`token recognition error at: '${this.getErrorDisplay(text)}'`;

        const listener = this.getErrorListenerDispatch();
        listener.syntaxError?.(this, null, this._tokenStartLine, this._tokenStartCharPositionInLine, msg, e);
    };

    public getErrorDisplay(sOrC: java.lang.String | number): java.lang.String {
        if (sOrC instanceof java.lang.String) {
            const s = sOrC;
            const buf: java.lang.StringBuilder = new java.lang.StringBuilder();
            for (const c of s.toCharArray()) {
                buf.append(this.getErrorDisplay(c));
            }

            return buf.toString();
        } else {
            const c = sOrC;
            let s;
            switch (c) {
                case Token.EOF: {
                    s = S`<EOF>`;
                    break;
                }

                case 0x0A: {
                    s = S`\\n`;
                    break;
                }

                case 0x09: {
                    s = S`\\t`;
                    break;
                }

                case 0x0D: {
                    s = S`\\r`;
                    break;
                }

                default: {
                    s = java.lang.String.fromCharCode(c);

                    break;
                }

            }

            return s;
        }

    }

    public getCharErrorDisplay = (c: number): java.lang.String | null => {
        const s: java.lang.String = this.getErrorDisplay(c);

        return S`'${s}'`;
    };
}
