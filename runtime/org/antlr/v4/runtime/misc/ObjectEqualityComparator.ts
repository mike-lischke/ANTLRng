/* java2ts: keep */

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

import { IEquatable } from "../../../../../../lib/types";
import { EqualityComparator } from "./EqualityComparator";

/**
 * This default implementation of {@link EqualityComparator} uses object equality
 * for comparisons by calling {@link Object#hashCode} and {@link Object#equals}.
 *
 * @author Sam Harwell
 */
export class ObjectEqualityComparator extends EqualityComparator<IEquatable> {
    public static readonly INSTANCE = new ObjectEqualityComparator();

    public hashCode = (obj?: IEquatable): number => {
        if (!obj) {
            return 0;
        }

        return obj.hashCode();
    };

    /**
     * This implementation relies on object equality. If both objects are
     * `undefined` or `null`, this method returns `true`. Otherwise if only
     * `a` is `undefined` or `null`, this method returns `false`. Otherwise,
     * this method returns the result of
     * `a.`{@link Object#equals equals}`(b)`.
     *
     * @param a One object to compare with b.
     * @param b Another object to compare with a.
     *
     * @returns True if both parameters are equal, otherwise false.
     */
    public equals = (a?: IEquatable, b?: IEquatable): boolean => {
        if (!a) {
            return !b;
        }

        return a.equals(b);
    };
}
