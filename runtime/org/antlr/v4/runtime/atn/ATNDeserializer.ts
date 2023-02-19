/* java2ts: keep */

/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { java, S, JavaObject } from "jree";

import { ActionTransition } from "./ActionTransition";
import { ATN } from "./ATN";
import { ATNDeserializationOptions } from "./ATNDeserializationOptions";
import { ATNState } from "./ATNState";
import { ATNType } from "./ATNType";
import { AtomTransition } from "./AtomTransition";
import { BasicBlockStartState } from "./BasicBlockStartState";
import { BasicState } from "./BasicState";
import { BlockEndState } from "./BlockEndState";
import { BlockStartState } from "./BlockStartState";
import { DecisionState } from "./DecisionState";
import { EpsilonTransition } from "./EpsilonTransition";
import { LexerAction } from "./LexerAction";
import { LexerActionType } from "./LexerActionType";
import { LexerChannelAction } from "./LexerChannelAction";
import { LexerCustomAction } from "./LexerCustomAction";
import { LexerModeAction } from "./LexerModeAction";
import { LexerMoreAction } from "./LexerMoreAction";
import { LexerPopModeAction } from "./LexerPopModeAction";
import { LexerPushModeAction } from "./LexerPushModeAction";
import { LexerSkipAction } from "./LexerSkipAction";
import { LexerTypeAction } from "./LexerTypeAction";
import { LoopEndState } from "./LoopEndState";
import { NotSetTransition } from "./NotSetTransition";
import { PlusBlockStartState } from "./PlusBlockStartState";
import { PlusLoopbackState } from "./PlusLoopbackState";
import { PrecedencePredicateTransition } from "./PrecedencePredicateTransition";
import { PredicateTransition } from "./PredicateTransition";
import { RangeTransition } from "./RangeTransition";
import { RuleStartState } from "./RuleStartState";
import { RuleStopState } from "./RuleStopState";
import { RuleTransition } from "./RuleTransition";
import { SetTransition } from "./SetTransition";
import { StarBlockStartState } from "./StarBlockStartState";
import { StarLoopbackState } from "./StarLoopbackState";
import { StarLoopEntryState } from "./StarLoopEntryState";
import { TokensStartState } from "./TokensStartState";
import { Transition } from "./Transition";
import { WildcardTransition } from "./WildcardTransition";
import { Token } from "../Token";
import { IntegerList } from "../misc/IntegerList";
import { IntervalSet } from "../misc/IntervalSet";
import { Pair } from "../misc/Pair";

/**
 * Deserialize ATNs for JavaTarget; it's complicated by the fact that java requires
 *  that we serialize the list of integers as 16 bit characters in a string. Other
 *  targets will have an array of ints generated and can simply decode the ints
 *  back into an ATN.
 *
 * @author Sam Harwell
 */
export class ATNDeserializer extends JavaObject {
    public static readonly SERIALIZED_VERSION = 4;

    private readonly deserializationOptions: ATNDeserializationOptions;

    public constructor(deserializationOptions?: ATNDeserializationOptions) {
        super();
        this.deserializationOptions = deserializationOptions ?? ATNDeserializationOptions.getDefaultOptions();
    }

    /**
     * Given a list of integers representing a serialized ATN, encode values too large to fit into 15 bits
     *  as two 16bit values. We use the high bit (0x8000_0000) to indicate values requiring two 16 bit words.
     *  If the high bit is set, we grab the next value and combine them to get a 31-bit value. The possible
     *  input int values are [-1,0x7FFF_FFFF].
     *
     * 		| compression/encoding                         | uint16 count | type            |
     * 		| -------------------------------------------- | ------------ | --------------- |
     * 		| 0xxxxxxx xxxxxxxx                            | 1            | uint (15 bit)   |
     * 		| 1xxxxxxx xxxxxxxx yyyyyyyy yyyyyyyy          | 2            | uint (16+ bits) |
     * 		| 11111111 11111111 11111111 11111111          | 2            | int value -1    |
     *
     * 	This is only used (other than for testing) by {@link org.antlr.v4.codegen.model.SerializedJavaATN}
     * 	to encode ints as char values for the java target, but it is convenient to combine it with the
     * 	#decodeIntsEncodedAs16BitWords that follows as they are a pair (I did not want to introduce a new class
     * 	into the runtime). Used only for Java Target.
     *
     * @param data tbd
     *
     * @returns tbd
     */
    public static encodeIntsWith16BitWords = (data: IntegerList): IntegerList | null => {
        const data16: IntegerList = new IntegerList(Number((data.size() * 1.5)));
        for (let i = 0; i < data.size(); i++) {
            let v: number = data.get(i);
            if (v === -1) { // use two max uint16 for -1
                data16.add(0xFFFF);
                data16.add(0xFFFF);
            } else {
                if (v <= 0x7FFF) {
                    data16.add(v);
                } else { // v > 0x7FFF
                    if (v >= 0x7FFF_FFFF) {
                        // too big to fit in 15 bits + 16 bits? (+1 would be 8000_0000 which is bad encoding)
                        throw new java.lang.UnsupportedOperationException(
                            S`Serialized ATN data element[${i}] = ${v} doesn't fit in 31 bits`);
                    }
                    v = v & 0x7FFF_FFFF;			// strip high bit (sentinel) if set
                    data16.add((v >> 16) | 0x8000); // store high 15-bit word first and set high bit to say word follows
                    data16.add((v & 0xFFFF));       // then store lower 16-bit word
                }
            }

        }

        return data16;
    };

