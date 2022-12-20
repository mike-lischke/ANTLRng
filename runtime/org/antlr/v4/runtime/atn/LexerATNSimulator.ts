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
import { ATNConfig } from "./ATNConfig";
import { ATNConfigSet } from "./ATNConfigSet";
import { ATNSimulator } from "./ATNSimulator";
import { ATNState } from "./ATNState";
import { EmptyPredictionContext } from "./EmptyPredictionContext";
import { LexerActionExecutor } from "./LexerActionExecutor";
import { LexerATNConfig } from "./LexerATNConfig";
import { OrderedATNConfigSet } from "./OrderedATNConfigSet";
import { PredicateTransition } from "./PredicateTransition";
import { PredictionContext } from "./PredictionContext";
import { PredictionContextCache } from "./PredictionContextCache";
import { RuleStopState } from "./RuleStopState";
import { RuleTransition } from "./RuleTransition";
import { SingletonPredictionContext } from "./SingletonPredictionContext";
import { Transition } from "./Transition";
import { CharStream } from "../CharStream";
import { IntStream } from "../IntStream";
import { Lexer } from "../Lexer";
import { LexerNoViableAltException } from "../LexerNoViableAltException";
import { Token } from "../Token";
import { DFA } from "../dfa/DFA";
import { DFAState } from "../dfa/DFAState";
import { Interval } from "../misc/Interval";


import { JavaObject } from "../../../../../../lib/java/lang/Object";


/** "dup" of ParserInterpreter */
export  class LexerATNSimulator extends ATNSimulator {
	public static readonly  debug:  boolean = false;
	public static readonly  dfa_debug:  boolean = false;

	public static readonly  MIN_DFA_EDGE:  number = 0;
	public static readonly  MAX_DFA_EDGE:  number = 127; // forces unicode to stay in ATN

	/** When we hit an accept state in either the DFA or the ATN, we
	 *  have to notify the character stream to start buffering characters
	 *  via {@link IntStream#mark} and record the current state. The current sim state
	 *  includes the current index into the input, the current line,
	 *  and current character position in that line. Note that the Lexer is
	 *  tracking the starting line and characterization of the token. These
	 *  variables track the "state" of the simulator when it hits an accept state.
	 *
	 *  <p>We track these variables separately for the DFA and ATN simulation
	 *  because the DFA simulation often has to fail over to the ATN
	 *  simulation. If the ATN simulation fails, we need the DFA to fall
	 *  back to its previously accepted state, if any. If the ATN succeeds,
	 *  then the ATN does the accept and the DFA simulator that invoked it
	 *  can simply return the predicted token type.</p>
	 */
	protected static SimState =  class SimState extends JavaObject {
		protected index:  number = -1;
		protected line:  number = 0;
		protected charPos:  number = -1;
		protected dfaState:  DFAState | null;

		protected reset = ():  void => {
			$outer.index = -1;
			$outer.line = 0;
			$outer.charPos = -1;
			$outer.dfaState = null;
		}
	};



	protected readonly  recog:  Lexer | null;

	/** The current token's starting index into the character stream.
	 *  Shared across DFA to ATN simulation in case the ATN fails and the
	 *  DFA did not have a previous accept state. In this case, we use the
	 *  ATN-generated exception object.
	 */
	protected startIndex:  number = -1;

	/** line number 1..n within the input */
	protected line:  number = 1;

	/** The index of the character relative to the beginning of the line 0..n-1 */
	protected charPositionInLine:  number = 0;


	public readonly  decisionToDFA:  DFA[] | null;
	protected mode:  number = Lexer.DEFAULT_MODE;

	/** Used during DFA/ATN exec to record the most recent accept configuration info */

	protected readonly  prevAccept:  LexerATNSimulator.SimState | null = new  LexerATNSimulator.SimState();

	/* eslint-disable constructor-super, @typescript-eslint/no-unsafe-call */
public constructor(atn: ATN| null, decisionToDFA: DFA[]| null,
							 sharedContextCache: PredictionContextCache| null);

