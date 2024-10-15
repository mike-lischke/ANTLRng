/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { RewriteRuleElementStream } from "./RewriteRuleElementStream.js";
import type { Tree } from "./Tree.js";

/**
 * Queues up nodes matched on left side of -&gt; in a tree parser. This is
 *  the analog of RewriteRuleTokenStream for normal parsers.
 */
export class RewriteRuleNodeStream extends RewriteRuleElementStream {

    public nextNode(): Tree {
        return this._next();
    }

    protected override toTree(el: Tree): Tree {
        return this.adaptor.dupNode(el);
    }

    protected dup(el: Tree): Tree {
        // we dup every node, so don't have to worry about calling dup; short-
        // circuited next() so it doesn't call.
        throw new Error("dup can't be called for a node stream.");
    }
}