    /**
     * Convert a list of chars (16 uint) that represent a serialized and compressed list of ints for an ATN.
     *  This method pairs with {@link #encodeIntsWith16BitWords(IntegerList)} above. Used only for Java Target.
     *
     * @param data16 tbd
     * @param trimToSize tbd
     *
     * @returns tbd
     */
    public static decodeIntsEncodedAs16BitWords(data16: Uint16Array, trimToSize?: boolean): Int32Array {
        if (trimToSize === undefined) {
            return ATNDeserializer.decodeIntsEncodedAs16BitWords(data16, false);
        } else {
            // will be strictly smaller but we waste bit of space to avoid copying during initialization of parsers
            const data = new Int32Array(data16.length);
            let i = 0;
            let i2 = 0;
            while (i < data16.length) {
                const v = data16[i++];
                if ((v & 0x8000) === 0) { // hi bit not set? Implies 1-word value
                    data[i2++] = v; // 7 bit int
                } else { // hi bit set. Implies 2-word value
                    const vnext = data16[i++];
                    if (v === 0xFFFF && vnext === 0xFFFF) { // is it -1?
                        data[i2++] = -1;
                    } else { // 31-bit int
                        data[i2++] = ((v & 0x7FFF) << 16) | (vnext & 0xFFFF);
                    }
                }
            }

            if (trimToSize) {
                return java.util.Arrays.copyOf(data, i2);
            }

            return data;
        }

    }

    protected static toInt = (c: java.lang.char): number => {
        return c;
    };

    protected static toInt32(data: Uint16Array | Int32Array, offset: number): number {
        if (data instanceof Uint16Array) {
            return Number(data[offset]) | (Number(data[offset + 1]) << 16);
        } else {
            return data[offset] | (data[offset + 1] << 16);
        }
    }