	public constructor(recog: Lexer| null, atn: ATN| null,
							 decisionToDFA: DFA[]| null,
							 sharedContextCache: PredictionContextCache| null);
/* @ts-expect-error, because of the super() call in the closure. */
public constructor(atnOrRecog: ATN | Lexer | null, decisionToDFAOrAtn: DFA[] | ATN | null, sharedContextCacheOrDecisionToDFA: PredictionContextCache | DFA[] | null, sharedContextCache?: PredictionContextCache | null) {
const $this = (atnOrRecog: ATN | Lexer | null, decisionToDFAOrAtn: DFA[] | ATN | null, sharedContextCacheOrDecisionToDFA: PredictionContextCache | DFA[] | null, sharedContextCache?: PredictionContextCache | null): void => {
if (atnOrRecog instanceof ATN && Array.isArray(decisionToDFAOrAtn) && sharedContextCacheOrDecisionToDFA instanceof PredictionContextCache && sharedContextCache === undefined)
	{
const atn = atnOrRecog as ATN;
const decisionToDFA = decisionToDFAOrAtn as DFA[];
const sharedContextCache = sharedContextCacheOrDecisionToDFA as PredictionContextCache;
		$this(null, atn, decisionToDFA,sharedContextCache);
	}
 else 
	{
let recog = atnOrRecog as Lexer;
let atn = decisionToDFAOrAtn as ATN;
let decisionToDFA = sharedContextCacheOrDecisionToDFA as DFA[];
/* @ts-expect-error, because of the super() call in the closure. */
		super(atn,sharedContextCache);
		this.decisionToDFA = decisionToDFA;
		this.recog = recog;
	}
};

$this(atnOrRecog, decisionToDFAOrAtn, sharedContextCacheOrDecisionToDFA, sharedContextCache);

}
/* eslint-enable constructor-super, @typescript-eslint/no-unsafe-call */

	public copyState = (simulator: LexerATNSimulator| null):  void => {
		this.charPositionInLine = simulator.charPositionInLine;
		this.line = simulator.line;
		this.mode = simulator.mode;
		this.startIndex = simulator.startIndex;
	}

	public match = (input: CharStream| null, mode: number):  number => {
		this.mode = mode;
		let  mark: number = input.mark();
		try {
			this.startIndex = input.index();
			this.prevAccept.reset();
			let  dfa: DFA = this.decisionToDFA[mode];
			if ( dfa.s0===null ) {
				return this.matchATN(input);
			}
			else {
				return this.execATN(input, dfa.s0);
			}
		}
		finally {
			input.release(mark);
		}
	}

	public reset = ():  void => {
		this.prevAccept.reset();
		this.startIndex = -1;
		this.line = 1;
		this.charPositionInLine = 0;
		this.mode = Lexer.DEFAULT_MODE;
	}

	public clearDFA = ():  void => {
		for (let  d: number = 0; d < this.decisionToDFA.length; d++) {
			this.decisionToDFA[d] = new  DFA(this.atn.getDecisionState(d), d);
		}
	}

	protected matchATN = (input: CharStream| null):  number => {
		let  startState: ATNState = this.atn.modeToStartState.get(this.mode);

		if ( LexerATNSimulator.debug ) {
			java.lang.System.out.format(java.util.Locale.getDefault(), "matchATN mode %d start: %s\n", this.mode, startState);
		}

		let  old_mode: number = this.mode;

		let  s0_closure: ATNConfigSet = this.computeStartState(input, startState);
		let  suppressEdge: boolean = s0_closure.hasSemanticContext;
		s0_closure.hasSemanticContext = false;

		let  next: DFAState = this.addDFAState(s0_closure);
		if (!suppressEdge) {
			this.decisionToDFA[this.mode].s0 = next;
		}

		let  predict: number = this.execATN(input, next);

		if ( LexerATNSimulator.debug ) {
			java.lang.System.out.format(java.util.Locale.getDefault(), "DFA after matchATN: %s\n", this.decisionToDFA[old_mode].toLexerString());
		}

		return predict;
	}

