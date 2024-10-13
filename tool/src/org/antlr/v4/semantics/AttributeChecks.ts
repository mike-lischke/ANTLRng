/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { CharStream } from "antlr4ng";

import { ActionSplitter } from "../../../../../../src/generated/ActionSplitter.js";

import { ActionSplitterListener } from "../parse/ActionSplitterListener.js";
import { Alternative } from "../tool/Alternative.js";
import { ActionAST } from "../tool/ast/ActionAST.js";
import type { ErrorManager } from "../tool/ErrorManager.js";
import { ErrorType } from "../tool/ErrorType.js";
import { Grammar } from "../tool/Grammar.js";
import { LabelType } from "../tool/LabelType.js";
import { Rule } from "../tool/Rule.js";

/**
 * Trigger checks for various kinds of attribute expressions.
 * no side-effects.
 */
export class AttributeChecks implements ActionSplitterListener {
    public g: Grammar;
    public r: Rule | null; // null if action outside of rule
    public alt: Alternative | null; // null if action outside of alt; could be in rule
    public node: ActionAST;
    public actionText: string;
    public errMgr: ErrorManager;

    public constructor(g: Grammar, r: Rule | null, alt: Alternative | null, node: ActionAST, actionText: string) {
        this.g = g;
        this.r = r;
        this.alt = alt;
        this.node = node;
        this.actionText = actionText;
        this.errMgr = g.tool.errMgr;
    }

    public static checkAllAttributeExpressions(g: Grammar): void {
        for (const act of g.namedActions.values()) {
            const checker = new AttributeChecks(g, null, null, act, act.token!.text!);
            checker.examineAction();
        }

        for (const r of g.rules.values()) {
            for (const a of r.namedActions.values()) {
                const checker = new AttributeChecks(g, r, null, a, a.token!.text!);
                checker.examineAction();
            }

            for (let i = 1; i <= r.numberOfAlts; i++) {
                const alt = r.alt[i];
                for (const a of alt.actions) {
                    const checker = new AttributeChecks(g, r, alt, a, a.token!.text!);
                    checker.examineAction();
                }
            }

            for (const e of r.exceptions) {
                const a = e.getChild(1) as ActionAST;
                const checker = new AttributeChecks(g, r, null, a, a.token!.text!);
                checker.examineAction();
            }

            if (r.finallyAction) {
                const checker = new AttributeChecks(g, r, null, r.finallyAction, r.finallyAction.token!.text!);
                checker.examineAction();
            }
        }
    }

    public examineAction(): void {
        const input = CharStream.fromString(this.actionText);
        //input.setLine(this.actionToken.getLine());
        //input.setCharPositionInLine(this.actionToken.getCharPositionInLine());
        const splitter = new ActionSplitter(input);

        // forces eval, triggers listener methods
        this.node.chunks = splitter.getActionTokens(this);
    }

    // LISTENER METHODS

    // $x.y

    public qualifiedAttr(expr: string, x: string, y: string): void {
        if (this.g.isLexer()) {
            this.errMgr.grammarError(ErrorType.ATTRIBUTE_IN_LEXER_ACTION, this.g.fileName, null, x + "." + y, expr);

            return;
        }

        if (this.node.resolver.resolveToAttribute(x, this.node) !== null) {
            // must be a member access to a predefined attribute like $ctx.foo
            this.attr(expr, x);

            return;
        }

        if (this.node.resolver.resolveToAttribute(x, y, this.node) === null) {
            const ruleRef = this.isolatedRuleRef(x);
            if (ruleRef) {
                if (ruleRef.args?.get(y) !== null) {
                    this.g.tool.errMgr.grammarError(ErrorType.INVALID_RULE_PARAMETER_REF, this.g.fileName, null, y,
                        ruleRef.name, expr);
                } else {
                    this.errMgr.grammarError(ErrorType.UNKNOWN_RULE_ATTRIBUTE, this.g.fileName, null, y, ruleRef.name,
                        expr);
                }
            } else if (!this.node.resolver.resolvesToAttributeDict(x, this.node)) {
                this.errMgr.grammarError(ErrorType.UNKNOWN_SIMPLE_ATTRIBUTE, this.g.fileName, null, x, expr);
            } else {
                this.errMgr.grammarError(ErrorType.UNKNOWN_ATTRIBUTE_IN_SCOPE, this.g.fileName, null, y, expr);
            }
        }
    }

