/* java2ts: keep */

/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/* eslint-disable no-underscore-dangle */

import { java } from "jree";
import { AmbiguityInfo } from "./AmbiguityInfo";
import { ATNConfigSet } from "./ATNConfigSet";
import { ATNSimulator } from "./ATNSimulator";
import { ContextSensitivityInfo } from "./ContextSensitivityInfo";
import { DecisionInfo } from "./DecisionInfo";
import { ErrorInfo } from "./ErrorInfo";
import { LookaheadEventInfo } from "./LookaheadEventInfo";
import { ParserATNSimulator } from "./ParserATNSimulator";
import { PredicateEvalInfo } from "./PredicateEvalInfo";
import { SemanticContext } from "./SemanticContext";
import { Parser } from "../Parser";
import { ParserRuleContext } from "../ParserRuleContext";
import { TokenStream } from "../TokenStream";
import { DFA } from "../dfa/DFA";
import { DFAState } from "../dfa/DFAState";

/**
 *
 */
export class ProfilingATNSimulator extends ParserATNSimulator {
    protected readonly decisions: DecisionInfo[] = [];
    protected numDecisions: number;

    protected _sllStopIndex = 0;
    protected _llStopIndex = 0;

    protected currentDecision = 0;
    protected currentState: DFAState | null = null;

    /**
     * At the point of LL failover, we record how SLL would resolve the conflict so that
     *  we can determine whether or not a decision / input pair is context-sensitive.
     *  If LL gives a different result than SLL's predicted alternative, we have a
     *  context sensitivity for sure. The converse is not necessarily true, however.
     *  It's possible that after conflict resolution chooses minimum alternatives,
     *  SLL could get the same answer as LL. Regardless of whether or not the result indicates
     *  an ambiguity, it is not treated as a context sensitivity because LL prediction
     *  was not required in order to produce a correct prediction for this decision and input sequence.
     *  It may in fact still be a context sensitivity but we don't know by looking at the
     *  minimum alternatives for the current input.
     */
    protected conflictingAltResolvedBySLL = 0;

    public constructor(parser: Parser) {
        super(parser,
            parser.getInterpreter()!.atn,
            parser.getInterpreter()!.decisionToDFA,
            parser.getInterpreter()!.sharedContextCache);

        this.numDecisions = this.atn.decisionToState.size();
        for (let i = 0; i < this.numDecisions; i++) {
            this.decisions.push(new DecisionInfo(i));
        }
    }

    public override adaptivePredict = (input: TokenStream, decision: number, outerContext: ParserRuleContext): number => {
        try {
            this._sllStopIndex = -1;
            this._llStopIndex = -1;
            this.currentDecision = decision;
            const start = java.lang.System.nanoTime(); // expensive but useful info
            const alt = super.adaptivePredict(input, decision, outerContext);
            const stop = java.lang.System.nanoTime();
            this.decisions[decision].timeInPrediction += BigInt(stop - start);
            this.decisions[decision].invocations++;

            const SLL_k = BigInt(this._sllStopIndex - this._startIndex + 1);
            this.decisions[decision].SLL_TotalLook += SLL_k;

            if (this.decisions[decision].SLL_MinLook === 0n || this.decisions[decision].SLL_MinLook > SLL_k) {
                this.decisions[decision].SLL_MinLook === SLL_k;
            }

            if (SLL_k > this.decisions[decision].SLL_MaxLook) {
                this.decisions[decision].SLL_MaxLook = SLL_k;
                this.decisions[decision].SLL_MaxLookEvent =
                    new LookaheadEventInfo(decision, null, alt, input, this._startIndex, this._sllStopIndex, false);
            }

            if (this._llStopIndex >= 0) {
                const LL_k = BigInt(this._llStopIndex - this._startIndex + 1);
                this.decisions[decision].LL_TotalLook += LL_k;
                if (this.decisions[decision].LL_MinLook === 0n || this.decisions[decision].LL_MinLook > LL_k) {
                    this.decisions[decision].LL_MinLook === LL_k;
                }

                if (LL_k > this.decisions[decision].LL_MaxLook) {
                    this.decisions[decision].LL_MaxLook = LL_k;
                    this.decisions[decision].LL_MaxLookEvent =
                        new LookaheadEventInfo(decision, null, alt, input, this._startIndex, this._llStopIndex, true);
                }
            }

            return alt;
        } finally {
            this.currentDecision = -1;
        }
    };

    public getDecisionInfo = (): DecisionInfo[] => {
        return this.decisions;
    };

    public getCurrentState = (): DFAState | null => {
        return this.currentState;
    };

    protected override getExistingTargetState = (previousD: DFAState | null, t: number): DFAState | null => {
        // this method is called after each time the input position advances
        // during SLL prediction
        this._sllStopIndex = this._input!.index();

        const existingTargetState = super.getExistingTargetState(previousD, t);
        if (existingTargetState !== null) {
            this.decisions[this.currentDecision].SLL_DFATransitions++; // count only if we transition over a DFA state
            if (existingTargetState === ATNSimulator.ERROR) {
                this.decisions[this.currentDecision].errors.add(
                    new ErrorInfo(this.currentDecision, previousD!.configs, this._input, this._startIndex,
                        this._sllStopIndex, false),
                );
            }
        }

        this.currentState = existingTargetState;

        return existingTargetState;
    };

