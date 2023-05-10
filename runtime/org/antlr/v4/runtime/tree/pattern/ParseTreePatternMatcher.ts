/* java2ts: keep */

/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { java, JavaObject, S } from "jree";

import { Chunk, ParseTreeMatch, ParseTreePattern, RuleTagToken, TagChunk, TextChunk, TokenTagToken } from "./";
import {
    ANTLRInputStream, BailErrorStrategy, CommonTokenStream, Lexer, ListTokenSource, MultiMap,
    ParseCancellationException, Parser, ParserInterpreter, ParserRuleContext, RecognitionException, Token
} from "../../";
import { isRuleNode, isTerminalNode, ParseTree, TerminalNode } from "../";

/**
 * A tree pattern matching mechanism for ANTLR {@link ParseTree}s.
 *
 * <p>Patterns are strings of source input text with special tags representing
 * token or rule references such as:</p>
 *
 * <p>{@code <ID> = <expr>;}</p>
 *
 * <p>Given a pattern start rule such as {@code statement}, this object constructs
 * a {@link ParseTree} with placeholders for the {@code ID} and {@code expr}
 * subtree. Then the {@link #match} routines can compare an actual
 * {@link ParseTree} from a parse with this pattern. Tag {@code <ID>} matches
 * any {@code ID} token and tag {@code <expr>} references the result of the
 * {@code expr} rule (generally an instance of {@code ExprContext}.</p>
 *
 * <p>Pattern {@code x = 0;} is a similar pattern that matches the same pattern
 * except that it requires the identifier to be {@code x} and the expression to
 * be {@code 0}.</p>
 *
 * <p>The {@link #matches} routines return `true` or {@code false} based
 * upon a match for the tree rooted at the parameter sent in. The
 * {@link #match} routines return a {@link ParseTreeMatch} object that
 * contains the parse tree, the parse tree pattern, and a map from tag name to
 * matched nodes (more below). A subtree that fails to match, returns with
 * {@link ParseTreeMatch#mismatchedNode} set to the first tree node that did not
 * match.</p>
 *
 * <p>For efficiency, you can compile a tree pattern in string form to a
 * {@link ParseTreePattern} object.</p>
 *
 * <p>See {@code TestParseTreeMatcher} for lots of examples.
 * {@link ParseTreePattern} has two static helper methods:
 * {@link ParseTreePattern#findAll} and {@link ParseTreePattern#match} that
 * are easy to use but not super efficient because they create new
 * {@link ParseTreePatternMatcher} objects each time and have to compile the
 * pattern in string form before using it.</p>
 *
 * <p>The lexer and parser that you pass into the {@link ParseTreePatternMatcher}
 * constructor are used to parse the pattern in string form. The lexer converts
 * the {@code <ID> = <expr>;} into a sequence of four tokens (assuming lexer
 * throws out whitespace or puts it on a hidden channel). Be aware that the
 * input stream is reset for the lexer (but not the parser; a
 * {@link ParserInterpreter} is created to parse the input.). Any user-defined
 * fields you have put into the lexer might get changed when this mechanism asks
 * it to scan the pattern string.</p>
 *
 * <p>Normally a parser does not accept token {@code <expr>} as a valid
 * {@code expr} but, from the parser passed in, we create a special version of
 * the underlying grammar representation (an {@link ATN}) that allows imaginary
 * tokens representing rules ({@code <expr>}) to match entire rules. We call
 * these <em>bypass alternatives</em>.</p>
 *
 * <p>Delimiters are {@code <} and {@code >}, with {@code \} as the escape string
 * by default, but you can set them to whatever you want using
 * {@link #setDelimiters}. You must escape both start and stop strings
 * {@code \<} and {@code \>}.</p>
 */
export class ParseTreePatternMatcher extends JavaObject {
    private static CannotInvokeStartRule = class CannotInvokeStartRule extends java.lang.RuntimeException {
        public constructor(e: java.lang.Throwable) {
            super(e);
        }
    };

