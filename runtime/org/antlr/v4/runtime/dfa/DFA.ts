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
import { DFASerializer } from "./DFASerializer";
import { DFAState } from "./DFAState";
import { LexerDFASerializer } from "./LexerDFASerializer";
import { Vocabulary } from "../Vocabulary";
import { VocabularyImpl } from "../VocabularyImpl";
import { ATNConfigSet } from "../atn/ATNConfigSet";
import { DecisionState } from "../atn/DecisionState";
import { StarLoopEntryState } from "../atn/StarLoopEntryState";




export  class DFA {
	/** A set of all DFA states. Use {@link Map} so we can get old state back
	 *  ({@link Set} only allows you to see if it's there).
     */

	public readonly  states?:  java.util.Map<DFAState, DFAState> = new  java.util.HashMap<DFAState, DFAState>();

	public  s0?:  DFAState;

	public readonly  decision:  number;

	/** From which ATN state did we create this DFA? */

	public readonly  atnStartState?:  DecisionState;

	/**
	 * {@code true} if this DFA is for a precedence decision; otherwise,
	 * {@code false}. This is the backing field for {@link #isPrecedenceDfa}.
	 */
	private readonly  precedenceDfa:  boolean;

	public constructor(atnStartState: DecisionState);

	public constructor(atnStartState: DecisionState, decision: number);
public constructor(atnStartState: DecisionState, decision?: number) {
const $this = (atnStartState: DecisionState, decision?: number): void => {
if (decision === undefined) {
		$this(atnStartState, 0);
	}
 else  {
		this.atnStartState = atnStartState;
		this.decision = decision;

		let  precedenceDfa: boolean = false;
		if (atnStartState instanceof StarLoopEntryState) {
			if ((atnStartState as StarLoopEntryState).isPrecedenceDecision) {
				precedenceDfa = true;
				let  precedenceState: DFAState = new  DFAState(new  ATNConfigSet());
				precedenceState.edges = new   Array<DFAState>(0);
				precedenceState.isAcceptState = false;
				precedenceState.requiresFullContext = false;
				this.s0 = precedenceState;
			}
		}

		this.precedenceDfa = precedenceDfa;
	}
};

$this(atnStartState, decision);

}


	/**
	 * Gets whether this DFA is a precedence DFA. Precedence DFAs use a special
	 * start state {@link #s0} which is not stored in {@link #states}. The
	 * {@link DFAState#edges} array for this start state contains outgoing edges
	 * supplying individual start states corresponding to specific precedence
	 * values.
	 *
	 * @return {@code true} if this is a precedence DFA; otherwise,
	 * {@code false}.
	 * @see Parser#getPrecedence()
	 */
	public readonly  isPrecedenceDfa = (): boolean => {
		return this.precedenceDfa;
	}

	/**
	 * Get the start state for a specific precedence value.
	 *
	 * @param precedence The current precedence.
	 * @return The start state corresponding to the specified precedence, or
	 * {@code null} if no start state exists for the specified precedence.
	 *
	 * @throws IllegalStateException if this is not a precedence DFA.
	 * @see #isPrecedenceDfa()
	 */
	public readonly  getPrecedenceStartState = (precedence: number): DFAState => {
		if (!this.isPrecedenceDfa()) {
			throw new  java.lang.IllegalStateException("Only precedence DFAs may contain a precedence start state.");
		}

		// s0.edges is never null for a precedence DFA
		if (precedence < 0 || precedence >= this.s0.edges.length) {
			return undefined;
		}

		return this.s0.edges[precedence];
	}

	/**
	 * Set the start state for a specific precedence value.
	 *
	 * @param precedence The current precedence.
	 * @param startState The start state corresponding to the specified
	 * precedence.
	 *
	 * @throws IllegalStateException if this is not a precedence DFA.
	 * @see #isPrecedenceDfa()
	 */
	public readonly  setPrecedenceStartState = (precedence: number, startState: DFAState): void => {
		if (!this.isPrecedenceDfa()) {
			throw new  java.lang.IllegalStateException("Only precedence DFAs may contain a precedence start state.");
		}

		if (precedence < 0) {
			return;
		}

		// synchronization on s0 here is ok. when the DFA is turned into a
		// precedence DFA, s0 will be initialized once and not updated again
		synchronized (this.s0) {
			// s0.edges is never null for a precedence DFA
			if (precedence >= this.s0.edges.length) {
				this.s0.edges = java.util.Arrays.copyOf(this.s0.edges, precedence + 1);
			}

			this.s0.edges[precedence] = startState;
		}
	}

	/**
	 * Sets whether this is a precedence DFA.
	 *
	 * @param precedenceDfa {@code true} if this is a precedence DFA; otherwise,
	 * {@code false}
	 *
	 * @throws UnsupportedOperationException if {@code precedenceDfa} does not
	 * match the value of {@link #isPrecedenceDfa} for the current DFA.
	 *
	 * @deprecated This method no longer performs any action.
	 */
	public readonly  setPrecedenceDfa = (precedenceDfa: boolean): void => {
		if (precedenceDfa !== this.isPrecedenceDfa()) {
			throw new  java.lang.UnsupportedOperationException("The precedenceDfa field cannot change after a DFA is constructed.");
		}
	}

	/**
	 * Return a list of all states in this DFA, ordered by state number.
	 */

	public getStates = (): java.util.List<DFAState> => {
		let  result: java.util.List<DFAState> = new  java.util.ArrayList<DFAState>(this.states.keySet());
		java.util.Collections.sort(result, new  class extends java.util.Comparator<DFAState> {
			public compare = (o1: DFAState, o2: DFAState): number => {
				return o1.stateNumber - o2.stateNumber;
			}
		}());

		return result;
	}

	public toString(): string;

	/**
	 * @deprecated Use {@link #toString(Vocabulary)} instead.
	 */
	public toString(tokenNames: string[]): string;

	public toString(vocabulary: Vocabulary): string;


	public toString(tokenNamesOrVocabulary?: string[] | Vocabulary):  string {
if (tokenNamesOrVocabulary === undefined) { return this.toString(VocabularyImpl.EMPTY_VOCABULARY); }
 else if (Array.isArray(tokenNamesOrVocabulary)) {
const tokenNames = tokenNamesOrVocabulary as string[];
		if ( this.s0===undefined ) {
 return "";
}

		let  serializer: DFASerializer = new  DFASerializer(this,tokenNames);
		return serializer.toString();
	}
 else  {
let vocabulary = tokenNamesOrVocabulary as Vocabulary;
		if (this.s0 === undefined) {
			return "";
		}

		let  serializer: DFASerializer = new  DFASerializer(this, vocabulary);
		return serializer.toString();
	}

}


	public toLexerString = (): string => {
		if ( this.s0===undefined ) {
 return "";
}

		let  serializer: DFASerializer = new  LexerDFASerializer(this);
		return serializer.toString();
	}

}
