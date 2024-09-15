/* java2ts: keep */

/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import type { Token } from "antlr4ng";

import { ANTLRMessage } from "./ANTLRMessage.js";
import { ErrorType } from "./ErrorType.js";
import { type Rule } from "./Rule.js";

export class LeftRecursionCyclesMessage extends ANTLRMessage {
    public constructor(fileName: string, cycles: Rule[][]) {
        super(ErrorType.LEFT_RECURSION_CYCLES, LeftRecursionCyclesMessage.getStartTokenOfFirstRule(cycles), cycles);
        this.fileName = fileName;
    }

    protected static getStartTokenOfFirstRule(cycles: Rule[][]): Token | null {
        for (const collection of cycles) {
            for (const rule of collection) {
                return rule.ast.getToken();
            }
        }

        return null;
    }
}
