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
import { ATNConfig } from "./ATNConfig";
import { ATNState } from "./ATNState";
import { DecisionState } from "./DecisionState";
import { LexerActionExecutor } from "./LexerActionExecutor";
import { PredictionContext } from "./PredictionContext";
import { SemanticContext } from "./SemanticContext";
import { MurmurHash } from "../misc/MurmurHash";
import { ObjectEqualityComparator } from "../misc/ObjectEqualityComparator";




export  class LexerATNConfig extends ATNConfig {
	/**
	 * This is the backing field for {@link #getLexerActionExecutor}.
	 */
	private readonly  lexerActionExecutor:  LexerActionExecutor | null;

	private readonly  passedThroughNonGreedyDecision:  boolean;

	public constructor(c: LexerATNConfig| null, state: ATNState| null);

	public constructor(state: ATNState| null,
						  alt: number,
						  context: PredictionContext| null);

	public constructor(c: LexerATNConfig| null, state: ATNState| null,
						  lexerActionExecutor: LexerActionExecutor| null);

	public constructor(c: LexerATNConfig| null, state: ATNState| null,
						  context: PredictionContext| null);

	public constructor(state: ATNState| null,
						  alt: number,
						  context: PredictionContext| null,
						  lexerActionExecutor: LexerActionExecutor| null);
public constructor(cOrState: LexerATNConfig | ATNState | null, stateOrAlt: ATNState | number | null, contextOrLexerActionExecutor?: PredictionContext | LexerActionExecutor | null, lexerActionExecutor?: LexerActionExecutor | null) {
if (cOrState instanceof LexerATNConfig && stateOrAlt instanceof ATNState && contextOrLexerActionExecutor === undefined) {
const c = cOrState as LexerATNConfig;
const state = stateOrAlt as ATNState;
		super(c, state, c.context, c.semanticContext);
		this.lexerActionExecutor = c.lexerActionExecutor;
		this.passedThroughNonGreedyDecision = LexerATNConfig.checkNonGreedyDecision(c, state);
	}
 else if (cOrState instanceof ATNState && typeof stateOrAlt === "number" && contextOrLexerActionExecutor instanceof PredictionContext && lexerActionExecutor === undefined)
	{
const state = cOrState as ATNState;
const alt = stateOrAlt as number;
const context = contextOrLexerActionExecutor as PredictionContext;
		super(state, alt, context, SemanticContext.Empty.Instance);
		this.passedThroughNonGreedyDecision = false;
		this.lexerActionExecutor = null;
	}
 else if (cOrState instanceof LexerATNConfig && stateOrAlt instanceof ATNState && contextOrLexerActionExecutor instanceof LexerActionExecutor && lexerActionExecutor === undefined)
	{
const c = cOrState as LexerATNConfig;
const state = stateOrAlt as ATNState;
const lexerActionExecutor = contextOrLexerActionExecutor as LexerActionExecutor;
		super(c, state, c.context, c.semanticContext);
		this.lexerActionExecutor = lexerActionExecutor;
		this.passedThroughNonGreedyDecision = LexerATNConfig.checkNonGreedyDecision(c, state);
	}
 else if (cOrState instanceof LexerATNConfig && stateOrAlt instanceof ATNState && contextOrLexerActionExecutor instanceof PredictionContext && lexerActionExecutor === undefined) {
const c = cOrState as LexerATNConfig;
const state = stateOrAlt as ATNState;
const context = contextOrLexerActionExecutor as PredictionContext;
		super(c, state, context, c.semanticContext);
		this.lexerActionExecutor = c.lexerActionExecutor;
		this.passedThroughNonGreedyDecision = LexerATNConfig.checkNonGreedyDecision(c, state);
	}
 else 
	{
let state = cOrState as ATNState;
let alt = stateOrAlt as number;
let context = contextOrLexerActionExecutor as PredictionContext;
		super(state, alt, context, SemanticContext.Empty.Instance);
		this.lexerActionExecutor = lexerActionExecutor;
		this.passedThroughNonGreedyDecision = false;
	}

}


	/**
	 * Gets the {@link LexerActionExecutor} capable of executing the embedded
	 * action(s) for the current configuration.
	 */
	public readonly  getLexerActionExecutor = ():  LexerActionExecutor | null => {
		return this.lexerActionExecutor;
	}

	public readonly  hasPassedThroughNonGreedyDecision = ():  boolean => {
		return this.passedThroughNonGreedyDecision;
	}

	public hashCode = ():  number => {
		let  hashCode: number = MurmurHash.initialize(7);
		hashCode = MurmurHash.update(hashCode, this.state.stateNumber);
		hashCode = MurmurHash.update(hashCode, this.alt);
		hashCode = MurmurHash.update(hashCode, this.context);
		hashCode = MurmurHash.update(hashCode, this.semanticContext);
		hashCode = MurmurHash.update(hashCode, this.passedThroughNonGreedyDecision ? 1 : 0);
		hashCode = MurmurHash.update(hashCode, this.lexerActionExecutor);
		hashCode = MurmurHash.finish(hashCode, 6);
		return hashCode;
	}

	public equals = (other: ATNConfig| null):  boolean => {
		if (this === other) {
			return true;
		}
		else { if (!(other instanceof LexerATNConfig)) {
			return false;
		}
}


		let  lexerOther: LexerATNConfig = other as LexerATNConfig;
		if (this.passedThroughNonGreedyDecision !== lexerOther.passedThroughNonGreedyDecision) {
			return false;
		}

		if (!ObjectEqualityComparator.INSTANCE.equals(this.lexerActionExecutor, lexerOther.lexerActionExecutor)) {
			return false;
		}

		return super.equals(other);
	}

	private static checkNonGreedyDecision = (source: LexerATNConfig| null, target: ATNState| null):  boolean => {
		return source.passedThroughNonGreedyDecision
			|| target instanceof DecisionState && (target as DecisionState).nonGreedy;
	}
}
