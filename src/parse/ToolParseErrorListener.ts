/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import {
    BaseErrorListener, type ATNSimulator, type RecognitionException, type Recognizer, type Token
} from "antlr4ng";
import type { Tool } from "../Tool.js";
import { ErrorType } from "../tool/ErrorType.js";

export class ToolParseErrorListener extends BaseErrorListener {
    public constructor(private tool: Tool) {
        super();
    }

    public override syntaxError<S extends Token, T extends ATNSimulator>(recognizer: Recognizer<T>,
        offendingSymbol: S | null, line: number, charPositionInLine: number, msg: string,
        e: RecognitionException | null): void {
        const sourceName = recognizer.inputStream?.getSourceName() ?? "<unknown>";
        this.tool.errorManager.syntaxError(ErrorType.SYNTAX_ERROR, sourceName, offendingSymbol!, e!, [msg]);
    }
}
