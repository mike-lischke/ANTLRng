/* java2ts: keep */

/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/* eslint-disable no-underscore-dangle */

import { java, S } from "jree";

import {
    ActionTransition, ATN, ATNConfig, ATNConfigSet, ATNSimulator, ATNState, AtomTransition, BlockEndState,
    BlockStartState, DecisionState, EmptyPredictionContext, EpsilonTransition, NotSetTransition,
    PrecedencePredicateTransition, PredicateTransition, PredictionContext, PredictionContextCache, PredictionMode,
    RuleStopState, RuleTransition, SemanticContext, SetTransition, SingletonPredictionContext, StarLoopEntryState,
    Transition
} from "./";
import {
    DFA, DFAState, DoubleKeyMap, Interval, IntervalSet, IntStream, NoViableAltException, Pair, Parser,
    ParserRuleContext, RuleContext, Token, TokenStream, VocabularyImpl
} from "../";

/**
 * The embodiment of the adaptive LL(*), ALL(*), parsing strategy.
 *
 * <p>
 * The basic complexity of the adaptive strategy makes it harder to understand.
 * We begin with ATN simulation to build paths in a DFA. Subsequent prediction
 * requests go through the DFA first. If they reach a state without an edge for
 * the current symbol, the algorithm fails over to the ATN simulation to
 * complete the DFA path for the current input (until it finds a conflict state
 * or uniquely predicting state).</p>
 *
 * <p>
 * All of that is done without using the outer context because we want to create
 * a DFA that is not dependent upon the rule invocation stack when we do a
 * prediction. One DFA works in all contexts. We avoid using context not
 * necessarily because it's slower, although it can be, but because of the DFA
 * caching problem. The closure routine only considers the rule invocation stack
 * created during prediction beginning in the decision rule. For example, if
 * prediction occurs without invoking another rule's ATN, there are no context
 * stacks in the configurations. When lack of context leads to a conflict, we
 * don't know if it's an ambiguity or a weakness in the strong LL(*) parsing
 * strategy (versus full LL(*)).</p>
 *
 * <p>
 * When SLL yields a configuration set with conflict, we rewind the input and
 * retry the ATN simulation, this time using full outer context without adding
 * to the DFA. Configuration context stacks will be the full invocation stacks
 * from the start rule. If we get a conflict using full context, then we can
 * definitively say we have a true ambiguity for that input sequence. If we
 * don't get a conflict, it implies that the decision is sensitive to the outer
 * context. (It is not context-sensitive in the sense of context-sensitive
 * grammars.)</p>
 *
 * <p>
 * The next time we reach this DFA state with an SLL conflict, through DFA
 * simulation, we will again retry the ATN simulation using full context mode.
 * This is slow because we can't save the results and have to "interpret" the
 * ATN each time we get that input.</p>
 *
 * <p>
 * <strong>CACHING FULL CONTEXT PREDICTIONS</strong></p>
 *
 * <p>
 * We could cache results from full context to predicted alternative easily and
 * that saves a lot of time but doesn't work in presence of predicates. The set
 * of visible predicates from the ATN start state changes depending on the
 * context, because closure can fall off the end of a rule. I tried to cache
 * tuples (stack context, semantic context, predicted alt) but it was slower
 * than interpreting and much more complicated. Also required a huge amount of
 * memory. The goal is not to create the world's fastest parser anyway. I'd like
 * to keep this algorithm simple. By launching multiple threads, we can improve
 * the speed of parsing across a large number of files.</p>
 *
 * <p>
 * There is no strict ordering between the amount of input used by SLL vs LL,
 * which makes it really hard to build a cache for full context. Let's say that
 * we have input A B C that leads to an SLL conflict with full context X. That
 * implies that using X we might only use A B but we could also use A B C D to
 * resolve conflict. Input A B C D could predict alternative 1 in one position
 * in the input and A B C E could predict alternative 2 in another position in
 * input. The conflicting SLL configurations could still be non-unique in the
 * full context prediction, which would lead us to requiring more input than the
 * original A B C.	To make a	prediction cache work, we have to track	the exact
 * input	used during the previous prediction. That amounts to a cache that maps
 * X to a specific DFA for that context.</p>
 *
 * <p>
 * Something should be done for left-recursive expression predictions. They are
 * likely LL(1) + pred eval. Easier to do the whole SLL unless error and retry
 * with full LL thing Sam does.</p>
 *
 * <p>
 * <strong>AVOIDING FULL CONTEXT PREDICTION</strong></p>
 *
 * <p>
 * We avoid doing full context retry when the outer context is empty, we did not
 * dip into the outer context by falling off the end of the decision state rule,
 * or when we force SLL mode.</p>
 *
 * <p>
 * As an example of the not dip into outer context case, consider as super
 * constructor calls versus function calls. One grammar might look like
 * this:</p>
 *
 * <pre>
 * ctorBody
 *   : '{' superCall? stat* '}'
 *   ;
 * </pre>
 *
 * <p>
 * Or, you might see something like</p>
 *
 * <pre>
 * stat
 *   : superCall ';'
 *   | expression ';'
 *   | ...
 *   ;
 * </pre>
 *
 * <p>
 * In both cases I believe that no closure operations will dip into the outer
 * context. In the first case ctorBody in the worst case will stop at the '}'.
 * In the 2nd case it should stop at the ';'. Both cases should stay within the
 * entry rule and not dip into the outer context.</p>
 *
 * <p>
 * <strong>PREDICATES</strong></p>
 *
 * <p>
 * Predicates are always evaluated if present in either SLL or LL both. SLL and
 * LL simulation deals with predicates differently. SLL collects predicates as
 * it performs closure operations like ANTLR v3 did. It delays predicate
 * evaluation until it reaches and accept state. This allows us to cache the SLL
 * ATN simulation whereas, if we had evaluated predicates on-the-fly during
 * closure, the DFA state configuration sets would be different and we couldn't
 * build up a suitable DFA.</p>
 *
 * <p>
 * When building a DFA accept state during ATN simulation, we evaluate any
 * predicates and return the sole semantically valid alternative. If there is
 * more than 1 alternative, we report an ambiguity. If there are 0 alternatives,
 * we throw an exception. Alternatives without predicates act like they have
 * true predicates. The simple way to think about it is to strip away all
 * alternatives with false predicates and choose the minimum alternative that
 * remains.</p>
 *
 * <p>
 * When we start in the DFA and reach an accept state that's predicated, we test
 * those and return the minimum semantically viable alternative. If no
 * alternatives are viable, we throw an exception.</p>
 *
 * <p>
 * During full LL ATN simulation, closure always evaluates predicates and
 * on-the-fly. This is crucial to reducing the configuration set size during
 * closure. It hits a landmine when parsing with the Java grammar, for example,
 * without this on-the-fly evaluation.</p>
 *
 * <p>
 * <strong>SHARING DFA</strong></p>
 *
 * <p>
 * All instances of the same parser share the same decision DFAs through a
 * static field. Each instance gets its own ATN simulator but they share the
 * same {@link #decisionToDFA} field. They also share a
 * {@link PredictionContextCache} object that makes sure that all
 * {@link PredictionContext} objects are shared among the DFA states. This makes
 * a big size difference.</p>
 *
 * <p>
 * <strong>THREAD SAFETY</strong></p>
 *
 * <p>
 * The {@link ParserATNSimulator} locks on the {@link #decisionToDFA} field when
 * it adds a new DFA object to that array. {@link #addDFAEdge}
 * locks on the DFA for the current decision when setting the
 * {@link DFAState#edges} field. {@link #addDFAState} locks on
 * the DFA for the current decision when looking up a DFA state to see if it
 * already exists. We must make sure that all requests to add DFA states that
 * are equivalent result in the same shared DFA object. This is because lots of
 * threads will be trying to update the DFA at once. The
 * {@link #addDFAState} method also locks inside the DFA lock
 * but this time on the shared context cache when it rebuilds the
 * configurations' {@link PredictionContext} objects using cached
 * subgraphs/nodes. No other locking occurs, even during DFA simulation. This is
 * safe as long as we can guarantee that all threads referencing
 * {@code s.edge[t]} get the same physical target {@link DFAState}, or
 * {@code null}. Once into the DFA, the DFA simulation does not reference the
 * {@link DFA#states} map. It follows the {@link DFAState#edges} field to new
 * targets. The DFA simulator will either find {@link DFAState#edges} to be
 * {@code null}, to be non-{@code null} and {@code dfa.edges[t]} null, or
 * {@code dfa.edges[t]} to be non-null. The
 * {@link #addDFAEdge} method could be racing to set the field
 * but in either case the DFA simulator works; if {@code null}, and requests ATN
 * simulation. It could also race trying to get {@code dfa.edges[t]}, but either
 * way it will work because it's not doing a test and set operation.</p>
 *
 * <p>
 * <strong>Starting with SLL then failing to combined SLL/LL (Two-Stage
 * Parsing)</strong></p>
 *
 * <p>
 * Sam pointed out that if SLL does not give a syntax error, then there is no
 * point in doing full LL, which is slower. We only have to try LL if we get a
 * syntax error. For maximum speed, Sam starts the parser set to pure SLL
 * mode with the `BailErrorStrategy`:</p>
 *
 * <pre>
 * parser.{@link Parser#getInterpreter() getInterpreter()}
 *     .{@link #setPredictionMode setPredictionMode}{@code (}{@link PredictionMode#SLL}{@code )};
 * parser.{@link Parser#setErrorHandler setErrorHandler}(new {@link BailErrorStrategy}());
 * </pre>
 *
 * <p>
 * If it does not get a syntax error, then we're done. If it does get a syntax
 * error, we need to retry with the combined SLL/LL strategy.</p>
 *
 * <p>
 * The reason this works is as follows. If there are no SLL conflicts, then the
 * grammar is SLL (at least for that input set). If there is an SLL conflict,
 * the full LL analysis must yield a set of viable alternatives which is a
 * subset of the alternatives reported by SLL. If the LL set is a singleton,
 * then the grammar is LL but not SLL. If the LL set is the same size as the SLL
 * set, the decision is SLL. If the LL set has size &gt; 1, then that decision
 * is truly ambiguous on the current input. If the LL set is smaller, then the
 * SLL conflict resolution might choose an alternative that the full LL would
 * rule out as a possibility based upon better context information. If that's
 * the case, then the SLL parse will definitely get an error because the full LL
 * analysis says it's not viable. If SLL conflict resolution chooses an
 * alternative within the LL set, them both SLL and LL would choose the same
 * alternative because they both choose the minimum of multiple conflicting
 * alternatives.</p>
 *
 * <p>
 * Let's say we have a set of SLL conflicting alternatives {@code {1, 2, 3}} and
 * a smaller LL set called <em>s</em>. If <em>s</em> is {@code {2, 3}}, then SLL
 * parsing will get an error because SLL will pursue alternative 1. If
 * <em>s</em> is {@code {1, 2}} or {@code {1, 3}} then both SLL and LL will
 * choose the same alternative because alternative one is the minimum of either
 * set. If <em>s</em> is {@code {2}} or {@code {3}} then SLL will get a syntax
 * error. If <em>s</em> is {@code {1}} then SLL will succeed.</p>
 *
 * <p>
 * Of course, if the input is invalid, then we will get an error for sure in
 * both SLL and LL parsing. Erroneous input will therefore require 2 passes over
 * the input.</p>
 */