    // Fixes https://github.com/antlr/antlr4/issues/413
    // "Tree pattern compilation doesn't check for a complete parse"
    private static StartRuleDoesNotConsumeFullPattern = class StartRuleDoesNotConsumeFullPattern
        extends java.lang.RuntimeException {
    };

    protected start = S`<`;
    protected stop = S`>`;
    protected escape = S`\\`; // e.g., \< and \> must escape BOTH!

    /**
     * This is the backing field for {@link #getLexer()}.
     */
    private readonly lexer: Lexer;

    /**
     * This is the backing field for {@link #getParser()}.
     */
    private readonly parser: Parser;

    /**
     * Constructs a {@link ParseTreePatternMatcher} or from a {@link Lexer} and
     * {@link Parser} object. The lexer input stream is altered for tokenizing
     * the tree patterns. The parser is used as a convenient mechanism to get
     * the grammar name, plus token, rule names.
     *
     * @param lexer The lexer object used for parsing the tree patterns.
     * @param parser The parser object used for parsing the tree patterns.
     */
    public constructor(lexer: Lexer, parser: Parser) {
        super();
        this.lexer = lexer;
        this.parser = parser;
    }

    /**
     * Set the delimiters used for marking rule and token tags within concrete
     * syntax used by the tree pattern parser.
     *
     * @param start The start delimiter.
     * @param stop The stop delimiter.
     * @param escapeLeft The escape sequence to use for escaping a start or stop delimiter.
     *
     * @throws IllegalArgumentException if {@code start} is {@code null} or empty.
     * @throws IllegalArgumentException if {@code stop} is {@code null} or empty.
     */
    public setDelimiters = (start: java.lang.String, stop: java.lang.String, escapeLeft: java.lang.String): void => {
        if (start === null || start.isEmpty()) {
            throw new java.lang.IllegalArgumentException(S`start cannot be null or empty`);
        }

        if (stop === null || stop.isEmpty()) {
            throw new java.lang.IllegalArgumentException(S`stop cannot be null or empty`);
        }

        this.start = start;
        this.stop = stop;
        this.escape = escapeLeft;
    };

    /**
     * Does {@code pattern} matched as rule patternRuleIndex match tree? Pass in a
     *  compiled pattern instead of a string representation of a tree pattern.
     */
    public matches(tree: ParseTree, pattern: ParseTreePattern): boolean;
    /** Does {@code pattern} matched as rule {@code patternRuleIndex} match {@code tree}? */
    public matches(tree: ParseTree, pattern: java.lang.String, patternRuleIndex: number): boolean;
    public matches(tree: ParseTree, pattern: ParseTreePattern | java.lang.String, patternRuleIndex?: number): boolean {
        if (pattern instanceof ParseTreePattern) {
            const labels = new MultiMap<java.lang.String, ParseTree>();
            const mismatchedNode = this.matchImpl(tree, pattern.getPatternTree(), labels);

            return mismatchedNode === null;
        }
        else {
            const p = this.compile(pattern, patternRuleIndex!);

            return this.matches(tree, p);
        }
    }

    /**
     * Compare {@code pattern} matched against {@code tree} and return a
     * {@link ParseTreeMatch} object that contains the matched elements, or the
     * node at which the match failed. Pass in a compiled pattern instead of a
     * string representation of a tree pattern.
     */

    public match(tree: ParseTree, pattern: ParseTreePattern): ParseTreeMatch;
    /**
     * Compare {@code pattern} matched as rule {@code patternRuleIndex} against
     * {@code tree} and return a {@link ParseTreeMatch} object that contains the
     * matched elements, or the node at which the match failed.
     */
    public match(tree: ParseTree, pattern: java.lang.String, patternRuleIndex: number): ParseTreeMatch;
    public match(tree: ParseTree, pattern: ParseTreePattern | java.lang.String,
        patternRuleIndex?: number): ParseTreeMatch {
        if (pattern instanceof ParseTreePattern) {
            const labels: MultiMap<java.lang.String, ParseTree> = new MultiMap<java.lang.String, ParseTree>();
            const mismatchedNode = this.matchImpl(tree, pattern.getPatternTree(), labels);

            return new ParseTreeMatch(tree, pattern, labels, mismatchedNode);
        }
        else {
            const p = this.compile(pattern, patternRuleIndex!);

            return this.match(tree, p);
        }
    }

