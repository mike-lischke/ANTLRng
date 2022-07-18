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



import { java } from "../../../../../lib/java/java";
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




export class Recognizer<Symbol, ATNInterpreter extends ATNSimulator> {
    public static readonly EOF: number = -1;

    private static readonly tokenTypeMapCache?: java.util.Map<Vocabulary, java.util.Map<string, java.lang.Integer>> =
        new WeakHashMap<Vocabulary, java.util.Map<string, java.lang.Integer>>();
    private static readonly ruleIndexMapCache?: java.util.Map<string[], java.util.Map<string, java.lang.Integer>> =
        new WeakHashMap<string[], java.util.Map<string, java.lang.Integer>>();


    private _listeners?: java.util.List<ANTLRErrorListener> =
        new class extends CopyOnWriteArrayList<ANTLRErrorListener> {
            public constructor() {
                super();

                add(ConsoleErrorListener.INSTANCE);

            }
        }();

    protected _interp?: ATNInterpreter;

    private _stateNumber: number = -1;

    /** Used to print out token names like ID during debugging and
     *  error reporting.  The generated parsers implement a method
     *  that overrides this to point to their String[] tokenNames.
     *
     * @deprecated Use {@link #getVocabulary()} instead.
     */
    public abstract getTokenNames: () => string[];

    public abstract getRuleNames: () => string[];

    /**
     * Get the vocabulary used by the recognizer.
     *
     * @return A {@link Vocabulary} instance providing information about the
     * vocabulary used by the grammar.
     */
    public getVocabulary = (): Vocabulary => {
        return VocabularyImpl.fromTokenNames(this.getTokenNames());
    }

    /**
     * Get a map from token names to token types.
     *
     * <p>Used for XPath and tree pattern compilation.</p>
     */
    public getTokenTypeMap = (): java.util.Map<string, java.lang.Integer> => {
        let vocabulary: Vocabulary = this.getVocabulary();
        synchronized(Recognizer.tokenTypeMapCache) {
            let result: java.util.Map<string, java.lang.Integer> = Recognizer.tokenTypeMapCache.get(vocabulary);
            if (result === undefined) {
                result = new java.util.HashMap<string, java.lang.Integer>();
                for (let i: number = 0; i <= this.getATN().maxTokenType; i++) {
                    let literalName: string = vocabulary.getLiteralName(i);
                    if (literalName !== undefined) {
                        result.set(literalName, i);
                    }

                    let symbolicName: string = vocabulary.getSymbolicName(i);
                    if (symbolicName !== undefined) {
                        result.set(symbolicName, i);
                    }
                }

                result.set("EOF", Token.EOF);
                result = java.util.Collections.unmodifiableMap(result);
                Recognizer.tokenTypeMapCache.set(vocabulary, result);
            }

            return result;
        }
    }

    /**
     * Get a map from rule names to rule indexes.
     *
     * <p>Used for XPath and tree pattern compilation.</p>
     */
    public getRuleIndexMap = (): java.util.Map<string, number> => {
        let ruleNames: string[] = this.getRuleNames();
        if (ruleNames === undefined) {
            throw new java.lang.UnsupportedOperationException("The current recognizer does not provide a list of rule names.");
        }

        synchronized(Recognizer.ruleIndexMapCache) {
            let result: java.util.Map<string, java.lang.Integer> = Recognizer.ruleIndexMapCache.get(ruleNames);
            if (result === undefined) {
                result = java.util.Collections.unmodifiableMap(Utils.toMap(ruleNames));
                Recognizer.ruleIndexMapCache.set(ruleNames, result);
            }

            return result;
        }
    }

    public getTokenType = (tokenName: string): number => {
        let ttype: java.lang.Integer = this.getTokenTypeMap().get(tokenName);
        if (ttype !== undefined) {
            return ttype;
        }

        return Token.INVALID_TYPE;
    }

    /**
     * If this recognizer was generated, it will have a serialized ATN
     * representation of the grammar.
     *
     * <p>For interpreters, we don't know their serialized ATN despite having
     * created the interpreter from it.</p>
     */
    public getSerializedATN = (): string => {
        throw new java.lang.UnsupportedOperationException("there is no serialized ATN");
    }

    /** For debugging and other purposes, might want the grammar name.
     *  Have ANTLR generate an implementation for this method.
     */
    public abstract getGrammarFileName: () => string;

