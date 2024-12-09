/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { mkdtempSync, rmdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { ToolTestUtils } from "./ToolTestUtils.js";

describe("TestDollarParser", () => {
    let tempDirPath: string;

    beforeEach(() => {
        tempDirPath = mkdtempSync(join(tmpdir(), "AntlrDollarParser"));
    });

    afterEach(() => {
        rmdirSync(tempDirPath, { recursive: true });
    });

    it("testSimpleCall", async () => {
        const orgLog = console.log;
        let output = "";
        console.log = (str) => {
            output += str;
        };

        try {
            const grammar = "grammar T;\n" +
                "a : ID  { console.log($parser.getSourceName()); }\n" +
                "  ;\n" +
                "ID : 'a'..'z'+ ;\n";

            const errors = await ToolTestUtils.execParser("T.g4", grammar, "TParser", "TLexer", "a", "x", true,
                tempDirPath);
            expect(output.includes("input")).toBe(true);
            expect(errors.all).toHaveLength(0);
        } finally {
            console.log = orgLog;
        }
    });
});