	protected execATN = (input: CharStream| null, ds0: DFAState| null):  number => {
		//System.out.println("enter exec index "+input.index()+" from "+ds0.configs);
		if ( LexerATNSimulator.debug ) {
			java.lang.System.out.format(java.util.Locale.getDefault(), "start state closure=%s\n", ds0.configs);
		}

		if (ds0.isAcceptState) {
			// allow zero-length tokens
			this.captureSimState(this.prevAccept, input, ds0);
		}

		let  t: number = input.LA(1);

		let  s: DFAState = ds0; // s is current/from DFA state

		while ( true ) { // while more work
			if ( LexerATNSimulator.debug ) {
				java.lang.System.out.format(java.util.Locale.getDefault(), "execATN loop starting closure: %s\n", s.configs);
			}

			// As we move src->trg, src->trg, we keep track of the previous trg to
			// avoid looking up the DFA state again, which is expensive.
			// If the previous target was already part of the DFA, we might
			// be able to avoid doing a reach operation upon t. If s!=null,
			// it means that semantic predicates didn't prevent us from
			// creating a DFA state. Once we know s!=null, we check to see if
			// the DFA state has an edge already for t. If so, we can just reuse
			// it's configuration set; there's no point in re-computing it.
			// This is kind of like doing DFA simulation within the ATN
			// simulation because DFA simulation is really just a way to avoid
			// computing reach/closure sets. Technically, once we know that
			// we have a previously added DFA state, we could jump over to
			// the DFA simulator. But, that would mean popping back and forth
			// a lot and making things more complicated algorithmically.
			// This optimization makes a lot of sense for loops within DFA.
			// A character will take us back to an existing DFA state
			// that already has lots of edges out of it. e.g., .* in comments.
			let  target: DFAState = this.getExistingTargetState(s, t);
			if (target === null) {
				target = this.computeTargetState(input, s, t);
			}

			if (target === ATNSimulator.ERROR) {
				break;
			}

			// If this is a consumable input element, make sure to consume before
			// capturing the accept state so the input index, line, and char
			// position accurately reflect the state of the interpreter at the
			// end of the token.
			if (t !== IntStream.EOF) {
				this.consume(input);
			}

			if (target.isAcceptState) {
				this.captureSimState(this.prevAccept, input, target);
				if (t === IntStream.EOF) {
					break;
				}
			}

			t = input.LA(1);
			s = target; // flip; current DFA target becomes new src/from state
		}

		return this.failOrAccept(this.prevAccept, input, s.configs, t);
	}

	/**
	 * Get an existing target state for an edge in the DFA. If the target state
	 * for the edge has not yet been computed or is otherwise not available,
	 * this method returns {@code null}.
	 *
	 * @param s The current DFA state
	 * @param t The next input symbol
	  @returns The existing target DFA state for the given input symbol
	 * {@code t}, or {@code null} if the target state for this edge is not
	 * already cached
	 */

	protected getExistingTargetState = (s: DFAState| null, t: number):  DFAState | null => {
		if (s.edges === null || t < LexerATNSimulator.MIN_DFA_EDGE || t > LexerATNSimulator.MAX_DFA_EDGE) {
			return null;
		}

		let  target: DFAState = s.edges[t - LexerATNSimulator.MIN_DFA_EDGE];
		if (LexerATNSimulator.debug && target !== null) {
			java.lang.System.out.println("reuse state "+s.stateNumber+
							   " edge to "+target.stateNumber);
		}

		return target;
	}

	/**
	 * Compute a target state for an edge in the DFA, and attempt to add the
	 * computed state and corresponding edge to the DFA.
	 *
	 * @param input The input stream
	 * @param s The current DFA state
	 * @param t The next input symbol
	 *
	  @returns The computed target DFA state for the given input symbol
	 * {@code t}. If {@code t} does not lead to a valid DFA state, this method
	 * returns {@link #ERROR}.
	 */

	protected computeTargetState = (input: CharStream| null, s: DFAState| null, t: number):  DFAState | null => {
		let  reach: ATNConfigSet = new  OrderedATNConfigSet();

		// if we don't find an existing DFA state
		// Fill reach starting from closure, following t transitions
		this.getReachableConfigSet(input, s.configs, reach, t);

		if ( reach.isEmpty() ) { // we got nowhere on t from s
			if (!reach.hasSemanticContext) {
				// we got nowhere on t, don't throw out this knowledge; it'd
				// cause a failover from DFA later.
				this.addDFAEdge(s, t, ATNSimulator.ERROR);
			}

			// stop when we can't match any more char
			return ATNSimulator.ERROR;
		}

		// Add an edge from s to target DFA found/created for reach
		return this.addDFAEdge(s, t, reach);
	}

