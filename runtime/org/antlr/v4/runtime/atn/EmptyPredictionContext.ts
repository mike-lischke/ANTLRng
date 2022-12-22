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


import { PredictionContext } from "./PredictionContext";
import { SingletonPredictionContext } from "./SingletonPredictionContext";


import { S } from "../../../../../../lib/templates";


export  class EmptyPredictionContext extends SingletonPredictionContext {
	/**
	 * Represents {@code $} in local context prediction, which means wildcard.
	 * {@code *+x = *}.
	 */
	public static readonly  Instance:  EmptyPredictionContext | null = new  EmptyPredictionContext();

	private constructor() {
		super(null, PredictionContext.EMPTY_RETURN_STATE);
	}

	public isEmpty = ():  boolean => { return true; }

	public size = ():  number => {
		return 1;
	}

	public getParent = (index: number):  PredictionContext | null => {
		return null;
	}

	public getReturnState = (index: number):  number => {
		return this.returnState;
	}

	public equals = (o: java.lang.Object| null):  boolean => {
		return this === o;
	}

	public toString = ():  java.lang.String | null => {
		return S`$`;
	}
}
