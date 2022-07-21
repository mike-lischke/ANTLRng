/* java2ts: keep */

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

/* eslint-disable jsdoc/require-returns */

import { java } from "../../../../../../lib/java/java";
import { ATNConfigSet } from "../atn/ATNConfigSet";
import { LexerActionExecutor } from "../atn/LexerActionExecutor";
import { SemanticContext } from "../atn/SemanticContext";
import { MurmurHash } from "../misc/MurmurHash";

/**
 * A DFA state represents a set of possible ATN configurations.
 *  As Aho, Sethi, Ullman p. 117 says "The DFA uses its state
 *  to keep track of all possible states the ATN can be in after
 *  reading each input symbol.  That is to say, after reading
 *  input a1a2..an, the DFA is in a state that represents the
 *  subset T of the states of the ATN that are reachable from the
 *  ATN's start state along some path labeled a1a2..an."
 *  In conventional NFA&rarr;DFA conversion, therefore, the subset T
 *  would be a bitset representing the set of states the
 *  ATN could be in.  We need to track the alt predicted by each
 *  state as well, however.  More importantly, we need to maintain
 *  a stack of states, tracking the closure operations as they
 *  jump from rule to rule, emulating rule invocations (method calls).
 *  I have to add a stack to simulate the proper lookahead sequences for
 *  the underlying LL grammar from which the ATN was derived.
 *
 *  <p>I use a set of ATNConfig objects not simple states.  An ATNConfig
 *  is both a state (ala normal conversion) and a RuleContext describing
 *  the chain of rules (if any) followed to arrive at that state.</p>
 *
 *  <p>A DFA state may have multiple references to a particular state,
 *  but with different ATN contexts (with same or different alts)
 *  meaning that state was reached via a different set of rule invocations.</p>
 */
export class DFAState {
    public stateNumber = -1;

    public configs?: ATNConfigSet = new ATNConfigSet();

    /**
     * {@code edges[symbol]} points to target of symbol. Shift up by 1 so (-1)
     *  {@link Token#EOF} maps to {@code edges[0]}.
     */

    public edges?: DFAState[];

    public isAcceptState = false;

    /**
     * if accept state, what ttype do we match or alt do we predict?
     *  This is set to {@link ATN#INVALID_ALT_NUMBER} when {@link #predicates}{@code !=null} or
     *  {@link #requiresFullContext}.
     */
    public prediction: number;

    public lexerActionExecutor?: LexerActionExecutor;

    /**
     * Indicates that this state was created during SLL prediction that
     * discovered a conflict between the configurations in the state. Future
     * {@link ParserATNSimulator#execATN} invocations immediately jumped doing
     * full context prediction if this field is true.
     */
    public requiresFullContext: boolean;

    /**
     * During SLL parsing, this is a list of predicates associated with the
     *  ATN configurations of the DFA state. When we have predicates,
     *  {@link #requiresFullContext} is {@code false} since full context prediction evaluates predicates
     *  on-the-fly. If this is not null, then {@link #prediction} is
     *  {@link ATN#INVALID_ALT_NUMBER}.
     *
     *  <p>We only use these for non-{@link #requiresFullContext} but conflicting states. That
     *  means we know from the context (it's $ or we don't dip into outer
     *  context) that it's an ambiguity not a conflict.</p>
     *
     *  <p>This list is computed by {@link ParserATNSimulator#predicateDFAState}.</p>
     */

    public predicates?: DFAState.PredPrediction[];

    /** Map a predicate to a predicted alternative. */
    public static PredPrediction = class PredPrediction {

        public pred?: SemanticContext; // never null; at least SemanticContext.NONE
        public alt: number;
        public constructor(pred: SemanticContext, alt: number) {
            this.alt = alt;
            this.pred = pred;
        }
        public toString = (): string => {
            return "(" + this.pred + ", " + this.alt + ")";
        };
    };

    public constructor();
    public constructor(stateNumber: number);
    public constructor(configs: ATNConfigSet);
    public constructor(stateNumberOrConfigs?: number | ATNConfigSet) {
        if (stateNumberOrConfigs === undefined) {
            // Nothing.
        } else if (typeof stateNumberOrConfigs === "number") {
            const stateNumber = stateNumberOrConfigs; this.stateNumber = stateNumber;
        } else {
            const configs = stateNumberOrConfigs; this.configs = configs;
        }
    }

    /**
     * Get the set of all alts mentioned by all ATN configurations in this DFA state.
     */
    public getAltSet = (): Set<number> | undefined => {
        const alts = new Set<number>();
        if (this.configs) {
            for (let i = 0; i < this.configs.size(); ++i) {
                alts.add(this.configs.get(i).alt);
            }
        }

        if (alts.size === 0) {
            return undefined;
        }

        return alts;
    };

    public hashCode = (): number => {
        let hash: number = MurmurHash.initialize(7);
        hash = MurmurHash.update(hash, this.configs.hashCode());
        hash = MurmurHash.finish(hash, 1);

        return hash;
    };

    /**
     * Two {@link DFAState} instances are equal if their ATN configuration sets
     * are the same. This method is used to see if a state already exists.
     *
     * <p>Because the number of alternatives and number of ATN configurations are
     * finite, there is a finite number of DFA states that can be processed.
     * This is necessary to show that the algorithm terminates.</p>
     *
     * <p>Cannot test the DFA state numbers here because in
     * {@link ParserATNSimulator#addDFAState} we need to know if any other state
     * exists that has this exact set of ATN configurations. The
     * {@link #stateNumber} is irrelevant.</p>
     *
     * @param o tbd
     */
    public equals = (o: unknown): boolean => {
        // compare set of ATN configurations in this set with other
        if (this === o) {
            return true;
        }

        if (!(o instanceof DFAState)) {
            return false;
        }

        // TODO (sam): what to do when configs==null?
        const sameSet = this.configs.equals(o.configs);

        return sameSet;
    };

    public toString = (): string => {
        const buf: java.lang.StringBuilder = new java.lang.StringBuilder();
        buf.append(this.stateNumber).append(":").append(this.configs);
        if (this.isAcceptState) {
            buf.append("=>");
            if (this.predicates !== undefined) {
                buf.append(java.util.Arrays.toString(this.predicates));
            } else {
                buf.append(this.prediction);
            }
        }

        return buf.toString();
    };
}

namespace DFAState {
    export type PredPrediction = InstanceType<typeof DFAState.PredPrediction>;
}

