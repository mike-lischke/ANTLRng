/* java2ts: keep */

/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

// cspell: disable

/* eslint-disable jsdoc/require-returns, jsdoc/require-param */

import { Token } from "antlr4ng";

import { BaseTree } from "./BaseTree.js";
import type { Tree } from "./Tree.js";

/**
 * A tree node that is wrapper for a Token object.  After 3.0 release
 *  while building tree rewrite stuff, it became clear that computing
 *  parent and child index is very difficult and cumbersome.  Better to
 *  spend the space in every tree node.  If you don't want these extra
 *  fields, it's easy to cut them out in your own BaseTree subclass.
 */
export class CommonTree extends BaseTree {
    /** A single token is the payload */
    public token: Token | null = null;

    /** Who is the parent node of this node; if null, implies node is root */
    public parent: CommonTree;

    /** What index is this node in the child list? Range: 0..n-1 */
    public childIndex = -1;

    /**
     * What token indexes bracket all tokens associated with this node
     *  and below?
     */
    protected startIndex = -1;

    /**
     * What token indexes bracket all tokens associated with this node
     *  and below?
     */
    protected stopIndex = -1;

    public constructor(nodeOrToken?: CommonTree | Token) {
        super();

        if (nodeOrToken) {
            this.token = nodeOrToken instanceof CommonTree ? nodeOrToken.token : nodeOrToken;
        }
    }

    public getToken(): Token | null {
        return this.token;
    }

    public dupNode(): Tree {
        return new CommonTree(this);
    }

    public override isNil(): boolean {
        return this.token === null;
    }

    public getType(): number {
        if (this.token === null) {
            return Token.INVALID_TYPE;
        }

        return this.token.type;
    }

    public getText(): string | null {
        if (this.token === null) {
            return null;
        }

        return this.token.text ?? null;
    }

    public override getLine(): number {
        if (this.token === null || this.token.line === 0) {
            if (this.getChildCount() > 0) {
                return this.getChild(0)!.getLine();
            }

            return 0;
        }

        return this.token.line;
    }

    public override getCharPositionInLine(): number {
        if (this.token === null || this.token.column === -1) {
            if (this.getChildCount() > 0) {
                return this.getChild(0)!.getCharPositionInLine();
            }

            return 0;
        }

        return this.token.column;
    }

    public getTokenStartIndex(): number {
        if (this.startIndex === -1 && this.token !== null) {
            return this.token.tokenIndex;
        }

        return this.startIndex;
    }

    public setTokenStartIndex(index: number): void {
        this.startIndex = index;
    }

    public getTokenStopIndex(): number {
        if (this.stopIndex === -1 && this.token !== null) {
            return this.token.tokenIndex;
        }

        return this.stopIndex;
    }

    public setTokenStopIndex(index: number): void {
        this.stopIndex = index;
    }

    /**
     * For every node in this subtree, make sure it's start/stop token's
     *  are set.  Walk depth first, visit bottom up.  Only updates nodes
     *  with at least one token index &lt; 0.
     */
    public setUnknownTokenBoundaries(): void {
        if (this.children.length === 0) {
            if (this.startIndex < 0 || this.stopIndex < 0) {
                this.startIndex = this.stopIndex = this.token?.tokenIndex ?? 0;
            }

            return;
        }

        for (const child of this.children) {
            (child as CommonTree).setUnknownTokenBoundaries();
        }

        if (this.startIndex >= 0 && this.stopIndex >= 0) {
            return;
        }

        // already set
        const firstChild = this.children[0] as CommonTree;
        const lastChild = this.children[this.children.length - 1] as CommonTree;
        this.startIndex = firstChild.getTokenStartIndex();
        this.stopIndex = lastChild.getTokenStopIndex();
    }

    public override getChildIndex(): number {
        return this.childIndex;
    }

    public override getParent(): Tree {
        return this.parent;
    }

    public override setParent(t: Tree): void {
        this.parent = t as CommonTree;
    }

    public override setChildIndex(index: number): void {
        this.childIndex = index;
    }

    public toString(): string | null {
        if (this.isNil()) {
            return "nil";
        }

        if (this.getType() === Token.INVALID_TYPE) {
            return "<errornode>";
        }

        if (this.token === null) {
            return null;
        }

        return this.token.text ?? null;
    }
}
