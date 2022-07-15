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



import { java } from "../../../../../../lib/java/java";
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




/** Deserialize ATNs for JavaTarget; it's complicated by the fact that java requires
 *  that we serialize the list of integers as 16 bit characters in a string. Other
 *  targets will have an array of ints generated and can simply decode the ints
 *  back into an ATN.
 *
 * @author Sam Harwell
 */
export  class ATNDeserializer {
	public static readonly  SERIALIZED_VERSION:  number;

	private readonly  deserializationOptions?:  ATNDeserializationOptions;

	public constructor();

	public constructor(deserializationOptions: ATNDeserializationOptions);
public constructor(deserializationOptions?: ATNDeserializationOptions) {
const $this = (deserializationOptions?: ATNDeserializationOptions): void => {
if (deserializationOptions === undefined) {
		$this(ATNDeserializationOptions.getDefaultOptions());
	}
 else  {
		if (deserializationOptions === undefined) {
			deserializationOptions = ATNDeserializationOptions.getDefaultOptions();
		}

		this.deserializationOptions = deserializationOptions;
	}
};

$this(deserializationOptions);

}


	public deserialize(data: number[]): ATN;

	public deserialize(data: number[]): ATN;


	public deserialize(data: number[]):  ATN {
if () {
		return this.deserialize(ATNDeserializer.decodeIntsEncodedAs16BitWords(data));
	}
 else  {
		let  p: number = 0;
		let  version: number = data[p++];
		if (version !== ATNDeserializer.SERIALIZED_VERSION) {
			let  reason: string = string.format(java.util.Locale.getDefault(), "Could not deserialize ATN with version %d (expected %d).", version, ATNDeserializer.SERIALIZED_VERSION);
			throw new  java.lang.UnsupportedOperationException(new  InvalidClassException(new java.lang.Class(ATN).getName(), reason));
		}

		let  grammarType: ATNType = ATNType.values()[data[p++]];
		let  maxTokenType: number = data[p++];
		let  atn: ATN = new  ATN(grammarType, maxTokenType);

		//
		// STATES
		//
		let  loopBackStateNumbers: java.util.List<Pair<LoopEndState, java.lang.Integer>> = new  java.util.ArrayList<Pair<LoopEndState, java.lang.Integer>>();
		let  endStateNumbers: java.util.List<Pair<BlockStartState, java.lang.Integer>> = new  java.util.ArrayList<Pair<BlockStartState, java.lang.Integer>>();
		let  nstates: number = data[p++];
		for (let  i: number=0; i<nstates; i++) {
			let  stype: number = data[p++];
			// ignore bad type of states
			if ( stype===ATNState.INVALID_TYPE ) {
				atn.addState(undefined);
				continue;
			}

			let  ruleIndex: number = data[p++];
			let  s: ATNState = this.stateFactory(stype, ruleIndex);
			if ( stype === ATNState.LOOP_END ) { // special case
				let  loopBackStateNumber: number = data[p++];
				loopBackStateNumbers.add(new  Pair<LoopEndState, java.lang.Integer>(s as LoopEndState, loopBackStateNumber));
			}
			else { if (s instanceof BlockStartState) {
				let  endStateNumber: number = data[p++];
				endStateNumbers.add(new  Pair<BlockStartState, java.lang.Integer>(s as BlockStartState, endStateNumber));
			}
}

			atn.addState(s);
		}

		// delay the assignment of loop back and end states until we know all the state instances have been initialized
		for (let pair of loopBackStateNumbers) {
			pair.a.loopBackState = atn.states.get(pair.b);
		}

		for (let pair of endStateNumbers) {
			pair.a.endState = atn.states.get(pair.b) as BlockEndState;
		}

		let  numNonGreedyStates: number = data[p++];
		for (let  i: number = 0; i < numNonGreedyStates; i++) {
			let  stateNumber: number = data[p++];
			(atn.states.get(stateNumber) as DecisionState).nonGreedy = true;
		}

		let  numPrecedenceStates: number = data[p++];
		for (let  i: number = 0; i < numPrecedenceStates; i++) {
			let  stateNumber: number = data[p++];
			(atn.states.get(stateNumber) as RuleStartState).isLeftRecursiveRule = true;
		}

		//
		// RULES
		//
		let  nrules: number = data[p++];
		if ( atn.grammarType === ATNType.LEXER ) {
			atn.ruleToTokenType = new   Array<number>(nrules);
		}

		atn.ruleToStartState = new   Array<RuleStartState>(nrules);
		for (let  i: number=0; i<nrules; i++) {
			let  s: number = data[p++];
			let  startState: RuleStartState = atn.states.get(s) as RuleStartState;
			atn.ruleToStartState[i] = startState;
			if ( atn.grammarType === ATNType.LEXER ) {
				let  tokenType: number = data[p++];
				atn.ruleToTokenType[i] = tokenType;
			}
		}

		atn.ruleToStopState = new   Array<RuleStopState>(nrules);
		for (let state of atn.states) {
			if (!(state instanceof RuleStopState)) {
				continue;
			}

			let  stopState: RuleStopState = state as RuleStopState;
			atn.ruleToStopState[state.ruleIndex] = stopState;
			atn.ruleToStartState[state.ruleIndex].stopState = stopState;
		}

		//
		// MODES
		//
		let  nmodes: number = data[p++];
		for (let  i: number=0; i<nmodes; i++) {
			let  s: number = data[p++];
			atn.modeToStartState.add(atn.states.get(s) as TokensStartState);
		}

		//
		// SETS
		//
		let  sets: java.util.List<IntervalSet> = new  java.util.ArrayList<IntervalSet>();
		p = this.deserializeSets(data, p, sets);

		//
		// EDGES
		//
		let  nedges: number = data[p++];
		for (let  i: number=0; i<nedges; i++) {
			let  src: number = data[p];
			let  trg: number = data[p+1];
			let  ttype: number = data[p+2];
			let  arg1: number = data[p+3];
			let  arg2: number = data[p+4];
			let  arg3: number = data[p+5];
			let  trans: Transition = this.edgeFactory(atn, ttype, src, trg, arg1, arg2, arg3, sets);
//			System.out.println("EDGE "+trans.getClass().getSimpleName()+" "+
//							   src+"->"+trg+
//					   " "+Transition.serializationNames[ttype]+
//					   " "+arg1+","+arg2+","+arg3);
			let  srcState: ATNState = atn.states.get(src);
			srcState.addTransition(trans);
			p += 6;
		}

		// edges for rule stop states can be derived, so they aren't serialized
		for (let state of atn.states) {
			for (let  i: number = 0; i < state.getNumberOfTransitions(); i++) {
				let  t: Transition = state.transition(i);
				if (!(t instanceof RuleTransition)) {
					continue;
				}

				let  ruleTransition: RuleTransition = t as RuleTransition;
				let  outermostPrecedenceReturn: number = -1;
				if (atn.ruleToStartState[ruleTransition.target.ruleIndex].isLeftRecursiveRule) {
					if (ruleTransition.precedence === 0) {
						outermostPrecedenceReturn = ruleTransition.target.ruleIndex;
					}
				}

				let  returnTransition: EpsilonTransition = new  EpsilonTransition(ruleTransition.followState, outermostPrecedenceReturn);
				atn.ruleToStopState[ruleTransition.target.ruleIndex].addTransition(returnTransition);
			}
		}

		for (let state of atn.states) {
			if (state instanceof BlockStartState) {
				// we need to know the end state to set its start state
				if ((state as BlockStartState).endState === undefined) {
					throw new  java.lang.IllegalStateException();
				}

				// block end states can only be associated to a single block start state
				if ((state as BlockStartState).endState.startState !== undefined) {
					throw new  java.lang.IllegalStateException();
				}

				(state as BlockStartState).endState.startState = state as BlockStartState;
			}

			if (state instanceof PlusLoopbackState) {
				let  loopbackState: PlusLoopbackState = state as PlusLoopbackState;
				for (let  i: number = 0; i < loopbackState.getNumberOfTransitions(); i++) {
					let  target: ATNState = loopbackState.transition(i).target;
					if (target instanceof PlusBlockStartState) {
						(target as PlusBlockStartState).loopBackState = loopbackState;
					}
				}
			}
			else { if (state instanceof StarLoopbackState) {
				let  loopbackState: StarLoopbackState = state as StarLoopbackState;
				for (let  i: number = 0; i < loopbackState.getNumberOfTransitions(); i++) {
					let  target: ATNState = loopbackState.transition(i).target;
					if (target instanceof StarLoopEntryState) {
						(target as StarLoopEntryState).loopBackState = loopbackState;
					}
				}
			}
}

		}

		//
		// DECISIONS
		//
		let  ndecisions: number = data[p++];
		for (let  i: number=1; i<=ndecisions; i++) {
			let  s: number = data[p++];
			let  decState: DecisionState = atn.states.get(s) as DecisionState;
			atn.decisionToState.add(decState);
			decState.decision = i-1;
		}

		//
		// LEXER ACTIONS
		//
		if (atn.grammarType === ATNType.LEXER) {
			atn.lexerActions = new   Array<LexerAction>(data[p++]);
			for (let  i: number = 0; i < atn.lexerActions.length; i++) {
				let  actionType: LexerActionType = LexerActionType.values()[data[p++]];
				let  data1: number = data[p++];
				let  data2: number = data[p++];

				let  lexerAction: LexerAction = this.lexerActionFactory(actionType, data1, data2);

				atn.lexerActions[i] = lexerAction;
			}
		}

		this.markPrecedenceDecisions(atn);

		if (this.deserializationOptions.isVerifyATN()) {
			this.verifyATN(atn);
		}

		if (this.deserializationOptions.isGenerateRuleBypassTransitions() && atn.grammarType === ATNType.PARSER) {
			atn.ruleToTokenType = new   Array<number>(atn.ruleToStartState.length);
			for (let  i: number = 0; i < atn.ruleToStartState.length; i++) {
				atn.ruleToTokenType[i] = atn.maxTokenType + i + 1;
			}

			for (let  i: number = 0; i < atn.ruleToStartState.length; i++) {
				let  bypassStart: BasicBlockStartState = new  BasicBlockStartState();
				bypassStart.ruleIndex = i;
				atn.addState(bypassStart);

				let  bypassStop: BlockEndState = new  BlockEndState();
				bypassStop.ruleIndex = i;
				atn.addState(bypassStop);

				bypassStart.endState = bypassStop;
				atn.defineDecisionState(bypassStart);

				bypassStop.startState = bypassStart;

				let  endState: ATNState;
				let  excludeTransition: Transition = undefined;
				if (atn.ruleToStartState[i].isLeftRecursiveRule) {
					// wrap from the beginning of the rule to the StarLoopEntryState
					endState = undefined;
					for (let state of atn.states) {
						if (state.ruleIndex !== i) {
							continue;
						}

						if (!(state instanceof StarLoopEntryState)) {
							continue;
						}

						let  maybeLoopEndState: ATNState = state.transition(state.getNumberOfTransitions() - 1).target;
						if (!(maybeLoopEndState instanceof LoopEndState)) {
							continue;
						}

						if (maybeLoopEndState.epsilonOnlyTransitions && maybeLoopEndState.transition(0).target instanceof RuleStopState) {
							endState = state;
							break;
						}
					}

					if (endState === undefined) {
						throw new  java.lang.UnsupportedOperationException("Couldn't identify final state of the precedence rule prefix section.");
					}

					excludeTransition = (endState as StarLoopEntryState).loopBackState.transition(0);
				}
				else {
					endState = atn.ruleToStopState[i];
				}

				// all non-excluded transitions that currently target end state need to target blockEnd instead
				for (let state of atn.states) {
					for (let transition of state.transitions) {
						if (transition === excludeTransition) {
							continue;
						}

						if (transition.target === endState) {
							transition.target = bypassStop;
						}
					}
				}

				// all transitions leaving the rule start state need to leave blockStart instead
				while (atn.ruleToStartState[i].getNumberOfTransitions() > 0) {
					let  transition: Transition = atn.ruleToStartState[i].removeTransition(atn.ruleToStartState[i].getNumberOfTransitions() - 1);
					bypassStart.addTransition(transition);
				}

				// link the new states
				atn.ruleToStartState[i].addTransition(new  EpsilonTransition(bypassStart));
				bypassStop.addTransition(new  EpsilonTransition(endState));

				let  matchState: ATNState = new  BasicState();
				atn.addState(matchState);
				matchState.addTransition(new  AtomTransition(bypassStop, atn.ruleToTokenType[i]));
				bypassStart.addTransition(new  EpsilonTransition(matchState));
			}

			if (this.deserializationOptions.isVerifyATN()) {
				// reverify after modification
				this.verifyATN(atn);
			}
		}

		return atn;
	}

}


