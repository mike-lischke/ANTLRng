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
import { CharStream } from "./CharStream";
import { FailedPredicateException } from "./FailedPredicateException";
import { InputMismatchException } from "./InputMismatchException";
import { InterpreterRuleContext } from "./InterpreterRuleContext";
import { Parser } from "./Parser";
import { ParserRuleContext } from "./ParserRuleContext";
import { RecognitionException } from "./RecognitionException";
import { Token } from "./Token";
import { TokenSource } from "./TokenSource";
import { TokenStream } from "./TokenStream";
import { Vocabulary } from "./Vocabulary";
import { VocabularyImpl } from "./VocabularyImpl";
import { ATN } from "./atn/ATN";
import { ATNState } from "./atn/ATNState";
import { ActionTransition } from "./atn/ActionTransition";
import { AtomTransition } from "./atn/AtomTransition";
import { DecisionState } from "./atn/DecisionState";
import { LoopEndState } from "./atn/LoopEndState";
import { ParserATNSimulator } from "./atn/ParserATNSimulator";
import { PrecedencePredicateTransition } from "./atn/PrecedencePredicateTransition";
import { PredicateTransition } from "./atn/PredicateTransition";
import { PredictionContextCache } from "./atn/PredictionContextCache";
import { RuleStartState } from "./atn/RuleStartState";
import { RuleTransition } from "./atn/RuleTransition";
import { StarLoopEntryState } from "./atn/StarLoopEntryState";
import { Transition } from "./atn/Transition";
import { DFA } from "./dfa/DFA";
import { Pair } from "./misc/Pair";


import { S } from "../../../../../lib/templates";


/** A parser simulator that mimics what ANTLR's generated
 *  parser code does. A ParserATNSimulator is used to make
 *  predictions via adaptivePredict but this class moves a pointer through the
 *  ATN to simulate parsing. ParserATNSimulator just
 *  makes us efficient rather than having to backtrack, for example.
 *
 *  This properly creates parse trees even for left recursive rules.
 *
 *  We rely on the left recursive rule invocation and special predicate
 *  transitions to make left recursive rules work.
 *
 *  See TestParserInterpreter for examples.
 */
export  class ParserInterpreter extends Parser {
	protected readonly  grammarFileName:  java.lang.String | null;
	protected readonly  atn:  ATN | null;

	protected readonly  decisionToDFA:  DFA[] | null; // not shared like it is for generated parsers
	protected readonly  sharedContextCache:  PredictionContextCache | null = new  PredictionContextCache();

	protected readonly  tokenNames:  java.lang.String[] | null;
	protected readonly  ruleNames:  java.lang.String[] | null;

	private readonly  vocabulary:  Vocabulary | null;

	/** This stack corresponds to the _parentctx, _parentState pair of locals
	 *  that would exist on call stack frames with a recursive descent parser;
	 *  in the generated function for a left-recursive rule you'd see:
	 *
	 *  private EContext e(int _p) throws RecognitionException {
	 *      ParserRuleContext _parentctx = _ctx;    // Pair.a
	 *      int _parentState = getState();          // Pair.b
	 *      ...
	 *  }
	 *
	 *  Those values are used to create new recursive rule invocation contexts
	 *  associated with left operand of an alt like "expr '*' expr".
	 */
	protected readonly  _parentContextStack:  Deque<Pair<ParserRuleContext, java.lang.Integer>> | null =
		new  ArrayDeque<Pair<ParserRuleContext, java.lang.Integer>>();

	/** We need a map from (decision,inputIndex)->forced alt for computing ambiguous
	 *  parse trees. For now, we allow exactly one override.
	 */
	protected overrideDecision:  number = -1;
	protected overrideDecisionInputIndex:  number = -1;
	protected overrideDecisionAlt:  number = -1;
	protected overrideDecisionReached:  boolean = false; // latch and only override once; error might trigger infinite loop

