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

import { java } from "../../../../../../lib/java/java";




/**
 *
 * @author Sam Harwell
 */
export  class ATNDeserializationOptions {
	private static readonly  defaultOptions?:  ATNDeserializationOptions;

	private readOnly:  boolean;
	private verifyATN:  boolean;
	private generateRuleBypassTransitions:  boolean;

	public constructor();

	public constructor(options: ATNDeserializationOptions);
public constructor(options?: ATNDeserializationOptions) {
if (options === undefined) {
		this.verifyATN = true;
		this.generateRuleBypassTransitions = false;
	}
 else  {
		this.verifyATN = options.verifyATN;
		this.generateRuleBypassTransitions = options.generateRuleBypassTransitions;
	}

}



	public static getDefaultOptions = (): ATNDeserializationOptions => {
		return ATNDeserializationOptions.defaultOptions;
	}

	public readonly  isReadOnly = (): boolean => {
		return this.readOnly;
	}

	public readonly  makeReadOnly = (): void => {
		this.readOnly = true;
	}

	public readonly  isVerifyATN = (): boolean => {
		return this.verifyATN;
	}

	public readonly  setVerifyATN = (verifyATN: boolean): void => {
		this.throwIfReadOnly();
		this.verifyATN = verifyATN;
	}

	public readonly  isGenerateRuleBypassTransitions = (): boolean => {
		return this.generateRuleBypassTransitions;
	}

	public readonly  setGenerateRuleBypassTransitions = (generateRuleBypassTransitions: boolean): void => {
		this.throwIfReadOnly();
		this.generateRuleBypassTransitions = generateRuleBypassTransitions;
	}

	protected throwIfReadOnly = (): void => {
		if (this.isReadOnly()) {
			throw new  java.lang.IllegalStateException("The object is read only.");
		}
	}
	static {
		ATNDeserializationOptions.defaultOptions = new  ATNDeserializationOptions();
		ATNDeserializationOptions.defaultOptions.makeReadOnly();
	}
}
