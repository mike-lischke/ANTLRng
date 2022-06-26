/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */


/*
 eslint-disable @typescript-eslint/no-namespace, @typescript-eslint/naming-convention, no-redeclare,
 max-classes-per-file, jsdoc/check-tag-names, @typescript-eslint/no-empty-function,
 @typescript-eslint/restrict-plus-operands, @typescript-eslint/unified-signatures, @typescript-eslint/member-ordering,
 no-underscore-dangle, max-len
*/

/* cspell: disable */



import { ErrorNode } from "./ErrorNode";
import { ParseTree } from "./ParseTree";
import { ParseTreeListener } from "./ParseTreeListener";
import { ParseTreeWalker } from "./ParseTreeWalker";
import { RuleNode } from "./RuleNode";
import { TerminalNode } from "./TerminalNode";
import { IntegerStack } from "../misc/IntegerStack";




/**
 * An iterative (read: non-recursive) pre-order and post-order tree walker that
 * doesn't use the thread stack but heap-based stacks. Makes it possible to
 * process deeply nested parse trees.
 */
export  class IterativeParseTreeWalker extends ParseTreeWalker {

	public walk = (listener: ParseTreeListener, t: ParseTree): void => {

		 let  nodeStack: Deque<ParseTree> = new  ArrayDeque<ParseTree>();
		 let  indexStack: IntegerStack = new  IntegerStack();

		let  currentNode: ParseTree = t;
		let  currentIndex: number = 0;

		while (currentNode !== undefined) {

			// pre-order visit
			if (currentNode instanceof ErrorNode) {
				listener.visitErrorNode( currentNode as ErrorNode);
			}
			else { if (currentNode instanceof TerminalNode) {
				listener.visitTerminal( currentNode as TerminalNode);
			}
			else {
				 let  r: RuleNode =  currentNode as RuleNode;
				this.enterRule(listener, r);
			}
}


			// Move down to first child, if exists
			if (currentNode.getChildCount() > 0) {
				nodeStack.push(currentNode);
				indexStack.push(currentIndex);
				currentIndex = 0;
				currentNode = currentNode.getChild(0);
				continue;
			}

			// No child nodes, so walk tree
			do {

				// post-order visit
				if (currentNode instanceof RuleNode) {
					this.exitRule(listener,  currentNode as RuleNode);
				}

				// No parent, so no siblings
				if (nodeStack.isEmpty()) {
					currentNode = undefined;
					currentIndex = 0;
					break;
				}

				// Move to next sibling if possible
				currentNode = nodeStack.peek().getChild(++currentIndex);
				if (currentNode !== undefined) {
					break;
				}

				// No next, sibling, so move up
				currentNode = nodeStack.pop();
				currentIndex = indexStack.pop();

			} while (currentNode !== undefined);
		}
	}
}