    public setAttr(expr: string, x: string, rhs: string): void {
        if (this.g.isLexer()) {
            this.errMgr.grammarError(ErrorType.ATTRIBUTE_IN_LEXER_ACTION,
                this.g.fileName, null, x, expr);

            return;
        }
        if (this.node.resolver.resolveToAttribute(x, this.node) === null) {
            let errorType = ErrorType.UNKNOWN_SIMPLE_ATTRIBUTE;
            if (this.node.resolver.resolvesToListLabel(x, this.node)) {
                // $ids for ids+=ID etc...
                errorType = ErrorType.ASSIGNMENT_TO_LIST_LABEL;
            }

            this.errMgr.grammarError(errorType, this.g.fileName, null, x, expr);
        }
        new AttributeChecks(this.g, this.r, this.alt, this.node, rhs).examineAction();
    }

    public attr(expr: string, x: string): void {
        if (this.g.isLexer()) {
            this.errMgr.grammarError(ErrorType.ATTRIBUTE_IN_LEXER_ACTION, this.g.fileName, null, x, expr);

            return;
        }

        if (this.node.resolver.resolveToAttribute(x, this.node) === null) {
            if (this.node.resolver.resolvesToToken(x, this.node)) {
                return; // $ID for token ref or label of token
            }

            if (this.node.resolver.resolvesToListLabel(x, this.node)) {
                return; // $ids for ids+=ID etc...
            }

            if (this.isolatedRuleRef(x) !== null) {
                this.errMgr.grammarError(ErrorType.ISOLATED_RULE_REF,
                    this.g.fileName, null, x, expr);

                return;
            }
            this.errMgr.grammarError(ErrorType.UNKNOWN_SIMPLE_ATTRIBUTE, this.g.fileName, null, x, expr);
        }
    }

    public nonLocalAttr(expr: string, x: string, y: string): void {
        const r = this.g.getRule(x);
        if (r === null) {
            this.errMgr.grammarError(ErrorType.UNDEFINED_RULE_IN_NONLOCAL_REF,
                this.g.fileName, null, x, y, expr);
        } else if (r.resolveToAttribute(y, null) === null) {
            this.errMgr.grammarError(ErrorType.UNKNOWN_RULE_ATTRIBUTE, this.g.fileName, null, y, x, expr);
        }
    }

    public setNonLocalAttr(expr: string, x: string, y: string, rhs: string): void {
        const r = this.g.getRule(x);
        if (r === null) {
            this.errMgr.grammarError(ErrorType.UNDEFINED_RULE_IN_NONLOCAL_REF, this.g.fileName, null, x, y, expr);
        } else if (r.resolveToAttribute(y, null) === null) {
            this.errMgr.grammarError(ErrorType.UNKNOWN_RULE_ATTRIBUTE, this.g.fileName, null, y, x, expr);
        }
    }

    public text(text: string): void { /**/ }

    // don't care
    public templateInstance(expr: string): void { /**/ }
    public indirectTemplateInstance(expr: string): void { /**/ }
    public setExprAttribute(expr: string): void { /**/ }
    public setSTAttribute(expr: string): void { /**/ }
    public templateExpr(expr: string): void { /**/ }

    // SUPPORT

    public isolatedRuleRef(x: string): Rule | null {
        if (this.node.resolver instanceof Grammar) {
            return null;
        }

        if (x === this.r?.name) {
            return this.r;
        }

        let labels = null;
        if (this.node.resolver instanceof Rule) {
            labels = this.r!.getElementLabelDefs().get(x);
        } else if (this.node.resolver instanceof Alternative) {
            labels = (this.node.resolver).labelDefs.get(x);
        }

        if (labels) { // it's a label ref. is it a rule label?
            const anyLabelDef = labels[0];
            if (anyLabelDef.type === LabelType.RULE_LABEL) {
                return this.g.getRule(anyLabelDef.element.getText()!);
            }
        }

        if (this.node.resolver instanceof Alternative) {
            if (this.node.resolver.ruleRefs.get(x)) {
                return this.g.getRule(x);
            }
        }

        return null;
    }

}
