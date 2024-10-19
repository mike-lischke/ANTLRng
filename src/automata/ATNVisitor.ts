/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { ATNState } from "antlr4ng";

/**
 * A simple visitor that walks everywhere it can go starting from s,
 *  without going into an infinite cycle. Override and implement
 *  visitState() to provide functionality.
 */
export class ATNVisitor {
    public visit(s: ATNState): void {
        this.doVisit(s, new Set<number>());
    }

    public visitState(s: ATNState): void {
        // intentionally empty
    }

    private doVisit(s: ATNState, visited: Set<number>): void {
        if (visited.has(s.stateNumber)) {
            return;
        }

        visited.add(s.stateNumber);

        this.visitState(s);
        for (const t of s.transitions) {
            this.doVisit(t.target, visited);
        }
    }

}
