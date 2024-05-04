/* java2ts: keep */

/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

// cspell: disable

/* eslint-disable jsdoc/require-returns, jsdoc/require-param */

import { CommonTreeAdaptor } from "./CommonTreeAdaptor.js";
import type { Tree } from "./Tree.js";
import type { TreeAdaptor } from "./TreeAdaptor.js";
import type { TreeVisitorAction } from "./TreeVisitorAction.js";

/**
 * Do a depth first walk of a tree, applying pre() and post() actions as we discover and finish nodes.
 */
export class TreeVisitor {
    protected adaptor: TreeAdaptor;

    public constructor(adaptor?: TreeAdaptor) {
        this.adaptor = adaptor ?? new CommonTreeAdaptor();
    }

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
    public visit<T extends Tree>(t: T, action: TreeVisitorAction<T>): T {
        // System.out.println("visit "+((Tree)t).toStringTree());
        const isNil = this.adaptor.isNil(t);
        if (action !== null && !isNil) {
            t = action.pre(t); // if rewritten, walk children of new t
        }

        for (let i = 0; i < this.adaptor.getChildCount(t); i++) {
            const child = this.adaptor.getChild(t, i)!;
            const visitResult = this.visit(child, action);
            const childAfterVisit = this.adaptor.getChild(t, i);
            if (visitResult !== childAfterVisit) { // result & child differ?
                this.adaptor.setChild(t, i, visitResult);
            }
        }
        if (action !== null && !isNil) {
            t = action.post(t);
        }

        return t;
    }
}
