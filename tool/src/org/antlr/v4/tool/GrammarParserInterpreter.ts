/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/* eslint-disable jsdoc/require-returns, jsdoc/require-param */


import { Rule } from "./Rule.js";
import { LeftRecursiveRule } from "./LeftRecursiveRule.js";
import { GrammarInterpreterRuleContext } from "./GrammarInterpreterRuleContext.js";
import { Grammar } from "./Grammar.js";
import { BailErrorStrategy, DefaultErrorStrategy, InterpreterRuleContext, Parser, ParserInterpreter, ParserRuleContext, RecognitionException, Token, TokenStream, Vocabulary, ATN, ATNState, DecisionState, PredictionMode, RuleStartState, StarLoopEntryState, Interval, Trees } from "antlr4ng";



/** A heavier weight {@link ParserInterpreter} that creates parse trees
 *  that track alternative numbers for subtree roots.
 *
 * @since 4.5.1
 *
 */
export  class GrammarParserInterpreter extends ParserInterpreter {

	/** We want to stop and track the first error but we cannot bail out like
	 *  {@link BailErrorStrategy} as consume() constructs trees. We make sure
	 *  to create an error node during recovery with this strategy. We
	 *  consume() 1 token during the "bail out of rule" mechanism in recover()
	 *  and let it fall out of the rule to finish constructing trees. For
	 *  recovery in line, we throw InputMismatchException to engage recover().
	 */
	public static BailButConsumeErrorStrategy =  class BailButConsumeErrorStrategy extends DefaultErrorStrategy {
		public  firstErrorTokenIndex = -1;
		@Override
public override  recover(recognizer: Parser, e: RecognitionException):  void {
			let  errIndex = recognizer.getInputStream().index();
			if ( this.firstErrorTokenIndex === -1 ) {
				this.firstErrorTokenIndex = errIndex; // latch
			}
//			System.err.println("recover: error at " + errIndex);
			let  input = recognizer.getInputStream();
			if ( input.index()<input.size()-1 ) { // don't consume() eof
				recognizer.consume(); // just kill this bad token and let it continue.
			}
		}

		@Override
public override  recoverInline(recognizer: Parser):  Token {
			let  errIndex = recognizer.getInputStream().index();
			if ( this.firstErrorTokenIndex === -1 ) {
				this.firstErrorTokenIndex = errIndex; // latch
			}
//			System.err.println("recoverInline: error at " + errIndex);
			let  e = new  java.util.InputMismatchException(recognizer);
//			TokenStream input = recognizer.getInputStream(); // seek EOF
//			input.seek(input.size() - 1);
			throw e;
		}

		@Override
public override  sync(recognizer: Parser):  void { } // don't consume anything; let it fail later
	};

	/** The grammar associated with this interpreter. Unlike the
	 *  {@link ParserInterpreter} from the standard distribution,
	 *  this can reference Grammar, which is in the tools area not
	 *  purely runtime.
	 */
	protected readonly  g:  Grammar;

	protected  decisionStatesThatSetOuterAltNumInContext:  BitSet;

	/** Cache {@link LeftRecursiveRule#getPrimaryAlts()} and
	 *  {@link LeftRecursiveRule#getRecursiveOpAlts()} for states in
	 *  {@link #decisionStatesThatSetOuterAltNumInContext}. It only
	 *  caches decisions in left-recursive rules.
	 */
	protected  stateToAltsMap:  Int32Array[];

	public  constructor(g: Grammar, atn: ATN, input: TokenStream);

