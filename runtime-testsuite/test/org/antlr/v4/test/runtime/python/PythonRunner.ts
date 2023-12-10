/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */



import { java } from "jree";
import { RuntimeRunner } from "../RuntimeRunner";

type String = java.lang.String;
const String = java.lang.String;

import { Test, Override } from "../../../../../../../decorators.js";


export abstract  class PythonRunner extends RuntimeRunner {
	@Override
public override  getExtension():  String { return "py"; }

	@Override
protected override  addExtraRecognizerParameters(template: ST):  void {
		template.add("python3", this.getLanguage().equals("Python3"));
	}
}
