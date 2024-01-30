/* java2ts: keep */

/*
 * Copyright (c) 2012-2022 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { IRuntimeTestDescriptor, GrammarType } from "./types.js";

export class CustomDescriptors {
    public static readonly descriptors = new Map<string, IRuntimeTestDescriptor[]>();
    private static readonly path: string;

    static {
        CustomDescriptors.descriptors.set("LexerExec",
            [
                CustomDescriptors.getLineSeparatorLfDescriptor(),
                CustomDescriptors.getLineSeparatorCrLfDescriptor(),
                CustomDescriptors.getLargeLexerDescriptor(),
                CustomDescriptors.getAtnStatesSizeMoreThan65535Descriptor(),
            ]);
        CustomDescriptors.descriptors.set("ParserExec",
            [
                CustomDescriptors.getMultiTokenAlternativeDescriptor(),
            ]);
    }

    private static getLineSeparatorLfDescriptor(): IRuntimeTestDescriptor {
        return {
            testType: GrammarType.Lexer,
            name: "LineSeparatorLf",
            notes: "",
            input: "1\n2\n3",
            output: "[@0,0:0='1',<1>,1:0]\n" +
                "[@1,1:1='\\n',<2>,1:1]\n" +
                "[@2,2:2='2',<1>,2:0]\n" +
                "[@3,3:3='\\n',<2>,2:1]\n" +
                "[@4,4:4='3',<1>,3:0]\n" +
                "[@5,5:4='<EOF>',<-1>,3:1]\n",
            errors: "",
            grammarName: "L",
            grammar: "lexer grammar L;\n" +
                "T: ~'\\n'+;\n" +
                "SEPARATOR: '\\n';",
            showDFA: false,
            showDiagnosticErrors: false,
            traceATN: false,
            predictionMode: "LL",
            buildParseTree: true,
            path: CustomDescriptors.path,
        };
    }

    private static getLineSeparatorCrLfDescriptor(): IRuntimeTestDescriptor {
        return {
            testType: GrammarType.Lexer,
            name: "LineSeparatorCrLf",
            notes: "",
            input: "1\r\n2\r\n3",
            output: "[@0,0:0='1',<1>,1:0]\n" +
                "[@1,1:2='\\r\\n',<2>,1:1]\n" +
                "[@2,3:3='2',<1>,2:0]\n" +
                "[@3,4:5='\\r\\n',<2>,2:1]\n" +
                "[@4,6:6='3',<1>,3:0]\n" +
                "[@5,7:6='<EOF>',<-1>,3:1]\n",
            errors: "",
            grammarName: "L",
            grammar: "lexer grammar L;\n" +
                "T: ~'\\r'+;\n" +
                "SEPARATOR: '\\r\\n';",
            showDFA: false,
            showDiagnosticErrors: false,
            traceATN: false,
            predictionMode: "LL",
            buildParseTree: true, path: CustomDescriptors.path,
        };
    }

    private static getLargeLexerDescriptor(): IRuntimeTestDescriptor {
        const tokensCount = 4000;
        const grammarName = "L";

        let grammar = "";
        grammar += "lexer grammar " + grammarName + ";\n";
        grammar += "WS: [ \\t\\r\\n]+ -> skip;\n";
        for (let i = 0; i < tokensCount; i++) {
            grammar += "KW" + i + " : 'KW' '" + i + "';\n";
        }

        return {
            testType: GrammarType.Lexer,
            name: "LargeLexer",
            notes: "This is a regression test for antlr/antlr4#76 \"Serialized ATN strings\n" +
                "should be split when longer than 2^16 bytes (class file limitation)\"\n" +
                "https://github.com/antlr/antlr4/issues/76",
            input: "KW400",
            output: "[@0,0:4='KW400',<402>,1:0]\n" +
                "[@1,5:4='<EOF>',<-1>,1:5]\n",
            errors: "",
            grammarName,
            grammar: grammar.toString(),
            showDFA: false,
            showDiagnosticErrors: false,
            traceATN: false,
            predictionMode: "LL",
            buildParseTree: true,
            path: CustomDescriptors.path,
        };
    }

    private static getAtnStatesSizeMoreThan65535Descriptor(): IRuntimeTestDescriptor {
        // I tried playing around with different sizes, and I think 1002 works for Go but 1003 does not;
        // the executing lexer gets a token syntax error for T208 or something like that.
        const tokensCount = 1024;
        const suffix = "_".repeat(70);

        const grammarName = "L";
        let grammar = "";
        grammar += "lexer grammar " + grammarName + ";\n";
        grammar += "\n";
        let input = "";
        let output = "";
        let startOffset: number;
        let stopOffset = -2;
        for (let i = 0; i < tokensCount; i++) {
            const ruleName = `T_${this.padZero(i, 6)}`;
            const value = ruleName + suffix;
            grammar += ruleName + ": '" + value + "';\n";
            input += value + "\n";

            startOffset = stopOffset + 2;
            stopOffset += value.length + 1;

            output += "[@" + i + "," + startOffset + ":" + stopOffset + "='" + value + "',<" + (i + 1) + ">," + (i + 1)
                + ":0]\n";
        }

        grammar += "\n";
        grammar += "WS: [ \\t\\r\\n]+ -> skip;\n";

        startOffset = stopOffset + 2;
        stopOffset = startOffset - 1;
        output += "[@" + tokensCount + "," + startOffset + ":" + stopOffset + "='<EOF>',<-1>," + (tokensCount + 1) +
            ":0]\n";

        return {
            testType: GrammarType.Lexer,
            name: "AtnStatesSizeMoreThan65535",
            notes: "Regression for https://github.com/antlr/antlr4/issues/1863",
            input: input.toString(),
            output: output.toString(),
            errors: "",
            grammarName,
            grammar: grammar.toString(),
            showDFA: false,
            showDiagnosticErrors: false,
            traceATN: false,
            predictionMode: "LL",
            buildParseTree: true,
            skipTargets: new Set(["CSharp", "Python3", "Go", "PHP", "Swift", "JavaScript", "TypeScript", "Dart"]),
            path: CustomDescriptors.path,
        };
    }

    private static getMultiTokenAlternativeDescriptor(): IRuntimeTestDescriptor {
        const tokensCount = 64;

        let rule = "r1: ";
        let tokens = "";
        let input = "";
        let output = "";

        for (let i = 0; i < tokensCount; i++) {
            const currentToken = "T" + i;
            rule += currentToken;
            if (i < tokensCount - 1) {
                rule += " | ";
            } else {
                rule += ";";
            }
            tokens += currentToken + ": '" + currentToken + "';\n";
            input += currentToken + " ";
            output += currentToken;
        }

        const currentToken = "T" + tokensCount;
        tokens += currentToken + ": '" + currentToken + "';\n";
        input += currentToken + " ";
        output += currentToken + "\n";

        const grammar = "grammar P;\n" +
            "r: (r1 | T" + tokensCount + ")+ EOF {<writeln(\"$text\")>};\n" +
            rule + "\n" +
            tokens + "\n" +
            "WS: [ ]+ -> skip;";

        return {
            testType: GrammarType.Parser,
            name: "MultiTokenAlternative",
            notes: "https://github.com/antlr/antlr4/issues/3698, https://github.com/antlr/antlr4/issues/3703",
            input: input.toString(),
            output,
            errors: "",
            startRule: "r",
            grammarName: "P",
            grammar,
            showDFA: false,
            showDiagnosticErrors: false,
            traceATN: false,
            predictionMode: "LL",
            buildParseTree: true,
            path: CustomDescriptors.path,
        };
    }

    private static padZero(num: number, len: number): string {
        return num.toString().padStart(len, "0");
    };

}
