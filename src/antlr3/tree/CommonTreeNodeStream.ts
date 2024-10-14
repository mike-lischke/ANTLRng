/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

// cspell: disable

import { Token, type TokenStream } from "antlr4ng";

import { LookaheadStream } from "../misc/LookaheadStream.js";
import { CommonTreeAdaptor } from "./CommonTreeAdaptor.js";
import type { PositionTrackingStream } from "./PositionTrackingStream.js";
import type { Tree } from "./Tree.js";
import type { TreeAdaptor } from "./TreeAdaptor.js";
import { TreeIterator } from "./TreeIterator.js";
import type { TreeNodeStream } from "./TreeNodeStream.js";

export class CommonTreeNodeStream extends LookaheadStream<Tree>
    implements TreeNodeStream, PositionTrackingStream<Tree> {
    public static readonly DEFAULT_INITIAL_BUFFER_SIZE = 100;
    public static readonly INITIAL_CALL_STACK_SIZE = 10;

    /** Pull nodes from which tree? */
    protected root: Tree;

    /** If this tree (root) was created from a {@link TokenStream}, track it. */
    protected tokens: TokenStream;

    /** What {@link TreeAdaptor} was used to build these trees */
    protected adaptor: TreeAdaptor;

    /** The {@link TreeIterator} we using. */
    protected it: TreeIterator;

    /** Stack of indexes used for push/pop calls. */
    protected calls: number[] = [];

    /** Tree {@code (nil A B C)} trees like flat {@code A B C} streams */
    protected hasNilRoot = false;

    /** Tracks tree depth.  Level=0 means we're at root node level. */
    protected level = 0;

    /**
     * Tracks the last node before the start of {@link #data} which contains
     * position information to provide information for error reporting. This is
     * tracked in addition to {@link #prevElement} which may or may not contain
     * position information.
     *
     * @see #hasPositionInformation
     * @see RecognitionException#extractInformationFromTreeNodeStream
     */
    protected previousLocationElement: Tree | null;

    public constructor(tree: Tree);
    public constructor(adaptor: TreeAdaptor, tree: Tree);
    public constructor(...args: unknown[]) {
        super();

        if (args.length === 1) {
            const [tree] = args as [Tree];

            this.adaptor = new CommonTreeAdaptor();
            this.root = tree;
            this.it = new TreeIterator(this.adaptor, this.root);
        } else {
            const [adaptor, tree] = args as [TreeAdaptor, Tree];

            this.root = tree;
            this.adaptor = adaptor;
            this.it = new TreeIterator(adaptor, this.root);
        }
    }

    public override reset(): void {
        super.reset();
        this.it.reset();
        this.hasNilRoot = false;
        this.level = 0;
        this.previousLocationElement = null;
        this.calls = [];
    }

    /**
     * Pull elements from tree iterator.  Track tree level 0..max_level.
     *  If nil rooted tree, don't give initial nil and DOWN nor final UP.
     */
    public nextElement(): Tree {
        let t = this.it.nextTree()!;

        if (t === this.it.up) {
            this.level--;
            if (this.level === 0 && this.hasNilRoot) {
                return this.it.nextTree()!;
            }
            // don't give last UP; get EOF
        } else {
            if (t === this.it.down) {
                this.level++;
            }
        }

        if (this.level === 0 && this.adaptor.isNil(t)) { // if nil root, scarf nil, DOWN
            this.hasNilRoot = true;
            t = this.it.nextTree()!; // t is now DOWN, so get first real node next
            this.level++;
            t = this.it.nextTree()!;
        }

        return t;
    }

    public override remove(): Tree {
        const result = super.remove();
        if (this.p === 0 && this.hasPositionInformation(this.prevElement)) {
            this.previousLocationElement = this.prevElement;
        }

        return result;
    }

    public isEOF(o: Tree): boolean {
        return this.adaptor.getType(o) === Token.EOF;
    }

    public setUniqueNavigationNodes(uniqueNavigationNodes: boolean): void { }

    public getTreeSource(): unknown {
        return this.root;
    }

    public getSourceName(): string {
        return this.getTokenStream().getSourceName();
    }

    public getTokenStream(): TokenStream {
        return this.tokens;
    }

    public setTokenStream(tokens: TokenStream): void {
        this.tokens = tokens;
    }

    public getTreeAdaptor(): TreeAdaptor {
        return this.adaptor;
    }

    public setTreeAdaptor(adaptor: TreeAdaptor): void {
        this.adaptor = adaptor;
    }

    public get(i: number): Tree {
        throw new Error("Absolute node indexes are meaningless in an unbuffered stream");
    }

    // eslint-disable-next-line @typescript-eslint/naming-convention
    public LA(i: number): number {
        return this.adaptor.getType(this.LT(i)!);
    }

    /**
     * Make stream jump to a new location, saving old location.
     *  Switch back with pop().
     */
    public push(index: number): void {
        if (this.calls === null) {
            this.calls = [];
        }
        this.calls.push(this.p); // save current index
        this.seek(index);
    }

    /**
     * Seek back to previous index saved during last {@link #push} call.
     *  Return top of stack (return index).
     */
    public pop(): number {
        const ret = this.calls.pop()!;
        this.seek(ret);

        return ret;
    }

    /**
     * Returns an element containing position information. If {@code allowApproximateLocation} is {@code false}, then
     * this method will return the {@code LT(1)} element if it contains position information, and otherwise return
     * {@code null}. If {@code allowApproximateLocation} is {@code true}, then this method will return the last known
     * element containing position information.
     *
     * @see #hasPositionInformation
     */
    public getKnownPositionElement(allowApproximateLocation: boolean): Tree | null {
        let node = this.data[this.p];
        if (this.hasPositionInformation(node)) {
            return node;
        }

        if (!allowApproximateLocation) {
            return null;
        }

        for (let index = this.p - 1; index >= 0; index--) {
            node = this.data[index];
            if (this.hasPositionInformation(node)) {
                return node;
            }
        }

        return this.previousLocationElement;
    }

    public hasPositionInformation(node: Tree | null): boolean {
        const token = this.adaptor.getToken(node);
        if (token === null) {
            return false;
        }

        if (token.line <= 0) {
            return false;
        }

        return true;
    }

    // TREE REWRITE INTERFACE

    public replaceChildren(parent: Tree, startChildIndex: number, stopChildIndex: number, t: Tree): void {
        if (parent !== null) {
            this.adaptor.replaceChildren(parent, startChildIndex, stopChildIndex, t);
        }
    }

    /*public toString(start: Tree, stop: Tree): string {
        // we'll have to walk from start to stop in tree; we're not keeping
        // a complete node stream buffer
        return "n/a";
    }*/

    /** For debugging; destructive: moves tree iterator to end. */
    public toTokenTypeString(): string {
        this.reset();
        let buf = "";
        let o = this.LT(1)!;
        let type = this.adaptor.getType(o);
        while (type !== Token.EOF) {
            buf += " " + type;
            this.consume();
            o = this.LT(1)!;
            type = this.adaptor.getType(o);
        }

        return buf.toString();
    }
}