export class ParserATNSimulator extends ATNSimulator {
    public static debug = false;
    public static trace_atn_sim = false;
    public static dfa_debug = false;
    public static retry_debug = false;

    public decisionToDFA: DFA[];

    protected readonly parser: Parser | null;

    /**
     * Each prediction operation uses a cache for merge of prediction contexts.
     *  Don't keep around as it wastes huge amounts of memory. DoubleKeyMap
     *  isn't synchronized but we're ok since two threads shouldn't reuse same
     *  parser/atn sim object because it can only handle one input at a time.
     *  This maps graphs a and b to merged result c. (a,b) -> c. We can avoid
     *  the merge if we ever see a and b again.  Note that (b,a) -> c should
     *  also be examined during cache lookup.
     */
    protected mergeCache: DoubleKeyMap<PredictionContext, PredictionContext, PredictionContext> | null = null;

    // LAME globals to avoid parameters!!!!! I need these down deep in predTransition
    protected _input: TokenStream | null = null;
    protected _startIndex = 0;
    protected _outerContext: ParserRuleContext | null = null;
    protected _dfa: DFA | null = null;

    /** SLL, LL, or LL + exact ambig detection? */

    private mode: PredictionMode = PredictionMode.LL;

    /** Testing only! */
    public constructor(atn: ATN, decisionToDFA: DFA[], sharedContextCache: PredictionContextCache | null);
    public constructor(parser: Parser, atn: ATN, decisionToDFA: DFA[],
        sharedContextCache: PredictionContextCache | null);
    public constructor(atnOrParser: ATN | Parser, decisionToDFAOrAtn: DFA[] | ATN,
        sharedContextCacheOrDecisionToDFA: PredictionContextCache | DFA[] | null,
        sharedContextCache?: PredictionContextCache | null) {

        let atn;
        let parser;
        let decisionArray;
        let cache;
        if (atnOrParser instanceof ATN) {
            atn = atnOrParser;
            parser = null;
            decisionArray = decisionToDFAOrAtn as DFA[];
            cache = sharedContextCacheOrDecisionToDFA as PredictionContextCache;
        } else {
            parser = atnOrParser;
            atn = decisionToDFAOrAtn as ATN;
            decisionArray = sharedContextCacheOrDecisionToDFA as DFA[];
            cache = sharedContextCache ?? null;
        }

        super(atn, cache);
        this.parser = parser;
        this.decisionToDFA = decisionArray;
    }

    protected static getUniqueAlt = (configs: ATNConfigSet): number => {
        let alt = ATN.INVALID_ALT_NUMBER;
        for (const c of configs) {
            if (alt === ATN.INVALID_ALT_NUMBER) {
                alt = c.alt; // found first alt
            } else {
                if (c.alt !== alt) {
                    return ATN.INVALID_ALT_NUMBER;
                }
            }

        }

        return alt;
    };

    public reset = (): void => {
        //
    };

    public override clearDFA = (): void => {
        for (let d = 0; d < this.decisionToDFA.length; d++) {
            this.decisionToDFA[d] = new DFA(this.atn.getDecisionState(d), d);
        }
    };

    public adaptivePredict = (input: TokenStream, decision: number,
        outerContext: ParserRuleContext): number => {
        if (ParserATNSimulator.debug || ParserATNSimulator.trace_atn_sim) {
            const output = `adaptivePredict decision ` + decision +
                ` exec LA(1)==` + this.getLookaheadName(input) +
                ` line ` + input.LT(1)!.getLine() + `:` + input.LT(1)!.getCharPositionInLine();
            java.lang.System.out.println(S`${output}`);
        }

        this._input = input;
        this._startIndex = input.index();
        this._outerContext = outerContext;
        const dfa = this.decisionToDFA[decision];
        this._dfa = dfa;

        const m = input.mark();
        const index = this._startIndex;

        // Now we are certain to have a specific decision's DFA
        // But, do we still need an initial state?
        try {
            let s0: DFAState | null;
            if (dfa.isPrecedenceDfa()) {
                // the start state for a precedence DFA depends on the current
                // parser precedence, and is provided by a DFA method.
                s0 = dfa.getPrecedenceStartState(this.parser!.getPrecedence());
            } else {
                // the start state for a "regular" DFA is just s0
                s0 = dfa.s0;
            }

            if (s0 === null) {
                const fullCtx = false;
                // eslint-disable-next-line @typescript-eslint/naming-convention
                let s0_closure = this.computeStartState(dfa.atnStartState, ParserRuleContext.EMPTY, fullCtx);

                if (dfa.isPrecedenceDfa()) {
                    /* If this is a precedence DFA, we use applyPrecedenceFilter
                     * to convert the computed start state to a precedence start
                     * state. We then use DFA.setPrecedenceStartState to set the
                     * appropriate start state for the precedence level rather
                     * than simply setting DFA.s0.
                     */
                    dfa.s0!.configs = s0_closure; // not used for prediction but useful to know start configs anyway
                    s0_closure = this.applyPrecedenceFilter(s0_closure);
                    s0 = this.addDFAState(dfa, new DFAState(s0_closure ?? undefined));
                    dfa.setPrecedenceStartState(this.parser!.getPrecedence(), s0);
                } else {
                    s0 = this.addDFAState(dfa, new DFAState(s0_closure ?? undefined));
                    dfa.s0 = s0;
                }
            }

            const alt: number = this.execATN(dfa, s0, input, index, outerContext ?? ParserRuleContext.EMPTY);
            if (ParserATNSimulator.debug) {
                java.lang.System.out.println(S`DFA after predictATN: ${dfa.toString(this.parser!.getVocabulary())}`);
            }

            return alt;
        } finally {
            this.mergeCache = null; // wack cache after each prediction
            this._dfa = null;
            input.seek(index);
            input.release(m);
        }
    };

    public getRuleName = (index: number): java.lang.String => {
        if (this.parser !== null && index >= 0) {
            return S`${this.parser.getRuleNames()![index]}`;
        }

        return S`< rule${index} > `;
    };

    public precedenceTransition = (config: ATNConfig,
        pt: PrecedencePredicateTransition,
        collectPredicates: boolean,
        inContext: boolean,
        fullCtx: boolean): ATNConfig | null => {
        if (ParserATNSimulator.debug) {
            java.lang.System.out.println(
                S`PRED(collectPredicates = ${collectPredicates})${pt.precedence}>= _p, ctx dependent = true`);
            if (this.parser !== null) {
                java.lang.System.out.println(S`context surrounding pred is${this.parser.getRuleInvocationStack()}`);
            }
        }

        let c: ATNConfig | null = null;
        if (collectPredicates && inContext) {
            if (fullCtx) {
                // In full context mode, we can evaluate predicates on-the-fly
                // during closure, which dramatically reduces the size of
                // the config sets. It also obviates the need to test predicates
                // later during conflict resolution.
                const currentPosition = this._input!.index();
                this._input!.seek(this._startIndex);
                const predSucceeds = this.evalSemanticContext(pt.getPredicate(), this._outerContext!, config.alt,
                    fullCtx);
                this._input!.seek(currentPosition);
                if (predSucceeds) {
                    c = new ATNConfig(config, pt.target); // no pred context
                }
            } else {
                const newSemCtx = SemanticContext.and(config.semanticContext, pt.getPredicate());
                c = new ATNConfig(config, pt.target, newSemCtx);
            }
        } else {
            c = new ATNConfig(config, pt.target);
        }

        if (ParserATNSimulator.debug) {
            java.lang.System.out.println(S`config from pred transition = ${c}`);
        }

        return c;
    };

    public getTokenName = (t: number): java.lang.String => {
        if (t === Token.EOF) {
            return S`EOF`;
        }

        const vocabulary = this.parser !== null ? this.parser.getVocabulary() : VocabularyImpl.EMPTY_VOCABULARY;
        const displayName = vocabulary.getDisplayName(t);
        if (displayName === String(t)) {
            return S`${displayName}`;
        }

        return S`${displayName}<${t}>`;
    };

    public getLookaheadName = (input: TokenStream): java.lang.String => {
        return this.getTokenName(input.LA(1));
    };

    /**
     * Used for debugging in adaptivePredict around execATN but I cut
     *  it out for clarity now that alg. works well. We can leave this
     *  "dead" code for a bit.
     *
     * @param e tbd
     */
    public dumpDeadEndConfigs = (e: NoViableAltException): void => {
        java.lang.System.err.println(S`dead end configs: `);

        const configs = e.getDeadEndConfigs();
        if (configs) {
            for (const c of configs) {
                let trans = `no edges`;
                if (c.state.getNumberOfTransitions() > 0) {
                    const t = c.state.transition(0);
                    if (t instanceof AtomTransition) {
                        trans = `Atom${this.getTokenName(t.labelValue)}`;
                    } else {
                        if (t instanceof SetTransition) {
                            const not = t instanceof NotSetTransition;
                            trans = (not ? `~` : ``) + S`Set` + t.set.toString();
                        }
                    }

                }
                java.lang.System.err.println(S`${c.toString(true)}: ${trans}`);
            }
        }
    };

    public readonly setPredictionMode = (mode: PredictionMode): void => {
        this.mode = mode;
    };

    public readonly getPredictionMode = (): PredictionMode => {
        return this.mode;
    };

    public getParser = (): Parser | null => {
        return this.parser;
    };

    protected noViableAlt = (input: TokenStream,
        outerContext: ParserRuleContext | null,
        configs: ATNConfigSet | null,
        startIndex: number): NoViableAltException => {
        return new NoViableAltException(this.parser!, input,
            input.get(startIndex),
            input.LT(1),
            configs, outerContext);
    };

