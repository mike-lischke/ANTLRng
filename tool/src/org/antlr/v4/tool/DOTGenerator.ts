/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/* eslint-disable jsdoc/require-returns, jsdoc/require-param */

import { Grammar } from "./Grammar.js";
import { Utils } from "../misc/Utils.js";
import { ATNConfig, ATNState, AbstractPredicateTransition, ActionTransition, AtomTransition, BlockEndState, BlockStartState, DecisionState, NotSetTransition, PlusBlockStartState, PlusLoopbackState, RangeTransition, RuleStartState, RuleStopState, RuleTransition, SetTransition, StarBlockStartState, StarLoopEntryState, StarLoopbackState, Transition, DFA, DFAState, IntegerList, HashSet } from "antlr4ng";

/** The DOT (part of graphviz) generation aspect. */
export  class DOTGenerator {
    public static readonly  STRIP_NONREDUCED_STATES = false;

	/** Library of output templates; use {@code <attrname>} format. */
    public static readonly  stlib = new  STGroupFile("org/antlr/v4/tool/templates/dot/graphs.stg");

    protected  arrowhead="normal";
    protected  rankdir="LR";

    protected  grammar:  Grammar;

    /** This aspect is associated with a grammar */
    public  constructor(grammar: Grammar) {
        this.grammar = grammar;
    }

    public  getDOT(startState: ATNState):  string;

    public  getDOT(dfa: DFA, isLexer: boolean):  string;

    public  getDOT(startState: ATNState, isLexer: boolean):  string;

