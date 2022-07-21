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

import { java } from "../../../../../../lib/java/java";
import { DFA } from "./DFA";
import { DFAState } from "./DFAState";
import { Vocabulary } from "../Vocabulary";
import { VocabularyImpl } from "../VocabularyImpl";

/** A DFA walker that knows how to dump them to serialized strings. */
export class DFASerializer {

    private readonly dfa?: DFA;

    private readonly vocabulary?: Vocabulary;

    /**
     * @deprecated Use {@link #DFASerializer(DFA, Vocabulary)} instead.
     */
    public constructor(dfa: DFA, tokenNames: string[]);

    public constructor(dfa: DFA, vocabulary: Vocabulary);
    public constructor(dfa: DFA, tokenNamesOrVocabulary: string[] | Vocabulary) {
        const $this = (dfa: DFA, tokenNamesOrVocabulary: string[] | Vocabulary): void => {
            if (Array.isArray(tokenNamesOrVocabulary)) {
                const tokenNames = tokenNamesOrVocabulary;
                $this(dfa, VocabularyImpl.fromTokenNames(tokenNames));
            } else {
                const vocabulary = tokenNamesOrVocabulary;
                // @ts-expect-error
                this.dfa = dfa;
                // @ts-expect-error
                this.vocabulary = vocabulary;
            }
        };

        $this(dfa, tokenNamesOrVocabulary);

    }

    public toString = (): string => {
        if (this.dfa.s0 === undefined) {
            return undefined;
        }

        const buf: java.lang.StringBuilder = new java.lang.StringBuilder();
        const states: java.util.List<DFAState> = this.dfa.getStates();
        for (const s of states) {
            let n = 0;
            if (s.edges !== undefined) {
                n = s.edges.length;
            }

            for (let i = 0; i < n; i++) {
                const t: DFAState = s.edges[i];
                if (t !== undefined && t.stateNumber !== java.lang.Integer.MAX_VALUE) {
                    buf.append(this.getStateString(s));
                    const label: string = this.getEdgeLabel(i);
                    buf.append("-").append(label).append("->").append(this.getStateString(t)).append("\n");
                }
            }
        }

        const output: string = buf.toString();
        if (output.length === 0) {
            return undefined;
        }

        //return Utils.sortLinesInString(output);
        return output;
    };

    protected getEdgeLabel = (i: number): string => {
        return this.vocabulary.getDisplayName(i - 1);
    };

    protected getStateString = (s: DFAState): string => {
        const n: number = s.stateNumber;
        const baseStateStr: string = (s.isAcceptState ? ":" : "") + "s" + n + (s.requiresFullContext ? "^" : "");
        if (s.isAcceptState) {
            if (s.predicates !== undefined) {
                return baseStateStr + "=>" + java.util.Arrays.toString(s.predicates);
            } else {
                return baseStateStr + "=>" + s.prediction;
            }
        } else {
            return baseStateStr;
        }
    };
}