    // eslint-disable-next-line jsdoc/require-returns-check
    /**
     * Performs ATN simulation to compute a predicted alternative based
     *  upon the remaining input, but also updates the DFA cache to avoid
     *  having to traverse the ATN again for the same input sequence.
     *
     There are some key conditions we're looking for after computing a new
     set of ATN configs (proposed DFA state):
     * if the set is empty, there is no viable alternative for current symbol
     * does the state uniquely predict an alternative?
     * does the state have a conflict that would prevent us from
             putting it on the work list?
     *
     We also have some key operations to do:
     * add an edge from previous DFA state to potentially new DFA state, D,
     *        upon current symbol but only if adding to work list, which means in all
     *        cases except no viable alternative (and possibly non-greedy decisions?)
     * collecting predicates and adding semantic context to DFA accept states
     * adding rule context to context-sensitive DFA accept states
     * consuming an input symbol
     * reporting a conflict
     * reporting an ambiguity
     * reporting a context sensitivity
     * reporting insufficient predicates
     *
     * cover these cases:
     *    dead end
     *    single alt
     *    single alt + preds
     *    conflict
     *    conflict + preds
     *
     * @param dfa tbd
     * @param s0 tbd
     * @param input tbd
     * @param startIndex tbd
     * @param outerContext tbd
     *
     * @returns tbd
     */
    protected execATN = (dfa: DFA, s0: DFAState, input: TokenStream, startIndex: number,
        outerContext: ParserRuleContext): number => {
        if (ParserATNSimulator.debug || ParserATNSimulator.trace_atn_sim) {
            const output = "execATN decision" + dfa.decision +
                ", DFA state" + s0 +
                ", LA(1) == " + this.getLookaheadName(input) +
                " line" + input.LT(1)!.getLine() + ": " + input.LT(1)!.getCharPositionInLine();

            java.lang.System.out.println(S`${output}`);

        }

        let previousD = s0;
        let t = input.LA(1);

        while (true) { // while more work
            let state = this.getExistingTargetState(previousD, t);
            if (state === null) {
                state = this.computeTargetState(dfa, previousD, t);
            }

            if (state === ATNSimulator.ERROR) {
                // if any configs in previous dipped into outer context, that
                // means that input up to t actually finished entry rule
                // at least for SLL decision. Full LL doesn't dip into outer
                // so don't need special case.
                // We will get an error no matter what so delay until after
                // decision; better error message. Also, no reachable target
                // ATN states in SLL implies LL will also get nowhere.
                // If conflict in states that dip out, choose min since we
                // will get error no matter what.
                const e = this.noViableAlt(input, outerContext, previousD?.configs ?? null, startIndex);
                input.seek(startIndex);
                const alt = this.getSynValidOrSemInvalidAltThatFinishedDecisionEntryRule(previousD?.configs ?? null,
                    outerContext);
                if (alt !== ATN.INVALID_ALT_NUMBER) {
                    return alt;
                }
                throw e;
            }

            if (state.requiresFullContext && this.mode !== PredictionMode.SLL) {
                // IF PREDS, MIGHT RESOLVE TO SINGLE ALT => SLL (or syntax error)
                let conflictingAlts = state.configs.conflictingAlts;
                if (state.predicates !== null) {
                    if (ParserATNSimulator.debug) {
                        java.lang.System.out.println(S`DFA state has preds in DFA sim LL failover`);
                    }

                    const conflictIndex = input.index();
                    if (conflictIndex !== startIndex) {
                        input.seek(startIndex);
                    }

                    conflictingAlts = this.evalSemanticContext(state.predicates, outerContext, true);
                    if (conflictingAlts.cardinality() === 1) {
                        if (ParserATNSimulator.debug) {
                            java.lang.System.out.println(S`Full LL avoided`);
                        }

                        return conflictingAlts.nextSetBit(0);
                    }

                    if (conflictIndex !== startIndex) {
                        // restore the index so reporting the fallback to full
                        // context occurs with the index at the correct spot
                        input.seek(conflictIndex);
                    }
                }

                if (ParserATNSimulator.dfa_debug) {
                    java.lang.System.out.println(S`ctx sensitive state${outerContext} in ${state}`);
                }

                const fullCtx = true;
                const s0_closure = this.computeStartState(dfa.atnStartState, outerContext, fullCtx);
                this.reportAttemptingFullContext(dfa, conflictingAlts, state.configs, startIndex, input.index());
                const alt: number = this.execATNWithFullContext(dfa, state, s0_closure,
                    input, startIndex,
                    outerContext);

                return alt;
            }

            if (state.isAcceptState) {
                if (state.predicates === null) {
                    return state.prediction;
                }

                const stopIndex: number = input.index();
                input.seek(startIndex);
                const alts: java.util.BitSet = this.evalSemanticContext(state.predicates, outerContext, true);
                switch (alts.cardinality()) {
                    case 0: {
                        throw this.noViableAlt(input, outerContext, state.configs, startIndex);
                    }

                    case 1: {
                        return alts.nextSetBit(0);
                    }

                    default: {
                        // report ambiguity after predicate evaluation to make sure the correct
                        // set of ambig alts is reported.
                        this.reportAmbiguity(dfa, state, startIndex, stopIndex, false, alts, state.configs);

                        return alts.nextSetBit(0);
                    }

                }
            }

            previousD = state;

            if (t !== IntStream.EOF) {
                input.consume();
                t = input.LA(1);
            }
        }
    };

    /**
     * Get an existing target state for an edge in the DFA. If the target state
     * for the edge has not yet been computed or is otherwise not available,
     * this method returns {@code null}.
     *
     * @param previousD The current DFA state
     * @param t The next input symbol
      @returns The existing target DFA state for the given input symbol
     * {@code t}, or {@code null} if the target state for this edge is not
     * already cached
     */
    protected getExistingTargetState = (previousD: DFAState | null, t: number): DFAState | null => {
        const edges = previousD?.edges ?? null;
        if (edges === null || t + 1 < 0 || t + 1 >= edges.length) {
            return null;
        }

        return edges[t + 1];
    };

    /**
     * Compute a target state for an edge in the DFA, and attempt to add the
     * computed state and corresponding edge to the DFA.
     *
     * @param dfa The DFA
     * @param previousD The current DFA state
     * @param t The next input symbol
     *
      @returns The computed target DFA state for the given input symbol
     * {@code t}. If {@code t} does not lead to a valid DFA state, this method
     * returns {@link #ERROR}.
     */
    protected computeTargetState = (dfa: DFA, previousD: DFAState, t: number): DFAState => {
        const reach = this.computeReachSet(previousD.configs, t, false);
        if (reach === null) {
            this.addDFAEdge(dfa, previousD, t, ATNSimulator.ERROR);

            return ATNSimulator.ERROR;
        }

        // create new target state; we'll add to DFA after it's complete
        const D = new DFAState(reach);
        const predictedAlt = ParserATNSimulator.getUniqueAlt(reach);

        if (ParserATNSimulator.debug) {
            const altSubSets = PredictionMode.getConflictingAltSubsets(reach);
            const text = `SLL altSubSets = ${altSubSets}` +
                `, configs = ${reach}` +
                `, predict = ${predictedAlt}, allSubsetsConflict = ` +
                `${PredictionMode.allSubsetsConflict(altSubSets)}, conflictingAlts = ${this.getConflictingAlts(reach)}`;
            java.lang.System.out.println(S`${text}`);
        }

        if (predictedAlt !== ATN.INVALID_ALT_NUMBER) {
            // NO CONFLICT, UNIQUELY PREDICTED ALT
            D.isAcceptState = true;
            D.configs.uniqueAlt = predictedAlt;
            D.prediction = predictedAlt;
        } else {
            if (PredictionMode.hasSLLConflictTerminatingPrediction(this.mode, reach)) {
                // MORE THAN ONE VIABLE ALTERNATIVE
                D.configs.conflictingAlts = this.getConflictingAlts(reach);
                D.requiresFullContext = true;
                // in SLL-only mode, we will stop at this state and return the minimum alt
                D.isAcceptState = true;
                D.prediction = D.configs.conflictingAlts.nextSetBit(0);
            }
        }

        if (D.isAcceptState && D.configs.hasSemanticContext) {
            this.predicateDFAState(D, this.atn.getDecisionState(dfa.decision)!);
            if (D.predicates !== null) {
                D.prediction = ATN.INVALID_ALT_NUMBER;
            }
        }

        // all adds to dfa are done after we've created full D state
        return this.addDFAEdge(dfa, previousD, t, D);
    };

    protected predicateDFAState = (dfaState: DFAState, decisionState: DecisionState): void => {
        // We need to test all predicates, even in DFA states that
        // uniquely predict alternative.
        const altCount = decisionState.getNumberOfTransitions();

        // Update DFA so reach becomes accept state with (predicate,alt)
        // pairs if preds found for conflicting alts
        const altsToCollectPredsFrom = this.getConflictingAltsOrUniqueAlt(dfaState.configs);
        const altToPred = this.getPredsForAmbigAlts(altsToCollectPredsFrom, dfaState.configs, altCount);
        if (altToPred !== null) {
            dfaState.predicates = this.getPredicatePredictions(altsToCollectPredsFrom, altToPred);
            dfaState.prediction = ATN.INVALID_ALT_NUMBER; // make sure we use preds
        } else {
            // There are preds in configs but they might go away
            // when OR'd together like {p}? || NONE == NONE. If neither
            // alt has preds, resolve to min alt
            dfaState.prediction = altsToCollectPredsFrom.nextSetBit(0);
        }
    };

