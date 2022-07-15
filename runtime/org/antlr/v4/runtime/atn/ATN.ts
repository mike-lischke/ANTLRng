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
import { ATNState } from "./ATNState";
import { ATNType } from "./ATNType";
import { DecisionState } from "./DecisionState";
import { LexerAction } from "./LexerAction";
import { LL1Analyzer } from "./LL1Analyzer";
import { RuleStartState } from "./RuleStartState";
import { RuleStopState } from "./RuleStopState";
import { RuleTransition } from "./RuleTransition";
import { TokensStartState } from "./TokensStartState";
import { RuleContext } from "../RuleContext";
import { Token } from "../Token";
import { IntervalSet } from "../misc/IntervalSet";




/** */
export  class ATN {
	public static readonly  INVALID_ALT_NUMBER:  number = 0;


	public readonly  states?:  java.util.List<ATNState> = new  java.util.ArrayList<ATNState>();

	/** Each subrule/rule is a decision point and we must track them so we
	 *  can go back later and build DFA predictors for them.  This includes
	 *  all the rules, subrules, optional blocks, ()+, ()* etc...
	 */
	public readonly  decisionToState?:  java.util.List<DecisionState> = new  java.util.ArrayList<DecisionState>();

	/**
	 * Maps from rule index to starting state number.
	 */
	public ruleToStartState?:  RuleStartState[];

	/**
	 * Maps from rule index to stop state number.
	 */
	public ruleToStopState?:  RuleStopState[];


	public readonly  modeNameToStartState?:  Map<string, TokensStartState> =
		new  java.util.LinkedHashMap<string, TokensStartState>();

	/**
	 * The type of the ATN.
	 */
	public readonly  grammarType?:  ATNType;

	/**
	 * The maximum value for any symbol recognized by a transition in the ATN.
	 */
	public readonly  maxTokenType:  number;

	/**
	 * For lexer ATNs, this maps the rule index to the resulting token type.
	 * For parser ATNs, this maps the rule index to the generated bypass token
	 * type if the
	 * {@link ATNDeserializationOptions#isGenerateRuleBypassTransitions}
	 * deserialization option was specified; otherwise, this is {@code null}.
	 */
	public ruleToTokenType:  number[];

	/**
	 * For lexer ATNs, this is an array of {@link LexerAction} objects which may
	 * be referenced by action transitions in the ATN.
	 */
	public lexerActions?:  LexerAction[];

	public readonly  modeToStartState?:  java.util.List<TokensStartState> = new  java.util.ArrayList<TokensStartState>();

	/** Used for runtime deserialization of ATNs from strings */
	public constructor(grammarType: ATNType, maxTokenType: number) {
		this.grammarType = grammarType;
		this.maxTokenType = maxTokenType;
	}

    /**
	 * Compute the set of valid tokens that can occur starting in {@code s} and
	 * staying in same rule. {@link Token#EPSILON} is in set if we reach end of
	 * rule.
     */
    public nextTokens(s: ATNState): IntervalSet;

	/** Compute the set of valid tokens that can occur starting in state {@code s}.
	 *  If {@code ctx} is null, the set of tokens will not include what can follow
	 *  the rule surrounding {@code s}. In other words, the set will be
	 *  restricted to tokens reachable staying within {@code s}'s rule.
	 */
	public nextTokens(s: ATNState, ctx: RuleContext): IntervalSet;


	/** Compute the set of valid tokens that can occur starting in state {@code s}.
	 *  If {@code ctx} is null, the set of tokens will not include what can follow
	 *  the rule surrounding {@code s}. In other words, the set will be
	 *  restricted to tokens reachable staying within {@code s}'s rule.
	 */
	public nextTokens(s: ATNState, ctx?: RuleContext):  IntervalSet {
if (ctx === undefined) {
        if ( s.nextTokenWithinRule !== undefined ) {
 return s.nextTokenWithinRule;
}

        s.nextTokenWithinRule = this.nextTokens(s, undefined);
        s.nextTokenWithinRule.setReadonly(true);
        return s.nextTokenWithinRule;
    }
 else  {
		let  anal: LL1Analyzer = new  LL1Analyzer(this);
		let  next: IntervalSet = anal.LOOK(s, ctx);
		return next;
	}

}


