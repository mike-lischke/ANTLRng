/* java2ts: keep */

/*
 * Copyright (c) 2012-2022 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { StreamReader } from "./StreamReader";
import { RuntimeTestUtils } from "./RuntimeTestUtils";
import { ProcessorResult } from "./ProcessorResult";

export class Processor {
    /**
     * Turn this on to see output like:
     *  RUNNING cmake . -DCMAKE_BUILD_TYPE=Release in /Users/parrt/antlr/code/antlr4/runtime/Cpp
     *  RUNNING make -j 20 in /Users/parrt/antlr/code/antlr4/runtime/Cpp
     *  RUNNING ln -s /Users/parrt/antlr/code/antlr4/runtime/Cpp/dist/libantlr4-runtime.dylib in /var/folders/w1/_nr4stn13lq0rvjdkwh7q8cc0000gn/T/CppRunner-ForkJoinPool-1-worker-23-1668284191961
     *  RUNNING clang++ -std=c++17 -I /Users/parrt/antlr/code/antlr4/runtime/Cpp/runtime/src -L. -lantlr4-runtime -pthread -o Test.out Test.cpp TLexer.cpp TParser.cpp TListener.cpp TBaseListener.cpp TVisitor.cpp TBaseVisitor.cpp in /var/folders/w1/_nr4stn13lq0rvjdkwh7q8cc0000gn/T/CppRunner-ForkJoinPool-1-worker-23-1668284191961
     */
    public static readonly WATCH_COMMANDS_EXEC = false;
    public readonly args: string[];
    public readonly workingDirectory: string;
    public readonly environmentVariables: Map<string, string>;
    public readonly throwOnNonZeroErrorCode: boolean;

    public static run(args: string[], workingDirectory: string): ProcessorResult;
    public static run(args: string[], workingDirectory: string,
        environmentVariables: Map<string, string>): ProcessorResult;
    public static run(...args: unknown[]): ProcessorResult {
        switch (args.length) {
            case 2: {
                const [args, workingDirectory] = args as [string[], string];

                return new Processor(args, workingDirectory, new java.util.HashMap(), true).start();

                break;
            }

            case 3: {
                const [args, workingDirectory, environmentVariables] = args as [string[], string, Map<string, string>];

                return new Processor(args, workingDirectory, environmentVariables, true).start();

                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of args`);
            }
        }
    }

    public constructor(args: string[], workingDirectory: string, environmentVariables: Map<string, string>,
        throwOnNonZeroErrorCode: boolean) {
        super();
        this.args = args;
        this.workingDirectory = workingDirectory;
        this.environmentVariables = environmentVariables;
        this.throwOnNonZeroErrorCode = throwOnNonZeroErrorCode;
    }

    public start(): ProcessorResult {
        if (Processor.WATCH_COMMANDS_EXEC) {
            java.lang.System.out.println("RUNNING " + string.join(" ", this.args) + " in " + this.workingDirectory);
        }
        const builder = new java.lang.ProcessBuilder(this.args);
        if (this.workingDirectory !== null) {
            builder.directory(new java.io.File(this.workingDirectory));
        }
        if (this.environmentVariables !== null && this.environmentVariables.size() > 0) {
            const environment = builder.environment();
            for (const key of this.environmentVariables.keySet()) {
                environment.put(key, this.environmentVariables.get(key));
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
            throw new java.lang.InterruptedException("Exit code " + process.exitValue() + " with output:\n" + RuntimeTestUtils.joinLines(output, errors));
        }

        return new ProcessorResult(process.exitValue(), output, errors);
    }
}
