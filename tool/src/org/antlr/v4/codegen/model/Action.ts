/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { RuleFunction } from "./RuleFunction.js";
import { RuleElement } from "./RuleElement.js";
import { ModelElement } from "./ModelElement.js";
import { ActionTranslator } from "../ActionTranslator.js";
import { OutputModelFactory } from "../OutputModelFactory.js";
import { ActionChunk } from "./chunk/ActionChunk.js";
import { ActionTemplate } from "./chunk/ActionTemplate.js";
import { ActionText } from "./chunk/ActionText.js";
import { StructDecl } from "./decl/StructDecl.js";
import { ActionAST } from "../../tool/ast/ActionAST.js";

/** */
export class Action extends RuleElement {
    @ModelElement
    public chunks: ActionChunk[];

    public constructor(factory: OutputModelFactory, ast: ActionAST);

    public constructor(factory: OutputModelFactory, ctx: StructDecl, action: string);

    public constructor(factory: OutputModelFactory, ctx: StructDecl, actionST: ST);
    public constructor(...args: unknown[]) {
        switch (args.length) {
            case 2: {
                const [factory, ast] = args as [OutputModelFactory, ActionAST];

                super(factory, ast);
                const rf = factory.getCurrentRuleFunction();
                if (ast !== null) {
                    this.chunks = ActionTranslator.translateAction(factory, rf, ast.token, ast);
                }
                else {
                    this.chunks = new Array<ActionChunk>();
                }
                //System.out.println("actions="+chunks);

                break;
            }

            case 3: {
                const [factory, ctx, action] = args as [OutputModelFactory, StructDecl, string];

                super(factory, null);
                const ast = new ActionAST(new CommonToken(ANTLRParser.ACTION, action));
                const rf = factory.getCurrentRuleFunction();
                if (rf !== null) { // we can translate
                    ast.resolver = rf.rule;
                    this.chunks = ActionTranslator.translateActionChunk(factory, rf, action, ast);
                }
                else {
                    this.chunks = new Array<ActionChunk>();
                    this.chunks.add(new ActionText(ctx, action));
                }

                break;
            }

            case 3: {
                const [factory, ctx, actionST] = args as [OutputModelFactory, StructDecl, ST];

                super(factory, null);
                this.chunks = new Array<ActionChunk>();
                this.chunks.add(new ActionTemplate(ctx, actionST));

                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }

}