	private deserializeSets = (data: number[], p: number, sets: java.util.List<IntervalSet>): number => {
		let  nsets: number = data[p++];
		for (let  i: number=0; i<nsets; i++) {
			let  nintervals: number = data[p];
			p++;
			let  set: IntervalSet = new  IntervalSet();
			sets.add(set);

			let  containsEof: boolean = data[p++] !== 0;
			if (containsEof) {
				set.add(-1);
			}

			for (let  j: number=0; j<nintervals; j++) {
				let  a: number = data[p++];
				let  b: number = data[p++];
				set.add(a, b);
			}
		}
		return p;
	}

	/**
	 * Analyze the {@link StarLoopEntryState} states in the specified ATN to set
	 * the {@link StarLoopEntryState#isPrecedenceDecision} field to the
	 * correct value.
	 *
	 * @param atn The ATN.
	 */
	protected markPrecedenceDecisions = (atn: ATN): void => {
		for (let state of atn.states) {
			if (!(state instanceof StarLoopEntryState)) {
				continue;
			}

			/* We analyze the ATN to determine if this ATN decision state is the
			 * decision for the closure block that determines whether a
			 * precedence rule should continue or complete.
			 */
			if (atn.ruleToStartState[state.ruleIndex].isLeftRecursiveRule) {
				let  maybeLoopEndState: ATNState = state.transition(state.getNumberOfTransitions() - 1).target;
				if (maybeLoopEndState instanceof LoopEndState) {
					if (maybeLoopEndState.epsilonOnlyTransitions && maybeLoopEndState.transition(0).target instanceof RuleStopState) {
						(state as StarLoopEntryState).isPrecedenceDecision = true;
					}
				}
			}
		}
	}

