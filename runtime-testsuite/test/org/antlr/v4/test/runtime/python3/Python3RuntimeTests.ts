/*
 * Copyright (c) 2012-2022 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */




import { java } from "jree";
import { Python3Runner } from "./Python3Runner.js";
import { RuntimeTests } from "../RuntimeTests.js";
import { RuntimeRunner } from "../RuntimeRunner.js";

import { Test, Override } from "../../../../../../../decorators.js";


export  class Python3RuntimeTests extends RuntimeTests {
	@Override
protected override  createRuntimeRunner():  RuntimeRunner {
		return new  Python3Runner();
	}
}
