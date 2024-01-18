/* java2ts: keep */

/*
 * Copyright (c) 2012-2022 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { JavaObject, type int, java } from "jree";

export class ProcessorResult extends JavaObject {
    public readonly exitCode: int;
    public readonly output: java.lang.String;
    public readonly errors: java.lang.String;

    public constructor(exitCode: int, output: java.lang.String, errors: java.lang.String) {
        super();
        this.exitCode = exitCode;
        this.output = output;
        this.errors = errors;
    }

    public isSuccess(): boolean {
        return this.exitCode === 0;
    }
}
