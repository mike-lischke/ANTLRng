/* java2ts: keep */

/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/* eslint-disable jsdoc/require-returns, jsdoc/require-param */

import { Token } from "antlr4ng";

import { Tool } from "../Tool.js";
import { ErrorType } from "../tool/ErrorType.js";
import { Grammar } from "../tool/Grammar.js";
import { OutputModelController } from "./OutputModelController.js";
import { OutputModelWalker } from "./OutputModelWalker.js";
import { ParserFactory } from "./ParserFactory.js";
import { Target } from "./Target.js";
import { OutputModelObject } from "./model/OutputModelObject.js";
import { AutoIndentWriter, ST, type STGroup } from "stringtemplate4ts";

/**
  General controller for code gen.  Can instantiate sub generator(s).
 */
export class CodeGenerator {
    public static readonly TEMPLATE_ROOT = "org/antlr/v4/tool/templates/codegen";
    public static readonly VOCAB_FILE_EXTENSION = ".tokens";
    public static readonly vocabFilePattern =
        "<tokens.keys:{t | <t>=<tokens.(t)>\n}>" +
        "<literals.keys:{t | <t>=<literals.(t)>\n}>";

    public readonly g: Grammar;

    public readonly tool: Tool;

    public readonly language: string;

    public lineWidth = 72;

    private target: Target;

    private constructor(tool: Tool, g: Grammar, language: string) {
        this.g = g;
        this.tool = tool;
        this.language = language;
    }

    public static fromGrammar(g: Grammar): CodeGenerator {
        return CodeGenerator.fromTool(g.tool, g, g.getLanguage()!);
    }

    public static fromTool(tool: Tool, g: Grammar, language: string): CodeGenerator {
        /*const targetName = "org.antlr.v4.codegen.target." + language + "Target";
        try {
            const c = Class.forName(targetName).asSubclass(Target.class);
            const ctor = c.getConstructor(CodeGenerator.class);
            const codeGenerator = new CodeGenerator(tool, g, language);
            codeGenerator.target = ctor.newInstance(codeGenerator);

            return codeGenerator;
        } catch (e) {
            if (e instanceof Exception) {
                g.tool.errMgr.toolError(ErrorType.CANNOT_CREATE_TARGET_GENERATOR, e, language);

                return null;
            } else {
                throw e;
            }
        }*/

        throw new Error("CodeGenerator.fromTool not implemented");
    }

    public getTarget(): Target {
        return this.target;
    }

    public getTemplates(): STGroup {
        return this.target.getTemplates();
    }

    public generateLexer(header?: boolean): ST {
        if (!header) {
            return this.generateLexer(false);
        }

        return this.walk(this.createController().buildLexerOutputModel(header), header);

    }

    public generateParser(header?: boolean): ST {
        if (!header) {
            return this.generateParser(false);
        }

        return this.walk(this.createController().buildParserOutputModel(header), header);
    }

    public generateListener(header?: boolean): ST {
        if (!header) {
            return this.generateListener(false);
        }

        return this.walk(this.createController().buildListenerOutputModel(header), header);

    }

    public generateBaseListener(header?: boolean): ST {
        if (!header) {
            return this.generateBaseListener(false);
        }

        return this.walk(this.createController().buildBaseListenerOutputModel(header), header);
    }

    public generateVisitor(header?: boolean): ST {
        if (!header) {
            return this.generateVisitor(false);
        }

        return this.walk(this.createController().buildVisitorOutputModel(header), header);
    }

    public generateBaseVisitor(header?: boolean): ST {
        if (!header) {
            return this.generateBaseVisitor(false);
        }

        return this.walk(this.createController().buildBaseVisitorOutputModel(header), header);
    }

    public writeRecognizer(outputFileST: ST, header: boolean): void {
        this.target.genFile(this.g, outputFileST, this.getRecognizerFileName(header));
    }

    public writeListener(outputFileST: ST, header: boolean): void {
        this.target.genFile(this.g, outputFileST, this.getListenerFileName(header));
    }

