/* java2ts: keep */

/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/* eslint-disable jsdoc/require-param, jsdoc/require-returns */

import {
    ATNState, HashSet, RuleStopState, RuleTransition, EpsilonTransition, ActionTransition, SetTransition,
    NotSetTransition, AtomTransition, StarBlockStartState, PlusBlockStartState, BlockStartState, BlockEndState,
    RuleStartState, PlusLoopbackState, StarLoopbackState, StarLoopEntryState, ATN, Vocabulary,
} from "antlr4ng";
import { getTokenDisplayName } from "../misc/helpers.js";

/** An ATN walker that knows how to dump them to serialized strings. */
export class ATNPrinter {
    private work: ATNState[];
    private marked: HashSet<ATNState>;
    private atn: ATN;
    private start: ATNState;
    private ruleNames: string[];
    private vocabulary: Vocabulary;

    public constructor(atn: ATN, start: ATNState, ruleNames: string[], vocabulary: Vocabulary) {
        this.atn = atn;
        this.start = start;
        this.ruleNames = ruleNames;
        this.vocabulary = vocabulary;
    }

    public asString(): string {
        this.marked = new HashSet<ATNState>();

        this.work = [];
        this.work.push(this.start);

        let buffer = "";
        while (this.work.length > 0) {
            const s = this.work.shift();
            if (!s || this.marked.contains(s)) {
                continue;
            }

            this.marked.add(s);
            for (const t of s.transitions) {
                if (!(s instanceof RuleStopState)) { // don't add follow states to work
                    if (t instanceof RuleTransition) {
                        this.work.push((t).followState);
                    } else {
                        this.work.push(t.target);
                    }

                }
                buffer += this.getStateString(s);
                if (t instanceof EpsilonTransition) {
                    buffer += "->" + this.getStateString(t.target) + "\n";
                } else {
                    if (t instanceof RuleTransition) {
                        buffer += "-" + this.ruleNames[t.ruleIndex] + "->" + this.getStateString(t.target) + "\n";
                    } else {
                        if (t instanceof ActionTransition) {
                            const a = t;
                            buffer += "-" + a.toString() + "->" + this.getStateString(t.target) + "\n";
                        } else {
                            if (t instanceof SetTransition) {
                                const not = t instanceof NotSetTransition;
                                if (this.atn.grammarType === ATN.LEXER) {
                                    buffer += "-" + (not ? "~" : "") + t.toString() + "->" +
                                        this.getStateString(t.target) + "\n";
                                } else {
                                    buffer += "-" + (not ? "~" : "") + t.label.toStringWithVocabulary(this.vocabulary) +
                                        "->" + this.getStateString(t.target) + "\n";
                                }
                            } else {
                                if (t instanceof AtomTransition) {
                                    const label = getTokenDisplayName(t.labelValue, this.vocabulary,
                                        this.atn.grammarType === 0);
                                    buffer += "-" + label + "->" + this.getStateString(t.target) + "\n";
                                } else {
                                    buffer += "-" + t.toString() + "->" + this.getStateString(t.target) + "\n";
                                }
                            }
                        }
                    }
                }
            }
        }

        return buffer;
    }

    private getStateString(s: ATNState): string {
        const n = s.stateNumber;
        let stateStr = "s" + n;
        if (s instanceof StarBlockStartState) {
            stateStr = "StarBlockStart_" + n;
        } else {
            if (s instanceof PlusBlockStartState) {
                stateStr = "PlusBlockStart_" + n;
            } else {
                if (s instanceof BlockStartState) {
                    stateStr = "BlockStart_" + n;
                } else {
                    if (s instanceof BlockEndState) {
                        stateStr = "BlockEnd_" + n;
                    } else {
                        if (s instanceof RuleStartState) {
                            stateStr = "RuleStart_" + this.ruleNames[s.ruleIndex] + "_" + n;
                        } else {
                            if (s instanceof RuleStopState) {
                                stateStr = "RuleStop_" + this.ruleNames[s.ruleIndex] + "_" + n;
                            } else {
                                if (s instanceof PlusLoopbackState) {
                                    stateStr = "PlusLoopBack_" + n;
                                } else {
                                    if (s instanceof StarLoopbackState) {
                                        stateStr = "StarLoopBack_" + n;
                                    } else {
                                        if (s instanceof StarLoopEntryState) {
                                            stateStr = "StarLoopEntry_" + n;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        return stateStr;
    }
}
