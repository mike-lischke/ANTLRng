/* java2ts: keep */

/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/* eslint-disable @typescript-eslint/naming-convention, no-underscore-dangle */

import { java } from "../../../../../lib/java/java";
import { JavaObject } from "../../../../../lib/java/lang/Object";
import { S } from "../../../../../lib/templates";

import { ANTLRErrorListener } from "./ANTLRErrorListener";
import { ANTLRErrorStrategy } from "./ANTLRErrorStrategy";
import { DefaultErrorStrategy } from "./DefaultErrorStrategy";
import { IntStream } from "./IntStream";
import { Lexer } from "./Lexer";
import { ParserRuleContext } from "./ParserRuleContext";
import { RecognitionException } from "./RecognitionException";
import { Recognizer } from "./Recognizer";
import { RuleContext } from "./RuleContext";
import { Token } from "./Token";
import { TokenFactory } from "./TokenFactory";
import { TokenSource } from "./TokenSource";
import { TokenStream } from "./TokenStream";
import { ATN } from "./atn/ATN";
import { ATNDeserializationOptions } from "./atn/ATNDeserializationOptions";
import { ATNDeserializer } from "./atn/ATNDeserializer";
import { ATNState } from "./atn/ATNState";
import { ParseInfo } from "./atn/ParseInfo";
import { ParserATNSimulator } from "./atn/ParserATNSimulator";
import { PredictionMode } from "./atn/PredictionMode";
import { ProfilingATNSimulator } from "./atn/ProfilingATNSimulator";
import { RuleTransition } from "./atn/RuleTransition";
import { DFA } from "./dfa/DFA";
import { IntegerStack } from "./misc/IntegerStack";
import { IntervalSet } from "./misc/IntervalSet";
import { ErrorNode } from "./tree/ErrorNode";
import { ErrorNodeImpl } from "./tree/ErrorNodeImpl";
import { ParseTreeListener } from "./tree/ParseTreeListener";
import { TerminalNode } from "./tree/TerminalNode";
import { TerminalNodeImpl } from "./tree/TerminalNodeImpl";
import { ParseTreePattern } from "./tree/pattern/ParseTreePattern";
import { ParseTreePatternMatcher } from "./tree/pattern/ParseTreePatternMatcher";

/** This is all the parsing support code essentially; most of it is error recovery stuff. */
export abstract class Parser extends Recognizer<Token, ParserATNSimulator> {
    public static TrimToSizeListener = class TrimToSizeListener extends JavaObject implements ParseTreeListener {
        public static readonly INSTANCE = new Parser.TrimToSizeListener();

        public enterEveryRule = (_ctx: ParserRuleContext): void => { /**/ };
        public visitTerminal = (_node: TerminalNode): void => {  /**/ };
        public visitErrorNode = (_node: ErrorNode): void => {  /**/ };

        public exitEveryRule = (ctx: ParserRuleContext): void => {
            if (ctx.children instanceof java.util.ArrayList) {
                ctx.children.trimToSize();
            }
        };
    };

    public TraceListener = (($outer) => {
        return class TraceListener extends JavaObject implements ParseTreeListener {
            public enterEveryRule = (ctx: ParserRuleContext): void => {
                const lt1Text = $outer._input?.LT(1).getText() ?? "null";
                const text = `enter    ${$outer.getRuleNames()[ctx.getRuleIndex()]}` +
                    `, LT(1)=` + lt1Text;

                java.lang.System.out.println(S`${text}`);
            };

            public visitTerminal = (node: TerminalNode): void => {
                const text = `consume ` + node.getSymbol() + ` rule ` +
                    $outer.getRuleNames()[$outer._ctx?.getRuleIndex() ?? 0];
                java.lang.System.out.println(S`${text}`);
            };

            public visitErrorNode = (_node: ErrorNode): void => { /**/ };

            public exitEveryRule = (ctx: ParserRuleContext): void => {
                const lt1Text = $outer._input?.LT(1).getText() ?? "null";
                const text = `exit    ` + $outer.getRuleNames()[ctx.getRuleIndex()] +
                    `, LT(1)=` + lt1Text;
                java.lang.System.out.println(S`${text}`);
            };
        };
    })(this);

    /**
     * The {@link ParserRuleContext} object for the currently executing rule.
     * This is always non-null during the parsing process.
     */
    public _ctx: ParserRuleContext | null = null;

    /**
     * The error handling strategy for the parser. The default value is a new
     * instance of {@link DefaultErrorStrategy}.
     *
     * @see #getErrorHandler
     * @see #setErrorHandler
     */

