/* java2ts: keep */

/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/* eslint-disable @typescript-eslint/naming-convention */

import { java } from "../../../../../../lib/java/java";
import { ATN } from "./ATN";
import { Transition } from "./Transition";
import { IntervalSet } from "../misc/IntervalSet";

/**
 * The following images show the relation of states and
 * {@link ATNState#transitions} for various grammar constructs.
 *
 * <ul>
 *
 * <li>Solid edges marked with an &#0949; indicate a required
 * {@link EpsilonTransition}.</li>
 *
 * <li>Dashed edges indicate locations where any transition derived from
 * {@link Transition} might appear.</li>
 *
 * <li>Dashed nodes are place holders for either a sequence of linked
 * {@link BasicState} states or the inclusion of a block representing a nested
 * construct in one of the forms below.</li>
 *
 * <li>Nodes showing multiple outgoing alternatives with a {@code ...} support
 * any number of alternatives (one or more). Nodes without the {@code ...} only
 * support the exact number of alternatives shown in the diagram.</li>
 *
 * </ul>
 *
 * <h2>Basic Blocks</h2>
 *
 * <h3>Rule</h3>
 *
 * <embed src="images/Rule.svg" type="image/svg+xml"/>
 *
 * <h3>Block of 1 or more alternatives</h3>
 *
 * <embed src="images/Block.svg" type="image/svg+xml"/>
 *
 * <h2>Greedy Loops</h2>
 *
 * <h3>Greedy Closure: {@code (...)*}</h3>
 *
 * <embed src="images/ClosureGreedy.svg" type="image/svg+xml"/>
 *
 * <h3>Greedy Positive Closure: {@code (...)+}</h3>
 *
 * <embed src="images/PositiveClosureGreedy.svg" type="image/svg+xml"/>
 *
 * <h3>Greedy Optional: {@code (...)?}</h3>
 *
 * <embed src="images/OptionalGreedy.svg" type="image/svg+xml"/>
 *
 * <h2>Non-Greedy Loops</h2>
 *
 * <h3>Non-Greedy Closure: {@code (...)*?}</h3>
 *
 * <embed src="images/ClosureNonGreedy.svg" type="image/svg+xml"/>
 *
 * <h3>Non-Greedy Positive Closure: {@code (...)+?}</h3>
 *
 * <embed src="images/PositiveClosureNonGreedy.svg" type="image/svg+xml"/>
 *
 * <h3>Non-Greedy Optional: {@code (...)??}</h3>
 *
 * <embed src="images/OptionalNonGreedy.svg" type="image/svg+xml"/>
 */
export abstract class ATNState {
    // constants for serialization
    public static readonly INVALID_TYPE: number = 0;
    public static readonly BASIC: number = 1;
    public static readonly RULE_START: number = 2;
    public static readonly BLOCK_START: number = 3;
    public static readonly PLUS_BLOCK_START: number = 4;
    public static readonly STAR_BLOCK_START: number = 5;
    public static readonly TOKEN_START: number = 6;
    public static readonly RULE_STOP: number = 7;
    public static readonly BLOCK_END: number = 8;
    public static readonly STAR_LOOP_BACK: number = 9;
    public static readonly STAR_LOOP_ENTRY: number = 10;
    public static readonly PLUS_LOOP_BACK: number = 11;
    public static readonly LOOP_END: number = 12;

    public static readonly serializationNames = [
        "INVALID",
        "BASIC",
        "RULE_START",
        "BLOCK_START",
        "PLUS_BLOCK_START",
        "STAR_BLOCK_START",
        "TOKEN_START",
        "RULE_STOP",
        "BLOCK_END",
        "STAR_LOOP_BACK",
        "STAR_LOOP_ENTRY",
        "PLUS_LOOP_BACK",
        "LOOP_END",
    ];

    public static readonly INVALID_STATE_NUMBER: number = -1;

    /** Which ATN are we in? */
    public atn?: ATN = undefined;

    public stateNumber: number = ATNState.INVALID_STATE_NUMBER;

    public ruleIndex: number; // at runtime, we don't have Rule objects

    public epsilonOnlyTransitions = false;

    /** Used to cache lookahead during parsing, not used during construction */
    public nextTokenWithinRule?: IntervalSet;

    /** Track the transitions emanating from this ATN state. */
    protected readonly transitions: Transition[] = [];

    public abstract getStateType: () => number;

    public hashCode = (): number => {
        return this.stateNumber;
    };

    public equals = (o: object): boolean => {
        // are these states same object?
        if (o instanceof ATNState) {
            return this.stateNumber === (o).stateNumber;
        }

        return false;
    };

    public isNonGreedyExitState = (): boolean => {
        return false;
    };

    public toString = (): string => {
        return String(this.stateNumber);
    };

    public getTransitions = (): Transition[] => {
        return this.transitions;
    };

    public getNumberOfTransitions = (): number => {
        return this.transitions.length;
    };

    public addTransition(e: Transition): void;
    public addTransition(index: number, e: Transition): void;
    public addTransition(eOrIndex: Transition | number, e?: Transition): void {
        if (eOrIndex instanceof Transition && e === undefined) {
            const e = eOrIndex;
            this.addTransition(this.transitions.length, e);
        } else {
            const index = eOrIndex as number;
            if (this.transitions.length === 0) {
                this.epsilonOnlyTransitions = e.isEpsilon();
            } else {
                if (this.epsilonOnlyTransitions !== e.isEpsilon()) {
                    java.lang.System.err.format("ATN state %d has both epsilon and non-epsilon transitions.\n",
                        this.stateNumber);
                    this.epsilonOnlyTransitions = false;
                }
            }

            let alreadyPresent = false;
            for (const t of this.transitions) {
                if (t.target.stateNumber === e.target.stateNumber) {
                    if (t.label() !== undefined && e.label() !== undefined && t.label().equals(e.label())) {
                        alreadyPresent = true;
                        break;
                    } else {
                        if (t.isEpsilon() && e.isEpsilon()) {
                            alreadyPresent = true;
                            break;
                        }
                    }

                }
            }

            if (!alreadyPresent) {
                this.transitions.splice(index, 0, e);
            }
        }

    }

    public transition = (i: number): Transition => {
        return this.transitions[i];
    };

    public setTransition = (i: number, e: Transition): void => {
        this.transitions[i] = e;
    };

    public removeTransition = (index: number): Transition => {
        return this.transitions.splice(index, 1)[0];
    };

    public readonly onlyHasEpsilonTransitions = (): boolean => {
        return this.epsilonOnlyTransitions;
    };

    public setRuleIndex = (ruleIndex: number): void => {
        this.ruleIndex = ruleIndex;
    };
}
