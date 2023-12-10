/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */



import { java } from "jree";
import { RuntimeTestUtils } from "../RuntimeTestUtils";
import { RuntimeRunner } from "../RuntimeRunner";
import { RunOptions } from "../RunOptions";
import { FileUtils } from "../FileUtils";
import { CompiledState } from "../states/CompiledState";
import { GeneratedState } from "../states/GeneratedState";

type String = java.lang.String;
const String = java.lang.String;
type Path = java.nio.file.Path;
type Paths = java.nio.file.Paths;
const Paths = java.nio.file.Paths;
type Exception = java.lang.Exception;
const Exception = java.lang.Exception;
type InterruptedException = java.lang.InterruptedException;
const InterruptedException = java.lang.InterruptedException;



export  class GoRunner extends RuntimeRunner {

	private static readonly  GoRuntimeImportPath = "github.com/antlr4-go/antlr/v4";

	private static readonly  environment;

	private static  cachedGoMod;
	private static  cachedGoSum;
	private static  options = new  java.util.ArrayList();
	@Override
public override  getLanguage():  String {
		return "Go";
	}

	@Override
public override  getLexerSuffix():  String {
		return "_lexer";
	}

	@Override
public override  getParserSuffix():  String {
		return "_parser";
	}

	@Override
public override  getBaseListenerSuffix():  String {
		return "_base_listener";
	}

	@Override
public override  getListenerSuffix():  String {
		return "_listener";
	}

	@Override
public override  getBaseVisitorSuffix():  String {
		return "_base_visitor";
	}

	@Override
public override  getVisitorSuffix():  String {
		return "_visitor";
	}

	@Override
public override  getExtraRunArgs():  String[] {
		return  ["run"];
	}

	@Override
public override  getExecEnvironment():  java.util.Map<String, String> {
		return GoRunner.environment;
	}

	@Override
protected override  grammarNameToFileName(grammarName: String):  String {
		return grammarName.toLowerCase();
	}

	@Override
protected override  initRuntime(runOptions: RunOptions):  void {
		let  cachePath = this.getCachePath();
		java.io.File.mkdir(cachePath);
		let  runtimeFilesPath = Paths.get(this.getRuntimePath("Go"), "antlr", "v4");
		let  runtimeToolPath = this.getRuntimeToolPath();
		let  goModFile = new  java.io.File(cachePath, "go.mod");
		if (goModFile.exists()) {

			if (!goModFile.delete()) {

				throw new  java.io.IOException("Can't delete " + goModFile);
}

}

		java.util.concurrent.Flow.Processor.run( [runtimeToolPath, "mod", "init", "test"], cachePath, GoRunner.environment);
		java.util.concurrent.Flow.Processor.run( [runtimeToolPath, "mod", "edit",
				"-replace=" + GoRunner.GoRuntimeImportPath + "=" + runtimeFilesPath], cachePath, GoRunner.environment);
		java.util.concurrent.Flow.Processor.run( [runtimeToolPath, "mod", "edit",
				"-require=" + GoRunner.GoRuntimeImportPath + "@v4.0.0"], cachePath, GoRunner.environment);
		GoRunner.cachedGoMod = FileUtils.readFile(cachePath + RuntimeTestUtils.FileSeparator, "go.mod");
	}

	@Override
protected override  grammarParseRuleToRecognizerName(startRuleName: String):  String {
		if (startRuleName === null || startRuleName.length() === 0) {
			return null;
		}

		// The rule name start is now translated to Start_ at runtime to avoid clashes with labels.
		// Some tests use start as the first rule name, and we must cater for that
		//
		let  rn = startRuleName.substring(0, 1).toUpperCase() + startRuleName.substring(1);
		switch (rn) {
			case "Start":
			case "End":
			case "Exception":{
				rn += "_";
}

			default:
		}
		return rn;
	}

	@Override
protected override  getTargetToolOptions(ro: RunOptions):  java.util.List<String> {
		// Unfortunately this cannot be cached because all the synchronization is out of whack, and
		// we end up return the options before they are populated. I prefer to make this small change
		// at the expense of an object rather than try to change teh synchronized initialization, which is
		// very fragile.
		// Also, the options may need to change in the future according to the test options. This is safe
		let  options = new  java.util.ArrayList();
		options.add("-o");
		options.add(this.tempTestDir.resolve("parser").toString());
		return options;
	}

	@Override
protected override  compile(runOptions: RunOptions, generatedState: GeneratedState):  CompiledState {
		// We have already created a suitable go.mod file, though it may need to have go mod tidy run on it one time
		//
		FileUtils.writeFile(this.getTempDirPath(), "go.mod", GoRunner.cachedGoMod);

		// We need to run a go mod tidy once, now that we have source code. This will generate a valid go.sum file and
		// recognize the indirect requirements in the go.mod file. Then we re-cache the go.mod and cache
		// the go.sum and therefore save sparking a new process for all the remaining go tests. This is probably
		// a race condition as these tests are run in parallel, but it does not matter as they are all going to
		// generate the same go.mod and go.sum file anyway.
		//
		let  ex = null;
		if (GoRunner.cachedGoSum === null) {
			try {
				java.util.concurrent.Flow.Processor.run( [this.getRuntimeToolPath(), "mod", "tidy"], this.getTempDirPath(), GoRunner.environment);
			} catch (e) {
if (e instanceof InterruptedException || e instanceof java.io.IOException) {
				ex = e;
			} else {
	throw e;
	}
}
			GoRunner.cachedGoMod = FileUtils.readFile(this.getTempDirPath() + RuntimeTestUtils.FileSeparator, "go.mod");
			GoRunner.cachedGoSum = FileUtils.readFile(this.getTempDirPath() + RuntimeTestUtils.FileSeparator, "go.sum");
		}

		// We can now write the go.sum file, which will allow the go compiler to build the module
		//
		FileUtils.writeFile(this.getTempDirPath(), "go.sum", GoRunner.cachedGoSum);

		return new  CompiledState(generatedState, ex);
	}

	 static {
		GoRunner.environment = new  java.util.HashMap();
		GoRunner.environment.put("GOWORK", "off");
	}
}
