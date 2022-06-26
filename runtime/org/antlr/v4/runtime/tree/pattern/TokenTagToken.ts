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



import { CommonToken } from "../../CommonToken";




/**
 * A {@link Token} object representing a token of a particular type; e.g.,
 * {@code <ID>}. These tokens are created for {@link TagChunk} chunks where the
 * tag corresponds to a lexer rule or token type.
 */
export  class TokenTagToken extends CommonToken {
	/**
	 * This is the backing field for {@link #getTokenName}.
	 */

	private readonly  tokenName?:  string;
	/**
	 * This is the backing field for {@link #getLabel}.
	 */

	private readonly  label?:  string;

	/**
	 * Constructs a new instance of {@link TokenTagToken} for an unlabeled tag
	 * with the specified token name and type.
	 *
	 * @param tokenName The token name.
	 * @param type The token type.
	 */
	public constructor(tokenName: string, type: number);

	/**
	 * Constructs a new instance of {@link TokenTagToken} with the specified
	 * token name, type, and label.
	 *
	 * @param tokenName The token name.
	 * @param type The token type.
	 * @param label The label associated with the token tag, or {@code null} if
	 * the token tag is unlabeled.
	 */
	public constructor(tokenName: string, type: number, label: string);
public constructor(tokenName: string, type: number, label?: string) {
const $this = (tokenName: string, type: number, label?: string): void => {
if (label === undefined) {
		$this(tokenName, type, undefined);
	}
 else  {
		super(type);
		this.tokenName = tokenName;
		this.label = label;
	}
};

$this(tokenName, type, label);

}


	/**
	 * Gets the token name.
	 * @return The token name.
	 */

	public readonly  getTokenName = (): string => {
		return this.tokenName;
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
	 * <p>The implementation for {@link TokenTagToken} returns the token tag
	 * formatted with {@code <} and {@code >} delimiters.</p>
	 */
	public getText = (): string => {
		if (this.label !== undefined) {
			return "<" + this.label + ":" + this.tokenName + ">";
		}

		return "<" + this.tokenName + ">";
	}

	/**
	 * {@inheritDoc}
	 *
	 * <p>The implementation for {@link TokenTagToken} returns a string of the form
	 * {@code tokenName:type}.</p>
	 */
	public toString = (): string => {
		return this.tokenName + ":" + CommonToken.type;
	}
}
