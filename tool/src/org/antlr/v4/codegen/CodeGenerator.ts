/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */


/* eslint-disable jsdoc/require-returns, jsdoc/require-param */


import { Target } from "./Target.js";
import { ParserFactory } from "./ParserFactory.js";
import { OutputModelWalker } from "./OutputModelWalker.js";
import { OutputModelFactory } from "./OutputModelFactory.js";
import { OutputModelController } from "./OutputModelController.js";
import { Tool } from "../Tool.js";
import { OutputModelObject } from "./model/OutputModelObject.js";
import { Token, LinkedHashMap as HashMap } from "antlr4ng";
import { ErrorType } from "../tool/ErrorType.js";
import { Grammar } from "../tool/Grammar.js";



/** General controller for code gen.  Can instantiate sub generator(s).
 */
export  class CodeGenerator {
	public static readonly  TEMPLATE_ROOT = "org/antlr/v4/tool/templates/codegen";
	public static readonly  VOCAB_FILE_EXTENSION = ".tokens";
	public static readonly  vocabFilePattern =
		"<tokens.keys:{t | <t>=<tokens.(t)>\n}>" +
		"<literals.keys:{t | <t>=<literals.(t)>\n}>";

	public readonly  g:  Grammar;

	public readonly  tool:  Tool;

	public readonly  language:  string;

	public  lineWidth = 72;

	private  target:  Target;

	private  constructor(tool: Tool, g: Grammar, language: string) {
		this.g = g;
		this.tool = tool;
		this.language = language;
	}

	public static  create(g: Grammar):  CodeGenerator;

	public static  create(tool: Tool, g: Grammar, language: string):  CodeGenerator;
public static create(...args: unknown[]):  CodeGenerator {
		switch (args.length) {
			case 1: {
				const [g] = args as [Grammar];


		return CodeGenerator.create(g.tool, g, g.getLanguage());
	

				break;
			}

			case 3: {
				const [tool, g, language] = args as [Tool, Grammar, string];


		let  targetName = "org.antlr.v4.codegen.target."+language+"Target";
		try {
			let  c = Class.forName(targetName).asSubclass(Target.class);
			let  ctor = c.getConstructor(CodeGenerator.class);
			let  codeGenerator = new  CodeGenerator(tool, g, language);
			codeGenerator.target = ctor.newInstance(codeGenerator);
			return codeGenerator;
		} catch (e) {
if (e instanceof Exception) {
			g.tool.errMgr.toolError(ErrorType.CANNOT_CREATE_TARGET_GENERATOR, e, language);
			return null;
		} else {
	throw e;
	}
}
	

				break;
			}

			default: {
				throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
			}
		}
	}


	public  getTarget():  Target {
		return this.target;
	}

	public  getTemplates():  STGroup {
		return this.target.getTemplates();
	}

	public  generateLexer():  ST;
	public  generateLexer(header: boolean):  ST;
public generateLexer(...args: unknown[]):  ST {
		switch (args.length) {
			case 0: {
 return this.generateLexer(false); 

				break;
			}

			case 1: {
				const [header] = args as [boolean];

 return this.walk(this.createController().buildLexerOutputModel(header), header); 

				break;
			}

			default: {
				throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
			}
		}
	}


	public  generateParser():  ST;
	public  generateParser(header: boolean):  ST;
public generateParser(...args: unknown[]):  ST {
		switch (args.length) {
			case 0: {
 return this.generateParser(false); 

				break;
			}

			case 1: {
				const [header] = args as [boolean];

 return this.walk(this.createController().buildParserOutputModel(header), header); 

				break;
			}

			default: {
				throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
			}
		}
	}


	public  generateListener():  ST;
	public  generateListener(header: boolean):  ST;
public generateListener(...args: unknown[]):  ST {
		switch (args.length) {
			case 0: {
 return this.generateListener(false); 

				break;
			}

			case 1: {
				const [header] = args as [boolean];

 return this.walk(this.createController().buildListenerOutputModel(header), header); 

				break;
			}

			default: {
				throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
			}
		}
	}


	public  generateBaseListener():  ST;
	public  generateBaseListener(header: boolean):  ST;
public generateBaseListener(...args: unknown[]):  ST {
		switch (args.length) {
			case 0: {
 return this.generateBaseListener(false); 

				break;
			}

			case 1: {
				const [header] = args as [boolean];

 return this.walk(this.createController().buildBaseListenerOutputModel(header), header); 

				break;
			}

			default: {
				throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
			}
		}
	}


	public  generateVisitor():  ST;
	public  generateVisitor(header: boolean):  ST;
public generateVisitor(...args: unknown[]):  ST {
		switch (args.length) {
			case 0: {
 return this.generateVisitor(false); 

				break;
			}

			case 1: {
				const [header] = args as [boolean];

 return this.walk(this.createController().buildVisitorOutputModel(header), header); 

				break;
			}

			default: {
				throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
			}
		}
	}


	public  generateBaseVisitor():  ST;
	public  generateBaseVisitor(header: boolean):  ST;
public generateBaseVisitor(...args: unknown[]):  ST {
		switch (args.length) {
			case 0: {
 return this.generateBaseVisitor(false); 

				break;
			}

			case 1: {
				const [header] = args as [boolean];

 return this.walk(this.createController().buildBaseVisitorOutputModel(header), header); 

				break;
			}

			default: {
				throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
			}
		}
	}


	public  writeRecognizer(outputFileST: ST, header: boolean):  void {
		this.target.genFile(this.g, outputFileST, this.getRecognizerFileName(header));
	}

	public  writeListener(outputFileST: ST, header: boolean):  void {
		this.target.genFile(this.g, outputFileST, this.getListenerFileName(header));
	}

