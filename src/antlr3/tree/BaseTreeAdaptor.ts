/* java2ts: keep */

/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

// cspell: disable

import { isToken, type RecognitionException, type Token, type TokenStream } from "antlr4ng";

import { CommonErrorNode } from "./CommonErrorNode.js";
import type { Tree } from "./Tree.js";
import type { TreeAdaptor } from "./TreeAdaptor.js";

/** A TreeAdaptor that works with any Tree implementation. */
export abstract class BaseTreeAdaptor implements TreeAdaptor {
    /**
     * System.identityHashCode() is not always unique; we have to
     *  track ourselves.  That's ok, it's only for debugging, though it's
     *  expensive: we have to create a hashtable with all tree nodes in it.
     */
    protected treeToUniqueIDMap = new Map<Tree, number>();
    protected uniqueNodeID = 1;

    public create(payload: Token | null): Tree;
    public create(tokenType: number, text: string): Tree;
    public create(tokenType: number, fromToken: Token, text?: string): Tree;
    public create(...args: unknown[]): Tree {
        if (args.length === 1) {
            // Simulate an abstract method for an overloaded method.
            throw new Error("Abstract method called: BaseTreeAdaptor.create(Token)");
        }

        switch (args.length) {
            case 2: {
                if (typeof args[1] === "string") {
                    const [tokenType, text] = args as [number, string];

                    const fromToken = this.createToken(tokenType, text);

                    return this.create(fromToken);
                } else {
                    const [tokenType, fromToken] = args as [number, Token];

                    const temp = this.createToken(fromToken);
                    temp.type = tokenType;

                    return this.create(temp);
                }
            }

            case 3: {
                const [tokenType, fromToken, text] = args as [number, Token | null, string];

                if (fromToken === null) {
                    return this.create(tokenType, text);
                }

                const temp = this.createToken(fromToken);
                temp.type = tokenType;
                temp.text = text;

                return this.create(temp);
            }

            default: {
                throw new Error("Invalid number of arguments");
            }
        }
    }

    public nil(): Tree {
        return this.create(null);
    }

    /**
     * create tree node that holds the start and stop tokens associated
     *  with an error.
     *
     *  If you specify your own kind of tree nodes, you will likely have to
     *  override this method. CommonTree returns Token.INVALID_TOKEN_TYPE
     *  if no token payload but you might have to set token type for diff
     *  node type.
     *
     *  You don't have to subclass CommonErrorNode; you will likely need to
     *  subclass your own tree node class to avoid class cast exception.
     */
    public errorNode(input: TokenStream, start: Token, stop: Token,
        e: RecognitionException): Tree {
        return new CommonErrorNode(input, start, stop, e);
    }

    public isNil(tree: Tree | null): boolean {
        if (tree === null) {
            return true;
        }

        return tree.isNil();
    }

    /**
     * This is generic in the sense that it will work with any kind of
     *  tree (not just Tree interface).  It invokes the adaptor routines
     *  not the tree node routines to do the construction.
     */
    public dupTree(t: Tree, parent?: Tree): Tree {
        const newTree = this.dupNode(t);

        // ensure new subtree root has parent/child index set
        this.setChildIndex(newTree, this.getChildIndex(t)); // same index in new tree
        if (parent) {
            this.setParent(newTree, parent);
        }

        const n = this.getChildCount(t);
        for (let i = 0; i < n; i++) {
            const child = this.getChild(t, i)!;
            const newSubTree = this.dupTree(child, t);
            this.addChild(newTree, newSubTree);
        }

        return newTree;
    }

    /**
     * Add a child to the tree t.  If child is a flat tree (a list), make all
     *  in list children of t.  Warning: if t has no children, but child does
     *  and child isNil then you can decide it is ok to move children to t via
     *  t.children = child.children; i.e., without copying the array.  Just
     *  make sure that this is consistent with have the user will build
     *  ASTs.
     */
    public addChild(t: Tree, child: Tree): void {
        t.addChild(child);
    }

