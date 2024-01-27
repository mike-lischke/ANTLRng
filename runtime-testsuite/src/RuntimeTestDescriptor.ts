/* java2ts: keep */

/*
 * Copyright (c) 2012-2022 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { GrammarType } from "./GrammarType.js";

/**
 * This object represents all the information we need about a single test and is the
 * in-memory representation of a descriptor file
 */
export class RuntimeTestDescriptor {
    /** A type in {"Lexer", "Parser", "CompositeLexer", "CompositeParser"} */
    public readonly testType: GrammarType;

    /**
     * Return a string representing the name of the target currently testing
     *  this descriptor.
     *  Multiple instances of the same descriptor class
     *  can be created to test different targets.
     */
    public readonly name: string;

    public readonly notes: string;

    /** Parser input. Return "" if not input should be provided to the parser or lexer. */
    public readonly input: string;

    /** Output from executing the parser. Return null if no output is expected. */
    public readonly output: string;

    /** Parse errors Return null if no errors are expected. */
    public readonly errors: string;

    /** The rule at which parsing should start */
    public readonly startRule: string | null;
    public readonly grammarName: string;

    public readonly grammar: string;
    /** List of grammars imported into the grammar */
    public readonly slaveGrammars: Array<[string, string]> | null;

    /** For lexical tests, dump the DFA of the default lexer mode to stdout */
    public readonly showDFA: boolean;

    /** For parsing, engage the DiagnosticErrorListener, dumping results to stderr */
    public readonly showDiagnosticErrors: boolean;

    public readonly traceATN: boolean;

    public readonly predictionMode: string;

    public readonly buildParseTree: boolean;

    public readonly skipTargets: string[];

    public readonly path: string | null;

    public constructor(testType: GrammarType, name: string, notes: string,
        input: string, output: string, errors: string,
        startRule: string | null,
        grammarName: string, grammar: string, slaveGrammars: Array<[string, string]> | null,
        showDiagnosticErrors: boolean, traceATN: boolean, showDFA: boolean, predictionMode: string,
        buildParseTree: boolean, skipTargets: string[] | null, path: string | null) {
        this.testType = testType;
        this.name = name;
        this.notes = notes;
        this.input = input;
        this.output = output;
        this.errors = errors;
        this.startRule = startRule;
        this.grammarName = grammarName;
        this.grammar = grammar;
        this.slaveGrammars = slaveGrammars;
        this.showDFA = showDFA;
        this.showDiagnosticErrors = showDiagnosticErrors;
        this.traceATN = traceATN;
        this.predictionMode = predictionMode;
        this.buildParseTree = buildParseTree;
        this.skipTargets = skipTargets !== null ? skipTargets : new Array<string>(0);
        this.path = path;
    }

    /**
     * @returns true if this test should be ignored for the indicated target
     * @param targetName The name of the target to check.
     */
    public ignore(targetName: string): boolean {
        return this.skipTargets.indexOf(targetName) !== -1;
    }

    public toString(): string {
        return this.name;
    }
}
