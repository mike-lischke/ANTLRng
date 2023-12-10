


import { java, type int } from "jree";
import { BaseErrorListener, RecognitionException, Recognizer } from "antlr4ng";

type PrintStream = java.io.PrintStream;
const PrintStream = java.io.PrintStream;
type String = java.lang.String;
const String = java.lang.String;

import { Test, Override } from "../../../../../../../../decorators.js";


export  class CustomStreamErrorListener extends BaseErrorListener {
	private readonly  printStream;

	public  constructor(printStream: PrintStream){
		super();
this.printStream = printStream;
	}

	@Override
public override  syntaxError(recognizer: Recognizer<unknown, unknown>,
							offendingSymbol: java.lang.Object,
							line: int,
							charPositionInLine: int,
							msg: String,
							e: RecognitionException):  void {
		this.printStream.println("line " + line + ":" + charPositionInLine + " " + msg);
	}
}
