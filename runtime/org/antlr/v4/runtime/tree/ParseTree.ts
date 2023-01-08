/* java2ts: keep */

/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { java } from "../../../../../../lib/java/java";
import { ParseTreeVisitor } from "./ParseTreeVisitor";
import { SyntaxTree } from "./SyntaxTree";
import { Parser } from "../Parser";
import { RuleContext } from "../RuleContext";

/**
 * An interface to access the tree of {@link RuleContext} objects created
 *  during a parse that makes the data structure look like a simple parse tree.
 *  This node represents both internal nodes, rule invocations,
 *  and leaf nodes, token matches.
 *
 *  <p>The payload is either a {@link Token} or a {@link RuleContext} object.</p>
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export interface ParseTree extends SyntaxTree {
    // the following methods narrow the return type; they are not additional methods
    getParent: () => ParseTree;
    getChild: (i: number) => ParseTree;

    /**
     * Set the parent for this node.
     *
     *  This is not backward compatible as it changes
     *  the interface but no one was able to create custom
     *  nodes anyway so I'm adding as it improves internal
     *  code quality.
     *
     *  One could argue for a restructuring of
     *  the class/interface hierarchy so that
     *  setParent, addChild are moved up to Tree
     *  but that's a major change. So I'll do the
     *  minimal change, which is to add this method.
     *
     */
    setParent: (parent: RuleContext | null) => void;

    /** The {@link ParseTreeVisitor} needs a double dispatch method. */
    accept: <T>(visitor: ParseTreeVisitor<T> | null) => T;

    /**
     * Return the combined text of all leaf nodes. Does not get any
     *  off-channel tokens (if any) so won't return whitespace and
     *  comments if they are sent to parser on hidden channel.
     */
    getText: () => java.lang.String;

    /**
     * Specialize toStringTree so that it can print out more information
     * 	based upon the parser.
     */
    toStringTree: (parser?: Parser) => java.lang.String;
}
