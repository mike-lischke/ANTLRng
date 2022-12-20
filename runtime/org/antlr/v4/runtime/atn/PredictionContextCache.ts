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
import { EmptyPredictionContext } from "./EmptyPredictionContext";
import { PredictionContext } from "./PredictionContext";


import { JavaObject } from "../../../../../../lib/java/lang/Object";


/** Used to cache {@link PredictionContext} objects. Its used for the shared
 *  context cash associated with contexts in DFA states. This cache
 *  can be used for both lexers and parsers.
 */
export  class PredictionContextCache extends JavaObject {
	protected readonly  cache:  java.util.Map<PredictionContext, PredictionContext> | null =
		new  java.util.HashMap<PredictionContext, PredictionContext>();

	/** Add a context to the cache and return it. If the context already exists,
	 *  return that one instead and do not add a new context to the cache.
	 *  Protect shared cache from unsafe thread access.
	 */
	public add = (ctx: PredictionContext| null):  PredictionContext | null => {
		if ( ctx===EmptyPredictionContext.Instance ) {
 return EmptyPredictionContext.Instance;
}

		let  existing: PredictionContext = this.cache.get(ctx);
		if ( existing!==null ) {
//			System.out.println(name+" reuses "+existing);
			return existing;
		}
		this.cache.put(ctx, ctx);
		return ctx;
	}

	public get = (ctx: PredictionContext| null):  PredictionContext | null => {
		return this.cache.get(ctx);
	}

	public size = ():  number => {
		return this.cache.size();
	}
}