	/** What is the current context when we override a decisions?  This tells
	 *  us what the root of the parse tree is when using override
	 *  for an ambiguity/lookahead check.
	 */
	protected overrideDecisionRoot:  InterpreterRuleContext | null = null;


	protected rootContext:  InterpreterRuleContext | null;

	/**
	 * @deprecated Use {@link #ParserInterpreter(String, Vocabulary, Collection, ATN, TokenStream)} instead.
	 */
	/* eslint-disable constructor-super, @typescript-eslint/no-unsafe-call */
public constructor(grammarFileName: java.lang.String| null, tokenNames: java.util.Collection<java.lang.String>| null,
							 ruleNames: java.util.Collection<java.lang.String>| null, atn: ATN| null, input: TokenStream| null);

	public constructor(grammarFileName: java.lang.String| null, vocabulary: Vocabulary| null,
							 ruleNames: java.util.Collection<java.lang.String>| null, atn: ATN| null, input: TokenStream| null);
/* @ts-expect-error, because of the super() call in the closure. */
public constructor(grammarFileName: java.lang.String | null, tokenNamesOrVocabulary: java.util.Collection<java.lang.String> | Vocabulary | null, ruleNames: java.util.Collection<java.lang.String> | null, atn: ATN | null, input: TokenStream | null) {
const $this = (grammarFileName: java.lang.String | null, tokenNamesOrVocabulary: java.util.Collection<java.lang.String> | Vocabulary | null, ruleNames: java.util.Collection<java.lang.String> | null, atn: ATN | null, input: TokenStream | null): void => {
if (tokenNamesOrVocabulary instanceof java.util.Collection) {
const tokenNames = tokenNamesOrVocabulary as java.util.Collection<java.lang.String>;
		$this(grammarFileName, VocabularyImpl.fromTokenNames(tokenNames.toArray(new   Array<java.lang.String>(0))), ruleNames, atn, input);
	}
 else 
	{
let vocabulary = tokenNamesOrVocabulary as Vocabulary;
/* @ts-expect-error, because of the super() call in the closure. */
		super(input);
		this.grammarFileName = grammarFileName;
		this.atn = atn;
		this.tokenNames = new   Array<java.lang.String>(atn.maxTokenType);
		for (let  i: number = 0; i < this.tokenNames.length; i++) {
			this.tokenNames[i] = vocabulary.getDisplayName(i);
		}

		this.ruleNames = ruleNames.toArray(new   Array<java.lang.String>(0));
		this.vocabulary = vocabulary;

		// init decision DFA
		let  numberOfDecisions: number = atn.getNumberOfDecisions();
		this.decisionToDFA = new   Array<DFA>(numberOfDecisions);
		for (let  i: number = 0; i < numberOfDecisions; i++) {
			let  decisionState: DecisionState = atn.getDecisionState(i);
			this.decisionToDFA[i] = new  DFA(decisionState, i);
		}

		// get atn simulator that knows how to do predictions
		this.setInterpreter(new  ParserATNSimulator(this, atn,
											  this.decisionToDFA,
											  this.sharedContextCache));
	}
};

$this(grammarFileName, tokenNamesOrVocabulary, ruleNames, atn, input);

}
/* eslint-enable constructor-super, @typescript-eslint/no-unsafe-call */

	public reset = ():  void => {
		super.reset();
		this.overrideDecisionReached = false;
		this.overrideDecisionRoot = null;
	}

	public getATN = ():  ATN | null => {
		return this.atn;
	}

	public getTokenNames = ():  java.lang.String[] | null => {
		return this.tokenNames;
	}

	public getVocabulary = ():  Vocabulary | null => {
		return this.vocabulary;
	}

	public getRuleNames = ():  java.lang.String[] | null => {
		return this.ruleNames;
	}

	public getGrammarFileName = ():  java.lang.String | null => {
		return this.grammarFileName;
	}

