/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */


/*
 eslint-disable @typescript-eslint/no-namespace, @typescript-eslint/naming-convention,
 max-classes-per-file, jsdoc/check-tag-names, @typescript-eslint/no-empty-function,
 @typescript-eslint/restrict-plus-operands, @typescript-eslint/unified-signatures, @typescript-eslint/member-ordering,
 no-underscore-dangle
*/

/* cspell: disable */



import { ParseTree } from "./ParseTree";




/**
 * Associate a property with a parse tree node. Useful with parse tree listeners
 * that need to associate values with particular tree nodes, kind of like
 * specifying a return value for the listener event method that visited a
 * particular node. Example:
 *
 * <pre>
 * ParseTreeProperty&lt;Integer&gt; values = new ParseTreeProperty&lt;Integer&gt;();
 * values.put(tree, 36);
 * int x = values.get(tree);
 * values.removeFrom(tree);
 * </pre>
 *
 * You would make one decl (values here) in the listener and use lots of times
 * in your event methods.
 */
export  class ParseTreeProperty<V> {
	protected annotations?:  Map<ParseTree, V> = new  IdentityHashMap<ParseTree, V>();

	public get = (node: ParseTree): V => { return this.annotations.get(node); }
	public put = (node: ParseTree, value: V): void => { this.annotations.set(node, value); }
	public removeFrom = (node: ParseTree): V => { return this.annotations.delete(node); }
}