	public  constructor(g: Grammar,
									grammarFileName: string,
									vocabulary: Vocabulary,
									ruleNames: Collection<string>,
									atn: ATN,
									input: TokenStream);
    public constructor(...args: unknown[]) {
		switch (args.length) {
			case 3: {
				const [g, atn, input] = args as [Grammar, ATN, TokenStream];


		super(g.fileName, g.getVocabulary(),
			  Arrays.asList(g.getRuleNames()),
			  atn, // must run ATN through serializer to set some state flags
			  input);
		this.g = g;
		this.decisionStatesThatSetOuterAltNumInContext = this.findOuterMostDecisionStates();
		this.stateToAltsMap = new  Int32Array(g.atn.states.size())[];
	

				break;
			}

			case 6: {
				const [g, grammarFileName, vocabulary, ruleNames, atn, input] = args as [Grammar, string, Vocabulary, Collection<string>, ATN, TokenStream];


		super(grammarFileName, vocabulary, ruleNames, atn, input);
		this.g = g;
	

				break;
			}

			default: {
				throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
			}
		}
	}


	/** Given an ambiguous parse information, return the list of ambiguous parse trees.
	 *  An ambiguity occurs when a specific token sequence can be recognized
	 *  in more than one way by the grammar. These ambiguities are detected only
	 *  at decision points.
	 *
	 *  The list of trees includes the actual interpretation (that for
	 *  the minimum alternative number) and all ambiguous alternatives.
	 *  The actual interpretation is always first.
	 *
	 *  This method reuses the same physical input token stream used to
	 *  detect the ambiguity by the original parser in the first place.
	 *  This method resets/seeks within but does not alter originalParser.
	 *
	 *  The trees are rooted at the node whose start..stop token indices
	 *  include the start and stop indices of this ambiguity event. That is,
	 *  the trees returned will always include the complete ambiguous subphrase
	 *  identified by the ambiguity event.  The subtrees returned will
	 *  also always contain the node associated with the overridden decision.
	 *
	 *  Be aware that this method does NOT notify error or parse listeners as
	 *  it would trigger duplicate or otherwise unwanted events.
	 *
	 *  This uses a temporary ParserATNSimulator and a ParserInterpreter
	 *  so we don't mess up any statistics, event lists, etc...
	 *  The parse tree constructed while identifying/making ambiguityInfo is
	 *  not affected by this method as it creates a new parser interp to
	 *  get the ambiguous interpretations.
	 *
	 *  Nodes in the returned ambig trees are independent of the original parse
	 *  tree (constructed while identifying/creating ambiguityInfo).
	 *
	 *  @since 4.5.1
	 *
	 *  @param g              From which grammar should we drive alternative
	 *                        numbers and alternative labels.
	 *
	 *  @param originalParser The parser used to create ambiguityInfo; it
	 *                        is not modified by this routine and can be either
	 *                        a generated or interpreted parser. It's token
	 *                        stream *is* reset/seek()'d.
	 *  @param tokens		  A stream of tokens to use with the temporary parser.
	 *                        This will often be just the token stream within the
	 *                        original parser but here it is for flexibility.
	 *
	 *  @param decision       Which decision to try different alternatives for.
	 *
	 *  @param alts           The set of alternatives to try while re-parsing.
	 *
	 *  @param startIndex	  The index of the first token of the ambiguous
	 *                        input or other input of interest.
	 *
	 *  @param stopIndex      The index of the last token of the ambiguous input.
	 *                        The start and stop indexes are used primarily to
	 *                        identify how much of the resulting parse tree
	 *                        to return.
	 *
	 *  @param startRuleIndex The start rule for the entire grammar, not
	 *                        the ambiguous decision. We re-parse the entire input
	 *                        and so we need the original start rule.
	 *
	 *  @return               The list of all possible interpretations of
	 *                        the input for the decision in ambiguityInfo.
	 *                        The actual interpretation chosen by the parser
	 *                        is always given first because this method
	 *                        retests the input in alternative order and
	 *                        ANTLR always resolves ambiguities by choosing
	 *                        the first alternative that matches the input.
	 *                        The subtree returned
	 *
	 *  @throws RecognitionException Throws upon syntax error while matching
	 *                               ambig input.
	 */
	public static  getAllPossibleParseTrees(g: Grammar,
	                                                               originalParser: Parser,
	                                                               tokens: TokenStream,
	                                                               decision: number,
	                                                               alts: BitSet,
	                                                               startIndex: number,
	                                                               stopIndex: number,
	                                                               startRuleIndex: number):  Array<ParserRuleContext> {
		let  trees = new  Array<ParserRuleContext>();
		// Create a new parser interpreter to parse the ambiguous subphrase
		let  parser = GrammarParserInterpreter.deriveTempParserInterpreter(g, originalParser, tokens);

		if ( stopIndex>=(tokens.size()-1) ) { // if we are pointing at EOF token
			// EOF is not in tree, so must be 1 less than last non-EOF token
			stopIndex = tokens.size()-2;
		}

		// get ambig trees
		let  alt = alts.nextSetBit(0);
		while ( alt>=0 ) {
			// re-parse entire input for all ambiguous alternatives
			// (don't have to do first as it's been parsed, but do again for simplicity
			//  using this temp parser.)
			parser.reset();
			parser.addDecisionOverride(decision, startIndex, alt);
			let  t = parser.parse(startRuleIndex);
			let  ambigSubTree =
				 Trees.getRootOfSubtreeEnclosingRegion(t, startIndex, stopIndex) as GrammarInterpreterRuleContext;
			// Use higher of overridden decision tree or tree enclosing all tokens
			if ( Trees.isAncestorOf(parser.getOverrideDecisionRoot(), ambigSubTree) ) {
				ambigSubTree =  parser.getOverrideDecisionRoot() as GrammarInterpreterRuleContext;
			}
			trees.add(ambigSubTree);
			alt = alts.nextSetBit(alt+1);
		}

		return trees;
	}