    /**
     * Get the {@link ATN} used by the recognizer for prediction.
     *
     * @return The {@link ATN} used by the recognizer for prediction.
     */
    public abstract getATN: () => ATN;

    /**
     * Get the ATN interpreter used by the recognizer for prediction.
     *
     * @return The ATN interpreter used by the recognizer for prediction.
     */
    public getInterpreter = (): ATNInterpreter => {
        return this._interp;
    }

    /** If profiling during the parse/lex, this will return DecisionInfo records
     *  for each decision in recognizer in a ParseInfo object.
     *
     * @since 4.3
     */
    public getParseInfo = (): ParseInfo => {
        return undefined;
    }

    /**
     * Set the ATN interpreter used by the recognizer for prediction.
     *
     * @param interpreter The ATN interpreter used by the recognizer for
     * prediction.
     */
    public setInterpreter = (interpreter: ATNInterpreter): void => {
        this._interp = interpreter;
    }

    /** What is the error header, normally line/character position information? */
    public getErrorHeader = (e: RecognitionException): string => {
        let line: number = e.getOffendingToken().getLine();
        let charPositionInLine: number = e.getOffendingToken().getCharPositionInLine();
        return "line " + line + ":" + charPositionInLine;
    }

    /** How should a token be displayed in an error message? The default
     *  is to display just the text, but during development you might
     *  want to have a lot of information spit out.  Override in that case
     *  to use t.toString() (which, for CommonToken, dumps everything about
     *  the token). This is better than forcing you to override a method in
     *  your token objects because you don't have to go modify your lexer
     *  so that it creates a new Java type.
     *
     * @deprecated This method is not called by the ANTLR 4 Runtime. Specific
     * implementations of {@link ANTLRErrorStrategy} may provide a similar
     * feature when necessary. For example, see
     * {@link DefaultErrorStrategy#getTokenErrorDisplay}.
     */
    public getTokenErrorDisplay = (t: Token): string => {
        if (t === undefined) {
            return "<no token>";
        }

        let s: string = t.getText();
        if (s === undefined) {
            if (t.getType() === Token.EOF) {
                s = "<EOF>";
            }
            else {
                s = "<" + t.getType() + ">";
            }
        }
        s = s.replace("\n", "\\n");
        s = s.replace("\r", "\\r");
        s = s.replace("\t", "\\t");
        return "'" + s + "'";
    }

    /**
     * @exception NullPointerException if {@code listener} is {@code null}.
     */
    public addErrorListener = (listener: ANTLRErrorListener): void => {
        if (listener === undefined) {
            throw new java.lang.NullPointerException("listener cannot be null.");
        }

        this._listeners.add(listener);
    }

    public removeErrorListener = (listener: ANTLRErrorListener): void => {
        this._listeners.remove(listener);
    }

    public removeErrorListeners = (): void => {
        this._listeners.clear();
    }


    public getErrorListeners = (): java.util.List<ANTLRErrorListener> => {
        return this._listeners;
    }

    public getErrorListenerDispatch = (): ANTLRErrorListener => {
        return new ProxyErrorListener(this.getErrorListeners());
    }

    // subclass needs to override these if there are sempreds or actions
    // that the ATN interp needs to execute
    public sempred = (_localctx: RuleContext, ruleIndex: number, actionIndex: number): boolean => {
        return true;
    }

    public precpred = (localctx: RuleContext, precedence: number): boolean => {
        return true;
    }

    public action = (_localctx: RuleContext, ruleIndex: number, actionIndex: number): void => {
    }

    public readonly getState = (): number => {
        return this._stateNumber;
    }

    /** Indicate that the recognizer has changed internal state that is
     *  consistent with the ATN state passed in.  This way we always know
     *  where we are in the ATN as the parser goes along. The rule
     *  context objects form a stack that lets us see the stack of
     *  invoking rules. Combine this and we have complete ATN
     *  configuration information.
     */
    public readonly setState = (atnState: number): void => {
        //		System.err.println("setState "+atnState);
        this._stateNumber = atnState;
        //		if ( traceATNStates ) _ctx.trace(atnState);
    }

    public abstract getInputStream: () => IntStream;

    public abstract setInputStream: (input: IntStream) => void;


    public abstract getTokenFactory: () => TokenFactory<unknown>;

    public abstract setTokenFactory: (input: TokenFactory<unknown>) => void;
}
