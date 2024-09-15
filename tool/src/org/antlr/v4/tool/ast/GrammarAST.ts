/* java2ts: keep */

/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { ATNState, CommonToken, IntervalSet, Token, type BitSet } from "antlr4ng";

import { CommonTree } from "../../../../../../../src/antlr3/tree/CommonTree.js";
import type { Tree } from "../../../../../../../src/antlr3/tree/Tree.js";
import { ANTLRv4Parser } from "../../../../../../../src/generated/ANTLRv4Parser.js";

import { CommonTreeNodeStream } from "../../../../../../../src/antlr3/tree/CommonTreeNodeStream.js";
import { GrammarASTAdaptor } from "../../parse/GrammarASTAdaptor.js";
import { Grammar } from "../Grammar.js";
import { AltAST } from "./AltAST.js";
import { GrammarASTVisitor } from "./GrammarASTVisitor.js";
import { RuleAST } from "./RuleAST.js";

export class GrammarAST extends CommonTree {
    /** For error msgs, nice to know which grammar this AST lives in */
    // TODO: try to remove
    public g: Grammar;

    /** If we build an ATN, we make AST node point at left edge of ATN construct */
    public atnState?: ATNState;

    public textOverride: string;

    public constructor(nodeOrToken?: GrammarAST | Token);
    public constructor(type: number, t?: Token, text?: string);
    public constructor(...args: unknown[]) {
        let nodeOrToken: GrammarAST | Token | undefined;

        if (args.length > 0) {
            if (typeof args[0] === "number") {
                const [type, t, text] = args as [number, Token | undefined, string | undefined];
                if (t === undefined) {
                    nodeOrToken = CommonToken.fromType(type, ANTLRv4Parser.symbolicNames[type] ?? undefined);
                } else {
                    nodeOrToken = CommonToken.fromToken(t);
                    t.type = type;

                    if (text !== undefined) {
                        t.text = text;
                    }
                }
            } else {
                nodeOrToken = args[0] as GrammarAST | Token;
            }
        }

        super(nodeOrToken);

        if (nodeOrToken instanceof GrammarAST) {
            this.g = nodeOrToken.g;
            this.atnState = nodeOrToken.atnState;
            this.textOverride = nodeOrToken.textOverride;
        }
    }

    public getChildrenAsArray(): GrammarAST[] {
        return this.children as GrammarAST[];
    }

    public getNodesWithType(typeOrTypes: number | IntervalSet | null): GrammarAST[] {
        if (typeof typeOrTypes === "number") {
            return this.getNodesWithType(IntervalSet.of(typeOrTypes, typeOrTypes));
        }

        const nodes: GrammarAST[] = [];
        const work: GrammarAST[] = [];
        work.push(this);

        while (work.length > 0) {
            const t = work.shift()!;
            if (typeOrTypes === null || typeOrTypes.contains(t.getType())) {
                nodes.push(t);
            }

            if (t.children.length > 0) {
                work.push(...t.getChildrenAsArray());
            }
        }

        return nodes;
    }

    public getAllChildrenWithType(type: number): GrammarAST[] {
        return this.children.filter((t) => {
            return t.getType() === type;
        }) as GrammarAST[];
    }

    public getNodesWithTypePreorderDFS(types: IntervalSet): GrammarAST[] {
        const nodes = new Array<GrammarAST>();
        this.doGetNodesWithTypePreorderDFS(nodes, types);

        return nodes;
    }

    public getNodeWithTokenIndex(index: number): GrammarAST | null {
        if (this.token && this.token.tokenIndex === index) {
            return this;
        }

        for (const child of this.children) {
            const result = (child as GrammarAST).getNodeWithTokenIndex(index);
            if (result !== null) {
                return result;
            }
        }

        return null;
    }

