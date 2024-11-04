/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import type { CommonTree } from "../../tree/CommonTree.js";

/**
 * This is identical to the {@link ParserRuleReturnScope} except that
 * the start property is a tree nodes not {@link Token} object
 * when you are parsing trees.
 */
export class TreeRuleReturnScope {
    /** First node or root node of tree matched for this rule. */
    public start: CommonTree | null = null;
    //public stop: CommonTree | null = null;
    public tree: CommonTree | null = null;
}

export interface ITreeRuleReturnScope<T extends CommonTree> {
    /** First node or root node of tree matched for this rule. */
    start?: CommonTree;
    //stop?: CommonTree;
    tree?: T;
}
