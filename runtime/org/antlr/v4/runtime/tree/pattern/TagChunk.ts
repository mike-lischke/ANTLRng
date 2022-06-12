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
 * Represents a placeholder tag in a tree pattern. A tag can have any of the
 * following forms.
 *
 * <ul>
 * <li>{@code expr}: An unlabeled placeholder for a parser rule {@code expr}.</li>
 * <li>{@code ID}: An unlabeled placeholder for a token of type {@code ID}.</li>
 * <li>{@code e:expr}: A labeled placeholder for a parser rule {@code expr}.</li>
 * <li>{@code id:ID}: A labeled placeholder for a token of type {@code ID}.</li>
 * </ul>
 *
 * This class does not perform any validation on the tag or label names aside
 * from ensuring that the tag is a non-null, non-empty string.
 */
export class TagChunk extends Chunk {
	/**
	 * This is the backing field for {@link #getTag}.
	 */
	private readonly  tag?:  string;
	/**
	 * This is the backing field for {@link #getLabel}.
	 */
	private readonly  label?:  string;

	/**
	 * Construct a new instance of {@link TagChunk} using the specified tag and
	 * no label.
	 *
	 * @param tag The tag, which should be the name of a parser rule or token
	 * type.
	 *
	 * @exception IllegalArgumentException if {@code tag} is {@code null} or
	 * empty.
	 */
	/* eslint-disable constructor-super, @typescript-eslint/no-unsafe-call */
public constructor(tag: string);

	/**
	 * Construct a new instance of {@link TagChunk} using the specified label
	 * and tag.
	 *
	 * @param label The label for the tag. If this is {@code null}, the
	 * {@link TagChunk} represents an unlabeled tag.
	 * @param tag The tag, which should be the name of a parser rule or token
	 * type.
	 *
	 * @exception IllegalArgumentException if {@code tag} is {@code null} or
	 * empty.
	 */
	public constructor(label: string, tag: string);
/* @ts-expect-error, because of the super() call in the closure. */
public constructor(tagOrLabel: string, tag?: string) {
const $this = (tagOrLabel: string, tag?: string): void => {
if (tag === undefined) {
		$this(undefined, tag);
	}
 else  {
let label = tagOrLabel as string;
/* @ts-expect-error, because of the super() call in the closure. */
		super();
if (tag === undefined || tag.isEmpty()) {
			throw new  java.lang.IllegalArgumentException("tag cannot be null or empty");
		}

		this.label = label;
		this.tag = tag;
	}
};

$this(tagOrLabel, tag);

}
/* eslint-enable constructor-super, @typescript-eslint/no-unsafe-call */

	/**
	 * Get the tag for this chunk.
	 *
	 * @return The tag for the chunk.
	 */

	public readonly  getTag = (): string => {
		return this.tag;
	}

	/**
	 * Get the label, if any, assigned to this chunk.
	 *
	 * @return The label assigned to this chunk, or {@code null} if no label is
	 * assigned to the chunk.
	 */

	public readonly  getLabel = (): string => {
		return this.label;
	}

	/**
	 * This method returns a text representation of the tag chunk. Labeled tags
	 * are returned in the form {@code label:tag}, and unlabeled tags are
	 * returned as just the tag name.
	 */
	public toString = (): string => {
		if (this.label !== undefined) {
			return this.label + ":" + this.tag;
		}

		return this.tag;
	}
}
