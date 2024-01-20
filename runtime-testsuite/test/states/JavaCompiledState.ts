/* java2ts: keep */

/*
 * Copyright (c) 2012-2022 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { GeneratedState } from "./GeneratedState.js";
import { CompiledState } from "./CompiledState.js";
import { Parser, Lexer, CommonTokenStream, CharStreams } from "antlr4ng";
import { RuntimeRunner } from "../RuntimeRunner.js";

export class JavaCompiledState extends CompiledState {
    /*public readonly loader: ClassLoader;
    public readonly lexer: Class<Lexer>;
    public readonly parser: Class<Parser>;*/

    public constructor(previousState: GeneratedState,
        /*loader: ClassLoader,
        lexer: Class<Lexer>,
        parser: Class<Parser>,*/
        exception: Error,
    ) {
        super(previousState, exception);
        /*this.loader = loader;
        this.lexer = lexer;
        this.parser = parser;*/
    }

    /*public initializeDummyLexerAndParser(): Pair<Lexer, Parser> {
        return this.initializeLexerAndParser("");
    }

    public initializeLexerAndParser(input: String): Pair<Lexer, Parser> {
        const lexer = this.initializeLexer(input);
        const parser = this.initializeParser(new CommonTokenStream(lexer));

        return new Pair(lexer, parser);
    }

    public initializeLexer(input: String): Lexer {
        const inputString = CharStreams.fromString(input, RuntimeRunner.InputFileName);

        return this.lexer.getConstructor(CharStream.class).newInstance(inputString);
    }

    public initializeParser(tokenStream: CommonTokenStream): Parser {
        return this.parser.getConstructor(TokenStream.class).newInstance(tokenStream);
    }*/
}
