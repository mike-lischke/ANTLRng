/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */



import { java } from "jree";
import { PythonRunner } from "../python/PythonRunner";

type Map<K,​V> = java.util.Map<K,​V>;
type String = java.lang.String;
const String = java.lang.String;
type HashMap<K,​V> = java.util.HashMap<K,​V>;
const HashMap = java.util.HashMap;
type Paths = java.nio.file.Paths;
const Paths = java.nio.file.Paths;

import { Test, Override } from "../../../../../../../decorators.js";


export  class Python3Runner extends PythonRunner {
	public static readonly  environment;

	@Override
public override  getLanguage():  String {
		return "Python3";
	}

	@Override
public override  getExecEnvironment():  Map<String, String> {
		return Python3Runner.environment;
	}

	 static {
		Python3Runner.environment = new  HashMap();
		Python3Runner.environment.put("PYTHONPATH", Paths.get($outer.getRuntimePath("Python3"), "src").toString());
		Python3Runner.environment.put("PYTHONIOENCODING", "utf-8");
	}
}
