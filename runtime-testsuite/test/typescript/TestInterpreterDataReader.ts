/* java2ts: keep */

/*
 * Copyright (c) 2012-2022 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import fs from "fs";

import { InterpreterDataReader } from "antlr4ng";

import { Test } from "../../decorators.js";
import { assertEquals, assertNull } from "../../junit.js";

/**
 * This file represents a simple sanity checks on the parsing of the .interp file
 *  available to the Java runtime for interpreting rather than compiling and executing parsers.
 */
export class TestInterpreterDataReader {
    @Test
    public testLexerFile(): void {
        const content = fs.readFileSync("runtime-testsuite/test/generated/VisitorBasicLexer.interp", "utf-8");

        const interpreterData = InterpreterDataReader.parseInterpreterData(content);

        assertEquals(6, interpreterData.vocabulary.getMaxTokenType());
        assertEquals(["A"], interpreterData.ruleNames);
        assertEquals([null, "A"], interpreterData.vocabulary.getLiteralNames());
        assertEquals([null, "A"], interpreterData.vocabulary.getSymbolicNames());
        assertEquals(["DEFAULT_TOKEN_CHANNEL", "HIDDEN"], interpreterData.channels);
        assertEquals(["DEFAULT_MODE"], interpreterData.modes);

        const states = interpreterData.atn.states.map((state) => { return state?.stateNumber; });
        assertEquals([4, 0, 1, 5, 6, -1, 2, 0, 7, 0, 1, 0, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 4, 0, 1, 1, 0, 0, 0, 1, 3, 1,
            0, 0, 0, 3, 4, 5, 65, 0, 0, 4, 2, 1, 0, 0, 0, 1, 0, 0], states);
    }

    @Test
    public testParserFile(): void {
        const content = fs.readFileSync("runtime-testsuite/test/generated/VisitorBasic.interp", "utf-8");

        const interpreterData = InterpreterDataReader.parseInterpreterData(content);

        assertEquals(6, interpreterData.vocabulary.getMaxTokenType());
        assertEquals(["s"], interpreterData.ruleNames);
        assertEquals([null, "A"], interpreterData.vocabulary.getLiteralNames());
        assertEquals([null, "A"], interpreterData.vocabulary.getSymbolicNames());
        assertNull(interpreterData.channels ?? null);
        assertNull(interpreterData.modes ?? null);

        const states = interpreterData.atn.states.map((state) => { return state?.stateNumber; });
        assertEquals([4, 1, 1, 6, 2, 0, 7, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 4, 0, 2, 1, 0, 0, 0, 2, 3, 5, 1,
            0, 0, 3, 4, 5, 0, 0, 1, 4, 1, 1, 0, 0, 0, 0], states);
    }

}