	protected failOrAccept = (prevAccept: LexerATNSimulator.SimState| null, input: CharStream| null,
							   reach: ATNConfigSet| null, t: number):  number =>
	{
		if (prevAccept.dfaState !== null) {
			let  lexerActionExecutor: LexerActionExecutor = prevAccept.dfaState.lexerActionExecutor;
			this.accept(input, lexerActionExecutor, this.startIndex,
				prevAccept.index, prevAccept.line, prevAccept.charPos);
			return prevAccept.dfaState.prediction;
		}
		else {
			// if no accept and EOF is first char, return EOF
			if ( t===IntStream.EOF && input.index()===this.startIndex ) {
				return Token.EOF;
			}

			throw new  LexerNoViableAltException(this.recog, input, this.startIndex, reach);
		}
	}

	/** Given a starting configuration set, figure out all ATN configurations
	 *  we can reach upon input {@code t}. Parameter {@code reach} is a return
	 *  parameter.
	 */
	protected getReachableConfigSet = (input: CharStream| null, closure: ATNConfigSet| null, reach: ATNConfigSet| null, t: number):  void => {
		// this is used to skip processing for configs which have a lower priority
		// than a config that already reached an accept state for the same rule
		let  skipAlt: number = ATN.INVALID_ALT_NUMBER;
		for (let c of closure) {
			let  currentAltReachedAcceptState: boolean = c.alt === skipAlt;
			if (currentAltReachedAcceptState && (c as LexerATNConfig).hasPassedThroughNonGreedyDecision()) {
				continue;
			}

			if ( LexerATNSimulator.debug ) {
				java.lang.System.out.format(java.util.Locale.getDefault(), "testing %s at %s\n", this.getTokenName(t), c.toString(this.recog, true));
			}

			let  n: number = c.state.getNumberOfTransitions();
			for (let  ti: number=0; ti<n; ti++) {               // for each transition
				let  trans: Transition = c.state.transition(ti);
				let  target: ATNState = this.getReachableTarget(trans, t);
				if ( target!==null ) {
					let  lexerActionExecutor: LexerActionExecutor = (c as LexerATNConfig).getLexerActionExecutor();
					if (lexerActionExecutor !== null) {
						lexerActionExecutor = lexerActionExecutor.fixOffsetBeforeMatch(input.index() - this.startIndex);
					}

					let  treatEofAsEpsilon: boolean = t === CharStream.EOF;
					if (closure(input, new  LexerATNConfig(c as LexerATNConfig, target, lexerActionExecutor), reach, currentAltReachedAcceptState, true, treatEofAsEpsilon)) {
						// any remaining configs for this alt have a lower priority than
						// the one that just reached an accept state.
						skipAlt = c.alt;
						break;
					}
				}
			}
		}
	}

	protected accept = (input: CharStream| null, lexerActionExecutor: LexerActionExecutor| null,
						  startIndex: number, index: number, line: number, charPos: number):  void =>
	{
		if ( LexerATNSimulator.debug ) {
			java.lang.System.out.format(java.util.Locale.getDefault(), "ACTION %s\n", lexerActionExecutor);
		}

		// seek to after last char in token
		input.seek(index);
		this.line = line;
		this.charPositionInLine = charPos;

		if (lexerActionExecutor !== null && this.recog !== null) {
			lexerActionExecutor.execute(this.recog, input, startIndex);
		}
	}


	protected getReachableTarget = (trans: Transition| null, t: number):  ATNState | null => {
		if (trans.matches(t, Lexer.MIN_CHAR_VALUE, Lexer.MAX_CHAR_VALUE)) {
			return trans.target;
		}

		return null;
	}


	protected computeStartState = (input: CharStream| null,
											 p: ATNState| null):  ATNConfigSet | null =>
	{
		let  initialContext: PredictionContext = EmptyPredictionContext.Instance;
		let  configs: ATNConfigSet = new  OrderedATNConfigSet();
		for (let  i: number=0; i<p.getNumberOfTransitions(); i++) {
			let  target: ATNState = p.transition(i).target;
			let  c: LexerATNConfig = new  LexerATNConfig(target, i+1, initialContext);
			this.closure(input, c, configs, false, false, false);
		}
		return configs;
	}