    // comes back with reach.uniqueAlt set to a valid alt
    protected execATNWithFullContext = (dfa: DFA,
        state: DFAState, // how far we got in SLL DFA before failing over
        s0: ATNConfigSet,
        input: TokenStream, startIndex: number,
        outerContext: ParserRuleContext): number => {
        if (ParserATNSimulator.debug || ParserATNSimulator.trace_atn_sim) {
            java.lang.System.out.println(S`execATNWithFullContext${s0}`);
        }
        const fullCtx = true;
        let foundExactAmbig = false;
        let reach: ATNConfigSet | null = null;
        let previous = s0;
        input.seek(startIndex);
        let t: number = input.LA(1);
        let predictedAlt: number;
        while (true) { // while more work
            reach = this.computeReachSet(previous, t, fullCtx);
            if (reach === null) {
                // if any configs in previous dipped into outer context, that
                // means that input up to t actually finished entry rule
                // at least for LL decision. Full LL doesn't dip into outer
                // so don't need special case.
                // We will get an error no matter what so delay until after
                // decision; better error message. Also, no reachable target
                // ATN states in SLL implies LL will also get nowhere.
                // If conflict in states that dip out, choose min since we
                // will get error no matter what.
                const e: NoViableAltException = this.noViableAlt(input, outerContext, previous, startIndex);
                input.seek(startIndex);
                const alt = this.getSynValidOrSemInvalidAltThatFinishedDecisionEntryRule(previous, outerContext);
                if (alt !== ATN.INVALID_ALT_NUMBER) {
                    return alt;
                }
                throw e;
            }

            const altSubSets: java.util.Collection<java.util.BitSet> = PredictionMode.getConflictingAltSubsets(reach);
            if (ParserATNSimulator.debug) {
                const text = `LL altSubSets = ${altSubSets}` +
                    `, predict = ` + PredictionMode.getUniqueAlt(altSubSets) +
                    `, resolvesToJustOneViableAlt = ` +
                    PredictionMode.resolvesToJustOneViableAlt(altSubSets);

                java.lang.System.out.println(S`${text}`);
            }

            reach.uniqueAlt = ParserATNSimulator.getUniqueAlt(reach);
            // unique prediction?
            if (reach.uniqueAlt !== ATN.INVALID_ALT_NUMBER) {
                predictedAlt = reach.uniqueAlt;
                break;
            }
            if (this.mode !== PredictionMode.LL_EXACT_AMBIG_DETECTION) {
                predictedAlt = PredictionMode.resolvesToJustOneViableAlt(altSubSets);
                if (predictedAlt !== ATN.INVALID_ALT_NUMBER) {
                    break;
                }
            } else {
                // In exact ambiguity mode, we never try to terminate early.
                // Just keeps scarfing until we know what the conflict is
                if (PredictionMode.allSubsetsConflict(altSubSets) &&
                    PredictionMode.allSubsetsEqual(altSubSets)) {
                    foundExactAmbig = true;
                    predictedAlt = PredictionMode.getSingleViableAlt(altSubSets);
                    break;
                }
                // else there are multiple non-conflicting subsets or
                // we're not sure what the ambiguity is yet.
                // So, keep going.
            }

            previous = reach;
            if (t !== IntStream.EOF) {
                input.consume();
                t = input.LA(1);
            }
        }

        // If the configuration set uniquely predicts an alternative,
        // without conflict, then we know that it's a full LL decision
        // not SLL.
        if (reach.uniqueAlt !== ATN.INVALID_ALT_NUMBER) {
            this.reportContextSensitivity(dfa, predictedAlt, reach, startIndex, input.index());

            return predictedAlt;
        }

        // We do not check predicates here because we have checked them
        // on-the-fly when doing full context prediction.

        /*
        In non-exact ambiguity detection mode, we might	actually be able to
        detect an exact ambiguity, but I'm not going to spend the cycles
        needed to check. We only emit ambiguity warnings in exact ambiguity
        mode.

        For example, we might know that we have conflicting configurations.
        But, that does not mean that there is no way forward without a
        conflict. It's possible to have nonconflicting alt subsets as in:

           LL altSubSets=[{1, 2}, {1, 2}, {1}, {1, 2}]

        from

           [(17,1,[5 $]), (13,1,[5 10 $]), (21,1,[5 10 $]), (11,1,[$]),
            (13,2,[5 10 $]), (21,2,[5 10 $]), (11,2,[$])]

        In this case, (17,1,[5 $]) indicates there is some next sequence that
        would resolve this without conflict to alternative 1. Any other viable
        next sequence, however, is associated with a conflict.  We stop
        looking for input because no amount of further lookahead will alter
        the fact that we should predict alternative 1.  We just can't say for
        sure that there is an ambiguity without looking further.
        */
        this.reportAmbiguity(dfa, state, startIndex, input.index(), foundExactAmbig,
            reach.getAlts(), reach);

        return predictedAlt;
    };

    protected computeReachSet = (closure: ATNConfigSet, t: number,
        fullCtx: boolean): ATNConfigSet | null => {
        if (ParserATNSimulator.debug) {

            java.lang.System.out.println(S`in computeReachSet, starting closure: ${closure}`);
        }

        if (this.mergeCache === null) {
            this.mergeCache = new DoubleKeyMap<PredictionContext, PredictionContext, PredictionContext>();
        }

        const intermediate: ATNConfigSet = new ATNConfigSet(fullCtx);

        /* Configurations already in a rule stop state indicate reaching the end
         * of the decision rule (local context) or end of the start rule (full
         * context). Once reached, these configurations are never updated by a
         * closure operation, so they are handled separately for the performance
         * advantage of having a smaller intermediate set when calling closure.
         *
         * For full-context reach operations, separate handling is required to
         * ensure that the alternative matching the longest overall sequence is
         * chosen when multiple such configurations can match the input.
         */
        let skippedStopStates: java.util.List<ATNConfig> | null = null;

        // First figure out where we can reach on input t
        for (const c of closure) {
            if (ParserATNSimulator.debug) {
                java.lang.System.out.println(S`testing${this.getTokenName(t)} at${c.toString()}`);
            }

            if (c.state instanceof RuleStopState) {
                /* assert c.context.isEmpty(); */
                if (fullCtx || t === IntStream.EOF) {
                    if (skippedStopStates === null) {
                        skippedStopStates = new java.util.ArrayList<ATNConfig>();
                    }

                    skippedStopStates.add(c);
                }

                continue;
            }

            const n = c.state.getNumberOfTransitions();
            for (let ti = 0; ti < n; ti++) {               // for each transition
                const trans = c.state.transition(ti);
                const target = this.getReachableTarget(trans, t);
                if (target !== null) {
                    intermediate.add(new ATNConfig(c, target), this.mergeCache);
                }
            }
        }

        // Now figure out where the reach operation can take us...

        let reach: ATNConfigSet | null = null;

        /* This block optimizes the reach operation for intermediate sets which
         * trivially indicate a termination state for the overall
         * adaptivePredict operation.
         *
         * The conditions assume that intermediate
         * contains all configurations relevant to the reach set, but this
         * condition is not true when one or more configurations have been
         * withheld in skippedStopStates, or when the current symbol is EOF.
         */
        if (skippedStopStates === null && t !== Token.EOF) {
            if (intermediate.size() === 1) {
                // Don't pursue the closure if there is just one state.
                // It can only have one alternative; just add to result
                // Also don't pursue the closure if there is unique alternative
                // among the configurations.
                reach = intermediate;
            } else {
                if (ParserATNSimulator.getUniqueAlt(intermediate) !== ATN.INVALID_ALT_NUMBER) {
                    // Also don't pursue the closure if there is unique alternative
                    // among the configurations.
                    reach = intermediate;
                }
            }

        }

        /* If the reach set could not be trivially determined, perform a closure
         * operation on the intermediate set to compute its initial value.
         */
        if (reach === null) {
            reach = new ATNConfigSet(fullCtx);
            const closureBusy: java.util.Set<ATNConfig> = new java.util.HashSet<ATNConfig>();
            const treatEofAsEpsilon: boolean = t === Token.EOF;
            for (const c of intermediate) {
                this.closure(c, reach, closureBusy, false, fullCtx, treatEofAsEpsilon);
            }
        }

        if (t === IntStream.EOF) {
            /* After consuming EOF no additional input is possible, so we are
             * only interested in configurations which reached the end of the
             * decision rule (local context) or end of the start rule (full
             * context). Update reach to contain only these configurations. This
             * handles both explicit EOF transitions in the grammar and implicit
             * EOF transitions following the end of the decision or start rule.
             *
             * When reach==intermediate, no closure operation was performed. In
             * this case, removeAllConfigsNotInRuleStopState needs to check for
             * reachable rule stop states as well as configurations already in
             * a rule stop state.
             *
             * This is handled before the configurations in skippedStopStates,
             * because any configurations potentially added from that list are
             * already guaranteed to meet this condition whether or not it's
             * required.
             */
            reach = this.removeAllConfigsNotInRuleStopState(reach, reach === intermediate);
        }

        /* If skippedStopStates is not null, then it contains at least one
         * configuration. For full-context reach operations, these
         * configurations reached the end of the start rule, in which case we
         * only add them back to reach if no configuration during the current
         * closure operation reached such a state. This ensures adaptivePredict
         * chooses an alternative matching the longest overall sequence when
         * multiple alternatives are viable.
         */
        if (skippedStopStates !== null && (!fullCtx || !PredictionMode.hasConfigInRuleStopState(reach))) {
            /* assert !skippedStopStates.isEmpty(); */
            for (const c of skippedStopStates) {
                reach.add(c, this.mergeCache);
            }
        }

        if (ParserATNSimulator.trace_atn_sim) {
            java.lang.System.out.println(S`computeReachSet${closure} -> ${reach}`);
        }

        if (reach.isEmpty()) {
            return null;
        }

        return reach;
    };

    /**
     * Return a configuration set containing only the configurations from
     * {@code configs} which are in a {@link RuleStopState}. If all
     * configurations in {@code configs} are already in a rule stop state, this
     * method simply returns {@code configs}.
     *
     * <p>When {@code lookToEndOfRule} is true, this method uses
     * {@link ATN#nextTokens} for each configuration in {@code configs} which is
     * not already in a rule stop state to see if a rule stop state is reachable
     * from the configuration via epsilon-only transitions.</p>
     *
     * @param configs the configuration set to update
     * @param lookToEndOfRule when true, this method checks for rule stop states
     * reachable by epsilon-only transitions from each configuration in
     * {@code configs}.
     *
      @returns `configs` if all configurations in {@code configs} are in a
     * rule stop state, otherwise return a new configuration set containing only
     * the configurations from {@code configs} which are in a rule stop state
     */
    protected removeAllConfigsNotInRuleStopState = (configs: ATNConfigSet, lookToEndOfRule: boolean): ATNConfigSet => {
        if (PredictionMode.allConfigsInRuleStopStates(configs)) {
            return configs;
        }

        const result: ATNConfigSet = new ATNConfigSet(configs.fullCtx);
        for (const config of configs) {
            if (config.state instanceof RuleStopState) {
                result.add(config, this.mergeCache);
                continue;
            }

            if (lookToEndOfRule && config.state.onlyHasEpsilonTransitions()) {
                const nextTokens: IntervalSet = this.atn.nextTokens(config.state);
                if (nextTokens.contains(Token.EPSILON)) {
                    const endOfRuleState: ATNState = this.atn.ruleToStopState[config.state.ruleIndex];
                    result.add(new ATNConfig(config, endOfRuleState), this.mergeCache);
                }
            }
        }

        return result;
    };

    protected computeStartState = (p: ATNState | null, ctx: RuleContext, fullCtx: boolean): ATNConfigSet => {
        // always at least the implicit call to start rule
        const initialContext = PredictionContext.fromRuleContext(this.atn, ctx);
        const configs = new ATNConfigSet(fullCtx);

        if (ParserATNSimulator.trace_atn_sim) {
            const text = this.parser !== null ? initialContext.toString(this.parser) : "null";
            java.lang.System.out.println(S`computeStartState from ATN state ${p} ${initialContext} = ${text}`);
        }

        if (p) {
            for (let i = 0; i < p.getNumberOfTransitions(); i++) {
                const target: ATNState = p.transition(i).target;
                const c: ATNConfig = new ATNConfig(target, i + 1, initialContext);
                const closureBusy: java.util.Set<ATNConfig> = new java.util.HashSet<ATNConfig>();
                this.closure(c, configs, closureBusy, true, fullCtx, false);
            }
        }

        return configs;
    };