	/** Begin parsing at startRuleIndex */
	public parse = (startRuleIndex: number):  ParserRuleContext | null => {
		let  startRuleStartState: RuleStartState = this.atn.ruleToStartState[startRuleIndex];

		this.rootContext = this.createInterpreterRuleContext(null, ATNState.INVALID_STATE_NUMBER, startRuleIndex);
		if (startRuleStartState.isLeftRecursiveRule) {
			this.enterRecursionRule(this.rootContext, startRuleStartState.stateNumber, startRuleIndex, 0);
		}
		else {
			this.enterRule(this.rootContext, startRuleStartState.stateNumber, startRuleIndex);
		}

		while ( true ) {
			let  p: ATNState = this.getATNState();
			switch ( p.getStateType() ) {
			case ATNState.RULE_STOP :{
				// pop; return from rule
				if ( this._ctx.isEmpty() ) {
					if (startRuleStartState.isLeftRecursiveRule) {
						let  result: ParserRuleContext = this._ctx;
						let  parentContext: Pair<ParserRuleContext, java.lang.Integer> = this._parentContextStack.pop();
						this.unrollRecursionContexts(parentContext.a);
						return result;
					}
					else {
						this.exitRule();
						return this.rootContext;
					}
				}

				this.visitRuleStopState(p);
				break;
}


			default :{
				try {
					this.visitState(p);
				} catch (e) {
if (e instanceof RecognitionException) {
					this.setState(this.atn.ruleToStopState[p.ruleIndex].stateNumber);
					this.getContext().exception = e;
					this.getErrorHandler().reportError(this, e);
					this.recover(e);
				} else {
	throw e;
	}
}

				break;
}

			}
		}
	}

	public enterRecursionRule = (localctx: ParserRuleContext| null, state: number, ruleIndex: number, precedence: number):  void => {
		let  pair: Pair<ParserRuleContext, java.lang.Integer> = new  Pair<ParserRuleContext, java.lang.Integer>(this._ctx, localctx.invokingState);
		this._parentContextStack.push(pair);
		super.enterRecursionRule(localctx, state, ruleIndex, precedence);
	}

	protected getATNState = ():  ATNState | null => {
		return this.atn.states.get(this.getState());
	}

	protected visitState = (p: ATNState| null):  void => {
//		System.out.println("visitState "+p.stateNumber);
		let  predictedAlt: number = 1;
		if ( p instanceof DecisionState ) {
			predictedAlt = this.visitDecisionState( p as DecisionState);
		}

		let  transition: Transition = p.transition(predictedAlt - 1);
		switch (transition.getSerializationType()) {
			case Transition.EPSILON:{
				if ( p.getStateType()===ATNState.STAR_LOOP_ENTRY &&
					 (p as StarLoopEntryState).isPrecedenceDecision &&
					 !(transition.target instanceof LoopEndState))
				{
					// We are at the start of a left recursive rule's (...)* loop
					// and we're not taking the exit branch of loop.
					let  localctx: InterpreterRuleContext =
						this.createInterpreterRuleContext(this._parentContextStack.peek().a,
													 this._parentContextStack.peek().b,
													 this._ctx.getRuleIndex());
					this.pushNewRecursionContext(localctx,
											this.atn.ruleToStartState[p.ruleIndex].stateNumber,
											this._ctx.getRuleIndex());
				}
				break;
}


			case Transition.ATOM:{
				this.match((transition as AtomTransition).label);
				break;
}


			case Transition.RANGE:
			case Transition.SET:
			case Transition.NOT_SET:{
				if (!transition.matches(this._input.LA(1), Token.MIN_USER_TOKEN_TYPE, 65535)) {
					this.recoverInline();
				}
				this.matchWildcard();
				break;
}


			case Transition.WILDCARD:{
				this.matchWildcard();
				break;
}


			case Transition.RULE:{
				let  ruleStartState: RuleStartState = transition.target as RuleStartState;
				let  ruleIndex: number = ruleStartState.ruleIndex;
				let  newctx: InterpreterRuleContext = this.createInterpreterRuleContext(this._ctx, p.stateNumber, ruleIndex);
				if (ruleStartState.isLeftRecursiveRule) {
					this.enterRecursionRule(newctx, ruleStartState.stateNumber, ruleIndex, (transition as RuleTransition).precedence);
				}
				else {
					this.enterRule(newctx, transition.target.stateNumber, ruleIndex);
				}
				break;
}


			case Transition.PREDICATE:{
				let  predicateTransition: PredicateTransition = transition as PredicateTransition;
				if (!this.sempred(this._ctx, predicateTransition.ruleIndex, predicateTransition.predIndex)) {
					throw new  FailedPredicateException(this);
				}

				break;
}


			case Transition.ACTION:{
				let  actionTransition: ActionTransition = transition as ActionTransition;
				this.action(this._ctx, actionTransition.ruleIndex, actionTransition.actionIndex);
				break;
}


			case Transition.PRECEDENCE:{
				if (!this.precpred(this._ctx, (transition as PrecedencePredicateTransition).precedence)) {
					throw new  FailedPredicateException(this, java.lang.String.format(S`precpred(_ctx, %d)`, (transition as PrecedencePredicateTransition).precedence));
				}
				break;
}


			default:{
				throw new  java.lang.UnsupportedOperationException(S`Unrecognized ATN transition type.`);
}

		}

		this.setState(transition.target.stateNumber);
	}

