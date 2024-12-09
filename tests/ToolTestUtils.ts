/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/* eslint-disable jsdoc/require-returns, jsdoc/require-param */

import { expect } from "vitest";

import { mkdirSync, readFileSync, rmdirSync, writeFileSync } from "node:fs";

import {
    ATN, ATNDeserializer, ATNSerializer, CharStream, Lexer, LexerATNSimulator, PredictionMode, Token
} from "antlr4ng";
import { ST } from "stringtemplate4ts";

import { execSync } from "node:child_process";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { LexerATNFactory } from "../src/automata/LexerATNFactory.js";
import { ParserATNFactory } from "../src/automata/ParserATNFactory.js";
import { SemanticPipeline } from "../src/semantics/SemanticPipeline.js";
import { DefaultToolListener } from "../src/tool/DefaultToolListener.js";
import { Tool, type Grammar, type LexerGrammar } from "../src/tool/index.js";
import { ErrorQueue } from "./support/ErrorQueue.js";

export interface IRunOptions {
    grammarFileName: string;
    grammarStr: string;
    parserName: string | null;
    lexerName: string | null;
    grammarName: string;
    useListener: boolean;
    useVisitor: boolean;
    startRuleName: string;
    input: string;
    profile: boolean;
    showDiagnosticErrors: boolean;
    traceATN: boolean;
    showDFA: boolean;
    superClass?: string;
    predictionMode: PredictionMode;
    buildParseTree: boolean;
}

interface IGeneratedFile {
    name: string;
    isParser: boolean;
}

export class ToolTestUtils {
    /*public static execLexer(grammarFileName: string, grammarStr: string, lexerName: string, input: string,
        tempDir?: string, saveTestDir?: boolean): ExecutedState {
        return ToolTestUtils.execRecognizer(grammarFileName, grammarStr, null, lexerName,
            null, input, false, tempDir, saveTestDir);

    }*/

    public static async execParser(grammarFileName: string, grammarStr: string, parserName: string, lexerName: string,
        startRuleName: string, input: string, showDiagnosticErrors: boolean, workingDir: string): Promise<ErrorQueue> {
        const runOptions = this.createOptionsForToolTests(grammarFileName, grammarStr, parserName, lexerName,
            false, false, startRuleName, input, false, showDiagnosticErrors);

        return await ToolTestUtils.execRecognizer(runOptions, workingDir);
    }

    public static createOptionsForToolTests(grammarFileName: string, grammarStr: string, parserName: string | null,
        lexerName: string | null, useListener: boolean, useVisitor: boolean, startRuleName: string, input: string,
        profile: boolean, showDiagnosticErrors: boolean): IRunOptions {
        const isCombinedGrammar = lexerName != null && parserName != null;
        let grammarName;
        if (isCombinedGrammar) {
            grammarName = lexerName.endsWith("Lexer")
                ? lexerName.substring(0, lexerName.length - "Lexer".length)
                : lexerName;
        } else {
            if (parserName != null) {
                grammarName = parserName;
            } else {
                grammarName = lexerName!;
            }
        }

        return {
            grammarFileName,
            grammarStr,
            parserName,
            lexerName,
            grammarName,
            useListener,
            useVisitor,
            startRuleName,
            input,
            profile,
            showDiagnosticErrors,
            traceATN: false,
            showDFA: false,
            predictionMode: PredictionMode.LL,
            buildParseTree: true
        };
    }