	protected verifyATN = (atn: ATN): void => {
		// verify assumptions
		for (let state of atn.states) {
			if (state === undefined) {
				continue;
			}

			this.checkCondition(state.onlyHasEpsilonTransitions() || state.getNumberOfTransitions() <= 1);

			if (state instanceof PlusBlockStartState) {
				this.checkCondition((state as PlusBlockStartState).loopBackState !== undefined);
			}

			if (state instanceof StarLoopEntryState) {
				let  starLoopEntryState: StarLoopEntryState = state as StarLoopEntryState;
				this.checkCondition(starLoopEntryState.loopBackState !== undefined);
				this.checkCondition(starLoopEntryState.getNumberOfTransitions() === 2);

				if (starLoopEntryState.transition(0).target instanceof StarBlockStartState) {
					this.checkCondition(starLoopEntryState.transition(1).target instanceof LoopEndState);
					this.checkCondition(!starLoopEntryState.nonGreedy);
				}
				else { if (starLoopEntryState.transition(0).target instanceof LoopEndState) {
					this.checkCondition(starLoopEntryState.transition(1).target instanceof StarBlockStartState);
					this.checkCondition(starLoopEntryState.nonGreedy);
				}
				else {
					throw new  java.lang.IllegalStateException();
				}
}

			}

			if (state instanceof StarLoopbackState) {
				this.checkCondition(state.getNumberOfTransitions() === 1);
				this.checkCondition(state.transition(0).target instanceof StarLoopEntryState);
			}

			if (state instanceof LoopEndState) {
				this.checkCondition((state as LoopEndState).loopBackState !== undefined);
			}

			if (state instanceof RuleStartState) {
				this.checkCondition((state as RuleStartState).stopState !== undefined);
			}

			if (state instanceof BlockStartState) {
				this.checkCondition((state as BlockStartState).endState !== undefined);
			}

			if (state instanceof BlockEndState) {
				this.checkCondition((state as BlockEndState).startState !== undefined);
			}

			if (state instanceof DecisionState) {
				let  decisionState: DecisionState = state as DecisionState;
				this.checkCondition(decisionState.getNumberOfTransitions() <= 1 || decisionState.decision >= 0);
			}
			else {
				this.checkCondition(state.getNumberOfTransitions() <= 1 || state instanceof RuleStopState);
			}
		}
	}

