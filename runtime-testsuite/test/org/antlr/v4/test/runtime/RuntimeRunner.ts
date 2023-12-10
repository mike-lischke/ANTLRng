/*
 * Copyright (c) 2012-2022 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */




import { java, JavaObject, S } from "jree";
import { Stage } from "./Stage";
import { RuntimeTestUtils } from "./RuntimeTestUtils";
import { RunOptions } from "./RunOptions";
import { ProcessorResult } from "./ProcessorResult";
import { Generator } from "./Generator";
import { GeneratedFile } from "./GeneratedFile";
import { FileUtils } from "./FileUtils";
import { ErrorQueue } from "./ErrorQueue";
import { CompiledState } from "./states/CompiledState";
import { ExecutedState } from "./states/ExecutedState";
import { GeneratedState } from "./states/GeneratedState";

type AutoCloseable = java.lang.AutoCloseable;
type String = java.lang.String;
const String = java.lang.String;
type System = java.lang.System;
const System = java.lang.System;
type Path = java.nio.file.Path;
type Thread = java.lang.Thread;
const Thread = java.lang.Thread;
type Paths = java.nio.file.Paths;
const Paths = java.nio.file.Paths;
type Boolean = java.lang.Boolean;
const Boolean = java.lang.Boolean;
type Exception = java.lang.Exception;
const Exception = java.lang.Exception;
type File = java.io.File;
const File = java.io.File;
type InterruptedException = java.lang.InterruptedException;
const InterruptedException = java.lang.InterruptedException;
type IOException = java.io.IOException;
const IOException = java.io.IOException;



export abstract class RuntimeRunner extends JavaObject implements AutoCloseable {

    public static readonly InputFileName = "input";

    public static readonly cacheDirectory;

    public static InitializationStatus = class InitializationStatus extends JavaObject {
        public readonly lockObject = new java.lang.Object();
        public isInitialized;
        public exception;
    };


    private static runtimeToolPath;
    private static compilerPath;

    private static readonly runtimeInitializationStatuses = new java.util.HashMap();

    protected readonly tempTestDir;

    private saveTestDir;

    protected constructor();

