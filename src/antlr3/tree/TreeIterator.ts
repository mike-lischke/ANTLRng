/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

// cspell: disable

import { Token } from "antlr4ng";

import { FastQueue } from "../misc/FastQueue.js";
import { CommonTreeAdaptor } from "./CommonTreeAdaptor.js";
import type { Tree } from "./Tree.js";
import type { TreeAdaptor } from "./TreeAdaptor.js";
import { TreeParser } from "./TreeParser.js";

/**
 * Return a node stream from a doubly-linked tree whose nodes
 *  know what child index they are.  No remove() is supported.
 *
 *  Emit navigation nodes (DOWN, UP, and EOF) to let show tree structure.
 */
export class TreeIterator {

    // navigation nodes to return during walk and at end
    public up: Tree;
    public down: Tree;
    public eof: Tree;
    protected adaptor: TreeAdaptor;
    protected root: Tree;
    protected tree: Tree | null;
    protected firstTime = true;

    /**
     * If we emit UP/DOWN nodes, we need to spit out multiple nodes per
     *  next() call.
     */
    protected nodes: FastQueue<Tree>;

    public constructor(tree: Tree);
    public constructor(adaptor: TreeAdaptor, tree: Tree);
    public constructor(...args: unknown[]) {
        let tree;
        let adaptor;

        if (args.length === 1) {
            [tree] = args as [Tree];

            adaptor = new CommonTreeAdaptor();
        } else {
            [adaptor, tree] = args as [TreeAdaptor, Tree];
        }

        this.adaptor = adaptor;
        this.tree = tree;
        this.root = tree;
        this.nodes = new FastQueue<Tree>();
        this.down = adaptor.create(TreeParser.DOWN, "DOWN");
        this.up = adaptor.create(TreeParser.UP, "UP");
        this.eof = adaptor.create(Token.EOF, "EOF");
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

        if (this.nodes !== null && this.nodes.size > 0) {
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

    public nextTree(): Tree | null {
        if (this.firstTime) { // initial condition
            this.firstTime = false;
            if (this.adaptor.getChildCount(this.tree!) === 0) { // single node tree (special)
                this.nodes.add(this.eof);

                return this.tree;
            }

            return this.tree;
        }
        // if any queued up, use those first
        if (this.nodes !== null && this.nodes.size > 0) {
            return this.nodes.remove();
        }

        // no nodes left?
        if (this.tree === null) {
            return this.eof;
        }

        // next node will be child 0 if any children
        if (this.adaptor.getChildCount(this.tree) > 0) {
            this.tree = this.adaptor.getChild(this.tree, 0);
            this.nodes.add(this.tree!); // real node is next after DOWN

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
        this.nodes.add(this.tree!); // add to queue, might have UP nodes in there

        return this.nodes.remove();
    }

    public remove(): void {
        throw new Error("Remove is unsupported");
    }
}
