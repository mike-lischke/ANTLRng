/*
 * Copyright (c) 2012-2022 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */




import { java, JavaObject } from "jree";
import { TraceATN } from "./TraceATN";
import { OSType } from "./OSType";
import { ATNState } from "antlr4ng";
import { junit } from "junit.ts";

type String = java.lang.String;
const String = java.lang.String;
type System = java.lang.System;
const System = java.lang.System;
type Path = java.nio.file.Path;
type Map<K,​V> = java.util.Map<K,​V>;
type HashMap<K,​V> = java.util.HashMap<K,​V>;
const HashMap = java.util.HashMap;
type Boolean = java.lang.Boolean;
const Boolean = java.lang.Boolean;
type Paths = java.nio.file.Paths;
const Paths = java.nio.file.Paths;
type Files = java.nio.file.Files;
const Files = java.nio.file.Files;
type Locale = java.util.Locale;
const Locale = java.util.Locale;
type Exception = java.lang.Exception;
const Exception = java.lang.Exception;
type RuntimeException = java.lang.RuntimeException;
const RuntimeException = java.lang.RuntimeException;
type StringBuilder = java.lang.StringBuilder;
const StringBuilder = java.lang.StringBuilder;



export abstract  class RuntimeTestUtils extends JavaObject {
	public static readonly  NewLine = System.getProperty("line.separator");
	public static readonly  PathSeparator = System.getProperty("path.separator");
	public static readonly  FileSeparator = System.getProperty("file.separator");
	public static readonly  TempDirectory = System.getProperty("java.io.tmpdir");

	public static readonly  runtimePath;
	public static readonly  runtimeTestsuitePath;
	public static readonly  resourcePath;

	private static readonly  resourceCache = new  HashMap();
	private static  detectedOS;
	private static  isWindows;

	public static  isWindows():  boolean {
		if (RuntimeTestUtils.isWindows === null) {
			RuntimeTestUtils.isWindows = RuntimeTestUtils.getOS() === OSType.Windows;
		}

		return RuntimeTestUtils.isWindows;
	}

	public static  getOS():  OSType {
		if (RuntimeTestUtils.detectedOS === null) {
			let  os = System.getProperty("os.name", "generic").toLowerCase(Locale.ENGLISH);
			if (os.contains("mac") || os.contains("darwin")) {
				RuntimeTestUtils.detectedOS = OSType.Mac;
			}
			else {
 if (os.contains("win")) {
				RuntimeTestUtils.detectedOS = OSType.Windows;
			}
			else {
 if (os.contains("nux")) {
				RuntimeTestUtils.detectedOS = OSType.Linux;
			}
			else {
				RuntimeTestUtils.detectedOS = OSType.Unknown;
			}
}

}

		}
		return RuntimeTestUtils.detectedOS;
	}

	public static  getTextFromResource(name: String):  String {
		try {
			let  text = RuntimeTestUtils.resourceCache.get(name);
			if (text === null) {
				let  path = Paths.get(RuntimeTestUtils.resourcePath.toString(), name);
				text = new  String(Files.readAllBytes(path));
				RuntimeTestUtils.resourceCache.put(name, text);
			}
			return text;
		} catch (ex) {
if (ex instanceof Exception) {
			throw new  RuntimeException(ex);
		} else {
	throw ex;
	}
}
	}

	public static  checkRuleATN(g: Grammar, ruleName: String, expecting: String):  void {
		let  r = g.getRule(ruleName);
		let  startState = g.getATN().ruleToStartState[r.index];
		let  serializer = new  ATNPrinter(g, startState);
		let  result = serializer.asString();

		org.junit.jupiter.api.Assert.assertEquals(expecting, result);
	}

	public static  joinLines(...args: java.lang.Object[]):  String {
		let  result = new  StringBuilder();
		for (let arg of TraceATN.TraceATN.args) {
			let  str = arg.toString();
			result.append(str);
			if (!str.endsWith("\n")) {

				result.append("\n");
}

		}
		return result.toString();
	}

	 static {
		let  locationPath = RuntimeTestUtils.class.getProtectionDomain().getCodeSource().getLocation().getPath();
		if (RuntimeTestUtils.isWindows()) {
			locationPath = locationPath.replaceFirst("/", "");
		}
		let  potentialRuntimeTestsuitePath = Paths.get(locationPath, "..", "..").normalize().toAbsolutePath();
		let  potentialResourcePath = Paths.get(potentialRuntimeTestsuitePath.toString(), "resources");

		if (Files.exists(potentialResourcePath)) {
			RuntimeTestUtils.runtimeTestsuitePath = potentialRuntimeTestsuitePath;
		}
		else {
			RuntimeTestUtils.runtimeTestsuitePath = Paths.get("..", "runtime-testsuite").normalize().toAbsolutePath();
		}

		RuntimeTestUtils.runtimePath = Paths.get(RuntimeTestUtils.runtimeTestsuitePath.toString(), "..", "runtime").normalize().toAbsolutePath();
		RuntimeTestUtils.resourcePath = Paths.get(RuntimeTestUtils.runtimeTestsuitePath.toString(), "resources");
	}
}
