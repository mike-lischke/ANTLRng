/* java2ts: keep */

/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { java } from "../../../../../../lib/java/java";

import { JavaObject } from "../../../../../../lib/java/lang/Object";
import { S } from "../../../../../../lib/templates";

/**
 *
 * @author Sam Harwell
 */
export class ATNDeserializationOptions extends JavaObject {
    private static readonly defaultOptions: ATNDeserializationOptions;

    private readOnly = false;
    private verifyATN: boolean;
    private generateRuleBypassTransitions: boolean;

    public constructor(options?: ATNDeserializationOptions) {
        super();
        this.verifyATN = options?.verifyATN ?? true;
        this.generateRuleBypassTransitions = options?.generateRuleBypassTransitions ?? false;
    }

    public static getDefaultOptions = (): ATNDeserializationOptions => {
        return ATNDeserializationOptions.defaultOptions;
    };

    public readonly isReadOnly = (): boolean => {
        return this.readOnly;
    };

    public readonly makeReadOnly = (): void => {
        this.readOnly = true;
    };

    public readonly isVerifyATN = (): boolean => {
        return this.verifyATN;
    };

    public readonly setVerifyATN = (verifyATN: boolean): void => {
        this.throwIfReadOnly();
        this.verifyATN = verifyATN;
    };

    public readonly isGenerateRuleBypassTransitions = (): boolean => {
        return this.generateRuleBypassTransitions;
    };

    public readonly setGenerateRuleBypassTransitions = (generateRuleBypassTransitions: boolean): void => {
        this.throwIfReadOnly();
        this.generateRuleBypassTransitions = generateRuleBypassTransitions;
    };

    protected throwIfReadOnly = (): void => {
        if (this.isReadOnly()) {
            throw new java.lang.IllegalStateException(S`The object is read only.`);
        }
    };

    static {
        // @ts-ignore
        ATNDeserializationOptions.defaultOptions = new ATNDeserializationOptions();
        ATNDeserializationOptions.defaultOptions.makeReadOnly();
    }
}
