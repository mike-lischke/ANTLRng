/* java2ts: keep */

/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/* eslint-disable no-underscore-dangle */

import { java, S } from "jree";
import { Parser } from "./Parser";
import { RecognitionException } from "./RecognitionException";
import { AbstractPredicateTransition } from "./atn/AbstractPredicateTransition";
import { PredicateTransition } from "./atn/PredicateTransition";

/**
 * A semantic predicate failed during validation.  Validation of predicates
 *  occurs when normally parsing the alternative just like matching a token.
 *  Disambiguating predicate evaluation occurs when we test a predicate during
 *  prediction.
 */
export class FailedPredicateException extends RecognitionException {
    private readonly ruleIndex: number = 0;
    private readonly predicateIndex: number = 0;
    private readonly predicate: java.lang.String | null;

    public constructor(recognizer: Parser, predicate: java.lang.String | null, message: java.lang.String | null) {
        super(FailedPredicateException.formatMessage(predicate ?? null, message ?? null), recognizer,
            recognizer.getInputStream(), recognizer._ctx);
        const s = recognizer.getInterpreter()!.atn.states.get(recognizer.getState());
        const trans = s?.transition(0) as AbstractPredicateTransition;
        if (trans instanceof PredicateTransition) {
            this.ruleIndex = trans.ruleIndex;
            this.predicateIndex = trans.predIndex;
        }

        this.predicate = predicate;
        this.setOffendingToken(recognizer.getCurrentToken());
    }

    private static formatMessage = (predicate: java.lang.String | null,
        message: java.lang.String | null): java.lang.String => {
        if (message !== null) {
            return message;
        }

        return java.lang.String.format(java.util.Locale.getDefault(), S`failed predicate: {%s}?`, predicate);
    };

    public getRuleIndex = (): number => {
        return this.ruleIndex;
    };

    public getPredIndex = (): number => {
        return this.predicateIndex;
    };

    public getPredicate = (): java.lang.String | null => {
        return this.predicate;
    };

}
