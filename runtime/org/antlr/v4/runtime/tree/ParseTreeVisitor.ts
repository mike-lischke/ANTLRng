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
import { RuleNode } from "./RuleNode";
import { TerminalNode } from "./TerminalNode";




/**
 * This interface defines the basic notion of a parse tree visitor. Generated
 * visitors implement this interface and the {@code XVisitor} interface for
 * grammar {@code X}.
 *
 * @param <T> The return type of the visit operation. Use {@link Void} for
 * operations with no return type.
 */
export  interface ParseTreeVisitor<T> {

	/**
	 * Visit a parse tree, and return a user-defined result of the operation.
	 *
	 * @param tree The {@link ParseTree} to visit.
	  @returns The result of visiting the parse tree.
	 */
	 visit: (tree: ParseTree| null) => T;

	/**
	 * Visit the children of a node, and return a user-defined result of the
	 * operation.
	 *
	 * @param node The {@link RuleNode} whose children should be visited.
	  @returns The result of visiting the children of the node.
	 */
	 visitChildren: (node: RuleNode| null) => T;

	/**
	 * Visit a terminal node, and return a user-defined result of the operation.
	 *
	 * @param node The {@link TerminalNode} to visit.
	  @returns The result of visiting the node.
	 */
	 visitTerminal: (node: TerminalNode| null) => T;

	/**
	 * Visit an error node, and return a user-defined result of the operation.
	 *
	 * @param node The {@link ErrorNode} to visit.
	  @returns The result of visiting the node.
	 */
	 visitErrorNode: (node: ErrorNode| null) => T;

}
