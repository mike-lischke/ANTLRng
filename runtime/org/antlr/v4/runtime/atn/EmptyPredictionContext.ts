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

import { PredictionContext } from "./PredictionContext";
import { SingletonPredictionContext } from "./SingletonPredictionContext";




export  class EmptyPredictionContext extends SingletonPredictionContext {
	public constructor() {
		super(undefined, PredictionContext.EMPTY_RETURN_STATE);
	}

	public isEmpty = (): boolean => { return true; }

	public size = (): number => {
		return 1;
	}

	public getParent = (index: number): PredictionContext => {
		return undefined;
	}

	public getReturnState = (index: number): number => {
		return this.returnState;
	}

	public equals = (o: object): boolean => {
		return this === o;
	}

	public toString = (): string => {
		return "$";
	}
}