    protected _errHandler = new DefaultErrorStrategy();

    /**
     * The input stream.
     *
     * @see #getInputStream
     * @see #setInputStream
     */
    protected _input: TokenStream | null = null;

    protected _precedenceStack: IntegerStack | null = null;

    /**
     * Specifies whether or not the parser should construct a parse tree during
     * the parsing process. The default value is {@code true}.
     *
     * @see #getBuildParseTree
     * @see #setBuildParseTree
     */
    protected _buildParseTrees = true;

    /**
     * The list of {@link ParseTreeListener} listeners registered to receive
     * events during the parse.
     *
     * @see #addParseListener
     */
    protected _parseListeners: java.util.List<ParseTreeListener> | null = null;

    /**
     * The number of syntax errors reported during parsing. This value is
     * incremented each time {@link #notifyErrorListeners} is called.
     */
    protected _syntaxErrors = 0;

    /** Indicates parser has match()ed EOF token. See {@link #exitRule()}. */
    protected matchedEOF = false;

    /**
     * When {@link #setTrace}{@code (true)} is called, a reference to the
     * {@link TraceListener} is stored here so it can be easily removed in a
     * later call to {@link #setTrace}{@code (false)}. The listener itself is
     * implemented as a parser listener so this field is not directly used by
     * other parser methods.
     */
    private _tracer: Parser.TraceListener | null = null;

    /**
     * This field holds the deserialized {@link ATN} with bypass alternatives, created
     * lazily upon first demand. In 4.10 I changed from map<serializedATNstring, ATN>
     * since we only need one per parser object and also it complicates other targets
     * that don't use ATN strings.
     *
     * @see ATNDeserializationOptions#isGenerateRuleBypassTransitions()
     */
    private bypassAltsAtnCache: ATN | null = null;

    public constructor(input?: TokenStream | null) {
        super();

        if (input) {
            this.setInputStream(input);
        } else {
            this._precedenceStack = new IntegerStack();
            this._precedenceStack.push(0);

        }
    }

    /** reset the parser's state */
    public reset = (): void => {
        this.getInputStream()?.seek(0);

        this._errHandler.reset(this);
        this._ctx = null;
        this._syntaxErrors = 0;
        this.matchedEOF = false;
        this.setTrace(false);
        this._precedenceStack = new IntegerStack();
        this._precedenceStack.push(0);
        const interpreter = this.getInterpreter();
        interpreter?.reset();
    };

    /**
     * Match current input symbol against {@code ttype}. If the symbol type
     * matches, {@link ANTLRErrorStrategy#reportMatch} and {@link #consume} are
     * called to complete the match process.
     *
     * <p>If the symbol type does not match,
     * {@link ANTLRErrorStrategy#recoverInline} is called on the current error
     * strategy to attempt recovery. If {@link #getBuildParseTree} is
     * {@code true} and the token index of the symbol returned by
     * {@link ANTLRErrorStrategy#recoverInline} is -1, the symbol is added to
     * the parse tree by calling {@link #createErrorNode(ParserRuleContext, Token)} then
     * {@link ParserRuleContext#addErrorNode(ErrorNode)}.</p>
     *
     * @param ttype the token type to match
      @returns the matched symbol
     * @throws RecognitionException if the current input symbol did not match
     * {@code ttype} and the error strategy could not recover from the
     * mismatched symbol
     */
    public match = (ttype: number): Token | null => {
        let t = this.getCurrentToken();
        if (t?.getType() === ttype) {
            if (ttype === Token.EOF) {
                this.matchedEOF = true;
            }
            this._errHandler.reportMatch(this);
            this.consume();
        } else {
            t = this._errHandler.recoverInline(this);
            if (this._buildParseTrees && t?.getTokenIndex() === -1) {
                // we must have conjured up a new token during single token insertion
                // if it's not the current symbol
                this._ctx?.addErrorNode(this.createErrorNode(this._ctx, t));
            }
        }

        return t;
    };

