/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import type { IToolParameters } from "../../grammar-options.js";
import { ModelElement } from "../../misc/ModelElement.js";
import { OutputModelFactory } from "../OutputModelFactory.js";
import { Action } from "./Action.js";
import { Lexer } from "./Lexer.js";
import { OutputFile } from "./OutputFile.js";

export class LexerFile extends OutputFile {
    public genPackage?: string; // from -package cmd-line
    public exportMacro?: string; // from -DexportMacro cmd-line
    public genListener: boolean; // from -listener cmd-line
    public genVisitor: boolean; // from -visitor cmd-line

    @ModelElement
    public lexer: Lexer;

    @ModelElement
    public namedActions: Map<string, Action>;

    public constructor(factory: OutputModelFactory, fileName: string, toolParameters: IToolParameters) {
        super(factory, fileName);
        this.namedActions = this.buildNamedActions(factory.getGrammar()!);
        this.genPackage = toolParameters.package;
        this.exportMacro = factory.getGrammar()!.getOptionString("exportMacro");
        this.genListener = toolParameters.generateListener ?? true;
        this.genVisitor = toolParameters.generateVisitor ?? false;
    }
}