	protected checkCondition(condition: boolean): void;

	protected checkCondition(condition: boolean, message: string): void;


	protected checkCondition(condition: boolean, message?: string):  void {
if (message === undefined) {
		this.checkCondition(condition, undefined);
	}
 else  {
		if (!condition) {
			throw new  java.lang.IllegalStateException(message);
		}
	}

}


	protected static toInt = (c: number): number => {
		return c;
	}

	protected static toInt32(data: number[], offset: number): number;

	protected static toInt32(data: number[], offset: number): number;


	protected static toInt32(data: number[], offset: number):  number {
if () {
		return Number(data[offset]) | (Number(data[offset + 1]) << 16);
	}
 else  {
		return data[offset] | (data[offset + 1] << 16);
	}

}


	protected edgeFactory = (atn: ATN,
										 type: number, src: number, trg: number,
										 arg1: number, arg2: number, arg3: number,
										 sets: java.util.List<IntervalSet>): Transition =>
	{
		let  target: ATNState = atn.states.get(trg);
		switch (type) {
			case Transition.EPSILON : return new  EpsilonTransition(target);
			case Transition.RANGE :
				if (arg3 !== 0) {
					return new  RangeTransition(target, Token.EOF, arg2);
				}
				else {
					return new  RangeTransition(target, arg1, arg2);
				}
			case Transition.RULE :
				let  rt: RuleTransition = new  RuleTransition(atn.states.get(arg1) as RuleStartState, arg2, arg3, target);
				return rt;
			case Transition.PREDICATE :
				let  pt: PredicateTransition = new  PredicateTransition(target, arg1, arg2, arg3 !== 0);
				return pt;
			case Transition.PRECEDENCE:
				return new  PrecedencePredicateTransition(target, arg1);
			case Transition.ATOM :
				if (arg3 !== 0) {
					return new  AtomTransition(target, Token.EOF);
				}
				else {
					return new  AtomTransition(target, arg1);
				}
			case Transition.ACTION :
				let  a: ActionTransition = new  ActionTransition(target, arg1, arg2, arg3 !== 0);
				return a;
			case Transition.SET : return new  SetTransition(target, sets.get(arg1));
			case Transition.NOT_SET : return new  NotSetTransition(target, sets.get(arg1));
			case Transition.WILDCARD : return new  WildcardTransition(target);

default:

		}

		throw new  java.lang.IllegalArgumentException("The specified transition type is not valid.");
	}

