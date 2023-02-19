/* java2ts: keep */

/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { java, JavaObject, S } from "jree";
import { XPathElement } from "./XPathElement";
import { XPathLexer } from "./XPathLexer";
import { XPathLexerErrorListener } from "./XPathLexerErrorListener";
import { XPathRuleAnywhereElement } from "./XPathRuleAnywhereElement";
import { XPathRuleElement } from "./XPathRuleElement";
import { XPathTokenAnywhereElement } from "./XPathTokenAnywhereElement";
import { XPathTokenElement } from "./XPathTokenElement";
import { XPathWildcardAnywhereElement } from "./XPathWildcardAnywhereElement";
import { XPathWildcardElement } from "./XPathWildcardElement";
import { ANTLRInputStream } from "../../ANTLRInputStream";
import { CommonTokenStream } from "../../CommonTokenStream";
import { LexerNoViableAltException } from "../../LexerNoViableAltException";
import { Parser } from "../../Parser";
import { ParserRuleContext } from "../../ParserRuleContext";
import { Token } from "../../Token";
import { ParseTree } from "../ParseTree";

/**
 * Represent a subset of XPath XML path syntax for use in identifying nodes in
 * parse trees.
 *
 * <p>
 * Split path into words and separators {@code /} and {@code //} via ANTLR
 * itself then walk path elements from left to right. At each separator-word
 * pair, find set of nodes. Next stage uses those as work list.</p>
 *
 * <p>
 * The basic interface is
 * {@link XPath#findAll ParseTree.findAll}{@code (tree, pathString, parser)}.
 * But that is just shorthand for:</p>
 *
 * <pre>
 * {@link XPath} p = new {@link XPath#XPath XPath}(parser, pathString);
 * return p.{@link #evaluate evaluate}(tree);
 * </pre>
 *
 * <p>
 * See {@code org.antlr.v4.test.TestXPath} for descriptions. In short, this
 * allows operators:</p>
 *
 * <dl>
 * <dt>/</dt> <dd>root</dd>
 * <dt>//</dt> <dd>anywhere</dd>
 * <dt>!</dt> <dd>invert; this must appear directly after root or anywhere
 * operator</dd>
 * </dl>
 *
 * <p>
 * and path elements:</p>
 *
 * <dl>
 * <dt>ID</dt> <dd>token name</dd>
 * <dt>'string'</dt> <dd>any string literal token from the grammar</dd>
 * <dt>expr</dt> <dd>rule name</dd>
 * <dt>*</dt> <dd>wildcard matching any node</dd>
 * </dl>
 *
 * <p>
 * Whitespace is not allowed.</p>
 */
export class XPath extends JavaObject {
    public static readonly WILDCARD: java.lang.String = S`*`; // word not operator/separator
    public static readonly NOT: java.lang.String = S`!`; 	   // word for invert operator

    protected path: java.lang.String | null;
    protected elements: XPathElement[];
    protected parser: Parser;

    public constructor(parser: Parser, path: java.lang.String) {
        super();
        this.parser = parser;
        this.path = path;
        this.elements = this.split(path);
    }

    public static findAll = (tree: ParseTree, xpath: java.lang.String,
        parser: Parser): java.util.Collection<ParseTree> => {
        const p: XPath = new XPath(parser, xpath);

        return p.evaluate(tree);
    };

    // TODO: check for invalid token/rule names, bad syntax