    /**
     * Match current input symbol as a wildcard. If the symbol type matches
     * (i.e. has a value greater than 0), {@link ANTLRErrorStrategy#reportMatch}
     * and {@link #consume} are called to complete the match process.
     *
     * <p>If the symbol type does not match,
     * {@link ANTLRErrorStrategy#recoverInline} is called on the current error
     * strategy to attempt recovery. If {@link #getBuildParseTree} is
     * {@code true} and the token index of the symbol returned by
     * {@link ANTLRErrorStrategy#recoverInline} is -1, the symbol is added to
     * the parse tree by calling {@link Parser#createErrorNode(ParserRuleContext, Token)}. then
     * {@link ParserRuleContext#addErrorNode(ErrorNode)}</p>
     *
      @returns the matched symbol
     * @throws RecognitionException if the current input symbol did not match
     * a wildcard and the error strategy could not recover from the mismatched
     * symbol
     */
    public matchWildcard = (): Token | null => {
        let t = this.getCurrentToken();
        if (t && t.getType() > 0) {
            this._errHandler.reportMatch(this);
            this.consume();
        } else {
            t = this._errHandler.recoverInline(this);
            if (this._buildParseTrees && t && t.getTokenIndex() === -1) {
                // we must have conjured up a new token during single token insertion
                // if it's not the current symbol
                this._ctx?.addErrorNode(this.createErrorNode(this._ctx, t));
            }
        }

        return t;
    };

    /**
     * Track the {@link ParserRuleContext} objects during the parse and hook
     * them up using the {@link ParserRuleContext#children} list so that it
     * forms a parse tree. The {@link ParserRuleContext} returned from the start
     * rule represents the root of the parse tree.
     *
     * <p>Note that if we are not building parse trees, rule contexts only point
     * upwards. When a rule exits, it returns the context but that gets garbage
     * collected if nobody holds a reference. It points upwards but nobody
     * points at it.</p>
     *
     * <p>When we build parse trees, we are adding all of these contexts to
     * {@link ParserRuleContext#children} list. Contexts are then not candidates
     * for garbage collection.</p>
     *
     * @param buildParseTrees tbd
     */
    public setBuildParseTree = (buildParseTrees: boolean): void => {
        this._buildParseTrees = buildParseTrees;
    };

    /**
     * Gets whether or not a complete parse tree will be constructed while
     * parsing. This property is {@code true} for a newly constructed parser.
     *
      @returns `true` if a complete parse tree will be constructed while
     * parsing, otherwise {@code false}
     */
    public getBuildParseTree = (): boolean => {
        return this._buildParseTrees;
    };

    /**
     * Trim the internal lists of the parse tree during parsing to conserve memory.
     * This property is set to {@code false} by default for a newly constructed parser.
     *
     * @param trimParseTrees {@code true} to trim the capacity of the {@link ParserRuleContext#children}
     * list to its size after a rule is parsed.
     */
    public setTrimParseTree = (trimParseTrees: boolean): void => {
        if (trimParseTrees) {
            if (this.getTrimParseTree()) {
                return;
            }

            this.addParseListener(Parser.TrimToSizeListener.INSTANCE);
        } else {
            this.removeParseListener(Parser.TrimToSizeListener.INSTANCE);
        }
    };

    /**
      @returns `true` if the {@link ParserRuleContext#children} list is trimmed
     * using the default {@link Parser.TrimToSizeListener} during the parse process.
     */
    public getTrimParseTree = (): boolean => {
        return this.getParseListeners()?.contains(Parser.TrimToSizeListener.INSTANCE) ?? false;
    };

    public getParseListeners = (): java.util.List<ParseTreeListener> | null => {
        const listeners = this._parseListeners;
        if (listeners === null) {
            return java.util.Collections.emptyList();
        }

        return listeners;
    };

    /**
     * Registers {@code listener} to receive events during the parsing process.
     *
     * <p>To support output-preserving grammar transformations (including but not
     * limited to left-recursion removal, automated left-factoring, and
     * optimized code generation), calls to listener methods during the parse
     * may differ substantially from calls made by
     * {@link ParseTreeWalker#DEFAULT} used after the parse is complete. In
     * particular, rule entry and exit events may occur in a different order
     * during the parse than after the parser. In addition, calls to certain
     * rule entry methods may be omitted.</p>
     *
     * <p>With the following specific exceptions, calls to listener events are
     * <em>deterministic</em>, i.e. for identical input the calls to listener
     * methods will be the same.</p>
     *
     * <ul>
     * <li>Alterations to the grammar used to generate code may change the
     * behavior of the listener calls.</li>
     * <li>Alterations to the command line options passed to ANTLR 4 when
     * generating the parser may change the behavior of the listener calls.</li>
     * <li>Changing the version of the ANTLR Tool used to generate the parser
     * may change the behavior of the listener calls.</li>
     * </ul>
     *
     * @param listener the listener to add
     *
     * @throws NullPointerException if {@code} listener is {@code null}
     */
    public addParseListener = (listener: ParseTreeListener | null): void => {
        if (listener === null) {
            throw new java.lang.NullPointerException(S`listener`);
        }

        if (this._parseListeners === null) {
            this._parseListeners = new java.util.ArrayList<ParseTreeListener>();
        }

        this._parseListeners.add(listener);
    };

