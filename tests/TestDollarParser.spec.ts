/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { mkdirSync, rmdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { ToolTestUtils } from "./ToolTestUtils.js";

describe("TestDollarParser", () => {
    let tempDirPath: string;

    beforeEach(() => {
        tempDirPath = join(tmpdir(), "AntlrComposite" + Date.now().toString());
        mkdirSync(tempDirPath, { recursive: true });
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