	/**
	 * Since the alternatives within any lexer decision are ordered by
	 * preference, this method stops pursuing the closure as soon as an accept
	 * state is reached. After the first accept state is reached by depth-first
	 * search from {@code config}, all other (potentially reachable) states for
	 * this rule would have a lower priority.
	 *
	  @returns {@code true} if an accept state is reached, otherwise
	 * {@code false}.
	 */
	protected closure = (input: CharStream| null, config: LexerATNConfig| null, configs: ATNConfigSet| null, currentAltReachedAcceptState: boolean, speculative: boolean, treatEofAsEpsilon: boolean):  boolean => {
		if ( LexerATNSimulator.debug ) {
			java.lang.System.out.println("closure("+config.toString(this.recog, true)+")");
		}

		if ( config.state instanceof RuleStopState ) {
			if ( LexerATNSimulator.debug ) {
				if ( this.recog!==null ) {
					java.lang.System.out.format(java.util.Locale.getDefault(), "closure at %s rule stop %s\n", this.recog.getRuleNames()[config.state.ruleIndex], config);
				}
				else {
					java.lang.System.out.format(java.util.Locale.getDefault(), "closure at rule stop %s\n", config);
				}
			}

			if ( config.context === null || config.context.hasEmptyPath() ) {
				if (config.context === null || config.context.isEmpty()) {
					configs.add(config);
					return true;
				}
				else {
					configs.add(new  LexerATNConfig(config, config.state, EmptyPredictionContext.Instance));
					currentAltReachedAcceptState = true;
				}
			}

			if ( config.context!==null && !config.context.isEmpty() ) {
				for (let  i: number = 0; i < config.context.size(); i++) {
					if (config.context.getReturnState(i) !== PredictionContext.EMPTY_RETURN_STATE) {
						let  newContext: PredictionContext = config.context.getParent(i); // "pop" return state
						let  returnState: ATNState = this.atn.states.get(config.context.getReturnState(i));
						let  c: LexerATNConfig = new  LexerATNConfig(config, returnState, newContext);
						currentAltReachedAcceptState = this.closure(input, c, configs, currentAltReachedAcceptState, speculative, treatEofAsEpsilon);
					}
				}
			}

			return currentAltReachedAcceptState;
		}

		// optimization
		if ( !config.state.onlyHasEpsilonTransitions() ) {
			if (!currentAltReachedAcceptState || !config.hasPassedThroughNonGreedyDecision()) {
				configs.add(config);
			}
		}

		let  p: ATNState = config.state;
		for (let  i: number=0; i<p.getNumberOfTransitions(); i++) {
			let  t: Transition = p.transition(i);
			let  c: LexerATNConfig = this.getEpsilonTarget(input, config, t, configs, speculative, treatEofAsEpsilon);
			if ( c!==null ) {
				currentAltReachedAcceptState = this.closure(input, c, configs, currentAltReachedAcceptState, speculative, treatEofAsEpsilon);
			}
		}

		return currentAltReachedAcceptState;
	}

	// side-effect: can alter configs.hasSemanticContext

	protected getEpsilonTarget = (input: CharStream| null,
										   config: LexerATNConfig| null,
										   t: Transition| null,
										   configs: ATNConfigSet| null,
										   speculative: boolean,
										   treatEofAsEpsilon: boolean):  LexerATNConfig | null =>
	{
		let  c: LexerATNConfig = null;
		switch (t.getSerializationType()) {
			case Transition.RULE:{
				let  ruleTransition: RuleTransition = t as RuleTransition;
				let  newContext: PredictionContext =
					SingletonPredictionContext.create(config.context, ruleTransition.followState.stateNumber);
				c = new  LexerATNConfig(config, t.target, newContext);
				break;
}


			case Transition.PRECEDENCE:{
				throw new  java.lang.UnsupportedOperationException("Precedence predicates are not supported in lexers.");
}


			case Transition.PREDICATE:{
				/*  Track traversing semantic predicates. If we traverse,
				 we cannot add a DFA state for this "reach" computation
				 because the DFA would not test the predicate again in the
				 future. Rather than creating collections of semantic predicates
				 like v3 and testing them on prediction, v4 will test them on the
				 fly all the time using the ATN not the DFA. This is slower but
				 semantically it's not used that often. One of the key elements to
				 this predicate mechanism is not adding DFA states that see
				 predicates immediately afterwards in the ATN. For example,

				 a : ID {p1}? | ID {p2}? ;

				 should create the start state for rule 'a' (to save start state
				 competition), but should not create target of ID state. The
				 collection of ATN states the following ID references includes
				 states reached by traversing predicates. Since this is when we
				 test them, we cannot cash the DFA state target of ID.
			 */
				let  pt: PredicateTransition = t as PredicateTransition;
				if ( LexerATNSimulator.debug ) {
					java.lang.System.out.println("EVAL rule "+pt.ruleIndex+":"+pt.predIndex);
				}
				configs.hasSemanticContext = true;
				if (this.evaluatePredicate(input, pt.ruleIndex, pt.predIndex, speculative)) {
					c = new  LexerATNConfig(config, t.target);
				}
				break;
}


			case Transition.ACTION:{
				if (config.context === null || config.context.hasEmptyPath()) {
					// execute actions anywhere in the start rule for a token.
					//
					// TODO: if the entry rule is invoked recursively, some
					// actions may be executed during the recursive call. The
					// problem can appear when hasEmptyPath() is true but
					// isEmpty() is false. In this case, the config needs to be
					// split into two contexts - one with just the empty path
					// and another with everything but the empty path.
					// Unfortunately, the current algorithm does not allow
					// getEpsilonTarget to return two configurations, so
					// additional modifications are needed before we can support
					// the split operation.
					let  lexerActionExecutor: LexerActionExecutor = LexerActionExecutor.append(config.getLexerActionExecutor(), this.atn.lexerActions[(t as ActionTransition).actionIndex]);
					c = new  LexerATNConfig(config, t.target, lexerActionExecutor);
					break;
				}
				else {
					// ignore actions in referenced rules
					c = new  LexerATNConfig(config, t.target);
					break;
				}
}


			case Transition.EPSILON:{
				c = new  LexerATNConfig(config, t.target);
				break;
}


			case Transition.ATOM:
			case Transition.RANGE:
			case Transition.SET:{
				if (treatEofAsEpsilon) {
					if (t.matches(CharStream.EOF, Lexer.MIN_CHAR_VALUE, Lexer.MAX_CHAR_VALUE)) {
						c = new  LexerATNConfig(config, t.target);
						break;
					}
				}

				break;
}


default:

		}

		return c;
	}

