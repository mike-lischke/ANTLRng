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


import { EmptyPredictionContext } from "./EmptyPredictionContext";
import { PredictionContext } from "./PredictionContext";




export  class SingletonPredictionContext extends PredictionContext {
	public readonly  parent:  PredictionContext | null;
	public readonly  returnState:  number;

	public constructor(parent: PredictionContext| null, returnState: number) {
		super(parent !== null ? PredictionContext.calculateHashCode(parent, returnState) : PredictionContext.calculateEmptyHashCode());
		/* assert returnState!=ATNState.INVALID_STATE_NUMBER; */ 
		this.parent = parent;
		this.returnState = returnState;
	}

	public static create = (parent: PredictionContext| null, returnState: number):  SingletonPredictionContext | null => {
		if ( returnState === PredictionContext.EMPTY_RETURN_STATE && parent === null ) {
			// someone can pass in the bits of an array ctx that mean $
			return EmptyPredictionContext.Instance;
		}
		return new  SingletonPredictionContext(parent, returnState);
	}

	public size = ():  number => {
		return 1;
	}

	public getParent = (index: number):  PredictionContext | null => {
		/* assert index == 0; */ 
		return this.parent;
	}

	public getReturnState = (index: number):  number => {
		/* assert index == 0; */ 
		return this.returnState;
	}

	public equals = (o: java.lang.Object| null):  boolean => {
		if (this === o) {
			return true;
		}
		else { if ( !(o instanceof SingletonPredictionContext) ) {
			return false;
		}
}


		if ( this.hashCode() !== o.hashCode() ) {
			return false; // can't be same if hash is different
		}

		let  s: SingletonPredictionContext = o as SingletonPredictionContext;
		return this.returnState === s.returnState &&
			(this.parent!==null && this.parent.equals(s.parent));
	}

	public toString = ():  java.lang.String | null => {
		let  up: java.lang.String = this.parent!==null ? this.parent.toString() : "";
		if ( up.length()===0 ) {
			if ( this.returnState === PredictionContext.EMPTY_RETURN_STATE ) {
				return "$";
			}
			return java.lang.String.valueOf(this.returnState);
		}
		return java.lang.String.valueOf(this.returnState)+" "+up;
	}
}
