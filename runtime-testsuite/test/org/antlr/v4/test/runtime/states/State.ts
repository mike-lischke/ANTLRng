/*
 * Copyright (c) 2012-2022 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */




import { java, JavaObject } from "jree";
import { Stage } from "../Stage";

type Exception = java.lang.Exception;
const Exception = java.lang.Exception;
type String = java.lang.String;
const String = java.lang.String;

import { Test, Override } from "../../../../../../../decorators.js";


export abstract  class State extends JavaObject {
	public readonly  previousState;

	public readonly  exception;

	public  constructor(previousState: State, exception: Exception) {
		super();
this.previousState = previousState;
		this.exception = exception;
	}

	public abstract  getStage():  Stage;

	public  containsErrors():  boolean {
		return this.exception !== null;
	}

	public  getErrorMessage():  String {
		let  result = "State: " + this.getStage() + "; ";
		if (this.exception !== null) {
			result += this.exception.toString();
			if ( this.exception.getCause()!==null ) {
				result += "\nCause:\n";
				result += this.exception.getCause().toString();
			}
		}
		return result;
	}
}