	/**
	 * Evaluate a predicate specified in the lexer.
	 *
	 * <p>If {@code speculative} is {@code true}, this method was called before
	 * {@link #consume} for the matched character. This method should call
	 * {@link #consume} before evaluating the predicate to ensure position
	 * sensitive values, including {@link Lexer#getText}, {@link Lexer#getLine},
	 * and {@link Lexer#getCharPositionInLine}, properly reflect the current
	 * lexer state. This method should restore {@code input} and the simulator
	 * to the original state before returning (i.e. undo the actions made by the
	 * call to {@link #consume}.</p>
	 *
	 * @param input The input stream.
	 * @param ruleIndex The rule containing the predicate.
	 * @param predIndex The index of the predicate within the rule.
	 * @param speculative {@code true} if the current index in {@code input} is
	 * one character before the predicate's location.
	 *
	  @returns {@code true} if the specified predicate evaluates to
	 * {@code true}.
	 */
	protected evaluatePredicate = (input: CharStream| null, ruleIndex: number, predIndex: number, speculative: boolean):  boolean => {
		// assume true if no recognizer was provided
		if (this.recog === null) {
			return true;
		}

		if (!speculative) {
			return this.recog.sempred(null, ruleIndex, predIndex);
		}

		let  savedCharPositionInLine: number = this.charPositionInLine;
		let  savedLine: number = this.line;
		let  index: number = input.index();
		let  marker: number = input.mark();
		try {
			this.consume(input);
			return this.recog.sempred(null, ruleIndex, predIndex);
		}
		finally {
			this.charPositionInLine = savedCharPositionInLine;
			this.line = savedLine;
			input.seek(index);
			input.release(marker);
		}
	}

	protected captureSimState = (settings: LexerATNSimulator.SimState| null,
								   input: CharStream| null,
								   dfaState: DFAState| null):  void =>
	{
		settings.index = input.index();
		settings.line = this.line;
		settings.charPos = this.charPositionInLine;
		settings.dfaState = dfaState;
	}


	protected addDFAEdge(from: DFAState| null,
								  t: number,
								  q: ATNConfigSet| null):  DFAState | null;

	protected addDFAEdge(p: DFAState| null, t: number, q: DFAState| null):  void;