	/** Return a list of parse trees, one for each alternative in a decision
	 *  given the same input.
	 *
	 *  Very similar to {@link #getAllPossibleParseTrees} except
	 *  that it re-parses the input for every alternative in a decision,
	 *  not just the ambiguous ones (there is no alts parameter here).
	 *  This method also tries to reduce the size of the parse trees
	 *  by stripping away children of the tree that are completely out of range
	 *  of startIndex..stopIndex. Also, because errors are expected, we
	 *  use a specialized error handler that more or less bails out
	 *  but that also consumes the first erroneous token at least. This
	 *  ensures that an error node will be in the parse tree for display.
	 *
	 *  NOTES:
    // we must parse the entire input now with decision overrides
	// we cannot parse a subset because it could be that a decision
	// above our decision of interest needs to read way past
	// lookaheadInfo.stopIndex. It seems like there is no escaping
	// the use of a full and complete token stream if we are
	// resetting to token index 0 and re-parsing from the start symbol.
	// It's not easy to restart parsing somewhere in the middle like a
	// continuation because our call stack does not match the
	// tree stack because of left recursive rule rewriting. grrrr!
	 *
	 * @since 4.5.1
	 */
	public static  getLookaheadParseTrees(g: Grammar,
	                                                             originalParser: ParserInterpreter,
	                                                             tokens: TokenStream,
	                                                             startRuleIndex: number,
	                                                             decision: number,
	                                                             startIndex: number,
	                                                             stopIndex: number):  Array<ParserRuleContext> {
		let  trees = new  Array<ParserRuleContext>();
		// Create a new parser interpreter to parse the ambiguous subphrase
		let  parser = GrammarParserInterpreter.deriveTempParserInterpreter(g, originalParser, tokens);

		let  decisionState = originalParser.getATN().decisionToState.get(decision);

		for (let  alt = 1; alt<=decisionState.getTransitions().length; alt++) {
			// re-parse entire input for all ambiguous alternatives
			// (don't have to do first as it's been parsed, but do again for simplicity
			//  using this temp parser.)
			let  errorHandler =
				new  GrammarParserInterpreter.BailButConsumeErrorStrategy();
			parser.setErrorHandler(errorHandler);
			parser.reset();
			parser.addDecisionOverride(decision, startIndex, alt);
			let  tt = parser.parse(startRuleIndex);
			let  stopTreeAt = stopIndex;
			if ( errorHandler.firstErrorTokenIndex>=0 ) {
				stopTreeAt = errorHandler.firstErrorTokenIndex; // cut off rest at first error
			}
			let  overallRange = tt.getSourceInterval();
			if ( stopTreeAt>overallRange.b ) {
				// If we try to look beyond range of tree, stopTreeAt must be EOF
				// for which there is no EOF ref in grammar. That means tree
				// will not have node for stopTreeAt; limit to overallRange.b
				stopTreeAt = overallRange.b;
			}
			let  subtree =
				Trees.getRootOfSubtreeEnclosingRegion(tt,
				                                      startIndex,
				                                      stopTreeAt);
			// Use higher of overridden decision tree or tree enclosing all tokens
			if ( Trees.isAncestorOf(parser.getOverrideDecisionRoot(), subtree) ) {
				subtree = parser.getOverrideDecisionRoot();
			}
			Trees.stripChildrenOutOfRange(subtree, parser.getOverrideDecisionRoot(), startIndex, stopTreeAt);
			trees.add(subtree);
		}

		return trees;
	}

