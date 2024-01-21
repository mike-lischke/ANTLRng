/* java2ts: keep */

/*
 * Copyright (c) 2012-2022 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { RuntimeTestUtils } from "./RuntimeTestUtils.js";
import { ProcessorResult } from "./ProcessorResult.js";
import { ProcessEnvOptions, spawn } from "child_process";

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
        environmentVariables?: Map<string, string>): Promise<ProcessorResult> {
        environmentVariables ??= new Map<string, string>();

        return new Processor(args, workingDirectory, environmentVariables, true).start();
    }

    public start(): Promise<ProcessorResult> {
        return new Promise<ProcessorResult>((resolve, reject) => {
            if (Processor.WATCH_COMMANDS_EXEC) {
                console.log("RUNNING " + this.args + " in " + this.workingDirectory);
            }

            const spawnOptions: ProcessEnvOptions = { cwd: this.workingDirectory };
            if (this.environmentVariables.size > 0) {
                spawnOptions.env = {};
                this.environmentVariables.forEach((value, key) => {
                    spawnOptions.env![key] = value;
                });
            }
            const java = spawn("java", this.args, spawnOptions);

            const out: string[] = [];
            const err: string[] = [];

            java.stderr.on("data", (data: Buffer) => {
                err.push(data.toString());
            });

            java.stdout.on("data", (data: Buffer) => {
                out.push(data.toString());
            });

            java.on("exit", (code: number | null, signal: string | null) => {
                const output = out.join("");
                const errors = err.join("");
                if (this.throwOnNonZeroErrorCode && java.exitCode !== 0) {
                    throw new Error("Exit code " + java.exitCode + " with output:\n" +
                        RuntimeTestUtils.joinLines(output, errors));
                }

                resolve(new ProcessorResult(java.exitCode, output, errors));
            });
        });
    }
}
