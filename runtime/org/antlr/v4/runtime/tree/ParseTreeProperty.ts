/* java2ts: keep */

/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { JavaObject, java } from "jree";
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
export class ParseTreeProperty<V> extends JavaObject {
    protected annotations = new java.util.IdentityHashMap<ParseTree, V>();

    public get = (node: ParseTree): V | null => {
        return this.annotations.get(node);
    };

    public put = (node: ParseTree, value: V): void => {
        this.annotations.put(node, value);
    };

    public removeFrom = (node: ParseTree): V | null => {
        return this.annotations.remove(node);
    };
}
