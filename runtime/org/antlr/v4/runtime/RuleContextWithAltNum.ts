/* java2ts: keep */

/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { ParserRuleContext } from "./ParserRuleContext";
import { ATN } from "./atn/ATN";

/**
 * A handy class for use with
 *
 *  options {contextSuperClass=org.antlr.v4.runtime.RuleContextWithAltNum;}
 *
 *  that provides a backing field / impl for the outer alternative number
 *  matched for an internal parse tree node.
 *
 *  I'm only putting into Java runtime as I'm certain I'm the only one that
 *  will really every use this.
 */
export class RuleContextWithAltNum extends ParserRuleContext {
    public altNum = 0;

    public constructor();
    public constructor(parent: ParserRuleContext | null, invokingStateNumber: number);
    public constructor(...args: unknown[]) {
        let parent: ParserRuleContext | null = null;
        let invokingStateNumber = 0;

        if (args.length === 2) {
            parent = args[0] as ParserRuleContext | null;
            invokingStateNumber = args[1] as number;
        }

        super(parent, invokingStateNumber);

        if (args.length === 0) {
            this.altNum = ATN.INVALID_ALT_NUMBER;
        }
    }

    public getAltNumber = (): number => { return this.altNum; };
    public setAltNumber = (altNum: number): void => { this.altNum = altNum; };
}
