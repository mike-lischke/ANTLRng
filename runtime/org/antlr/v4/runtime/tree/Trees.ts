/* java2ts: keep */

/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { java, S, JavaObject } from "jree";

import { ParseTree } from "./ParseTree";
import { isTerminalNode } from "./TerminalNode";
import { TerminalNodeImpl } from "./TerminalNodeImpl";
import { Tree } from "./Tree";
import { CommonToken } from "../CommonToken";
import { Parser } from "../Parser";
import { ParserRuleContext } from "../ParserRuleContext";
import { RuleContext } from "../RuleContext";
import { isToken, Token } from "../Token";
import { ATN } from "../atn/ATN";
import { Predicate } from "../misc/Predicate";
import { Utils } from "../misc/Utils";
import { isErrorNode } from "./ErrorNode";

/** A set of utility routines useful for all kinds of ANTLR trees. */
export class Trees extends JavaObject {
    private constructor() {
        super();
    }

    /**
     * Print out a whole tree in LISP form. {@link #getNodeText} is used on the
     *  node payloads to get the text for the nodes.  Detect
     *  parse trees and extract data appropriately.
     */
    public static toStringTree(t: Tree, recog?: Parser): java.lang.String;
    /**
     * Print out a whole tree in LISP form. {@link #getNodeText} is used on the
     *  node payloads to get the text for the nodes.
     */
    public static toStringTree(t: Tree, ruleNames: java.util.List<java.lang.String> | null): java.lang.String;
    /**
     * Print out a whole tree in LISP form. {@link #getNodeText} is used on the
     *  node payloads to get the text for the nodes.  Detect
     *  parse trees and extract data appropriately.
     *
     * @param t tbd
     * @param recogOrRuleNames tbd
     *
     * @returns tbd
     */
    public static toStringTree(t: Tree,
        recogOrRuleNames?: Parser | java.util.List<java.lang.String> | null): java.lang.String {
        let ruleNameList: java.util.List<java.lang.String> | null;

        if (recogOrRuleNames instanceof Parser) {
            const ruleNames = recogOrRuleNames !== null ? recogOrRuleNames.getRuleNames() : null;
            ruleNameList = ruleNames !== null ? java.util.Arrays.asList(ruleNames) : null;
        } else {
            ruleNameList = recogOrRuleNames ?? null;
        }

        let s = Utils.escapeWhitespace(Trees.getNodeText(t, ruleNameList), false);
        if (t.getChildCount() === 0) {
            return s;
        }

        const buf = new java.lang.StringBuilder();
        buf.append(S`(`);
        s = Utils.escapeWhitespace(Trees.getNodeText(t, ruleNameList), false);
        buf.append(s);
        buf.append(" ");
        for (let i = 0; i < t.getChildCount(); i++) {
            if (i > 0) {
                buf.append(" ");
            }

            buf.append(Trees.toStringTree(t.getChild(i)!, ruleNameList));
        }
        buf.append(S`)`);

        return buf.toString();
    }

    public static getNodeText(t: Tree,
        recogOrRuleNames: Parser | java.util.List<java.lang.String> | null): java.lang.String {
        let ruleNameList: java.util.List<java.lang.String> | null;

        if (recogOrRuleNames instanceof Parser) {
            const ruleNames = recogOrRuleNames !== null ? recogOrRuleNames.getRuleNames() : null;
            ruleNameList = ruleNames !== null ? java.util.Arrays.asList(ruleNames) : null;
        } else {
            ruleNameList = recogOrRuleNames ?? null;
        }

        if (ruleNameList !== null) {
            if (t instanceof RuleContext) {
                const ruleIndex = t.getRuleContext()!.getRuleIndex();
                const ruleName = ruleNameList.get(ruleIndex);
                const altNumber = (t).getAltNumber();
                if (altNumber !== ATN.INVALID_ALT_NUMBER) {
                    return S`${ruleName}:${altNumber}`;
                }

                return ruleName;
            } else {
                if (isErrorNode(t)) {
                    return t.toString();
                } else {
                    if (isTerminalNode(t)) {
                        const symbol = (t).getSymbol();
                        if (symbol !== null) {
                            return symbol.getText()!;
                        }
                    }
                }
            }
        }

        // no recog for rule names
        const payload = t.getPayload();
        if (isToken(payload)) {
            return payload.getText()!;
        }

        return S`${payload}`;
    }

    /**
     * @returns an ordered list of all children of this node
     *
     * @param t tbd
     */
    public static getChildren = (t: Tree): java.util.List<Tree> => {
        const kids = new java.util.ArrayList<Tree>();
        for (let i = 0; i < t.getChildCount(); i++) {
            kids.add(t.getChild(i)!);
        }

        return kids;
    };

    /**
     * @returns a list of all ancestors of this node.  The first node of
     *  list is the root and the last is the parent of this node.
     *
     * @param t tbd
     */
    public static getAncestors = (t: Tree): java.util.List<Tree> => {
        if (t.getParent() === null) {
            return java.util.Collections.emptyList();
        }

        const ancestors = new java.util.ArrayList<Tree>();
        let run = t.getParent();
        while (run !== null) {
            ancestors.add(0, t); // insert at start
            run = run.getParent();
        }

        return ancestors;
    };

