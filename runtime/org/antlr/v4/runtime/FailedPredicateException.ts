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



import { java } from "../../../../../lib/java/java";
import { Parser } from "./Parser";
import { RecognitionException } from "./RecognitionException";
import { ATNState } from "./atn/ATNState";
import { AbstractPredicateTransition } from "./atn/AbstractPredicateTransition";
import { PredicateTransition } from "./atn/PredicateTransition";




/** A semantic predicate failed during validation.  Validation of predicates
 *  occurs when normally parsing the alternative just like matching a token.
 *  Disambiguating predicate evaluation occurs when we test a predicate during
 *  prediction.
 */
export  class FailedPredicateException extends RecognitionException {
	private readonly  ruleIndex:  number;
	private readonly  predicateIndex:  number;
	private readonly  predicate?:  string;

	/* eslint-disable constructor-super, @typescript-eslint/no-unsafe-call */
public constructor(recognizer: Parser);

	public constructor(recognizer: Parser, predicate: string);

	public constructor(recognizer: Parser,
									predicate: string,
									message: string);
/* @ts-expect-error, because of the super() call in the closure. */
public constructor(recognizer: Parser, predicate?: string, message?: string) {
const $this = (recognizer: Parser, predicate?: string, message?: string): void => {
if (predicate === undefined) {
		$this(recognizer, undefined);
	}
 else if (typeof predicate === "string" && message === undefined) {
		$this(recognizer, predicate, undefined);
	}
 else 
	{

/* @ts-expect-error, because of the super() call in the closure. */
		super(FailedPredicateException.formatMessage(predicate, message), recognizer, recognizer.getInputStream(), recognizer._ctx);
		let  s: ATNState = recognizer.getInterpreter().atn.states.get(recognizer.getState());

		let  trans: AbstractPredicateTransition = s.transition(0) as AbstractPredicateTransition;
		if (trans instanceof PredicateTransition) {
			this.ruleIndex = (trans as PredicateTransition).ruleIndex;
			this.predicateIndex = (trans as PredicateTransition).predIndex;
		}
		else {
			this.ruleIndex = 0;
			this.predicateIndex = 0;
		}

		this.predicate = predicate;
		this.setOffendingToken(recognizer.getCurrentToken());
	}
};

$this(recognizer, predicate, message);

}
/* eslint-enable constructor-super, @typescript-eslint/no-unsafe-call */

	public getRuleIndex = (): number => {
		return this.ruleIndex;
	}

	public getPredIndex = (): number => {
		return this.predicateIndex;
	}


	public getPredicate = (): string => {
		return this.predicate;
	}


	private static formatMessage = (predicate: string, message: string): string => {
		if (message !== undefined) {
			return message;
		}

		return string.format(java.util.Locale.getDefault(), "failed predicate: {%s}?", predicate);
	}
}