    /* parrt internal source brain dump that doesn't mess up
     * external API spec.
        context-sensitive in that they can only be properly evaluated
        in the context of the proper prec argument. Without pruning,
        these predicates are normal predicates evaluated when we reach
        conflict state (or unique prediction). As we cannot evaluate
        these predicates out of context, the resulting conflict leads
        to full LL evaluation and nonlinear prediction which shows up
        very clearly with fairly large expressions.

        Example grammar:

        e : e '*' e
          | e '+' e
          | INT
          ;

        We convert that to the following:

        e[int prec]
            :   INT
                ( {3>=prec}? '*' e[4]
                | {2>=prec}? '+' e[3]
                )*
            ;

        The (..)* loop has a decision for the inner block as well as
        an enter or exit decision, which is what concerns us here. At
        the 1st + of input 1+2+3, the loop entry sees both predicates
        and the loop exit also sees both predicates by falling off the
        edge of e.  This is because we have no stack information with
        SLL and find the follow of e, which will hit the return states
        inside the loop after e[4] and e[3], which brings it back to
        the enter or exit decision. In this case, we know that we
        cannot evaluate those predicates because we have fallen off
        the edge of the stack and will in general not know which prec
        parameter is the right one to use in the predicate.

        Because we have special information, that these are precedence
        predicates, we can resolve them without failing over to full
        LL despite their context sensitive nature. We make an
        assumption that prec[-1] <= prec[0], meaning that the current
        precedence level is greater than or equal to the precedence
        level of recursive invocations above us in the stack. For
        example, if predicate {3>=prec}? is true of the current prec,
        then one option is to enter the loop to match it now. The
        other option is to exit the loop and the left recursive rule
        to match the current operator in rule invocation further up
        the stack. But, we know that all of those prec are lower or
        the same value and so we can decide to enter the loop instead
        of matching it later. That means we can strip out the other
        configuration for the exit branch.

        So imagine we have (14,1,$,{2>=prec}?) and then
        (14,2,$-dipsIntoOuterContext,{2>=prec}?). The optimization
        allows us to collapse these two configurations. We know that
        if {2>=prec}? is true for the current prec parameter, it will
        also be true for any prec from an invoking e call, indicated
        by dipsIntoOuterContext. As the predicates are both true, we
        have the option to evaluate them early in the decision start
        state. We do this by stripping both predicates and choosing to
        enter the loop as it is consistent with the notion of operator
        precedence. It's also how the full LL conflict resolution
        would work.

        The solution requires a different DFA start state for each
        precedence level.

        The basic filter mechanism is to remove configurations of the
        form (p, 2, pi) if (p, 1, pi) exists for the same p and pi. In
        other words, for the same ATN state and predicate context,
        remove any configuration associated with an exit branch if
        there is a configuration associated with the enter branch.

        It's also the case that the filter evaluates precedence
        predicates and resolves conflicts according to precedence
        levels. For example, for input 1+2+3 at the first +, we see
        prediction filtering

        [(11,1,[$],{3>=prec}?), (14,1,[$],{2>=prec}?), (5,2,[$],up=1),
         (11,2,[$],up=1), (14,2,[$],up=1)],hasSemanticContext=true,dipsIntoOuterContext

        to

        [(11,1,[$]), (14,1,[$]), (5,2,[$],up=1)],dipsIntoOuterContext

        This filters because {3>=prec}? evaluates to true and collapses
        (11,1,[$],{3>=prec}?) and (11,2,[$],up=1) since early conflict
        resolution based upon rules of operator precedence fits with
        our usual match first alt upon conflict.

        We noticed a problem where a recursive call resets precedence
        to 0. Sam's fix: each config has flag indicating if it has
        returned from an expr[0] call. then just don't filter any
        config with that flag set. flag is carried along in
        closure(). so to avoid adding field, set bit just under sign
        bit of dipsIntoOuterContext (SUPPRESS_PRECEDENCE_FILTER).
        With the change you filter "unless (p, 2, pi) was reached
        after leaving the rule stop state of the LR rule containing
        state p, corresponding to a rule invocation with precedence
        level 0"
     */

    /**
     * This method transforms the start state computed by
     * {@link #computeStartState} to the special start state used by a
     * precedence DFA for a particular precedence value. The transformation
     * process applies the following changes to the start state's configuration
     * set.
     *
     * <ol>
     * <li>Evaluate the precedence predicates for each configuration using
     * {@link SemanticContext#evalPrecedence}.</li>
     * <li>When {@link ATNConfig#isPrecedenceFilterSuppressed} is {@code false},
     * remove all configurations which predict an alternative greater than 1,
     * for which another configuration that predicts alternative 1 is in the
     * same ATN state with the same prediction context. This transformation is
     * valid for the following reasons:
     * <ul>
     * <li>The closure block cannot contain any epsilon transitions which bypass
     * the body of the closure, so all states reachable via alternative 1 are
     * part of the precedence alternatives of the transformed left-recursive
     * rule.</li>
     * <li>The "primary" portion of a left recursive rule cannot contain an
     * epsilon transition, so the only way an alternative other than 1 can exist
     * in a state that is also reachable via alternative 1 is by nesting calls
     * to the left-recursive rule, with the outer calls not being at the
     * preferred precedence level. The
     * {@link ATNConfig#isPrecedenceFilterSuppressed} property marks ATN
     * configurations which do not meet this condition, and therefore are not
     * eligible for elimination during the filtering process.</li>
     * </ul>
     * </li>
     * </ol>
     *
     * <p>
     * The prediction context must be considered by this filter to address
     * situations like the following.
     * </p>
     * <code>
     * <pre>
     * grammar TA;
     * prog: statement* EOF;
     * statement: letterA | statement letterA 'b' ;
     * letterA: 'a';
     * </pre>
     * </code>
     * <p>
     * If the above grammar, the ATN state immediately before the token
     * reference {@code 'a'} in {@code letterA} is reachable from the left edge
     * of both the primary and closure blocks of the left-recursive rule
     * {@code statement}. The prediction context associated with each of these
     * configurations distinguishes between them, and prevents the alternative
     * which stepped out to {@code prog} (and then back in to {@code statement}
     * from being eliminated by the filter.
     * </p>
     *
     * @param configs The configuration set computed by
     * {@link #computeStartState} as the start state for the DFA.
      @returns The transformed configuration set representing the start state
     * for a precedence DFA at a particular precedence level (determined by
     * calling {@link Parser#getPrecedence}).
     */
    protected applyPrecedenceFilter = (configs: ATNConfigSet): ATNConfigSet => {
        const statesFromAlt1 = new java.util.HashMap<number, PredictionContext>();
        const configSet = new ATNConfigSet(configs.fullCtx);
        for (const config of configs) {
            // handle alt 1 first
            if (config.alt !== 1) {
                continue;
            }

            const updatedContext = config.semanticContext.evalPrecedence(this.parser!, this._outerContext!);
            if (updatedContext === null) {
                // the configuration was eliminated
                continue;
            }

            statesFromAlt1.put(config.state.stateNumber, config.context);
            if (updatedContext !== config.semanticContext) {
                configSet.add(new ATNConfig(config, updatedContext), this.mergeCache);
            } else {
                configSet.add(config, this.mergeCache);
            }
        }

        for (const config of configs) {
            if (config.alt === 1) {
                // already handled
                continue;
            }

            if (!config.isPrecedenceFilterSuppressed()) {
                /* In the future, this elimination step could be updated to also
                 * filter the prediction context for alternatives predicting alt>1
                 * (basically a graph subtraction algorithm).
                 */
                const context = statesFromAlt1.get(config.state.stateNumber);
                if (context !== null && context.equals(config.context)) {
                    // eliminated
                    continue;
                }
            }

            configSet.add(config, this.mergeCache);
        }

        return configSet;
    };

    protected getReachableTarget = (trans: Transition, ttype: number): ATNState | null => {
        if (trans.matches(ttype, 0, this.atn.maxTokenType)) {
            return trans.target;
        }

        return null;
    };

    protected getPredsForAmbigAlts = (ambigAlts: java.util.BitSet,
        configs: ATNConfigSet,
        altCount: number): SemanticContext[] | null => {

        // REACH=[1|1|[]|0:0, 1|2|[]|0:1]
        /* altToPred starts as an array of all null contexts. The entry at index i
         * corresponds to alternative i. altToPred[i] may have one of three values:
         *   1. null: no ATNConfig c is found such that c.alt==i
         *   2. SemanticContext.NONE: At least one ATNConfig c exists such that
         *      c.alt==i and c.semanticContext==SemanticContext.NONE. In other words,
         *      alt i has at least one unpredicated config.
         *   3. Non-NONE Semantic Context: There exists at least one, and for all
         *      ATNConfig c such that c.alt==i, c.semanticContext!=SemanticContext.NONE.
         *
         * From this, it is clear that NONE||anything==NONE.
         */
        let altToPred: SemanticContext[] | null = new Array<SemanticContext>(altCount + 1);
        for (const c of configs) {
            if (ambigAlts.get(c.alt)) {
                altToPred[c.alt] = SemanticContext.or(altToPred[c.alt], c.semanticContext);
            }
        }

        let nPredAlts = 0;
        for (let i = 1; i <= altCount; i++) {
            if (altToPred[i] === null) {
                altToPred[i] = SemanticContext.Empty;
            } else {
                if (altToPred[i] !== SemanticContext.Empty) {
                    nPredAlts++;
                }
            }
        }

        // non ambig alts are null in altToPred
        if (nPredAlts === 0) {
            altToPred = null;
        }

        if (ParserATNSimulator.debug) {
            java.lang.System.out.println(S`getPredsForAmbigAlts result ${java.util.Arrays.toString(altToPred)}`);
        }

        return altToPred;
    };

    protected getPredicatePredictions = (ambigAlts: java.util.BitSet,
        altToPred: SemanticContext[]): DFAState.PredPrediction[] | null => {
        const pairs: java.util.List<DFAState.PredPrediction> = new java.util.ArrayList<DFAState.PredPrediction>();
        let containsPredicate = false;
        for (let i = 1; i < altToPred.length; i++) {
            const pred: SemanticContext = altToPred[i];

            // unpredicated is indicated by SemanticContext.NONE
            /* assert pred != null; */

            if (ambigAlts !== null && ambigAlts.get(i)) {
                pairs.add(new DFAState.PredPrediction(pred, i));
            }
            if (pred !== SemanticContext.Empty) {
                containsPredicate = true;
            }

        }

        if (!containsPredicate) {
            return null;
        }

        //		System.out.println(Arrays.toString(altToPred)+"->"+pairs);
        return pairs.toArray(new Array<DFAState.PredPrediction>(0));
    };

