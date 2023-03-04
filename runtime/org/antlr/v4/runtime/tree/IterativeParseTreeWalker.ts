/* java2ts: keep */

/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { java } from "jree";
import { isErrorNode } from "./ErrorNode";
import { ParseTree } from "./ParseTree";
import { ParseTreeListener } from "./ParseTreeListener";
import { ParseTreeWalker } from "./ParseTreeWalker";
import { isRuleNode, RuleNode } from "./RuleNode";
import { isTerminalNode } from "./TerminalNode";
import { IntegerStack } from "../misc/IntegerStack";

/**
 * An iterative (read: non-recursive) pre-order and post-order tree walker that
 * doesn't use the thread stack but heap-based stacks. Makes it possible to
 * process deeply nested parse trees.
 */
export class IterativeParseTreeWalker extends ParseTreeWalker {

    public walk = (listener: ParseTreeListener, t: ParseTree): void => {
        const nodeStack = new java.util.ArrayDeque<ParseTree>();
        const indexStack = new IntegerStack();

        let currentNode: ParseTree | null = t;
        let currentIndex = 0;

        while (currentNode !== null) {
            // pre-order visit
            if (isErrorNode(currentNode)) {
                listener.visitErrorNode(currentNode);
            } else {
                if (isTerminalNode(currentNode)) {
                    listener.visitTerminal(currentNode);
                } else {
                    const r = currentNode as RuleNode;
                    this.enterRule(listener, r);
                }
            }

            // Move down to first child, if exists
            if (currentNode.getChildCount() > 0) {
                nodeStack.push(currentNode);
                indexStack.push(currentIndex);
                currentIndex = 0;
                currentNode = currentNode.getChild(0)!;
                continue;
            }

            // No child nodes, so walk tree
            do {
                // post-order visit
                if (isRuleNode(currentNode)) {
                    this.exitRule(listener, currentNode);
                }

                // No parent, so no siblings
                if (nodeStack.isEmpty()) {
                    currentNode = null;
                    currentIndex = 0;
                    break;
                }

                // Move to next sibling if possible
                currentNode = nodeStack.peek()!.getChild(++currentIndex);
                if (currentNode !== null) {
                    break;
                }

                // No next, sibling, so move up
                currentNode = nodeStack.pop();
                currentIndex = indexStack.pop();

            } while (currentNode !== null);
        }
    };
}
