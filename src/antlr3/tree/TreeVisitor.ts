/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/* eslint-disable jsdoc/require-param, jsdoc/require-returns */

// cspell: disable

import type { ParserRuleContext } from "antlr4ng";

import { ANTLRv4ParserVisitor } from "../../generated/ANTLRv4ParserVisitor.js";

import type { TreeVisitorAction } from "./TreeVisitorAction.js";

/**
 * Do a depth first walk of a tree, applying pre() and post() actions as we discover and finish nodes.
 */
export class TreeVisitor extends ANTLRv4ParserVisitor<ParserRuleContext> {
    /**
     * Visit every node in tree t and trigger an action for each node
     *  before/after having visited all of its children.
     *  Execute both actions even if t has no children.
     *  If a child visit yields a new child, it can update its
     *  parent's child list or just return the new child.  The
     *  child update code works even if the child visit alters its parent
     *  and returns the new tree.
     *
     *  Return result of applying post action to this node.
     */
    public override visit(t: ParserRuleContext,
        action?: TreeVisitorAction<ParserRuleContext>): ParserRuleContext | null {
        const isNil = t.start === null;
        let result: ParserRuleContext | null = t;
        if (action && !isNil) {
            result = action.pre(t); // if rewritten, walk children of new t
        }

        for (let i = 0; i < t.getChildCount(); i++) {
            const child = t.children[i] as ParserRuleContext;
            const visitResult = this.visit(child, action);
            const childAfterVisit = t.children[i];
            if (visitResult !== childAfterVisit) { // result & child differ?
                t.children[i] = visitResult!;
            }
        }

        if (action && !isNil) {
            result = action.post(t);
        }

        return result;
    }
}