	protected addDFAEdge(fromOrP: DFAState | null, t: number, q: ATNConfigSet | DFAState | null):  DFAState | null |  void {
if (q instanceof ATNConfigSet)
	{
		/* leading to this call, ATNConfigSet.hasSemanticContext is used as a
		 * marker indicating dynamic predicate evaluation makes this edge
		 * dependent on the specific input sequence, so the static edge in the
		 * DFA should be omitted. The target DFAState is still created since
		 * execATN has the ability to resynchronize with the DFA state cache
		 * following the predicate evaluation step.
		 *
		 * TJP notes: next time through the DFA, we see a pred again and eval.
		 * If that gets us to a previously created (but dangling) DFA
		 * state, we can continue in pure DFA mode from there.
		 */
		let  suppressEdge: boolean = q.hasSemanticContext;
		q.hasSemanticContext = false;


		let  to: DFAState = this.addDFAState(q);

		if (suppressEdge) {
			return to;
		}

		this.addDFAEdge(from, t, to);
		return to;
	}
 else  {
let p = fromOrP as DFAState;
		if (t < LexerATNSimulator.MIN_DFA_EDGE || t > LexerATNSimulator.MAX_DFA_EDGE) {
			// Only track edges within the DFA bounds
			return;
		}

		if ( LexerATNSimulator.debug ) {
			java.lang.System.out.println("EDGE "+p+" -> "+q+" upon "+(t as CodePoint));
		}

		/* synchronized (p) */ {
			if ( p.edges===null ) {
				//  make room for tokens 1..n and -1 masquerading as index 0
				p.edges = new   Array<DFAState>(LexerATNSimulator.MAX_DFA_EDGE-LexerATNSimulator.MIN_DFA_EDGE+1);
			}
			p.edges[t - LexerATNSimulator.MIN_DFA_EDGE] = q; // connect
		}
	}

}


	/** Add a new DFA state if there isn't one with this set of
		configurations already. This method also detects the first
		configuration containing an ATN rule stop state. Later, when
		traversing the DFA, we will know which rule to accept.
	 */

	protected addDFAState = (configs: ATNConfigSet| null):  DFAState | null => {
		/* the lexer evaluates predicates on-the-fly; by this point configs
		 * should not contain any configurations with unevaluated predicates.
		 */
		/* assert !configs.hasSemanticContext; */ 

		let  proposed: DFAState = new  DFAState(configs);
		let  firstConfigWithRuleStopState: ATNConfig = null;
		for (let c of configs) {
			if ( c.state instanceof RuleStopState )	{
				firstConfigWithRuleStopState = c;
				break;
			}
		}

		if ( firstConfigWithRuleStopState!==null ) {
			proposed.isAcceptState = true;
			proposed.lexerActionExecutor = (firstConfigWithRuleStopState as LexerATNConfig).getLexerActionExecutor();
			proposed.prediction = this.atn.ruleToTokenType[firstConfigWithRuleStopState.state.ruleIndex];
		}

		let  dfa: DFA = this.decisionToDFA[this.mode];
		/* synchronized (dfa.states) */ {
			let  existing: DFAState = dfa.states.get(proposed);
			if ( existing!==null ) {
 return existing;
}


			let  newState: DFAState = proposed;

			newState.stateNumber = dfa.states.size();
			configs.setReadonly(true);
			newState.configs = configs;
			dfa.states.put(newState, newState);
			return newState;
		}
	}


	public readonly  getDFA = (mode: number):  DFA | null => {
		return this.decisionToDFA[mode];
	}

	/** Get the text matched so far for the current token.
	 */

	public getText = (input: CharStream| null):  java.lang.String | null => {
		// index is first lookahead char, don't include.
		return input.getText(Interval.of(this.startIndex, input.index()-1));
	}

	public getLine = ():  number => {
		return this.line;
	}

	public setLine = (line: number):  void => {
		this.line = line;
	}

	public getCharPositionInLine = ():  number => {
		return this.charPositionInLine;
	}

	public setCharPositionInLine = (charPositionInLine: number):  void => {
		this.charPositionInLine = charPositionInLine;
	}

	public consume = (input: CharStream| null):  void => {
		let  curChar: number = input.LA(1);
		if ( curChar==='\n' ) {
			this.line++;
			this.charPositionInLine=0;
		}
		else {
			this.charPositionInLine++;
		}
		input.consume();
	}


	public getTokenName = (t: number):  java.lang.String | null => {
		if ( t===-1 ) {
 return "EOF";
}

		//if ( atn.g!=null ) return atn.g.getTokenDisplayName(t);
		return "'"+t as CodePoint+"'";
	}
}

export namespace LexerATNSimulator {
	// @ts-expect-error, because of protected inner class.
	export type SimState = InstanceType<typeof LexerATNSimulator.SimState>;
}


