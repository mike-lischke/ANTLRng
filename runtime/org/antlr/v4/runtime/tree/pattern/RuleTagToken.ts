/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */


/*
 eslint-disable @typescript-eslint/no-namespace, @typescript-eslint/naming-convention,
 max-classes-per-file, jsdoc/check-tag-names, @typescript-eslint/no-empty-function,
 @typescript-eslint/restrict-plus-operands, @typescript-eslint/unified-signatures, @typescript-eslint/member-ordering,
 no-underscore-dangle
*/

/* cspell: disable */



import { java } from "../../../../../../../lib/java/java";
import { CharStream } from "../../CharStream";
import { Token } from "../../Token";
import { TokenSource } from "../../TokenSource";




/**
 * A {@link Token} object representing an entire subtree matched by a parser
 * rule; e.g., {@code <expr>}. These tokens are created for {@link TagChunk}
 * chunks where the tag corresponds to a parser rule.
 */
export  class RuleTagToken extends  Token {
	/**
	 * This is the backing field for {@link #getRuleName}.
	 */
	private readonly  ruleName?:  string;
	/**
	 * The token type for the current token. This is the token type assigned to
	 * the bypass alternative for the rule during ATN deserialization.
	 */
	private readonly  bypassTokenType:  number;
	/**
	 * This is the backing field for {@link #getLabel}.
	 */
	private readonly  label?:  string;

	/**
	 * Constructs a new instance of {@link RuleTagToken} with the specified rule
	 * name and bypass token type and no label.
	 *
	 * @param ruleName The name of the parser rule this rule tag matches.
	 * @param bypassTokenType The bypass token type assigned to the parser rule.
	 *
	 * @exception IllegalArgumentException if {@code ruleName} is {@code null}
	 * or empty.
	 */
	public constructor(ruleName: string, bypassTokenType: number);

	/**
	 * Constructs a new instance of {@link RuleTagToken} with the specified rule
	 * name, bypass token type, and label.
	 *
	 * @param ruleName The name of the parser rule this rule tag matches.
	 * @param bypassTokenType The bypass token type assigned to the parser rule.
	 * @param label The label associated with the rule tag, or {@code null} if
	 * the rule tag is unlabeled.
	 *
	 * @exception IllegalArgumentException if {@code ruleName} is {@code null}
	 * or empty.
	 */
	public constructor(ruleName: string, bypassTokenType: number, label: string);
public constructor(ruleName: string, bypassTokenType: number, label?: string) {
const $this = (ruleName: string, bypassTokenType: number, label?: string): void => {
if (label === undefined) {
		$this(ruleName, bypassTokenType, undefined);
	}
 else  {
		if (ruleName === undefined || ruleName.isEmpty()) {
			throw new  java.lang.IllegalArgumentException("ruleName cannot be null or empty.");
		}

		this.ruleName = ruleName;
		this.bypassTokenType = bypassTokenType;
		this.label = label;
	}
};

$this(ruleName, bypassTokenType, label);

}


	/**
	 * Gets the name of the rule associated with this rule tag.
	 *
	 * @return The name of the parser rule associated with this rule tag.
	 */

	public readonly  getRuleName = (): string => {
		return this.ruleName;
	}

	/**
	 * Gets the label associated with the rule tag.
	 *
	 * @return The name of the label associated with the rule tag, or
	 * {@code null} if this is an unlabeled rule tag.
	 */

	public readonly  getLabel = (): string => {
		return this.label;
	}

	/**
	 * {@inheritDoc}
	 *
	 * <p>Rule tag tokens are always placed on the {@link #DEFAULT_CHANNEL}.</p>
	 */
	public getChannel = (): number => {
		return Token.DEFAULT_CHANNEL;
	}

	/**
	 * {@inheritDoc}
	 *
	 * <p>This method returns the rule tag formatted with {@code <} and {@code >}
	 * delimiters.</p>
	 */
	public getText = (): string => {
		if (this.label !== undefined) {
			return "<" + this.label + ":" + this.ruleName + ">";
		}

		return "<" + this.ruleName + ">";
	}

	/**
	 * {@inheritDoc}
	 *
	 * <p>Rule tag tokens have types assigned according to the rule bypass
	 * transitions created during ATN deserialization.</p>
	 */
	public getType = (): number => {
		return this.bypassTokenType;
	}

	/**
	 * {@inheritDoc}
	 *
	 * <p>The implementation for {@link RuleTagToken} always returns 0.</p>
	 */
	public getLine = (): number => {
		return 0;
	}

	/**
	 * {@inheritDoc}
	 *
	 * <p>The implementation for {@link RuleTagToken} always returns -1.</p>
	 */
	public getCharPositionInLine = (): number => {
		return -1;
	}

	/**
	 * {@inheritDoc}
	 *
	 * <p>The implementation for {@link RuleTagToken} always returns -1.</p>
	 */
	public getTokenIndex = (): number => {
		return -1;
	}

	/**
	 * {@inheritDoc}
	 *
	 * <p>The implementation for {@link RuleTagToken} always returns -1.</p>
	 */
	public getStartIndex = (): number => {
		return -1;
	}

	/**
	 * {@inheritDoc}
	 *
	 * <p>The implementation for {@link RuleTagToken} always returns -1.</p>
	 */
	public getStopIndex = (): number => {
		return -1;
	}

	/**
	 * {@inheritDoc}
	 *
	 * <p>The implementation for {@link RuleTagToken} always returns {@code null}.</p>
	 */
	public getTokenSource = (): TokenSource => {
		return undefined;
	}

	/**
	 * {@inheritDoc}
	 *
	 * <p>The implementation for {@link RuleTagToken} always returns {@code null}.</p>
	 */
	public getInputStream = (): CharStream => {
		return undefined;
	}

	/**
	 * {@inheritDoc}
	 *
	 * <p>The implementation for {@link RuleTagToken} returns a string of the form
	 * {@code ruleName:bypassTokenType}.</p>
	 */
	public toString = (): string => {
		return this.ruleName + ":" + this.bypassTokenType;
	}
}
