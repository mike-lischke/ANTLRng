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
import { Chunk } from "./Chunk";




/**
 * Represents a span of raw text (concrete syntax) between tags in a tree
 * pattern string.
 */
export class TextChunk extends Chunk {
	/**
	 * This is the backing field for {@link #getText}.
	 */

	private readonly  text?:  string;

	/**
	 * Constructs a new instance of {@link TextChunk} with the specified text.
	 *
	 * @param text The text of this chunk.
	 * @exception IllegalArgumentException if {@code text} is {@code null}.
	 */
	public constructor(text: string) {
		super();
if (text === undefined) {
			throw new  java.lang.IllegalArgumentException("text cannot be null");
		}

		this.text = text;
	}

	/**
	 * Gets the raw text of this chunk.
	 *
	 * @return The text of the chunk.
	 */

	public readonly  getText = (): string => {
		return this.text;
	}

	/**
	 * {@inheritDoc}
	 *
	 * <p>The implementation for {@link TextChunk} returns the result of
	 * {@link #getText()} in single quotes.</p>
	 */
	public toString = (): string => {
		return "'"+this.text+"'";
	}
}
