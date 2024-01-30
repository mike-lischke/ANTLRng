/*
 * Copyright (c) 2012-2022 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

export interface IRunOptions {
    grammarFileName: string;
    grammarStr: string;
    parserName?: string;
    lexerName?: string;
    grammarName?: string;
    useListener: boolean;
    useVisitor: boolean;
    startRuleName?: string;
    input: string;
    profile: boolean;
    showDiagnosticErrors: boolean;
    traceATN: boolean;
    showDFA: boolean;
    superClass?: string;
    predictionMode: string;
    buildParseTree: boolean;

}

/**
 * This interface represents all the information we need about a single test and is the
 * in-memory representation of a descriptor file
 */
export interface IRuntimeTestDescriptor {
    /** A type in {"Lexer", "Parser", "CompositeLexer", "CompositeParser"} */
    testType: GrammarType;

    /**
     * Return a string representing the name of the target currently testing
     *  this descriptor.
     *  Multiple instances of the same descriptor class
     *  can be created to test different targets.
     */
    name: string;

    notes: string;

    /** Parser input. Return "" if not input should be provided to the parser or lexer. */
    input: string;

    /** Output from executing the parser. Return null if no output is expected. */
    output: string;

    /** Parse errors Return null if no errors are expected. */
    errors: string;

    /** The rule at which parsing should start */
    startRule?: string;

    grammarName: string;
    grammar: string;

    /** List of grammars imported into the grammar */
    slaveGrammars?: Array<[string, string]>;

    /** For lexical tests, dump the DFA of the default lexer mode to stdout */
    showDFA: boolean;

    /** For parsing, engage the DiagnosticErrorListener, dumping results to stderr */
    showDiagnosticErrors: boolean;

    traceATN: boolean;
    predictionMode: string;
    buildParseTree: boolean;
    skipTargets?: Set<string>;
    path?: string;
}

export enum GrammarType {
    Lexer,
    Parser,
    CompositeLexer,
    CompositeParser,
}
