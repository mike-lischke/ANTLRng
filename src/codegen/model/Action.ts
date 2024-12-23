/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { CommonToken } from "antlr4ng";
import type { IST } from "stringtemplate4ts";

import { ANTLRv4Parser } from "../../generated/ANTLRv4Parser.js";

import { ModelElement } from "../../misc/ModelElement.js";
import { ActionAST } from "../../tool/ast/ActionAST.js";
import { ActionTranslator } from "../ActionTranslator.js";
import { OutputModelFactory } from "../OutputModelFactory.js";
import { ActionChunk } from "./chunk/ActionChunk.js";
import { ActionTemplate } from "./chunk/ActionTemplate.js";
import { ActionText } from "./chunk/ActionText.js";
import { StructDecl } from "./decl/StructDecl.js";
import { RuleElement } from "./RuleElement.js";

export class Action extends RuleElement {

    @ModelElement
    public chunks: ActionChunk[] = [];

    public constructor(factory: OutputModelFactory, ast?: ActionAST);
    public constructor(factory: OutputModelFactory, ctx: StructDecl, action: string | IST);
    public constructor(...args: unknown[]) {
        if (args.length === 1) {
            super(args[0] as OutputModelFactory);
        } else if (args.length === 2) {
            const [factory, ast] = args as [OutputModelFactory, ActionAST | undefined];

            super(factory, ast);
            const rf = factory.getCurrentRuleFunction() ?? null;
            if (ast) {
                this.chunks = ActionTranslator.translateAction(factory, rf, ast.token!, ast);
            }
        } else {
            const [factory, ctx, action] = args as [OutputModelFactory, StructDecl, string | IST];

            super(factory);

            if (typeof action === "string") {
                const ast = new ActionAST(CommonToken.fromType(ANTLRv4Parser.AT, action));
                const rf = factory.getCurrentRuleFunction();
                if (rf) { // we can translate
                    ast.resolver = rf.rule;
                    this.chunks = ActionTranslator.translateActionChunk(factory, rf, action, ast);
                } else {
                    this.chunks.push(new ActionText(ctx, action));
                }
            } else {
                this.chunks.push(new ActionTemplate(ctx, action));
            }
        }

        /*const factory = args.shift() as OutputModelFactory;
        const next = args.length > 0 ? args.shift() as ActionAST | StructDecl | undefined : undefined;
        const action = args.length > 0 ? args.shift() as string | IST : undefined;

        if (!next) {
            super(factory);
        } else if (next instanceof ActionAST) {
            super(factory, next);
            const rf = factory.getCurrentRuleFunction() ?? null;
            this.chunks = ActionTranslator.translateAction(factory, rf, next.token!, next);
        } else {
            super(factory);

            if (typeof action === "string") {
                const ast = new ActionAST(CommonToken.fromType(ANTLRv4Parser.AT, action));
                const rf = factory.getCurrentRuleFunction();
                if (rf) { // we can translate
                    ast.resolver = rf.rule;
                    this.chunks = ActionTranslator.translateActionChunk(factory, rf, action, ast);
                } else {
                    this.chunks.push(new ActionText(next, action));
                }
            } else {
                this.chunks.push(new ActionTemplate(next, action!));
            }
        }*/
    }

}
