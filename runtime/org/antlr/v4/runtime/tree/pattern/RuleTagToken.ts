/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */


/*
 eslint-disable @typescript-eslint/no-namespace, @typescript-eslint/naming-convention, no-redeclare,
 max-classes-per-file, jsdoc/check-tag-names, @typescript-eslint/no-empty-function,
 @typescript-eslint/restrict-plus-operands, @typescript-eslint/unified-signatures, @typescript-eslint/member-ordering,
 no-underscore-dangle, max-len
*/

/* cspell: disable */




import { CharStream } from "../../CharStream";
import { Token } from "../../Token";
import { TokenSource } from "../../TokenSource";


import { JavaObject } from "../../../../../../../lib/java/lang/Object";
import { S } from "../../../../../../../lib/templates";


/**
 * A {@link Token} object representing an entire subtree matched by a parser
 * rule; e.g., {@code <expr>}. These tokens are created for {@link TagChunk}
 * chunks where the tag corresponds to a parser rule.
 */
export  class RuleTagToken extends JavaObject extends  Token {
	/**
	 * This is the backing field for {@link #getRuleName}.
	 */
	private readonly  ruleName:  java.lang.String | null;
	/**
	 * The token type for the current token. This is the token type assigned to
	 * the bypass alternative for the rule during ATN deserialization.
	 */
	private readonly  bypassTokenType:  number;
	/**
	 * This is the backing field for {@link #getLabel}.
	 */
	private readonly  label:  java.lang.String | null;

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
	/* eslint-disable constructor-super, @typescript-eslint/no-unsafe-call */
public constructor(ruleName: java.lang.String| null, bypassTokenType: number);

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
	public constructor(ruleName: java.lang.String| null, bypassTokenType: number, label: java.lang.String| null);
/* @ts-expect-error, because of the super() call in the closure. */
public constructor(ruleName: java.lang.String | null, bypassTokenType: number, label?: java.lang.String | null) {
const $this = (ruleName: java.lang.String | null, bypassTokenType: number, label?: java.lang.String | null): void => {
if (label === undefined) {
		$this(ruleName, bypassTokenType, null);
	}
 else  {

/* @ts-expect-error, because of the super() call in the closure. */
		super();
if (ruleName === null || ruleName.isEmpty()) {
			throw new  java.lang.IllegalArgumentException(S`ruleName cannot be null or empty.`);
		}

		this.ruleName = ruleName;
		this.bypassTokenType = bypassTokenType;
		this.label = label;
	}
};

$this(ruleName, bypassTokenType, label);

}
/* eslint-enable constructor-super, @typescript-eslint/no-unsafe-call */

	/**
	 * Gets the name of the rule associated with this rule tag.
	 *
	  @returns The name of the parser rule associated with this rule tag.
	 */

	public readonly  getRuleName = ():  java.lang.String | null => {
		return this.ruleName;
	}

	/**
	 * Gets the label associated with the rule tag.
	 *
	  @returns The name of the label associated with the rule tag, or
	 * {@code null} if this is an unlabeled rule tag.
	 */

	public readonly  getLabel = ():  java.lang.String | null => {
		return this.label;
	}

	/**
	 *
	 * <p>Rule tag tokens are always placed on the {@link #DEFAULT_CHANNEL}.</p>
	 */
	public getChannel = ():  number => {
		return Token.DEFAULT_CHANNEL;
	}

	/**
	 *
	 * <p>This method returns the rule tag formatted with {@code <} and {@code >}
	 * delimiters.</p>
	 */
	public getText = ():  java.lang.String | null => {
		if (this.label !== null) {
			return S`<` + this.label + S`:` + this.ruleName + S`>`;
		}

		return S`<` + this.ruleName + S`>`;
	}

	/**
	 *
	 * <p>Rule tag tokens have types assigned according to the rule bypass
	 * transitions created during ATN deserialization.</p>
	 */
	public getType = ():  number => {
		return this.bypassTokenType;
	}

	/**
	 *
	 * <p>The implementation for {@link RuleTagToken} always returns 0.</p>
	 */
	public getLine = ():  number => {
		return 0;
	}

	/**
	 *
	 * <p>The implementation for {@link RuleTagToken} always returns -1.</p>
	 */
	public getCharPositionInLine = ():  number => {
		return -1;
	}

	/**
	 *
	 * <p>The implementation for {@link RuleTagToken} always returns -1.</p>
	 */
	public getTokenIndex = ():  number => {
		return -1;
	}

	/**
	 *
	 * <p>The implementation for {@link RuleTagToken} always returns -1.</p>
	 */
	public getStartIndex = ():  number => {
		return -1;
	}

	/**
	 *
	 * <p>The implementation for {@link RuleTagToken} always returns -1.</p>
	 */
	public getStopIndex = ():  number => {
		return -1;
	}

	/**
	 *
	 * <p>The implementation for {@link RuleTagToken} always returns {@code null}.</p>
	 */
	public getTokenSource = ():  TokenSource | null => {
		return null;
	}

	/**
	 *
	 * <p>The implementation for {@link RuleTagToken} always returns {@code null}.</p>
	 */
	public getInputStream = ():  CharStream | null => {
		return null;
	}

	/**
	 *
	 * <p>The implementation for {@link RuleTagToken} returns a string of the form
	 * {@code ruleName:bypassTokenType}.</p>
	 */
	public toString = ():  java.lang.String | null => {
		return this.ruleName + S`:` + this.bypassTokenType;
	}
}
