


import { java } from "jree";
import { CharStream, Lexer } from "antlr4ng";

type System = java.lang.System;
const System = java.lang.System;

import { Test, Override } from "../../../../../../../../decorators.js";


export abstract  class RuntimeTestLexer extends Lexer {
	protected  outStream = System.out;

	public  constructor(input: CharStream) { super(input); }

	public  setOutStream(outStream: java.io.PrintStream):  void { this.outStream = outStream; }
}
