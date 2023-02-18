/* java2ts: keep */

/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/*
 eslint-disable @typescript-eslint/no-namespace, @typescript-eslint/naming-convention, no-redeclare,
 max-classes-per-file, jsdoc/check-tag-names, @typescript-eslint/no-empty-function,
 @typescript-eslint/restrict-plus-operands, @typescript-eslint/unified-signatures, @typescript-eslint/member-ordering,
 no-underscore-dangle, max-len
*/

/* cspell: disable */

import { java, S, I, JavaObject } from "jree";

import { ANTLRErrorListener } from "./ANTLRErrorListener";
import { ConsoleErrorListener } from "./ConsoleErrorListener";
import { IntStream } from "./IntStream";
import { ProxyErrorListener } from "./ProxyErrorListener";
import { RecognitionException } from "./RecognitionException";
import { RuleContext } from "./RuleContext";
import { Token } from "./Token";
import { TokenFactory } from "./TokenFactory";
import { Vocabulary } from "./Vocabulary";
import { VocabularyImpl } from "./VocabularyImpl";
import { ATN } from "./atn/ATN";
import { ATNSimulator } from "./atn/ATNSimulator";
import { ParseInfo } from "./atn/ParseInfo";
import { Utils } from "./misc/Utils";

export abstract class Recognizer<Symbol, ATNInterpreter extends ATNSimulator> extends JavaObject {
    public static readonly EOF: number = -1;

    private static readonly tokenTypeMapCache =
        new java.util.WeakHashMap<Vocabulary, Readonly<java.util.Map<java.lang.String, java.lang.Integer>>>();
    private static readonly ruleIndexMapCache =
        new java.util.WeakHashMap<java.lang.String[], Readonly<java.util.Map<java.lang.String, java.lang.Integer>>>();

    private _listeners: java.util.List<ANTLRErrorListener> =
        new class extends java.util.concurrent.CopyOnWriteArrayList<ANTLRErrorListener> {
            public constructor() {
                super();

                this.add(ConsoleErrorListener.INSTANCE);
            }
        }();

    protected _interp: ATNInterpreter | null = null;

    private _stateNumber = -1;

    /**
     * Used to print out token names like ID during debugging and
     *  error reporting.  The generated parsers implement a method
     *  that overrides this to point to their String[] tokenNames.
     *
     * @deprecated Use {@link #getVocabulary()} instead.
     */
    public abstract getTokenNames: () => java.lang.String[];

    public abstract getRuleNames: () => java.lang.String[];

    /**
     * Get the vocabulary used by the recognizer.
     *
      @returns A {@link Vocabulary} instance providing information about the
     * vocabulary used by the grammar.
     */
    public getVocabulary = (): Vocabulary => {
        return VocabularyImpl.fromTokenNames(this.getTokenNames());
    };

    /**
     * Get a map from token names to token types.
     *
     * Used for XPath and tree pattern compilation.
     *
     * @returns tbd
     */
    public getTokenTypeMap = (): Readonly<java.util.Map<java.lang.String, java.lang.Integer>> => {
        const vocabulary = this.getVocabulary();
		/* synchronized (tokenTypeMapCache) */ {
            let result = Recognizer.tokenTypeMapCache.get(vocabulary);
            if (result === null) {
                const map = new java.util.HashMap<java.lang.String, java.lang.Integer>();
                const end = this.getATN().maxTokenType;
                for (let i = 0; i <= end; i++) {
                    const literalName = vocabulary.getLiteralName(i);
                    if (literalName !== null) {
                        map.put(literalName, I`${i}`);
                    }

                    const symbolicName = vocabulary.getSymbolicName(i);
                    if (symbolicName !== null) {
                        map.put(symbolicName, I`${i}`);
                    }
                }

                map.put(S`EOF`, I`${Token.EOF}`);
                result = java.util.Collections.unmodifiableMap(map);
                Recognizer.tokenTypeMapCache.put(vocabulary, result);
            }

            return result;
        }
    };

    /**
     * Get a map from rule names to rule indexes.
     *
     * Used for XPath and tree pattern compilation.
     *
     * @returns tbd
     */
    public getRuleIndexMap = (): java.util.Map<java.lang.String, java.lang.Integer> => {
        const ruleNames = this.getRuleNames();
        if (ruleNames === null) {
            throw new java.lang.UnsupportedOperationException(S`The current recognizer does not provide a list of rule names.`);
        }

		/* synchronized (ruleIndexMapCache) */ {
            let result = Recognizer.ruleIndexMapCache.get(ruleNames);
            if (result === null) {
                result = java.util.Collections.unmodifiableMap(Utils.toMap(ruleNames));
                Recognizer.ruleIndexMapCache.put(ruleNames, result);
            }

            return result;
        }
    };

    public getTokenType = (tokenName: java.lang.String): number => {
        const ttype = this.getTokenTypeMap().get(tokenName);
        if (ttype !== null) {
            return ttype.valueOf();
        }

        return Token.INVALID_TYPE;
    };

