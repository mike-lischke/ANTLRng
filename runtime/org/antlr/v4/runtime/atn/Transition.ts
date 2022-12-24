/* java2ts: keep */

/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { java } from "../../../../../../lib/java/java";
import { ActionTransition } from "./ActionTransition";
import { ATNState } from "./ATNState";
import { AtomTransition } from "./AtomTransition";
import { EpsilonTransition } from "./EpsilonTransition";
import { NotSetTransition } from "./NotSetTransition";
import { PrecedencePredicateTransition } from "./PrecedencePredicateTransition";
import { PredicateTransition } from "./PredicateTransition";
import { RangeTransition } from "./RangeTransition";
import { RuleTransition } from "./RuleTransition";
import { SetTransition } from "./SetTransition";
import { WildcardTransition } from "./WildcardTransition";
import { IntervalSet } from "../misc/IntervalSet";

import { JavaObject } from "../../../../../../lib/java/lang/Object";
import { S } from "../../../../../../lib/templates";

/* eslint-disable @typescript-eslint/naming-convention */

/**
 * An ATN transition between any two ATN states.  Subclasses define
 *  atom, set, epsilon, action, predicate, rule transitions.
 *
 *  <p>This is a one way link.  It emanates from a state (usually via a list of
 *  transitions) and has a target state.</p>
 *
 *  <p>Since we never have to change the ATN transitions once we construct it,
 *  we can fix these transitions as specific classes. The DFA transitions
 *  on the other hand need to update the labels as it adds transitions to
 *  the states. We'll use the term Edge for the DFA to distinguish them from
 *  ATN transitions.</p>
 */
export abstract class Transition extends JavaObject {
    // constants for serialization
    public static readonly EPSILON = 1;
    public static readonly RANGE = 2;
    public static readonly RULE = 3;
    public static readonly PREDICATE = 4; // e.g., {isType(input.LT(1))}?
    public static readonly ATOM = 5;
    public static readonly ACTION = 6;
    public static readonly SET = 7; // ~(A|B) or ~atom, wildcard, which convert to next 2
    public static readonly NOT_SET = 8;
    public static readonly WILDCARD = 9;
    public static readonly PRECEDENCE = 10;

    public static readonly serializationNames = new java.util.ArrayList<java.lang.String>([
        S`INVALID`,
        S`EPSILON`,
        S`RANGE`,
        S`RULE`,
        S`PREDICATE`,
        S`ATOM`,
        S`ACTION`,
        S`SET`,
        S`NOT_SET`,
        S`WILDCARD`,
        S`PRECEDENCE`,
    ]);

    public static readonly serializationTypes = new java.util.HashMap<java.lang.Class<Transition>, number>([
        [EpsilonTransition.class, Transition.EPSILON],
        [RangeTransition.class, Transition.RANGE],
        [RuleTransition.class, Transition.RULE],
        [PredicateTransition.class, Transition.PREDICATE],
        [AtomTransition.class, Transition.ATOM],
        [ActionTransition.class, Transition.ACTION],
        [SetTransition.class, Transition.SET],
        [NotSetTransition.class, Transition.NOT_SET],
        [WildcardTransition.class, Transition.WILDCARD],
        [PrecedencePredicateTransition.class, Transition.PRECEDENCE],
    ]);

    /** The target of this transition. */

    public target: ATNState;

    protected constructor(target: ATNState) {
        super();
        if (target === null) {
            throw new java.lang.NullPointerException(S`target cannot be null.`);
        }

        this.target = target;
    }

    public abstract getSerializationType: () => number;

    /**
     * Determines if the transition is an "epsilon" transition.
     *
     * <p>The default implementation returns {@code false}.</p>
     *
      @returns {@code true} if traversing this transition in the ATN does not
     * consume an input symbol; otherwise, {@code false} if traversing this
     * transition consumes (matches) an input symbol.
     */
    public isEpsilon = (): boolean => {
        return false;
    };

    public label = (): IntervalSet | null => { return null; };

    public abstract matches: (symbol, minVocabSymbol, maxVocabSymbol) => boolean;
}
