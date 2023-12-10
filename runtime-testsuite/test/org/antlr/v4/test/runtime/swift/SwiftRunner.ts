/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */




import { java, JavaObject } from "jree";
import { RuntimeTestUtils } from "../RuntimeTestUtils";
import { RuntimeRunner } from "../RuntimeRunner";
import { RunOptions } from "../RunOptions";
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
type Exception = java.lang.Exception;
const Exception = java.lang.Exception;
type File = java.io.File;
const File = java.io.File;
type List<E> = java.util.List<E>;
type Arrays = java.util.Arrays;
const Arrays = java.util.Arrays;
type Collectors = java.util.stream.Collectors;
const Collectors = java.util.stream.Collectors;
type FilenameFilter = java.io.FilenameFilter;



export  class SwiftRunner extends RuntimeRunner {

	public static NoSwiftFileFilter =  class NoSwiftFileFilter extends JavaObject implements FilenameFilter {
		public static readonly  Instance = new  SwiftRunner.NoSwiftFileFilter();

		public  accept(dir: File, name: String):  boolean {
			return !name.endsWith(".swift");
		}
	};


	private static readonly  swiftRuntimePath;
	private static readonly  buildSuffix;
	private static readonly  environment;

	private static readonly  includePath;
	private static readonly  libraryPath;
	@Override
public override  getLanguage():  String {
		return "Swift";
	}

	@Override
public override  getTestFileName():  String {
		return "main";
	}

	@Override
public override  getRuntimeToolName():  String {
		return null;
	}

	@Override
public override  getExecFileName():  String {
		return Paths.get(this.getTempDirPath(),
				".build",
				SwiftRunner.buildSuffix,
				"release",
				"Test" + (RuntimeTestUtils.isWindows() ? ".exe" : "")).toString();
	}

	@Override
public override  getExecEnvironment():  Map<String, String> {
		return SwiftRunner.environment;
	}

	@Override
protected override  getCompilerName():  String {
		return "swift";
	}

	@Override
protected override  initRuntime(runOptions: RunOptions):  void {
		this.runCommand( [this.getCompilerPath(), "build", "-c", "release"], SwiftRunner.swiftRuntimePath, "build Swift runtime");
	}

	@Override
protected override  compile(runOptions: RunOptions, generatedState: GeneratedState):  CompiledState {
		let  exception = null;
		try {
			let  tempDirPath = this.getTempDirPath();
			let  tempDirFile = new  File(tempDirPath);

			let  ignoredFiles = tempDirFile.listFiles(SwiftRunner.NoSwiftFileFilter.Instance);
			/* assert ignoredFiles != null; */ 
			let  excludedFiles = Arrays.stream(ignoredFiles).map(File.getName).collect(Collectors.toList());

			let  text = RuntimeTestUtils.getTextFromResource("org/antlr/v4/test/runtime/helpers/Package.swift.stg");
			let  outputFileST = new  ST(text);
			outputFileST.add("excludedFiles", excludedFiles);
			FileUtils.writeFile(tempDirPath, "Package.swift", outputFileST.render());

			let  buildProjectArgs =  [
					this.getCompilerPath(),
					"build",
					"-c",
					"release",
					"-Xswiftc",
					"-I" + SwiftRunner.includePath,
					"-Xlinker",
					"-L" + SwiftRunner.includePath,
					"-Xlinker",
					"-lAntlr4",
					"-Xlinker",
					"-rpath",
					"-Xlinker",
					SwiftRunner.libraryPath
			];
			this.runCommand(buildProjectArgs, tempDirPath);
		} catch (e) {
if (e instanceof Exception) {
			exception = e;
		} else {
	throw e;
	}
}

		return new  CompiledState(generatedState, exception);
	}

	 static {
		SwiftRunner.swiftRuntimePath = this.getRuntimePath("Swift");
		SwiftRunner.buildSuffix = RuntimeTestUtils.isWindows() ? "x86_64-unknown-windows-msvc" : "";
		SwiftRunner.includePath = Paths.get(SwiftRunner.swiftRuntimePath, ".build", SwiftRunner.buildSuffix, "release").toString();
		SwiftRunner.environment = new  HashMap();
		if (RuntimeTestUtils.isWindows()) {
			SwiftRunner.libraryPath = Paths.get(SwiftRunner.includePath, "Antlr4.lib").toString();
			let  path = System.getenv("PATH");
			SwiftRunner.environment.put("PATH", path === null ? SwiftRunner.includePath : path + ";" + SwiftRunner.includePath);
		}
		else {
			SwiftRunner.libraryPath = SwiftRunner.includePath;
		}
	}
}

// eslint-disable-next-line @typescript-eslint/no-namespace, no-redeclare
export namespace SwiftRunner {
	export type NoSwiftFileFilter = InstanceType<typeof SwiftRunner.NoSwiftFileFilter>;
}


