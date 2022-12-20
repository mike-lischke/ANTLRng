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




import { JavaObject } from "../../../../../../lib/java/lang/Object";


/**
 *
 * @author Sam Harwell
 */
export  class ATNDeserializationOptions extends JavaObject {
	private static readonly  defaultOptions:  ATNDeserializationOptions | null;

	private readOnly:  boolean;
	private verifyATN:  boolean;
	private generateRuleBypassTransitions:  boolean;

	public constructor();

	public constructor(options: ATNDeserializationOptions| null);
public constructor(options?: ATNDeserializationOptions | null) {
if (options === undefined) {
		super();
this.verifyATN = true;
		this.generateRuleBypassTransitions = false;
	}
 else  {
		super();
this.verifyATN = options.verifyATN;
		this.generateRuleBypassTransitions = options.generateRuleBypassTransitions;
	}

}



	public static getDefaultOptions = ():  ATNDeserializationOptions | null => {
		return ATNDeserializationOptions.defaultOptions;
	}

	public readonly  isReadOnly = ():  boolean => {
		return this.readOnly;
	}

	public readonly  makeReadOnly = ():  void => {
		this.readOnly = true;
	}

	public readonly  isVerifyATN = ():  boolean => {
		return this.verifyATN;
	}

	public readonly  setVerifyATN = (verifyATN: boolean):  void => {
		this.throwIfReadOnly();
		this.verifyATN = verifyATN;
	}

	public readonly  isGenerateRuleBypassTransitions = ():  boolean => {
		return this.generateRuleBypassTransitions;
	}

	public readonly  setGenerateRuleBypassTransitions = (generateRuleBypassTransitions: boolean):  void => {
		this.throwIfReadOnly();
		this.generateRuleBypassTransitions = generateRuleBypassTransitions;
	}

	protected throwIfReadOnly = ():  void => {
		if (this.isReadOnly()) {
			throw new  java.lang.IllegalStateException("The object is read only.");
		}
	}
	static {
		ATNDeserializationOptions.defaultOptions = new  ATNDeserializationOptions();
		ATNDeserializationOptions.defaultOptions.makeReadOnly();
	}
}