    /**
     * Remove {@code listener} from the list of parse listeners.
     *
     * <p>If {@code listener} is {@code null} or has not been added as a parse
     * listener, this method does nothing.</p>
     *
     * @see #addParseListener
     *
     * @param listener the listener to remove
     */
    public removeParseListener = (listener: ParseTreeListener | null): void => {
        if (this._parseListeners !== null) {
            if (this._parseListeners.remove(listener)) {
                if (this._parseListeners.isEmpty()) {
                    this._parseListeners = null;
                }
            }
        }
    };

    /**
     * Remove all parse listeners.
     *
     * @see #addParseListener
     */
    public removeParseListeners = (): void => {
        this._parseListeners = null;
    };

    /**
     * Gets the number of syntax errors reported during parsing. This value is
     * incremented each time {@link #notifyErrorListeners} is called.
     *
     * @see #notifyErrorListeners
     *
     * @returns tbd
     */
    public getNumberOfSyntaxErrors = (): number => {
        return this._syntaxErrors;
    };

    public getTokenFactory = (): TokenFactory<Token> | null => {
        return this._input?.getTokenSource().getTokenFactory() ?? null;
    };

    /**
     * Tell our token source and error strategy about a new way to create tokens.
     *
     * @param factory
     */
    public setTokenFactory = (factory: TokenFactory<Token> | null): void => {
        if (this._input) {
            this._input.getTokenSource().setTokenFactory(factory);
        }
    };

    /**
     * The ATN with bypass alternatives is expensive to create so we create it
     * lazily.
     *
     * @throws UnsupportedOperationException if the current parser does not
     * implement the {@link #getSerializedATN()} method.
     */

    public getATNWithBypassAlts = (): ATN | null => {
        const serializedAtn = this.getSerializedATN();
        if (serializedAtn === null) {
            throw new java.lang.UnsupportedOperationException(
                S`The current parser does not support an ATN with bypass alternatives.`);
        }

        /* synchronized (this) */
        if (this.bypassAltsAtnCache !== null) {
            return this.bypassAltsAtnCache;
        }

        const deserializationOptions = new ATNDeserializationOptions();
        deserializationOptions.setGenerateRuleBypassTransitions(true);
        this.bypassAltsAtnCache = new ATNDeserializer(deserializationOptions).deserialize(serializedAtn.toCharArray());

        return this.bypassAltsAtnCache;
    };

    /**
     * The preferred method of getting a tree pattern. For example, here's a
     * sample use:
     *
     * <pre>
     * ParseTree t = parser.expr();
     * ParseTreePattern p = parser.compileParseTreePattern("&lt;ID&gt;+0", MyParser.RULE_expr);
     * ParseTreeMatch m = p.match(t);
     * String id = m.get("ID");
     * </pre>
     *
     * @param pattern tbd
     * @param patternRuleIndex tbd
     * @param lexer tbd
     *
     * @returns tbd
     */
    public compileParseTreePattern(pattern: java.lang.String, patternRuleIndex: number,
        lexer?: Lexer | null): ParseTreePattern | null {
        if (!lexer) {
            if (this.getTokenStream() !== null) {
                const tokenSource = this.getTokenStream()!.getTokenSource();
                if (tokenSource instanceof Lexer) {
                    return this.compileParseTreePattern(pattern, patternRuleIndex, tokenSource);
                }
            }

            throw new java.lang.UnsupportedOperationException(S`Parser can't discover a lexer to use`);
        } else {
            const m: ParseTreePatternMatcher = new ParseTreePatternMatcher(lexer, this);

            return m.compile(pattern, patternRuleIndex);
        }

    }

    public getErrorHandler = (): ANTLRErrorStrategy | null => {
        return this._errHandler;
    };

    public setErrorHandler = (handler: ANTLRErrorStrategy | null): void => {
        this._errHandler = handler;
    };

    public getInputStream = (): TokenStream | null => { return this.getTokenStream(); };

    public readonly setInputStream = (input: IntStream | null): void => {
        this.setTokenStream(input as TokenStream);
    };

    public getTokenStream = (): TokenStream | null => {
        return this._input;
    };

    /**
     * Set the token stream and reset the parser.
     *
     * @param input
     */
    public setTokenStream = (input: TokenStream | null): void => {
        this._input = null;
        this.reset();
        this._input = input;
    };