    protected override computeTargetState = (dfa: DFA, previousD: DFAState, t: number): DFAState => {
        const state = super.computeTargetState(dfa, previousD, t);
        this.currentState = state;

        return state;
    };

    protected override computeReachSet = (closure: ATNConfigSet, t: number, fullCtx: boolean): ATNConfigSet | null => {
        if (fullCtx) {
            // this method is called after each time the input position advances
            // during full context prediction
            this._llStopIndex = this._input!.index();
        }

        const reachConfigs = super.computeReachSet(closure, t, fullCtx);
        if (fullCtx) {
            this.decisions[this.currentDecision].LL_ATNTransitions++; // count computation even if error
            if (reachConfigs !== null) {
                //
            } else { // no reach on current lookahead symbol. ERROR.
                // TODO: does not handle delayed errors per getSynValidOrSemInvalidAltThatFinishedDecisionEntryRule()
                this.decisions[this.currentDecision].errors.add(
                    new ErrorInfo(this.currentDecision, closure, this._input, this._startIndex, this._llStopIndex,
                        true),
                );
            }
        } else {
            this.decisions[this.currentDecision].SLL_ATNTransitions++;
            if (reachConfigs !== null) {
                //
            } else { // no reach on current lookahead symbol. ERROR.
                this.decisions[this.currentDecision].errors.add(
                    new ErrorInfo(this.currentDecision, closure, this._input, this._startIndex, this._sllStopIndex,
                        false),
                );
            }
        }

        return reachConfigs;
    };

    protected override evalSemanticContext(predPredictions: DFAState.PredPrediction[], outerContext: ParserRuleContext,
        complete: boolean): java.util.BitSet;
    protected override evalSemanticContext(pred: SemanticContext, parserCallStack: ParserRuleContext, alt: number,
        fullCtx: boolean): boolean;
    protected override evalSemanticContext(predPredictionsOrPred: DFAState.PredPrediction[] | SemanticContext,
        outerContextOrParserCallStack: ParserRuleContext, completeOrAlt: boolean | number,
        fullCtx?: boolean): java.util.BitSet | boolean {

        let result;
        if (predPredictionsOrPred instanceof SemanticContext) {
            result = super.evalSemanticContext(predPredictionsOrPred, outerContextOrParserCallStack,
                completeOrAlt as number, fullCtx!);
        } else {
            result = super.evalSemanticContext(predPredictionsOrPred, outerContextOrParserCallStack,
                completeOrAlt as boolean).size > 0;
        }

        if (!(predPredictionsOrPred instanceof SemanticContext.PrecedencePredicate)) {
            const fullContext = this._llStopIndex >= 0;
            const stopIndex = fullContext ? this._llStopIndex : this._sllStopIndex;
            this.decisions[this.currentDecision].predicateEvals.add(
                new PredicateEvalInfo(this.currentDecision, this._input, this._startIndex, stopIndex,
                    predPredictionsOrPred as SemanticContext, result, completeOrAlt as number, fullCtx!),
            );
        }

        return result;
    }

    protected override reportAttemptingFullContext = (dfa: DFA, conflictingAlts: java.util.BitSet | null,
        configs: ATNConfigSet, startIndex: number, stopIndex: number): void => {
        if (conflictingAlts !== null) {
            this.conflictingAltResolvedBySLL = conflictingAlts.nextSetBit(0);
        } else {
            this.conflictingAltResolvedBySLL = configs.getAlts().nextSetBit(0);
        }
        this.decisions[this.currentDecision].LL_Fallback++;
        super.reportAttemptingFullContext(dfa, conflictingAlts, configs, startIndex, stopIndex);
    };

    protected override reportContextSensitivity = (dfa: DFA, prediction: number, configs: ATNConfigSet, startIndex: number,
        stopIndex: number): void => {
        if (prediction !== this.conflictingAltResolvedBySLL) {
            this.decisions[this.currentDecision].contextSensitivities.add(
                new ContextSensitivityInfo(this.currentDecision, configs, this._input, startIndex, stopIndex),
            );
        }
        super.reportContextSensitivity(dfa, prediction, configs, startIndex, stopIndex);
    };

    protected override reportAmbiguity = (dfa: DFA, state: DFAState | null, startIndex: number, stopIndex: number,
        exact: boolean, ambigAlts: java.util.BitSet | null, configs: ATNConfigSet): void => {
        let prediction: number;
        if (ambigAlts !== null) {
            prediction = ambigAlts.nextSetBit(0);
        } else {
            prediction = configs.getAlts().nextSetBit(0);
        }

        if (configs.fullCtx && prediction !== this.conflictingAltResolvedBySLL) {
            // Even though this is an ambiguity we are reporting, we can
            // still detect some context sensitivities.  Both SLL and LL
            // are showing a conflict, hence an ambiguity, but if they resolve
            // to different minimum alternatives we have also identified a
            // context sensitivity.
            this.decisions[this.currentDecision].contextSensitivities.add(
                new ContextSensitivityInfo(this.currentDecision, configs, this._input, startIndex, stopIndex),
            );
        }
        this.decisions[this.currentDecision].ambiguities.add(
            new AmbiguityInfo(this.currentDecision, configs, ambigAlts,
                this._input, startIndex, stopIndex, configs.fullCtx),
        );
        super.reportAmbiguity(dfa, state, startIndex, stopIndex, exact, ambigAlts, configs);
    };

}
