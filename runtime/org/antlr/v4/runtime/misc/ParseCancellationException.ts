/* java2ts: keep */

/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { java, S } from "jree";

/**
 * This exception is thrown to cancel a parsing operation. This exception does
 * not extend {@link RecognitionException}, allowing it to bypass the standard
 * error recovery mechanisms. {@link BailErrorStrategy} throws this exception in
 * response to a parse error.
 *
 * @author Sam Harwell
 */
export class ParseCancellationException extends java.util.concurrent.CancellationException {

    public constructor();
    public constructor(message: java.lang.String);
    public constructor(cause: java.lang.Throwable);
    public constructor(message: java.lang.String, cause: java.lang.Throwable);
    public constructor(...args: unknown[]) {
        switch (args.length) {
            case 0: {
                super();

                break;
            }

            case 1: {
                if (args[0] instanceof java.lang.String) {
                    const [message] = args;
                    super(message);

                    break;
                }

                const [cause] = args as [java.lang.Throwable];
                super(cause);

                break;
            }

            case 2: {
                const [message, cause] = args as [java.lang.String, java.lang.Throwable];
                super(message, cause);

                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }
}
