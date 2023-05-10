/* java2ts: keep */

/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { java, JavaObject, S } from "jree";
import { ParseTreePattern } from "./ParseTreePattern";
import { MultiMap } from "../../misc/MultiMap";
import { ParseTree } from "../ParseTree";

/**
 * Represents the result of matching a {@link ParseTree} against a tree pattern.
 */
export class ParseTreeMatch extends JavaObject {
    /**
     * This is the backing field for {@link #getTree()}.
     */
    private readonly tree: ParseTree;

    /**
     * This is the backing field for {@link #getPattern()}.
     */
    private readonly pattern: ParseTreePattern;

    /**
     * This is the backing field for {@link #getLabels()}.
     */
    private readonly labels: MultiMap<java.lang.String, ParseTree>;

    /**
     * This is the backing field for {@link #getMismatchedNode()}.
     */
    private readonly mismatchedNode: ParseTree | null;

    /**
     * Constructs a new instance of {@link ParseTreeMatch} from the specified
     * parse tree and pattern.
     *
     * @param tree The parse tree to match against the pattern.
     * @param pattern The parse tree pattern.
     * @param labels A mapping from label names to collections of
     * {@link ParseTree} objects located by the tree pattern matching process.
     * @param mismatchedNode The first node which failed to match the tree
     * pattern during the matching process.
     *
     * @throws IllegalArgumentException if {@code tree} is {@code null}
     * @throws IllegalArgumentException if {@code pattern} is {@code null}
     * @throws IllegalArgumentException if {@code labels} is {@code null}
     */
    public constructor(tree: ParseTree, pattern: ParseTreePattern, labels: MultiMap<java.lang.String, ParseTree>,
        mismatchedNode: ParseTree | null) {
        super();

        this.tree = tree;
        this.pattern = pattern;
        this.labels = labels;
        this.mismatchedNode = mismatchedNode;
    }

    /**
     * Get the last node associated with a specific {@code label}.
     *
     * <p>For example, for pattern {@code <id:ID>}, {@code get("id")} returns the
     * node matched for that {@code ID}. If more than one node
     * matched the specified label, only the last is returned. If there is
     * no node associated with the label, this returns {@code null}.</p>
     *
     * <p>Pattern tags like {@code <ID>} and {@code <expr>} without labels are
     * considered to be labeled with {@code ID} and {@code expr}, respectively.</p>
     *
     * @param label The label to check.
     *
     * @returns The last {@link ParseTree} to match a tag with the specified
     * label, or {@code null} if no parse tree matched a tag with the label.
     */

    public get = (label: java.lang.String): ParseTree | null => {
        const parseTrees = this.labels.get(label);
        if (parseTrees === null || parseTrees.size() === 0) {
            return null;
        }

        return parseTrees.get(parseTrees.size() - 1); // return last if multiple
    };

    /**
     * Return all nodes matching a rule or token tag with the specified label.
     *
     * <p>If the {@code label} is the name of a parser rule or token in the
     * grammar, the resulting list will contain both the parse trees matching
     * rule or tags explicitly labeled with the label and the complete set of
     * parse trees matching the labeled and unlabeled tags in the pattern for
     * the parser rule or token. For example, if {@code label} is {@code "foo"},
     * the result will contain <em>all</em> of the following.</p>
     *
     * <ul>
     * <li>Parse tree nodes matching tags of the form {@code <foo:anyRuleName>} and
     * {@code <foo:AnyTokenName>}.</li>
     * <li>Parse tree nodes matching tags of the form {@code <anyLabel:foo>}.</li>
     * <li>Parse tree nodes matching tags of the form {@code <foo>}.</li>
     * </ul>
     *
     * @param label The label.
     *
     * @returns A collection of all {@link ParseTree} nodes matching tags with
     * the specified {@code label}. If no nodes matched the label, an empty list
     * is returned.
     */

    public getAll = (label: java.lang.String): java.util.List<ParseTree> => {
        const nodes = this.labels.get(label);
        if (nodes === null) {
            return java.util.Collections.emptyList();
        }

        return nodes;
    };

    /**
     * Return a mapping from label -> [list of nodes].
     *
     * <p>The map includes special entries corresponding to the names of rules and
     * tokens referenced in tags in the original pattern. For additional
     * information, see the description of {@link #getAll(String)}.</p>
     *
     * @returns A mapping from labels to parse tree nodes. If the parse tree
     * pattern did not contain any rule or token tags, this map will be empty.
     */

    public getLabels = (): MultiMap<java.lang.String, ParseTree> => {
        return this.labels;
    };

    /**
     * Get the node at which we first detected a mismatch.
     *
     * @returns the node at which we first detected a mismatch, or {@code null}
     * if the match was successful.
     */

    public getMismatchedNode = (): ParseTree | null => {
        return this.mismatchedNode;
    };

    /**
     * Gets a value indicating whether the match operation succeeded.
     *
     * @returns `true` if the match operation succeeded; otherwise,
     * {@code false}.
     */
    public succeeded = (): boolean => {
        return this.mismatchedNode === null;
    };

    /**
     * Get the tree pattern we are matching against.
     *
     * @returns The tree pattern we are matching against.
     */

    public getPattern = (): ParseTreePattern | null => {
        return this.pattern;
    };

    /**
     * Get the parse tree we are trying to match to a pattern.
     *
     * @returns The {@link ParseTree} we are trying to match to a pattern.
     */

    public getTree = (): ParseTree | null => {
        return this.tree;
    };

    public override toString = (): java.lang.String => {
        return java.lang.String.format(
            S`Match %s; found %d labels`,
            this.succeeded() ? S`succeeded` : S`failed`,
            this.getLabels().size());
    };
}