    protected constructor(tempDir: Path, saveTestDir: boolean);
    protected constructor(...args: unknown[]) {
        switch (args.length) {
            case 0: {

                this(null, false);


                break;
            }

            case 2: {
                const [tempDir, saveTestDir] = args as [Path, boolean];


                super();
                if (tempDir === null) {
                    let dirName = this.getClass().getSimpleName() + "-" + Thread.currentThread().getName() + "-" + System.currentTimeMillis();
                    this.tempTestDir = Paths.get(RuntimeTestUtils.TempDirectory, dirName);
                }
                else {
                    this.tempTestDir = tempDir;
                }
                this.saveTestDir = saveTestDir;


                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }


    public static getCachePath(language: String): String {
        return RuntimeRunner.cacheDirectory + RuntimeTestUtils.FileSeparator + language;
    }

    public static getRuntimePath(language: String): String {
        return RuntimeTestUtils.runtimePath.toString() + RuntimeTestUtils.FileSeparator + language;
    }

    public abstract getLanguage(): String;

    public readonly getTempDirPath(): String {
        return this.tempTestDir.toString();
    }

    public setSaveTestDir(saveTestDir: boolean): void {
        this.saveTestDir = saveTestDir;
    }

    public close(): void {
        this.removeTempTestDirIfRequired();
    }

    public run(runOptions: RunOptions): java.lang.Thread.State {
        let options = new java.util.ArrayList();
        if (runOptions.useVisitor) {
            options.add("-visitor");
        }
        if (runOptions.superClass !== null && runOptions.superClass.length() > 0) {
            options.add("-DsuperClass=" + runOptions.superClass);
        }

        // See if the target wants to add tool options.
        //
        let targetOpts = this.getTargetToolOptions(runOptions);
        if (targetOpts !== null) {
            options.addAll(targetOpts);
        }

        let errorQueue = Generator.antlrOnString(this.getTempDirPath(), this.getLanguage(),
            runOptions.grammarFileName, runOptions.grammarStr, false, options.toArray(new Array<String>(0)));

        let generatedFiles = this.getGeneratedFiles(runOptions);
        let generatedState = new GeneratedState(errorQueue, generatedFiles, null);

        if (generatedState.containsErrors() || runOptions.endStage === Stage.Generate) {
            return generatedState;
        }

        if (!this.initAntlrRuntimeIfRequired(runOptions)) {
            // Do not repeat ANTLR runtime initialization error
            return new CompiledState(generatedState, new Exception(this.getTitleName() + " ANTLR runtime is not initialized"));
        }

        this.writeRecognizerFile(runOptions);

        let compiledState = this.compile(runOptions, generatedState);

        if (compiledState.containsErrors() || runOptions.endStage === Stage.Compile) {
            return compiledState;
        }

        this.writeInputFile(runOptions);

        return this.execute(runOptions, compiledState);
    }

    protected getExtension(): String { return this.getLanguage().toLowerCase(); }

    protected getTitleName(): String { return this.getLanguage(); }

    protected getTestFileName(): String { return "Test"; }

    protected getLexerSuffix(): String { return "Lexer"; }

    protected getParserSuffix(): String { return "Parser"; }

    protected getBaseListenerSuffix(): String { return "BaseListener"; }

    protected getListenerSuffix(): String { return "Listener"; }

    protected getBaseVisitorSuffix(): String { return "BaseVisitor"; }

    protected getVisitorSuffix(): String { return "Visitor"; }

    protected grammarNameToFileName(grammarName: String): String { return grammarName; }

    protected readonly getCompilerPath(): String {
        if (RuntimeRunner.compilerPath === null) {
            RuntimeRunner.compilerPath = this.getCompilerName();
            if (RuntimeRunner.compilerPath !== null) {
                let compilerPathFromProperty = System.getProperty(this.getPropertyPrefix() + "-compiler");
                if (compilerPathFromProperty !== null && compilerPathFromProperty.length() > 0) {
                    RuntimeRunner.compilerPath = compilerPathFromProperty;
                }
            }
        }

        return RuntimeRunner.compilerPath;
    }

    protected readonly getRuntimeToolPath(): String {
        if (RuntimeRunner.runtimeToolPath === null) {
            RuntimeRunner.runtimeToolPath = this.getRuntimeToolName();
            if (RuntimeRunner.runtimeToolPath !== null) {
                let runtimeToolPathFromProperty = System.getProperty(this.getPropertyPrefix() + "-exec");
                if (runtimeToolPathFromProperty !== null && runtimeToolPathFromProperty.length() > 0) {
                    RuntimeRunner.runtimeToolPath = runtimeToolPathFromProperty;
                }
            }
        }

        return RuntimeRunner.runtimeToolPath;
    }

    protected getCompilerName(): String { return null; }

    protected getRuntimeToolName(): String { return this.getLanguage().toLowerCase(); }

    protected getTestFileWithExt(): String { return this.getTestFileName() + "." + this.getExtension(); }

    protected getExecFileName(): String { return this.getTestFileWithExt(); }

    protected getExtraRunArgs(): String[] { return null; }

    protected getExecEnvironment(): java.util.Map<String, String> { return null; }

    protected getPropertyPrefix(): String {
        return "antlr-" + this.getLanguage().toLowerCase();
    }

    protected readonly getCachePath(): String {
        return this.getCachePath(this.getLanguage());
    }

    protected readonly getRuntimePath(): String {
        return this.getRuntimePath(this.getLanguage());
    }

    // Allows any target to add additional options for the antlr tool such as the location of the output files
    // which is useful for the Go target for instance to avoid having to move them before running the test
    //
    protected getTargetToolOptions(ro: RunOptions): java.util.List<String> {
        return null;
    }

    protected getGeneratedFiles(runOptions: RunOptions): java.util.List<GeneratedFile> {
        let files = new java.util.ArrayList();
        let extensionWithDot = "." + this.getExtension();
        let fileGrammarName = this.grammarNameToFileName(runOptions.grammarName);
        let isCombinedGrammarOrGo = runOptions.lexerName !== null && runOptions.parserName !== null || this.getLanguage().equals("Go");
        if (runOptions.lexerName !== null) {
            files.add(new GeneratedFile(fileGrammarName + (isCombinedGrammarOrGo ? this.getLexerSuffix() : "") + extensionWithDot, false));
        }
        if (runOptions.parserName !== null) {
            files.add(new GeneratedFile(fileGrammarName + (isCombinedGrammarOrGo ? this.getParserSuffix() : "") + extensionWithDot, true));
            if (runOptions.useListener) {
                files.add(new GeneratedFile(fileGrammarName + this.getListenerSuffix() + extensionWithDot, true));
                let baseListenerSuffix = this.getBaseListenerSuffix();
                if (baseListenerSuffix !== null) {
                    files.add(new GeneratedFile(fileGrammarName + baseListenerSuffix + extensionWithDot, true));
                }
            }
            if (runOptions.useVisitor) {
                files.add(new GeneratedFile(fileGrammarName + this.getVisitorSuffix() + extensionWithDot, true));
                let baseVisitorSuffix = this.getBaseVisitorSuffix();
                if (baseVisitorSuffix !== null) {
                    files.add(new GeneratedFile(fileGrammarName + baseVisitorSuffix + extensionWithDot, true));
                }
            }
        }
        return files;
    }

    protected writeRecognizerFile(runOptions: RunOptions): void {
        let text = RuntimeTestUtils.getTextFromResource("org/antlr/v4/test/runtime/helpers/" + this.getTestFileWithExt() + ".stg");
        let outputFileST = new ST(text);
        outputFileST.add("grammarName", runOptions.grammarName);
        outputFileST.add("lexerName", runOptions.lexerName);
        outputFileST.add("parserName", runOptions.parserName);
        outputFileST.add("parserStartRuleName", this.grammarParseRuleToRecognizerName(runOptions.startRuleName));
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

    protected grammarParseRuleToRecognizerName(startRuleName: String): String {
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

    protected execute(runOptions: RunOptions, compiledState: CompiledState): ExecutedState {
        let output = null;
        let errors = null;
        let exception = null;
        try {
            let args = new java.util.ArrayList();
            let runtimeToolPath = this.getRuntimeToolPath();
            if (runtimeToolPath !== null) {
                args.add(runtimeToolPath);
            }
            let extraRunArgs = this.getExtraRunArgs();
            if (extraRunArgs !== null) {
                args.addAll(java.util.Arrays.asList(extraRunArgs));
            }
            args.add(this.getExecFileName());
            args.add(RuntimeRunner.InputFileName);
            let result = java.util.concurrent.Flow.Processor.run(args.toArray(new Array<String>(0)), this.getTempDirPath(), this.getExecEnvironment());
            output = result.output;
            errors = result.errors;
        } catch (e) {
            if (e instanceof InterruptedException || e instanceof IOException) {
                exception = e;
            } else {
                throw e;
            }
        }
        return new ExecutedState(compiledState, output, errors, exception);
    }

    protected runCommand(command: String[], workPath: String): ProcessorResult;

    protected runCommand(command: String[], workPath: String, description: String): ProcessorResult;
    protected runCommand(...args: unknown[]): ProcessorResult {
        switch (args.length) {
            case 2: {
                const [command, workPath] = args as [String[], String];


                return this.runCommand(command, workPath, null);


                break;
            }

            case 3: {
                const [command, workPath, description] = args as [String[], String, String];


                let cmd = String.join(" ", command);
                try {
                    return java.util.concurrent.Flow.Processor.run(command, workPath);
                } catch (e) {
                    if (e instanceof InterruptedException || e instanceof IOException) {
                        let msg = "command \"" + cmd + "\"\n  in " + workPath + " failed";
                        if (description !== null) {
                            msg += ":\n  can't " + description;
                        }
                        throw new Exception(msg, e);
                    } else {
                        throw e;
                    }
                }


                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }


    private initAntlrRuntimeIfRequired(runOptions: RunOptions): boolean {
        let language = this.getLanguage();
        let status;

        // Create initialization status for every runtime with lock object
        /* synchronized (runtimeInitializationStatuses) { */
        status = RuntimeRunner.runtimeInitializationStatuses.get(language);
        if (status === null) {
            status = new RuntimeRunner.InitializationStatus();
            RuntimeRunner.runtimeInitializationStatuses.put(language, status);
        }
        /* } */

        if (status.isInitialized !== null) {
            return status.isInitialized;
        }

        // Locking per runtime, several runtimes can be being initialized simultaneously
        /* synchronized (status.lockObject) { */
        if (status.isInitialized === null) {
            let exception = null;
            try {
                this.initRuntime(runOptions);
            } catch (e) {
                if (e instanceof Exception) {
                    exception = e;
                    e.printStackTrace();
                } else {
                    throw e;
                }
            }
            status.isInitialized = exception === null;
            status.exception = exception;
        }
        /* } */
        return status.isInitialized;
    }

    private removeTempTestDirIfRequired(): void {
        if (!this.saveTestDir) {
            let dirFile = this.tempTestDir.toFile();
            if (dirFile.exists()) {
                try {
                    java.nio.file.SecureDirectoryStream.deleteDirectory(dirFile);
                } catch (e) {
                    if (e instanceof IOException) {
                        e.printStackTrace();
                    } else {
                        throw e;
                    }
                }
            }
        }
    }

    static {
        RuntimeRunner.cacheDirectory = new File(System.getProperty("java.io.tmpdir"), "ANTLR-runtime-testsuite-cache").getAbsolutePath();
    }
}

// eslint-disable-next-line @typescript-eslint/no-namespace, no-redeclare
export namespace RuntimeRunner {
    export type InitializationStatus = InstanceType<typeof RuntimeRunner.InitializationStatus>;
}