	/** Method visitDecisionState() is called when the interpreter reaches
	 *  a decision state (instance of DecisionState). It gives an opportunity
	 *  for subclasses to track interesting things.
	 */
	protected visitDecisionState = (p: DecisionState| null):  number => {
		let  predictedAlt: number = 1;
		if ( p.getNumberOfTransitions()>1 ) {
			this.getErrorHandler().sync(this);
			let  decision: number = p.decision;
			if ( decision === this.overrideDecision && this._input.index() === this.overrideDecisionInputIndex &&
			     !this.overrideDecisionReached )
			{
				predictedAlt = this.overrideDecisionAlt;
				this.overrideDecisionReached = true;
			}
			else {
				predictedAlt = this.getInterpreter().adaptivePredict(this._input, decision, this._ctx);
			}
		}
		return predictedAlt;
	}

	/** Provide simple "factory" for InterpreterRuleContext's.
	 *  @since 4.5.1
	 */
	protected createInterpreterRuleContext = (
		parent: ParserRuleContext| null,
		invokingStateNumber: number,
		ruleIndex: number):  InterpreterRuleContext | null =>
	{
		return new  InterpreterRuleContext(parent, invokingStateNumber, ruleIndex);
	}

	protected visitRuleStopState = (p: ATNState| null):  void => {
		let  ruleStartState: RuleStartState = this.atn.ruleToStartState[p.ruleIndex];
		if (ruleStartState.isLeftRecursiveRule) {
			let  parentContext: Pair<ParserRuleContext, java.lang.Integer> = this._parentContextStack.pop();
			this.unrollRecursionContexts(parentContext.a);
			this.setState(parentContext.b);
		}
		else {
			this.exitRule();
		}

		let  ruleTransition: RuleTransition = this.atn.states.get(this.getState()).transition(0) as RuleTransition;
		this.setState(ruleTransition.followState.stateNumber);
	}

