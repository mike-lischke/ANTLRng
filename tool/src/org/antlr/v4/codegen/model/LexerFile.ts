/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { OutputFile } from "./OutputFile.js";
import { ModelElement } from "./ModelElement.js";
import { Lexer } from "./Lexer.js";
import { Action } from "./Action.js";
import { OutputModelFactory } from "../OutputModelFactory.js";

export class LexerFile extends OutputFile {
    public genPackage: string; // from -package cmd-line
    public exportMacro: string; // from -DexportMacro cmd-line
    public genListener: boolean; // from -listener cmd-line
    public genVisitor: boolean; // from -visitor cmd-line

    public lexer: Lexer;

    public namedActions: Map<string, Action>;

    public constructor(factory: OutputModelFactory, fileName: string) {
        super(factory, fileName);
        this.namedActions = this.buildNamedActions(factory.getGrammar());
        this.genPackage = factory.getGrammar().tool.genPackage;
        this.exportMacro = factory.getGrammar().getOptionString("exportMacro");
        this.genListener = factory.getGrammar().tool.gen_listener;
        this.genVisitor = factory.getGrammar().tool.gen_visitor;
    }
}
