/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { describe, expect, it } from "vitest";

import { ToolTestUtils } from "./ToolTestUtils.js";

describe("TestDollarParser", () => {
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

            const errors = await ToolTestUtils.execParser("T.g4", grammar, "TParser", "TLexer", "a", "x", true);
            expect(output.includes("input")).toBe(true);
            expect(errors).toHaveLength(0);
        } finally {
            console.log = orgLog;
        }
    });
});