    /**
     * Match needs to return the current input symbol, which gets put
     *  into the label for the associated token ref; e.g., x=ID.
     *
     * @returns tbd
     */
    public getCurrentToken = (): Token | null => {
        return this._input?.LT(1) ?? null;
    };

    public notifyErrorListeners(msg: java.lang.String): void;
    public notifyErrorListeners(offendingToken: Token, msg: java.lang.String,
        e: RecognitionException<Token, ParserATNSimulator>): void;
    public notifyErrorListeners(msgOrOffendingToken: java.lang.String | Token, msg?: java.lang.String,
        e?: RecognitionException<Token, ParserATNSimulator>): void {

        let offendingToken: Token | null = null;
        let message: java.lang.String | null = msg ?? null;
        if (msgOrOffendingToken instanceof Token) {
            offendingToken = msgOrOffendingToken;
        } else {
            message = msgOrOffendingToken;
        }

        ++this._syntaxErrors;
        const line = offendingToken?.getLine() ?? -1;
        const charPositionInLine = offendingToken?.getCharPositionInLine() ?? -1;

        const listener: ANTLRErrorListener = this.getErrorListenerDispatch();
        listener.syntaxError(this, offendingToken, line, charPositionInLine, message ?? S``, e);
    }

    /**
     * Consume and return the {@linkplain #getCurrentToken current symbol}.
     *
     * <p>E.g., given the following input with {@code A} being the current
     * lookahead symbol, this function moves the cursor to {@code B} and returns
     * {@code A}.</p>
     *
     * <pre>
     *  A B
     *  ^
     * </pre>
     *
     * If the parser is not in error recovery mode, the consumed symbol is added
     * to the parse tree using {@link ParserRuleContext#addChild(TerminalNode)}, and
     * {@link ParseTreeListener#visitTerminal} is called on any parse listeners.
     * If the parser <em>is</em> in error recovery mode, the consumed symbol is
     * added to the parse tree using {@link #createErrorNode(ParserRuleContext, Token)} then
     * {@link ParserRuleContext#addErrorNode(ErrorNode)} and
     * {@link ParseTreeListener#visitErrorNode} is called on any parse
     * listeners.
     *
     * @returns tbd
     */
    public consume = (): Token | null => {
        const o = this.getCurrentToken();
        if (o?.getType() !== Recognizer.EOF) {
            this.getInputStream()?.consume();
        }

        const hasListener = this._parseListeners !== null && !this._parseListeners.isEmpty();
        if (this._buildParseTrees || hasListener) {
            if (this._errHandler.inErrorRecoveryMode(this)) {
                const node = this._ctx?.addErrorNode(this.createErrorNode(this._ctx, o));
                if (node && this._parseListeners !== null) {
                    for (const listener of this._parseListeners) {
                        listener.visitErrorNode(node);
                    }
                }
            } else {
                const node = this._ctx?.addChild(this.createTerminalNode(this._ctx, o));
                if (node && this._parseListeners !== null) {
                    for (const listener of this._parseListeners) {
                        listener.visitTerminal(node);
                    }
                }
            }
        }

        return o;
    };

    /**
     * How to create a token leaf node associated with a parent.
     *  Typically, the terminal node to create is not a function of the parent.
     *
     *
     * @param parent tbd
     * @param t tbd
     *
     * @returns tbd
     */
    public createTerminalNode = (parent: ParserRuleContext, t: Token): TerminalNode => {
        return new TerminalNodeImpl(t);
    };

    /**
     * How to create an error node, given a token, associated with a parent.
     *  Typically, the error node to create is not a function of the parent.
     *
     *
     * @param parent
     * @param t
     */
    public createErrorNode = (parent: ParserRuleContext | null, t: Token | null): ErrorNode => {
        return new ErrorNodeImpl(t);
    };

    protected addContextToParseTree = (): void => {
        const parent: ParserRuleContext = this._ctx.parent as ParserRuleContext;
        // add current context to parent if we have a parent
        if (parent !== null) {
            parent.addChild(this._ctx);
        }
    };

    /**
     * Always called by generated parsers upon entry to a rule. Access field
     * {@link #_ctx} get the current context.
     *
     * @param localctx
     * @param state
     * @param ruleIndex
     */
    public enterRule = (localctx: ParserRuleContext | null, state: number, ruleIndex: number): void => {
        this.setState(state);
        this._ctx = localctx;
        this._ctx.start = this._input.LT(1);
        if (this._buildParseTrees) {
            this.addContextToParseTree();
        }

        if (this._parseListeners !== null) {
            this.triggerEnterRuleEvent();
        }

    };