    public getOutermostAltNode(): AltAST | null {
        if (this instanceof AltAST && this.parent?.parent instanceof RuleAST) {
            return this as AltAST;
        }

        if (this.parent) {
            return (this.parent as GrammarAST).getOutermostAltNode();
        }

        return null;
    }

    /**
     * Walk ancestors of this node until we find ALT with
     *  alt!=null or leftRecursiveAltInfo!=null. Then grab label if any.
     *  If not a rule element, just returns null.
     */
    public getAltLabel(): string | null {
        const ancestors = this.getAncestors();
        if (ancestors === null) {
            return null;
        }

        for (let i = ancestors.length - 1; i >= 0; i--) {
            const p = ancestors[i] as GrammarAST;
            if (p.getType() === ANTLRv4Parser.OR) {
                const a = p as AltAST;
                if (a.altLabel) {
                    return a.altLabel.getText();
                }

                if (a.leftRecursiveAltInfo) {
                    return a.leftRecursiveAltInfo.altLabel ?? null;
                }
            }
        }

        return null;
    }

    public override deleteChild(i: number): Tree | null;
    public override deleteChild(t: Tree): boolean;
    public override deleteChild(param: number | Tree): Tree | null | boolean {
        if (typeof param === "number") {
            return super.deleteChild(param);
        }

        for (const c of this.children) {
            if (c === param) {
                super.deleteChild(param.getChildIndex());

                return true;
            }
        }

        return false;
    }

    // TODO: move to base tree when i settle on how runtime works
    // TODO: don't include this node!!
    // TODO: reuse other method
    // TODO: don't include this node!!
    public getFirstDescendantWithType(typeOrTypes: number | BitSet): CommonTree | null {
        if (typeof typeOrTypes === "number") {
            if (this.token?.type === typeOrTypes) {
                return this;
            }

            for (const c of this.children) {
                const t = c as GrammarAST;
                if (t.token?.type === typeOrTypes) {
                    return t;
                }

                const d = t.getFirstDescendantWithType(typeOrTypes);
                if (d !== null) {
                    return d;
                }

            }

            return null;
        }

        if (this.token && typeOrTypes.get(this.token.type)) {
            return this;
        }

        for (const c of this.children) {
            const t = c as GrammarAST;
            if (t.token && typeOrTypes.get(t.token.type)) {
                return t;
            }

            const d = t.getFirstDescendantWithType(typeOrTypes);
            if (d !== null) {
                return d;
            }
        }

        return null;
    }

    public setType(type: number): void {
        if (this.token) {
            this.token.type = type;
        }
    }

    public setText(text: string): void {
        if (this.token) {
            this.token.text = text; // we delete surrounding tree, so ok to alter
        }
    }

    public override dupNode(): GrammarAST {
        return new GrammarAST(this);
    }

    public dupTree(): GrammarAST {
        const input = this.token!.inputStream;
        const adaptor = new GrammarASTAdaptor(input ?? undefined);

        return adaptor.dupTree(this) as GrammarAST;
    }

    public toTokenString(): string {
        const input = this.token!.inputStream;
        const adaptor = new GrammarASTAdaptor(input ?? undefined);
        const nodes = new CommonTreeNodeStream(adaptor, this);

        let buf = "";
        let o = nodes.LT(1) as GrammarAST;
        let type = adaptor.getType(o);
        while (type !== Token.EOF) {
            buf += " " + o.getText()!;
            nodes.consume();
            o = nodes.LT(1) as GrammarAST;
            type = adaptor.getType(o);
        }

        return buf;
    }

    public visit<T>(v: GrammarASTVisitor<T>): T {
        return v.visit(this);

    }

    private doGetNodesWithTypePreorderDFS(nodes: GrammarAST[], types: IntervalSet): void {
        if (types.contains(this.getType())) {
            nodes.push(this);
        }

        // walk all children of root.
        this.children.forEach((child: GrammarAST) => {
            child.doGetNodesWithTypePreorderDFS(nodes, types);
        });
    }
}
