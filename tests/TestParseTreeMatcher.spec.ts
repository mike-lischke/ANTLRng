/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { mkdtempSync, rmdirSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import {
    InputMismatchException, NoViableAltException, ParseTreeMatch, ParseTreePatternMatcher,
    StartRuleDoesNotConsumeFullPatternError, type ParseTree
} from "antlr4ng";

import { ToolTestUtils } from "./ToolTestUtils.js";
import { convertArrayToString } from "./support/test-helpers.js";

describe("TestParseTreeMatcher", () => {
    let tempDirPath: string;

    beforeEach(() => {
        tempDirPath = mkdtempSync(join(tmpdir(), "AntlrParseTreeMatcher"));
    });

    afterEach(() => {
        rmdirSync(tempDirPath, { recursive: true });
    });

    const checkPatternMatch = async (grammar: string, startRule: string, input: string, pattern: string,
        grammarName: string, invertMatch?: boolean): Promise<ParseTreeMatch> => {
        invertMatch ??= false;

        const grammarFileName = grammarName + ".g4";
        const parserName = grammarName + "Parser";
        const lexerName = grammarName + "Lexer";
        const runOptions = ToolTestUtils.createOptionsForToolTests(grammarFileName, grammar, parserName, lexerName,
            false, false, startRule, input, false, false);

        const [_, parser] = await ToolTestUtils.setupRecognizers(runOptions, tempDirPath);
        const parseTree = ToolTestUtils.callParserMethod(parser, startRule) as ParseTree;
        const p = parser.compileParseTreePattern(pattern, parser.getRuleIndex(startRule));

        const match = p.match(parseTree);
        const matched = match.succeeded();
        expect(matched).toBe(!invertMatch);

        return match;
    };

    const getPatternMatcher = async (grammarFileName: string, grammar: string, parserName: string, lexerName: string,
        startRule: string): Promise<ParseTreePatternMatcher> => {
        const runOptions = ToolTestUtils.createOptionsForToolTests(grammarFileName, grammar, parserName, lexerName,
            false, false, startRule, "", false, false);
        const [lexer, parser] = await ToolTestUtils.setupRecognizers(runOptions, tempDirPath);

        return new ParseTreePatternMatcher(lexer, parser);
    };

    it("testChunking", () => {
        const m = new ParseTreePatternMatcher(null, null);
        expect(convertArrayToString(m.split("<ID> = <expr> ;"))).toBe("[ID, ' = ', expr, ' ;']");
        expect(convertArrayToString(m.split(" <ID> = <expr>"))).toBe("[' ', ID, ' = ', expr]");
        expect(convertArrayToString(m.split("<ID> = <expr>"))).toBe("[ID, ' = ', expr]");
        expect(convertArrayToString(m.split("<expr>"))).toBe("[expr]");
        expect(convertArrayToString(m.split("\\<x\\> foo"))).toBe("['<x> foo']");
        expect(convertArrayToString(m.split("foo \\<x\\> bar <tag>"))).toBe("['foo <x> bar ', tag]");
    });

    it("testDelimiters", () => {
        const m = new ParseTreePatternMatcher(null, null);
        m.setDelimiters("<<", ">>", "$");
        const result = convertArrayToString(m.split("<<ID>> = <<expr>> ;$<< ick $>>"));
        expect(result).toBe("[ID, ' = ', expr, ' ;<< ick >>']");
    });

    it("testInvertedTags", () => {
        const m = new ParseTreePatternMatcher(null, null);
        const expected = "tag delimiters out of order in pattern: >expr<";
        expect(() => {
            m.split(">expr<");
        }).toThrow(expected);
    });

    it("testUnclosedTag", () => {
        const m = new ParseTreePatternMatcher(null, null);
        const expected = "unterminated tag in pattern: <expr hi mom";
        expect(() => {
            m.split("<expr hi mom");
        }).toThrow(expected);
    });

    it("testExtraClose", () => {
        const m = new ParseTreePatternMatcher(null, null);
        const expected = "missing start tag in pattern: <expr> >";
        expect(() => {
            m.split("<expr> >");
        }).toThrow(expected);
    });

    it("testTokenizingPattern", async () => {
        const grammar =
            "grammar X1;\n" +
            "s : ID '=' expr ';' ;\n" +
            "expr : ID | INT ;\n" +
            "ID : [a-z]+ ;\n" +
            "INT : [0-9]+ ;\n" +
            "WS : [ \\r\\n\\t]+ -> skip ;\n";
        const m = await getPatternMatcher("X1.g4", grammar, "X1Parser", "X1Lexer", "s");

        const tokens = m.tokenize("<ID> = <expr> ;");
        expect(convertArrayToString(tokens))
            .toBe("[ID:3, [@-1,1:1='=',<1>,1:1], expr:7, [@-1,1:1=';',<2>,1:1]]");
    });

    it("testCompilingPattern", async () => {
        const grammar =
            "grammar X2;\n" +
            "s : ID '=' expr ';' ;\n" +
            "expr : ID | INT ;\n" +
            "ID : [a-z]+ ;\n" +
            "INT : [0-9]+ ;\n" +
            "WS : [ \\r\\n\\t]+ -> skip ;\n";
        const m = await getPatternMatcher("X2.g4", grammar, "X2Parser", "X2Lexer", "s");

        const t = m.compile("<ID> = <expr> ;", m.getParser()!.getRuleIndex("s"));
        expect(t.getPatternTree().toStringTree(m.getParser()!)).toBe("(s <ID> = (expr <expr>) ;)");
    });

    it("testCompilingPatternConsumesAllTokens", async () => {
        const grammar =
            "grammar X2;\n" +
            "s : ID '=' expr ';' ;\n" +
            "expr : ID | INT ;\n" +
            "ID : [a-z]+ ;\n" +
            "INT : [0-9]+ ;\n" +
            "WS : [ \\r\\n\\t]+ -> skip ;\n";
        const m = await getPatternMatcher("X2.g4", grammar, "X2Parser", "X2Lexer", "s");
        expect(() => {
            m.compile("<ID> = <expr> ; extra", m.getParser()!.getRuleIndex("s"));
        }).toThrow(StartRuleDoesNotConsumeFullPatternError);
    });

    it("testPatternMatchesStartRule", async () => {
        const grammar =
            "grammar X2;\n" +
            "s : ID '=' expr ';' ;\n" +
            "expr : ID | INT ;\n" +
            "ID : [a-z]+ ;\n" +
            "INT : [0-9]+ ;\n" +
            "WS : [ \\r\\n\\t]+ -> skip ;\n";
        const m = await getPatternMatcher("X2.g4", grammar, "X2Parser", "X2Lexer", "s");
        expect(() => {
            m.compile("<ID> ;", m.getParser()!.getRuleIndex("s"));
        }).toThrow(InputMismatchException);
    });

    it("testPatternMatchesStartRule2", async () => {
        const grammar =
            "grammar X2;\n" +
            "s : ID '=' expr ';' | expr ';' ;\n" +
            "expr : ID | INT ;\n" +
            "ID : [a-z]+ ;\n" +
            "INT : [0-9]+ ;\n" +
            "WS : [ \\r\\n\\t]+ -> skip ;\n";
        const m = await getPatternMatcher("X2.g4", grammar, "X2Parser", "X2Lexer", "s");
        expect(() => {
            m.compile("<ID> <ID> ;", m.getParser()!.getRuleIndex("s"));
        }).toThrow(NoViableAltException);
    });

    it("testHiddenTokensNotSeenByTreePatternParser", async () => {
        const grammar =
            "grammar X2;\n" +
            "s : ID '=' expr ';' ;\n" +
            "expr : ID | INT ;\n" +
            "ID : [a-z]+ ;\n" +
            "INT : [0-9]+ ;\n" +
            "WS : [ \\r\\n\\t]+ -> channel(HIDDEN) ;\n";
        const m = await getPatternMatcher("X2.g4", grammar, "X2Parser", "X2Lexer", "s");

        const t = m.compile("<ID> = <expr> ;", m.getParser()!.getRuleIndex("s"));
        expect(t.getPatternTree().toStringTree(m.getParser()!)).toBe("(s <ID> = (expr <expr>) ;)");
    });

    it("testCompilingMultipleTokens", async () => {
        const grammar =
            "grammar X2;\n" +
            "s : ID '=' ID ';' ;\n" +
            "ID : [a-z]+ ;\n" +
            "WS : [ \\r\\n\\t]+ -> skip ;\n";
        const m = await getPatternMatcher("X2.g4", grammar, "X2Parser", "X2Lexer", "s");

        const t = m.compile("<ID> = <ID> ;", m.getParser()!.getRuleIndex("s"));
        const results = t.getPatternTree().toStringTree(m.getParser()!);
        const expected = "(s <ID> = <ID> ;)";
        expect(results).toBe(expected);
    });

    it("testIDNodeMatches", async () => {
        const grammar =
            "grammar X3;\n" +
            "s : ID ';' ;\n" +
            "ID : [a-z]+ ;\n" +
            "WS : [ \\r\\n\\t]+ -> skip ;\n";

        const input = "x ;";
        const pattern = "<ID>;";
        await checkPatternMatch(grammar, "s", input, pattern, "X3");
    });

    it("testIDNodeWithLabelMatches", async () => {
        const grammar =
            "grammar X8;\n" +
            "s : ID ';' ;\n" +
            "ID : [a-z]+ ;\n" +
            "WS : [ \\r\\n\\t]+ -> skip ;\n";

        const input = "x ;";
        const pattern = "<id:ID>;";
        const m = await checkPatternMatch(grammar, "s", input, pattern, "X8");
        expect(m.getLabels().toString()).toBe("{ID=[x], id=[x]}");
        expect(m.get("id")).not.toBeNull();
        expect(m.get("ID")).not.toBeNull();
        expect(m.get("id")?.getText()).toBe("x");
        expect(m.get("ID")?.getText()).toBe("x");
        expect(convertArrayToString(m.getAll("id"))).toBe("[x]");
        expect(convertArrayToString(m.getAll("ID"))).toBe("[x]");

        expect(m.get("undefined")).toBeNull();
        expect(convertArrayToString(m.getAll("undefined"))).toBe("[]");
    });

    it("testLabelGetsLastIDNode", async () => {
        const grammar =
            "grammar X9;\n" +
            "s : ID ID ';' ;\n" +
            "ID : [a-z]+ ;\n" +
            "WS : [ \\r\\n\\t]+ -> skip ;\n";

        const input = "x y;";
        const pattern = "<id:ID> <id:ID>;";
        const m = await checkPatternMatch(grammar, "s", input, pattern, "X9");
        expect(m.getLabels().toString()).toBe("{ID=[x, y], id=[x, y]}");
        expect(m.get("id")).not.toBeNull();
        expect(m.get("ID")).not.toBeNull();
        expect(m.get("id")?.getText()).toBe("y");
        expect(m.get("ID")?.getText()).toBe("y");
        expect(convertArrayToString(m.getAll("id"))).toBe("[x, y]");
        expect(convertArrayToString(m.getAll("ID"))).toBe("[x, y]");

        expect(m.get("undefined")).toBeNull();
        expect("[]", m.getAll("undefined").toString());
    });

    it("testIDNodeWithMultipleLabelMatches", async () => {
        const grammar =
            "grammar X7;\n" +
            "s : ID ID ID ';' ;\n" +
            "ID : [a-z]+ ;\n" +
            "WS : [ \\r\\n\\t]+ -> skip ;\n";

        const input = "x y z;";
        const pattern = "<a:ID> <b:ID> <a:ID>;";
        const m = await checkPatternMatch(grammar, "s", input, pattern, "X7");
        expect(m.getLabels().toString()).toBe("{ID=[x, y, z], a=[x, z], b=[y]}");
        expect(m.get("a")).not.toBeNull();
        expect(m.get("b")).not.toBeNull();
        expect(m.get("ID")).not.toBeNull();
        expect(m.get("a")?.getText()).toBe("z");
        expect(m.get("b")?.getText()).toBe("y");
        expect(m.get("ID")?.getText()).toBe("z");
        expect(convertArrayToString(m.getAll("a"))).toBe("[x, z]");
        expect(convertArrayToString(m.getAll("b"))).toBe("[y]");
        expect(convertArrayToString(m.getAll("ID"))).toBe("[x, y, z]"); // ordered

        expect(m.getTree().getText()).toBe("xyz;"); // whitespace stripped by lexer

        expect(m.get("undefined")).toBeNull();
        expect(convertArrayToString(m.getAll("undefined"))).toBe("[]");
    });

    it("testTokenAndRuleMatch", async () => {
        const grammar =
            "grammar X4;\n" +
            "s : ID '=' expr ';' ;\n" +
            "expr : ID | INT ;\n" +
            "ID : [a-z]+ ;\n" +
            "INT : [0-9]+ ;\n" +
            "WS : [ \\r\\n\\t]+ -> skip ;\n";

        const input = "x = 99;";
        const pattern = "<ID> = <expr> ;";
        await checkPatternMatch(grammar, "s", input, pattern, "X4");
    });

    it("testTokenTextMatch", async () => {
        const grammar =
            "grammar X4;\n" +
            "s : ID '=' expr ';' ;\n" +
            "expr : ID | INT ;\n" +
            "ID : [a-z]+ ;\n" +
            "INT : [0-9]+ ;\n" +
            "WS : [ \\r\\n\\t]+ -> skip ;\n";

        let input = "x = 0;";
        let pattern = "<ID> = 1;";
        let invertMatch = true; // 0!=1
        await checkPatternMatch(grammar, "s", input, pattern, "X4", invertMatch);

        input = "x = 0;";
        pattern = "<ID> = 0;";
        invertMatch = false;
        await checkPatternMatch(grammar, "s", input, pattern, "X4", invertMatch);

        input = "x = 0;";
        pattern = "x = 0;";
        invertMatch = false;
        await checkPatternMatch(grammar, "s", input, pattern, "X4", invertMatch);

        input = "x = 0;";
        pattern = "y = 0;";
        invertMatch = true;
        await checkPatternMatch(grammar, "s", input, pattern, "X4", invertMatch);
    });

    it("testAssign", async () => {
        const grammar =
            "grammar X5;\n" +
            "s   : expr ';'\n" +
            //"    | 'return' expr ';'\n" +
            "    ;\n" +
            "expr: expr '.' ID\n" +
            "    | expr '*' expr\n" +
            "    | expr '=' expr\n" +
            "    | ID\n" +
            "    | INT\n" +
            "    ;\n" +
            "ID : [a-z]+ ;\n" +
            "INT : [0-9]+ ;\n" +
            "WS : [ \\r\\n\\t]+ -> skip ;\n";

        const input = "x = 99;";
        const pattern = "<ID> = <expr>;";
        await checkPatternMatch(grammar, "s", input, pattern, "X5");
    });

    it("testLRecursiveExpr", async () => {
        const grammar =
            "grammar X6;\n" +
            "s   : expr ';'\n" +
            "    ;\n" +
            "expr: expr '.' ID\n" +
            "    | expr '*' expr\n" +
            "    | expr '=' expr\n" +
            "    | ID\n" +
            "    | INT\n" +
            "    ;\n" +
            "ID : [a-z]+ ;\n" +
            "INT : [0-9]+ ;\n" +
            "WS : [ \\r\\n\\t]+ -> skip ;\n";

        const input = "3*4*5";
        const pattern = "<expr> * <expr> * <expr>";
        await checkPatternMatch(grammar, "expr", input, pattern, "X6");
    });
});
