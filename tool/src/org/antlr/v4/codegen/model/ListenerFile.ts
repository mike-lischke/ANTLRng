/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/* eslint-disable jsdoc/require-returns, jsdoc/require-param */


import { OutputFile } from "./OutputFile.js";
import { ModelElement } from "./ModelElement.js";
import { Action } from "./Action.js";
import { OutputModelFactory } from "../OutputModelFactory.js";
import { Grammar } from "../../tool/Grammar.js";
import { Rule } from "../../tool/Rule.js";
import { ActionAST } from "../../tool/ast/ActionAST.js";
import { AltAST } from "../../tool/ast/AltAST.js";
import { LinkedHashMap as HashMap } from "antlr4ng";



/** A model object representing a parse tree listener file.
 *  These are the rules specific events triggered by a parse tree visitor.
 */
export  class ListenerFile extends OutputFile {
	public  genPackage:  string; // from -package cmd-line
	public  accessLevel:  string; // from -DaccessLevel cmd-line
	public  exportMacro:  string; // from -DexportMacro cmd-line
	public  grammarName:  string;
	public  parserName:  string;
	/**
	 * The names of all listener contexts.
	 */
	public  listenerNames = new  java.util.LinkedHashSet<string>();
	/**
	 * For listener contexts created for a labeled outer alternative, maps from
	 * a listener context name to the name of the rule which defines the
	 * context.
	 */
	public  listenerLabelRuleNames = new  LinkedHashMap<string, string>();

	@ModelElement
public  header:  Action;
	@ModelElement
public  namedActions:  Map<string, Action>;

	public  constructor(factory: OutputModelFactory, fileName: string) {
		super(factory, fileName);
		let  g = factory.getGrammar();
		this.parserName = g.getRecognizerName();
		this.grammarName = g.name;
		this.namedActions = this.buildNamedActions(factory.getGrammar(), ast => ast.getScope() === null);
		for (let r of g.rules.values()) {
			let  labels = r.getAltLabels();
			if ( labels!==null ) {
				for (let pair of labels.entrySet()) {
					this.listenerNames.add(pair.getKey());
					this.listenerLabelRuleNames.put(pair.getKey(), r.name);
				}
			}
			else {
				// only add rule context if no labels
				this.listenerNames.add(r.name);
			}
		}
		let  ast = g.namedActions.get("header");
		if ( ast!==null && ast.getScope()===null ) {
			this.header = new  Action(factory, ast);
		}
		this.genPackage = g.tool.genPackage;
		this.accessLevel = g.getOptionString("accessLevel");
		this.exportMacro = g.getOptionString("exportMacro");
	}
}