    public writeBaseListener(outputFileST: ST, header: boolean): void {
        this.target.genFile(this.g, outputFileST, this.getBaseListenerFileName(header));
    }

    public writeVisitor(outputFileST: ST, header: boolean): void {
        this.target.genFile(this.g, outputFileST, this.getVisitorFileName(header));
    }

    public writeBaseVisitor(outputFileST: ST, header: boolean): void {
        this.target.genFile(this.g, outputFileST, this.getBaseVisitorFileName(header));
    }

    public writeVocabFile(): void {
        // write out the vocab interchange file; used by antlr,
        // does not change per target
        const tokenVocabSerialization = this.getTokenVocabOutput();
        const fileName = this.getVocabFileName();
        if (fileName !== null) {
            this.target.genFile(this.g, tokenVocabSerialization, fileName);
        }
    }

    public write(code: ST, fileName: string): void {
        try {
            const w = this.tool.getOutputFile(this.g, fileName);
            const wr = new AutoIndentWriter(w);
            wr.setLineWidth(this.lineWidth);
            code.write(wr);
            //w.close();
        } catch (cause) {
            if (cause instanceof Error) {
                this.tool.errMgr.toolError(ErrorType.CANNOT_WRITE_FILE, cause, fileName);
            } else {
                throw cause;
            }
        }
    }

    public getRecognizerFileName(header?: boolean): string {
        if (!header) {
            return this.getRecognizerFileName(false);
        }

        return this.target.getRecognizerFileName(header);
    }

    public getListenerFileName(header?: boolean): string {
        if (!header) {
            return this.getListenerFileName(false);
        }

        return this.target.getListenerFileName(header);
    }

    public getVisitorFileName(header?: boolean): string {
        if (!header) {
            return this.getVisitorFileName(false);
        }

        return this.target.getVisitorFileName(header);
    }

    public getBaseListenerFileName(header?: boolean): string {
        if (!header) {
            return this.getBaseListenerFileName(false);
        }

        return this.target.getBaseListenerFileName(header);
    }

    public getBaseVisitorFileName(header?: boolean): string {
        if (!header) {
            return this.getBaseVisitorFileName(false);
        }

        return this.target.getBaseVisitorFileName(header);
    }

    /**
     * What is the name of the vocab file generated for this grammar?
     *  Returns null if no .tokens file should be generated.
     */
    public getVocabFileName(): string {
        return this.g.name + CodeGenerator.VOCAB_FILE_EXTENSION;
    }

    public getHeaderFileName(): string | undefined {
        const extST = this.getTemplates().getInstanceOf("headerFileExtension");
        if (extST === null) {
            return undefined;
        }

        const recognizerName = this.g.getRecognizerName();

        return recognizerName + extST.render();
    }

    /**
     * Generate a token vocab file with all the token names/types. For example:
     *  ID=7
     *  FOR=8
     *  'for'=8
     *
     *  This is independent of the target language and used by antlr internally.
     */
    protected getTokenVocabOutput(): ST {
        const vocabFileST = new ST(CodeGenerator.vocabFilePattern);
        const tokens = new Map<string, number>();

        // Make constants for the token names.
        for (const [key, value] of this.g.tokenNameToTypeMap) {
            if (value >= Token.MIN_USER_TOKEN_TYPE) {
                tokens.set(key, value);
            }
        }
        vocabFileST.add("tokens", tokens);

        // Now dump the strings.
        const literals = new Map<string, number>();
        for (const [key, value] of this.g.stringLiteralToTypeMap) {
            if (value >= Token.MIN_USER_TOKEN_TYPE) {
                literals.set(key, value);
            }
        }
        vocabFileST.add("literals", literals);

        return vocabFileST;
    }

    // CREATE TEMPLATES BY WALKING MODEL

    private createController(): OutputModelController {
        const factory = new ParserFactory(this);
        const controller = new OutputModelController(factory);
        factory.setController(controller);

        return controller;
    }

    private walk(outputModel: OutputModelObject, header: boolean): ST {
        const walker = new OutputModelWalker(this.tool, this.getTemplates());

        return walker.walk(outputModel, header);
    }

}
