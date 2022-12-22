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


import { AbstractPredicateTransition } from "./AbstractPredicateTransition";
import { ATNState } from "./ATNState";
import { SemanticContext } from "./SemanticContext";
import { Transition } from "./Transition";


import { S } from "../../../../../../lib/templates";


/**
 *
 * @author Sam Harwell
 */
export  class PrecedencePredicateTransition extends AbstractPredicateTransition {
	public readonly  precedence:  number;

	public constructor(target: ATNState| null, precedence: number) {
		super(target);
		this.precedence = precedence;
	}

	public getSerializationType = ():  number => {
		return Transition.PRECEDENCE;
	}

	public isEpsilon = ():  boolean => {
		return true;
	}

	public matches = (symbol: number, minVocabSymbol: number, maxVocabSymbol: number):  boolean => {
		return false;
	}

	public getPredicate = ():  SemanticContext.PrecedencePredicate | null => {
		return new  SemanticContext..PrecedencePredicatePrecedencePredicate(this.precedence);
	}

	public toString = ():  java.lang.String | null => {
		return this.precedence + S` >= _p`;
	}

}
