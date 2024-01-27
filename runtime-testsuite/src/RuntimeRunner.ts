/* java2ts: keep */

/*
 * Copyright (c) 2012-2022 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import * as os from "os";
import path from "path";
import { spawnSync } from "child_process";
import { mkdirSync, rmdirSync } from "fs";

import { ST, STGroup, STGroupFile, StringRenderer } from "stringtemplate4ts";

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
import { Processor } from "./Processor.js";
import { State } from "./states/State.js";
import { RuntimeTestDescriptor } from "./RuntimeTestDescriptor.js";
import { RuntimeTests } from "./RuntimeTests.js";
import { GrammarType } from "./GrammarType.js";

export class RuntimeRunner {
    public static readonly InputFileName = "input";
    public static readonly cacheDirectory = os.tmpdir();

    private static runtimeToolPath = "";
    private static compilerPath = "";

    private static readonly runtimeInitializationStatuses =
        new Map<string, { isInitialized?: boolean; exception?: Error; }>();

    private static readonly stringRenderer = new StringRenderer();

    public keepTargetDir = false;

    static #ansiEscapeCodeRegex = /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g;

    // The work directory for a group of tests.
    readonly #groupDir: string;

    // The relative path for this test run.
    readonly #testDir: string;

    public constructor(groupDir: string, testDir: string) {
        this.#groupDir = groupDir;
        this.#testDir = testDir;
    }

    public static getCachePath(language: string): string {
        return path.join(RuntimeRunner.cacheDirectory, language);
    }

    public static getRuntimePath(language: string): string {
        return path.join(RuntimeTestUtils.runtimePath, language);
    }

    public get targetPath(): string {
        return path.join(this.#groupDir, this.#testDir);
    }

    public test(descriptor: RuntimeTestDescriptor): void {
        // Ensure that the target directory exists.
        mkdirSync(this.targetPath, { recursive: true });

        const targetName = this.getLanguage();
        if (descriptor.ignore(targetName)) {
            console.log("Ignore " + descriptor);

            return;
        }

        const grammarName = descriptor.grammarName;
        const grammar = this.prepareGrammars(descriptor);

        let lexerName: string | null;
        let parserName: string | null;
        let useListenerOrVisitor: boolean;
        let superClass: string | null;
        if (descriptor.testType === GrammarType.Parser || descriptor.testType === GrammarType.CompositeParser) {
            lexerName = grammarName + "Lexer";
            parserName = grammarName + "Parser";
            useListenerOrVisitor = true;
            superClass = null;
        } else {
            lexerName = grammarName;
            parserName = null;
            useListenerOrVisitor = false;
            superClass = null;
        }

        const runOptions = new RunOptions(grammarName + ".g4",
            grammar,
            parserName,
            lexerName,
            useListenerOrVisitor,
            useListenerOrVisitor,
            descriptor.startRule,
            descriptor.input,
            false,
            descriptor.showDiagnosticErrors,
            descriptor.traceATN,
            descriptor.showDFA,
            Stage.Execute,
            targetName,
            superClass,
            descriptor.predictionMode,
            descriptor.buildParseTree,
        );

        const state = this.run(runOptions);

        try {
            this.assertCorrectOutput(descriptor, state);
            if (!this.keepTargetDir) {
                rmdirSync(this.targetPath, { recursive: true });
            }
        } catch (e) {
            this.keepTargetDir = true;

            throw e;
        }
    }

    public run(runOptions: RunOptions): State {
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

        const errorQueue = Generator.generateANTLRFilesInTempDir(this.targetPath, this.getLanguage(),
            runOptions.grammarFileName, runOptions.grammarStr, false, options);

        const generatedFiles = this.getGeneratedFiles(runOptions);
        const generatedState = new GeneratedState(errorQueue, generatedFiles, null);

        if (generatedState.containsErrors() || runOptions.endStage === Stage.Generate) {
            return generatedState;
        }

        if (!this.initAntlrRuntimeIfRequired(runOptions)) {
            // Do not repeat ANTLR runtime initialization error
            return new CompiledState(generatedState,
                new Error(this.getTitleName() + " ANTLR runtime is not initialized"));
        }

        this.writeRecognizerFile(runOptions);

        const compiledState = this.compile(runOptions, generatedState);

        if (compiledState.containsErrors() || runOptions.endStage === Stage.Compile) {
            return compiledState;
        }

        FileUtils.writeFile(this.targetPath, RuntimeRunner.InputFileName, runOptions.input);

        return this.execute(runOptions, compiledState);
    }

    public getLanguage(): string {
        return "TypeScript";
    }
    protected getExtension(): string { return "ts"; }

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

    protected getCompilerName(): string { return "tsc"; }

    protected getRuntimeToolName(): string { return ""; }

    protected getTestFileWithExt(): string { return this.getTestFileName() + "." + this.getExtension(); }

    protected getExecFileName(): string { return this.getTestFileWithExt(); }

    protected getExtraRunArgs(): string[] {
        return ["--experimental-vm-modules", "--no-warnings", "--loader", "ts-node/esm"];
    }

    protected getExecEnvironment(): Map<string, string | undefined> { return new Map(Object.entries(process.env)); }

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
        const text = RuntimeTestUtils.getTextFromResource("helpers/" + this.getTestFileWithExt() + ".stg");
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
        FileUtils.writeFile(this.targetPath, this.getTestFileWithExt(), outputFileST.render());
    }

    protected grammarParseRuleToRecognizerName(startRuleName: string): string {
        return startRuleName;
    }

    protected addExtraRecognizerParameters(template: ST): void {
    }

    protected initRuntime(runOptions: RunOptions): void {
    }

    protected compile(runOptions: RunOptions, generatedState: GeneratedState): CompiledState {
        try {
            // TypeScript does not need to compile anything.

            return new CompiledState(generatedState, null);
        } catch (e) {
            return new CompiledState(generatedState, e as Error);
        }
    }

    protected execute(runOptions: RunOptions, compiledState: CompiledState): ExecutedState {
        let output = null;
        let errors = null;
        let exception: Error | null = null;
        try {
            const args: string[] = [];
            const runtimeToolPath = this.getRuntimeToolPath();
            if (runtimeToolPath.length > 0) {
                args.push(runtimeToolPath);
            }
            const extraRunArgs = this.getExtraRunArgs();
            if (extraRunArgs !== null) {
                args.push(...extraRunArgs);
            }

            args.push(this.getExecFileName());
            args.push(RuntimeRunner.InputFileName);

            //output = execSync("node " + args.join(" "), { encoding: "utf-8", cwd: this.targetPath, env: {} });
            const processOutput = spawnSync("node", args, {
                encoding: "utf-8",
                cwd: this.targetPath,
                stdio: [0, "pipe", "pipe", "pipe"],
            });

            output = processOutput.stdout.replace(RuntimeRunner.#ansiEscapeCodeRegex, "");

            if (processOutput.stderr.length > 0) {
                const lines = processOutput.stderr.split("\n");

                // Remove debugger attached and waiting for debugger messages.
                const filteredLines = lines.filter((line) => {
                    if (line.length === 0) {
                        return false;
                    }

                    return !line.startsWith("Debugger attached.")
                        && !line.startsWith("Waiting for the debugger to disconnect...");
                });

                if (filteredLines.length > 0) {
                    errors = filteredLines.join("\n") + "\n";
                }
            }

        } catch (e) {
            exception = e;
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
            status.isInitialized = exception == null;
            status.exception = exception;
        }

        return status.isInitialized;
    }

    private prepareGrammars(descriptor: RuntimeTestDescriptor): string {
        const targetName = this.getLanguage();

        let targetTemplates = RuntimeTests.cachedTargetTemplates.get(targetName);
        if (!targetTemplates) {
            const templateDir = path.join(RuntimeTestUtils.resourcePath, "templates");

            targetTemplates = new STGroupFile(path.join(templateDir, targetName + ".test.stg"), "utf-8", "<", ">");
            targetTemplates.registerRenderer(String, RuntimeRunner.stringRenderer);
            RuntimeTests.cachedTargetTemplates.set(targetName, targetTemplates);
        }

        // write out any slave grammars
        const slaveGrammars = descriptor.slaveGrammars;
        if (slaveGrammars !== null) {
            for (const pair of slaveGrammars) {
                const group = new STGroup("<", ">");
                group.registerRenderer(String, RuntimeRunner.stringRenderer);
                group.importTemplates(targetTemplates);
                const grammarST = new ST(group, pair[1]);
                FileUtils.writeFile(this.targetPath, pair[0] + ".g4", grammarST.render());
            }
        }

        const group = new STGroup("<", ">");
        group.importTemplates(targetTemplates);
        group.registerRenderer(String, RuntimeRunner.stringRenderer);
        const grammarST = new ST(group, descriptor.grammar);

        return grammarST.render();
    }

    private assertCorrectOutput(descriptor: RuntimeTestDescriptor, state: State): void {
        if (state instanceof ExecutedState) {
            expect(state.output).toEqual(descriptor.output);
            expect(state.errors).toEqual(descriptor.errors);
            if (state.exception !== null) {
                expect(state.getErrorMessage()).toBe("");
            }
        } else {
            expect(state.getErrorMessage()).toBe("");
        }
    }

}
