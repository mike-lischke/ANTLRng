/* java2ts: keep */

/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { java } from "../../../../../../lib/java/java";

/**
 * This exception is thrown to cancel a parsing operation. This exception does
 * not extend {@link RecognitionException}, allowing it to bypass the standard
 * error recovery mechanisms. {@link BailErrorStrategy} throws this exception in
 * response to a parse error.
 *
 * @author Sam Harwell
 */
export class ParseCancellationException extends java.util.concurrent.CancellationException {

    public constructor(cause: java.lang.Throwable);
    public constructor(message?: java.lang.String, cause?: java.lang.Throwable);
    public constructor(messageOrCause?: java.lang.String | java.lang.Throwable, cause?: java.lang.Throwable) {
        if (messageOrCause === undefined) {
            super();
        } else if (messageOrCause instanceof java.lang.String) {
            super(messageOrCause, cause);
        } else {
            super(messageOrCause);
        }
    }
}