	protected stateFactory = (type: number, ruleIndex: number): ATNState => {
		let  s: ATNState;
		switch (type) {
			case ATNState.INVALID_TYPE: return undefined;
			case ATNState.BASIC : s = new  BasicState(); break;
			case ATNState.RULE_START : s = new  RuleStartState(); break;
			case ATNState.BLOCK_START : s = new  BasicBlockStartState(); break;
			case ATNState.PLUS_BLOCK_START : s = new  PlusBlockStartState(); break;
			case ATNState.STAR_BLOCK_START : s = new  StarBlockStartState(); break;
			case ATNState.TOKEN_START : s = new  TokensStartState(); break;
			case ATNState.RULE_STOP : s = new  RuleStopState(); break;
			case ATNState.BLOCK_END : s = new  BlockEndState(); break;
			case ATNState.STAR_LOOP_BACK : s = new  StarLoopbackState(); break;
			case ATNState.STAR_LOOP_ENTRY : s = new  StarLoopEntryState(); break;
			case ATNState.PLUS_LOOP_BACK : s = new  PlusLoopbackState(); break;
			case ATNState.LOOP_END : s = new  LoopEndState(); break;
			default :
				let  message: string = string.format(java.util.Locale.getDefault(), "The specified state type %d is not valid.", type);
				throw new  java.lang.IllegalArgumentException(message);
		}

		s.ruleIndex = ruleIndex;
		return s;
	}

