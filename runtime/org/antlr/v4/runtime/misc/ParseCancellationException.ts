/* java2ts: keep */

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

    public constructor();
    public constructor(message: string);
    public constructor(cause: java.lang.Throwable);
    public constructor(message: string, cause: java.lang.Throwable);
    public constructor(messageOrCause?: string | java.lang.Throwable, cause?: java.lang.Throwable) {
        if (messageOrCause === undefined) {
            super();
        } else if (typeof messageOrCause === "string" && cause === undefined) {
            const message = messageOrCause;
            super(message);
        } else if (messageOrCause instanceof java.lang.Throwable && cause === undefined) {
            const cause = messageOrCause;
            super(cause);
        } else {
            const message = messageOrCause as string;
            super(message, cause);
        }
    }
}