    public exitRule = (): void => {
        if (this.matchedEOF) {
            // if we have matched EOF, it cannot consume past EOF so we use LT(1) here
            this._ctx.stop = this._input.LT(1); // LT(1) will be end of file
        } else {
            this._ctx.stop = this._input.LT(-1); // stop node is what we just matched
        }
        // trigger event on _ctx, before it reverts to parent
        if (this._parseListeners !== null) {
            this.triggerExitRuleEvent();
        }

        this.setState(this._ctx.invokingState);
        this._ctx = this._ctx.parent as ParserRuleContext;
    };

    public enterOuterAlt = (localctx: ParserRuleContext | null, altNum: number): void => {
        localctx.setAltNumber(altNum);
        // if we have new localctx, make sure we replace existing ctx
        // that is previous child of parse tree
        if (this._buildParseTrees && this._ctx !== localctx) {
            const parent: ParserRuleContext = this._ctx.parent as ParserRuleContext;
            if (parent !== null) {
                parent.removeLastChild();
                parent.addChild(localctx);
            }
        }
        this._ctx = localctx;
    };

    /**
     * Get the precedence level for the top-most precedence rule.
     *
      @returns The precedence level for the top-most precedence rule, or -1 if
     * the parser context is not nested within a precedence rule.
     */
    public readonly getPrecedence = (): number => {
        if (this._precedenceStack.isEmpty()) {
            return -1;
        }

        return this._precedenceStack.peek();
    };

    /**
     * @deprecated Use
     * {@link #enterRecursionRule(ParserRuleContext, int, int, int)} instead.
     */
    public enterRecursionRule(localctx: ParserRuleContext | null, ruleIndex: number): void;

    public enterRecursionRule(localctx: ParserRuleContext | null, state: number, ruleIndex: number, precedence: number): void;

    /**
     * @param localctx
     * @param ruleIndexOrState
     * @param ruleIndex
     * @param precedence
     * @deprecated Use
     * {@link #enterRecursionRule(ParserRuleContext, int, int, int)} instead.
     */
    public enterRecursionRule(localctx: ParserRuleContext | null, ruleIndexOrState: number, ruleIndex?: number, precedence?: number): void {
        if (ruleIndex === undefined) {
            this.enterRecursionRule(localctx, this.getATN().ruleToStartState[ruleIndex].stateNumber, ruleIndex, 0);
        } else {
            const state = ruleIndexOrState;
            this.setState(state);
            this._precedenceStack.push(precedence);
            this._ctx = localctx;
            this._ctx.start = this._input.LT(1);
            if (this._parseListeners !== null) {
                this.triggerEnterRuleEvent(); // simulates rule entry for left-recursive rules
            }
        }

    }

    /**
     * Like {@link #enterRule} but for recursive rules.
     *  Make the current context the child of the incoming localctx.
     *
     * @param localctx
     * @param state
     * @param ruleIndex
     */
    public pushNewRecursionContext = (localctx: ParserRuleContext | null, state: number, ruleIndex: number): void => {
        const previous: ParserRuleContext = this._ctx;
        previous.parent = localctx;
        previous.invokingState = state;
        previous.stop = this._input.LT(-1);

        this._ctx = localctx;
        this._ctx.start = previous.start;
        if (this._buildParseTrees) {
            this._ctx.addChild(previous);
        }

        if (this._parseListeners !== null) {
            this.triggerEnterRuleEvent(); // simulates rule entry for left-recursive rules
        }
    };

    public unrollRecursionContexts = (_parentctx: ParserRuleContext | null): void => {
        this._precedenceStack.pop();
        this._ctx.stop = this._input.LT(-1);
        const retctx: ParserRuleContext = this._ctx; // save current ctx (return value)

        // unroll so _ctx is as it was before call to recursive method
        if (this._parseListeners !== null) {
            while (this._ctx !== _parentctx) {
                this.triggerExitRuleEvent();
                this._ctx = this._ctx.parent as ParserRuleContext;
            }
        } else {
            this._ctx = _parentctx;
        }

        // hook into tree
        retctx.parent = _parentctx;

        if (this._buildParseTrees && _parentctx !== null) {
            // add return ctx into invoking rule's tree
            _parentctx.addChild(retctx);
        }
    };