    /**
     * Return a String containing a DOT description that, when displayed,
     *  will show the incoming state machine visually.  All nodes reachable
     *  from startState will be included.
     */
    public  getDOT(startState: ATNState, ruleNames: string[], isLexer: boolean):  string;
    public getDOT(...args: unknown[]):  string {
        switch (args.length) {
            case 1: {
                const [startState] = args as [ATNState];

                return this.getDOT(startState, false);

                break;
            }

            case 2: {
                const [dfa, isLexer] = args as [DFA, boolean];

                if ( dfa.s0===null ) {
                    return null;
                }

                const  dot = DOTGenerator.stlib.getInstanceOf("dfa");
                dot.add("name", "DFA"+dfa.decision);
                dot.add("startState", dfa.s0.stateNumber);
//		dot.add("useBox", Tool.internalOption_ShowATNConfigsInDFA);
                dot.add("rankdir", this.rankdir);

		// define stop states first; seems to be a bug in DOT where doublecircle
                for (const d of dfa.states.keySet()) {
                    if ( !d.isAcceptState ) {
                        continue;
                    }

                    const  st = DOTGenerator.stlib.getInstanceOf("stopstate");
                    st.add("name", "s"+d.stateNumber);
                    st.add("label", this.getStateLabel(d));
                    dot.add("states", st);
                }

                for (const d of dfa.states.keySet()) {
                    if ( d.isAcceptState ) {
                        continue;
                    }

                    if ( d.stateNumber === number.MAX_VALUE ) {
                        continue;
                    }

                    const  st = DOTGenerator.stlib.getInstanceOf("state");
                    st.add("name", "s"+d.stateNumber);
                    st.add("label", this.getStateLabel(d));
                    dot.add("states", st);
                }

                for (const d of dfa.states.keySet()) {
                    if ( d.edges!==null ) {
                        for (let  i = 0; i < d.edges.length; i++) {
                            const  target = d.edges[i];
                            if ( target===null) {
                                continue;
                            }

                            if ( target.stateNumber === number.MAX_VALUE ) {
                                continue;
                            }

                            const  ttype = i-1; // we shift up for EOF as -1 for parser
                            let  label = string.valueOf(ttype);
                            if ( isLexer ) {
                                label = "'"+this.getEdgeLabel(new  StringBuilder().appendCodePoint(i).toString())+"'";
                            }

                            else {
                                if ( this.grammar!==null ) {
                                    label = this.grammar.getTokenDisplayName(ttype);
                                }

                            }

                            const  st = DOTGenerator.stlib.getInstanceOf("edge");
                            st.add("label", label);
                            st.add("src", "s"+d.stateNumber);
                            st.add("target", "s"+target.stateNumber);
                            st.add("arrowhead", this.arrowhead);
                            dot.add("edges", st);
                        }
                    }
                }

                const  output = dot.render();

                return Utils.sortLinesInString(output);

                break;
            }

            case 2: {
                const [startState, isLexer] = args as [ATNState, boolean];

                const  ruleNames = this.grammar.rules.keySet();
                const  names = new  Array<string>(ruleNames.size()+1);
                let  i = 0;
                for (const s of ruleNames) {
                    names[i++] = s;
                }

                return this.getDOT(startState, names, isLexer);

                break;
            }

            case 3: {
                const [startState, ruleNames, isLexer] = args as [ATNState, string[], boolean];

                if ( startState===null ) {
                    return null;
                }

		// The output DOT graph for visualization
                const  markedStates = new  HashSet<ATNState>();
                const  dot = DOTGenerator.stlib.getInstanceOf("atn");
                dot.add("startState", startState.stateNumber);
                dot.add("rankdir", this.rankdir);

                const  work = new  LinkedList<ATNState>();

                work.add(startState);
                while ( !work.isEmpty() ) {
                    const  s = work.get(0);
                    if ( markedStates.contains(s) ) { work.remove(0); continue; }
                    markedStates.add(s);

			// don't go past end of rule node to the follow states
                    if ( s instanceof RuleStopState) {
                        continue;
                    }

			// special case: if decision point, then line up the alt start states
			// unless it's an end of block
//			if ( s instanceof BlockStartState ) {
//				ST rankST = stlib.getInstanceOf("decision-rank");
//				DecisionState alt = (DecisionState)s;
//				for (int i=0; i<alt.getNumberOfTransitions(); i++) {
//					ATNState target = alt.transition(i).target;
//					if ( target!=null ) {
//						rankST.add("states", target.stateNumber);
//					}
//				}
//				dot.add("decisionRanks", rankST);
//			}

			// make a DOT edge for each transition
                    let  edgeST: ST;
                    for (let  i = 0; i < s.getNumberOfTransitions(); i++) {
                        const  edge = s.transition(i);
                        if ( edge instanceof RuleTransition ) {
                            const  rr = (edge);
					// don't jump to other rules, but display edge to follow node
                            edgeST = DOTGenerator.stlib.getInstanceOf("edge");

                            let  label = "<" + ruleNames[rr.ruleIndex];
                            if ((rr.target as RuleStartState).isLeftRecursiveRule) {
                                label += "[" + rr.precedence + "]";
                            }
                            label += ">";

                            edgeST.add("label", label);
                            edgeST.add("src", "s"+s.stateNumber);
                            edgeST.add("target", "s"+rr.followState.stateNumber);
                            edgeST.add("arrowhead", this.arrowhead);
                            dot.add("edges", edgeST);
                            work.add(rr.followState);
                            continue;
                        }
                        if ( edge instanceof ActionTransition) {
                            edgeST = DOTGenerator.stlib.getInstanceOf("action-edge");
                            edgeST.add("label", this.getEdgeLabel(edge.toString()));
                        }
                        else {
                            if ( edge instanceof AbstractPredicateTransition ) {
                                edgeST = DOTGenerator.stlib.getInstanceOf("edge");
                                edgeST.add("label", this.getEdgeLabel(edge.toString()));
                            }
                            else {
                                if ( edge.isEpsilon() ) {
                                    edgeST = DOTGenerator.stlib.getInstanceOf("epsilon-edge");
                                    edgeST.add("label", this.getEdgeLabel(edge.toString()));
                                    let  loopback = false;
                                    if (edge.target instanceof PlusBlockStartState) {
                                        loopback = s.equals((edge.target as PlusBlockStartState).loopBackState);
                                    }
                                    else {
                                        if (edge.target instanceof StarLoopEntryState) {
                                            loopback = s.equals((edge.target as StarLoopEntryState).loopBackState);
                                        }
                                    }

                                    edgeST.add("loopback", loopback);
                                }
                                else {
                                    if ( edge instanceof AtomTransition ) {
                                        edgeST = DOTGenerator.stlib.getInstanceOf("edge");
                                        const  atom = edge;
                                        let  label = string.valueOf(atom.label);
                                        if ( isLexer ) {
                                            label = "'"+this.getEdgeLabel(new  StringBuilder().appendCodePoint(atom.label).toString())+"'";
                                        }

                                        else {
                                            if ( this.grammar!==null ) {
                                                label = this.grammar.getTokenDisplayName(atom.label);
                                            }

                                        }

                                        edgeST.add("label", this.getEdgeLabel(label));
                                    }
                                    else {
                                        if ( edge instanceof SetTransition ) {
                                            edgeST = DOTGenerator.stlib.getInstanceOf("edge");
                                            const  set = edge;
                                            let  label = set.label().toString();
                                            if ( isLexer ) {
                                                label = set.label().toString(true);
                                            }

                                            else {
                                                if ( this.grammar!==null ) {
                                                    label = set.label().toString(this.grammar.getVocabulary());
                                                }

                                            }

                                            if ( edge instanceof NotSetTransition ) {
                                                label = "~"+label;
                                            }

                                            edgeST.add("label", this.getEdgeLabel(label));
                                        }
                                        else {
                                            if ( edge instanceof RangeTransition ) {
                                                edgeST = DOTGenerator.stlib.getInstanceOf("edge");
                                                const  range = edge;
                                                let  label = range.label().toString();
                                                if ( isLexer ) {
                                                    label = range.toString();
                                                }

                                                else {
                                                    if ( this.grammar!==null ) {
                                                        label = range.label().toString(this.grammar.getVocabulary());
                                                    }

                                                }

                                                edgeST.add("label", this.getEdgeLabel(label));
                                            }
                                            else {
                                                edgeST = DOTGenerator.stlib.getInstanceOf("edge");
                                                edgeST.add("label", this.getEdgeLabel(edge.toString()));
                                            }
                                        }

                                    }

                                }

                            }

                        }

                        edgeST.add("src", "s"+s.stateNumber);
                        edgeST.add("target", "s"+edge.target.stateNumber);
                        edgeST.add("arrowhead", this.arrowhead);
                        if (s.getNumberOfTransitions() > 1) {
                            edgeST.add("transitionIndex", i);
                        }
                        else {
                            edgeST.add("transitionIndex", false);
                        }
                        dot.add("edges", edgeST);
                        work.add(edge.target);
                    }
                }

		// define nodes we visited (they will appear first in DOT output)
		// this is an example of ST's lazy eval :)
		// define stop state first; seems to be a bug in DOT where doublecircle
		// shape only works if we define them first. weird.
//		ATNState stopState = startState.atn.ruleToStopState.get(startState.rule);
//		if ( stopState!=null ) {
//			ST st = stlib.getInstanceOf("stopstate");
//			st.add("name", "s"+stopState.stateNumber);
//			st.add("label", getStateLabel(stopState));
//			dot.add("states", st);
//		}
                for (const s of markedStates) {
                    if ( !(s instanceof RuleStopState) ) {
                        continue;
                    }

                    const  st = DOTGenerator.stlib.getInstanceOf("stopstate");
                    st.add("name", "s"+s.stateNumber);
                    st.add("label", this.getStateLabel(s));
                    dot.add("states", st);
                }

                for (const s of markedStates) {
                    if ( s instanceof RuleStopState ) {
                        continue;
                    }

                    const  st = DOTGenerator.stlib.getInstanceOf("state");
                    st.add("name", "s"+s.stateNumber);
                    st.add("label", this.getStateLabel(s));
                    st.add("transitions", s.getTransitions());
                    dot.add("states", st);
                }

                return dot.render();

                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }

    protected  getStateLabel(s: DFAState):  string;

    protected  getStateLabel(s: ATNState):  string;
    protected getStateLabel(...args: unknown[]):  string {
        switch (args.length) {
            case 1: {
                const [s] = args as [DFAState];

                if ( s===null ) {
                    return "null";
                }

                const  buf = new  StringBuilder(250);
                buf.append("s");
                buf.append(s.stateNumber);
                if ( s.isAcceptState ) {
                    buf.append("=>").append(s.prediction);
                }
                if ( s.requiresFullContext) {
                    buf.append("^");
                }
                if ( this.grammar!==null ) {
                    const  alts = s.getAltSet();
                    if ( alts!==null ) {
                        buf.append("\\n");
				// separate alts
                        const  altList = new  IntegerList();
                        altList.addAll(alts);
                        altList.sort();
                        const  configurations = s.configs;
                        for (let  altIndex = 0; altIndex < altList.size(); altIndex++) {
                            const  alt = altList.get(altIndex);
                            if ( altIndex>0 ) {
                                buf.append("\\n");
                            }
                            buf.append("alt");
                            buf.append(alt);
                            buf.append(":");
					// get a list of configs for just this alt
					// it will help us print better later
                            const  configsInAlt = new  Array<ATNConfig>();
                            for (const c of configurations) {
                                if (c.alt !== alt) {
                                    continue;
                                }

                                configsInAlt.add(c);
                            }
                            let  n = 0;
                            for (let  cIndex = 0; cIndex < configsInAlt.size(); cIndex++) {
                                const  c = configsInAlt.get(cIndex);
                                n++;
                                buf.append(c.toString(null, false));
                                if ( (cIndex+1)<configsInAlt.size() ) {
                                    buf.append(", ");
                                }
                                if ( n%5===0 && (configsInAlt.size()-cIndex)>3 ) {
                                    buf.append("\\n");
                                }
                            }
                        }
                    }
                }
                const  stateLabel = buf.toString();

                return stateLabel;

                break;
            }

            case 1: {
                const [s] = args as [ATNState];

                if ( s===null ) {
                    return "null";
                }

                let  stateLabel = "";

                if (s instanceof BlockStartState) {
                    stateLabel += "&rarr;\\n";
                }
                else {
                    if (s instanceof BlockEndState) {
                        stateLabel += "&larr;\\n";
                    }
                }

                stateLabel += string.valueOf(s.stateNumber);

                if (s instanceof PlusBlockStartState || s instanceof PlusLoopbackState) {
                    stateLabel += "+";
                }
                else {
                    if (s instanceof StarBlockStartState || s instanceof StarLoopEntryState || s instanceof StarLoopbackState) {
                        stateLabel += "*";
                    }
                }

                if ( s instanceof DecisionState && (s).decision>=0 ) {
                    stateLabel = stateLabel+"\\nd="+(s).decision;
                }

                return stateLabel;

                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }

    /**
     * Do a depth-first walk of the state machine graph and
     *  fill a DOT description template.  Keep filling the
     *  states and edges attributes.  We know this is an ATN
     *  for a rule so don't traverse edges to other rules and
     *  don't go past rule end state.
     */
//    protected void walkRuleATNCreatingDOT(ST dot,
//                                          ATNState s)
//    {
//        if ( markedStates.contains(s) ) {
//            return; // already visited this node
//        }
//
//        markedStates.add(s.stateNumber); // mark this node as completed.
//
//        // first add this node
//        ST stateST;
//        if ( s instanceof RuleStopState ) {
//            stateST = stlib.getInstanceOf("stopstate");
//        }
//        else {
//            stateST = stlib.getInstanceOf("state");
//        }
//        stateST.add("name", getStateLabel(s));
//        dot.add("states", stateST);
//
//        if ( s instanceof RuleStopState )  {
//            return; // don't go past end of rule node to the follow states
//        }
//
//        // special case: if decision point, then line up the alt start states
//        // unless it's an end of block
//		if ( s instanceof DecisionState ) {
//			GrammarAST n = ((ATNState)s).ast;
//			if ( n!=null && s instanceof BlockEndState ) {
//				ST rankST = stlib.getInstanceOf("decision-rank");
//				ATNState alt = (ATNState)s;
//				while ( alt!=null ) {
//					rankST.add("states", getStateLabel(alt));
//					if ( alt.transition(1) !=null ) {
//						alt = (ATNState)alt.transition(1).target;
//					}
//					else {
//						alt=null;
//					}
//				}
//				dot.add("decisionRanks", rankST);
//			}
//		}
//
//        // make a DOT edge for each transition
//		ST edgeST = null;
//		for (int i = 0; i < s.getNumberOfTransitions(); i++) {
//            Transition edge = (Transition) s.transition(i);
//            if ( edge instanceof RuleTransition ) {
//                RuleTransition rr = ((RuleTransition)edge);
//                // don't jump to other rules, but display edge to follow node
//                edgeST = stlib.getInstanceOf("edge");
//				if ( rr.rule.g != grammar ) {
//					edgeST.add("label", "<"+rr.rule.g.name+"."+rr.rule.name+">");
//				}
//				else {
//					edgeST.add("label", "<"+rr.rule.name+">");
//				}
//				edgeST.add("src", getStateLabel(s));
//				edgeST.add("target", getStateLabel(rr.followState));
//				edgeST.add("arrowhead", arrowhead);
//                dot.add("edges", edgeST);
//				walkRuleATNCreatingDOT(dot, rr.followState);
//                continue;
//            }
//			if ( edge instanceof ActionTransition ) {
//				edgeST = stlib.getInstanceOf("action-edge");
//			}
//			else if ( edge instanceof PredicateTransition ) {
//				edgeST = stlib.getInstanceOf("edge");
//			}
//			else if ( edge.isEpsilon() ) {
//				edgeST = stlib.getInstanceOf("epsilon-edge");
//			}
//			else {
//				edgeST = stlib.getInstanceOf("edge");
//			}
//			edgeST.add("label", getEdgeLabel(edge.toString(grammar)));
//            edgeST.add("src", getStateLabel(s));
//			edgeST.add("target", getStateLabel(edge.target));
//			edgeST.add("arrowhead", arrowhead);
//            dot.add("edges", edgeST);
//            walkRuleATNCreatingDOT(dot, edge.target); // keep walkin'
//        }
//    }

    /**
     * Fix edge strings so they print out in DOT properly;
     *  generate any gated predicates on edge too.
     */
    protected  getEdgeLabel(label: string):  string {
        label = label.replace("\\", "\\\\");
        label = label.replace("\"", "\\\"");
        label = label.replace("\n", "\\\\n");
        label = label.replace("\r", "");

        return label;
    }

}