    /**
     * If this recognizer was generated, it will have a serialized ATN
     * representation of the grammar.
     *
     * <p>For interpreters, we don't know their serialized ATN despite having
     * created the interpreter from it.</p>
     */
    public getSerializedATN = (): java.lang.String | null => {
        throw new java.lang.UnsupportedOperationException(S`there is no serialized ATN`);
    };

    /**
     * For debugging and other purposes, might want the grammar name.
     *  Have ANTLR generate an implementation for this method.
     */
    public abstract getGrammarFileName: () => java.lang.String;

    /**
     * Get the {@link ATN} used by the recognizer for prediction.
     *
      @returns The {@link ATN} used by the recognizer for prediction.
     */
    public abstract getATN: () => ATN;

    /**
     * Get the ATN interpreter used by the recognizer for prediction.
     *
      @returns The ATN interpreter used by the recognizer for prediction.
     */
    public getInterpreter = (): ATNInterpreter | null => {
        return this._interp;
    };

    /**
     * If profiling during the parse/lex, this will return DecisionInfo records
     *  for each decision in recognizer in a ParseInfo object.
     *
     * @returns tbd
     */
    public getParseInfo = (): ParseInfo | null => {
        return null;
    };

    /**
     * Set the ATN interpreter used by the recognizer for prediction.
     *
     * @param interpreter The ATN interpreter used by the recognizer for
     * prediction.
     */
    public setInterpreter = (interpreter: ATNInterpreter | null): void => {
        this._interp = interpreter;
    };

    /**
     * What is the error header, normally line/character position information?
     *
     * @param e tbd
     *
     * @returns tbd
     */
    public getErrorHeader = (e: RecognitionException<Symbol, ATNInterpreter>): java.lang.String => {
        const line = e.getOffendingToken()?.getLine() ?? 0;
        const charPositionInLine = e.getOffendingToken()?.getCharPositionInLine() ?? 0;

        return S`line ${line}:${charPositionInLine}`;
    };

    /**
     * How should a token be displayed in an error message? The default
     *  is to display just the text, but during development you might
     *  want to have a lot of information spit out.  Override in that case
     *  to use t.toString() (which, for CommonToken, dumps everything about
     *  the token). This is better than forcing you to override a method in
     *  your token objects because you don't have to go modify your lexer
     *  so that it creates a new Java type.
     *
     * @param t tbd
     * @deprecated This method is not called by the ANTLR 4 Runtime. Specific
     * implementations of {@link ANTLRErrorStrategy} may provide a similar
     * feature when necessary. For example, see
     * {@link DefaultErrorStrategy#getTokenErrorDisplay}.
     *
     * @returns tbd
     */
    public getTokenErrorDisplay = (t: Token | null): java.lang.String => {
        if (t === null) {
            return S`<no token>`;
        }

        let s = t.getText();
        if (s === null) {
            if (t.getType() === Token.EOF) {
                s = S`<EOF>`;
            } else {
                s = S`<${t.getType()}>`;
            }
        } else {
            s = s.replace(S`\n`, S`\\n`);
            s = s.replace(S`\r`, S`\\r`);
            s = s.replace(S`\t`, S`\\t`);
        }

        return S`'${s}'`;
    };

    /**
     * @param listener tbd
     * @exception NullPointerException if {@code listener} is {@code null}.
     */
    public addErrorListener = (listener: ANTLRErrorListener | null): void => {
        if (listener === null) {
            throw new java.lang.NullPointerException(S`listener cannot be null.`);
        }

        this._listeners.add(listener);
    };

    public removeErrorListener = (listener: ANTLRErrorListener | null): void => {
        this._listeners.remove(listener);
    };

    public removeErrorListeners = (): void => {
        this._listeners.clear();
    };

    public getErrorListeners = (): java.util.List<ANTLRErrorListener> | null => {
        return this._listeners;
    };

    public getErrorListenerDispatch = (): ANTLRErrorListener => {
        return new ProxyErrorListener(this.getErrorListeners());
    };

    // subclass needs to override these if there are sempreds or actions
    // that the ATN interp needs to execute
    public sempred = (_localctx: RuleContext | null, _ruleIndex: number, _actionIndex: number): boolean => {
        return true;
    };

    public precpred = (_localctx: RuleContext | null, _precedence: number): boolean => {
        return true;
    };

    public action = (_localctx: RuleContext | null, _ruleIndex: number, _actionIndex: number): void => {
    };

    public readonly getState = (): number => {
        return this._stateNumber;
    };

    /**
     * Indicate that the recognizer has changed internal state that is
     *  consistent with the ATN state passed in.  This way we always know
     *  where we are in the ATN as the parser goes along. The rule
     *  context objects form a stack that lets us see the stack of
     *  invoking rules. Combine this and we have complete ATN
     *  configuration information.
     *
     * @param atnState tbd
     */
    public readonly setState = (atnState: number): void => {
        this._stateNumber = atnState;
    };

    public abstract getInputStream: () => IntStream | null;
    public abstract setInputStream: (input: IntStream | null) => void;
    public abstract getTokenFactory: () => TokenFactory<Symbol> | null;
    public abstract setTokenFactory: (input: TokenFactory<Symbol>) => void;
}
