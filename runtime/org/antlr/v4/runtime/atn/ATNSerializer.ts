/* java2ts: keep */

/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { java } from "../../../../../../lib/java/java";
import { ActionTransition } from "./ActionTransition";
import { ATN } from "./ATN";
import { ATNDeserializer } from "./ATNDeserializer";
import { ATNState } from "./ATNState";
import { ATNType } from "./ATNType";
import { AtomTransition } from "./AtomTransition";
import { BlockStartState } from "./BlockStartState";
import { DecisionState } from "./DecisionState";
import { LexerActionType } from "./LexerActionType";
import { LexerChannelAction } from "./LexerChannelAction";
import { LexerCustomAction } from "./LexerCustomAction";
import { LexerModeAction } from "./LexerModeAction";
import { LexerPushModeAction } from "./LexerPushModeAction";
import { LexerTypeAction } from "./LexerTypeAction";
import { LoopEndState } from "./LoopEndState";
import { PrecedencePredicateTransition } from "./PrecedencePredicateTransition";
import { PredicateTransition } from "./PredicateTransition";
import { RangeTransition } from "./RangeTransition";
import { RuleStartState } from "./RuleStartState";
import { RuleTransition } from "./RuleTransition";
import { SetTransition } from "./SetTransition";
import { Transition } from "./Transition";
import { Token } from "../Token";
import { IntegerList } from "../misc/IntegerList";
import { IntervalSet } from "../misc/IntervalSet";

import { JavaObject } from "../../../../../../lib/java/lang/Object";
import { S } from "../../../../../../lib/templates";

/**
 * This class represents a target neutral serializer for ATNs. An ATN is converted to a list of integers
 *  that can be converted back to and ATN. We compute the list of integers and then generate an array
 *  into the target language for a particular lexer or parser.  Java is a special case where we must
 *  generate strings instead of arrays, but that is handled outside of this class.
 *  See {@link ATNDeserializer#encodeIntsWith16BitWords(IntegerList)} and
 *  {@link org.antlr.v4.codegen.model.SerializedJavaATN}.
 */
export class ATNSerializer extends JavaObject {
    public atn: ATN;

    private readonly data = new IntegerList();
    /**
         Note that we use a LinkedHashMap as a set to maintain insertion order while deduplicating
        entries with the same key.
     */
    private readonly sets = new java.util.LinkedHashMap<IntervalSet, boolean>();
    private readonly nonGreedyStates = new IntegerList();
    private readonly precedenceStates = new IntegerList();

    public constructor(atn: ATN) {
        super();

        this.atn = atn;
    }

    public static getSerialized = (atn: ATN): IntegerList => {
        return new ATNSerializer(atn).serialize();
    };

    private static serializeSets = (data: IntegerList, sets: java.util.Collection<IntervalSet>): void => {
        const nSets = sets.size();
        data.add(nSets);

        for (const set of sets) {
            const containsEof = set.contains(Token.EOF);
            if (containsEof && set.getIntervals().get(0).b === Token.EOF) {
                data.add(set.getIntervals().size() - 1);
            } else {
                data.add(set.getIntervals().size());
            }

            data.add(containsEof ? 1 : 0);
            for (const interval of set.getIntervals()) {
                if (interval.a === Token.EOF) {
                    if (interval.b === Token.EOF) {
                        continue;
                    } else {
                        data.add(0);
                    }
                } else {
                    data.add(interval.a);
                }
                data.add(interval.b);
            }
        }
    };

    /**
     * Serialize state descriptors, edge descriptors, and decision&rarr;state map
     *  into list of ints.  Likely out of date, but keeping as it could be helpful:
     *
     *      SERIALIZED_VERSION
     *      UUID (2 longs)
     * 		grammar-type, (ANTLRParser.LEXER, ...)
     *  	max token type,
     *  	num states,
     *  	state-0-type ruleIndex, state-1-type ruleIndex, ... state-i-type ruleIndex optional-arg ...
     *  	num rules,
     *  	rule-1-start-state rule-1-args, rule-2-start-state  rule-2-args, ...
     *  	(args are token type,actionIndex in lexer else 0,0)
     *      num modes,
     *      mode-0-start-state, mode-1-start-state, ... (parser has 0 modes)
     *      num unicode-bmp-sets
     *      bmp-set-0-interval-count intervals, bmp-set-1-interval-count intervals, ...
     *      num unicode-smp-sets
     *      smp-set-0-interval-count intervals, smp-set-1-interval-count intervals, ...
     *	num total edges,
     *      src, trg, edge-type, edge arg1, optional edge arg2 (present always), ...
     *      num decisions,
     *      decision-0-start-state, decision-1-start-state, ...
     *
     *  Convenient to pack into unsigned shorts to make as Java string.
     *
     * @returns tbd
     */
    public serialize = (): IntegerList => {
        this.addPreamble();
        const nedges: number = this.addEdges();
        this.addNonGreedyStates();
        this.addPrecedenceStates();
        this.addRuleStatesAndLexerTokenTypes();
        this.addModeStartStates();

        const setIndices = this.addSets();
        this.addEdges(nedges, setIndices);
        this.addDecisionStartStates();
        this.addLexerActions();

        return this.data;
    };

