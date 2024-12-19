/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { mkdtempSync, readFileSync, rmdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";

import { ToolTestUtils } from "./ToolTestUtils.js";

/**
 * Test parser execution.
 *
 *  For the non-greedy stuff, the rule is that .* or any other non-greedy loop
 *  (any + or * loop that has an alternative with '.' in it is automatically
 *  non-greedy) never sees past the end of the rule containing that loop.
 *  There is no automatic way to detect when the exit branch of a non-greedy
 *  loop has seen enough input to determine how much the loop should consume
 *  yet still allow matching the entire input. Of course, this is extremely
 *  inefficient, particularly for things like
 *
 *     block : '{' (block|.)* '}' ;
 *
 *  that need only see one symbol to know when it hits a '}'. So, I
 *  came up with a practical solution.  During prediction, the ATN
 *  simulator never fall off the end of a rule to compute the global
 *  FOLLOW. Instead, we terminate the loop, choosing the exit branch.
 *  Otherwise, we predict to reenter the loop.  For example, input
 *  "{ foo }" will allow the loop to match foo, but that's it. During
 *  prediction, the ATN simulator will see that '}' reaches the end of a
 *  rule that contains a non-greedy loop and stop prediction. It will choose
 *  the exit branch of the inner loop. So, the way in which you construct
 *  the rule containing a non-greedy loop dictates how far it will scan ahead.
 *  Include everything after the non-greedy loop that you know it must scan
 *  in order to properly make a prediction decision. these beasts are tricky,
 *  so be careful. don't liberally sprinkle them around your code.
 *
 *  To simulate filter mode, use ( .* (pattern1|pattern2|...) )*
 *
 *  Nongreedy loops match as much input as possible while still allowing
 *  the remaining input to match.
 */
describe("TestParserExec", () => {
    let tempDirPath: string;

    beforeEach(() => {
        tempDirPath = mkdtempSync(join(tmpdir(), "AntlrLexerActions"));
    });

    afterEach(() => {
        rmdirSync(tempDirPath, { recursive: true });
    });

    /**
     * This is a regression test for antlr/antlr4#118.
     * https://github.com/antlr/antlr4/issues/118
     */
    //@Disabled("Performance impact of passing this test may not be worthwhile")
    it.skip("testStartRuleWithoutEOF", async () => {
        const grammar =
            "grammar T;\n" +
            "s @after {this.dumpDFA();}\n" +
            "  : ID | ID INT ID ;\n" +
            "ID : 'a'..'z'+ ;\n" +
            "INT : '0'..'9'+ ;\n" +
            "WS : (' '|'\\t'|'\\n')+ -> skip ;\n";

        let hasErrors = false;
        const output = await ToolTestUtils.captureTerminalOutput(async () => {
            const queue = await ToolTestUtils.execParser("T.g4", grammar, "TParser", "TLexer", "s", "abc 34", false,
                true, tempDirPath);
            hasErrors = queue.errors.length > 0;
        });

        const expecting =
            "Decision 0:\n" +
            "s0-ID->s1\n" +
            "s1-INT->s2\n" +
            "s2-EOF->:s3=>1\n"; // Must point at accept state

        expect(output.output).toEqual(expecting);
        expect(hasErrors).toBe(false);
    });

    /**
     * This is a regression test for antlr/antlr4#588 "ClassCastException during
     * semantic predicate handling".
     * https://github.com/antlr/antlr4/issues/588
     */
    // TODO: port to test framework (can we simplify the Psl grammar?)
    it("testFailedPredicateExceptionState", async () => {
        const url = join(dirname(import.meta.url), "grammars/Psl.g4").substring("file:".length);
        const grammar = readFileSync(url, "utf8");

        let generationErrors = "";
        const output = await ToolTestUtils.captureTerminalOutput(async () => {
            const queue = await ToolTestUtils.execParser("Psl.g4", grammar,
                "PslParser", "PslLexer", "floating_constant", " . 234", false, false, tempDirPath);

            for (const error of queue.errors) {
                const msgST = queue.errorManager.getMessageTemplate(error)!;
                generationErrors += msgST.render();
            }
        });

        expect(generationErrors).toBe("");
        expect(output.output).toEqual("");
        expect(output.error).toBe("line 1:6 rule floating_constant DEC:A floating-point constant cannot have " +
            "internal white space\n");
    });

    /**
     * This is a regression test for antlr/antlr4#563 "Inconsistent token handling in ANTLR4".
     * https://github.com/antlr/antlr4/issues/563
     */
    it("testAlternateQuotes", async () => {
        const lexerGrammar =
            "lexer grammar ModeTagsLexer;\n" +
            "\n" +
            "// Default mode rules (the SEA)\n" +
            "OPEN  : '«'     -> mode(ISLAND) ;       // switch to ISLAND mode\n" +
            "TEXT  : ~'«'+ ;                         // clump all text together\n" +
            "\n" +
            "mode ISLAND;\n" +
            "CLOSE : '»'     -> mode(DEFAULT_MODE) ; // back to SEA mode \n" +
            "SLASH : '/' ;\n" +
            "ID    : [a-zA-Z]+ ;                     // match/send ID in tag to parser\n";
        const parserGrammar =
            "parser grammar ModeTagsParser;\n" +
            "\n" +
            "options { tokenVocab=ModeTagsLexer; } // use tokens from ModeTagsLexer.g4\n" +
            "\n" +
            "file: (tag | TEXT)* ;\n" +
            "\n" +
            "tag : '«' ID '»'\n" +
            "    | '«' '/' ID '»'\n" +
            "    ;";

        let generationErrors = "";
        await ToolTestUtils.captureTerminalOutput(async () => {
            let queue = await ToolTestUtils.execLexer("ModeTagsLexer.g4", lexerGrammar, "ModeTagsLexer", "",
                tempDirPath);
            expect(queue.errors.length).toBe(0);

            queue = await ToolTestUtils.execParser("ModeTagsParser.g4", parserGrammar, "ModeTagsParser",
                "ModeTagsLexer", "file", "", false, false, tempDirPath);
            generationErrors = queue.toString(true);
        });

        expect(generationErrors.length).toBe(0);
    });

    /**
     * This is a regression test for antlr/antlr4#672 "Initialization failed in locals".
     * https://github.com/antlr/antlr4/issues/672
     */
    it("testAttributeValueInitialization", async () => {
        const grammar =
            "grammar Data; \n" +
            "\n" +
            "file : group+ EOF; \n" +
            "\n" +
            "group: INT sequence {console.log($sequence.values.length);} ; \n" +
            "\n" +
            "sequence returns [values: number[] = []] \n" +
            "  locals[localValues: number[] = []]\n" +
            "         : (INT {$localValues.push($INT.int);})* {$values.push(...$localValues);}\n" +
            "; \n" +
            "\n" +
            "INT : [0-9]+ ; // match integers \n" +
            "WS : [ \\t\\n\\r]+ -> skip ; // toss out all whitespace\n";

        const input = "2 9 10 3 1 2 3";
        let generationErrors = "";
        const output = await ToolTestUtils.captureTerminalOutput(async () => {
            const queue = await ToolTestUtils.execParser("Data.g4", grammar, "DataParser", "DataLexer", "file", input,
                false, false, tempDirPath);
            generationErrors = queue.toString(true);
        });

        expect(generationErrors).toBe("");
        expect(output.output).toBe("6\n");
        expect(output.error).toBe("");
    });

    it("testCaseInsensitiveInCombinedGrammar", async () => {
        const grammar =
            "grammar CaseInsensitiveGrammar;\n" +
            "options { caseInsensitive = true; }\n" +
            "e\n" +
            "    : ID\n" +
            "    | 'not' e\n" +
            "    | e 'and' e\n" +
            "    | 'new' ID '(' e ')'\n" +
            "    ;\n" +
            "ID: [a-z_][a-z_0-9]*;\n" +
            "WS: [ \\t\\n\\r]+ -> skip;";

        const input = "NEW Abc (Not a AND not B)";
        let generationErrors = "";
        const output = await ToolTestUtils.captureTerminalOutput(async () => {
            const queue = await ToolTestUtils.execParser("CaseInsensitiveGrammar.g4", grammar,
                "CaseInsensitiveGrammarParser", "CaseInsensitiveGrammarLexer", "e", input, false, false, tempDirPath);
            generationErrors = queue.toString(true);
        });

        expect(generationErrors).toBe("");
        expect(output.output).toBe("");
        expect(output.error).toBe("");
    });
});
