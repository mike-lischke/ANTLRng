/* java2ts: keep */

/*
 * Copyright (c) 2012-2022 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { StreamReader } from "./StreamReader.js";
import { RuntimeTestUtils } from "./RuntimeTestUtils.js";
import { ProcessorResult } from "./ProcessorResult.js";

export class Processor {
    /** Turn this on to see executed commands. */
    public static readonly WATCH_COMMANDS_EXEC = false;

    public readonly args: string[];
    public readonly workingDirectory: string;
    public readonly environmentVariables: Map<string, string>;
    public readonly throwOnNonZeroErrorCode: boolean;

    public constructor(args: string[], workingDirectory: string, environmentVariables: Map<string, string>,
        throwOnNonZeroErrorCode: boolean) {
        this.args = args;
        this.workingDirectory = workingDirectory;
        this.environmentVariables = environmentVariables;
        this.throwOnNonZeroErrorCode = throwOnNonZeroErrorCode;
    }

    public static run(args: string[], workingDirectory: string,
        environmentVariables?: Map<string, string>): ProcessorResult {
        environmentVariables ??= new Map<string, string>();

        return new Processor(args, workingDirectory, environmentVariables, true).start();
    }

    public start(): ProcessorResult {
        if (Processor.WATCH_COMMANDS_EXEC) {
            console.log("RUNNING " + this.args + " in " + this.workingDirectory);
        }

        const builder = new ProcessBuilder(this.args);
        builder.directory(this.workingDirectory);

        if (this.environmentVariables.size > 0) {
            const environment = builder.environment();
            for (const key of this.environmentVariables.keys()) {
                environment.set(key, this.environmentVariables.get(key));
            }
        }

        const process = builder.start();
        const stdoutReader = new StreamReader(process.getInputStream());
        const stderrReader = new StreamReader(process.getErrorStream());
        stdoutReader.start();
        stderrReader.start();
        process.waitFor();
        stdoutReader.join();
        stderrReader.join();

        const output = stdoutReader.toString();
        const errors = stderrReader.toString();
        if (this.throwOnNonZeroErrorCode && process.exitValue() !== 0) {
            throw new Error("Exit code " + process.exitValue() + " with output:\n" +
                RuntimeTestUtils.joinLines(output, errors));
        }

        return new ProcessorResult(process.exitValue(), output, errors);
    }
}
