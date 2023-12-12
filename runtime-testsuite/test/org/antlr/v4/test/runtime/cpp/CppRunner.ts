/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { RuntimeTestUtils } from "../RuntimeTestUtils.js";
import { RuntimeRunner } from "../RuntimeRunner.js";
import { RunOptions } from "../RunOptions.js";
import { OSType } from "../OSType.js";
import { FileUtils } from "../FileUtils.js";
import { CompiledState } from "../states/CompiledState.js";
import { GeneratedState } from "../states/GeneratedState.js";

/**
 * For my own information on I'm recording what I needed to do to get a unit test to compile and run in C++ on the Mac.
 * I got a segmentation violation and couldn't figure out how to get information about it, so I turned on debugging
 * and then figured out lldb enough to create this issue: https://github.com/antlr/antlr4/issues/3845 on a bug.
 *
 * cd ~/antlr/code/antlr4/runtime/Cpp
 * cmake . -D CMAKE_OSX_ARCHITECTURES="arm64; x86_64" -DCMAKE_BUILD_TYPE=Debug
 * make -j 8
 *
 * In test dir with generated test code:
 *
 * clang++ -g -std=c++17 -I /Users/parrt/antlr/code/antlr4/runtime/Cpp/runtime/src -L. -lantlr4-runtime *.cpp
 * ./a.out input
 *
 * $ lldb ./a.out input
 * (lldb) run
 * ... crash ...
 * (lldb) thread backtrace
 */
export class CppRunner extends RuntimeRunner {

    private static readonly runtimeSourcePath: string;
    private static readonly runtimeBinaryPath: string;
    private static readonly runtimeLibraryFileName: string;
    private static compilerName: string;
    private static readonly visualStudioProjectContent: string;
    private static readonly environment: Map<String, String>;

    public override  getLanguage(): string {
        return "Cpp";
    }

    public override  getTitleName(): string { return "C++"; }

    public override  getRuntimeToolName(): string {
        return null;
    }

    public override  getExecFileName(): string {
        return Paths.get(this.getTempDirPath(), this.getTestFileName() + "." + (RuntimeTestUtils.isWindows() ? "exe" : "out")).toString();
    }

    public override  getExecEnvironment(): Map<String, String> {
        return CppRunner.environment;
    }

    protected override  getCompilerName(): string {
        if (CppRunner.compilerName === null) {
            if (RuntimeTestUtils.isWindows()) {
                CppRunner.compilerName = "MSBuild";
            }
            else {
                CppRunner.compilerName = "clang++";
            }
        }

        return CppRunner.compilerName;
    }

    protected override  initRuntime(runOptions: RunOptions): void {
        const runtimePath = this.getRuntimePath();

        if (RuntimeTestUtils.isWindows()) {
            const command = [
                this.getCompilerPath(), "antlr4cpp-vs2022.vcxproj", "/p:configuration=Release DLL", "/p:platform=x64",
            ];

            this.runCommand(command, runtimePath + "\\runtime", "build c++ ANTLR runtime using MSBuild");
        }
        else {
            // cmake ignores default of OFF and must explicitly say yes or no on tracing arg. grrr...
            const trace = "-DTRACE_ATN=" + (runOptions.traceATN ? "ON" : "OFF");
            let command = ["cmake", ".", trace, "-DCMAKE_BUILD_TYPE=Release"];
            this.runCommand(command, runtimePath, "run cmake on antlr c++ runtime");

            command = ["make", "-j", Integer.toString(Runtime.getRuntime().availableProcessors())];
            this.runCommand(command, runtimePath, "run make on antlr c++ runtime");
        }
    }

