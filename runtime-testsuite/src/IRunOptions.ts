/* java2ts: keep */

/*
 * Copyright (c) 2012-2022 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { Stage } from "./Stage.js";

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
    endStage: Stage;
    superClass?: string;
    predictionMode: string;
    buildParseTree: boolean;

}
