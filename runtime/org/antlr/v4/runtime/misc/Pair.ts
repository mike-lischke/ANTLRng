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

import { java } from "../../../../../../lib/java/java";
import { IEquatable } from "../../../../../../lib/types";

import { ObjectEqualityComparator } from "./ObjectEqualityComparator";

export class Pair<A extends IEquatable, B extends IEquatable> implements java.io.Serializable {
    public readonly a?: A;
    public readonly b?: B;

    public constructor(a: A, b: B) {
        this.a = a;
        this.b = b;
    }

    public equals = (obj: unknown): boolean => {
        if (obj === this) {
            return true;
        } else {
            if (!(obj instanceof Pair<IEquatable, IEquatable>)) {
                return false;
            }
        }

        const other = obj as Pair<IEquatable, IEquatable>;

        return ObjectEqualityComparator.INSTANCE.equals(this.a, other.a)
            && ObjectEqualityComparator.INSTANCE.equals(this.b, other.b);
    };

    /*
    public hashCode = (): number => {
        let hash: number = MurmurHash.initialize();
        hash = MurmurHash.update(hash, this.a);
        hash = MurmurHash.update(hash, this.b);

        return MurmurHash.finish(hash, 2);
    };
    */

    public toString = (): string => {
        return java.lang.StringBuilder.format("(%s, %s)", this.a, this.b);
    };
}
