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

import { java, JavaObject } from "jree";

import { AbstractPredicateTransition } from "./AbstractPredicateTransition";
import { ATN } from "./ATN";
import { ATNConfig } from "./ATNConfig";
import { ATNState } from "./ATNState";
import { EmptyPredictionContext } from "./EmptyPredictionContext";
import { NotSetTransition } from "./NotSetTransition";
import { PredictionContext } from "./PredictionContext";
import { RuleStopState } from "./RuleStopState";
import { RuleTransition } from "./RuleTransition";
import { SingletonPredictionContext } from "./SingletonPredictionContext";
import { WildcardTransition } from "./WildcardTransition";
import { RuleContext } from "../RuleContext";
import { Token } from "../Token";
import { IntervalSet } from "../misc/IntervalSet";

export class LL1Analyzer extends JavaObject {
    /**
     * Special value added to the lookahead sets to indicate that we hit
     *  a predicate during analysis if {@code seeThruPreds==false}.
     */
    public static readonly HIT_PRED: number = Token.INVALID_TYPE;

    public readonly atn: ATN;

    public constructor(atn: ATN) {
        super();
        this.atn = atn;
    }

    /**
     * Calculates the SLL(1) expected lookahead set for each outgoing transition
     * of an {@link ATNState}. The returned array has one element for each
     * outgoing transition in {@code s}. If the closure from transition
     * <em>i</em> leads to a semantic predicate before matching a symbol, the
     * element at index <em>i</em> of the result will be {@code null}.
     *
     * @param s the ATN state
      @returns the expected symbols for each outgoing transition of {@code s}.
     */
    public getDecisionLookahead = (s: ATNState | null): Array<IntervalSet | null> | null => {
        if (s === null) {
            return null;
        }

        const look = new Array<IntervalSet | null>(s.getNumberOfTransitions());
        for (let alt = 0; alt < s.getNumberOfTransitions(); alt++) {
            const l = new IntervalSet();
            look[alt] = l;
            const lookBusy = new java.util.HashSet<ATNConfig>();
            const seeThruPreds = false; // fail to get lookahead upon pred
            this._LOOK(s.transition(alt).target, null, EmptyPredictionContext.Instance, l, lookBusy,
                new java.util.BitSet(), seeThruPreds, false);

            // Wipe out lookahead for this alternative if we found nothing
            // or we had a predicate when we !seeThruPreds
            if (look[alt]?.size() === 0 || look[alt]?.contains(LL1Analyzer.HIT_PRED)) {
                look[alt] = null;
            }
        }

        return look;
    };

    /**
     * Compute set of tokens that can follow {@code s} in the ATN in the
     * specified {@code ctx}.
     *
     * <p>If {@code ctx} is {@code null} and the end of the rule containing
     * {@code s} is reached, {@link Token#EPSILON} is added to the result set.
     * If {@code ctx} is not {@code null} and the end of the outermost rule is
     * reached, {@link Token#EOF} is added to the result set.</p>
     *
     * @param s the ATN state
     * @param ctx the complete parser context, or {@code null} if the context
     * should be ignored
     *
      @returns The set of tokens that can follow {@code s} in the ATN in the
     * specified {@code ctx}.
     */
    public LOOK(s: ATNState, ctx: RuleContext | null): IntervalSet;
    /**
     * Compute set of tokens that can follow {@code s} in the ATN in the
     * specified {@code ctx}.
     *
     * <p>If {@code ctx} is {@code null} and the end of the rule containing
     * {@code s} is reached, {@link Token#EPSILON} is added to the result set.
     * If {@code ctx} is not {@code null} and the end of the outermost rule is
     * reached, {@link Token#EOF} is added to the result set.</p>
     *
     * @param s the ATN state
     * @param stopState the ATN state to stop at. This can be a
     * {@link BlockEndState} to detect epsilon paths through a closure.
     * @param ctx the complete parser context, or {@code null} if the context
     * should be ignored
     *
      @returns The set of tokens that can follow {@code s} in the ATN in the
     * specified {@code ctx}.
     */
    public LOOK(s: ATNState, stopState: ATNState | null, ctx: RuleContext | null): IntervalSet;
    public LOOK(s: ATNState, ctxOrStopState: RuleContext | ATNState | null, ctx?: RuleContext | null): IntervalSet {
        let stop: ATNState | null = null;
        let context;
        if (ctxOrStopState instanceof ATNState) {
            stop = ctxOrStopState;
            context = ctx;
        } else {
            context = ctxOrStopState;
        }

        const r = new IntervalSet();
        const seeThruPreds = true; // ignore preds; get all lookahead
        const lookContext = context ? PredictionContext.fromRuleContext(s.atn!, context) : null;
        this._LOOK(s, stop, lookContext, r,
            new java.util.HashSet<ATNConfig>(), new java.util.BitSet(), seeThruPreds, true);

        return r;
    }

