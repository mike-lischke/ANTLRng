/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { CharSupport } from "../misc/CharSupport.js";
import { ATN, ATNState, AtomTransition, BlockEndState, CodePointTransitions, DecisionState, EpsilonTransition, NotSetTransition, RangeTransition, SetTransition, Transition, Interval, IntervalSet } from "antlr4ng";
import { ErrorType } from "../tool/ErrorType.js";
import { Grammar } from "../tool/Grammar.js";
import { Rule } from "../tool/Rule.js";

/**
 *
 * @author Sam Harwell
 */
export class ATNOptimizer {

    private constructor() {
    }

    public static optimize(g: Grammar, atn: ATN): void {
        ATNOptimizer.optimizeSets(g, atn);
        ATNOptimizer.optimizeStates(atn);
    }

    private static optimizeSets(g: Grammar, atn: ATN): void {
        if (g.isParser()) {
            // parser codegen doesn't currently support SetTransition
            return;
        }

        let removedStates = 0;
        const decisions = atn.decisionToState;
        for (const decision of decisions) {
            if (decision.ruleIndex >= 0) {
                const rule = g.getRule(decision.ruleIndex);
                if (Character.isLowerCase(rule.name.charAt(0))) {
                    // parser codegen doesn't currently support SetTransition
                    continue;
                }
            }

            const setTransitions = new IntervalSet();
            for (let i = 0; i < decision.getNumberOfTransitions(); i++) {
                const epsTransition = decision.transition(i);
                if (!(epsTransition instanceof EpsilonTransition)) {
                    continue;
                }

                if (epsTransition.target.getNumberOfTransitions() !== 1) {
                    continue;
                }

                const transition = epsTransition.target.transition(0);
                if (!(transition.target instanceof BlockEndState)) {
                    continue;
                }

                if (transition instanceof NotSetTransition) {
                    // TODO: not yet implemented
                    continue;
                }

                if (transition instanceof AtomTransition
                    || transition instanceof RangeTransition
                    || transition instanceof SetTransition) {
                    setTransitions.add(i);
                }
            }

            // due to min alt resolution policies, can only collapse sequential alts
            for (let i = setTransitions.getIntervals().size() - 1; i >= 0; i--) {
                const interval = setTransitions.getIntervals().get(i);
                if (interval.length() <= 1) {
                    continue;
                }

                const blockEndState = decision.transition(interval.a).target.transition(0).target;
                const matchSet = new IntervalSet();
                for (let j = interval.a; j <= interval.b; j++) {
                    const matchTransition = decision.transition(j).target.transition(0);
                    if (matchTransition instanceof NotSetTransition) {
                        throw new UnsupportedOperationException("Not yet implemented.");
                    }
                    const set = matchTransition.label();
                    const intervals = set.getIntervals();
                    const n = intervals.size();
                    for (let k = 0; k < n; k++) {
                        const setInterval = intervals.get(k);
                        const a = setInterval.a;
                        const b = setInterval.b;
                        if (a !== -1 && b !== -1) {
                            for (let v = a; v <= b; v++) {
                                if (matchSet.contains(v)) {
                                    // TODO: Token is missing (i.e. position in source is not displayed).
                                    g.tool.errMgr.grammarError(ErrorType.CHARACTERS_COLLISION_IN_SET, g.fileName,
                                        null,
                                        CharSupport.getANTLRCharLiteralForChar(v),
                                        CharSupport.getIntervalSetEscapedString(matchSet));
                                    break;
                                }
                            }
                        }
                    }
                    matchSet.addAll(set);
                }

                let newTransition: Transition;
                if (matchSet.getIntervals().size() === 1) {
                    if (matchSet.size() === 1) {
                        newTransition = CodePointTransitions.createWithCodePoint(blockEndState, matchSet.getMinElement());
                    }
                    else {
                        const matchInterval = matchSet.getIntervals().get(0);
                        newTransition = CodePointTransitions.createWithCodePointRange(blockEndState, matchInterval.a, matchInterval.b);
                    }
                }
                else {
                    newTransition = new SetTransition(blockEndState, matchSet);
                }

                decision.transition(interval.a).target.setTransition(0, newTransition);
                for (let j = interval.a + 1; j <= interval.b; j++) {
                    const removed = decision.removeTransition(interval.a + 1);
                    atn.removeState(removed.target);
                    removedStates++;
                }
            }
        }

        //		System.out.println("ATN optimizer removed " + removedStates + " states by collapsing sets.");
    }

    private static optimizeStates(atn: ATN): void {
        //		System.out.println(atn.states);
        const compressed = new Array<ATNState>();
        let i = 0; // new state number
        for (const s of atn.states) {
            if (s !== null) {
                compressed.add(s);
                s.stateNumber = i; // reset state number as we shift to new position
                i++;
            }
        }
        //		System.out.println(compressed);
        //		System.out.println("ATN optimizer removed " + (atn.states.size() - compressed.size()) + " null states.");
        atn.states.clear();
        atn.states.addAll(compressed);
    }

}
