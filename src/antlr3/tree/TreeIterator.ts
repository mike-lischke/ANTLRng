/* java2ts: keep */

/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

// cspell: disable

/* eslint-disable jsdoc/require-returns, jsdoc/require-param */

import { Token } from "antlr4ng";
import { FastQueue } from "../misc/FastQueue.js";
import { CommonTreeAdaptor } from "./CommonTreeAdaptor.js";
import type { TreeAdaptor } from "./TreeAdaptor.js";

/**
 * Return a node stream from a doubly-linked tree whose nodes
 *  know what child index they are.  No remove() is supported.
 *
 *  Emit navigation nodes (DOWN, UP, and EOF) to let show tree structure.
 */
export class TreeIterator implements Iterator<unknown> {

    // navigation nodes to return during walk and at end
    public up: unknown;
    public down: unknown;
    public eof: unknown;
    protected adaptor: TreeAdaptor;
    protected root: unknown;
    protected tree: unknown;
    protected firstTime = true;

    /**
     * If we emit UP/DOWN nodes, we need to spit out multiple nodes per
     *  next() call.
     */
    protected nodes: FastQueue<unknown>;

    public constructor(tree: unknown);

    public constructor(adaptor: TreeAdaptor, tree: unknown);
    public constructor(...args: unknown[]) {
        switch (args.length) {
            case 1: {
                const [tree] = args as [unknown];

                this(new CommonTreeAdaptor(), tree);

                break;
            }

            case 2: {
                const [adaptor, tree] = args as [TreeAdaptor, unknown];

                this.adaptor = adaptor;
                this.tree = tree;
                this.root = tree;
                this.nodes = new FastQueue<unknown>();
                this.down = adaptor.create(Token.DOWN, "DOWN");
                this.up = adaptor.create(Token.UP, "UP");
                this.eof = adaptor.create(Token.EOF, "EOF");

                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }

    public reset(): void {
        this.firstTime = true;
        this.tree = this.root;
        this.nodes.clear();
    }

    public hasNext(): boolean {
        if (this.firstTime) {
            return this.root !== null;
        }

        if (this.nodes !== null && this.nodes.size() > 0) {
            return true;
        }

        if (this.tree === null) {
            return false;
        }

        if (this.adaptor.getChildCount(this.tree) > 0) {
            return true;
        }

        return this.adaptor.getParent(this.tree) !== null; // back at root?
    }

    public next(): unknown {
        if (this.firstTime) { // initial condition
            this.firstTime = false;
            if (this.adaptor.getChildCount(this.tree) === 0) { // single node tree (special)
                this.nodes.add(this.eof);

                return this.tree;
            }

            return this.tree;
        }
        // if any queued up, use those first
        if (this.nodes !== null && this.nodes.size() > 0) {
            return this.nodes.remove();
        }

        // no nodes left?
        if (this.tree === null) {
            return this.eof;
        }

        // next node will be child 0 if any children
        if (this.adaptor.getChildCount(this.tree) > 0) {
            this.tree = this.adaptor.getChild(this.tree, 0);
            this.nodes.add(this.tree); // real node is next after DOWN

            return this.down;
        }
        // if no children, look for next sibling of tree or ancestor
        let parent = this.adaptor.getParent(this.tree);
        // while we're out of siblings, keep popping back up towards root
        while (parent !== null &&
            this.adaptor.getChildIndex(this.tree) + 1 >= this.adaptor.getChildCount(parent)) {
            this.nodes.add(this.up); // we're moving back up
            this.tree = parent;
            parent = this.adaptor.getParent(this.tree);
        }
        // no nodes left?
        if (parent === null) {
            this.tree = null; // back at root? nothing left then
            this.nodes.add(this.eof); // add to queue, might have UP nodes in there

            return this.nodes.remove();
        }

        // must have found a node with an unvisited sibling
        // move to it and return it
        const nextSiblingIndex = this.adaptor.getChildIndex(this.tree) + 1;
        this.tree = this.adaptor.getChild(parent, nextSiblingIndex);
        this.nodes.add(this.tree); // add to queue, might have UP nodes in there

        return this.nodes.remove();
    }

    public remove(): void { throw new UnsupportedOperationException(); }
}