    public deserialize(data: Uint16Array | Int32Array): ATN {
        if (data instanceof Uint16Array) {
            return this.deserialize(ATNDeserializer.decodeIntsEncodedAs16BitWords(data));
        } else {
            let p = 0;
            const version: number = data[p++];
            if (version !== ATNDeserializer.SERIALIZED_VERSION) {
                const reason = java.lang.String.format(java.util.Locale.getDefault(),
                    S`Could not deserialize ATN with version %d (expected %d).`, version,
                    ATNDeserializer.SERIALIZED_VERSION);
                throw new java.lang.UnsupportedOperationException(
                    new java.io.InvalidClassException(ATN.class.getName(), reason));
            }

            const grammarType = Object.values(ATNType)[data[p++]] as ATNType;
            const maxTokenType = data[p++];
            const atn = new ATN(grammarType, maxTokenType);

            //
            // STATES
            //
            const loopBackStateNumbers = new java.util.ArrayList<Pair<LoopEndState, number>>();
            const endStateNumbers = new java.util.ArrayList<Pair<BlockStartState, number>>();
            const nstates = data[p++];
            for (let i = 0; i < nstates; i++) {
                const stype = data[p++];
                // ignore bad type of states
                if (stype === ATNState.INVALID_TYPE) {
                    atn.addState(null);
                    continue;
                }

                const ruleIndex: number = data[p++];
                const s = this.stateFactory(stype, ruleIndex);
                if (stype === ATNState.LOOP_END) { // special case
                    const loopBackStateNumber: number = data[p++];
                    loopBackStateNumbers.add(new Pair(s as LoopEndState, loopBackStateNumber));
                } else {
                    if (s instanceof BlockStartState) {
                        const endStateNumber: number = data[p++];
                        endStateNumbers.add(new Pair(s, endStateNumber));
                    }
                }

                atn.addState(s);
            }

            // delay the assignment of loop back and end states until we know all the state instances
            // have been initialized
            for (const pair of loopBackStateNumbers) {
                pair.a.loopBackState = atn.states.get(pair.b);
            }

            for (const pair of endStateNumbers) {
                pair.a.endState = atn.states.get(pair.b) as BlockEndState;
            }

            const numNonGreedyStates: number = data[p++];
            for (let i = 0; i < numNonGreedyStates; i++) {
                const stateNumber: number = data[p++];
                (atn.states.get(stateNumber) as DecisionState).nonGreedy = true;
            }

            const numPrecedenceStates: number = data[p++];
            for (let i = 0; i < numPrecedenceStates; i++) {
                const stateNumber: number = data[p++];
                (atn.states.get(stateNumber) as RuleStartState).isLeftRecursiveRule = true;
            }

            //
            // RULES
            //
            const nrules = data[p++];
            if (atn.grammarType === ATNType.LEXER) {
                atn.ruleToTokenType = new Int32Array(nrules);
            }

            atn.ruleToStartState = new Array<RuleStartState>(nrules);
            for (let i = 0; i < nrules; i++) {
                const s: number = data[p++];
                const startState: RuleStartState = atn.states.get(s) as RuleStartState;
                atn.ruleToStartState[i] = startState;
                if (atn.grammarType === ATNType.LEXER) {
                    const tokenType: number = data[p++];
                    atn.ruleToTokenType[i] = tokenType;
                }
            }

            atn.ruleToStopState = new Array<RuleStopState>(nrules);
            for (const state of atn.states) {
                if (!(state instanceof RuleStopState)) {
                    continue;
                }

                const stopState: RuleStopState = state;
                atn.ruleToStopState[state.ruleIndex] = stopState;
                atn.ruleToStartState[state.ruleIndex].stopState = stopState;
            }

            //
            // MODES
            //
            const nmodes = data[p++];
            for (let i = 0; i < nmodes; i++) {
                const s: number = data[p++];
                atn.modeToStartState.add(atn.states.get(s) as TokensStartState);
            }

            //
            // SETS
            //
            const sets: java.util.List<IntervalSet> = new java.util.ArrayList<IntervalSet>();
            p = this.deserializeSets(data, p, sets);

            //
            // EDGES
            //
            const nedges: number = data[p++];
            for (let i = 0; i < nedges; i++) {
                const src: number = data[p];
                const trg: number = data[p + 1];
                const ttype: number = data[p + 2];
                const arg1: number = data[p + 3];
                const arg2: number = data[p + 4];
                const arg3: number = data[p + 5];
                const trans = this.edgeFactory(atn, ttype, src, trg, arg1, arg2, arg3, sets);
                const srcState = atn.states.get(src);
                if (srcState && trans) {
                    srcState.addTransition(trans);
                }
                p += 6;
            }

            // edges for rule stop states can be derived, so they aren't serialized
            for (const state of atn.states) {
                if (state) {
                    for (let i = 0; i < state.getNumberOfTransitions(); i++) {
                        const t = state.transition(i);
                        if (!(t instanceof RuleTransition)) {
                            continue;
                        }

                        const ruleTransition: RuleTransition = t;
                        let outermostPrecedenceReturn = -1;
                        if (atn.ruleToStartState[ruleTransition.target.ruleIndex].isLeftRecursiveRule) {
                            if (ruleTransition.precedence === 0) {
                                outermostPrecedenceReturn = ruleTransition.target.ruleIndex;
                            }
                        }

                        const returnTransition =
                            new EpsilonTransition(ruleTransition.followState, outermostPrecedenceReturn);
                        atn.ruleToStopState[ruleTransition.target.ruleIndex].addTransition(returnTransition);
                    }
                }
            }

            for (const state of atn.states) {
                if (state instanceof BlockStartState) {
                    // we need to know the end state to set its start state
                    if ((state).endState === null) {
                        throw new java.lang.IllegalStateException();
                    }

                    // block end states can only be associated to a single block start state
                    if ((state).endState.startState !== null) {
                        throw new java.lang.IllegalStateException();
                    }

                    (state).endState.startState = state;
                }

                if (state instanceof PlusLoopbackState) {
                    const loopbackState: PlusLoopbackState = state;
                    for (let i = 0; i < loopbackState.getNumberOfTransitions(); i++) {
                        const target: ATNState = loopbackState.transition(i).target;
                        if (target instanceof PlusBlockStartState) {
                            (target).loopBackState = loopbackState;
                        }
                    }
                } else {
                    if (state instanceof StarLoopbackState) {
                        const loopbackState: StarLoopbackState = state;
                        for (let i = 0; i < loopbackState.getNumberOfTransitions(); i++) {
                            const target: ATNState = loopbackState.transition(i).target;
                            if (target instanceof StarLoopEntryState) {
                                (target).loopBackState = loopbackState;
                            }
                        }
                    }
                }

            }

            //
            // DECISIONS
            //
            const ndecisions: number = data[p++];
            for (let i = 1; i <= ndecisions; i++) {
                const s: number = data[p++];
                const decState: DecisionState = atn.states.get(s) as DecisionState;
                atn.decisionToState.add(decState);
                decState.decision = i - 1;
            }

            //
            // LEXER ACTIONS
            //
            if (atn.grammarType === ATNType.LEXER) {
                atn.lexerActions = new Array<LexerAction>(data[p++]);
                for (let i = 0; i < atn.lexerActions.length; i++) {
                    const actionType = Object.values(LexerActionType)[data[p++]] as LexerActionType;
                    const data1: number = data[p++];
                    const data2: number = data[p++];

                    const lexerAction = this.lexerActionFactory(actionType, data1, data2);

                    atn.lexerActions[i] = lexerAction;
                }
            }

            this.markPrecedenceDecisions(atn);

            if (this.deserializationOptions.isVerifyATN()) {
                this.verifyATN(atn);
            }

            if (this.deserializationOptions.isGenerateRuleBypassTransitions() && atn.grammarType === ATNType.PARSER) {
                atn.ruleToTokenType = new Int32Array(atn.ruleToStartState.length);
                for (let i = 0; i < atn.ruleToStartState.length; i++) {
                    atn.ruleToTokenType[i] = atn.maxTokenType + i + 1;
                }

                for (let i = 0; i < atn.ruleToStartState.length; i++) {
                    const bypassStart: BasicBlockStartState = new BasicBlockStartState();
                    bypassStart.ruleIndex = i;
                    atn.addState(bypassStart);

                    const bypassStop: BlockEndState = new BlockEndState();
                    bypassStop.ruleIndex = i;
                    atn.addState(bypassStop);

                    bypassStart.endState = bypassStop;
                    atn.defineDecisionState(bypassStart);

                    bypassStop.startState = bypassStart;

                    let endState: ATNState | null;
                    let excludeTransition: Transition | null = null;
                    if (atn.ruleToStartState[i].isLeftRecursiveRule) {
                        // wrap from the beginning of the rule to the StarLoopEntryState
                        endState = null;
                        for (const state of atn.states) {
                            if (!state || state.ruleIndex !== i) {
                                continue;
                            }

                            if (!(state instanceof StarLoopEntryState)) {
                                continue;
                            }

                            const maybeLoopEndState = state.transition(state.getNumberOfTransitions() - 1).target;
                            if (!(maybeLoopEndState instanceof LoopEndState)) {
                                continue;
                            }

                            if (maybeLoopEndState.epsilonOnlyTransitions
                                && maybeLoopEndState.transition(0).target instanceof RuleStopState) {
                                endState = state;
                                break;
                            }
                        }

                        if (endState === null) {
                            throw new java.lang.UnsupportedOperationException(
                                S`Couldn't identify final state of the precedence rule prefix section.`);
                        } else {
                            excludeTransition = (endState as StarLoopEntryState).loopBackState?.transition(0) ?? null;
                        }
                    } else {
                        endState = atn.ruleToStopState[i];
                    }

                    // all non-excluded transitions that currently target end state need to target blockEnd instead
                    for (const state of atn.states) {
                        if (state) {
                            for (const transition of state.transitions) {
                                if (transition === excludeTransition) {
                                    continue;
                                }

                                if (transition.target === endState) {
                                    transition.target = bypassStop;
                                }
                            }
                        }
                    }

                    // all transitions leaving the rule start state need to leave blockStart instead
                    while (atn.ruleToStartState[i].getNumberOfTransitions() > 0) {
                        const transition = atn.ruleToStartState[i].removeTransition(atn.ruleToStartState[i]
                            .getNumberOfTransitions() - 1);
                        bypassStart.addTransition(transition);
                    }

                    // link the new states
                    atn.ruleToStartState[i].addTransition(new EpsilonTransition(bypassStart));
                    bypassStop.addTransition(new EpsilonTransition(endState));

                    const matchState: ATNState = new BasicState();
                    atn.addState(matchState);
                    matchState.addTransition(new AtomTransition(bypassStop, atn.ruleToTokenType[i]));
                    bypassStart.addTransition(new EpsilonTransition(matchState));
                }

                if (this.deserializationOptions.isVerifyATN()) {
                    // reverify after modification
                    this.verifyATN(atn);
                }
            }

            return atn;
        }

    }

