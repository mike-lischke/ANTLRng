/*
 * Copyright (c) 2012-2022 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */




import { java } from "jree";
import { JavaCompiledState } from "./JavaCompiledState";
import { ExecutedState } from "./ExecutedState";
import { ParseTree } from "antlr4ng";

type String = java.lang.String;
const String = java.lang.String;
type Exception = java.lang.Exception;
const Exception = java.lang.Exception;



export  class JavaExecutedState extends ExecutedState {
	public readonly  parseTree;

	public  constructor(previousState: JavaCompiledState, output: String, errors: String, parseTree: ParseTree,
							 exception: Exception) {
		super(previousState, output, errors, exception);
		this.parseTree = parseTree;
	}
}
