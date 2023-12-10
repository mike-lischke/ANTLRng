/*
 * Copyright (c) 2012-2022 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */




import { java } from "jree";
import { CompiledState } from "./CompiledState";
import { Stage } from "../Stage";

type String = java.lang.String;
const String = java.lang.String;
type Exception = java.lang.Exception;
const Exception = java.lang.Exception;



export  class ExecutedState extends ExecutedState.State {

	public readonly  output;

	public readonly  errors;

	public  constructor(previousState: CompiledState, output: String, errors: String, exception: Exception) {
		super(previousState, exception);
		this.output = output !== null ? output : "";
		this.errors = errors !== null ? errors : "";
	}
	@Override
public  getStage():  Stage {
		return Stage.Execute;
	}
}
