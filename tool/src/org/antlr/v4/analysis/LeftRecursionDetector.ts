/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { ATN, ATNState, RuleStartState, RuleStopState, RuleTransition, Transition, HashSet, OrderedHashSet } from "antlr4ng";
import { Grammar } from "../tool/Grammar.js";
import { Rule } from "../tool/Rule.js";

export class LeftRecursionDetector {
    public atn: ATN;

    /** Holds a list of cycles (sets of rule names). */
    public listOfRecursiveCycles = new Array<Set<Rule>>();
    protected g: Grammar;

    /**
     * Which rule start states have we visited while looking for a single
     * 	left-recursion check?
     */
    protected rulesVisitedPerRuleCheck = new HashSet<RuleStartState>();

    public constructor(g: Grammar, atn: ATN) {
        this.g = g;
        this.atn = atn;
    }

    public check(): void;

    /**
     * From state s, look for any transition to a rule that is currently
     *  being traced.  When tracing r, visitedPerRuleCheck has r
     *  initially.  If you reach a rule stop state, return but notify the
     *  invoking rule that the called rule is nullable. This implies that
     *  invoking rule must look at follow transition for that invoking state.
     *
     *  The visitedStates tracks visited states within a single rule so
     *  we can avoid epsilon-loop-induced infinite recursion here.  Keep
     *  filling the cycles in listOfRecursiveCycles and also, as a
     *  side-effect, set leftRecursiveRules.
     */
    public check(enclosingRule: Rule, s: ATNState, visitedStates: Set<ATNState>): boolean;
    public check(...args: unknown[]): void | boolean {
        switch (args.length) {
            case 0: {

                for (const start of this.atn.ruleToStartState) {
                    //System.out.print("check "+start.rule.name);
                    this.rulesVisitedPerRuleCheck.clear();
                    this.rulesVisitedPerRuleCheck.add(start);
                    //FASerializer ser = new FASerializer(atn.g, start);
                    //System.out.print(":\n"+ser+"\n");

                    this.check(this.g.getRule(start.ruleIndex), start, new HashSet<ATNState>());
                }
                //System.out.println("cycles="+listOfRecursiveCycles);
                if (!this.listOfRecursiveCycles.isEmpty()) {
                    this.g.tool.errMgr.leftRecursionCycles(this.g.fileName, this.listOfRecursiveCycles);
                }

                break;
            }

            case 3: {
                const [enclosingRule, s, visitedStates] = args as [Rule, ATNState, Set<ATNState>];

                if (s instanceof RuleStopState) {
                    return true;
                }

                if (visitedStates.contains(s)) {
                    return false;
                }

                visitedStates.add(s);

                //System.out.println("visit "+s);
                const n = s.getNumberOfTransitions();
                let stateReachesStopState = false;
                for (let i = 0; i < n; i++) {
                    const t = s.transition(i);
                    if (t instanceof RuleTransition) {
                        const rt = t;
                        const r = this.g.getRule(rt.ruleIndex);
                        if (this.rulesVisitedPerRuleCheck.contains(t.target as RuleStartState)) {
                            this.addRulesToCycle(enclosingRule, r);
                        }
                        else {
                            // must visit if not already visited; mark target, pop when done
                            this.rulesVisitedPerRuleCheck.add(t.target as RuleStartState);
                            // send new visitedStates set per rule invocation
                            const nullable = this.check(r, t.target, new HashSet<ATNState>());
                            // we're back from visiting that rule
                            this.rulesVisitedPerRuleCheck.remove(t.target as RuleStartState);
                            if (nullable) {
                                stateReachesStopState |= this.check(enclosingRule, rt.followState, visitedStates);
                            }
                        }
                    }
                    else {
                        if (t.isEpsilon()) {
                            stateReachesStopState |= this.check(enclosingRule, t.target, visitedStates);
                        }
                    }

                    // else ignore non-epsilon transitions
                }

                return stateReachesStopState;

                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }

    /**
     * enclosingRule calls targetRule. Find the cycle containing
     *  the target and add the caller.  Find the cycle containing the caller
     *  and add the target.  If no cycles contain either, then create a new
     *  cycle.
     */
    protected addRulesToCycle(enclosingRule: Rule, targetRule: Rule): void {
        //System.err.println("left-recursion to "+targetRule.name+" from "+enclosingRule.name);
        let foundCycle = false;
        for (const rulesInCycle of this.listOfRecursiveCycles) {
            // ensure both rules are in same cycle
            if (rulesInCycle.contains(targetRule)) {
                rulesInCycle.add(enclosingRule);
                foundCycle = true;
            }
            if (rulesInCycle.contains(enclosingRule)) {
                rulesInCycle.add(targetRule);
                foundCycle = true;
            }
        }
        if (!foundCycle) {
            const cycle = new OrderedHashSet<Rule>();
            cycle.add(targetRule);
            cycle.add(enclosingRule);
            this.listOfRecursiveCycles.add(cycle);
        }
    }
}
