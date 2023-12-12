/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */



import { java } from "jree";
import { RuntimeTestUtils } from "../RuntimeTestUtils.js";
import { RuntimeRunner } from "../RuntimeRunner.js";
import { RunOptions } from "../RunOptions.js";
import { FileUtils } from "../FileUtils.js";
import { CompiledState } from "../states/CompiledState.js";
import { GeneratedState } from "../states/GeneratedState.js";

type String = java.lang.String;
const String = java.lang.String;
type Paths = java.nio.file.Paths;
const Paths = java.nio.file.Paths;
type Exception = java.lang.Exception;
const Exception = java.lang.Exception;

import { Test, Override } from "../../../../../../../decorators.js";


export  class CSharpRunner extends RuntimeRunner {

	private static readonly  testProjectFileName = "Antlr4.Test.csproj";
	private static readonly  cSharpAntlrRuntimeDllName =
			Paths.get(this.getCachePath("CSharp"), "Antlr4.Runtime.Standard.dll").toString();

	private static readonly  cSharpTestProjectContent:  String;
	@Override
public override  getLanguage():  String { return "CSharp"; }

	@Override
public override  getTitleName():  String { return "C#"; }

	@Override
public override  getExtension():  String { return "cs"; }

	@Override
public override  getRuntimeToolName():  String { return "dotnet"; }

	@Override
public override  getExecFileName():  String { return this.getTestFileName() + ".dll"; }

	@Override
public override  compile(runOptions: RunOptions, generatedState: GeneratedState):  CompiledState {
		let  exception = null;
		try {
			FileUtils.writeFile(this.getTempDirPath(), CSharpRunner.testProjectFileName, CSharpRunner.cSharpTestProjectContent);
			this.runCommand( [this.getRuntimeToolPath(), "build", CSharpRunner.testProjectFileName, "-c", "Release"], this.getTempDirPath(),
					"build C# test binary");
		} catch (e) {
if (e instanceof Exception) {
			exception = e;
		} else {
	throw e;
	}
}
		return new  CompiledState(generatedState, exception);
	}

	@Override
protected override  initRuntime(runOptions: RunOptions):  void {
		let  cachePath = this.getCachePath();
		java.io.File.mkdir(cachePath);
		let  projectPath = Paths.get(this.getRuntimePath(), "src", "Antlr4.csproj").toString();
		let  args =  [this.getRuntimeToolPath(), "build", projectPath, "-c", "Release", "-o", cachePath];
		this.runCommand(args, cachePath, "build " + this.getTitleName() + " ANTLR runtime");
	}

	 static {
		let  projectTemplate = new  ST(RuntimeTestUtils.getTextFromResource("org/antlr/v4/test/runtime/helpers/Antlr4.Test.csproj.stg"));
		projectTemplate.add("runtimeLibraryPath", CSharpRunner.cSharpAntlrRuntimeDllName);
		CSharpRunner.cSharpTestProjectContent = projectTemplate.render();
	}
}
