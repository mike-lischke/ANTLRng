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

import { AbstractPredicateTransition } from "./AbstractPredicateTransition";
import { ATNState } from "./ATNState";
import { SemanticContext } from "./SemanticContext";




/** TODO: this is old comment:
 *  A tree of semantic predicates from the grammar AST if label==SEMPRED.
 *  In the ATN, labels will always be exactly one predicate, but the DFA
 *  may have to combine a bunch of them as it collects predicates from
 *  multiple ATN configurations into a single DFA state.
 */
export  class PredicateTransition extends AbstractPredicateTransition {
	public readonly  ruleIndex:  number;
	public readonly  predIndex:  number;
	public readonly  isCtxDependent:  boolean;  // e.g., $i ref in pred

	public constructor(target: ATNState, ruleIndex: number, predIndex: number, isCtxDependent: boolean) {
		super(target);
		this.ruleIndex = ruleIndex;
		this.predIndex = predIndex;
		this.isCtxDependent = isCtxDependent;
	}

	public getSerializationType = (): number => {
		return Transition.PREDICATE;
	}

	public isEpsilon = (): boolean => { return true; }

	public matches = (symbol: number, minVocabSymbol: number, maxVocabSymbol: number): boolean => {
		return false;
	}

    public getPredicate = (): SemanticContext.Predicate => {
   		return new  SemanticContext..PredicatePredicate(this.ruleIndex, this.predIndex, this.isCtxDependent);
   	}

	public toString = (): string => {
		return "pred_"+this.ruleIndex+":"+this.predIndex;
	}

}
