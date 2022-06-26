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



import { MurmurHash } from "./MurmurHash";
import { ObjectEqualityComparator } from "./ObjectEqualityComparator";




export  class Pair<A,B> extends  {
	public readonly  a?:  A;
	public readonly  b?:  B;

	public constructor(a: A, b: B) {
		this.a = a;
		this.b = b;
	}

	public equals = (obj: object): boolean => {
		if (obj === this) {
			return true;
		}
		else { if (!(obj instanceof Pair<unknown, unknown>)) {
			return false;
		}
}


		let  other: Pair<unknown, unknown> = obj as Pair<unknown, unknown>;
		return ObjectEqualityComparator.INSTANCE.equals(this.a, other.a)
			&& ObjectEqualityComparator.INSTANCE.equals(this.b, other.b);
	}

	public hashCode = (): number => {
		let  hash: number = MurmurHash.initialize();
		hash = MurmurHash.update(hash, this.a);
		hash = MurmurHash.update(hash, this.b);
		return MurmurHash.finish(hash, 2);
	}

	public toString = (): string => {
		return string.format("(%s, %s)", this.a, this.b);
	}
}
