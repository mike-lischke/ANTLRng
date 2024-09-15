/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/** */
export class v4ParserException extends RecognitionException {
    public msg: string;
    /** Used for remote debugger deserialization */
    public constructor();

    public constructor(msg: string, input: java.util.stream.IntStream);
    public constructor(...args: unknown[]) {
        switch (args.length) {
            case 0: {

                break;
            }

            case 2: {
                const [msg, input] = args as [string, java.util.stream.IntStream];

                super(input);
                this.msg = msg;

                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }

}
