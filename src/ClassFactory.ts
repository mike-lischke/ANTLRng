/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import type { ATN, CharStream, TokenStream } from "antlr4ng";

import type { GrammarRootAST } from "./tool/ast/GrammarRootAST.js";
import type {
    IGrammar, IGrammarASTAdaptor, IGrammarParserInterpreter, IGrammarRootAST, ILexerGrammar, IParserATNFactory, ITool
} from "./types.js";

/** A collection of factory methods for certain class instances in the tool, to break circular dependencies. */
export class ClassFactory {
    public static createGrammar: (tool: ITool, tree: GrammarRootAST) => IGrammar;
    public static createLexerGrammar: (tool: ITool, tree: GrammarRootAST) => ILexerGrammar;
    public static createGrammarRootAST: () => IGrammarRootAST;
    public static createGrammarASTAdaptor: (input?: CharStream) => IGrammarASTAdaptor;
    public static createParserATNFactory: (g: IGrammar) => IParserATNFactory;
    public static createGrammarParserInterpreter: (g: IGrammar, atn: ATN,
        input: TokenStream) => IGrammarParserInterpreter;
    public static createTool: () => ITool;
}