    /**
     * For repeated use of a tree pattern, compile it to a
     * {@link ParseTreePattern} using this method.
     *
     * @param pattern The tree pattern to compile.
     * @param patternRuleIndex The parser rule which serves as the root of the
     *
     * @returns A {@link ParseTreePattern} object which can be used to match
     */
    public compile = (pattern: java.lang.String, patternRuleIndex: number): ParseTreePattern => {
        const tokenList = this.tokenize(pattern);
        const tokenSrc = new ListTokenSource(tokenList);
        const tokens = new CommonTokenStream(tokenSrc);

        const parserInterpreter = new ParserInterpreter(this.parser.getGrammarFileName(),
            this.parser.getVocabulary(),
            java.util.Arrays.asList(...this.parser.getRuleNames()!),
            this.parser.getATNWithBypassAlts(),
            tokens);

        let tree;
        try {
            parserInterpreter.setErrorHandler(new BailErrorStrategy());
            tree = parserInterpreter.parse(patternRuleIndex);
        } catch (e) {
            if (e instanceof ParseCancellationException) {
                throw e.getCause();
            } else if (e instanceof RecognitionException) {
                throw e;
            } else if (e instanceof java.lang.Exception) {
                throw new ParseTreePatternMatcher.CannotInvokeStartRule(e);
            } else {
                throw e;
            }
        }

        // Make sure tree pattern compilation checks for a complete parse
        if (tokens.LA(1) !== Token.EOF) {
            throw new ParseTreePatternMatcher.StartRuleDoesNotConsumeFullPattern();
        }

        return new ParseTreePattern(this, pattern, patternRuleIndex, tree);
    };

    /**
     * Used to convert the tree pattern string into a series of tokens. The
     * input stream is reset.
     */

    public getLexer = (): Lexer | null => {
        return this.lexer;
    };

    /**
     * Used to collect to the grammar file name, token names, rule names for
     * used to parse the pattern into a parse tree.
     */

    public getParser = (): Parser => {
        return this.parser;
    };

    public tokenize = (pattern: java.lang.String): java.util.List<Token> => {
        // split pattern into chunks: sea (raw input) and islands (<ID>, <expr>)
        const chunks = this.split(pattern);

        // create token stream from text and tags
        const tokens: java.util.List<Token> = new java.util.ArrayList<Token>();
        for (const chunk of chunks) {
            if (chunk instanceof TagChunk) {
                const tagChunk = chunk;
                // add special rule token or conjure up new token from name
                if (java.lang.Character.isUpperCase(tagChunk.getTag()!.charAt(0))) {
                    const ttype = this.parser.getTokenType(tagChunk.getTag().valueOf());
                    if (ttype === Token.INVALID_TYPE) {
                        throw new java.lang.IllegalArgumentException(
                            S`Unknown token ${tagChunk.getTag()} in pattern: ${pattern}`);
                    }

                    const t = new TokenTagToken(tagChunk.getTag(), ttype, tagChunk.getLabel());
                    tokens.add(t);
                } else {
                    if (java.lang.Character.isLowerCase(tagChunk.getTag().charAt(0))) {
                        const ruleIndex = this.parser.getRuleIndex(tagChunk.getTag());
                        if (ruleIndex === -1) {
                            throw new java.lang.IllegalArgumentException(
                                S`Unknown rule ${tagChunk.getTag()} in pattern: ${pattern}`);
                        }
                        const ruleImaginaryTokenType = this.parser.getATNWithBypassAlts().ruleToTokenType[ruleIndex];
                        tokens.add(new RuleTagToken(tagChunk.getTag(), ruleImaginaryTokenType, tagChunk.getLabel()));
                    } else {
                        throw new java.lang.IllegalArgumentException(
                            S`invalid tag: ${tagChunk.getTag()} in pattern: ${pattern}`);
                    }
                }

            } else {
                const textChunk: TextChunk = chunk as TextChunk;
                const input = new ANTLRInputStream(textChunk.getText());
                this.lexer.setInputStream(input);
                let t: Token = this.lexer.nextToken();
                while (t.getType() !== Token.EOF) {
                    tokens.add(t);
                    t = this.lexer.nextToken();
                }
            }
        }

        return tokens;
    };

