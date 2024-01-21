/* java2ts: keep */

/*
 * Copyright (c) 2012-2022 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import * as os from "os";
import path from "path";
import fs from "fs";

import { Stage } from "./Stage.js";
import { RuntimeTestUtils } from "./RuntimeTestUtils.js";
import { RunOptions } from "./RunOptions.js";
import { ProcessorResult } from "./ProcessorResult.js";
import { Generator } from "./Generator.js";
import { GeneratedFile } from "./GeneratedFile.js";
import { FileUtils } from "./FileUtils.js";
import { CompiledState } from "./states/CompiledState.js";
import { ExecutedState } from "./states/ExecutedState.js";
import { GeneratedState } from "./states/GeneratedState.js";
import { ST } from "stringtemplate4ts";
import { Processor } from "./Processor.js";
import { State } from "./states/State.js";

export abstract class RuntimeRunner {
    public static readonly InputFileName = "input";
    public static readonly cacheDirectory = os.tmpdir();

    private static runtimeToolPath = "";
    private static compilerPath = "";

    private static readonly runtimeInitializationStatuses =
        new Map<string, { isInitialized?: boolean; exception?: Error; }>();

    protected readonly tempTestDir: string;

    private saveTestDir: boolean;

    public constructor(tempDir?: string, saveTestDir?: boolean) {
        if (!tempDir) {
            const dirName = this.constructor.name + "-" + new Date().getTime();
            this.tempTestDir = path.join(RuntimeTestUtils.TempDirectory, dirName);
        }
        else {
            this.tempTestDir = tempDir;
        }
        this.saveTestDir = saveTestDir ?? false;
    }

    public static getCachePath(language: string): string {
        return path.join(RuntimeRunner.cacheDirectory, language);
    }

    public static getRuntimePath(language: string): string {
        return path.join(RuntimeTestUtils.runtimePath, language);
    }

    public getTempDirPath(): string {
        return this.tempTestDir.toString();
    }

    public setSaveTestDir(saveTestDir: boolean): void {
        this.saveTestDir = saveTestDir;
    }

    public close(): void {
        this.removeTempTestDirIfRequired();
    }

    public run(runOptions: RunOptions): Promise<State> {
        const options: string[] = [];
        if (runOptions.useVisitor) {
            options.push("-visitor");
        }
        if (runOptions.superClass !== null && runOptions.superClass.length > 0) {
            options.push("-DsuperClass=" + runOptions.superClass);
        }

        // See if the target wants to add tool options.
        const targetOpts = this.getTargetToolOptions(runOptions);
        if (targetOpts !== null) {
            options.push(...targetOpts);
        }

        const errorQueue = Generator.antlrOnString(this.getTempDirPath(), this.getLanguage(),
            runOptions.grammarFileName, runOptions.grammarStr, false, options);

        const generatedFiles = this.getGeneratedFiles(runOptions);
        const generatedState = new GeneratedState(errorQueue, generatedFiles, null);

        if (generatedState.containsErrors() || runOptions.endStage === Stage.Generate) {
            return Promise.resolve(generatedState);
        }

        if (!this.initAntlrRuntimeIfRequired(runOptions)) {
            // Do not repeat ANTLR runtime initialization error
            return Promise.resolve(new CompiledState(generatedState,
                new Error(this.getTitleName() + " ANTLR runtime is not initialized")));
        }

        this.writeRecognizerFile(runOptions);

        const compiledState = this.compile(runOptions, generatedState);

        if (compiledState.containsErrors() || runOptions.endStage === Stage.Compile) {
            return Promise.resolve(compiledState);
        }

        this.writeInputFile(runOptions);

        return this.execute(runOptions, compiledState);
    }

    protected getExtension(): string { return this.getLanguage().toLowerCase(); }

    protected getTitleName(): string { return this.getLanguage(); }

    protected getTestFileName(): string { return "Test"; }

    protected getLexerSuffix(): string { return "Lexer"; }

    protected getParserSuffix(): string { return "Parser"; }

    protected getBaseListenerSuffix(): string | null { return "BaseListener"; }

    protected getListenerSuffix(): string { return "Listener"; }

    protected getBaseVisitorSuffix(): string | null { return "BaseVisitor"; }

    protected getVisitorSuffix(): string { return "Visitor"; }

    protected grammarNameToFileName(grammarName: string | null): string { return String(grammarName); }

    protected getCompilerPath(): string {
        if (RuntimeRunner.compilerPath.length === 0) {
            RuntimeRunner.compilerPath = this.getCompilerName();
            if (RuntimeRunner.compilerPath.length > 0) {
                const compilerPathFromProperty = process.env[this.getPropertyPrefix() + "-compiler"];
                if (compilerPathFromProperty && compilerPathFromProperty.length > 0) {
                    RuntimeRunner.compilerPath = compilerPathFromProperty;
                }
            }
        }

        return RuntimeRunner.compilerPath;
    }

    protected getRuntimeToolPath(): string {
        if (RuntimeRunner.runtimeToolPath.length === 0) {
            RuntimeRunner.runtimeToolPath = this.getRuntimeToolName();
            if (RuntimeRunner.runtimeToolPath.length > 0) {
                const runtimeToolPathFromProperty = process.env[this.getPropertyPrefix() + "-exec"];
                if (runtimeToolPathFromProperty && runtimeToolPathFromProperty.length > 0) {
                    RuntimeRunner.runtimeToolPath = runtimeToolPathFromProperty;
                }
            }
        }

        return RuntimeRunner.runtimeToolPath;
    }

    protected getCompilerName(): string { return ""; }

    protected getRuntimeToolName(): string { return this.getLanguage().toLowerCase(); }

    protected getTestFileWithExt(): string { return this.getTestFileName() + "." + this.getExtension(); }

    protected getExecFileName(): string { return this.getTestFileWithExt(); }

    protected getExtraRunArgs(): string[] { return []; }

    protected getExecEnvironment(): Map<string, string> { return new Map(); }

    protected getPropertyPrefix(): string {
        return "antlr-" + this.getLanguage().toLowerCase();
    }

    // Allows any target to add additional options for the antlr tool such as the location of the output files
    // which is useful for the Go target for instance to avoid having to move them before running the test
    //
    protected getTargetToolOptions(ro: RunOptions): string[] | null {
        return null;
    }

    protected getGeneratedFiles(runOptions: RunOptions): GeneratedFile[] {
        const files: GeneratedFile[] = [];
        const extensionWithDot = "." + this.getExtension();
        const fileGrammarName = this.grammarNameToFileName(runOptions.grammarName);
        const isCombinedGrammarOrGo = (runOptions.lexerName !== null && runOptions.parserName !== null)
            || this.getLanguage() === "Go";
        if (runOptions.lexerName !== null) {
            files.push(new GeneratedFile(fileGrammarName + (isCombinedGrammarOrGo ? this.getLexerSuffix() : "") +
                extensionWithDot, false));
        }

        if (runOptions.parserName !== null) {
            files.push(new GeneratedFile(fileGrammarName + (isCombinedGrammarOrGo ? this.getParserSuffix() : "") +
                extensionWithDot, true));
            if (runOptions.useListener) {
                files.push(new GeneratedFile(fileGrammarName + this.getListenerSuffix() + extensionWithDot, true));
                const baseListenerSuffix = this.getBaseListenerSuffix();
                if (baseListenerSuffix !== null) {
                    files.push(new GeneratedFile(fileGrammarName + baseListenerSuffix + extensionWithDot, true));
                }
            }
            if (runOptions.useVisitor) {
                files.push(new GeneratedFile(fileGrammarName + this.getVisitorSuffix() + extensionWithDot, true));
                const baseVisitorSuffix = this.getBaseVisitorSuffix();
                if (baseVisitorSuffix !== null) {
                    files.push(new GeneratedFile(fileGrammarName + baseVisitorSuffix + extensionWithDot, true));
                }
            }
        }

        return files;
    }

    protected writeRecognizerFile(runOptions: RunOptions): void {
        const text = RuntimeTestUtils.getTextFromResource("runtime-testsuite/test/runtime/helpers/" +
            this.getTestFileWithExt() + ".stg");
        const outputFileST = new ST(text);
        outputFileST.add("grammarName", runOptions.grammarName);
        outputFileST.add("lexerName", runOptions.lexerName);
        outputFileST.add("parserName", runOptions.parserName);
        outputFileST.add("parserStartRuleName", this.grammarParseRuleToRecognizerName(runOptions.startRuleName ?? ""));
        outputFileST.add("showDiagnosticErrors", runOptions.showDiagnosticErrors);
        outputFileST.add("traceATN", runOptions.traceATN);
        outputFileST.add("profile", runOptions.profile);
        outputFileST.add("showDFA", runOptions.showDFA);
        outputFileST.add("useListener", runOptions.useListener);
        outputFileST.add("useVisitor", runOptions.useVisitor);
        outputFileST.add("predictionMode", runOptions.predictionMode);
        outputFileST.add("buildParseTree", runOptions.buildParseTree);
        this.addExtraRecognizerParameters(outputFileST);
        FileUtils.writeFile(this.getTempDirPath(), this.getTestFileWithExt(), outputFileST.render());
    }

    protected grammarParseRuleToRecognizerName(startRuleName: string): string {
        return startRuleName;
    }

    protected addExtraRecognizerParameters(template: ST): void {
    }

    protected initRuntime(runOptions: RunOptions): void {
    }

    protected compile(runOptions: RunOptions, generatedState: GeneratedState): CompiledState {
        return new CompiledState(generatedState, null);
    }

    protected writeInputFile(runOptions: RunOptions): void {
        FileUtils.writeFile(this.getTempDirPath(), RuntimeRunner.InputFileName, runOptions.input);
    }

    protected async execute(runOptions: RunOptions, compiledState: CompiledState): Promise<ExecutedState> {
        let output = null;
        let errors = null;
        let exception: Error | null = null;
        try {
            const args: string[] = [];
            const runtimeToolPath = this.getRuntimeToolPath();
            if (runtimeToolPath !== null) {
                args.push(runtimeToolPath);
            }
            const extraRunArgs = this.getExtraRunArgs();
            if (extraRunArgs !== null) {
                args.push(...extraRunArgs);
            }

            args.push(this.getExecFileName());
            args.push(RuntimeRunner.InputFileName);

            const result = await Processor.run(args, this.getTempDirPath(), this.getExecEnvironment());
            output = result.output;
            errors = result.errors;
        } catch (e) {
            // Tricky: we don't get these exceptions in TS, so when should we throw?
            /*if (e instanceof InterruptedException || e instanceof IOException) {
                exception = e;
            } else {
                throw e;
            }*/
            if (e instanceof Error) {
                exception = e;
            } else {
                throw e;
            }
        }

        return new ExecutedState(compiledState, output, errors, exception);
    }

    protected async runCommand(command: string[], workPath: string, description?: string): Promise<ProcessorResult> {
        const cmd = command.join(" ");
        try {
            return await Processor.run(command, workPath);
        } catch (e) {
            if (e instanceof Error) {
                // if (e instanceof InterruptedException || e instanceof IOException) {
                let msg = "command \"" + cmd + "\"\n  in " + workPath + " failed";
                if (description !== null) {
                    msg += ":\n  can't " + description;
                }
                throw new Error(msg, e);
            } else {
                throw e;
            }
        }
    }

    private initAntlrRuntimeIfRequired(runOptions: RunOptions): boolean {
        const language = this.getLanguage();

        // Create initialization status for every runtime with lock object
        let status = RuntimeRunner.runtimeInitializationStatuses.get(language);
        if (!status) {
            status = {};
            RuntimeRunner.runtimeInitializationStatuses.set(language, status);
        }

        if (status.isInitialized != null) {
            return status.isInitialized;
        }

        if (status.isInitialized == null) {
            let exception: Error | undefined;
            try {
                this.initRuntime(runOptions);
            } catch (e) {
                if (e instanceof Error) {
                    exception = e;
                    console.error(e.stack);
                } else {
                    throw e;
                }
            }
            status.isInitialized = exception === null;
            status.exception = exception;
        }

        return status.isInitialized;
    }

    private removeTempTestDirIfRequired(): void {
        if (!this.saveTestDir) {
            fs.rmdirSync(this.tempTestDir, { recursive: true });
        }
    }

    public abstract getLanguage(): string;
}
