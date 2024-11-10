/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import type { CommonTree } from "../../tree/CommonTree.js";
import { RewriteRuleElementStream } from "./RewriteRuleElementStream.js";

/**
 * Queues up nodes matched on left side of -&gt; in a tree parser. This is
 *  the analog of RewriteRuleTokenStream for normal parsers.
 */
export class RewriteRuleNodeStream extends RewriteRuleElementStream {

    public nextNode(): CommonTree {
        return this._next();
    }

    protected override toTree(el: CommonTree): CommonTree {
        return this.adaptor.dupNode(el);
    }

    protected dup(el: CommonTree): CommonTree {
        // we dup every node, so don't have to worry about calling dup; short-
        // circuited next() so it doesn't call.
        throw new Error("dup can't be called for a node stream.");
    }
}
