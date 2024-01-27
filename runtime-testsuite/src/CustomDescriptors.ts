/* java2ts: keep */

/*
 * Copyright (c) 2012-2022 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { RuntimeTestDescriptor } from "./RuntimeTestDescriptor.js";
import { GrammarType } from "./GrammarType.js";
import { padZero } from "../temp.js";

export class CustomDescriptors {
    public static readonly descriptors = new Map<string, RuntimeTestDescriptor[]>();
    private static readonly path: string;

    static {
        /*CustomDescriptors.path = RuntimeTestUtils.runtimeTestsuitePath,
            "test", "org", "antlr", "v4", "test", "runtime", "CustomDescriptors.java").toUri();*/

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

    private static getLineSeparatorLfDescriptor(): RuntimeTestDescriptor {
        return new RuntimeTestDescriptor(
            GrammarType.Lexer,
            "LineSeparatorLf",
            "",
            "1\n2\n3",
            "[@0,0:0='1',<1>,1:0]\n" +
            "[@1,1:1='\\n',<2>,1:1]\n" +
            "[@2,2:2='2',<1>,2:0]\n" +
            "[@3,3:3='\\n',<2>,2:1]\n" +
            "[@4,4:4='3',<1>,3:0]\n" +
            "[@5,5:4='<EOF>',<-1>,3:1]\n",
            "",
            null,
            "L",
            "lexer grammar L;\n" +
            "T: ~'\\n'+;\n" +
            "SEPARATOR: '\\n';",
            null, false, false, false, "LL", true, null, CustomDescriptors.path);
    }

    private static getLineSeparatorCrLfDescriptor(): RuntimeTestDescriptor {
        return new RuntimeTestDescriptor(
            GrammarType.Lexer,
            "LineSeparatorCrLf",
            "",
            "1\r\n2\r\n3",
            "[@0,0:0='1',<1>,1:0]\n" +
            "[@1,1:2='\\r\\n',<2>,1:1]\n" +
            "[@2,3:3='2',<1>,2:0]\n" +
            "[@3,4:5='\\r\\n',<2>,2:1]\n" +
            "[@4,6:6='3',<1>,3:0]\n" +
            "[@5,7:6='<EOF>',<-1>,3:1]\n",
            "",
            "",
            "L",
            "lexer grammar L;\n" +
            "T: ~'\\r'+;\n" +
            "SEPARATOR: '\\r\\n';",
            null, false, false, false, "LL", true, null, CustomDescriptors.path);
    }

    private static getLargeLexerDescriptor(): RuntimeTestDescriptor {
        const tokensCount = 4000;
        const grammarName = "L";

        let grammar = "";
        grammar += "lexer grammar " + grammarName + ";\n";
        grammar += "WS: [ \\t\\r\\n]+ -> skip;\n";
        for (let i = 0; i < tokensCount; i++) {
            grammar += "KW" + i + " : 'KW' '" + i + "';\n";
        }

        return new RuntimeTestDescriptor(
            GrammarType.Lexer,
            "LargeLexer",
            "This is a regression test for antlr/antlr4#76 \"Serialized ATN strings\n" +
            "should be split when longer than 2^16 bytes (class file limitation)\"\n" +
            "https://github.com/antlr/antlr4/issues/76",
            "KW400",
            "[@0,0:4='KW400',<402>,1:0]\n" +
            "[@1,5:4='<EOF>',<-1>,1:5]\n",
            "",
            "",
            grammarName,
            grammar.toString(),
            null, false, false, false, "LL", true, null, CustomDescriptors.path);
    }

    private static getAtnStatesSizeMoreThan65535Descriptor(): RuntimeTestDescriptor {
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
            const ruleName = `T_${padZero(i, 6)}`;
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

        return new RuntimeTestDescriptor(
            GrammarType.Lexer,
            "AtnStatesSizeMoreThan65535",
            "Regression for https://github.com/antlr/antlr4/issues/1863",
            input.toString(),
            output.toString(),
            "",
            "",
            grammarName,
            grammar.toString(),
            null, false, false, false, "LL", true,
            ["CSharp", "Python3", "Go", "PHP", "Swift", "JavaScript", "TypeScript", "Dart"],
            CustomDescriptors.path);
    }

    private static getMultiTokenAlternativeDescriptor(): RuntimeTestDescriptor {
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
        output += currentToken;

        const grammar = "grammar P;\n" +
            "r: (r1 | T" + tokensCount + ")+ EOF {<writeln(\"$text\")>};\n" +
            rule + "\n" +
            tokens + "\n" +
            "WS: [ ]+ -> skip;";

        return new RuntimeTestDescriptor(
            GrammarType.Parser,
            "MultiTokenAlternative",
            "https://github.com/antlr/antlr4/issues/3698, https://github.com/antlr/antlr4/issues/3703",
            input.toString(),
            output + "\n",
            "",
            "r",
            "P",
            grammar,
            null, false, false, false, "LL", true, null, CustomDescriptors.path);
    }
}