    public static testErrors(pairs: string[], ignoreWarnings = false): void {
        for (let i = 0; i < pairs.length; i += 2) {
            const grammarStr = pairs[i];
            const expected = pairs[i + 1];

            const lines = grammarStr.split("\n");
            const fileName = ToolTestUtils.getFilenameFromFirstLineOfGrammar(lines[0]);

            const tempDirName = "AntlrTestErrors-" + Date.now();
            const tempTestDir = join(tmpdir(), tempDirName);

            const queue = this.antlrOnString(tempTestDir, "TypeScript", fileName, grammarStr, false);

            let actual = "";
            if (ignoreWarnings) {
                const errors = [];
                for (const error of queue.errors) {
                    const msgST = queue.errorManager.getMessageTemplate(error)!;
                    errors.push(msgST.render());
                }

                if (errors.length > 0) {
                    actual = errors.join("\n") + "\n";
                }
            } else {
                actual = queue.toString(true);
            }

            actual = actual.replace(tempTestDir + "/", "");

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

    public static realElements(elements: Array<string | null>): Array<string | null> {
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
    public static antlrOnString(workdir: string, targetName: string | null,
        grammarFileName: string, grammarStr: string, defaultListener: boolean, ...extraOptions: string[]): ErrorQueue {
        mkdirSync(workdir);
        try {
            writeFileSync(join(workdir, grammarFileName), grammarStr);

            return this.antlrOnFile(workdir, targetName, grammarFileName, defaultListener, ...extraOptions);
        } finally {
            rmdirSync(workdir, { recursive: true });
        }
    }

    /** Run ANTLR on stuff in workdir and error queue back. */
    public static antlrOnFile(workdir: string, targetName: string | null, grammarFileName: string,
        defaultListener: boolean, ...extraOptions: string[]): ErrorQueue {
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
            options.push("utf-8");
        }

        options.push(join(workdir, grammarFileName));

        const antlr = new Tool(options);

        const queue = new ErrorQueue(antlr.errorManager);
        antlr.errorManager.addListener(queue);
        if (defaultListener) {
            antlr.errorManager.addListener(new DefaultToolListener(antlr.errorManager));
        }

        antlr.processGrammarsOnCommandLine();

        return queue;
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

    private static async execRecognizer(runOptions: IRunOptions, workingDir: string): Promise<ErrorQueue> {
        const result = execSync("npm install antlr4ng", { cwd: workingDir });

        expect(result.toString()).toContain("added 2 packages");

        writeFileSync(join(workingDir, runOptions.grammarFileName), runOptions.grammarStr);

        const queue = this.antlrOnFile(workingDir, "TypeScript", runOptions.grammarFileName, false);

        //const generatedFiles = this.getGeneratedFiles(runOptions);

        this.writeRecognizerFile(workingDir, runOptions);

        writeFileSync(join(workingDir, "input"), runOptions.input);

        const testName = join(workingDir, "Test.js");

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const { main } = await import(testName);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        main(runOptions.input);

        return queue;
    }

    private static getGeneratedFiles(runOptions: IRunOptions): IGeneratedFile[] {
        const files: IGeneratedFile[] = [];
        const extensionWithDot = ".java";

        const isCombinedGrammarOrGo = runOptions.lexerName != null && runOptions.parserName != null;
        if (runOptions.lexerName != null) {
            files.push({
                name: runOptions.grammarName + (isCombinedGrammarOrGo ? "Lexer" : "") + extensionWithDot,
                isParser: false
            });
        }

        if (runOptions.parserName != null) {
            files.push({
                name: runOptions.grammarName + (isCombinedGrammarOrGo ? "Parser" : "") + extensionWithDot,
                isParser: true
            });

            if (runOptions.useListener) {
                files.push({
                    name: runOptions.grammarName + "Listener" + extensionWithDot,
                    isParser: true
                });

                const baseListenerSuffix = "BaseListener";
                files.push({
                    name: runOptions.grammarName + baseListenerSuffix + extensionWithDot,
                    isParser: true
                });
            }

            if (runOptions.useVisitor) {
                files.push({
                    name: runOptions.grammarName + "Visitor" + extensionWithDot,
                    isParser: true
                });

                files.push({
                    name: runOptions.grammarName + "BaseVisitor" + extensionWithDot,
                    isParser: true
                });
            }
        }

        return files;
    }

    private static writeRecognizerFile(workDir: string, runOptions: IRunOptions): void {
        const sourceURL = join(dirname(import.meta.url), "helpers/Test.ts.stg").substring("file:".length);
        const text = readFileSync(sourceURL, "utf8");
        const outputFileST = new ST(text);
        outputFileST.add("grammarName", runOptions.grammarName);
        outputFileST.add("lexerName", runOptions.lexerName);
        outputFileST.add("parserName", runOptions.parserName);
        outputFileST.add("parserStartRuleName", runOptions.startRuleName);
        outputFileST.add("showDiagnosticErrors", runOptions.showDiagnosticErrors);
        outputFileST.add("traceATN", runOptions.traceATN);
        outputFileST.add("profile", runOptions.profile);
        outputFileST.add("showDFA", runOptions.showDFA);
        outputFileST.add("useListener", runOptions.useListener);
        outputFileST.add("useVisitor", runOptions.useVisitor);

        const mode = runOptions.predictionMode === PredictionMode.LL ? "LL" :
            runOptions.predictionMode === PredictionMode.SLL ? "SLL" : "LL_EXACT_AMBIG_DETECTION";
        outputFileST.add("predictionMode", mode);
        outputFileST.add("buildParseTree", runOptions.buildParseTree);

        writeFileSync(join(workDir, "Test.ts"), outputFileST.render());
    }
}