    public getInvokingContext = (ruleIndex: number): ParserRuleContext | null => {
        let p: ParserRuleContext = this._ctx;
        while (p !== null) {
            if (p.getRuleIndex() === ruleIndex) {
                return p;
            }

            p = p.parent as ParserRuleContext;
        }

        return null;
    };

    public getContext = (): ParserRuleContext | null => {
        return this._ctx;
    };

    public setContext = (ctx: ParserRuleContext | null): void => {
        this._ctx = ctx;
    };

    public precpred = (localctx: RuleContext | null, precedence: number): boolean => {
        return precedence >= this._precedenceStack.peek();
    };

    public inContext = (context: java.lang.String | null): boolean => {
        // TODO: useful in parser?
        return false;
    };

    /**
     * Checks whether or not {@code symbol} can follow the current state in the
     * ATN. The behavior of this method is equivalent to the following, but is
     * implemented such that the complete context-sensitive follow set does not
     * need to be explicitly constructed.
     *
     * <pre>
     * return getExpectedTokens().contains(symbol);
     * </pre>
     *
     * @param symbol the symbol type to check
      @returns {@code true} if {@code symbol} can follow the current state in
     * the ATN, otherwise {@code false}.
     */
    public isExpectedToken = (symbol: number): boolean => {
        //   		return getInterpreter().atn.nextTokens(_ctx);
        const atn: ATN = this.getInterpreter().atn;
        let ctx: ParserRuleContext = this._ctx;
        const s: ATNState = atn.states.get(this.getState());
        let following: IntervalSet = atn.nextTokens(s);
        if (following.contains(symbol)) {
            return true;
        }
        //        System.out.println("following "+s+"="+following);
        if (!following.contains(Token.EPSILON)) {
            return false;
        }

        while (ctx !== null && ctx.invokingState >= 0 && following.contains(Token.EPSILON)) {
            const invokingState: ATNState = atn.states.get(ctx.invokingState);
            const rt: RuleTransition = invokingState.transition(0) as RuleTransition;
            following = atn.nextTokens(rt.followState);
            if (following.contains(symbol)) {
                return true;
            }

            ctx = ctx.parent as ParserRuleContext;
        }

        if (following.contains(Token.EPSILON) && symbol === Token.EOF) {
            return true;
        }

        return false;
    };

    public isMatchedEOF = (): boolean => {
        return this.matchedEOF;
    };

    /**
     * Computes the set of input symbols which could follow the current parser
     * state and context, as given by {@link #getState} and {@link #getContext},
     * respectively.
     *
     * @see ATN#getExpectedTokens(int, RuleContext)
     */
    public getExpectedTokens = (): IntervalSet | null => {
        return this.getATN().getExpectedTokens(this.getState(), this.getContext());
    };

    public getExpectedTokensWithinCurrentRule = (): IntervalSet | null => {
        const atn: ATN = this.getInterpreter().atn;
        const s: ATNState = atn.states.get(this.getState());

        return atn.nextTokens(s);
    };

    /**
     * Get a rule's index (i.e., {@code RULE_ruleName} field) or -1 if not found.
     *
     * @param ruleName
     */
    public getRuleIndex = (ruleName: java.lang.String | null): number => {
        const ruleIndex: java.lang.Integer = this.getRuleIndexMap().get(ruleName);
        if (ruleIndex !== null) {
            return ruleIndex;
        }

        return -1;
    };

    public getRuleContext = (): ParserRuleContext | null => { return this._ctx; };

    /**
     * Return List&lt;String&gt; of the rule names in your parser instance
     *  leading up to a call to the current rule.  You could override if
     *  you want more details such as the file/line info of where
     *  in the ATN a rule is invoked.
     *
     *  This is very useful for error messages.
     */
    public getRuleInvocationStack(): java.util.List<java.lang.String> | null;

    public getRuleInvocationStack(p: RuleContext | null): java.util.List<java.lang.String>;

    /**
     * Return List&lt;String&gt; of the rule names in your parser instance
     *  leading up to a call to the current rule.  You could override if
     *  you want more details such as the file/line info of where
     *  in the ATN a rule is invoked.
     *
     *  This is very useful for error messages.
     *
     * @param p
     */
    public getRuleInvocationStack(p?: RuleContext | null): java.util.List<java.lang.String> | null {
        if (p === undefined) {
            return this.getRuleInvocationStack(this._ctx);
        } else {
            const ruleNames: java.lang.String[] = this.getRuleNames();
            const stack: java.util.List<java.lang.String> = new java.util.ArrayList<java.lang.String>();
            while (p !== null) {
                // compute what follows who invoked us
                const ruleIndex: number = p.getRuleIndex();
                if (ruleIndex < 0) {
                    stack.add(S`n/a`);
                } else {
                    stack.add(ruleNames[ruleIndex]);
                }

                p = p.parent;
            }

            return stack;
        }

    }