    public split = (path: java.lang.String): XPathElement[] => {
        let input: ANTLRInputStream;
        try {
            input = new ANTLRInputStream(new java.io.StringReader(path));
        } catch (ioe) {
            if (ioe instanceof java.io.IOException) {
                throw new java.lang.IllegalArgumentException(S`Could not read path: ${path}`, ioe);
            } else {
                throw ioe;
            }
        }
        const lexer: XPathLexer = new class extends XPathLexer {
            public recover = (e: LexerNoViableAltException): void => {
                throw e;
            };
        }(input);

        lexer.removeErrorListeners();
        lexer.addErrorListener(new XPathLexerErrorListener());
        const tokenStream: CommonTokenStream = new CommonTokenStream(lexer);
        try {
            tokenStream.fill();
        } catch (e) {
            if (e instanceof LexerNoViableAltException) {
                const pos: number = lexer.getCharPositionInLine();
                const msg = S`Invalid tokens or characters at index ${pos} in path '${path}'`;
                throw new java.lang.IllegalArgumentException(msg, e);
            } else {
                throw e;
            }
        }

        const tokens = tokenStream.getTokens()!;
        const elements: java.util.List<XPathElement> = new java.util.ArrayList<XPathElement>();
        const n = tokens.size();
        let i = 0;

        loop:
        while (i < n) {
            const el: Token = tokens.get(i);
            let next: Token | null = null;
            switch (el.getType()) {
                case XPathLexer.ROOT:
                case XPathLexer.ANYWHERE: {
                    const anywhere: boolean = el.getType() === XPathLexer.ANYWHERE;
                    i++;
                    next = tokens.get(i);
                    const invert: boolean = next.getType() === XPathLexer.BANG;
                    if (invert) {
                        i++;
                        next = tokens.get(i);
                    }
                    const pathElement = this.getXPathElement(next, anywhere);
                    pathElement.invert = invert;
                    elements.add(pathElement);
                    i++;
                    break;
                }

                case XPathLexer.TOKEN_REF:
                case XPathLexer.RULE_REF:
                case XPathLexer.WILDCARD: {
                    elements.add(this.getXPathElement(el, false));
                    i++;
                    break;
                }

                case Token.EOF: {
                    break loop;
                }

                default: {
                    throw new java.lang.IllegalArgumentException(S`Unknown path element ${el}`);
                }
            }
        }

        return elements.toArray(new Array<XPathElement>(0));
    };

    /**
     * Return a list of all nodes starting at {@code t} as root that satisfy the
     * path. The root {@code /} is relative to the node passed to
     * {@link #evaluate}.
     *
     * @param t The root node.
     *
     * @returns A collection of all nodes starting at {@code t} as root that
     */
    public evaluate = (t: ParseTree): java.util.Collection<ParseTree> => {
        const dummyRoot = new ParserRuleContext();
        dummyRoot.children = java.util.Collections.singletonList(t); // don't set t's parent.

        let work = java.util.Collections.singleton<ParseTree>(dummyRoot);

        let i = 0;
        while (i < this.elements.length) {
            const next = new java.util.LinkedHashSet<ParseTree>();
            for (const node of work) {
                if (node.getChildCount() > 0) {
                    // only try to match next element if it has children
                    // e.g., //func/*/stat might have a token node for which
                    // we can't go looking for stat nodes.
                    const matching = this.elements[i].evaluate(node);
                    next.addAll(matching);
                }
            }
            i++;
            work = next;
        }

        return work;
    };

    /**
     * Convert word like {@code *} or {@code ID} or {@code expr} to a path
     * element. {@code anywhere} is `true` if {@code //} precedes the
     * word.
     *
     * @param wordToken The token representing an XPath word.
     * @param anywhere `true` if {@code //} precedes the word.
     *
     * @returns The path element corresponding to the specified word.
     */
    protected getXPathElement = (wordToken: Token, anywhere: boolean): XPathElement => {
        if (wordToken.getType() === Token.EOF) {
            throw new java.lang.IllegalArgumentException(S`Missing path element at end of path`);
        }

        const word = wordToken.getText()!;
        const ttype: number = this.parser.getTokenType(word);
        const ruleIndex: number = this.parser.getRuleIndex(word);
        switch (wordToken.getType()) {
            case XPathLexer.WILDCARD: {
                return anywhere ?
                    new XPathWildcardAnywhereElement() :
                    new XPathWildcardElement();
            }

            case XPathLexer.TOKEN_REF:
            case XPathLexer.STRING: {
                if (ttype === Token.INVALID_TYPE) {
                    throw new java.lang.IllegalArgumentException(
                        S`${word} at index ${wordToken.getStartIndex()} isn't a valid token name`);
                }

                return anywhere ?
                    new XPathTokenAnywhereElement(word, ttype) :
                    new XPathTokenElement(word, ttype);
            }

            default: {
                if (ruleIndex === -1) {
                    throw new java.lang.IllegalArgumentException(
                        S`${word} at index ${wordToken.getStartIndex()} isn't a valid rule name`);
                }

                return anywhere ?
                    new XPathRuleAnywhereElement(word, ruleIndex) :
                    new XPathRuleElement(word, ruleIndex);
            }
        }
    };
}
