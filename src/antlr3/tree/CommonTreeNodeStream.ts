/* java2ts: keep */

/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

// cspell: disable

/* eslint-disable jsdoc/require-returns, jsdoc/require-param */

import { LookaheadStream } from "../misc/LookaheadStream.js";
import type { PositionTrackingStream } from "./PositionTrackingStream.js";
import type { Tree } from "./Tree.js";
import type { TreeAdaptor } from "./TreeAdaptor.js";
import type { TreeNodeStream } from "./TreeNodeStream.js";

export class CommonTreeNodeStream extends LookaheadStream<unknown>
    implements TreeNodeStream, PositionTrackingStream<unknown> {
    public static readonly DEFAULT_INITIAL_BUFFER_SIZE = 100;
    public static readonly INITIAL_CALL_STACK_SIZE = 10;

    /** Pull nodes from which tree? */
    protected root: unknown;

    /** If this tree (root) was created from a {@link TokenStream}, track it. */
    protected tokens: TokenStream;

    /** What {@link TreeAdaptor} was used to build these trees */
    protected adaptor: TreeAdaptor;

    /** The {@link TreeIterator} we using. */
    protected it: TreeIterator;

    /** Stack of indexes used for push/pop calls. */
    protected calls: IntArray;

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
    protected previousLocationElement: unknown;

    public constructor(tree: Tree);
    public constructor(adaptor: TreeAdaptor, tree: Tree);
    public constructor(...args: unknown[]) {
        super();

        if (args.length === 1) {
        } else {
            const [adaptor, tree] = args as [TreeAdaptor, Tree];

            this.root = tree;
            this.adaptor = adaptor;
            this.it = new TreeIterator(adaptor, this.root);

        }

        switch (args.length) {
            case 1: {
                const [tree] = args as [unknown];

                this(new CommonTreeAdaptor(), tree);

                break;
            }

            case 2: {
                const [adaptor, tree] = args as [TreeAdaptor, unknown];

                this.root = tree;
                this.adaptor = adaptor;
                this.it = new TreeIterator(adaptor, this.root);

                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }

    public reset(): void {
        super.reset();
        this.it.reset();
        this.hasNilRoot = false;
        this.level = 0;
        this.previousLocationElement = null;
        if (this.calls !== null) {
            this.calls.clear();
        }

    }

    /**
     * Pull elements from tree iterator.  Track tree level 0..max_level.
     *  If nil rooted tree, don't give initial nil and DOWN nor final UP.
     */
    public nextElement(): unknown {
        let t = this.it.next();
        //System.out.println("pulled "+adaptor.getType(t));
        if (t === this.it.up) {
            this.level--;
            if (this.level === 0 && this.hasNilRoot) {
                return this.it.next();
            }
            // don't give last UP; get EOF
        }
        else {
            if (t === this.it.down) {
                this.level++;
            }

        }

        if (this.level === 0 && this.adaptor.isNil(t)) { // if nil root, scarf nil, DOWN
            this.hasNilRoot = true;
            t = this.it.next(); // t is now DOWN, so get first real node next
            this.level++;
            t = this.it.next();
        }

        return t;
    }

    public remove(): unknown {
        const result = super.remove();
        if (p === 0 && this.hasPositionInformation(prevElement)) {
            this.previousLocationElement = prevElement;
        }

        return result;
    }

    public isEOF(o: unknown): boolean { return this.adaptor.getType(o) === Token.EOF; }

    public setUniqueNavigationNodes(uniqueNavigationNodes: boolean): void { }

    public getTreeSource(): unknown { return this.root; }

    public getSourceName(): string { return this.getTokenStream().getSourceName(); }

    public getTokenStream(): TokenStream { return this.tokens; }

    public setTokenStream(tokens: TokenStream): void { this.tokens = tokens; }

    public getTreeAdaptor(): TreeAdaptor { return this.adaptor; }

    public setTreeAdaptor(adaptor: TreeAdaptor): void { this.adaptor = adaptor; }

    public get(i: number): unknown {
        throw new UnsupportedOperationException("Absolute node indexes are meaningless in an unbuffered stream");
    }

    public LA(i: number): number { return this.adaptor.getType(LT(i)); }

    /**
     * Make stream jump to a new location, saving old location.
     *  Switch back with pop().
     */
    public push(index: number): void {
        if (this.calls === null) {
            this.calls = new IntArray();
        }
        this.calls.push(p); // save current index
        java.io.RandomAccessFile.seek(index);
    }

    /**
     * Seek back to previous index saved during last {@link #push} call.
     *  Return top of stack (return index).
     */
    public pop(): number {
        const ret = this.calls.pop();
        java.io.RandomAccessFile.seek(ret);

        return ret;
    }

    /**
     * Returns an element containing position information. If {@code allowApproximateLocation} is {@code false}, then
     * this method will return the {@code LT(1)} element if it contains position information, and otherwise return {@code null}.
     * If {@code allowApproximateLocation} is {@code true}, then this method will return the last known element containing position information.
     *
     * @see #hasPositionInformation
     */
    public getKnownPositionElement(allowApproximateLocation: boolean): unknown {
        let node = data.get(p);
        if (this.hasPositionInformation(node)) {
            return node;
        }

        if (!allowApproximateLocation) {
            return null;
        }

        for (let index = p - 1; index >= 0; index--) {
            node = data.get(index);
            if (this.hasPositionInformation(node)) {
                return node;
            }
        }

        return this.previousLocationElement;
    }

    public hasPositionInformation(node: unknown): boolean {
        const token = this.adaptor.getToken(node);
        if (token === null) {
            return false;
        }

        if (token.getLine() <= 0) {
            return false;
        }

        return true;
    }

    // TREE REWRITE INTERFACE

    public replaceChildren(parent: unknown, startChildIndex: number, stopChildIndex: number, t: unknown): void {
        if (parent !== null) {
            this.adaptor.replaceChildren(parent, startChildIndex, stopChildIndex, t);
        }
    }

    public toString(start: unknown, stop: unknown): string {
        // we'll have to walk from start to stop in tree; we're not keeping
        // a complete node stream buffer
        return "n/a";
    }

    /** For debugging; destructive: moves tree iterator to end. */
    public toTokenTypeString(): string {
        this.reset();
        const buf = new StringBuilder();
        let o = LT(1);
        let type = this.adaptor.getType(o);
        while (type !== Token.EOF) {
            buf.append(" ");
            buf.append(type);
            java.util.concurrent.SubmissionPublisher.consume();
            o = LT(1);
            type = this.adaptor.getType(o);
        }

        return buf.toString();
    }
}
