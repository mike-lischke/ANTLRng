/* java2ts: keep */

/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/*
 eslint-disable @typescript-eslint/no-empty-function,
 @typescript-eslint/restrict-plus-operands, @typescript-eslint/unified-signatures, @typescript-eslint/member-ordering,
 no-underscore-dangle, max-len
*/

/* cspell: ignore recog */

import { java } from "../../../../../../../lib/java/java";
import { ErrorNode } from "./ErrorNode";
import { ParseTree } from "./ParseTree";
import { TerminalNode } from "./TerminalNode";
import { TerminalNodeImpl } from "./TerminalNodeImpl";
import { Tree } from "./Tree";
import { CommonToken } from "../CommonToken";
import { Parser } from "../Parser";
import { ParserRuleContext } from "../ParserRuleContext";
import { RuleContext } from "../RuleContext";
import { Token } from "../Token";
import { ATN } from "../atn/ATN";
import { Interval } from "../misc/Interval";
import { Predicate } from "../misc/Predicate";
import { Utils } from "../misc/Utils";

/** A set of utility routines useful for all kinds of ANTLR trees. */
export class Trees {
    /**
     * Print out a whole tree in LISP form. {@link #getNodeText} is used on the
     *  node payloads to get the text for the nodes.  Detect
     *  parse trees and extract data appropriately.
     */
    public static toStringTree(t: Tree): string;
    public static toStringTree(t: Tree, recog: Parser): string;
    public static toStringTree(t: Tree, ruleNames: java.util.List<string>): string;
    public static toStringTree(t: Tree, recogOrRuleNames?: Parser | java.util.List<string>): string {
        if (recogOrRuleNames instanceof Parser) {
            const recog = recogOrRuleNames;
            const ruleNames = recog.getRuleNames();
            const ruleNamesList = java.util.Arrays.asList(...ruleNames);

            return Trees.toStringTree(t, ruleNamesList);
        } else {
            const ruleNames = recogOrRuleNames;
            let s: string = Utils.escapeWhitespace(Trees.getNodeText(t, ruleNames), false);
            if (t.getChildCount() === 0) {
                return s;
            }

            const buf: java.lang.StringBuilder = new java.lang.StringBuilder();
            buf.append("(");
            s = Utils.escapeWhitespace(Trees.getNodeText(t, ruleNames), false);
            buf.append(s);
            buf.append(" ");
            for (let i = 0; i < t.getChildCount(); i++) {
                if (i > 0) {
                    buf.append(" ");
                }

                buf.append(Trees.toStringTree(t.getChild(i), ruleNames));
            }
            buf.append(")");

            return buf.toString();
        }
    }

    public static getNodeText(t: Tree, recog: Parser): string;
    public static getNodeText(t: Tree, ruleNames: java.util.List<string>): string;
    public static getNodeText(t: Tree, recogOrRuleNames: Parser | java.util.List<string>): string {
        if (recogOrRuleNames instanceof Parser) {
            const recog = recogOrRuleNames;
            const ruleNamesList = java.util.Arrays.asList(...recog.getRuleNames());

            return Trees.getNodeText(t, ruleNamesList);
        } else {
            const ruleNames = recogOrRuleNames;
            if (ruleNames !== undefined) {
                if (t instanceof RuleContext) {
                    const ruleIndex: number = (t).getRuleContext().getRuleIndex();
                    const ruleName: string = ruleNames.get(ruleIndex);
                    const altNumber: number = (t).getAltNumber();
                    if (altNumber !== ATN.INVALID_ALT_NUMBER) {
                        return ruleName + ":" + altNumber;
                    }

                    return ruleName;
                } else {
                    if (t instanceof ErrorNode) {
                        return t.toString();
                    } else {
                        if (t instanceof TerminalNode) {
                            const symbol: Token = (t).getSymbol();
                            if (symbol !== undefined) {
                                const s: string = symbol.getText();

                                return s;
                            }
                        }
                    }

                }

            }
            // no recog for rule names
            const payload: object = t.getPayload();
            if (payload instanceof Token) {
                return (payload).getText();
            }

            return t.getPayload().toString();
        }

    }

    /**
     * Return ordered list of all children of this node
     *
     * @param t The tree for which to return the child list.
     *
     * @returns The constructed list.
     */
    public static getChildren = (t: Tree): java.util.List<Tree> => {
        const kids: java.util.List<Tree> = new java.util.ArrayList<Tree>();
        for (let i = 0; i < t.getChildCount(); i++) {
            kids.add(t.getChild(i));
        }

        return kids;
    };

    /**
     * Return a list of all ancestors of this node.  The first node of
     *  list is the root and the last is the parent of this node.
     *
     * since 4.5.1
     *
     * @param t The tree for which to return the ancestors list.
     *
     * @returns The constructed list.
     */
    public static getAncestors = (t: Tree): java.util.List<Tree> => {
        if (t.getParent() === undefined) {
            return java.util.Collections.emptyList();
        }

        const ancestors: java.util.List<Tree> = new java.util.ArrayList<Tree>();
        t = t.getParent();
        while (t !== undefined) {
            ancestors.add(0, t); // insert at start
            t = t.getParent();
        }

        return ancestors;
    };

