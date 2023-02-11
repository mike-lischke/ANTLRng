/* java2ts: keep */

/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { JavaObject, java, S } from "jree";
import { CharStream } from "../../CharStream";
import { Token } from "../../Token";
import { TokenSource } from "../../TokenSource";

/**
 * A {@link Token} object representing an entire subtree matched by a parser
 * rule; e.g., {@code <expr>}. These tokens are created for {@link TagChunk}
 * chunks where the tag corresponds to a parser rule.
 */
export class RuleTagToken extends JavaObject implements Token {
    /**
     * This is the backing field for {@link #getRuleName}.
     */
    private readonly ruleName: java.lang.String | null;
    /**
     * The token type for the current token. This is the token type assigned to
     * the bypass alternative for the rule during ATN deserialization.
     */
    private readonly bypassTokenType: number;
    /**
     * This is the backing field for {@link #getLabel}.
     */
    private readonly label: java.lang.String | null;

    /**
     * Constructs a new instance of {@link RuleTagToken} with the specified rule
     * name and bypass token type and no label.
     *
     * @param ruleName The name of the parser rule this rule tag matches.
     * @param bypassTokenType The bypass token type assigned to the parser rule.
     *
     * @throws IllegalArgumentException if {@code ruleName} is {@code null}
     * or empty.
     */
    public constructor(ruleName: java.lang.String, bypassTokenType: number);
    /**
     * Constructs a new instance of {@link RuleTagToken} with the specified rule
     * name, bypass token type, and label.
     *
     * @param ruleName The name of the parser rule this rule tag matches.
     * @param bypassTokenType The bypass token type assigned to the parser rule.
     * @param label The label associated with the rule tag, or {@code null} if
     * the rule tag is unlabeled.
     *
     * @throws IllegalArgumentException if {@code ruleName} is {@code null}
     * or empty.
     */
    public constructor(ruleName: java.lang.String, bypassTokenType: number, label: java.lang.String | null);
    public constructor(ruleName: java.lang.String, bypassTokenType: number, label?: java.lang.String | null) {
        super();

        if (ruleName === null || ruleName.isEmpty()) {
            throw new java.lang.IllegalArgumentException(S`ruleName cannot be null or empty.`);
        }

        this.ruleName = ruleName;
        this.bypassTokenType = bypassTokenType;
        this.label = label || null;
    }

    /**
     * Gets the name of the rule associated with this rule tag.
     *
     * @returns The name of the parser rule associated with this rule tag.
     */

    public readonly getRuleName = (): java.lang.String | null => {
        return this.ruleName;
    };

    /**
     * Gets the label associated with the rule tag.
     *
     * @returns The name of the label associated with the rule tag, or
     * {@code null} if this is an unlabeled rule tag.
     */

    public readonly getLabel = (): java.lang.String | null => {
        return this.label;
    };

    /**
     * <p>Rule tag tokens are always placed on the {@link #DEFAULT_CHANNEL}.</p>
     *
     * @returns The default channel.
     */
    public getChannel = (): number => {
        return Token.DEFAULT_CHANNEL;
    };

    /**
     * <p>This method returns the rule tag formatted with {@code <} and {@code >}
     * delimiters.</p>
     *
     * @returns A text string for the rule tag.
     */
    public getText = (): java.lang.String => {
        if (this.label !== null) {
            return S`<${this.label}:${this.ruleName}>`;
        }

        return S`<${this.ruleName}>`;
    };

    /**
     * <p>Rule tag tokens have types assigned according to the rule bypass
     * transitions created during ATN deserialization.</p>
     *
     * @returns The bypass token type assigned to the parser rule.
     */
    public getType = (): number => {
        return this.bypassTokenType;
    };

    /**
     * <p>The implementation for {@link RuleTagToken} always returns 0.</p>
     *
     * @returns 0
     */
    public getLine = (): number => {
        return 0;
    };

    /**
     * <p>The implementation for {@link RuleTagToken} always returns -1.</p>
     *
     * @returns -1
     */
    public getCharPositionInLine = (): number => {
        return -1;
    };

    /**
     * <p>The implementation for {@link RuleTagToken} always returns -1.</p>
     *
     * @returns -1
     */
    public getTokenIndex = (): number => {
        return -1;
    };

    /**
     * <p>The implementation for {@link RuleTagToken} always returns -1.</p>
     *
     * @returns -1
     */
    public getStartIndex = (): number => {
        return -1;
    };

    /**
     * <p>The implementation for {@link RuleTagToken} always returns -1.</p>
     *
     * @returns -1
     */
    public getStopIndex = (): number => {
        return -1;
    };

    /**
     * <p>The implementation for {@link RuleTagToken} always returns {@code null}.</p>
     *
     * @returns null
     */
    public getTokenSource = (): TokenSource | null => {
        return null;
    };

    /**
     * <p>The implementation for {@link RuleTagToken} always returns {@code null}.</p>
     *
     * @returns null
     */
    public getInputStream = (): CharStream | null => {
        return null;
    };

    /**
     * <p>The implementation for {@link RuleTagToken} returns a string of the form
     * {@code ruleName:bypassTokenType}.</p>
     *
     * @returns A string representing the current {@link RuleTagToken} instance.
     */
    public toString = (): java.lang.String => {
        return S`${this.ruleName}:${this.bypassTokenType}`;
    };
}
