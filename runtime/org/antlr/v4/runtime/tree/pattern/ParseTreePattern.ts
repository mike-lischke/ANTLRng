/* java2ts: keep */

/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { JavaObject, java } from "jree";
import { ParseTreeMatch } from "./ParseTreeMatch";
import { ParseTreePatternMatcher } from "./ParseTreePatternMatcher";
import { ParseTree } from "../ParseTree";
import { XPath } from "../xpath/XPath";

/**
 * A pattern like {@code <ID> = <expr>;} converted to a {@link ParseTree} by
 * {@link ParseTreePatternMatcher#compile(String, int)}.
 */
export class ParseTreePattern extends JavaObject {
    /**
     * This is the backing field for {@link #getPatternRuleIndex()}.
     */
    private readonly patternRuleIndex: number;

    /**
     * This is the backing field for {@link #getPattern()}.
     */

    private readonly pattern: java.lang.String;

    /**
     * This is the backing field for {@link #getPatternTree()}.
     */

    private readonly patternTree: ParseTree;

    /**
     * This is the backing field for {@link #getMatcher()}.
     */

    private readonly matcher: ParseTreePatternMatcher;

    /**
     * Construct a new instance of the {@link ParseTreePattern} class.
     *
     * @param matcher The {@link ParseTreePatternMatcher} which created this
     * tree pattern.
     * @param pattern The tree pattern in concrete syntax form.
     * @param patternRuleIndex The parser rule which serves as the root of the
     * tree pattern.
     * @param patternTree The tree pattern in {@link ParseTree} form.
     */
    public constructor(matcher: ParseTreePatternMatcher,
        pattern: java.lang.String, patternRuleIndex: number, patternTree: ParseTree) {
        super();
        this.matcher = matcher;
        this.patternRuleIndex = patternRuleIndex;
        this.pattern = pattern;
        this.patternTree = patternTree;
    }

    /**
     * Match a specific parse tree against this tree pattern.
     *
     * @param tree The parse tree to match against this tree pattern.
     * @returns A {@link ParseTreeMatch} object describing the result of the
     * match operation. The {@link ParseTreeMatch#succeeded()} method can be
     * used to determine whether or not the match was successful.
     */

    public match = (tree: ParseTree): ParseTreeMatch => {
        return this.matcher.match(tree, this);
    };

    /**
     * Determine whether or not a parse tree matches this tree pattern.
     *
     * @param tree The parse tree to match against this tree pattern.
     * @returns `true` if {@code tree} is a match for the current tree
     * pattern; otherwise, {@code false}.
     */
    public matches = (tree: ParseTree): boolean => {
        return this.matcher.match(tree, this).succeeded();
    };

    /**
     * Find all nodes using XPath and then try to match those subtrees against
     * this tree pattern.
     *
     * @param tree The {@link ParseTree} to match against this pattern.
     * @param xpath An expression matching the nodes
     *
     * @returns A collection of {@link ParseTreeMatch} objects describing the
     * successful matches. Unsuccessful matches are omitted from the result,
     * regardless of the reason for the failure.
     */

    public findAll = (tree: ParseTree, xpath: java.lang.String): java.util.List<ParseTreeMatch> => {
        const subtrees = XPath.findAll(tree, xpath, this.matcher.getParser());
        const matches = new java.util.ArrayList<ParseTreeMatch>();
        for (const t of subtrees) {
            const match: ParseTreeMatch = match(t);
            if (match.succeeded()) {
                matches.add(match);
            }
        }

        return matches;
    };

    /**
     * Get the {@link ParseTreePatternMatcher} which created this tree pattern.
     *
     * @returns The {@link ParseTreePatternMatcher} which created this tree
     * pattern.
     */

    public getMatcher = (): ParseTreePatternMatcher | null => {
        return this.matcher;
    };

    /**
     * Get the tree pattern in concrete syntax form.
     *
     * @returns The tree pattern in concrete syntax form.
     */

    public getPattern = (): java.lang.String | null => {
        return this.pattern;
    };

    /**
     * Get the parser rule which serves as the outermost rule for the tree
     * pattern.
     *
     * @returns The parser rule which serves as the outermost rule for the tree
     * pattern.
     */
    public getPatternRuleIndex = (): number => {
        return this.patternRuleIndex;
    };

    /**
     * Get the tree pattern as a {@link ParseTree}. The rule and token tags from
     * the pattern are present in the parse tree as terminal nodes with a symbol
     * of type {@link RuleTagToken} or {@link TokenTagToken}.
     *
     * @returns The tree pattern as a {@link ParseTree}.
     */

    public getPatternTree = (): ParseTree | null => {
        return this.patternTree;
    };
}