    /**
     * If oldRoot is a nil root, just copy or move the children to newRoot.
     *  If not a nil root, make oldRoot a child of newRoot.
     *
     *    old=^(nil a b c), new=r yields ^(r a b c)
     *    old=^(a b c), new=r yields ^(r ^(a b c))
     *
     *  If newRoot is a nil-rooted single child tree, use the single
     *  child as the new root node.
     *
     *    old=^(nil a b c), new=^(nil r) yields ^(r a b c)
     *    old=^(a b c), new=^(nil r) yields ^(r ^(a b c))
     *
     *  If oldRoot was null, it's ok, just return newRoot (even if isNil).
     *
     *    old=null, new=r yields r
     *    old=null, new=^(nil r) yields ^(nil r)
     *
     *  Return newRoot.  Throw an exception if newRoot is not a
     *  simple node or nil root with a single child node--it must be a root
     *  node.  If newRoot is ^(nil x) return x as newRoot.
     *
     *  Be advised that it's ok for newRoot to point at oldRoot's
     *  children; i.e., you don't have to copy the list.  We are
     *  constructing these nodes so we should have this control for
     *  efficiency.
     */
    public becomeRoot(newRoot: Tree | Token, oldRoot: Tree | null): Tree {
        if (isToken(newRoot)) {
            newRoot = this.create(newRoot);
        }

        if (oldRoot === null) {
            return newRoot;
        }

        // handle ^(nil real-node)
        if (newRoot.isNil()) {
            const nc = newRoot.getChildCount();
            if (nc === 1) {
                newRoot = newRoot.getChild(0)!;
            } else {
                if (nc > 1) {
                    // TODO: make tree run time exceptions hierarchy
                    throw new Error("more than one node as root (TODO: make exception hierarchy)");
                }
            }
        }

        // add oldRoot to newRoot; addChild takes care of case where oldRoot
        // is a flat list (i.e., nil-rooted tree).  All children of oldRoot
        // are added to newRoot.
        newRoot.addChild(oldRoot);

        return newRoot;
    }

    /**
     * Transform ^(nil x) to x and nil to null
     */
    public rulePostProcessing(root: Tree): Tree | null {
        let r: Tree | null = root;
        if (r.isNil()) {
            if (r.getChildCount() === 0) {
                r = null;
            } else if (r.getChildCount() === 1) {
                r = r.getChild(0)!;
                // whoever invokes rule will set parent and child index
                r.setParent(null);
                r.setChildIndex(-1);
            }

        }

        return r;
    }

    public getType(t: unknown): number {
        return (t as Tree).getType();
    }

    public setType(t: unknown, type: number): void {
        throw new Error("don't know enough about Tree node");
    }

    public getText(t: Tree): string | null {
        return t.getText();
    }

    public setText(t: unknown, text: string): void {
        throw new Error("don't know enough about Tree node");
    }

    public getChild(t: Tree, i: number): Tree | null {
        return t.getChild(i);
    }

    public setChild(t: unknown, i: number, child: unknown): void {
        (t as Tree).setChild(i, child as Tree);
    }

    public deleteChild(t: Tree, i: number): Tree | null {
        return t.deleteChild(i);
    }

    public getChildCount(t: unknown): number {
        return (t as Tree).getChildCount();
    }

    public getUniqueID(node: Tree): number {
        const prevID = this.treeToUniqueIDMap.get(node);
        if (prevID) {
            return prevID;
        }

        const id = this.uniqueNodeID++;
        this.treeToUniqueIDMap.set(node, id);

        return id;
    }

    /**
     * Tell me how to create a token for use with imaginary token nodes.
     *  For example, there is probably no input symbol associated with imaginary
     *  token DECL, but you need to create it as a payload or whatever for
     *  the DECL node as in ^(DECL type ID).
     *
     *  If you care what the token payload objects' type is, you should
     *  override this method and any other createToken variant.
     */
    public abstract createToken(tokenType: number, text: string): Token;

    /**
     * Tell me how to create a token for use with imaginary token nodes.
     *  For example, there is probably no input symbol associated with imaginary
     *  token DECL, but you need to create it as a payload or whatever for
     *  the DECL node as in ^(DECL type ID).
     *
     *  This is a variant of createToken where the new token is derived from
     *  an actual real input token.  Typically this is for converting '{'
     *  tokens to BLOCK etc...  You'll see
     *
     *    r : lc='{' ID+ '}' -&gt; ^(BLOCK[$lc] ID+) ;
     *
     *  If you care what the token payload objects' type is, you should
     *  override this method and any other createToken variant.
     */
    public abstract createToken(fromToken: Token): Token;

    public abstract dupNode(treeNode: Tree): Tree;

    public abstract getParent(t: Tree | null): Tree | null;
    public abstract setParent(t: Tree | null, parent: Tree | null): void;

    public abstract getChildIndex(t: Tree): number;
    public abstract setChildIndex(t: Tree, index: number): void;

    public abstract getToken(t: Tree): Token | null;
    public abstract setTokenBoundaries(t: Tree, startToken: Token, stopToken: Token): void;
    public abstract getTokenStartIndex(t: Tree): number;
    public abstract getTokenStopIndex(t: Tree): number;

    public abstract replaceChildren(parent: Tree, startChildIndex: number, stopChildIndex: number, t: Tree): void;
}
