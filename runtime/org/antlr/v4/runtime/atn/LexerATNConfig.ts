/* java2ts: keep */

/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { ATNConfig } from "./ATNConfig";
import { ATNState } from "./ATNState";
import { DecisionState } from "./DecisionState";
import { LexerActionExecutor } from "./LexerActionExecutor";
import { PredictionContext } from "./PredictionContext";
import { SemanticContext } from "./SemanticContext";
import { ObjectEqualityComparator } from "../misc/ObjectEqualityComparator";

import { MurmurHash } from "../../../../../../lib/MurmurHash";

export class LexerATNConfig extends ATNConfig {
    /**
     * This is the backing field for {@link #getLexerActionExecutor}.
     */
    private readonly lexerActionExecutor: LexerActionExecutor | null;

    private readonly passedThroughNonGreedyDecision: boolean;

    public constructor(c: LexerATNConfig, state: ATNState, lexerActionExecutor?: LexerActionExecutor);
    public constructor(c: LexerATNConfig, state: ATNState, context: PredictionContext | null);
    public constructor(state: ATNState, alt: number, context: PredictionContext | null,
        lexerActionExecutor?: LexerActionExecutor);
    public constructor(cOrState: LexerATNConfig | ATNState, stateOrAlt: ATNState | number,
        contextOrLexerActionExecutor?: PredictionContext | LexerActionExecutor | null,
        lexerActionExecutor?: LexerActionExecutor) {

        let state;
        let alt;
        let context: PredictionContext | null;
        let semanticContext: SemanticContext | null = SemanticContext.Empty.Instance;
        let executor: LexerActionExecutor | null = null;
        let flag = false;

        if (cOrState instanceof ATNState) {
            state = cOrState;
            alt = stateOrAlt as number;
            context = contextOrLexerActionExecutor as PredictionContext;
            executor = lexerActionExecutor ?? null;

            // @ts-ignore
            super(state, alt, context, semanticContext);
        } else {
            const config = cOrState;
            state = stateOrAlt as ATNState;
            semanticContext = config.semanticContext;

            if (!contextOrLexerActionExecutor) {
                context = config.context;
                executor = config.lexerActionExecutor;
            } else if (contextOrLexerActionExecutor instanceof PredictionContext) {
                context = contextOrLexerActionExecutor;
            } else {
                executor = contextOrLexerActionExecutor;
                context = config.context;
            }
            flag = LexerATNConfig.checkNonGreedyDecision(config, state);

            super(config, state, context, semanticContext);
        }

        this.lexerActionExecutor = executor;
        this.passedThroughNonGreedyDecision = flag;
    }

    private static checkNonGreedyDecision = (source: LexerATNConfig, target: ATNState): boolean => {
        return source.passedThroughNonGreedyDecision
            || (target instanceof DecisionState && target.nonGreedy);
    };

    /**
     * Gets the {@link LexerActionExecutor} capable of executing the embedded
     * action(s) for the current configuration.
     *
     * @returns tbd
     */
    public readonly getLexerActionExecutor = (): LexerActionExecutor | null => {
        return this.lexerActionExecutor;
    };

    public readonly hasPassedThroughNonGreedyDecision = (): boolean => {
        return this.passedThroughNonGreedyDecision;
    };

    public hashCode = (): number => {
        let hashCode: number = MurmurHash.initialize(7);
        hashCode = MurmurHash.update(hashCode, this.state.stateNumber);
        hashCode = MurmurHash.update(hashCode, this.alt);
        hashCode = MurmurHash.update(hashCode, this.context);
        hashCode = MurmurHash.update(hashCode, this.semanticContext);
        hashCode = MurmurHash.update(hashCode, this.passedThroughNonGreedyDecision ? 1 : 0);
        hashCode = MurmurHash.update(hashCode, this.lexerActionExecutor);
        hashCode = MurmurHash.finish(hashCode, 6);

        return hashCode;
    };

    public equals = (other: unknown): boolean => {
        if (this === other) {
            return true;
        }

        if (!(other instanceof LexerATNConfig)) {
            return false;
        }

        if (this.passedThroughNonGreedyDecision !== other.passedThroughNonGreedyDecision) {
            return false;
        }

        if (!ObjectEqualityComparator.INSTANCE.equals(this.lexerActionExecutor, other.lexerActionExecutor)) {
            return false;
        }

        return super.equals(other);
    };

}