	public addState = (state: ATNState): void => {
		if (state !== undefined) {
			state.atn = this;
			state.stateNumber = this.states.size();
		}

		this.states.add(state);
	}

	public removeState = (state: ATNState): void => {
		this.states.set(state.stateNumber, undefined); // just free mem, don't shift states in list
	}

	public defineDecisionState = (s: DecisionState): number => {
		this.decisionToState.add(s);
		s.decision = this.decisionToState.size()-1;
		return s.decision;
	}

    public getDecisionState = (decision: number): DecisionState => {
        if ( !(this.decisionToState.isEmpty()) ) {
            return this.decisionToState.get(decision);
        }
        return undefined;
    }

	public getNumberOfDecisions = (): number => {
		return this.decisionToState.size();
	}

	/**
	 * Computes the set of input symbols which could follow ATN state number
	 * {@code stateNumber} in the specified full {@code context}. This method
	 * considers the complete parser context, but does not evaluate semantic
	 * predicates (i.e. all predicates encountered during the calculation are
	 * assumed true). If a path in the ATN exists from the starting state to the
	 * {@link RuleStopState} of the outermost context without matching any
	 * symbols, {@link Token#EOF} is added to the returned set.
	 *
	 * <p>If {@code context} is {@code null}, it is treated as {@link ParserRuleContext#EMPTY}.</p>
	 *
	 * Note that this does NOT give you the set of all tokens that could
	 * appear at a given token position in the input phrase.  In other words,
	 * it does not answer:
	 *
	 *   "Given a specific partial input phrase, return the set of all tokens
	 *    that can follow the last token in the input phrase."
	 *
	 * The big difference is that with just the input, the parser could
	 * land right in the middle of a lookahead decision. Getting
     * all *possible* tokens given a partial input stream is a separate
     * computation. See https://github.com/antlr/antlr4/issues/1428
	 *
	 * For this function, we are specifying an ATN state and call stack to compute
	 * what token(s) can come next and specifically: outside of a lookahead decision.
	 * That is what you want for error reporting and recovery upon parse error.
	 *
	 * @param stateNumber the ATN state number
	 * @param context the full parse context
	 * @return The set of potentially valid input symbols which could follow the
	 * specified state in the specified context.
	 * @throws IllegalArgumentException if the ATN does not contain a state with
	 * number {@code stateNumber}
	 */
	public getExpectedTokens = (stateNumber: number, context: RuleContext): IntervalSet => {
		if (stateNumber < 0 || stateNumber >= this.states.size()) {
			throw new  java.lang.IllegalArgumentException("Invalid state number.");
		}

		let  ctx: RuleContext = context;
		let  s: ATNState = this.states.get(stateNumber);
		let  following: IntervalSet = this.nextTokens(s);
		if (!(following.contains(Token.EPSILON))) {
			return following;
		}

		let  expected: IntervalSet = new  IntervalSet();
		expected.addAll(following);
		expected.remove(Token.EPSILON);
		while (ctx !== undefined && ctx.invokingState >= 0 && following.contains(Token.EPSILON)) {
			let  invokingState: ATNState = this.states.get(ctx.invokingState);
			let  rt: RuleTransition = invokingState.transition(0) as RuleTransition;
			following = this.nextTokens(rt.followState);
			expected.addAll(following);
			expected.remove(Token.EPSILON);
			ctx = ctx.parent;
		}

		if (following.contains(Token.EPSILON)) {
			expected.add(Token.EOF);
		}

		return expected;
	}
}
