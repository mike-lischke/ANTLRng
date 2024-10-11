/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import type { IST } from "stringtemplate4ts";

import { grammarOptions } from "../grammar-options.js";
import { Grammar } from "../tool/Grammar.js";
import { CodeGenerator } from "./CodeGenerator.js";

export class CodeGenPipeline {
    protected readonly g: Grammar;
    protected readonly gen: CodeGenerator;

    public constructor(g: Grammar, gen: CodeGenerator) {
        this.g = g;
        this.gen = gen;
    }

    public process(): void {
        // all templates are generated in memory to report the most complete
        // error information possible, but actually writing output files stops
        // after the first error is reported
        const errorCount = this.g.tool.errMgr.getNumErrors();

        if (this.g.isLexer()) {
            if (this.gen.getTarget().needsHeader()) {
                const lexer = this.gen.generateLexer(true); // Header file if needed.
                if (this.g.tool.errMgr.getNumErrors() === errorCount) {
                    this.writeRecognizer(lexer, this.gen, true);
                }
            }
            const lexer = this.gen.generateLexer(false);
            if (this.g.tool.errMgr.getNumErrors() === errorCount) {
                this.writeRecognizer(lexer, this.gen, false);
            }
        } else {
            if (this.gen.getTarget().needsHeader()) {
                const parser = this.gen.generateParser(true);
                if (this.g.tool.errMgr.getNumErrors() === errorCount) {
                    this.writeRecognizer(parser, this.gen, true);
                }
            }

            const parser = this.gen.generateParser(false);
            if (this.g.tool.errMgr.getNumErrors() === errorCount) {
                this.writeRecognizer(parser, this.gen, false);
            }

            if (grammarOptions.generateListener) {
                if (this.gen.getTarget().needsHeader()) {
                    const listener = this.gen.generateListener(true);
                    if (this.g.tool.errMgr.getNumErrors() === errorCount) {
                        this.gen.writeListener(listener, true);
                    }
                }
                const listener = this.gen.generateListener(false);
                if (this.g.tool.errMgr.getNumErrors() === errorCount) {
                    this.gen.writeListener(listener, false);
                }

                if (this.gen.getTarget().needsHeader()) {
                    const baseListener = this.gen.generateBaseListener(true);
                    if (this.g.tool.errMgr.getNumErrors() === errorCount) {
                        this.gen.writeBaseListener(baseListener, true);
                    }
                }
                if (this.gen.getTarget().wantsBaseListener()) {
                    const baseListener = this.gen.generateBaseListener(false);
                    if (this.g.tool.errMgr.getNumErrors() === errorCount) {
                        this.gen.writeBaseListener(baseListener, false);
                    }
                }
            }

            if (grammarOptions.generateVisitor) {
                if (this.gen.getTarget().needsHeader()) {
                    const visitor = this.gen.generateVisitor(true);
                    if (this.g.tool.errMgr.getNumErrors() === errorCount) {
                        this.gen.writeVisitor(visitor, true);
                    }
                }
                const visitor = this.gen.generateVisitor(false);
                if (this.g.tool.errMgr.getNumErrors() === errorCount) {
                    this.gen.writeVisitor(visitor, false);
                }

                if (this.gen.getTarget().needsHeader()) {
                    const baseVisitor = this.gen.generateBaseVisitor(true);
                    if (this.g.tool.errMgr.getNumErrors() === errorCount) {
                        this.gen.writeBaseVisitor(baseVisitor, true);
                    }
                }
                if (this.gen.getTarget().wantsBaseVisitor()) {
                    const baseVisitor = this.gen.generateBaseVisitor(false);
                    if (this.g.tool.errMgr.getNumErrors() === errorCount) {
                        this.gen.writeBaseVisitor(baseVisitor, false);
                    }
                }
            }
        }
        this.gen.writeVocabFile();
    }

    protected writeRecognizer(template: IST, gen: CodeGenerator, header: boolean): void {
        gen.writeRecognizer(template, header);
    }
}
