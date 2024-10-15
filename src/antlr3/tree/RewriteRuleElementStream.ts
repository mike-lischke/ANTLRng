/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/* eslint-disable jsdoc/require-param, jsdoc/require-returns */

import type { Tree } from "./Tree.js";
import type { TreeAdaptor } from "./TreeAdaptor.js";

/**
 * A generic list of elements tracked in an alternative to be used in
 *  a -&gt; rewrite rule.  We need to subclass to fill in the next() method,
 *  which returns either an AST node wrapped around a token payload or
 *  an existing subtree.
 *
 *  Once you start next()ing, do not try to add more elements.  It will
 *  break the cursor tracking I believe.
 *
 *  @see org.antlr.runtime.tree.RewriteRuleSubtreeStream
 *  @see org.antlr.runtime.tree.RewriteRuleTokenStream
 *
 *  TODO: add mechanism to detect/puke on modification after reading from stream
 */
export abstract class RewriteRuleElementStream {
    /**
     * Cursor 0..n-1.  If singleElement!=null, cursor is 0 until you next(),
     *  which bumps it to 1 meaning no more elements.
     */
    protected cursor = 0;

    /** The list of tokens or subtrees we are tracking */
    protected elements: Tree[];

    /**
     * Once a node / subtree has been used in a stream, it must be dup'd
     *  from then on.  Streams are reset after subrules so that the streams
     *  can be reused in future subrules.  So, reset must set a dirty bit.
     *  If dirty, then next() always returns a dup.
     *
     *  I wanted to use "naughty bit" here, but couldn't think of a way
     *  to use "naughty".
     *
     *  TODO: unused?
     */
    protected dirty = false;

    /**
     * The element or stream description; usually has name of the token or
     *  rule reference that this list tracks.  Can include rule name too, but
     *  the exception would track that info.
     */
    protected elementDescription: string;
    protected adaptor: TreeAdaptor;

    public constructor(adaptor: TreeAdaptor, elementDescription: string, elements?: Tree[]) {
        this.elementDescription = elementDescription;
        this.adaptor = adaptor;
        this.elements = elements ?? [];
    }

    /**
     * Reset the condition of this stream so that it appears we have
     *  not consumed any of its elements.  Elements themselves are untouched.
     *  Once we reset the stream, any future use will need duplicates.  Set
     *  the dirty bit.
     */
    public reset(): void {
        this.cursor = 0;
        this.dirty = true;
    }

    public add(el: Tree | null): void {
        if (el) {
            this.elements.push(el);
        }
    }

    /**
     * Return the next element in the stream.  If out of elements, throw
     *  an exception unless size()==1.  If size is 1, then return elements[0].
     *  Return a duplicate node/subtree if stream is out of elements and
     *  size==1.  If we've already used the element, dup (dirty bit set).
     */
    public nextTree(): Tree {
        const n = this.size();
        if (this.dirty || (this.cursor >= n && n === 1)) {
            // if out of elements and size is 1, dup
            const el = this._next();

            return this.dup(el);
        }
        // test size above then fetch
        const el = this._next();

        return el;
    }

    public hasNext(): boolean {
        return this.cursor < this.elements.length;
    }

    public size(): number {
        return this.elements.length;
    }

    public getDescription(): string {
        return this.elementDescription;
    }

    /**
     * do the work of getting the next element, making sure that it's
     *  a tree node or subtree. Throw an exception
     *  if the stream is empty or we're out of elements and size > 1.
     *  protected so you can override in a subclass if necessary.
     */
    protected _next(): Tree {
        const n = this.size();
        if (n === 0) {
            throw new Error(this.elementDescription);
        }

        if (this.cursor >= n) { // out of elements?
            if (n === 1) { // if size is 1, it's ok; return and we'll dup
                return this.toTree(this.elements[0]);
            }

            // out of elements and size was not 1, so we can't dup
            throw new Error(this.elementDescription);
        }

        if (n === 1) {
            this.cursor++; // move cursor even for single element list

            return this.toTree(this.elements[0]);
        }

        // must have more than one in list, pull from elements
        const o = this.toTree(this.elements[this.cursor]);
        this.cursor++;

        return o;
    }

    /**
     * Ensure stream emits trees; tokens must be converted to AST nodes.
     *  AST nodes can be passed through unmolested.
     */
    protected toTree(el: Tree): Tree {
        return el;
    }

    /**
     * When constructing trees, sometimes we need to dup a token or AST
     * 	subtree.  Dup'ing a token means just creating another AST node
     *  around it.  For trees, you must call the adaptor.dupTree() unless
     *  the element is for a tree root; then it must be a node dup.
     */
    protected abstract dup(el: Tree): Tree;

}