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


import { AbstractEqualityComparator } from "./AbstractEqualityComparator";
import { EqualityComparator } from "./EqualityComparator";




/**
 * This default implementation of {@link EqualityComparator} uses object equality
 * for comparisons by calling {@link Object#hashCode} and {@link Object#equals}.
 *
 * @author Sam Harwell
 */
export  class ObjectEqualityComparator extends AbstractEqualityComparator<java.lang.Object> {
	public static readonly  INSTANCE:  ObjectEqualityComparator | null = new  ObjectEqualityComparator();

	/**
	 *
	 * <p>This implementation returns
	 * {@code obj.}{@link Object#hashCode hashCode()}.</p>
	 */
	public hashCode = (obj: java.lang.Object| null):  number => {
		if (obj === null) {
			return 0;
		}

		return obj.hashCode();
	}

	/**
	 *
	 * <p>This implementation relies on object equality. If both objects are
	 * {@code null}, this method returns {@code true}. Otherwise if only
	 * {@code a} is {@code null}, this method returns {@code false}. Otherwise,
	 * this method returns the result of
	 * {@code a.}{@link Object#equals equals}{@code (b)}.</p>
	 */
	public equals = (a: java.lang.Object| null, b: java.lang.Object| null):  boolean => {
		if (a === null) {
			return b === null;
		}

		return a.equals(b);
	}

}
