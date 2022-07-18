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
import { AbstractEqualityComparator } from "./AbstractEqualityComparator";

/**
 * This default implementation of {@link EqualityComparator} uses object equality
 * for comparisons by calling {@link Object#hashCode} and {@link Object#equals}.
 *
 * @author Sam Harwell
 */
export class ObjectEqualityComparator extends AbstractEqualityComparator<IEquatable> {
    public static readonly INSTANCE = new ObjectEqualityComparator();

    public hashCode = (obj: IEquatable): number => {
        if (obj === undefined) {
            return 0;
        }

        return obj.hashCode();
    };

    public equals = (a: IEquatable, b: IEquatable): boolean => {
        if (a === undefined) {
            return b === undefined;
        }

        return a.equals(b);
    };
}