    /**
     * @returns true if t is u's parent or a node on path to root from u.
     *  Use == not equals().
     *
     * @param t tbd
     * @param u tbd
     */
    public static isAncestorOf = (t: Tree | null, u: Tree | null): boolean => {
        if (t === null || u === null || t.getParent() === null) {
            return false;
        }

        let p = u.getParent();
        while (p !== null) {
            if (t === p) {
                return true;
            }

            p = p.getParent();
        }

        return false;
    };

    public static findAllTokenNodes = (t: ParseTree, ttype: number): java.util.Collection<ParseTree> => {
        return Trees.findAllNodes(t, ttype, true);
    };

    public static findAllRuleNodes = (t: ParseTree, ruleIndex: number): java.util.Collection<ParseTree> => {
        return Trees.findAllNodes(t, ruleIndex, false);
    };

    public static findAllNodes = (t: ParseTree, index: number, findTokens: boolean): java.util.List<ParseTree> => {
        const nodes = new java.util.ArrayList<ParseTree>();
        Trees.doFindAllNodes(t, index, findTokens, nodes);

        return nodes;
    };

    /**
     * Get all descendants; includes t itself.
     *
     * @param t tbd
     *
     * @returns tbd
     */
    public static getDescendants = (t: ParseTree): java.util.List<ParseTree> => {
        const nodes: java.util.List<ParseTree> = new java.util.ArrayList<ParseTree>();
        nodes.add(t);

        const n: number = t.getChildCount();
        for (let i = 0; i < n; i++) {
            nodes.addAll(Trees.getDescendants(t.getChild(i)!));
        }

        return nodes;
    };

    /**
     * Find smallest subtree of t enclosing range startTokenIndex..stopTokenIndex
     *  inclusively using postorder traversal.  Recursive depth-first-search.
     *
     * @param t tbd
     * @param startTokenIndex tbd
     * @param stopTokenIndex tbd
     *
     * @returns tbd
     */
    public static getRootOfSubtreeEnclosingRegion = (t: ParseTree, startTokenIndex: number, // inclusive
        stopTokenIndex: number): ParserRuleContext | null => {
        const n = t.getChildCount();
        for (let i = 0; i < n; i++) {
            const child = t.getChild(i)!;
            const r = Trees.getRootOfSubtreeEnclosingRegion(child, startTokenIndex, stopTokenIndex);
            if (r !== null) {
                return r;
            }

        }
        if (t instanceof ParserRuleContext) {
            if (startTokenIndex >= t.getStart()!.getTokenIndex() && // is range fully contained in t?
                (t.getStop() === null || stopTokenIndex <= t.getStop()!.getTokenIndex())) {
                // note: r.getStop()==null likely implies that we bailed out of parser and there's nothing to the right
                return t;
            }
        }

        return null;
    };

    /**
     * Replace any subtree siblings of root that are completely to left
     *  or right of lookahead range with a CommonToken(Token.INVALID_TYPE,"...")
     *  node. The source interval for t is not altered to suit smaller range!
     *
     *  WARNING: destructive to t.
     *
     * @param t tbd
     * @param root tbd
     * @param startIndex tbd
     * @param stopIndex tbd
     */
    public static stripChildrenOutOfRange = (t: ParserRuleContext | null,
        root: ParserRuleContext | null,
        startIndex: number,
        stopIndex: number): void => {
        if (t === null) {
            return;
        }

        for (let i = 0; i < t.getChildCount(); i++) {
            const child = t.getChild(i)!;
            const range = child.getSourceInterval();
            if (child instanceof ParserRuleContext && (range.b < startIndex || range.a > stopIndex)) {
                if (Trees.isAncestorOf(child, root)) { // replace only if subtree doesn't have displayed root
                    const abbrev: CommonToken = new CommonToken(Token.INVALID_TYPE, S`...`);
                    t.children!.set(i, new TerminalNodeImpl(abbrev));
                }
            }
        }
    };

    /**
     * Return first node satisfying the pred
     *
     * @param t tbd
     * @param pred tbd
     *
     * @returns tbd
     */
    public static findNodeSuchThat = (t: Tree, pred: Predicate<Tree>): Tree | null => {
        if (pred.test(t)) {
            return t;
        }

        if (t === null) {
            return null;
        }

        const n: number = t.getChildCount();
        for (let i = 0; i < n; i++) {
            const u = Trees.findNodeSuchThat(t.getChild(i)!, pred);
            if (u !== null) {
                return u;
            }

        }

        return null;
    };

    private static doFindAllNodes = (t: ParseTree, index: number, findTokens: boolean,
        nodes: java.util.List<ParseTree>): void => {
        // check this node (the root) first
        if (findTokens && isTerminalNode(t)) {
            if (t.getSymbol().getType() === index) {
                nodes.add(t);
            }
        } else {
            if (!findTokens && t instanceof ParserRuleContext) {
                const ctx: ParserRuleContext = t;
                if (ctx.getRuleIndex() === index) {
                    nodes.add(t);
                }
            }
        }

        // check children
        for (let i = 0; i < t.getChildCount(); i++) {
            Trees.doFindAllNodes(t.getChild(i)!, index, findTokens, nodes);
        }
    };
}
