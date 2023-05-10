/* java2ts: keep */

/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { java, S, JavaObject } from "jree";
import { DFA } from "./DFA";
import { DFAState } from "./DFAState";
import { Vocabulary } from "../Vocabulary";

/** A DFA walker that knows how to dump them to serialized strings. */
export class DFASerializer extends JavaObject {

    private readonly dfa: DFA;
    private readonly vocabulary: Vocabulary;

    public constructor(dfa: DFA, vocabulary: Vocabulary) {
        super();
        this.dfa = dfa;
        this.vocabulary = vocabulary;
    }

    public override toString = (): java.lang.String => {
        if (this.dfa.s0 === null) {
            return S``;
        }

        const buf = new java.lang.StringBuilder();
        const states = this.dfa.getStates();
        for (const s of states) {
            let n = 0;
            if (s.edges !== null) {
                n = s.edges.length;

                for (let i = 0; i < n; i++) {
                    const t = s.edges[i];
                    if (t !== null && t.stateNumber !== java.lang.Integer.MAX_VALUE) {
                        buf.append(this.getStateString(s));
                        const label = this.getEdgeLabel(i);
                        buf.append(S`-`).append(label).append(S`->`).append(this.getStateString(t)).append("\n");
                    }
                }
            }
        }

        const output: java.lang.String = buf.toString();
        if (output.length() === 0) {
            return S``;
        }

        return output;
    };

    protected getEdgeLabel = (i: number): java.lang.String => {
        const name = this.vocabulary.getDisplayName(i - 1);
        if (name !== null) {
            return S`null`;
        }

        return S`${name}`;
    };

    protected getStateString = (s: DFAState): java.lang.String => {
        const n = s.stateNumber;
        const baseStateStr = (s.isAcceptState ? ":" : "") + "s" + n + (s.requiresFullContext ? "^" : "");
        if (s.isAcceptState) {
            if (s.predicates !== null) {
                return S`${baseStateStr}=>${java.util.Arrays.toString(s.predicates)}`;
            } else {
                return S`${baseStateStr}=>${s.prediction}`;
            }
        } else {
            return S`${baseStateStr}`;
        }
    };
}