	/** Derive a new parser from an old one that has knowledge of the grammar.
	 *  The Grammar object is used to correctly compute outer alternative
	 *  numbers for parse tree nodes. A parser of the same type is created
	 *  for subclasses of {@link ParserInterpreter}.
	 */
	public static  deriveTempParserInterpreter(g: Grammar, originalParser: Parser, tokens: TokenStream):  ParserInterpreter {
		let  parser: ParserInterpreter;
		if (originalParser instanceof ParserInterpreter) {
			let  c = originalParser.getClass().asSubclass(ParserInterpreter.class);
			try {
				let  ctor = c.getConstructor(Grammar.class, ATN.class, TokenStream.class);
				parser = ctor.newInstance(g, originalParser.getATN(), originalParser.getTokenStream());
			} catch (e) {
if (e instanceof Exception) {
				throw new  IllegalArgumentException("can't create parser to match incoming "+originalParser.getClass().getSimpleName(), e);
			} else {
	throw e;
	}
}
		}
		else { // must've been a generated parser
//			IntegerList serialized = ATNSerializer.getSerialized(originalParser.getATN(), g.getLanguage());
//			ATN deserialized = new ATNDeserializer().deserialize(serialized.toArray());
			parser = new  ParserInterpreter(originalParser.getGrammarFileName(),
										   originalParser.getVocabulary(),
										   Arrays.asList(originalParser.getRuleNames()),
					                       originalParser.getATN(),
										   tokens);
		}

		parser.setInputStream(tokens);

		// Make sure that we don't get any error messages from using this temporary parser
		parser.setErrorHandler(new  BailErrorStrategy());
		parser.removeErrorListeners();
		parser.removeParseListeners();
		parser.getInterpreter().setPredictionMode(PredictionMode.LL_EXACT_AMBIG_DETECTION);
		return parser;
	}

	@Override
public override  reset():  void {
		super.reset();
		this.overrideDecisionRoot = null;
	}

	/** identify the ATN states where we need to set the outer alt number.
	 *  For regular rules, that's the block at the target to rule start state.
	 *  For left-recursive rules, we track the primary block, which looks just
	 *  like a regular rule's outer block, and the star loop block (always
	 *  there even if 1 alt).
	 */
	public  findOuterMostDecisionStates():  BitSet {
		let  track = new  BitSet(this.atn.states.size());
		let  numberOfDecisions = this.atn.getNumberOfDecisions();
		for (let  i = 0; i < numberOfDecisions; i++) {
			let  decisionState = this.atn.getDecisionState(i);
			let  startState = this.atn.ruleToStartState[decisionState.ruleIndex];
			// Look for StarLoopEntryState that is in any left recursive rule
			if ( decisionState instanceof StarLoopEntryState) {
				let  loopEntry = decisionState as StarLoopEntryState;
				if ( loopEntry.isPrecedenceDecision ) {
					// Recursive alts always result in a (...)* in the transformed
					// left recursive rule and that always has a BasicBlockStartState
					// even if just 1 recursive alt exists.
					let  blockStart = loopEntry.transition(0).target;
					// track the StarBlockStartState associated with the recursive alternatives
					track.set(blockStart.stateNumber);
				}
			}
			else {
 if ( startState.transition(0).target === decisionState ) {
				// always track outermost block for any rule if it exists
				track.set(decisionState.stateNumber);
			}
}

		}
		return track;
	}