    /**
     * This method is used to improve the localization of error messages by
     * choosing an alternative rather than throwing a
     * {@link NoViableAltException} in particular prediction scenarios where the
     * {@link #ERROR} state was reached during ATN simulation.
     *
     * <p>
     * The default implementation of this method uses the following
     * algorithm to identify an ATN configuration which successfully parsed the
     * decision entry rule. Choosing such an alternative ensures that the
     * {@link ParserRuleContext} returned by the calling rule will be complete
     * and valid, and the syntax error will be reported later at a more
     * localized location.</p>
     *
     * <ul>
     * <li>If a syntactically valid path or paths reach the end of the decision rule and
     * they are semantically valid if predicated, return the min associated alt.</li>
     * <li>Else, if a semantically invalid but syntactically valid path exist
     * or paths exist, return the minimum associated alt.
     * </li>
     * <li>Otherwise, return {@link ATN#INVALID_ALT_NUMBER}.</li>
     * </ul>
     *
     * <p>
     * In some scenarios, the algorithm described above could predict an
     * alternative which will result in a {@link FailedPredicateException} in
     * the parser. Specifically, this could occur if the <em>only</em> configuration
     * capable of successfully parsing to the end of the decision rule is
     * blocked by a semantic predicate. By choosing this alternative within
     * {@link #adaptivePredict} instead of throwing a
     * {@link NoViableAltException}, the resulting
     * {@link FailedPredicateException} in the parser will identify the specific
     * predicate which is preventing the parser from successfully parsing the
     * decision rule, which helps developers identify and correct logic errors
     * in semantic predicates.
     * </p>
     *
     * @param configs The ATN configurations which were valid immediately before
     * the {@link #ERROR} state was reached
     * @param outerContext The is the \gamma_0 initial parser context from the paper
     * or the parser stack at the instant before prediction commences.
     *
      @returns The value to return from {@link #adaptivePredict}, or
     * {@link ATN#INVALID_ALT_NUMBER} if a suitable alternative was not
     * identified and {@link #adaptivePredict} should report an error instead.
     */
    protected getSynValidOrSemInvalidAltThatFinishedDecisionEntryRule = (configs: ATNConfigSet,
        outerContext: ParserRuleContext): number => {
        const sets = this.splitAccordingToSemanticValidity(configs, outerContext);
        const semValidConfigs: ATNConfigSet = sets.a;
        const semInvalidConfigs: ATNConfigSet = sets.b;
        let alt: number = this.getAltThatFinishedDecisionEntryRule(semValidConfigs);
        if (alt !== ATN.INVALID_ALT_NUMBER) { // semantically/syntactically viable path exists
            return alt;
        }

        // Is there a syntactically valid path with a failed pred?
        if (semInvalidConfigs.size() > 0) {
            alt = this.getAltThatFinishedDecisionEntryRule(semInvalidConfigs);
            if (alt !== ATN.INVALID_ALT_NUMBER) { // syntactically viable path exists
                return alt;
            }
        }

        return ATN.INVALID_ALT_NUMBER;
    };

    protected getAltThatFinishedDecisionEntryRule = (configs: ATNConfigSet): number => {
        const alts: IntervalSet = new IntervalSet();
        for (const c of configs) {
            if (c.getOuterContextDepth() > 0 || (c.state instanceof RuleStopState && c.context.hasEmptyPath())) {
                alts.add(c.alt);
            }
        }
        if (alts.size() === 0) {
            return ATN.INVALID_ALT_NUMBER;
        }

        return alts.getMinElement();
    };

    /**
     * Walk the list of configurations and split them according to
     *  those that have preds evaluating to true/false.  If no pred, assume
     *  true pred and include in succeeded set.  Returns Pair of sets.
     *
     *  Create a new set so as not to alter the incoming parameter.
     *
     *  Assumption: the input stream has been restored to the starting point
     *  prediction, which is where predicates need to evaluate.
     *
     * @param configs tbd
     * @param outerContext tbd
     *
     * @returns tbd
     */
    protected splitAccordingToSemanticValidity = (configs: ATNConfigSet,
        outerContext: ParserRuleContext): Pair<ATNConfigSet, ATNConfigSet> => {
        const succeeded = new ATNConfigSet(configs.fullCtx);
        const failed = new ATNConfigSet(configs.fullCtx);
        for (const c of configs) {
            if (c.semanticContext !== SemanticContext.Empty) {
                const predicateEvaluationResult =
                    this.evalSemanticContext(c.semanticContext, outerContext, c.alt, configs.fullCtx);
                if (predicateEvaluationResult) {
                    succeeded.add(c, null);
                } else {
                    failed.add(c, null);
                }
            } else {
                succeeded.add(c, null);
            }
        }

        return new Pair<ATNConfigSet, ATNConfigSet>(succeeded, failed);
    };

    /**
     * Look through a list of predicate/alt pairs, returning alts for the
     *  pairs that win. A {@code NONE} predicate indicates an alt containing an
     *  unpredicated config which behaves as "always true." If !complete
     *  then we stop at the first predicate that evaluates to true. This
     *  includes pairs with null predicates.
     */
    protected evalSemanticContext(predPredictions: DFAState.PredPrediction[], outerContext: ParserRuleContext,
        complete: boolean): java.util.BitSet;
    /**
     * Evaluate a semantic context within a specific parser context.
     *
     * <p>
     * This method might not be called for every semantic context evaluated
     * during the prediction process. In particular, we currently do not
     * evaluate the following but it may change in the future:</p>
     *
     * <ul>
     * <li>Precedence predicates (represented by
     * {@link SemanticContext.PrecedencePredicate}) are not currently evaluated
     * through this method.</li>
     * <li>Operator predicates (represented by {@link SemanticContext.AND} and
     * {@link SemanticContext.OR}) are evaluated as a single semantic
     * context, rather than evaluating the operands individually.
     * Implementations which require evaluation results from individual
     * predicates should override this method to explicitly handle evaluation of
     * the operands within operator predicates.</li>
     * </ul>
     *
     * @param pred The semantic context to evaluate
     * @param parserCallStack The parser context in which to evaluate the
     * semantic context
     * @param alt The alternative which is guarded by {@code pred}
     * @param fullCtx {@code true} if the evaluation is occurring during LL
     * prediction; otherwise, {@code false} if the evaluation is occurring
     * during SLL prediction
     */
    protected evalSemanticContext(pred: SemanticContext, parserCallStack: ParserRuleContext, alt: number,
        fullCtx: boolean): boolean;
    protected evalSemanticContext(predPredictionsOrPred: DFAState.PredPrediction[] | SemanticContext,
        outerContextOrParserCallStack: ParserRuleContext, completeOrAlt: boolean | number,
        fullCtx?: boolean): java.util.BitSet | boolean {

        if (predPredictionsOrPred instanceof SemanticContext) {
            return predPredictionsOrPred.eval(this.parser!, outerContextOrParserCallStack);
        } else {
            const complete = completeOrAlt as boolean;
            const predictions = new java.util.BitSet();
            for (const pair of predPredictionsOrPred) {
                if (pair.pred === SemanticContext.Empty) {
                    predictions.set(pair.alt);
                    if (!complete) {
                        break;
                    }
                    continue;
                }

                fullCtx = false; // in dfa
                const predicateEvaluationResult = this.evalSemanticContext(pair.pred, outerContextOrParserCallStack,
                    pair.alt, fullCtx);
                if (ParserATNSimulator.debug || ParserATNSimulator.dfa_debug) {
                    java.lang.System.out.println(S`eval pred ${pair} = ${predicateEvaluationResult}`);
                }

                if (predicateEvaluationResult) {
                    if (ParserATNSimulator.debug || ParserATNSimulator.dfa_debug) {
                        java.lang.System.out.println(S`PREDICT${pair.alt}`);
                    }

                    predictions.set(pair.alt);
                    if (!complete) {
                        break;
                    }
                }
            }

            return predictions;
        }
    }

    /* TODO: If we are doing predicates, there is no point in pursuing
         closure operations if we reach a DFA state that uniquely predicts
         alternative. We will not be caching that DFA state and it is a
         waste to pursue the closure. Might have to advance when we do
         ambig detection thought :(
          */

    protected closure = (config: ATNConfig,
        configs: ATNConfigSet,
        closureBusy: java.util.Set<ATNConfig>,
        collectPredicates: boolean,
        fullCtx: boolean,
        treatEofAsEpsilon: boolean): void => {
        const initialDepth = 0;
        this.closureCheckingStopState(config, configs, closureBusy, collectPredicates,
            fullCtx,
            initialDepth, treatEofAsEpsilon);
        /* assert !fullCtx || !configs.dipsIntoOuterContext; */
    };

    protected closureCheckingStopState = (config: ATNConfig,
        configs: ATNConfigSet,
        closureBusy: java.util.Set<ATNConfig>,
        collectPredicates: boolean,
        fullCtx: boolean,
        depth: number,
        treatEofAsEpsilon: boolean): void => {
        if (ParserATNSimulator.trace_atn_sim) {
            java.lang.System.out.println(S`closure(${config.toString(true)})`);
        }

        if (config.state instanceof RuleStopState) {
            // We hit rule end. If we have context info, use it
            // run thru all possible stack tops in ctx
            if (!config.context.isEmpty()) {
                for (let i = 0; i < config.context.size(); i++) {
                    if (config.context.getReturnState(i) === PredictionContext.EMPTY_RETURN_STATE) {
                        if (fullCtx) {
                            configs.add(
                                new ATNConfig(config, config.state, EmptyPredictionContext.Instance), this.mergeCache);
                            continue;
                        } else {
                            // we have no context info, just chase follow links (if greedy)
                            if (ParserATNSimulator.debug) {
                                java.lang.System.out.println(
                                    S`FALLING off rule${this.getRuleName(config.state.ruleIndex)}`);
                            }

                            this.closure_(config, configs, closureBusy, collectPredicates,
                                fullCtx, depth, treatEofAsEpsilon);
                        }
                        continue;
                    }
                    const returnState = this.atn.states.get(config.context.getReturnState(i))!;
                    const newContext = config.context.getParent(i); // "pop" return state
                    const c: ATNConfig = new ATNConfig(returnState, config.alt, newContext,
                        config.semanticContext);
                    // While we have context to pop back from, we may have
                    // gotten that context AFTER having falling off a rule.
                    // Make sure we track that we are now out of context.
                    //
                    // This assignment also propagates the
                    // isPrecedenceFilterSuppressed() value to the new
                    // configuration.
                    c.reachesIntoOuterContext = config.reachesIntoOuterContext;
                    /* assert depth > Integer.MIN_VALUE; */
                    this.closureCheckingStopState(c, configs, closureBusy, collectPredicates,
                        fullCtx, depth - 1, treatEofAsEpsilon);
                }

                return;
            } else {
                if (fullCtx) {
                    // reached end of start rule
                    configs.add(config, this.mergeCache);

                    return;
                } else {
                    // else if we have no context info, just chase follow links (if greedy)
                    if (ParserATNSimulator.debug) {
                        java.lang.System.out.println(S`FALLING off rule${this.getRuleName(config.state.ruleIndex)}`);
                    }

                }
            }

        }

        this.closure_(config, configs, closureBusy, collectPredicates,
            fullCtx, depth, treatEofAsEpsilon);
    };