    /**
     * Return true if t is u's parent or a node on path to root from u.
     * Use === not equals().
     *
     * since 4.5.1
     *
     * @param t The potential ancestor.
     * @param u The node for which to check the ancestor.
     *
     * @returns True if t is a parent of u.
     */
    public static isAncestorOf = (t: Tree, u: Tree): boolean => {
        if (t === undefined || u === undefined || t.getParent() === undefined) {
            return false;
        }

        let p: Tree = u.getParent();
        while (p !== undefined) {
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
        const nodes: java.util.List<ParseTree> = new java.util.ArrayList<ParseTree>();
        Trees._findAllNodes(t, index, findTokens, nodes);

        return nodes;
    };

    public static _findAllNodes = (t: ParseTree, index: number, findTokens: boolean,
        nodes: java.util.List<ParseTree>): void => {
        // check this node (the root) first
        if (findTokens && t instanceof TerminalNode) {
            const tnode: TerminalNode = t;
            if (tnode.getSymbol().getType() === index) {
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
            Trees._findAllNodes(t.getChild(i) as ParseTree, index, findTokens, nodes);
        }
    };

    /**
     * Get all descendents; includes t itself.
     *
     * since 4.5.1
     *
     * @param t The tree to examine.
     *
     * @returns The constructed list.
     */
    public static getDescendants = (t: ParseTree): java.util.List<ParseTree> => {
        const nodes: java.util.List<ParseTree> = new java.util.ArrayList<ParseTree>();
        nodes.add(t);

        const n: number = t.getChildCount();
        for (let i = 0; i < n; i++) {
            nodes.addAll(Trees.getDescendants(t.getChild(i) as ParseTree));
        }

        return nodes;
    };

    /**
     * Find smallest subtree of t enclosing range startTokenIndex..stopTokenIndex
     * inclusively using postorder traversal. Recursive depth-first-search.
     *
     * since 4.5.1
     *
     * @param t The root for the search.
     * @param startTokenIndex The start index.
     * @param stopTokenIndex The end index.
     *
     * @returns The subtree.
     */
    public static getRootOfSubtreeEnclosingRegion = (t: ParseTree, startTokenIndex: number,
        stopTokenIndex: number): ParserRuleContext | undefined => {
        const n = t.getChildCount();
        for (let i = 0; i < n; i++) {
            const r: ParserRuleContext = Trees.getRootOfSubtreeEnclosingRegion(t.getChild(i) as ParseTree,
                startTokenIndex, stopTokenIndex);
            if (r !== undefined) {
                return r;
            }

        }
        if (t instanceof ParserRuleContext) {
            if (startTokenIndex >= t.getStart().getTokenIndex() && // is range fully contained in t?
                (t.getStop() === undefined || stopTokenIndex <= t.getStop().getTokenIndex())) {
                // note: r.getStop()==null likely implies that we bailed out of parser and there's nothing to the right
                return t;
            }
        }

        return undefined;
    };

    /**
     * Replace any subtree siblings of root that are completely to left
     *  or right of lookahead range with a CommonToken(Token.INVALID_TYPE,"...")
     *  node. The source interval for t is not altered to suit smaller range!
     *
     *  WARNING: destructive to t.
     *
     * since 4.5.1
     *
     * @param t tbd
     * @param root tbd
     * @param startIndex tbd
     * @param stopIndex tbd
     */
    public static stripChildrenOutOfRange = (t: ParserRuleContext, root: ParserRuleContext, startIndex: number,
        stopIndex: number): void => {
        for (let i = 0; i < t.getChildCount(); i++) {
            const child: ParseTree = t.getChild(i);
            const range: Interval = child.getSourceInterval();
            if (child instanceof ParserRuleContext && (range.b < startIndex || range.a > stopIndex)) {
                if (Trees.isAncestorOf(child, root)) { // replace only if subtree doesn't have displayed root
                    const abbrev: CommonToken = new CommonToken(Token.INVALID_TYPE, "...");
                    t.children.set(i, new TerminalNodeImpl(abbrev));
                }
            }
        }
    };

    /**
     * Return first node satisfying the pred
     *
     * since 4.5.1
     *
     * @param t The tree to check.
     * @param pred The condition.
     *
     * @returns The found node.
     */
    public static findNodeSuchThat = (t: Tree, pred: Predicate<Tree>): Tree => {
        if (pred.test(t)) {
            return t;
        }

        const n: number = t.getChildCount();
        for (let i = 0; i < n; i++) {
            const u: Tree = Trees.findNodeSuchThat(t.getChild(i), pred);
            if (u !== undefined) {
                return u;
            }
        }

        return undefined;
    };

    private constructor() {
    }
}