    /**
     * Compute set of tokens that can follow {@code s} in the ATN in the
     * specified {@code ctx}.
     *
     * <p>If {@code ctx} is {@code null} and {@code stopState} or the end of the
     * rule containing {@code s} is reached, {@link Token#EPSILON} is added to
     * the result set. If {@code ctx} is not {@code null} and {@code addEOF} is
     * {@code true} and {@code stopState} or the end of the outermost rule is
     * reached, {@link Token#EOF} is added to the result set.</p>
     *
     * @param s the ATN state.
     * @param stopState the ATN state to stop at. This can be a
     * {@link BlockEndState} to detect epsilon paths through a closure.
     * @param ctx The outer context, or {@code null} if the outer context should
     * not be used.
     * @param look The result lookahead set.
     * @param lookBusy A set used for preventing epsilon closures in the ATN
     * from causing a stack overflow. Outside code should pass
     * {@code new HashSet<ATNConfig>} for this argument.
     * @param calledRuleStack A set used for preventing left recursion in the
     * ATN from causing a stack overflow. Outside code should pass
     * {@code new BitSet()} for this argument.
     * @param seeThruPreds {@code true} to true semantic predicates as
     * implicitly {@code true} and "see through them", otherwise {@code false}
     * to treat semantic predicates as opaque and add {@link #HIT_PRED} to the
     * result if one is encountered.
     * @param addEOF Add {@link Token#EOF} to the result if the end of the
     * outermost context is reached. This parameter has no effect if {@code ctx}
     * is {@code null}.
     */
    protected _LOOK = (s: ATNState,
        stopState: ATNState | null,
        ctx: PredictionContext | null,
        look: IntervalSet,
        lookBusy: java.util.Set<ATNConfig>,
        calledRuleStack: java.util.BitSet,
        seeThruPreds: boolean, addEOF: boolean): void => {
        const c: ATNConfig = new ATNConfig(s, 0, ctx);
        if (!lookBusy.add(c)) {
            return;
        }

        if (s === stopState) {
            if (ctx === null) {
                look.add(Token.EPSILON);

                return;
            } else {
                if (ctx.isEmpty() && addEOF) {
                    look.add(Token.EOF);

                    return;
                }
            }

        }

        if (s instanceof RuleStopState) {
            if (ctx === null) {
                look.add(Token.EPSILON);

                return;
            } else {
                if (ctx.isEmpty() && addEOF) {
                    look.add(Token.EOF);

                    return;
                }
            }

            if (ctx !== EmptyPredictionContext.Instance) {
                // run thru all possible stack tops in ctx
                const removed: boolean = calledRuleStack.get(s.ruleIndex);
                try {
                    calledRuleStack.clear(s.ruleIndex);
                    for (let i = 0; i < ctx.size(); i++) {
                        const returnState = this.atn.states.get(ctx.getReturnState(i));
                        if (returnState) {
                            this._LOOK(returnState, stopState, ctx.getParent(i), look, lookBusy, calledRuleStack, seeThruPreds, addEOF);
                        }
                    }
                } finally {
                    if (removed) {
                        calledRuleStack.set(s.ruleIndex);
                    }
                }

                return;
            }
        }

        const n: number = s.getNumberOfTransitions();
        for (let i = 0; i < n; i++) {
            const t = s.transition(i);
            if (t instanceof RuleTransition) {
                if (calledRuleStack.get((t).target.ruleIndex)) {
                    continue;
                }

                const newContext: PredictionContext = SingletonPredictionContext.create(ctx, (t).followState.stateNumber);

                try {
                    calledRuleStack.set((t).target.ruleIndex);
                    this._LOOK(t.target, stopState, newContext, look, lookBusy, calledRuleStack, seeThruPreds, addEOF);
                } finally {
                    calledRuleStack.clear((t).target.ruleIndex);
                }
            } else {
                if (t instanceof AbstractPredicateTransition) {
                    if (seeThruPreds) {
                        this._LOOK(t.target, stopState, ctx, look, lookBusy, calledRuleStack, seeThruPreds, addEOF);
                    } else {
                        look.add(LL1Analyzer.HIT_PRED);
                    }
                } else {
                    if (t.isEpsilon()) {
                        this._LOOK(t.target, stopState, ctx, look, lookBusy, calledRuleStack, seeThruPreds, addEOF);
                    } else {
                        if (t instanceof WildcardTransition) {
                            look.addAll(IntervalSet.of(Token.MIN_USER_TOKEN_TYPE, this.atn.maxTokenType));
                        } else {
                            let set = t.label();
                            if (set !== null) {
                                if (t instanceof NotSetTransition) {
                                    set = set.complement(IntervalSet.of(Token.MIN_USER_TOKEN_TYPE, this.atn.maxTokenType));
                                }
                                look.addAll(set);
                            }
                        }
                    }
                }
            }
        }
    };
}
