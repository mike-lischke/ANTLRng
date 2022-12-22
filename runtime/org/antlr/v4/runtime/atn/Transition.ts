/* java2ts: keep */

/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/* eslint-disable @typescript-eslint/naming-convention */

import { java } from "../../../../../../lib/java/java";
import { ATNState } from "./ATNState";
import { IntervalSet } from "../misc/IntervalSet";
import { S } from "../../../../../../lib/templates";

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
export abstract class Transition extends java.lang.Object {
    // constants for serialization
    public static readonly EPSILON: number = 1;
    public static readonly RANGE: number = 2;
    public static readonly RULE: number = 3;
    public static readonly PREDICATE: number = 4; // e.g., {isType(input.LT(1))}?
    public static readonly ATOM: number = 5;
    public static readonly ACTION: number = 6;
    public static readonly SET: number = 7; // ~(A|B) or ~atom, wildcard, which convert to next 2
    public static readonly NOT_SET: number = 8;
    public static readonly WILDCARD: number = 9;
    public static readonly PRECEDENCE: number = 10;

    public static readonly serializationNames = [
        "INVALID",
        "EPSILON",
        "RANGE",
        "RULE",
        "PREDICATE",
        "ATOM",
        "ACTION",
        "SET",
        "NOT_SET",
        "WILDCARD",
        "PRECEDENCE",
    ];

    /** The target of this transition. */
    public target: ATNState;

    protected constructor(target: ATNState) {
        super();

        if (!target) {
            throw new java.lang.NullPointerException(S`target cannot be null.`);
        }

        this.target = target;
    }

    /**
     * Determines if the transition is an "epsilon" transition.
     *
     * <p>The default implementation returns {@code false}.</p>
     *
     * @returns `true` if traversing this transition in the ATN does not
     * consume an input symbol; otherwise, {@code false} if traversing this
     * transition consumes (matches) an input symbol.
     */
    public isEpsilon(): boolean {
        return false;
    }

    public label(): IntervalSet | null {
        return null;
    }

    public abstract getSerializationType(): number;

    public abstract matches(symbol: number, minVocabSymbol: number, maxVocabSymbol: number): boolean;
}