	/** Override this parser interpreters normal decision-making process
	 *  at a particular decision and input token index. Instead of
	 *  allowing the adaptive prediction mechanism to choose the
	 *  first alternative within a block that leads to a successful parse,
	 *  force it to take the alternative, 1..n for n alternatives.
	 *
	 *  As an implementation limitation right now, you can only specify one
	 *  override. This is sufficient to allow construction of different
	 *  parse trees for ambiguous input. It means re-parsing the entire input
	 *  in general because you're never sure where an ambiguous sequence would
	 *  live in the various parse trees. For example, in one interpretation,
	 *  an ambiguous input sequence would be matched completely in expression
	 *  but in another it could match all the way back to the root.
	 *
	 *  s : e '!'? ;
	 *  e : ID
	 *    | ID '!'
	 *    ;
	 *
	 *  Here, x! can be matched as (s (e ID) !) or (s (e ID !)). In the first
	 *  case, the ambiguous sequence is fully contained only by the root.
	 *  In the second case, the ambiguous sequences fully contained within just
	 *  e, as in: (e ID !).
	 *
	 *  Rather than trying to optimize this and make
	 *  some intelligent decisions for optimization purposes, I settled on
	 *  just re-parsing the whole input and then using
	 *  {link Trees#getRootOfSubtreeEnclosingRegion} to find the minimal
	 *  subtree that contains the ambiguous sequence. I originally tried to
	 *  record the call stack at the point the parser detected and ambiguity but
	 *  left recursive rules create a parse tree stack that does not reflect
	 *  the actual call stack. That impedance mismatch was enough to make
	 *  it it challenging to restart the parser at a deeply nested rule
	 *  invocation.
	 *
	 *  Only parser interpreters can override decisions so as to avoid inserting
	 *  override checking code in the critical ALL(*) prediction execution path.
	 *
	 *  @since 4.5.1
	 */
	public addDecisionOverride = (decision: number, tokenIndex: number, forcedAlt: number):  void => {
		this.overrideDecision = decision;
		this.overrideDecisionInputIndex = tokenIndex;
		this.overrideDecisionAlt = forcedAlt;
	}

	public getOverrideDecisionRoot = ():  InterpreterRuleContext | null => {
		return this.overrideDecisionRoot;
	}

	/** Rely on the error handler for this parser but, if no tokens are consumed
	 *  to recover, add an error node. Otherwise, nothing is seen in the parse
	 *  tree.
	 */
	protected recover = (e: RecognitionException| null):  void => {
		let  i: number = this._input.index();
		this.getErrorHandler().recover(this, e);
		if ( this._input.index()===i ) {
			// no input consumed, better add an error node
			if ( e instanceof InputMismatchException ) {
				let  ime: InputMismatchException = e as InputMismatchException;
				let  tok: Token = e.getOffendingToken();
				let  expectedTokenType: number = Token.INVALID_TYPE;
				if ( !ime.getExpectedTokens().isNil() ) {
					expectedTokenType = ime.getExpectedTokens().getMinElement(); // get any element
				}
				let  errToken: Token =
					this.getTokenFactory().create(new  Pair<TokenSource, CharStream>(tok.getTokenSource(), tok.getTokenSource().getInputStream()),
				                             expectedTokenType, tok.getText(),
				                             Token.DEFAULT_CHANNEL,
				                            -1, -1, // invalid start/stop
				                             tok.getLine(), tok.getCharPositionInLine());
				this._ctx.addErrorNode(this.createErrorNode(this._ctx,errToken));
			}
			else { // NoViableAlt
				let  tok: Token = e.getOffendingToken();
				let  errToken: Token =
					this.getTokenFactory().create(new  Pair<TokenSource, CharStream>(tok.getTokenSource(), tok.getTokenSource().getInputStream()),
				                             Token.INVALID_TYPE, tok.getText(),
				                             Token.DEFAULT_CHANNEL,
				                            -1, -1, // invalid start/stop
				                             tok.getLine(), tok.getCharPositionInLine());
				this._ctx.addErrorNode(this.createErrorNode(this._ctx,errToken));
			}
		}
	}

	protected recoverInline = ():  Token | null => {
		return this._errHandler.recoverInline(this);
	}

	/** Return the root of the parse, which can be useful if the parser
	 *  bails out. You still can access the top node. Note that,
	 *  because of the way left recursive rules add children, it's possible
	 *  that the root will not have any children if the start rule immediately
	 *  called and left recursive rule that fails.
	 *
	 *
	 */
	public getRootContext = ():  InterpreterRuleContext | null => {
		return this.rootContext;
	}
}

