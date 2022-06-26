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





export  class SingletonPredictionContext extends PredictionContext {
	public readonly  parent?:  PredictionContext;
	public readonly  returnState:  number;

	public constructor(parent: PredictionContext, returnState: number) {
		super(parent !== undefined ? PredictionContext.calculateHashCode(parent, returnState) : PredictionContext.calculateEmptyHashCode());
		/* assert returnState!=ATNState.INVALID_STATE_NUMBER; */ 
		this.parent = parent;
		this.returnState = returnState;
	}

	public static create = (parent: PredictionContext, returnState: number): SingletonPredictionContext => {
		if ( returnState === PredictionContext.EMPTY_RETURN_STATE && parent === undefined ) {
			// someone can pass in the bits of an array ctx that mean $
			return PredictionContext.EMPTY;
		}
		return new  SingletonPredictionContext(parent, returnState);
	}

	public size = (): number => {
		return 1;
	}

	public getParent = (index: number): PredictionContext => {
		/* assert index == 0; */ 
		return this.parent;
	}

	public getReturnState = (index: number): number => {
		/* assert index == 0; */ 
		return this.returnState;
	}

	public equals = (o: object): boolean => {
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
			(this.parent!==undefined && this.parent.equals(s.parent));
	}

	public toString = (): string => {
		let  up: string = this.parent!==undefined ? this.parent.toString() : "";
		if ( up.length===0 ) {
			if ( this.returnState === PredictionContext.EMPTY_RETURN_STATE ) {
				return "$";
			}
			return String(this.returnState);
		}
		return String(this.returnState)+" "+up;
	}
}
