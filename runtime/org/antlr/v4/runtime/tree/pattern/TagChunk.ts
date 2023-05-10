/* java2ts: keep */

/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { java, S } from "jree";
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
    private readonly tag: java.lang.String;
    /**
     * This is the backing field for {@link #getLabel}.
     */
    private readonly label: java.lang.String | null = null;

    /**
     * Construct a new instance of {@link TagChunk} using the specified tag and
     * no label.
     *
     * @param tag The tag, which should be the name of a parser rule or token
     * type.
     *
     * @throws IllegalArgumentException if {@code tag} is {@code null} or
     * empty.
     */
    public constructor(tag: java.lang.String);
    /**
     * Construct a new instance of {@link TagChunk} using the specified label
     * and tag.
     *
     * @param label The label for the tag. If this is {@code null}, the
     * {@link TagChunk} represents an unlabeled tag.
     * @param tag The tag, which should be the name of a parser rule or token
     * type.
     *
     * @throws IllegalArgumentException if {@code tag} is {@code null} or
     * empty.
     */
    public constructor(label: java.lang.String | null, tag: java.lang.String);
    public constructor(tagOrLabel: java.lang.String | null, tag?: java.lang.String) {
        super();

        if (tag === undefined) {
            this.tag = tagOrLabel!;
        }
        else {
            const label = tagOrLabel;
            if (tag.isEmpty()) {
                throw new java.lang.IllegalArgumentException(S`tag cannot be null or empty`);
            }

            this.label = label;
            this.tag = tag;
        }
    }

    /**
     * Get the tag for this chunk.
     *
     * @returns The tag for the chunk.
     */

    public readonly getTag = (): java.lang.String => {
        return this.tag;
    };

    /**
     * Get the label, if any, assigned to this chunk.
     *
     * @returns The label assigned to this chunk, or {@code null} if no label is
     * assigned to the chunk.
     */

    public readonly getLabel = (): java.lang.String | null => {
        return this.label;
    };

    /**
     * This method returns a text representation of the tag chunk. Labeled tags
     * are returned in the form {@code label:tag}, and unlabeled tags are
     * returned as just the tag name.
     *
     * @returns A text representation of the tag chunk.
     */
    public override toString = (): java.lang.String => {
        if (this.label !== null) {
            return S`${this.label + ":" + this.tag}`;
        }

        return S``;
    };
}
