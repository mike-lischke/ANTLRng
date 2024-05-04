/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/* eslint-disable jsdoc/require-returns, jsdoc/require-param */

import { OutputModelObject } from "./OutputModelObject.js";
import { Action } from "./Action.js";
import { Tool } from "../../Tool.js";
import { OutputModelFactory } from "../OutputModelFactory.js";
import { Grammar } from "../../tool/Grammar.js";
import { ActionAST } from "../../tool/ast/ActionAST.js";
import { HashMap } from "antlr4ng";

export abstract  class OutputFile extends OutputModelObject {
    public readonly  fileName:  string;
    public readonly  grammarFileName:  string;
    public readonly  ANTLRVersion:  string;
    public readonly  TokenLabelType:  string;
    public readonly  InputSymbolType:  string;

    public  constructor(factory: OutputModelFactory, fileName: string) {
        super(factory);
        this.fileName = fileName;
        const  g = factory.getGrammar();
        this.grammarFileName = g.fileName.replace("\\", "/"); // Prevent a path with windows delim and u breaking Java pre-parser on comments
        this.ANTLRVersion = Tool.VERSION;
        this.TokenLabelType = g.getOptionString("TokenLabelType");
        this.InputSymbolType = this.TokenLabelType;
    }

    public  buildNamedActions(g: Grammar):  Map<string, Action>;

    public  buildNamedActions(g: Grammar, filter: Predicate<ActionAST>):  Map<string, Action>;
    public buildNamedActions(...args: unknown[]):  Map<string, Action> {
        switch (args.length) {
            case 1: {
                const [g] = args as [Grammar];

                return this.buildNamedActions(g, null);

                break;
            }

            case 2: {
                const [g, filter] = args as [Grammar, Predicate<ActionAST>];

                const  namedActions = new  HashMap<string, Action>();
                for (const name of g.namedActions.keySet()) {
                    const  ast = g.namedActions.get(name);
                    if(filter===null || filter.test(ast)) {

                        namedActions.put(name, new  Action(this.factory, ast));
                    }

                }

                return namedActions;

                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }

}
