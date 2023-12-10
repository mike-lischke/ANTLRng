


import { java } from "jree";
import { Parser, TokenStream } from "antlr4ng";

type System = java.lang.System;
const System = java.lang.System;

import { Test, Override } from "../../../../../../../../decorators.js";


export abstract  class RuntimeTestParser extends Parser {
	protected  outStream = System.out;

	public  constructor(input: TokenStream) {
		super(input);
	}

	public  setOutStream(outStream: java.io.PrintStream):  void {
		this.outStream = outStream;
	}
}