    /**
     * Analyze the {@link StarLoopEntryState} states in the specified ATN to set
     * the {@link StarLoopEntryState#isPrecedenceDecision} field to the
     * correct value.
     *
     * @param atn The ATN.
     */
    protected markPrecedenceDecisions = (atn: ATN): void => {
        for (const state of atn.states) {
            if (!(state instanceof StarLoopEntryState)) {
                continue;
            }

            /* We analyze the ATN to determine if this ATN decision state is the
             * decision for the closure block that determines whether a
             * precedence rule should continue or complete.
             */
            if (atn.ruleToStartState[state.ruleIndex].isLeftRecursiveRule) {
                const maybeLoopEndState: ATNState = state.transition(state.getNumberOfTransitions() - 1).target;
                if (maybeLoopEndState instanceof LoopEndState) {
                    if (maybeLoopEndState.epsilonOnlyTransitions
                        && maybeLoopEndState.transition(0).target instanceof RuleStopState) {
                        (state).isPrecedenceDecision = true;
                    }
                }
            }
        }
    };

    protected verifyATN = (atn: ATN): void => {
        // verify assumptions
        for (const state of atn.states) {
            if (state === null) {
                continue;
            }

            this.checkCondition(state.onlyHasEpsilonTransitions() || state.getNumberOfTransitions() <= 1);

            if (state instanceof PlusBlockStartState) {
                this.checkCondition((state).loopBackState !== null);
            }

            if (state instanceof StarLoopEntryState) {
                const starLoopEntryState: StarLoopEntryState = state;
                this.checkCondition(starLoopEntryState.loopBackState !== null);
                this.checkCondition(starLoopEntryState.getNumberOfTransitions() === 2);

                if (starLoopEntryState.transition(0).target instanceof StarBlockStartState) {
                    this.checkCondition(starLoopEntryState.transition(1).target instanceof LoopEndState);
                    this.checkCondition(!starLoopEntryState.nonGreedy);
                } else {
                    if (starLoopEntryState.transition(0).target instanceof LoopEndState) {
                        this.checkCondition(starLoopEntryState.transition(1).target instanceof StarBlockStartState);
                        this.checkCondition(starLoopEntryState.nonGreedy);
                    } else {
                        throw new java.lang.IllegalStateException();
                    }
                }

            }

            if (state instanceof StarLoopbackState) {
                this.checkCondition(state.getNumberOfTransitions() === 1);
                this.checkCondition(state.transition(0).target instanceof StarLoopEntryState);
            }

            if (state instanceof LoopEndState) {
                this.checkCondition((state).loopBackState !== null);
            }

            if (state instanceof RuleStartState) {
                this.checkCondition((state).stopState !== null);
            }

            if (state instanceof BlockStartState) {
                this.checkCondition((state).endState !== null);
            }

            if (state instanceof BlockEndState) {
                this.checkCondition((state).startState !== null);
            }

            if (state instanceof DecisionState) {
                const decisionState: DecisionState = state;
                this.checkCondition(decisionState.getNumberOfTransitions() <= 1 || decisionState.decision >= 0);
            } else {
                this.checkCondition(state.getNumberOfTransitions() <= 1 || state instanceof RuleStopState);
            }
        }
    };

