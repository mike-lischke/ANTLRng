/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */


/* eslint-disable jsdoc/require-returns, jsdoc/require-param */


import { Parser } from "./Parser.js";
import { OutputFile } from "./OutputFile.js";
import { ModelElement } from "./ModelElement.js";
import { Action } from "./Action.js";
import { OutputModelFactory } from "../OutputModelFactory.js";
import { ActionChunk } from "./chunk/ActionChunk.js";
import { ActionText } from "./chunk/ActionText.js";
import { Grammar } from "../../tool/Grammar.js";



/** */
export  class ParserFile extends OutputFile {
	public  genPackage:  string; // from -package cmd-line
	public  exportMacro:  string; // from -DexportMacro cmd-line
	public  genListener:  boolean; // from -listener cmd-line
	public  genVisitor:  boolean; // from -visitor cmd-line
	@ModelElement
public  parser:  Parser;
	@ModelElement
public  namedActions:  Map<string, Action>;
	@ModelElement
public  contextSuperClass:  ActionChunk;
	public  grammarName:  string;

	public  constructor(factory: OutputModelFactory, fileName: string) {
		super(factory, fileName);
		let  g = factory.getGrammar();
		this.namedActions = this.buildNamedActions(factory.getGrammar());
		this.genPackage = g.tool.genPackage;
		this.exportMacro = factory.getGrammar().getOptionString("exportMacro");
		// need the below members in the ST for Python, C++
		this.genListener = g.tool.gen_listener;
		this.genVisitor = g.tool.gen_visitor;
		this.grammarName = g.name;

		if (g.getOptionString("contextSuperClass") !== null) {
			this.contextSuperClass = new  ActionText(null, g.getOptionString("contextSuperClass"));
		}
	}
}
