/* java2ts: keep */

/*
 * Copyright (c) 2012-2022 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { Stage } from "./Stage.js";
import { PredictionMode } from "antlr4ng";

export class RunOptions {
    public readonly grammarFileName: string;
    public readonly grammarStr: string;
    public readonly parserName: string | null;
    public readonly lexerName: string | null;
    public readonly grammarName: string | null;
    public readonly useListener: boolean;
    public readonly useVisitor: boolean;
    public readonly startRuleName: string | null;
    public readonly input: string;
    public readonly profile: boolean;
    public readonly showDiagnosticErrors: boolean;
    public readonly traceATN: boolean;
    public readonly showDFA: boolean;
    public readonly endStage: Stage;
    public readonly superClass: string | null;
    public readonly predictionMode: PredictionMode;
    public readonly buildParseTree: boolean;

    public constructor(grammarFileName: string, grammarStr: string, parserName: string | null, lexerName: string | null,
        useListener: boolean, useVisitor: boolean, startRuleName: string | null,
        input: string, profile: boolean, showDiagnosticErrors: boolean,
        traceATN: boolean, showDFA: boolean, endStage: Stage,
        language: string, superClass: string | null, predictionMode: PredictionMode, buildParseTree: boolean) {
        this.grammarFileName = grammarFileName;
        this.grammarStr = grammarStr;
        this.parserName = parserName;
        this.lexerName = lexerName;
        let grammarName = null;

        const isCombinedGrammar = ((lexerName !== null) && (parserName !== null)) || language === "Go";
        if (isCombinedGrammar) {
            if (parserName !== null) {
                grammarName = parserName.endsWith("Parser")
                    ? parserName.substring(0, parserName.length - "Parser".length)
                    : parserName;
            }
            else {
                if (lexerName !== null) {
                    grammarName = lexerName.endsWith("Lexer")
                        ? lexerName.substring(0, lexerName.length - "Lexer".length)
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
