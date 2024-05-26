/* java2ts: keep */

/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { RecognitionException, type TokenStream } from "antlr4ng";

import { RecognizerSharedState } from "../RecognizerSharedState.js";
import { CommonTreeAdaptor } from "./CommonTreeAdaptor.js";
import { CommonTreeNodeStream } from "./CommonTreeNodeStream.js";
import type { Tree } from "./Tree.js";
import type { TreeAdaptor } from "./TreeAdaptor.js";
import type { TreeNodeStream } from "./TreeNodeStream.js";
import { TreeParser } from "./TreeParser.js";
import { TreeVisitor } from "./TreeVisitor.js";
import type { TreeVisitorAction } from "./TreeVisitorAction.js";
import type { TreeRuleReturnScope } from "./TreeRuleReturnScope.js";

// cspell: disable

/* eslint-disable jsdoc/require-returns, jsdoc/require-param, @typescript-eslint/naming-convention */

interface fptr {
    rule(): unknown;
}

export class TreeRewriter extends TreeParser {

    protected showTransformations = false;

    protected originalTokenStream: TokenStream;
    protected originalAdaptor: TreeAdaptor;

    private topdown_fptr = new class implements fptr {
        public constructor(private $outer: TreeRewriter) { }
        public rule(): unknown { return this.$outer.topdown(); }
    }(this);

    private bottomup_ftpr = new class implements fptr {
        public constructor(private $outer: TreeRewriter) { }
        public rule(): unknown { return this.$outer.bottomup(); }
    }(this);

    public constructor(input: TreeNodeStream, state?: RecognizerSharedState) {
        state ??= new RecognizerSharedState();
        super(input, state);
        this.originalAdaptor = input.getTreeAdaptor();
        this.originalTokenStream = input.getTokenStream();
    }

    public applyOnce(t: Tree | null, whichRule: fptr): Tree | null {
        if (t === null) {
            return null;
        }

        try {
            // share TreeParser object but not parsing-related state
            this.state = new RecognizerSharedState();
            this.input = new CommonTreeNodeStream(this.originalAdaptor, t);
            (this.input as CommonTreeNodeStream).setTokenStream(this.originalTokenStream);
            this.setBacktrackingLevel(1);
            const r = whichRule.rule() as TreeRuleReturnScope;
            this.setBacktrackingLevel(0);
            if (this.failed()) {
                return t;
            }

            if (this.showTransformations &&
                r !== null && t !== r.getTree() && r.getTree() !== null) {
                this.reportTransformation(t, r.getTree());
            }

            if (r !== null && r.getTree() !== null) {
                return r.getTree();
            } else {
                return t;
            }
        } catch (e) {
            if (e instanceof RecognitionException) { ; } else {
                throw e;
            }
        }

        return t;
    }

    public applyRepeatedly(t: Tree | null, whichRule: fptr): Tree | null {
        let treeChanged = true;
        while (treeChanged) {
            const u = this.applyOnce(t, whichRule);
            treeChanged = t !== u;
            t = u;
        }

        return t;
    }

    public downup(t: Tree | null, showTransformations?: boolean): Tree | null {
        showTransformations ??= false;
        this.showTransformations = showTransformations;
        const v = new TreeVisitor(new CommonTreeAdaptor());
        const actions = new class implements TreeVisitorAction<Tree> {
            public constructor(private $outer: TreeRewriter) { }
            public pre(t: Tree): Tree | null { return this.$outer.applyOnce(t, this.$outer.topdown_fptr); }
            public post(t: Tree): Tree | null { return this.$outer.applyRepeatedly(t, this.$outer.bottomup_ftpr); }
        }(this);
        t = v.visit(t, actions);

        return t;
    }

    /**
     * Override this if you need transformation tracing to go somewhere
     *  other than stdout or if you're not using Tree-derived trees.
     */
    public reportTransformation(oldTree: unknown, newTree: unknown): void {
        console.log((oldTree as Tree).toStringTree() + " -> " + (newTree as Tree).toStringTree());
    }

    // methods the downup strategy uses to do the up and down rules.
    // to override, just define tree grammar rule topdown and turn on
    // filter=true.
    public topdown(): Tree | null { return null; }
    public bottomup(): Tree | null { return null; }
}