    protected checkCondition(condition: boolean, message?: java.lang.String): void {
        if (!condition) {
            if (message) {
                throw new java.lang.IllegalStateException(message);
            } else {
                throw new java.lang.IllegalStateException();
            }
        }
    }

    protected edgeFactory = (atn: ATN,
        type: number, src: number, trg: number,
        arg1: number, arg2: number, arg3: number,
        sets: java.util.List<IntervalSet>): Transition => {
        const target = atn.states.get(trg)!;
        switch (type) {
            case Transition.EPSILON: {
                return new EpsilonTransition(target);
            }

            case Transition.RANGE: {
                if (arg3 !== 0) {
                    return new RangeTransition(target, Token.EOF, arg2);
                } else {
                    return new RangeTransition(target, arg1, arg2);
                }
            }

            case Transition.RULE: {
                if (target) {
                    return new RuleTransition(atn.states.get(arg1) as RuleStartState, arg2, arg3, target);
                }

                break;
            }

            case Transition.PREDICATE: {
                const pt: PredicateTransition = new PredicateTransition(target, arg1, arg2, arg3 !== 0);

                return pt;
            }

            case Transition.PRECEDENCE: {
                return new PrecedencePredicateTransition(target, arg1);
            }

            case Transition.ATOM: {
                if (target) {
                    if (arg3 !== 0) {
                        return new AtomTransition(target, Token.EOF);
                    } else {
                        return new AtomTransition(target, arg1);
                    }
                }

                break;
            }

            case Transition.ACTION: {
                if (target) {
                    return new ActionTransition(target, arg1, arg2, arg3 !== 0);
                }

                break;
            }

            case Transition.SET: {
                return new SetTransition(target, sets.get(arg1));
            }

            case Transition.NOT_SET: {
                return new NotSetTransition(target, sets.get(arg1));
            }

            case Transition.WILDCARD: {
                return new WildcardTransition(target);
            }

            default:

        }

        throw new java.lang.IllegalArgumentException(S`The specified transition type is not valid.`);
    };

