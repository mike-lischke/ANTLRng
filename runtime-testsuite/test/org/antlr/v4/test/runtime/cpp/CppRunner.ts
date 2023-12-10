/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */



import { java } from "jree";
import { RuntimeTestUtils } from "../RuntimeTestUtils";
import { RuntimeRunner } from "../RuntimeRunner";
import { RunOptions } from "../RunOptions";
import { OSType } from "../OSType";
import { FileUtils } from "../FileUtils";
import { CompiledState } from "../states/CompiledState";
import { GeneratedState } from "../states/GeneratedState";

type String = java.lang.String;
const String = java.lang.String;
type Map<K,​V> = java.util.Map<K,​V>;
type Paths = java.nio.file.Paths;
const Paths = java.nio.file.Paths;
type HashMap<K,​V> = java.util.HashMap<K,​V>;
const HashMap = java.util.HashMap;
type System = java.lang.System;
const System = java.lang.System;
type Integer = java.lang.Integer;
const Integer = java.lang.Integer;
type Runtime = java.lang.Runtime;
const Runtime = java.lang.Runtime;
type Exception = java.lang.Exception;
const Exception = java.lang.Exception;
type List<E> = java.util.List<E>;
type ArrayList<E> = java.util.ArrayList<E>;
const ArrayList = java.util.ArrayList;
type Collectors = java.util.stream.Collectors;
const Collectors = java.util.stream.Collectors;

import { Test, Override } from "../../../../../../../decorators.js";


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
export  class CppRunner extends RuntimeRunner {

	private static readonly  runtimeSourcePath;
	private static readonly  runtimeBinaryPath;
	private static readonly  runtimeLibraryFileName;
	private static  compilerName;
	private static readonly  visualStudioProjectContent;
	private static readonly  environment;
	@Override
public override  getLanguage():  String {
		return "Cpp";
	}

	@Override
public override  getTitleName():  String { return "C++"; }

	@Override
public override  getRuntimeToolName():  String {
		return null;
	}

	@Override
public override  getExecFileName():  String {
		return Paths.get(this.getTempDirPath(), this.getTestFileName() + "." + (RuntimeTestUtils.isWindows() ? "exe" : "out")).toString();
	}

	@Override
public override  getExecEnvironment():  Map<String, String> {
		return CppRunner.environment;
	}

	@Override
protected override  getCompilerName():  String {
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

	@Override
protected override  initRuntime(runOptions: RunOptions):  void {
		let  runtimePath = this.getRuntimePath();

		if (RuntimeTestUtils.isWindows()) {
			let  command = [
				this.getCompilerPath(), "antlr4cpp-vs2022.vcxproj", "/p:configuration=Release DLL", "/p:platform=x64"
			];

			this.runCommand(command, runtimePath + "\\runtime","build c++ ANTLR runtime using MSBuild");
		}
		else {
			// cmake ignores default of OFF and must explicitly say yes or no on tracing arg. grrr...
			let  trace = "-DTRACE_ATN="+(runOptions.traceATN?"ON":"OFF");
			let  command = ["cmake", ".", trace, "-DCMAKE_BUILD_TYPE=Release"];
			this.runCommand(command, runtimePath, "run cmake on antlr c++ runtime");

			command =  ["make", "-j", Integer.toString(Runtime.getRuntime().availableProcessors())];
			this.runCommand(command, runtimePath, "run make on antlr c++ runtime");
		}
	}

	@Override
protected override  compile(runOptions: RunOptions, generatedState: GeneratedState):  CompiledState {
		if (RuntimeTestUtils.isWindows()) {
			this.writeVisualStudioProjectFile(runOptions.grammarName, runOptions.lexerName, runOptions.parserName,
					runOptions.useListener, runOptions.useVisitor);
		}

		let  exception = null;
		try {
			if (!RuntimeTestUtils.isWindows()) {
				let  linkCommand =  ["ln", "-s", CppRunner.runtimeLibraryFileName];
				this.runCommand(linkCommand, this.getTempDirPath(), "sym link C++ runtime");
			}

			let  buildCommand = new  ArrayList();
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
				buildCommand.addAll(generatedState.generatedFiles.stream().map(file => java.lang.ProcessBuilder.Redirect.file.name).collect(Collectors.toList()));
			}

			this.runCommand(buildCommand.toArray(new  Array<String>(0)), this.getTempDirPath(), "build test c++ binary");
		} catch (ex) {
if (ex instanceof Exception) {
			exception = ex;
		} else {
	throw ex;
	}
}
		return new  CompiledState(generatedState, exception);
	}

	private  writeVisualStudioProjectFile(grammarName: String, lexerName: String, parserName: String,
											  useListener: boolean, useVisitor: boolean):  void {
		let  projectFileST = new  ST(CppRunner.visualStudioProjectContent);
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
		let  runtimePath = this.getRuntimePath("Cpp");
		CppRunner.runtimeSourcePath = Paths.get(runtimePath, "runtime", "src").toString();

		CppRunner.environment = new  HashMap();
		if (RuntimeTestUtils.isWindows()) {
			CppRunner.runtimeBinaryPath = Paths.get(runtimePath, "runtime", "bin", "vs-2022", "x64", "Release DLL").toString();
			CppRunner.runtimeLibraryFileName = Paths.get(CppRunner.runtimeBinaryPath, "antlr4-runtime.dll").toString();
			let  path = System.getenv("PATH");
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

