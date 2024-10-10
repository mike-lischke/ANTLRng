/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { GrammarAST } from "../../tool/ast/GrammarAST.js";
import { OutputModelFactory } from "../OutputModelFactory.js";
import { CodeBlockForOuterMostAlt } from "./CodeBlockForOuterMostAlt.js";
import { CodeBlock } from "./decl/CodeBlock.js";
import { OutputModelObject } from "./OutputModelObject.js";
import { RuleFunction } from "./RuleFunction.js";

export abstract class SrcOp extends OutputModelObject {

    /** Used to create unique var names etc... */
    public uniqueID?: number; // TODO: do we need?

    /**
     * All operations know in which block they live:
     *
     *  	CodeBlock, CodeBlockForAlt
     *
     *  Templates might need to know block nesting level or find
     *  a specific declaration, etc...
     */
    public enclosingBlock?: CodeBlock;

    public enclosingRuleFunction?: RuleFunction;

    public constructor(factory: OutputModelFactory, ast?: GrammarAST) {
        super(factory, ast);
        this.uniqueID = ast?.token?.tokenIndex;

        this.enclosingBlock = factory.getCurrentBlock()!;
        this.enclosingRuleFunction = factory.getCurrentRuleFunction();
    }

    /** Walk upwards in model tree, looking for outer alt's code block */
    public getOuterMostAltCodeBlock(): CodeBlockForOuterMostAlt | undefined {
        if (this instanceof CodeBlockForOuterMostAlt) {
            return this as CodeBlockForOuterMostAlt;
        }

        let p = this.enclosingBlock;
        while (p) {
            if (p instanceof CodeBlockForOuterMostAlt) {
                return p;
            }

            p = p.enclosingBlock;
        }

        return undefined;
    }

    /** Return label alt or return name of rule */
    public getContextName(): string {
        const alt = this.getOuterMostAltCodeBlock();
        if (alt?.altLabel) {
            return alt.altLabel;
        }

        return this.enclosingRuleFunction!.name;
    }
}