    /**
     * Split {@code <ID> = <e:expr> ;} into 4 chunks for tokenizing by {@link #tokenize}.
     *
     * @param pattern The pattern to split.
     *
     * @returns A list of chunks from the split operation.
     */
    public split = (pattern: java.lang.String): java.util.List<Chunk> => {
        let p = 0;
        const n = pattern.length();
        const chunks = new java.util.ArrayList<Chunk>();

        // find all start and stop indexes first, then collect
        const starts = new java.util.ArrayList<number>();
        const stops = new java.util.ArrayList<number>();
        while (p < n) {
            if (p === pattern.indexOf(S`${this.escape}${this.start}`, p)) {
                p += this.escape.length() + this.start.length();
            } else {
                if (p === pattern.indexOf(S`${this.escape}${this.stop}`, p)) {
                    p += this.escape.length() + this.stop.length();
                }
                else {
                    if (p === pattern.indexOf(this.start, p)) {
                        starts.add(p);
                        p += this.start.length();
                    }
                    else {
                        if (p === pattern.indexOf(this.stop, p)) {
                            stops.add(p);
                            p += this.stop.length();
                        }
                        else {
                            p++;
                        }
                    }

                }

            }

        }

        if (starts.size() > stops.size()) {
            throw new java.lang.IllegalArgumentException(S`unterminated tag in pattern: ${pattern}`);
        }

        if (starts.size() < stops.size()) {
            throw new java.lang.IllegalArgumentException(S`missing start tag in pattern: ${pattern}`);
        }

        const tagCount = starts.size();
        for (let i = 0; i < tagCount; i++) {
            if (starts.get(i) >= stops.get(i)) {
                throw new java.lang.IllegalArgumentException(S`tag delimiters out of order in pattern: ${pattern}`);
            }
        }

        // collect into chunks now
        if (tagCount === 0) {
            const text: java.lang.String = pattern.substring(0, n);
            chunks.add(new TextChunk(text));
        }

        if (tagCount > 0 && starts.get(0) > 0) { // copy text up to first tag into chunks
            const text: java.lang.String = pattern.substring(0, starts.get(0));
            chunks.add(new TextChunk(text));
        }
        for (let i = 0; i < tagCount; i++) {
            // copy inside of <tag>
            const tag = pattern.substring(starts.get(i) + this.start.length(), stops.get(i));
            let ruleOrToken: java.lang.String = tag;
            let label: java.lang.String | null = null;
            const colon = tag.indexOf(0x3A); // ':'
            if (colon >= 0) {
                label = tag.substring(0, colon);
                ruleOrToken = tag.substring(colon + 1, tag.length());
            }

            chunks.add(new TagChunk(label, ruleOrToken));
            if (i + 1 < tagCount) {
                // copy from end of <tag> to start of next
                const text: java.lang.String = pattern.substring(stops.get(i) + this.stop.length(), starts.get(i + 1));
                chunks.add(new TextChunk(text));
            }
        }

        if (tagCount > 0) {
            const afterLastTag = stops.get(tagCount - 1) + this.stop.length();
            if (afterLastTag < n) { // copy text from end of last tag to end
                const text: java.lang.String = pattern.substring(afterLastTag, n);
                chunks.add(new TextChunk(text));
            }
        }

        // strip out the escape sequences from text chunks but not tags
        for (let i = 0; i < chunks.size(); i++) {
            const c: Chunk = chunks.get(i);
            if (c instanceof TextChunk) {
                const unescaped = c.getText().replace(this.escape, S``);
                if (unescaped.length() < c.getText().length()) {
                    chunks.set(i, new TextChunk(unescaped));
                }
            }
        }

        return chunks;
    };

