/*
 * Copyright (c) 2012-2022 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */




import { java } from "jree";
import { ErrorQueue } from "../ErrorQueue";
import { GeneratedFile } from "../GeneratedFile";
import { Stage } from "../Stage";
import { RuntimeTestUtils } from "../RuntimeTestUtils";

type List<E> = java.util.List<E>;
type String = java.lang.String;
const String = java.lang.String;
type Exception = java.lang.Exception;
const Exception = java.lang.Exception;



export  class GeneratedState extends GeneratedState.State {

	public readonly  errorQueue;
	public readonly  generatedFiles;

	public  constructor(errorQueue: ErrorQueue, generatedFiles:  List<GeneratedFile>, exception: Exception) {
		super(null, exception);
		this.errorQueue = errorQueue;
		this.generatedFiles = generatedFiles;
	}
	@Override
public  getStage():  Stage {
		return Stage.Generate;
	}

	@Override
public  containsErrors():  boolean {
		return this.errorQueue.errors.size() > 0 || super.containsErrors();
	}

	public  getErrorMessage():  String {
		let  result = super.getErrorMessage();

		if (this.errorQueue.errors.size() > 0) {
			result = RuntimeTestUtils.joinLines(result, this.errorQueue.toString(true));
		}

		return result;
	}
}
