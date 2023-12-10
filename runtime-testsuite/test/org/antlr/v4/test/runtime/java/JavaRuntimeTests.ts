/*
 * Copyright (c) 2012-2022 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */




import { JavaRunner } from "./JavaRunner";
import { RuntimeTests } from "../RuntimeTests";
import { RuntimeRunner } from "../RuntimeRunner";



export  class JavaRuntimeTests extends RuntimeTests {
	@Override
protected override  createRuntimeRunner():  RuntimeRunner {
		return new  JavaRunner();
	}
}
