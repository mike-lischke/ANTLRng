/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/* eslint-disable jsdoc/require-returns, jsdoc/require-param */


import { CodeGenerator } from "./CodeGenerator.js";
import { ErrorType } from "../tool/ErrorType.js";
import { Grammar } from "../tool/Grammar.js";



export  class CodeGenPipeline {
	protected readonly  g:  Grammar;
	protected readonly  gen:  CodeGenerator;

	public  constructor(g: Grammar, gen: CodeGenerator) {
		this.g = g;
		this.gen = gen;
	}

	public  process():  void {
		// all templates are generated in memory to report the most complete
		// error information possible, but actually writing output files stops
		// after the first error is reported
		let  errorCount = this.g.tool.errMgr.getNumErrors();

		if ( this.g.isLexer() ) {
			if (this.gen.getTarget().needsHeader()) {
				let  lexer = this.gen.generateLexer(true); // Header file if needed.
				if (this.g.tool.errMgr.getNumErrors() === errorCount) {
					this.writeRecognizer(lexer, this.gen, true);
				}
			}
			let  lexer = this.gen.generateLexer(false);
			if (this.g.tool.errMgr.getNumErrors() === errorCount) {
				this.writeRecognizer(lexer, this.gen, false);
			}
		}
		else {
			if (this.gen.getTarget().needsHeader()) {
				let  parser = this.gen.generateParser(true);
				if (this.g.tool.errMgr.getNumErrors() === errorCount) {
					this.writeRecognizer(parser, this.gen, true);
				}
			}
			let  parser = this.gen.generateParser(false);
			if (this.g.tool.errMgr.getNumErrors() === errorCount) {
				this.writeRecognizer(parser, this.gen, false);
			}

			if ( this.g.tool.gen_listener ) {
				if (this.gen.getTarget().needsHeader()) {
					let  listener = this.gen.generateListener(true);
					if (this.g.tool.errMgr.getNumErrors() === errorCount) {
						this.gen.writeListener(listener, true);
					}
				}
				let  listener = this.gen.generateListener(false);
				if (this.g.tool.errMgr.getNumErrors() === errorCount) {
					this.gen.writeListener(listener, false);
				}

				if (this.gen.getTarget().needsHeader()) {
					let  baseListener = this.gen.generateBaseListener(true);
					if (this.g.tool.errMgr.getNumErrors() === errorCount) {
						this.gen.writeBaseListener(baseListener, true);
					}
				}
				if (this.gen.getTarget().wantsBaseListener()) {
					let  baseListener = this.gen.generateBaseListener(false);
					if ( this.g.tool.errMgr.getNumErrors()===errorCount ) {
						this.gen.writeBaseListener(baseListener, false);
					}
				}
			}
			if ( this.g.tool.gen_visitor ) {
				if (this.gen.getTarget().needsHeader()) {
					let  visitor = this.gen.generateVisitor(true);
					if (this.g.tool.errMgr.getNumErrors() === errorCount) {
						this.gen.writeVisitor(visitor, true);
					}
				}
				let  visitor = this.gen.generateVisitor(false);
				if (this.g.tool.errMgr.getNumErrors() === errorCount) {
					this.gen.writeVisitor(visitor, false);
				}

				if (this.gen.getTarget().needsHeader()) {
					let  baseVisitor = this.gen.generateBaseVisitor(true);
					if (this.g.tool.errMgr.getNumErrors() === errorCount) {
						this.gen.writeBaseVisitor(baseVisitor, true);
					}
				}
				if (this.gen.getTarget().wantsBaseVisitor()) {
					let  baseVisitor = this.gen.generateBaseVisitor(false);
					if ( this.g.tool.errMgr.getNumErrors()===errorCount ) {
						this.gen.writeBaseVisitor(baseVisitor, false);
					}
				}
			}
		}
		this.gen.writeVocabFile();
	}

	protected  writeRecognizer(template: ST, gen: CodeGenerator, header: boolean):  void {
		if ( this.g.tool.launch_ST_inspector ) {
			let  viz = template.inspect();
			if (this.g.tool.ST_inspector_wait_for_close) {
				try {
					viz.waitForClose();
				} catch (ex) {
if (ex instanceof InterruptedException) {
					this.g.tool.errMgr.toolError(ErrorType.INTERNAL_ERROR, ex);
				} else {
	throw ex;
	}
}
			}
		}

		gen.writeRecognizer(template, header);
	}
}
