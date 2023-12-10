/*
 * Copyright (c) 2012-2022 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */




import { NodeRunner } from "./NodeRunner";
import { RuntimeRunner } from "../RuntimeRunner";
import { RuntimeTests } from "../RuntimeTests";

import { Test, Override } from "../../../../../../../decorators.js";


export  class JavaScriptRuntimeTests extends RuntimeTests {
	@Override
protected override  createRuntimeRunner():  RuntimeRunner {
		return new  NodeRunner();
	}
}
