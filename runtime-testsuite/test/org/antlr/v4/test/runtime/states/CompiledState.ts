/*
 * Copyright (c) 2012-2022 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */




import { java } from "jree";
import { GeneratedState } from "./GeneratedState";
import { Stage } from "../Stage";

type Exception = java.lang.Exception;
const Exception = java.lang.Exception;

import { Test, Override } from "../../../../../../../decorators.js";


export  class CompiledState extends CompiledState.State {

	public  constructor(previousState: GeneratedState, exception: Exception) {
		super(previousState, exception);
	}
	@Override
public  getStage():  Stage {
		return Stage.Compile;
	}
}
