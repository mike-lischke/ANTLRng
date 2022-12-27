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


import { ObjectEqualityComparator } from "./ObjectEqualityComparator";


import { JavaObject } from "../../../../../../lib/java/lang/Object";
import { S } from "../../../../../../lib/templates";
import { MurmurHash } from "../../../../../../lib/MurmurHash";


export  class Triple<A,B,C> extends JavaObject {
	public readonly  a:  A | null;
	public readonly  b:  B | null;
	public readonly  c:  C | null;

	public constructor(a: A| null, b: B| null, c: C| null) {
		super();
this.a = a;
		this.b = b;
		this.c = c;
	}

	public equals = (obj: java.lang.Object| null):  boolean => {
		if (obj === this) {
			return true;
		}
		else {
 if (!(obj instanceof Triple<unknown, unknown, unknown>)) {
			return false;
		}
}


		let  other: Triple<unknown, unknown, unknown> = obj as Triple<unknown, unknown, unknown>;
		return ObjectEqualityComparator.INSTANCE.equals(this.a, other.a)
			&& ObjectEqualityComparator.INSTANCE.equals(this.b, other.b)
			&& ObjectEqualityComparator.INSTANCE.equals(this.c, other.c);
	}

	public hashCode = ():  number => {
		let  hash: number = MurmurHash.initialize();
		hash = MurmurHash.update(hash, this.a);
		hash = MurmurHash.update(hash, this.b);
		hash = MurmurHash.update(hash, this.c);
		return MurmurHash.finish(hash, 3);
	}

	public toString = ():  java.lang.String | null => {
		return java.lang.String.format(S`(%s, %s, %s)`, this.a, this.b, this.c);
	}
}