	@Override
protected override  createInterpreterRuleContext(parent: ParserRuleContext,
																  invokingStateNumber: number,
																  ruleIndex: number):  InterpreterRuleContext
	{
		return new  GrammarInterpreterRuleContext(parent, invokingStateNumber, ruleIndex);
	}

	/** Override this method so that we can record which alternative
	 *  was taken at each decision point. For non-left recursive rules,
	 *  it's simple. Set decisionStatesThatSetOuterAltNumInContext
	 *  indicates which decision states should set the outer alternative number.
	 *
	 *  <p>Left recursive rules are much more complicated to deal with:
	 *  there is typically a decision for the primary alternatives and a
	 *  decision to choose between the recursive operator alternatives.
	 *  For example, the following left recursive rule has two primary and 2
	 *  recursive alternatives.</p>
	 *
		 e : e '*' e
		   | '-' INT
		   | e '+' e
		   | ID
		   ;

	 *  <p>ANTLR rewrites that rule to be</p>

		 e[int precedence]
			 : ('-' INT | ID)
			 ( {...}? '*' e[5]
			 | {...}? '+' e[3]
			 )*
			;

	 *
	 *  <p>So, there are two decisions associated with picking the outermost alt.
	 *  This complicates our tracking significantly. The outermost alternative number
	 *  is a function of the decision (ATN state) within a left recursive rule and the
	 *  predicted alternative coming back from adaptivePredict().
	 *
	 *  We use stateToAltsMap as a cache to avoid expensive calls to
	 *  getRecursiveOpAlts().
	 */
	@Override
protected override  visitDecisionState(p: DecisionState):  number {
		let  predictedAlt = super.visitDecisionState(p);
		if( p.getNumberOfTransitions() > 1) {
//			System.out.println("decision "+p.decision+": "+predictedAlt);
			if( p.decision === this.overrideDecision &&
				this._input.index() === this.overrideDecisionInputIndex )
			{
				this.overrideDecisionRoot = $outer.getContext() as GrammarInterpreterRuleContext;
			}
		}

		let  ctx = $outer._ctx as GrammarInterpreterRuleContext;
		if ( this.decisionStatesThatSetOuterAltNumInContext.get(p.stateNumber) ) {
			ctx.outerAltNum = predictedAlt;
			let  r = this.g.getRule(p.ruleIndex);
			if ( this.atn.ruleToStartState[r.index].isLeftRecursiveRule ) {
				let  alts = this.stateToAltsMap[p.stateNumber];
				let  lr =  this.g.getRule(p.ruleIndex) as LeftRecursiveRule;
				if (p.getStateType() === ATNState.BLOCK_START) {
					if ( alts===null ) {
						alts = lr.getPrimaryAlts();
						this.stateToAltsMap[p.stateNumber] = alts; // cache it
					}
				}
				else {
 if ( p.getStateType() === ATNState.STAR_BLOCK_START ) {
					if ( alts===null ) {
						alts = lr.getRecursiveOpAlts();
						this.stateToAltsMap[p.stateNumber] = alts; // cache it
					}
				}
}

				ctx.outerAltNum = alts[predictedAlt];
			}
		}

		return predictedAlt;
	}
}

// eslint-disable-next-line @typescript-eslint/no-namespace, no-redeclare
export namespace GrammarParserInterpreter {
	export type BailButConsumeErrorStrategy = InstanceType<typeof GrammarParserInterpreter.BailButConsumeErrorStrategy>;
}


