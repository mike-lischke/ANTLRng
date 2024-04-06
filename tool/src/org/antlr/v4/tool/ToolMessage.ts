/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/* eslint-disable jsdoc/require-returns, jsdoc/require-param */

import { ErrorType } from "./ErrorType.js";
import { ANTLRMessage } from "./ANTLRMessage.js";

/**
 * A generic message from the tool such as "file not found" type errors; there
 *  is no reason to create a special object for each error unlike the grammar
 *  errors, which may be rather complex.
 *
 *  Sometimes you need to pass in a filename or something to say it is "bad".
 *  Allow a generic object to be passed in and the string template can deal
 *  with just printing it or pulling a property out of it.
 */
export class ToolMessage extends ANTLRMessage {
    public constructor(errorType: ErrorType);
    public constructor(errorType: ErrorType, ...args: Object[]);
    public constructor(errorType: ErrorType, e: Throwable, ...args: Object[]);
    public constructor(...args: unknown[]) {
        switch (args.length) {
            case 1: {
                const [errorType] = args as [ErrorType];

                super(errorType);

                break;
            }

            case 2: {
                const [errorType, args] = args as [ErrorType, Object[]];

                super(errorType, null, Token.INVALID_TOKEN, this.args);

                break;
            }

            case 3: {
                const [errorType, e, args] = args as [ErrorType, Throwable, Object[]];

                super(errorType, e, Token.INVALID_TOKEN, this.args);

                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }

}
