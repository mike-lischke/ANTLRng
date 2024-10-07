/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { RuleFunction } from "./RuleFunction.js";
import { RuleElement } from "./RuleElement.js";
import { ModelElement } from "./ModelElement.js";
import { LabeledOp } from "./LabeledOp.js";
import { ActionTranslator } from "../ActionTranslator.js";
import { CodeGenerator } from "../CodeGenerator.js";
import { ParserFactory } from "../ParserFactory.js";
import { Target } from "../Target.js";
import { ActionChunk } from "./chunk/ActionChunk.js";
import { Decl } from "./decl/Decl.js";
import { RuleContextDecl } from "./decl/RuleContextDecl.js";
import { RuleContextListDecl } from "./decl/RuleContextListDecl.js";
import { Rule } from "../../tool/Rule.js";
import { ActionAST } from "../../tool/ast/ActionAST.js";
import { GrammarAST } from "../../tool/ast/GrammarAST.js";
import { OrderedHashSet } from "antlr4ng";

export class InvokeRule extends RuleElement implements LabeledOp {
    public readonly name: string;
    public readonly escapedName: string;
    public readonly labels = new OrderedHashSet<Decl>(); // TODO: should need just 1
    public readonly ctxName: string;

    @ModelElement
    public argExprsChunks: ActionChunk[];

    public constructor(factory: ParserFactory, ast: GrammarAST, labelAST: GrammarAST) {
        super(factory, ast);
        if (ast.atnState !== null) {
            this.stateNumber = ast.atnState.stateNumber;
        }

        const gen = factory.getGenerator();
        const target = gen.getTarget();
        const identifier = ast.getText();
        const r = factory.getGrammar().getRule(identifier);
        this.name = r.name;
        this.escapedName = gen.getTarget().escapeIfNeeded(this.name);
        this.ctxName = target.getRuleFunctionContextStructName(r);

        // TODO: move to factory
        const rf = factory.getCurrentRuleFunction();
        if (labelAST !== null) {
            let decl: RuleContextDecl;
            // for x=r, define <rule-context-type> x and list_x
            const label = labelAST.getText();
            if (labelAST.parent.getType() === ANTLRParser.PLUS_ASSIGN) {
                factory.defineImplicitLabel(ast, this);
                const listLabel = gen.getTarget().getListLabel(label);
                decl = new RuleContextListDecl(factory, listLabel, this.ctxName);
            }
            else {
                decl = new RuleContextDecl(factory, label, this.ctxName);
                this.labels.add(decl);
            }
            rf.addContextDecl(ast.getAltLabel(), decl);
        }

        const arg = ast.getFirstChildWithType(ANTLRParser.ARG_ACTION) as ActionAST;
        if (arg !== null) {
            this.argExprsChunks = ActionTranslator.translateAction(factory, rf, arg.token, arg);
        }

        // If action refs rule as rulename not label, we need to define implicit label
        if (factory.getCurrentOuterMostAlt().ruleRefsInActions.containsKey(identifier)) {
            const label = gen.getTarget().getImplicitRuleLabel(identifier);
            const d = new RuleContextDecl(factory, label, this.ctxName);
            this.labels.add(d);
            rf.addContextDecl(ast.getAltLabel(), d);
        }
    }

    @Override
    public getLabels(): Decl[] {
        return this.labels.elements();
    }
}