    /**
     * Do the actual work of walking epsilon edges
     *
     * @param config tbd
     * @param configs tbd
     * @param closureBusy tbd
     * @param collectPredicates tbd
     * @param fullCtx tbd
     * @param depth tbd
     * @param treatEofAsEpsilon tbd
     */
    // eslint-disable-next-line @typescript-eslint/naming-convention
    protected closure_ = (config: ATNConfig,
        configs: ATNConfigSet,
        closureBusy: java.util.Set<ATNConfig>,
        collectPredicates: boolean,
        fullCtx: boolean,
        depth: number,
        treatEofAsEpsilon: boolean): void => {
        const p: ATNState = config.state;
        // optimization
        if (!p.onlyHasEpsilonTransitions()) {
            configs.add(config, this.mergeCache);
            // make sure to not return here, because EOF transitions can act as
            // both epsilon transitions and non-epsilon transitions.
            //            if ( debug ) System.out.println("added config "+configs);
        }

        for (let i = 0; i < p.getNumberOfTransitions(); i++) {
            if (i === 0 && this.canDropLoopEntryEdgeInLeftRecursiveRule(config)) {
                continue;
            }

            const t = p.transition(i);
            const continueCollecting: boolean =
                !(t instanceof ActionTransition) && collectPredicates;
            const c = this.getEpsilonTarget(config, t, continueCollecting,
                depth === 0, fullCtx, treatEofAsEpsilon);
            if (c !== null) {
                let newDepth: number = depth;
                if (config.state instanceof RuleStopState) {
                    /* assert !fullCtx; */
                    // target fell off end of rule; mark resulting c as having dipped into outer context
                    // We can't get here if incoming config was rule stop and we had context
                    // track how far we dip into outer context.  Might
                    // come in handy and we avoid evaluating context dependent
                    // preds if this is > 0.

                    if (this._dfa !== null && this._dfa.isPrecedenceDfa()) {
                        const outermostPrecedenceReturn: number = (t as EpsilonTransition).outermostPrecedenceReturn();
                        if (outermostPrecedenceReturn === this._dfa.atnStartState?.ruleIndex) {
                            c.setPrecedenceFilterSuppressed(true);
                        }
                    }

                    c.reachesIntoOuterContext++;

                    if (!closureBusy.add(c)) {
                        // avoid infinite recursion for right-recursive rules
                        continue;
                    }

                    // TODO: can remove? only care when we add to set per middle of this method
                    configs.dipsIntoOuterContext = true;

                    newDepth--;
                    if (ParserATNSimulator.debug) {
                        java.lang.System.out.println(S`dips into outer ctx: ${c}`);
                    }

                } else {
                    if (!t.isEpsilon() && !closureBusy.add(c)) {
                        // avoid infinite recursion for EOF* and EOF+
                        continue;
                    }

                    if (t instanceof RuleTransition) {
                        // latch when newDepth goes negative - once we step out of the entry context we can't return
                        if (newDepth >= 0) {
                            newDepth++;
                        }
                    }
                }

                this.closureCheckingStopState(c, configs, closureBusy, continueCollecting,
                    fullCtx, newDepth, treatEofAsEpsilon);
            }
        }
    };

    /**
     * Implements first-edge (loop entry) elimination as an optimization
     *  during closure operations.  See antlr/antlr4#1398.
     *
     * The optimization is to avoid adding the loop entry config when
     * the exit path can only lead back to the same
     * StarLoopEntryState after popping context at the rule end state
     * (traversing only epsilon edges, so we're still in closure, in
     * this same rule).
     *
     * We need to detect any state that can reach loop entry on
     * epsilon w/o exiting rule. We don't have to look at FOLLOW
     * links, just ensure that all stack tops for config refer to key
     * states in LR rule.
     *
     * To verify we are in the right situation we must first check
     * closure is at a StarLoopEntryState generated during LR removal.
     * Then we check that each stack top of context is a return state
     * from one of these cases:
     *
     *   1. 'not' expr, '(' type ')' expr. The return state points at loop entry state
     *   2. expr op expr. The return state is the block end of internal block of (...)*
     *   3. 'between' expr 'and' expr. The return state of 2nd expr reference.
     *      That state points at block end of internal block of (...)*.
     *   4. expr '?' expr ':' expr. The return state points at block end,
     *      which points at loop entry state.
     *
     * If any is true for each stack top, then closure does not add a
     * config to the current config set for edge[0], the loop entry branch.
     *
     *  Conditions fail if any context for the current config is:
     *
     *   a. empty (we'd fall out of expr to do a global FOLLOW which could
     *      even be to some weird spot in expr) or,
     *   b. lies outside of expr or,
     *   c. lies within expr but at a state not the BlockEndState
     *   generated during LR removal
     *
     * Do we need to evaluate predicates ever in closure for this case?
     *
     * No. Predicates, including precedence predicates, are only
     * evaluated when computing a DFA start state. I.e., only before
     * the lookahead (but not parser) consumes a token.
     *
     * There are no epsilon edges allowed in LR rule alt blocks or in
     * the "primary" part (ID here). If closure is in
     * StarLoopEntryState any lookahead operation will have consumed a
     * token as there are no epsilon-paths that lead to
     * StarLoopEntryState. We do not have to evaluate predicates
     * therefore if we are in the generated StarLoopEntryState of a LR
     * rule. Note that when making a prediction starting at that
     * decision point, decision d=2, compute-start-state performs
     * closure starting at edges[0], edges[1] emanating from
     * StarLoopEntryState. That means it is not performing closure on
     * StarLoopEntryState during compute-start-state.
     *
     * How do we know this always gives same prediction answer?
     *
     * Without predicates, loop entry and exit paths are ambiguous
     * upon remaining input +b (in, say, a+b). Either paths lead to
     * valid parses. Closure can lead to consuming + immediately or by
     * falling out of this call to expr back into expr and loop back
     * again to StarLoopEntryState to match +b. In this special case,
     * we choose the more efficient path, which is to take the bypass
     * path.
     *
     * The lookahead language has not changed because closure chooses
     * one path over the other. Both paths lead to consuming the same
     * remaining input during a lookahead operation. If the next token
     * is an operator, lookahead will enter the choice block with
     * operators. If it is not, lookahead will exit expr. Same as if
     * closure had chosen to enter the choice block immediately.
     *
     * Closure is examining one config (some loop entry state, some alt,
     * context) which means it is considering exactly one alt. Closure
     * always copies the same alt to any derived configs.
     *
     * How do we know this optimization doesn't mess up precedence in
     * our parse trees?
     *
     * Looking through expr from left edge of stat only has to confirm
     * that an input, say, a+b+c; begins with any valid interpretation
     * of an expression. The precedence actually doesn't matter when
     * making a decision in stat seeing through expr. It is only when
     * parsing rule expr that we must use the precedence to get the
     * right interpretation and, hence, parse tree.
     *
     *
     * @param config tbd
     *
     * @returns tbd
     */
    protected canDropLoopEntryEdgeInLeftRecursiveRule = (config: ATNConfig): boolean => {
        const p: ATNState = config.state;
        // First check to see if we are in StarLoopEntryState generated during
        // left-recursion elimination. For efficiency, also check if
        // the context has an empty stack case. If so, it would mean
        // global FOLLOW so we can't perform optimization
        if (p.getStateType() !== ATNState.STAR_LOOP_ENTRY ||
            !(p as StarLoopEntryState).isPrecedenceDecision || // Are we the special loop entry/exit state?
            config.context.isEmpty() ||                      // If SLL wildcard
            config.context.hasEmptyPath()) {
            return false;
        }

        // Require all return states to return back to the same rule
        // that p is in.
        const numCtxs: number = config.context.size();
        for (let i = 0; i < numCtxs; i++) { // for each stack context
            const returnState = this.atn.states.get(config.context.getReturnState(i))!;
            if (returnState.ruleIndex !== p.ruleIndex) {
                return false;
            }

        }

        const decisionStartState = p.transition(0).target as BlockStartState;
        const blockEndStateNum = decisionStartState.endState!.stateNumber;
        const blockEndState = this.atn.states.get(blockEndStateNum) as BlockEndState;

        // Verify that the top of each stack context leads to loop entry/exit
        // state through epsilon edges and w/o leaving rule.
        for (let i = 0; i < numCtxs; i++) {                           // for each stack context
            const returnStateNumber = config.context.getReturnState(i);
            const returnState = this.atn.states.get(returnStateNumber)!;
            // all states must have single outgoing epsilon edge
            if (returnState.getNumberOfTransitions() !== 1 ||
                !returnState.transition(0).isEpsilon()) {
                return false;
            }
            // Look for prefix op case like 'not expr', (' type ')' expr
            const returnStateTarget: ATNState = returnState.transition(0).target;
            if (returnState.getStateType() === ATNState.BLOCK_END && returnStateTarget === p) {
                continue;
            }
            // Look for 'expr op expr' or case where expr's return state is block end
            // of (...)* internal block; the block end points to loop back
            // which points to p but we don't need to check that
            if (returnState === blockEndState) {
                continue;
            }
            // Look for ternary expr ? expr : expr. The return state points at block end,
            // which points at loop entry state
            if (returnStateTarget === blockEndState) {
                continue;
            }
            // Look for complex prefix 'between expr and expr' case where 2nd expr's
            // return state points at block end state of (...)* internal block
            if (returnStateTarget.getStateType() === ATNState.BLOCK_END &&
                returnStateTarget.getNumberOfTransitions() === 1 &&
                returnStateTarget.transition(0).isEpsilon() &&
                returnStateTarget.transition(0).target === p) {
                continue;
            }

            // anything else ain't conforming
            return false;
        }

        return true;
    };

    protected getEpsilonTarget = (config: ATNConfig,
        t: Transition,
        collectPredicates: boolean,
        inContext: boolean,
        fullCtx: boolean,
        treatEofAsEpsilon: boolean): ATNConfig | null => {
        switch (t.getSerializationType()) {
            case Transition.RULE: {
                return this.ruleTransition(config, t as RuleTransition);
            }

            case Transition.PRECEDENCE: {
                return this.precedenceTransition(config, t as PrecedencePredicateTransition, collectPredicates,
                    inContext, fullCtx);
            }

            case Transition.PREDICATE: {
                return this.predTransition(config, t as PredicateTransition,
                    collectPredicates,
                    inContext,
                    fullCtx);
            }

            case Transition.ACTION: {
                return this.actionTransition(config, t as ActionTransition);
            }

            case Transition.EPSILON: {
                return new ATNConfig(config, t.target);
            }

            case Transition.ATOM:
            case Transition.RANGE:
            case Transition.SET: {
                // EOF transitions act like epsilon transitions after the first EOF
                // transition is traversed
                if (treatEofAsEpsilon) {
                    if (t.matches(Token.EOF, 0, 1)) {
                        return new ATNConfig(config, t.target);
                    }
                }

                return null;
            }

            default: {
                return null;
            }

        }
    };

    protected actionTransition = (config: ATNConfig, t: ActionTransition): ATNConfig => {
        if (ParserATNSimulator.debug) {
            java.lang.System.out.println(S`ACTION edge${t.ruleIndex}: ${t.actionIndex}`);
        }

        return new ATNConfig(config, t.target);
    };