    /** For debugging and other purposes. */
    public getDFAStrings = (): java.util.List<java.lang.String> | null => {
		/* synchronized (_interp.decisionToDFA) */ {
            const s: java.util.List<java.lang.String> = new java.util.ArrayList<java.lang.String>();
            for (let d = 0; d < this._interp.decisionToDFA.length; d++) {
                const dfa: DFA = this._interp.decisionToDFA[d];
                s.add(dfa.toString(this.getVocabulary()));
            }

            return s;
        }
    };

    public dumpDFA(): void;

    /** For debugging and other purposes. */
    public dumpDFA(dumpStream: java.io.PrintStream | null): void;

    public dumpDFA(dumpStream?: java.io.PrintStream | null): void {
        if (dumpStream === undefined) {
            this.dumpDFA(java.lang.System.out);
        } else {
		/* synchronized (_interp.decisionToDFA) */ {
                let seenOne = false;
                for (let d = 0; d < this._interp.decisionToDFA.length; d++) {
                    const dfa: DFA = this._interp.decisionToDFA[d];
                    if (!dfa.states.isEmpty()) {
                        if (seenOne) {
                            dumpStream.println();
                        }

                        dumpStream.println(S`Decision ` + dfa.decision + S`:`);
                        dumpStream.print(dfa.toString(this.getVocabulary()));
                        seenOne = true;
                    }
                }
            }
        }

    }

    public getSourceName = (): java.lang.String | null => {
        return this._input.getSourceName();
    };

    public getParseInfo = (): ParseInfo | null => {
        const interp: ParserATNSimulator = this.getInterpreter();
        if (interp instanceof ProfilingATNSimulator) {
            return new ParseInfo(interp);
        }

        return null;
    };

    /**
     *
     * @param profile
     */
    public setProfile = (profile: boolean): void => {
        const interp: ParserATNSimulator = this.getInterpreter();
        const saveMode: PredictionMode = interp.getPredictionMode();
        if (profile) {
            if (!(interp instanceof ProfilingATNSimulator)) {
                this.setInterpreter(new ProfilingATNSimulator(this));
            }
        } else {
            if (interp instanceof ProfilingATNSimulator) {
                const sim: ParserATNSimulator =
                    new ParserATNSimulator(this, this.getATN(), interp.decisionToDFA, interp.getSharedContextCache());
                this.setInterpreter(sim);
            }
        }

        this.getInterpreter().setPredictionMode(saveMode);
    };

    /**
     * During a parse is sometimes useful to listen in on the rule entry and exit
     *  events as well as token matches. This is for quick and dirty debugging.
     *
     * @param trace
     */
    public setTrace = (trace: boolean): void => {
        if (!trace) {
            this.removeParseListener(this._tracer);
            this._tracer = null;
        } else {
            if (this._tracer !== null) {
                this.removeParseListener(this._tracer);
            } else {
                this._tracer = new TraceListener();
            }

            this.addParseListener(this._tracer);
        }
    };

    /**
     * Gets whether a {@link TraceListener} is registered as a parse listener
     * for the parser.
     *
     * @see #setTrace(boolean)
     */
    public isTrace = (): boolean => {
        return this._tracer !== null;
    };

    /**
     * Notify any parse listeners of an enter rule event.
     *
     * @see #addParseListener
     */
    protected triggerEnterRuleEvent = (): void => {
        for (const listener of this._parseListeners) {
            listener.enterEveryRule(this._ctx);
            this._ctx.enterRule(listener);
        }
    };

    /**
     * Notify any parse listeners of an exit rule event.
     *
     * @see #addParseListener
     */
    protected triggerExitRuleEvent = (): void => {
        // reverse order walk of listeners
        for (let i: number = this._parseListeners.size() - 1; i >= 0; i--) {
            const listener: ParseTreeListener = this._parseListeners.get(i);
            this._ctx.exitRule(listener);
            listener.exitEveryRule(this._ctx);
        }
    };

}

// eslint-disable-next-line @typescript-eslint/no-namespace, no-redeclare
export namespace Parser {
    export type TraceListener = InstanceType<Parser.TraceListener>;
    export type TrimToSizeListener = InstanceType<typeof Parser.TrimToSizeListener>;
}