    protected stateFactory = (type: number, ruleIndex: number): ATNState | null => {
        let s: ATNState;
        switch (type) {
            case ATNState.INVALID_TYPE: {
                return null;
            }

            case ATNState.BASIC: {
                s = new BasicState(); break;
            }

            case ATNState.RULE_START: {
                s = new RuleStartState(); break;
            }

            case ATNState.BLOCK_START: {
                s = new BasicBlockStartState(); break;
            }

            case ATNState.PLUS_BLOCK_START: {
                s = new PlusBlockStartState(); break;
            }

            case ATNState.STAR_BLOCK_START: {
                s = new StarBlockStartState(); break;
            }

            case ATNState.TOKEN_START: {
                s = new TokensStartState(); break;
            }

            case ATNState.RULE_STOP: {
                s = new RuleStopState(); break;
            }

            case ATNState.BLOCK_END: {
                s = new BlockEndState(); break;
            }

            case ATNState.STAR_LOOP_BACK: {
                s = new StarLoopbackState(); break;
            }

            case ATNState.STAR_LOOP_ENTRY: {
                s = new StarLoopEntryState(); break;
            }

            case ATNState.PLUS_LOOP_BACK: {
                s = new PlusLoopbackState(); break;
            }

            case ATNState.LOOP_END: {
                s = new LoopEndState(); break;
            }

            default: {
                const message = java.lang.String.format(java.util.Locale.getDefault(),
                    S`The specified state type %d is not valid.`, type);
                throw new java.lang.IllegalArgumentException(message);
            }

        }

        s.ruleIndex = ruleIndex;

        return s;
    };

    protected lexerActionFactory = (type: LexerActionType, data1: number, data2: number): LexerAction => {
        switch (type) {
            case LexerActionType.CHANNEL: {
                return new LexerChannelAction(data1);
            }

            case LexerActionType.CUSTOM: {
                return new LexerCustomAction(data1, data2);
            }

            case LexerActionType.MODE: {
                return new LexerModeAction(data1);
            }

            case LexerActionType.MORE: {
                return LexerMoreAction.INSTANCE;
            }

            case LexerActionType.POP_MODE: {
                return LexerPopModeAction.INSTANCE;
            }

            case LexerActionType.PUSH_MODE: {
                return new LexerPushModeAction(data1);
            }

            case LexerActionType.SKIP: {
                return LexerSkipAction.INSTANCE;
            }

            case LexerActionType.TYPE: {
                return new LexerTypeAction(data1);
            }

            default: {
                throw new java.lang.IllegalArgumentException(java.lang.String.format(java.util.Locale.getDefault(),
                    S`The specified lexer action type %s is not valid.`, type));
            }
        }
    };

    private deserializeSets = (data: Int32Array, p: number, sets: java.util.List<IntervalSet>): number => {
        const nsets = data[p++];
        for (let i = 0; i < nsets; i++) {
            const nintervals = data[p];
            p++;

            const set = new IntervalSet();
            sets.add(set);

            const containsEof: boolean = data[p++] !== 0;
            if (containsEof) {
                set.add(-1);
            }

            for (let j = 0; j < nintervals; j++) {
                const a: number = data[p++];
                const b: number = data[p++];
                set.add(a, b);
            }
        }

        return p;
    };

}