    protected predTransition = (config: ATNConfig,
        pt: PredicateTransition,
        collectPredicates: boolean,
        inContext: boolean,
        fullCtx: boolean): ATNConfig | null => {
        if (ParserATNSimulator.debug) {
            const text = `PRED(collectPredicates = ${collectPredicates})${pt.ruleIndex}: ${pt.predIndex}, ` +
                `ctx dependent = ${pt.isCtxDependent}`;
            java.lang.System.out.println(S`${text}`);
            if (this.parser !== null) {
                java.lang.System.out.println(S`context surrounding pred is${this.parser.getRuleInvocationStack()}`);
            }
        }

        let c: ATNConfig | null = null;
        if (collectPredicates &&
            (!pt.isCtxDependent || (pt.isCtxDependent && inContext))) {
            if (fullCtx) {
                // In full context mode, we can evaluate predicates on-the-fly
                // during closure, which dramatically reduces the size of
                // the config sets. It also obviates the need to test predicates
                // later during conflict resolution.
                const currentPosition = this._input!.index();
                this._input!.seek(this._startIndex);
                const predSucceeds = this.evalSemanticContext(pt.getPredicate(), this._outerContext!, config.alt,
                    fullCtx);
                this._input!.seek(currentPosition);
                if (predSucceeds) {
                    c = new ATNConfig(config, pt.target); // no pred context
                }
            } else {
                const newSemCtx: SemanticContext =
                    SemanticContext.and(config.semanticContext, pt.getPredicate());
                c = new ATNConfig(config, pt.target, newSemCtx);
            }
        } else {
            c = new ATNConfig(config, pt.target);
        }

        if (ParserATNSimulator.debug) {
            java.lang.System.out.println(S`config from pred transition = ${c}`);
        }

        return c;
    };

    protected ruleTransition = (config: ATNConfig, t: RuleTransition): ATNConfig => {
        if (ParserATNSimulator.debug) {
            java.lang.System.out.println(S`CALL rule${this.getRuleName(t.target.ruleIndex)} , ctx = ${config.context}`);
        }

        const returnState = t.followState;
        const newContext = SingletonPredictionContext.create(config.context, returnState.stateNumber);

        return new ATNConfig(config, t.target, newContext);
    };

    /**
     * Gets a {@link BitSet} containing the alternatives in {@code configs}
     * which are part of one or more conflicting alternative subsets.
     *
     * @param configs The {@link ATNConfigSet} to analyze.
      @returns The alternatives in {@code configs} which are part of one or more
     * conflicting alternative subsets. If {@code configs} does not contain any
     * conflicting subsets, this method returns an empty {@link BitSet}.
     */
    protected getConflictingAlts = (configs: ATNConfigSet): java.util.BitSet => {
        const altSets = PredictionMode.getConflictingAltSubsets(configs);

        return PredictionMode.getAlts(altSets);
    };

    /**
     * Sam pointed out a problem with the previous definition, v3, of
     * ambiguous states. If we have another state associated with conflicting
     * alternatives, we should keep going. For example, the following grammar
     *
     * s : (ID | ID ID?) ';' ;
     *
     * When the ATN simulation reaches the state before ';', it has a DFA
     * state that looks like: [12|1|[], 6|2|[], 12|2|[]]. Naturally
     * 12|1|[] and 12|2|[] conflict, but we cannot stop processing this node
     * because alternative to has another way to continue, via [6|2|[]].
     * The key is that we have a single state that has config's only associated
     * with a single alternative, 2, and crucially the state transitions
     * among the configurations are all non-epsilon transitions. That means
     * we don't consider any conflicts that include alternative 2. So, we
     * ignore the conflict between alts 1 and 2. We ignore a set of
     * conflicting alts when there is an intersection with an alternative
     * associated with a single alt state in the state -> config-list map.
     *
     * It's also the case that we might have two conflicting configurations but
     * also a 3rd nonconflicting configuration for a different alternative:
     * [1|1|[], 1|2|[], 8|3|[]]. This can come about from grammar:
     *
     * a : A | A | A B ;
     *
     * After matching input A, we reach the stop state for rule A, state 1.
     * State 8 is the state right before B. Clearly alternatives 1 and 2
     * conflict and no amount of further lookahead will separate the two.
     * However, alternative 3 will be able to continue and so we do not
     * stop working on this state. In the previous example, we're concerned
     * with states associated with the conflicting alternatives. Here alt
     * 3 is not associated with the conflicting configs, but since we can continue
     * looking for input reasonably, I don't declare the state done. We
     * ignore a set of conflicting alts when we have an alternative
     * that we still need to pursue.
     *
     * @param configs tbd
     *
     * @returns tbd
     */
    protected getConflictingAltsOrUniqueAlt = (configs: ATNConfigSet): java.util.BitSet => {
        let conflictingAlts;
        if (configs.uniqueAlt !== ATN.INVALID_ALT_NUMBER) {
            conflictingAlts = new java.util.BitSet();
            conflictingAlts.set(configs.uniqueAlt);
        } else {
            conflictingAlts = configs.conflictingAlts;
        }

        return conflictingAlts!;
    };

    /**
     * Add an edge to the DFA, if possible. This method calls
     * {@link #addDFAState} to ensure the {@code to} state is present in the
     * DFA. If {@code from} is {@code null}, or if {@code t} is outside the
     * range of edges that can be represented in the DFA tables, this method
     * returns without adding the edge to the DFA.
     *
     * <p>If {@code to} is {@code null}, this method returns {@code null}.
     * Otherwise, this method returns the {@link DFAState} returned by calling
     * {@link #addDFAState} for the {@code to} state.</p>
     *
     * @param dfa The DFA
     * @param from The source state for the edge
     * @param t The input symbol
     * @param to The target state for the edge
     *
      @returns If {@code to} is {@code null}, this method returns {@code null};
     * otherwise this method returns the result of calling {@link #addDFAState}
     * on {@code to}
     */
    protected addDFAEdge = (dfa: DFA, from: DFAState, t: number, to: DFAState): DFAState => {
        if (ParserATNSimulator.debug) {
            java.lang.System.out.println(S`EDGE${from} -> ${to} upon${this.getTokenName(t)}`);
        }

        to = this.addDFAState(dfa, to); // used existing if possible not incoming
        if (from === null || t < -1 || t > this.atn.maxTokenType) {
            return to;
        }

        /* synchronized (from) */
        if (from.edges === null) {
            from.edges = new Array<DFAState>(this.atn.maxTokenType + 1 + 1);
            from.edges.fill(null);
        }

        from.edges[t + 1] = to; // connect

        if (ParserATNSimulator.debug) {
            const vocabulary = this.parser ? this.parser.getVocabulary() : VocabularyImpl.EMPTY_VOCABULARY;
            java.lang.System.out.println(S`DFA =\n${dfa.toString(vocabulary)}`);
        }

        return to;
    };

    /**
     * Add state {@code D} to the DFA if it is not already present, and return
     * the actual instance stored in the DFA. If a state equivalent to {@code D}
     * is already in the DFA, the existing state is returned. Otherwise this
     * method returns {@code D} after adding it to the DFA.
     *
     * <p>If {@code D} is {@link #ERROR}, this method returns {@link #ERROR} and
     * does not change the DFA.</p>
     *
     * @param dfa The dfa
     * @param state The DFA state to add
      @returns The state stored in the DFA. This will be either the existing
     * state if {@code D} is already in the DFA, or {@code D} itself if the
     * state was not already present.
     */
    protected addDFAState = (dfa: DFA, state: DFAState): DFAState => {
        if (state === ATNSimulator.ERROR) {
            return state;
        }

		/* synchronized (dfa.states) */ {
            const existing = dfa.states.get(state);

            if (existing !== null) {
                if (ParserATNSimulator.trace_atn_sim) {
                    java.lang.System.out.println(S`addDFAState${state} exists`);
                }

                return existing;
            }

            state.stateNumber = dfa.states.size();

            if (!state.configs.isReadonly()) {
                state.configs.optimizeConfigs(this);
                state.configs.setReadonly(true);
            }

            if (ParserATNSimulator.trace_atn_sim) {
                java.lang.System.out.println(S`addDFAState new ${state}`);
            }

            dfa.states.put(state, state);

            return state;
        }
    };

    protected reportAttemptingFullContext = (dfa: DFA, conflictingAlts: java.util.BitSet | null,
        configs: ATNConfigSet, startIndex: number, stopIndex: number): void => {
        if (ParserATNSimulator.debug || ParserATNSimulator.retry_debug) {
            const interval = Interval.of(startIndex, stopIndex);
            const text = `reportAttemptingFullContext decision = ` + dfa.decision + `: ` + configs +
                `, input = ` + this.parser?.getTokenStream()?.getText(interval);
            java.lang.System.out.println(S`${text}`);
        }

        if (this.parser !== null) {
            this.parser.getErrorListenerDispatch()
                .reportAttemptingFullContext?.(this.parser, dfa, startIndex, stopIndex, conflictingAlts, configs);
        }

    };

    protected reportContextSensitivity = (dfa: DFA, prediction: number, configs: ATNConfigSet,
        startIndex: number, stopIndex: number): void => {
        if (ParserATNSimulator.debug || ParserATNSimulator.retry_debug) {
            const interval = Interval.of(startIndex, stopIndex);
            const text = `reportContextSensitivity decision = ` + dfa.decision + S`: ` + configs +
                `, input = ` + this.parser?.getTokenStream()?.getText(interval);
            java.lang.System.out.println(S`${text}`);
        }

        if (this.parser !== null) {
            this.parser.getErrorListenerDispatch().reportContextSensitivity?.(this.parser, dfa, startIndex, stopIndex,
                prediction, configs);
        }
    };

    /**
     * If context sensitive parsing, we know it's ambiguity not conflict if we reach here. We test by covering
     * all possible lookahead sets. If we find any conflict, we report ambiguity. If we don't find anything,
     * we report conflict.
     *
     * @param dfa The decision DFA where the ambiguity was identified during SLL prediction.
     * @param state The final DFA state identifying the ambiguous alternatives.
     * @param startIndex The input index where the ambiguity was identified.
     * @param stopIndex The input index where the ambiguity was identified.
     * @param exact {@code true} if the ambiguity is exactly known, otherwise {@code false}.
     * @param ambigAlts The potentially ambiguous alternatives.
     * @param configs The ATN configuration set where the ambiguity was identified.
     */
    protected reportAmbiguity = (dfa: DFA,
        state: DFAState | null, // the DFA state from execATN() that had SLL conflicts
        startIndex: number, stopIndex: number,
        exact: boolean,
        ambigAlts: java.util.BitSet | null,
        configs: ATNConfigSet): void => {
        if (ParserATNSimulator.debug || ParserATNSimulator.retry_debug) {
            const interval = Interval.of(startIndex, stopIndex);
            const output = "reportAmbiguity" +
                ambigAlts + ": " + configs +
                ", input = " + this.parser!.getTokenStream()!.getText(interval);
            java.lang.System.out.println(S`${output}`);
        }

        if (this.parser !== null) {
            this.parser.getErrorListenerDispatch().reportAmbiguity?.(this.parser, dfa, startIndex, stopIndex,
                exact, ambigAlts, configs);
        }
    };
}