    private addPreamble = (): void => {
        this.data.add(ATNDeserializer.SERIALIZED_VERSION);

        // convert grammar type to ATN const to avoid dependence on ANTLRParser
        this.data.add(this.atn.grammarType);
        this.data.add(this.atn.maxTokenType);
    };

    private addLexerActions = (): void => {
        if (this.atn.grammarType === ATNType.LEXER) {
            this.data.add(this.atn.lexerActions?.length ?? 0);
            for (const action of this.atn.lexerActions ?? []) {
                this.data.add(action.getActionType());
                switch (action.getActionType()) {
                    case LexerActionType.CHANNEL: {
                        const channel: number = (action as LexerChannelAction).getChannel();
                        this.data.add(channel);
                        this.data.add(0);
                        break;
                    }

                    case LexerActionType.CUSTOM: {
                        const ruleIndex: number = (action as LexerCustomAction).getRuleIndex();
                        const actionIndex: number = (action as LexerCustomAction).getActionIndex();
                        this.data.add(ruleIndex);
                        this.data.add(actionIndex);
                        break;
                    }

                    case LexerActionType.MODE: {
                        const mode: number = (action as LexerModeAction).getMode();
                        this.data.add(mode);
                        this.data.add(0);
                        break;
                    }

                    case LexerActionType.MORE: {
                        this.data.add(0);
                        this.data.add(0);
                        break;
                    }

                    case LexerActionType.POP_MODE: {
                        this.data.add(0);
                        this.data.add(0);
                        break;
                    }

                    case LexerActionType.PUSH_MODE: {
                        const mode = (action as LexerPushModeAction).getMode();
                        this.data.add(mode);
                        this.data.add(0);
                        break;
                    }

                    case LexerActionType.SKIP: {
                        this.data.add(0);
                        this.data.add(0);
                        break;
                    }

                    case LexerActionType.TYPE: {
                        const type: number = (action as LexerTypeAction).getType();
                        this.data.add(type);
                        this.data.add(0);
                        break;
                    }

                    default: {
                        const message = java.lang.String.format(java.util.Locale.getDefault(),
                            S`The specified lexer action type %s is not valid.`, action.getActionType());
                        throw new java.lang.IllegalArgumentException(message);
                    }

                }
            }
        }
    };

    private addDecisionStartStates = (): void => {
        const ndecisions: number = this.atn.decisionToState.size();
        this.data.add(ndecisions);
        for (const decStartState of this.atn.decisionToState) {
            this.data.add(decStartState.stateNumber);
        }
    };