    // ---- SUPPORT CODE ----

    /**
     * Recursively walk {@code tree} against {@code patternTree}, filling
     * {@code match.}{@link ParseTreeMatch#labels labels}.
     *
     * @returns the first node encountered in {@code tree} which does not match
     * a corresponding node in {@code patternTree}, or {@code null} if the match
     * was successful. The specific node returned depends on the matching
     * algorithm used by the implementation, and may be overridden.
     */

    protected matchImpl = (tree: ParseTree | null, patternTree: ParseTree | null,
        labels: MultiMap<java.lang.String, ParseTree>): ParseTree | null => {
        if (tree === null) {
            throw new java.lang.IllegalArgumentException(S`tree cannot be null`);
        }

        if (patternTree === null) {
            throw new java.lang.IllegalArgumentException(S`patternTree cannot be null`);
        }

        // x and <ID>, x and y, or x and x; or could be mismatched types
        if (isTerminalNode(tree) && isTerminalNode(patternTree)) {
            let mismatchedNode: ParseTree | null = null;

            // both are tokens and they have same type
            if (tree.getSymbol().getType() === patternTree.getSymbol().getType()) {
                if (patternTree.getSymbol() instanceof TokenTagToken) { // x and <ID>
                    const tokenTagToken = patternTree.getSymbol() as TokenTagToken;
                    // track label->list-of-nodes for both token name and label (if any)
                    labels.map(tokenTagToken.getTokenName()!, tree);
                    if (tokenTagToken.getLabel() !== null) {
                        labels.map(tokenTagToken.getLabel()!, tree);
                    }
                }
                else {
                    if (tree.getText().equals(patternTree.getText())) {
                        // x and x
                    } else {
                        // x and y
                        if (mismatchedNode === null) {
                            mismatchedNode = tree;
                        }
                    }
                }

            }
            else {
                if (mismatchedNode === null) {
                    mismatchedNode = tree;
                }
            }

            return mismatchedNode;
        }

        if (tree instanceof ParserRuleContext && patternTree instanceof ParserRuleContext) {
            let mismatchedNode: ParseTree | null = null;

            // (expr ...) and <expr>
            const ruleTagToken = this.getRuleTagToken(patternTree);
            if (ruleTagToken !== null) {
                if (tree.getRuleContext()!.getRuleIndex() === patternTree.getRuleContext()!.getRuleIndex()) {
                    // track label->list-of-nodes for both rule name and label (if any)
                    labels.map(ruleTagToken.getRuleName()!, tree);
                    if (ruleTagToken.getLabel() !== null) {
                        labels.map(ruleTagToken.getLabel()!, tree);
                    }
                }
                else {
                    if (mismatchedNode === null) {
                        mismatchedNode = tree;
                    }
                }

                return mismatchedNode;
            }

            // (expr ...) and (expr ...)
            if (tree.getChildCount() !== patternTree.getChildCount()) {
                if (mismatchedNode === null) {
                    mismatchedNode = tree;
                }

                return mismatchedNode;
            }

            const n: number = tree.getChildCount();
            for (let i = 0; i < n; i++) {
                const childMatch = this.matchImpl(tree.getChild(i), patternTree.getChild(i), labels);
                if (childMatch !== null) {
                    return childMatch;
                }
            }

            return mismatchedNode;
        }

        // if nodes aren't both tokens or both rule nodes, can't match
        return tree;
    };

    /**
     * Is {@code t} {@code (expr <expr>)} subtree?
     *
     * @param t the tree to test
     *
     * @returns the rule tag token if {@code t} is a rule tag token subtree, otherwise
     */
    protected getRuleTagToken = (t: ParseTree | null): RuleTagToken | null => {
        if (isRuleNode(t)) {
            if (t.getChildCount() === 1 && isTerminalNode(t.getChild(0))) {
                const c = t.getChild(0) as TerminalNode;
                if (c.getSymbol() instanceof RuleTagToken) {
                    return c.getSymbol() as RuleTagToken;
                }
            }
        }

        return null;
    };

}
