/* java2ts: keep */

/*
 * Copyright (c) 2012-2022 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import fs from "fs";

import { InterpreterDataReader } from "antlr4ng";

import { Test } from "../../utils/decorators.js";
import { assertEquals } from "../../utils/junit.js";

/**
 * This file represents a simple sanity checks on the parsing of the .interp file
 *  available to the Java runtime for interpreting rather than compiling and executing parsers.
 */
export class TestInterpreterDataReader {
    @Test
    public testLexerFile(): void {
        const content = fs.readFileSync("runtime-testsuite/generated/VisitorCalcLexer.interp", "utf-8");

        const interpreterData = InterpreterDataReader.parseInterpreterData(content);

        assertEquals(6, interpreterData.vocabulary.getMaxTokenType());
        assertEquals(["INT", "MUL", "DIV", "ADD", "SUB", "WS"], interpreterData.ruleNames);
        assertEquals([null, null, "'*'", "'/'", "'+'", "'-'", null], interpreterData.vocabulary.getLiteralNames());
        assertEquals([null, "INT", "MUL", "DIV", "ADD", "SUB", "WS"], interpreterData.vocabulary.getSymbolicNames());
        assertEquals(["DEFAULT_TOKEN_CHANNEL", "HIDDEN"], interpreterData.channels);
        assertEquals(["DEFAULT_MODE"], interpreterData.modes);
    }

    @Test
    public testParserFile(): void {
        const content = fs.readFileSync("runtime-testsuite/generated/VisitorCalc.interp", "utf-8");

        const interpreterData = InterpreterDataReader.parseInterpreterData(content);

        assertEquals(6, interpreterData.vocabulary.getMaxTokenType());
        assertEquals(["s", "expr"], interpreterData.ruleNames);
        assertEquals([null, null, "'*'", "'/'", "'+'", "'-'", null], interpreterData.vocabulary.getLiteralNames());
        assertEquals([null, "INT", "MUL", "DIV", "ADD", "SUB", "WS"], interpreterData.vocabulary.getSymbolicNames());
    }

}
