/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */




import { java } from "jree";
import { RuntimeRunner } from "../RuntimeRunner";

type Map<K,​V> = java.util.Map<K,​V>;
type String = java.lang.String;
const String = java.lang.String;
type HashMap<K,​V> = java.util.HashMap<K,​V>;
const HashMap = java.util.HashMap;

import { Test, Override } from "../../../../../../../decorators.js";


export  class PHPRunner extends RuntimeRunner {
	private static readonly  environment;

	@Override
public override  getLanguage():  String {
		return "PHP";
	}

	@Override
public override  getExecEnvironment():  Map<String, String> {
		return PHPRunner.environment;
	}

	 static {
		PHPRunner.environment = new  HashMap();
		PHPRunner.environment.put("RUNTIME", this.getRuntimePath("PHP"));
	}
}
