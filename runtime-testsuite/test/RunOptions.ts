/*
 * Copyright (c) 2012-2022 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { JavaObject, java } from "jree";
import { Stage } from "./Stage.js";
import { PredictionMode } from "antlr4ng";

type String = java.lang.String;
const String = java.lang.String;

import { Test, Override } from "../decorators.js";

export class RunOptions extends JavaObject {
    public readonly grammarFileName: String;
    public readonly grammarStr: String;
    public readonly parserName: String;
    public readonly lexerName: String;
    public readonly grammarName: String;
    public readonly useListener: boolean;
    public readonly useVisitor: boolean;
    public readonly startRuleName: String;
    public readonly input: String;
    public readonly profile: boolean;
    public readonly showDiagnosticErrors: boolean;
    public readonly traceATN: boolean;
    public readonly showDFA: boolean;
    public readonly endStage: Stage;
    public readonly superClass: String;
    public readonly predictionMode: PredictionMode;
    public readonly buildParseTree: boolean;

    public constructor(grammarFileName: String, grammarStr: String, parserName: String, lexerName: String,
        useListener: boolean, useVisitor: boolean, startRuleName: String,
        input: String, profile: boolean, showDiagnosticErrors: boolean,
        traceATN: boolean, showDFA: boolean, endStage: Stage,
        language: String, superClass: String, predictionMode: PredictionMode, buildParseTree: boolean) {
        super();
        this.grammarFileName = grammarFileName;
        this.grammarStr = grammarStr;
        this.parserName = parserName;
        this.lexerName = lexerName;
        let grammarName = null;
        const isCombinedGrammar = lexerName !== null && parserName !== null || language.equals("Go");
        if (isCombinedGrammar) {
            if (parserName !== null) {
                grammarName = parserName.endsWith("Parser")
                    ? parserName.substring(0, parserName.length() - "Parser".length())
                    : parserName;
            }
            else {
                if (lexerName !== null) {
                    grammarName = lexerName.endsWith("Lexer")
                        ? lexerName.substring(0, lexerName.length() - "Lexer".length())
                        : lexerName;
                }
            }

        }
        else {
            if (parserName !== null) {
                grammarName = parserName;
            }
            else {
                grammarName = lexerName;
            }
        }
        this.grammarName = grammarName;
        this.useListener = useListener;
        this.useVisitor = useVisitor;
        this.startRuleName = startRuleName;
        this.input = input;
        this.profile = profile;
        this.showDiagnosticErrors = showDiagnosticErrors;
        this.traceATN = traceATN;
        this.showDFA = showDFA;
        this.endStage = endStage;
        this.superClass = superClass;
        this.predictionMode = predictionMode;
        this.buildParseTree = buildParseTree;
    }
}
