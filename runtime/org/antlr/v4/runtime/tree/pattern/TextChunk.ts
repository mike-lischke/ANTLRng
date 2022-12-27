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


import { Chunk } from "./Chunk";


import { S } from "../../../../../../../lib/templates";


/**
 * Represents a span of raw text (concrete syntax) between tags in a tree
 * pattern string.
 */
export class TextChunk extends Chunk {
	/**
	 * This is the backing field for {@link #getText}.
	 */

	private readonly  text:  java.lang.String | null;

	/**
	 * Constructs a new instance of {@link TextChunk} with the specified text.
	 *
	 * @param text The text of this chunk.
	 * @exception IllegalArgumentException if {@code text} is {@code null}.
	 */
	public constructor(text: java.lang.String| null) {
		super();
if (text === null) {
			throw new  java.lang.IllegalArgumentException(S`text cannot be null`);
		}

		this.text = text;
	}

	/**
	 * Gets the raw text of this chunk.
	 *
	  @returns The text of the chunk.
	 */

	public readonly  getText = ():  java.lang.String | null => {
		return this.text;
	}

	/**
	 *
	 * <p>The implementation for {@link TextChunk} returns the result of
	 * {@link #getText()} in single quotes.</p>
	 */
	public toString = ():  java.lang.String | null => {
		return S`'`+this.text+S`'`;
	}
}
