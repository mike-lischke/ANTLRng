/*
 * Copyright (c) 2012-2022 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */




import { java } from "jree";
import { GeneratedState } from "./GeneratedState.js";
import { CompiledState } from "./CompiledState.js";
import { TokenStream, Parser, Lexer, CommonTokenStream, CharStreams, CharStream, Pair } from "antlr4ng";
import { RuntimeRunner } from "../RuntimeRunner.js";

type ClassLoader = java.lang.ClassLoader;
const ClassLoader = java.lang.ClassLoader;
type Class<T> = java.lang.Class<T>;
const Class = java.lang.Class;
type Exception = java.lang.Exception;
const Exception = java.lang.Exception;
type String = java.lang.String;
const String = java.lang.String;

import { Test, Override } from "../../../../../../../decorators.js";


export  class JavaCompiledState extends CompiledState {
	public readonly  loader:  ClassLoader;
	public readonly  lexer:  Class< Lexer>;
	public readonly  parser:  Class< Parser>;

	public  constructor(previousState: GeneratedState,
							 loader: ClassLoader,
							 lexer: Class< Lexer>,
							 parser: Class< Parser>,
							 exception: Exception
	) {
		super(previousState, exception);
		this.loader = loader;
		this.lexer = lexer;
		this.parser = parser;
	}

	public  initializeDummyLexerAndParser():  Pair<Lexer, Parser> {
		return this.initializeLexerAndParser("");
	}

	public  initializeLexerAndParser(input: String):  Pair<Lexer, Parser> {
		let  lexer = this.initializeLexer(input);
		let  parser = this.initializeParser(new  CommonTokenStream(lexer));
		return new  Pair(lexer, parser);
	}

	public  initializeLexer(input: String):  Lexer {
		let  inputString = CharStreams.fromString(input, RuntimeRunner.InputFileName);
		return this.lexer.getConstructor(CharStream.class).newInstance(inputString);
	}

	public  initializeParser(tokenStream: CommonTokenStream):  Parser {
		return this.parser.getConstructor(TokenStream.class).newInstance(tokenStream);
	}
}
