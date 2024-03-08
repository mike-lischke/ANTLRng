/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */


/* eslint-disable jsdoc/require-returns, jsdoc/require-param */


import { Grammar } from "./Grammar.js";
import { ErrorType } from "./ErrorType.js";



export  class ANTLRMessage {
	private static readonly  EMPTY_ARGS = new  Array<Object>(0);

    // used for location template
    public  fileName:  string;
    public  line = -1;
    public  charPosition = -1;

	public  g:  Grammar;
	/** Most of the time, we'll have a token such as an undefined rule ref
     *  and so this will be set.
     */
    public  offendingToken:  Token;


    private readonly  errorType:  ErrorType;

    private readonly  args:  Object[];

    private readonly  e:  Throwable;

	public  constructor(errorType: ErrorType);

    public  constructor(errorType: ErrorType, offendingToken: Token,... args: Object[]);

    public  constructor(errorType: ErrorType, e: Throwable, offendingToken: Token,... args: Object[]);
    public constructor(...args: unknown[]) {
		switch (args.length) {
			case 1: {
				const [errorType] = args as [ErrorType];


        this(errorType, null as Throwable, Token.INVALID_TOKEN);
    

				break;
			}

			case 3: {
				const [errorType, offendingToken, args] = args as [ErrorType, Token, Object[]];


        this(errorType, null, offendingToken, this.args);
	

				break;
			}

			case 4: {
				const [errorType, e, offendingToken, args] = args as [ErrorType, Throwable, Token, Object[]];


        this.errorType = errorType;
        this.e = e;
        this.args = this.args;
		this.offendingToken = offendingToken;
    

				break;
			}

			default: {
				throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
			}
		}
	}



    public  getErrorType():  ErrorType {
        return this.errorType;
    }


    public  getArgs():  Object[] {
		if (this.args === null) {
			return ANTLRMessage.EMPTY_ARGS;
		}

		return this.args;
    }

	public  getMessageTemplate(verbose: boolean):  ST {
		let  messageST = new  ST(this.getErrorType().msg);
		messageST.impl.name = this.errorType.name();

		messageST.add("verbose", verbose);
		let  args = this.getArgs();
		for (let  i=0; i<args.length; i++) {
			let  attr = "arg";
			if ( i>0 ) {
 attr += i + 1;
}

			messageST.add(attr, args[i]);
		}
		if ( args.length<2 ) {
 messageST.add("arg2", null);
}
 // some messages ref arg2

		let  cause = this.getCause();
		if ( cause!==null ) {
			messageST.add("exception", cause);
			messageST.add("stackTrace", cause.getStackTrace());
		}
		else {
			messageST.add("exception", null); // avoid ST error msg
			messageST.add("stackTrace", null);
		}

		return messageST;
	}


    public  getCause():  Throwable {
        return this.e;
    }

	@Override
public override  toString():  string {
		return "Message{" +
			   "errorType=" + this.getErrorType() +
			   ", args=" + Arrays.asList(this.getArgs()) +
			   ", e=" + this.getCause() +
			   ", fileName='" + this.fileName + '\'' +
			   ", line=" + this.line +
			   ", charPosition=" + this.charPosition +
			   '}';
	}
}
