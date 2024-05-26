/* java2ts: keep */

/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

// cspell: disable

/* eslint-disable jsdoc/require-returns, jsdoc/require-param */

import type { Tree } from "./Tree.js";

/**
 * This is identical to the {@link ParserRuleReturnScope} except that
 *  the start property is a tree nodes not {@link Token} object
 *  when you are parsing trees.  To be generic the tree node types
 *  have to be {@link Object}.
 */
export class TreeRuleReturnScope {
    /** First node or root node of tree matched for this rule. */
    #start: Tree;
    public getStart(): Tree {
        return this.#start;
    }

    /** Return the stop token or tree */
    public getStop(): unknown { return null; }

    /** Has a value potentially if output=AST; */
    public getTree(): Tree | null { return null; }

    /**
     * Has a value potentially if output=template; Don't use StringTemplate
     * type as it then causes a dependency with ST lib.
     */
    public getTemplate(): unknown { return null; }
}