	protected lexerActionFactory = (type: LexerActionType, data1: number, data2: number): LexerAction => {
		switch (type) {
		case CHANNEL:
			return new  LexerChannelAction(data1);

		case CUSTOM:
			return new  LexerCustomAction(data1, data2);

		case MODE:
			return new  LexerModeAction(data1);

		case MORE:
			return LexerMoreAction.INSTANCE;

		case POP_MODE:
			return LexerPopModeAction.INSTANCE;

		case PUSH_MODE:
			return new  LexerPushModeAction(data1);

		case SKIP:
			return LexerSkipAction.INSTANCE;

		case TYPE:
			return new  LexerTypeAction(data1);

		default:
			throw new  java.lang.IllegalArgumentException(string.format(java.util.Locale.getDefault(), "The specified lexer action type %s is not valid.", type));
		}
	}

	/** Given a list of integers representing a serialized ATN, encode values too large to fit into 15 bits
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
	 */
	public static encodeIntsWith16BitWords = (data: IntegerList): IntegerList => {
		let  data16: IntegerList = new  IntegerList(Number((data.size()*1.5)));
		for (let  i: number = 0; i < data.size(); i++) {
			let  v: number = data.get(i);
			if ( v===-1 ) { // use two max uint16 for -1
				data16.add(0xFFFF);
				data16.add(0xFFFF);
			}
			else { if (v <= 0x7FFF) {
				data16.add(v);
			}
			else { // v > 0x7FFF
				if ( v>=0x7FFF_FFFF ) { // too big to fit in 15 bits + 16 bits? (+1 would be 8000_0000 which is bad encoding)
					throw new  java.lang.UnsupportedOperationException("Serialized ATN data element["+i+"] = "+v+" doesn't fit in 31 bits");
				}
				v = v & 0x7FFF_FFFF;					// strip high bit (sentinel) if set
				data16.add((v >> 16) | 0x8000);   // store high 15-bit word first and set high bit to say word follows
				data16.add((v & 0xFFFF)); 		// then store lower 16-bit word
			}
}

		}
		return data16;
	}

	public static decodeIntsEncodedAs16BitWords(data16: number[]): number[];

	/** Convert a list of chars (16 uint) that represent a serialized and compressed list of ints for an ATN.
	 *  This method pairs with {@link #encodeIntsWith16BitWords(IntegerList)} above. Used only for Java Target.
	 */
	public static decodeIntsEncodedAs16BitWords(data16: number[], trimToSize: boolean): number[];


	public static decodeIntsEncodedAs16BitWords(data16: number[], trimToSize?: boolean):  number[] {
if (trimToSize === undefined) {
		return ATNDeserializer.decodeIntsEncodedAs16BitWords(data16, false);
	}
 else  {
		// will be strictly smaller but we waste bit of space to avoid copying during initialization of parsers
		let  data: number[] = new   Array<number>(data16.length);
		let  i: number = 0;
		let  i2: number = 0;
		while ( i < data16.length ) {
			let  v: number = data16[i++];
			if ( (v & 0x8000) === 0 ) { // hi bit not set? Implies 1-word value
				data[i2++] = v; // 7 bit int
			}
			else { // hi bit set. Implies 2-word value
				let  vnext: number = data16[i++];
				if ( v===0xFFFF && vnext === 0xFFFF ) { // is it -1?
					data[i2++] = -1;
				}
				else { // 31-bit int
					data[i2++] = (v & 0x7FFF) << 16 | (vnext & 0xFFFF);
				}
			}
		}
		if ( trimToSize ) {
			return java.util.Arrays.copyOf(data, i2);
		}
		return data;
	}

}

	static {
		ATNDeserializer.SERIALIZED_VERSION = 4;
	}
}
