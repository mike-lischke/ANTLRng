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

import { Test, Override } from "../../../../../../../decorators.js";


export  class DartRunner extends RuntimeRunner {

	private static  cacheDartPackageConfig:  String;
	@Override
public override  getLanguage():  String {
		return "Dart";
	}

	@Override
protected override  initRuntime(runOptions: RunOptions):  void {
		let  cachePath = this.getCachePath();
		java.io.File.mkdir(cachePath);

		let  projectTemplate = new  ST(RuntimeTestUtils.getTextFromResource("org/antlr/v4/test/runtime/helpers/pubspec.yaml.stg"));
		projectTemplate.add("runtimePath", this.getRuntimePath());

		FileUtils.writeFile(cachePath, "pubspec.yaml", projectTemplate.render());

		this.runCommand( [this.getRuntimeToolPath(), "pub", "get"], cachePath);

		DartRunner.cacheDartPackageConfig = FileUtils.readFile(cachePath + RuntimeTestUtils.FileSeparator + ".dart_tool", "package_config.json");
	}

	@Override
protected override  compile(runOptions: RunOptions, generatedState: GeneratedState):  CompiledState {
		let  dartToolDirPath = new  java.io.File(this.getTempDirPath(), ".dart_tool").getAbsolutePath();
		java.io.File.mkdir(dartToolDirPath);
		FileUtils.writeFile(dartToolDirPath, "package_config.json", DartRunner.cacheDartPackageConfig);

		return new  CompiledState(generatedState, null);
	}
}
