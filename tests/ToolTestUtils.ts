/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/* eslint-disable jsdoc/require-returns, jsdoc/require-param */

import { mkdirSync, rmdirSync, writeFileSync } from "node:fs";
import { expect } from "vitest";

import {
    ATN, ATNDeserializer, ATNSerializer, CharStream, Lexer, LexerATNSimulator, Token
} from "antlr4ng";

import { tmpdir } from "node:os";
import { join } from "node:path";
import { LexerATNFactory } from "../src/automata/LexerATNFactory.js";
import { ParserATNFactory } from "../src/automata/ParserATNFactory.js";
import { SemanticPipeline } from "../src/semantics/SemanticPipeline.js";
import { DefaultToolListener } from "../src/tool/DefaultToolListener.js";
import { Tool, type Grammar, type LexerGrammar } from "../src/tool/index.js";
import { ErrorQueue } from "./support/ErrorQueue.js";

export class ToolTestUtils {
    /*public static execLexer(grammarFileName: string, grammarStr: string, lexerName: string, input: string,
        tempDir?: string, saveTestDir?: boolean): ExecutedState {
        return ToolTestUtils.execRecognizer(grammarFileName, grammarStr, null, lexerName,
            null, input, false, tempDir, saveTestDir);

    }*/

    /*public static execParser(grammarFileName: string, grammarStr: string, parserName: string, lexerName: string,
        startRuleName: string, input: string, showDiagnosticErrors: boolean): ExecutedState;
    public static execParser(grammarFileName: string, grammarStr: string, parserName: string, lexerName: string,
        startRuleName: string, input: string, showDiagnosticErrors: boolean, workingDir: string): ExecutedState;
    public static execParser(...args: unknown[]): ExecutedState {
        switch (args.length) {
            case 7: {
                const [grammarFileName, grammarStr, parserName, lexerName, startRuleName, input, showDiagnosticErrors]
                    = args as [string, string, string, string, string, string, boolean];

                return ToolTestUtils.execParser(grammarFileName, grammarStr, parserName, lexerName, startRuleName,
                    input, showDiagnosticErrors, null);

                break;
            }

            case 8: {
                const [grammarFileName, grammarStr, parserName, lexerName, startRuleName, input, showDiagnosticErrors,
                    workingDir] = args as [string, string, string, string, string, string, boolean, string];

                return ToolTestUtils.execRecognizer(grammarFileName, grammarStr, parserName, lexerName,
                    startRuleName, input, showDiagnosticErrors, workingDir, false);

                break;
            }

            default: {
                throw new Error(`Invalid number of arguments`);
            }
        }
    }*/

    /*public static createOptionsForJavaToolTests(grammarFileName: string, grammarStr: string, parserName: string,
        lexerName: string, useListener: boolean, useVisitor: boolean, startRuleName: string, input: string,
        profile: boolean, showDiagnosticErrors: boolean, endStage: Stage): RunOptions {
        return new RunOptions(grammarFileName, grammarStr, parserName, lexerName, useListener, useVisitor,
            startRuleName, input, profile, showDiagnosticErrors, false, false, endStage, "Java",
            JavaRunner.runtimeTestParserName, PredictionMode.LL, true);
    }*/

    public static testErrors(pairs: string[], includeWarnings: boolean): void {
        for (let i = 0; i < pairs.length; i += 2) {
            const grammarStr = pairs[i];
            const expected = pairs[i + 1];

            const lines = grammarStr.split("\n");
            const fileName = ToolTestUtils.getFilenameFromFirstLineOfGrammar(lines[0]);

            const tempDirName = "AntlrTestErrors-" + Date.now();
            const tempTestDir = join(tmpdir(), tempDirName);

            const errors = this.antlrOnString(includeWarnings, tempTestDir, null, fileName, grammarStr, false);

            let actual = "";
            errors.forEach((error) => {
                actual += error + "\n";
            });

            actual = actual.replace(tempTestDir + "/", "");
            let msg = grammarStr;
            msg = msg.replace("\n", "\\n");
            msg = msg.replace("\r", "\\r");
            msg = msg.replace("\t", "\\t");

            expect(actual).toBe(expected);
        }
    }

    public static getFilenameFromFirstLineOfGrammar(line: string): string {
        let fileName = "A" + Tool.GRAMMAR_EXTENSION;
        const grIndex = line.lastIndexOf("grammar");
        const semi = line.lastIndexOf(";");
        if (grIndex >= 0 && semi >= 0) {
            const space = line.indexOf(" ", grIndex);
            fileName = line.substring(space + 1, semi) + Tool.GRAMMAR_EXTENSION;
        }
        if (fileName.length === Tool.GRAMMAR_EXTENSION.length) {
            fileName = "A" + Tool.GRAMMAR_EXTENSION;
        }

        return fileName;
    }

    public static realElements(elements: string[]): string[] {
        return elements.slice(Token.MIN_USER_TOKEN_TYPE);
    }

