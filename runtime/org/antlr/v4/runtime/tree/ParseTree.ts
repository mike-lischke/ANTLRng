/* java2ts: keep */

/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

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
 *  The payload is either a {@link Token} or a {@link RuleContext} object.
 */
export abstract class ParseTree extends SyntaxTree {
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
     *  since 4.7
     */
    public abstract setParent: (parent: RuleContext) => void;

    /** The {@link ParseTreeVisitor} needs a double dispatch method. */
    public abstract accept: <T>(visitor: ParseTreeVisitor<T>) => T;

    /**
     * Return the combined text of all leaf nodes. Does not get any
     *  off-channel tokens (if any) so won't return whitespace and
     *  comments if they are sent to parser on hidden channel.
     */
    public abstract getText: () => string;

    /**
     * Specialize toStringTree so that it can print out more information
     * 	based upon the parser.
     */
    public abstract toStringTree(parser?: Parser): string;
}