	public  writeBaseListener(outputFileST: ST, header: boolean):  void {
		this.target.genFile(this.g, outputFileST, this.getBaseListenerFileName(header));
	}

	public  writeVisitor(outputFileST: ST, header: boolean):  void {
		this.target.genFile(this.g, outputFileST, this.getVisitorFileName(header));
	}

	public  writeBaseVisitor(outputFileST: ST, header: boolean):  void {
		this.target.genFile(this.g, outputFileST, this.getBaseVisitorFileName(header));
	}

	public  writeVocabFile():  void {
		// write out the vocab interchange file; used by antlr,
		// does not change per target
		let  tokenVocabSerialization = this.getTokenVocabOutput();
		let  fileName = this.getVocabFileName();
		if ( fileName!==null ) {
			this.target.genFile(this.g, tokenVocabSerialization, fileName);
		}
	}

	public  write(code: ST, fileName: string):  void {
		try {
//			long start = System.currentTimeMillis();
			let  w = this.tool.getOutputFileWriter(this.g, fileName);
			let  wr = new  AutoIndentWriter(w);
			wr.setLineWidth(this.lineWidth);
			code.write(wr);
			w.close();
//			long stop = System.currentTimeMillis();
		} catch (ioe) {
if (ioe instanceof IOException) {
			this.tool.errMgr.toolError(ErrorType.CANNOT_WRITE_FILE,
								  ioe,
								  fileName);
		} else {
	throw ioe;
	}
}
	}

	public  getRecognizerFileName():  string;

	public  getRecognizerFileName(header: boolean):  string;
public getRecognizerFileName(...args: unknown[]):  string {
		switch (args.length) {
			case 0: {
 return this.getRecognizerFileName(false); 

				break;
			}

			case 1: {
				const [header] = args as [boolean];

 return this.target.getRecognizerFileName(header); 

				break;
			}

			default: {
				throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
			}
		}
	}

	public  getListenerFileName():  string;
	public  getListenerFileName(header: boolean):  string;
public getListenerFileName(...args: unknown[]):  string {
		switch (args.length) {
			case 0: {
 return this.getListenerFileName(false); 

				break;
			}

			case 1: {
				const [header] = args as [boolean];

 return this.target.getListenerFileName(header); 

				break;
			}

			default: {
				throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
			}
		}
	}

	public  getVisitorFileName():  string;
	public  getVisitorFileName(header: boolean):  string;
public getVisitorFileName(...args: unknown[]):  string {
		switch (args.length) {
			case 0: {
 return this.getVisitorFileName(false); 

				break;
			}

			case 1: {
				const [header] = args as [boolean];

 return this.target.getVisitorFileName(header); 

				break;
			}

			default: {
				throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
			}
		}
	}

	public  getBaseListenerFileName():  string;
	public  getBaseListenerFileName(header: boolean):  string;
public getBaseListenerFileName(...args: unknown[]):  string {
		switch (args.length) {
			case 0: {
 return this.getBaseListenerFileName(false); 

				break;
			}

			case 1: {
				const [header] = args as [boolean];

 return this.target.getBaseListenerFileName(header); 

				break;
			}

			default: {
				throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
			}
		}
	}

	public  getBaseVisitorFileName():  string;
	public  getBaseVisitorFileName(header: boolean):  string;
public getBaseVisitorFileName(...args: unknown[]):  string {
		switch (args.length) {
			case 0: {
 return this.getBaseVisitorFileName(false); 

				break;
			}

			case 1: {
				const [header] = args as [boolean];

 return this.target.getBaseVisitorFileName(header); 

				break;
			}

			default: {
				throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
			}
		}
	}


	/** What is the name of the vocab file generated for this grammar?
	 *  Returns null if no .tokens file should be generated.
	 */
	public  getVocabFileName():  string {
		return this.g.name+CodeGenerator.VOCAB_FILE_EXTENSION;
	}

	public  getHeaderFileName():  string {
		let  extST = this.getTemplates().getInstanceOf("headerFileExtension");
		if ( extST===null ) {
 return null;
}

		let  recognizerName = this.g.getRecognizerName();
		return recognizerName+extST.render();
	}

	/** Generate a token vocab file with all the token names/types.  For example:
	 *  ID=7
	 *  FOR=8
	 *  'for'=8
	 *
	 *  This is independent of the target language; used by antlr internally
	 */
	protected  getTokenVocabOutput(): ST {
		let  vocabFileST = new  ST(CodeGenerator.vocabFilePattern);
		let  tokens = new  LinkedHashMap<string,number>();
		// make constants for the token names
		for (let t of this.g.tokenNameToTypeMap.keySet()) {
			let  tokenType = this.g.tokenNameToTypeMap.get(t);
			if ( tokenType>=Token.MIN_USER_TOKEN_TYPE) {
				tokens.put(t, tokenType);
			}
		}
		vocabFileST.add("tokens", tokens);

		// now dump the strings
		let  literals = new  LinkedHashMap<string,number>();
		for (let literal of this.g.stringLiteralToTypeMap.keySet()) {
			let  tokenType = this.g.stringLiteralToTypeMap.get(literal);
			if ( tokenType>=Token.MIN_USER_TOKEN_TYPE) {
				literals.put(literal, tokenType);
			}
		}
		vocabFileST.add("literals", literals);

		return vocabFileST;
	}

	// CREATE TEMPLATES BY WALKING MODEL

	private  createController():  OutputModelController {
		let  factory = new  ParserFactory(this);
		let  controller = new  OutputModelController(factory);
		factory.setController(controller);
		return controller;
	}

	private  walk(outputModel: OutputModelObject, header: boolean):  ST {
		let  walker = new  OutputModelWalker(this.tool, this.getTemplates());
		return walker.walk(outputModel, header);
	}

}
