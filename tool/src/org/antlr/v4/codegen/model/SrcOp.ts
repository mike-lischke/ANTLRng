/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { RuleFunction } from "./RuleFunction.js";
import { OutputModelObject } from "./OutputModelObject.js";
import { CodeBlockForOuterMostAlt } from "./CodeBlockForOuterMostAlt.js";
import { OutputModelFactory } from "../OutputModelFactory.js";
import { CodeBlock } from "./decl/CodeBlock.js";
import { GrammarAST } from "../../tool/ast/GrammarAST.js";

export abstract class SrcOp extends OutputModelObject {
    /** Used to create unique var names etc... */
    public uniqueID: number; // TODO: do we need?

    /**
     * All operations know in which block they live:
     *
     *  	CodeBlock, CodeBlockForAlt
     *
     *  Templates might need to know block nesting level or find
     *  a specific declaration, etc...
     */
    public enclosingBlock: CodeBlock;

    public enclosingRuleRunction: RuleFunction;

    public constructor(factory: OutputModelFactory);
    public constructor(factory: OutputModelFactory, ast: GrammarAST);
    public constructor(...args: unknown[]) {
        switch (args.length) {
            case 1: {
                const [factory] = args as [OutputModelFactory];

                this(factory, null);

                break;
            }

            case 2: {
                const [factory, ast] = args as [OutputModelFactory, GrammarAST];

                super(factory, ast);
                if (ast !== null) {
                    this.uniqueID = ast.token.getTokenIndex();
                }

                this.enclosingBlock = factory.getCurrentBlock();
                this.enclosingRuleRunction = factory.getCurrentRuleFunction();

                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }

    /** Walk upwards in model tree, looking for outer alt's code block */
    public getOuterMostAltCodeBlock(): CodeBlockForOuterMostAlt {
        if (this instanceof CodeBlockForOuterMostAlt) {
            return this as CodeBlockForOuterMostAlt;
        }
        let p = this.enclosingBlock;
        while (p !== null) {
            if (p instanceof CodeBlockForOuterMostAlt) {
                return p;
            }
            p = p.enclosingBlock;
        }

        return null;
    }

    /** Return label alt or return name of rule */
    public getContextName(): string {
        const alt = this.getOuterMostAltCodeBlock();
        if (alt !== null && alt.altLabel !== null) {
            return alt.altLabel;
        }

        return this.enclosingRuleRunction.name;
    }
}
