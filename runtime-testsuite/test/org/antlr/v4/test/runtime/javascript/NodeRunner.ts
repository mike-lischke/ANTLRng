/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */



import { java } from "jree";
import { RuntimeTestUtils } from "../RuntimeTestUtils";
import { RuntimeRunner } from "../RuntimeRunner";
import { RunOptions } from "../RunOptions";
import { GeneratedFile } from "../GeneratedFile";
import { FileUtils } from "../FileUtils";
import { CompiledState } from "../states/CompiledState";
import { GeneratedState } from "../states/GeneratedState";

type String = java.lang.String;
const String = java.lang.String;
type List<E> = java.util.List<E>;
type Paths = java.nio.file.Paths;
const Paths = java.nio.file.Paths;
type IOException = java.io.IOException;
const IOException = java.io.IOException;



export  class NodeRunner extends RuntimeRunner {

	private static readonly  normalizedRuntimePath = this.getRuntimePath("JavaScript").replace('\\', '/');
	private static readonly  newImportAntlrString =
			"import antlr4 from 'file://" + NodeRunner.normalizedRuntimePath + "/src/antlr4/index.node.js'";
	@Override
public override  getLanguage():  String {
		return "JavaScript";
	}

	@Override
public override  getExtension():  String { return "js"; }

	@Override
public override  getBaseListenerSuffix():  String { return null; }

	@Override
public override  getBaseVisitorSuffix():  String { return null; }

	@Override
public override  getRuntimeToolName():  String { return "node"; }

	@Override
protected override  compile(runOptions: RunOptions, generatedState: GeneratedState):  CompiledState {
		let  generatedFiles = generatedState.generatedFiles;
		for (let generatedFile of generatedFiles) {
			try {
				FileUtils.replaceInFile(Paths.get(this.getTempDirPath(), generatedFile.name),
						"import antlr4 from 'antlr4';",
						NodeRunner.newImportAntlrString);
			} catch (e) {
if (e instanceof IOException) {
				return new  CompiledState(generatedState, e);
			} else {
	throw e;
	}
}
		}

		FileUtils.writeFile(this.getTempDirPath(), "package.json",
				RuntimeTestUtils.getTextFromResource("org/antlr/v4/test/runtime/helpers/package_js.json"));
		return new  CompiledState(generatedState, null);
	}

	@Override
protected override  addExtraRecognizerParameters(template: ST):  void {
		template.add("runtimePath", NodeRunner.normalizedRuntimePath);
	}
}
