/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/* eslint-disable jsdoc/require-returns, jsdoc/require-param */

import { OutputModelObject } from "./OutputModelObject.js";
import { OutputFile } from "./OutputFile.js";
import { ModelElement } from "./ModelElement.js";
import { Action } from "./Action.js";
import { OutputModelFactory } from "../OutputModelFactory.js";
import { Grammar } from "../../tool/Grammar.js";
import { Rule } from "../../tool/Rule.js";
import { ActionAST } from "../../tool/ast/ActionAST.js";
import { AltAST } from "../../tool/ast/AltAST.js";
import { LinkedHashMap as HashMap } from "antlr4ng";

export  class VisitorFile extends OutputFile {
    public  genPackage:  string; // from -package cmd-line
    public  accessLevel:  string; // from -DaccessLevel cmd-line
    public  exportMacro:  string; // from -DexportMacro cmd-line
    public  grammarName:  string;
    public  parserName:  string;
	/**
	 * The names of all rule contexts which may need to be visited.
	 */
    public  visitorNames = new  java.util.LinkedHashSet<string>();
	/**
	 * For rule contexts created for a labeled outer alternative, maps from
	 * a listener context name to the name of the rule which defines the
	 * context.
	 */
    public  visitorLabelRuleNames = new  LinkedHashMap<string, string>();

    @ModelElement
    public  header:  Action;
    @ModelElement
    public  namedActions:  Map<string, Action>;

    public  constructor(factory: OutputModelFactory, fileName: string) {
        super(factory, fileName);
        const  g = factory.getGrammar();
        this.namedActions = this.buildNamedActions(g, (ast) => {return ast.getScope()===null;});
        this.parserName = g.getRecognizerName();
        this.grammarName = g.name;
        for (const r of g.rules.values()) {
            const  labels = r.getAltLabels();
            if ( labels!==null ) {
                for (const pair of labels.entrySet()) {
                    this.visitorNames.add(pair.getKey());
                    this.visitorLabelRuleNames.put(pair.getKey(), r.name);
                }
            }
            else {
				// if labels, must label all. no need for generic rule visitor then
                this.visitorNames.add(r.name);
            }
        }
        const  ast = g.namedActions.get("header");
        if ( ast!==null && ast.getScope()===null) {

            this.header = new  Action(factory, ast);
        }

        this.genPackage = g.tool.genPackage;
        this.accessLevel = g.getOptionString("accessLevel");
        this.exportMacro = g.getOptionString("exportMacro");
    }
}