    private addEdges(): number;
    private addEdges(nedges: number, setIndices: java.util.Map<IntervalSet, number>): void;
    private addEdges(nedges?: number, setIndices?: java.util.Map<IntervalSet, number>): number | void {
        if (nedges === undefined) {
            let nedges = 0;
            this.data.add(this.atn.states.size());
            for (const s of this.atn.states) {
                if (s === null) { // might be optimized away
                    this.data.add(ATNState.INVALID_TYPE);
                    continue;
                }

                const stateType: number = s.getStateType();
                if (s instanceof DecisionState && (s).nonGreedy) {
                    this.nonGreedyStates.add(s.stateNumber);
                }

                if (s instanceof RuleStartState && (s).isLeftRecursiveRule) {
                    this.precedenceStates.add(s.stateNumber);
                }

                this.data.add(stateType);

                this.data.add(s.ruleIndex);

                if (s.getStateType() === ATNState.LOOP_END) {
                    this.data.add((s as LoopEndState).loopBackState!.stateNumber);
                } else {
                    if (s instanceof BlockStartState) {
                        this.data.add(s.endState!.stateNumber);
                    }
                }

                if (s.getStateType() !== ATNState.RULE_STOP) {
                    // the deserializer can trivially derive these edges, so there's no need to serialize them
                    nedges += s.getNumberOfTransitions();
                }

                for (let i = 0; i < s.getNumberOfTransitions(); i++) {
                    const t = s.transition(i);
                    const edgeType = Transition.serializationTypes.get(t.getClass());
                    if (edgeType === Transition.SET || edgeType === Transition.NOT_SET) {
                        const st: SetTransition = t as SetTransition;
                        this.sets.put(st.set, true);
                    }
                }
            }

            return nedges;
        } else {
            this.data.add(nedges);
            for (const s of this.atn.states) {
                if (s === null) {
                    // might be optimized away
                    continue;
                }

                if (s.getStateType() === ATNState.RULE_STOP) {
                    continue;
                }

                for (let i = 0; i < s.getNumberOfTransitions(); i++) {
                    const t = s.transition(i);

                    if (this.atn.states.get(t.target.stateNumber) === null) {
                        throw new java.lang.IllegalStateException(S`Cannot serialize a transition to a removed state.`);
                    }

                    const src = s.stateNumber;
                    let trg = t.target.stateNumber;
                    const edgeType = Transition.serializationTypes.get(t.getClass());
                    if (edgeType === null) {
                        throw new java.lang.IllegalStateException(S`Invalid transition class found.`);
                    }

                    let arg1 = 0;
                    let arg2 = 0;
                    let arg3 = 0;
                    switch (edgeType) {
                        case Transition.RULE: {
                            trg = (t as RuleTransition).followState.stateNumber;
                            arg1 = (t as RuleTransition).target.stateNumber;
                            arg2 = (t as RuleTransition).ruleIndex;
                            arg3 = (t as RuleTransition).precedence;
                            break;
                        }

                        case Transition.PRECEDENCE: {
                            const ppt: PrecedencePredicateTransition = t as PrecedencePredicateTransition;
                            arg1 = ppt.precedence;
                            break;
                        }

                        case Transition.PREDICATE: {
                            const pt: PredicateTransition = t as PredicateTransition;
                            arg1 = pt.ruleIndex;
                            arg2 = pt.predIndex;
                            arg3 = pt.isCtxDependent ? 1 : 0;
                            break;
                        }

                        case Transition.RANGE: {
                            arg1 = (t as RangeTransition).from;
                            arg2 = (t as RangeTransition).to;
                            if (arg1 === Token.EOF) {
                                arg1 = 0;
                                arg3 = 1;
                            }
                            break;
                        }

                        case Transition.ATOM: {
                            arg1 = (t as AtomTransition).labelValue;
                            if (arg1 === Token.EOF) {
                                arg1 = 0;
                                arg3 = 1;
                            }
                            break;
                        }

                        case Transition.ACTION: {
                            const at = t as ActionTransition;
                            arg1 = at.ruleIndex;
                            arg2 = at.actionIndex;
                            arg3 = at.isCtxDependent ? 1 : 0;
                            break;
                        }

                        case Transition.SET: {
                            arg1 = setIndices?.get((t as SetTransition).set) ?? 0;
                            break;
                        }

                        case Transition.NOT_SET: {
                            arg1 = setIndices?.get((t as SetTransition).set) ?? 0;
                            break;
                        }

                        case Transition.WILDCARD: {
                            break;
                        }

                        default:

                    }

                    this.data.add(src);
                    this.data.add(trg);
                    this.data.add(edgeType);
                    this.data.add(arg1);
                    this.data.add(arg2);
                    this.data.add(arg3);
                }
            }
        }

    }

    private addSets = (): java.util.Map<IntervalSet, number> => {
        ATNSerializer.serializeSets(this.data, this.sets.keySet());
        const setIndices = new java.util.HashMap<IntervalSet, number>();
        let setIndex = 0;
        for (const s of this.sets.keySet()) {
            setIndices.put(s, setIndex++);
        }

        return setIndices;
    };

    private addModeStartStates = (): void => {
        const nmodes: number = this.atn.modeToStartState.size();
        this.data.add(nmodes);
        if (nmodes > 0) {
            for (const modeStartState of this.atn.modeToStartState) {
                this.data.add(modeStartState.stateNumber);
            }
        }
    };

    private addRuleStatesAndLexerTokenTypes = (): void => {
        const nrules: number = this.atn.ruleToStartState.length;
        this.data.add(nrules);
        for (let r = 0; r < nrules; r++) {
            const ruleStartState: ATNState = this.atn.ruleToStartState[r];
            this.data.add(ruleStartState.stateNumber);
            if (this.atn.grammarType === ATNType.LEXER) {
                /* assert atn.ruleToTokenType[r]>=0; */  // 0 implies fragment rule, other token types > 0
                this.data.add(this.atn.ruleToTokenType[r]);
            }
        }
    };

    private addPrecedenceStates = (): void => {
        this.data.add(this.precedenceStates.size());
        for (let i = 0; i < this.precedenceStates.size(); i++) {
            this.data.add(this.precedenceStates.get(i));
        }
    };

    private addNonGreedyStates = (): void => {
        this.data.add(this.nonGreedyStates.size());
        for (let i = 0; i < this.nonGreedyStates.size(); i++) {
            this.data.add(this.nonGreedyStates.get(i));
        }
    };
}