    /*public static load(fileName: string): string {
        if (fileName === null) {
            return null;
        }

        const fullFileName = ToolTestUtils.class.getPackage().getName().replace(".", "/") + "/" + fileName;
        const size = 65000;
        const fis = ToolTestUtils.class.getClassLoader().getResourceAsStream(fullFileName);
        {
            // This holds the final error to throw (if any).
            let error: java.lang.Throwable | undefined;

            const isr: InputStreamReader = new InputStreamReader(fis);
            try {
                try {
                    const data = new Uint16Array(size);
                    const n = isr.read(data);

                    return new string(data, 0, n);
                } finally {
                    error = closeResources([isr]);
                }
            } catch (e) {
                error = handleResourceError(e, error);
            } finally {
                throwResourceError(error);
            }
        }

    }*/

    public static createATN(g: Grammar, useSerializer: boolean): ATN {
        ToolTestUtils.semanticProcess(g);
        expect(g.tool.getNumErrors()).toBe(0);

        const f = g.isLexer() ? new LexerATNFactory(g as LexerGrammar) : new ParserATNFactory(g);

        g.atn = f.createATN();
        expect(g.tool.getNumErrors()).toBe(0);

        const atn = g.atn;
        if (useSerializer) {
            // sets some flags in ATN
            const serialized = ATNSerializer.getSerialized(atn);

            return new ATNDeserializer().deserialize(serialized);
        }

        return atn;
    }

    /** Write a grammar to tmpdir and run antlr */
    public static antlrOnString(includeWarnings: boolean, workdir: string, targetName: string | null,
        grammarFileName: string, grammarStr: string, defaultListener: boolean, ...extraOptions: string[]): string[] {
        mkdirSync(workdir);
        try {
            writeFileSync(join(workdir, grammarFileName), grammarStr);

            return this.antlrOnFile(includeWarnings, workdir, targetName, grammarFileName, defaultListener,
                ...extraOptions);
        } finally {
            rmdirSync(workdir, { recursive: true });
        }
    }

    /** Run ANTLR on stuff in workdir and error queue back. */
    public static antlrOnFile(includeWarnings: boolean, workdir: string, targetName: string | null,
        grammarFileName: string, defaultListener: boolean, ...extraOptions: string[]): string[] {
        const options: string[] = [...extraOptions];

        if (targetName !== null) {
            options.push("-Dlanguage=" + targetName);
        }

        if (!options.includes("-o")) {
            options.push("-o");
            options.push(workdir);
        }

        if (!options.includes("-lib")) {
            options.push("-lib");
            options.push(workdir);
        }

        if (!options.includes("--encoding")) {
            options.push("--encoding");
            options.push("UTF-8");
        }

        options.push(join(workdir, grammarFileName));

        const antlr = new Tool(options);

        const queue = new ErrorQueue(antlr.errorManager);
        antlr.errorManager.addListener(queue);
        if (defaultListener) {
            antlr.errorManager.addListener(new DefaultToolListener(antlr.errorManager));
        }

        antlr.processGrammarsOnCommandLine();
        const errors: string[] = [];

        if (!defaultListener && includeWarnings) {
            for (const entry of queue.all) {
                const msgST = antlr.errorManager.getMessageTemplate(entry)!;
                errors.push(msgST.render());
            }
        } else {
            if (!defaultListener && queue.errors.length > 0) {
                for (const error of queue.errors) {
                    const msgST = antlr.errorManager.getMessageTemplate(error)!;
                    errors.push(msgST.render());
                }
            }
        }

        return errors;
    }

    public static semanticProcess(g: Grammar): void {
        if (!g.ast.hasErrors) {
            const antlr = new Tool();
            const sem = new SemanticPipeline(g);
            sem.process();
            for (const imp of g.getImportedGrammars()) {
                antlr.processNonCombinedGrammar(imp, false);
            }
        }
    }

    public static getTokenTypesViaATN(text: string, lexerATN: LexerATNSimulator): number[] {
        const input = CharStream.fromString(text);
        const tokenTypes: number[] = [];
        let ttype: number;

        do {
            ttype = lexerATN.match(input, Lexer.DEFAULT_MODE);
            tokenTypes.push(ttype);
        } while (ttype !== Token.EOF);

        return tokenTypes;
    }

    /*private static execRecognizer(grammarFileName: string, grammarStr: string, parserName: string | null,
        lexerName: string | null, startRuleName: string, input: string, showDiagnosticErrors: boolean,
        workingDir: string, saveTestDir: boolean): ExecutedState {

        const runOptions = this.createRunOptions(grammarFileName, grammarStr, parserName, lexerName, false, true,
            startRuleName, input, false, showDiagnosticErrors);

        const runner: JavaRunner = new JavaRunner(workingDir, saveTestDir);
        const result = runner.run(runOptions);
        if (!(result instanceof ExecutedState)) {
            fail(result.getErrorMessage());
        }

        return result as ExecutedState;
    }*/
}
