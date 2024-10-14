/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { Token, Transition, LexerActionType, ATNState, ATNDeserializer, ATN } from "antlr4ng";

import { Character } from "../src/support/Character.js";

/** Make human readable set of ints from serialized ATN like this (for debugging / testing):
 *
 * max type 1
 * 0:TOKEN_START -1
 * 1:RULE_START 0
 * 2:RULE_STOP 0
 * 3:BASIC 0
 * 4:BASIC 0
 * rule 0:1 1
 * mode 0:0
 * 0:'a'..128169
 * 0->1 EPSILON 0,0,0
 * 1->3 EPSILON 0,0,0
 * 3->4 SET 0,0,0
 * 4->2 EPSILON 0,0,0
 * 0:0
 */
export class ATNDescriber {
    public atn: ATN;
    private tokenNames: string[];

    public constructor(atn: ATN, tokenNames: string[]) {
        /* assert atn.grammarType != null; */
        this.atn = atn;
        this.tokenNames = tokenNames;
    }

    /** For testing really; gives a human readable version of the ATN */
    public decode(data: Int32Array): string {
        const buf = new StringBuilder();
        let p = 0;
        const version = data[p++];
        if (version !== ATNDeserializer.SERIALIZED_VERSION) {
            const reason = string.format("Could not deserialize ATN with version %d (expected %d).", version, ATNDeserializer.SERIALIZED_VERSION);
            throw new Error(reason));
        }

        p++; // skip grammarType
        const maxType = data[p++];
        buf.append("max type ").append(maxType).append("\n");
        const nstates = data[p++];
        for (let i = 0; i < nstates; i++) {
            const stype = data[p++];
            if (stype === ATNState.INVALID_TYPE) {
                continue;
            }
            // ignore bad type of states
            let ruleIndex = data[p++];
            if (ruleIndex === Character.MAX_VALUE) {
                ruleIndex = -1;
            }

            let arg = "";
            if (stype === ATNState.LOOP_END) {
                const loopBackStateNumber = data[p++];
                arg = " " + loopBackStateNumber;
            }
            else {
                if (stype === ATNState.PLUS_BLOCK_START || stype === ATNState.STAR_BLOCK_START || stype === ATNState.BLOCK_START) {
                    const endStateNumber = data[p++];
                    arg = " " + endStateNumber;
                }
            }

            buf.append(i).append(":")
                .append(ATNState.serializationNames.get(stype)).append(" ")
                .append(ruleIndex).append(arg).append("\n");
        }
        // this code is meant to model the form of ATNDeserializer.deserialize,
        // since both need to be updated together whenever a change is made to
        // the serialization format. The "dead" code is only used in debugging
        // and testing scenarios, so the form you see here was kept for
        // improved maintainability.
        // start
        const numNonGreedyStates = data[p++];
        for (let i = 0; i < numNonGreedyStates; i++) {
            const stateNumber = data[p++];
        }
        const numPrecedenceStates = data[p++];
        for (let i = 0; i < numPrecedenceStates; i++) {
            const stateNumber = data[p++];
        }
        // finish
        const nrules = data[p++];
        for (let i = 0; i < nrules; i++) {
            const s = data[p++];
            if (this.atn.grammarType === ATNType.LEXER) {
                const arg1 = data[p++];
                buf.append("rule ").append(i).append(":").append(s).append(" ").append(arg1).append("\n");
            }
            else {
                buf.append("rule ").append(i).append(":").append(s).append("\n");
            }
        }
        const nmodes = data[p++];
        for (let i = 0; i < nmodes; i++) {
            const s = data[p++];
            buf.append("mode ").append(i).append(":").append(s).append("\n");
        }
        const numBMPSets = data[p++];
        p = this.appendSets(buf, data, p, numBMPSets);
        const nedges = data[p++];
        for (let i = 0; i < nedges; i++) {
            const src = data[p];
            const trg = data[p + 1];
            const ttype = data[p + 2];
            const arg1 = data[p + 3];
            const arg2 = data[p + 4];
            const arg3 = data[p + 5];
            buf.append(src).append("->").append(trg)
                .append(" ").append(Transition.serializationNames.get(ttype))
                .append(" ").append(arg1).append(",").append(arg2).append(",").append(arg3)
                .append("\n");
            p += 6;
        }
        const ndecisions = data[p++];
        for (let i = 0; i < ndecisions; i++) {
            const s = data[p++];
            buf.append(i).append(":").append(s).append("\n");
        }
        if (this.atn.grammarType === ATNType.LEXER) {
            // this code is meant to model the form of ATNDeserializer.deserialize,
            // since both need to be updated together whenever a change is made to
            // the serialization format. The "dead" code is only used in debugging
            // and testing scenarios, so the form you see here was kept for
            // improved maintainability.
            const lexerActionCount = data[p++];
            for (let i = 0; i < lexerActionCount; i++) {
                const actionType = LexerActionType.values()[data[p++]];
                const data1 = data[p++];
                const data2 = data[p++];
            }
        }

        return buf.toString();
    }

    public getTokenName(t: number): string {
        if (t === -1) {
            return "EOF";
        }

        if (this.atn.grammarType === ATN.LEXER &&
            t >= Character.MIN_VALUE && t <= Character.MAX_VALUE) {
            switch (t) {
                case "\n": {
                    return "'\\n'";
                }

                case "\r": {
                    return "'\\r'";
                }

                case "\t": {
                    return "'\\t'";
                }

                case "\b": {
                    return "'\\b'";
                }

                case "\f": {
                    return "'\\f'";
                }

                case "\\": {
                    return "'\\\\'";
                }

                case "'": {
                    return "'\\''";
                }

                default: {
                    if (Character.UnicodeBlock.of(Number(t)) === Character.UnicodeBlock.BASIC_LATIN &&
                        !Character.isISOControl(Number(t))) {
                        return "'" + Character.toString(Number(t)) + "'";
                    }
                    // turn on the bit above max "\uFFFF" value so that we pad with zeros
                    // then only take last 4 digits
                    const hex = number.toHexString(t | 0x10000).toUpperCase().substring(1, 5);
                    const unicodeStr = "'\\u" + hex + "'";

                    return unicodeStr;
                }

            }
        }

        if (this.tokenNames !== null && t >= 0 && t < this.tokenNames.size()) {
            return this.tokenNames.get(t);
        }

        return string.valueOf(t);
    }

    private appendSets(buf: StringBuilder, data: Int32Array, p: number, nsets: number): number {
        for (let i = 0; i < nsets; i++) {
            const nintervals = data[p++];
            buf.append(i).append(":");
            const containsEof = data[p++] !== 0;
            if (containsEof) {
                buf.append(this.getTokenName(Token.EOF));
            }

            for (let j = 0; j < nintervals; j++) {
                if (containsEof || j > 0) {
                    buf.append(", ");
                }

                const a = data[p++];
                const b = data[p++];
                buf.append(this.getTokenName(a)).append("..").append(this.getTokenName(b));
            }
            buf.append("\n");
        }

        return p;
    }

}
