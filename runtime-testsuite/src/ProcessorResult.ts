/* java2ts: keep */

/*
 * Copyright (c) 2012-2022 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

export class ProcessorResult {
    public readonly exitCode: number | null;
    public readonly output: string;
    public readonly errors: string;

    public constructor(exitCode: number | null, output: string, errors: string) {
        this.exitCode = exitCode;
        this.output = output;
        this.errors = errors;
    }

    public isSuccess(): boolean {
        return this.exitCode === null || this.exitCode === 0;
    }
}