    protected override  compile(runOptions: RunOptions, generatedState: GeneratedState): CompiledState {
        if (RuntimeTestUtils.isWindows()) {
            this.writeVisualStudioProjectFile(runOptions.grammarName, runOptions.lexerName, runOptions.parserName,
                runOptions.useListener, runOptions.useVisitor);
        }

        let exception = null;
        try {
            if (!RuntimeTestUtils.isWindows()) {
                const linkCommand = ["ln", "-s", CppRunner.runtimeLibraryFileName];
                this.runCommand(linkCommand, this.getTempDirPath(), "sym link C++ runtime");
            }

            const buildCommand = new ArrayList();
            buildCommand.add(this.getCompilerPath());
            if (RuntimeTestUtils.isWindows()) {
                buildCommand.add(this.getTestFileName() + ".vcxproj");
                buildCommand.add("/p:configuration=Release");
                buildCommand.add("/p:platform=x64");
            }
            else {
                buildCommand.add("-std=c++17");
                buildCommand.add("-I");
                buildCommand.add(CppRunner.runtimeSourcePath);
                buildCommand.add("-L.");
                buildCommand.add("-lantlr4-runtime");
                buildCommand.add("-pthread");
                buildCommand.add("-o");
                buildCommand.add(this.getTestFileName() + ".out");
                buildCommand.add(this.getTestFileWithExt());
                buildCommand.addAll(generatedState.generatedFiles.stream().map((file) => { return java.lang.ProcessBuilder.Redirect.file.name; }).collect(Collectors.toList()));
            }

            this.runCommand(buildCommand.toArray(new Array<String>(0)), this.getTempDirPath(), "build test c++ binary");
        } catch (ex) {
            if (ex instanceof Exception) {
                exception = ex;
            } else {
                throw ex;
            }
        }

        return new CompiledState(generatedState, exception);
    }

    private writeVisualStudioProjectFile(grammarName: string, lexerName: string, parserName: string,
        useListener: boolean, useVisitor: boolean): void {
        const projectFileST = new ST(CppRunner.visualStudioProjectContent);
        projectFileST.add("runtimeSourcePath", CppRunner.runtimeSourcePath);
        projectFileST.add("runtimeBinaryPath", CppRunner.runtimeBinaryPath);
        projectFileST.add("grammarName", grammarName);
        projectFileST.add("lexerName", lexerName);
        projectFileST.add("parserName", parserName);
        projectFileST.add("useListener", useListener);
        projectFileST.add("useVisitor", useVisitor);
        FileUtils.writeFile(this.getTempDirPath(), "Test.vcxproj", projectFileST.render());
    }

    static {
        const runtimePath = this.getRuntimePath("Cpp");
        CppRunner.runtimeSourcePath = Paths.get(runtimePath, "runtime", "src").toString();

        CppRunner.environment = new HashMap();
        if (RuntimeTestUtils.isWindows()) {
            CppRunner.runtimeBinaryPath = Paths.get(runtimePath, "runtime", "bin", "vs-2022", "x64", "Release DLL").toString();
            CppRunner.runtimeLibraryFileName = Paths.get(CppRunner.runtimeBinaryPath, "antlr4-runtime.dll").toString();
            const path = System.getenv("PATH");
            CppRunner.environment.put("PATH", path === null ? CppRunner.runtimeBinaryPath : path + ";" + CppRunner.runtimeBinaryPath);
        }
        else {
            CppRunner.runtimeBinaryPath = Paths.get(runtimePath, "dist").toString();
            CppRunner.runtimeLibraryFileName = Paths.get(CppRunner.runtimeBinaryPath,
                "libantlr4-runtime." + (RuntimeTestUtils.getOS() === OSType.Mac ? "dylib" : "so")).toString();
            CppRunner.environment.put("LD_PRELOAD", CppRunner.runtimeLibraryFileName);
        }

        if (RuntimeTestUtils.isWindows()) {
            CppRunner.visualStudioProjectContent = RuntimeTestUtils.getTextFromResource("org/antlr/v4/test/runtime/helpers/Test.vcxproj.stg");
        } else {
            CppRunner.visualStudioProjectContent = null;
        }
    }
}
