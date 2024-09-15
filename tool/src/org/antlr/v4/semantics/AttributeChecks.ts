/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */



import { ActionSplitterListener } from "../parse/ActionSplitterListener.js";
import { Alternative } from "../tool/Alternative.js";
import { ErrorType } from "../tool/ErrorType.js";
import { Grammar } from "../tool/Grammar.js";
import { LabelElementPair } from "../tool/LabelElementPair.js";
import { LabelType } from "../tool/LabelType.js";
import { Rule } from "../tool/Rule.js";
import { ActionAST } from "../tool/ast/ActionAST.js";
import { GrammarAST } from "../tool/ast/GrammarAST.js";



/** Trigger checks for various kinds of attribute expressions.
 *  no side-effects.
 */
export class AttributeChecks implements ActionSplitterListener {
    public g: Grammar;
    public r: Rule;          // null if action outside of rule
    public alt: Alternative; // null if action outside of alt; could be in rule
    public node: ActionAST;
    public actionToken: Token; // token within action
    public errMgr: java.util.logging.ErrorManager;

    public constructor(g: Grammar, r: Rule, alt: Alternative, node: ActionAST, actionToken: Token) {
        this.g = g;
        this.r = r;
        this.alt = alt;
        this.node = node;
        this.actionToken = actionToken;
        this.errMgr = g.tool.errMgr;
    }

    public static checkAllAttributeExpressions(g: Grammar): void {
        for (let act of g.namedActions.values()) {
            let checker = new AttributeChecks(g, null, null, act, act.token);
            checker.examineAction();
        }

        for (let r of g.rules.values()) {
            for (let a of r.namedActions.values()) {
                let checker = new AttributeChecks(g, r, null, a, a.token);
                checker.examineAction();
            }
            for (let i = 1; i <= r.numberOfAlts; i++) {
                let alt = r.alt[i];
                for (let a of alt.actions) {
                    let checker =
                        new AttributeChecks(g, r, alt, a, a.token);
                    checker.examineAction();
                }
            }
            for (let e of r.exceptions) {
                let a = e.getChild(1) as ActionAST;
                let checker = new AttributeChecks(g, r, null, a, a.token);
                checker.examineAction();
            }
            if (r.finallyAction !== null) {
                let checker =
                    new AttributeChecks(g, r, null, r.finallyAction, r.finallyAction.token);
                checker.examineAction();
            }
        }
    }

    public examineAction(): void {
        //System.out.println("examine "+actionToken);
        let in = new ANTLRStringStream(this.actionToken.getText());
        in.setLine(this.actionToken.getLine());
        in.setCharPositionInLine(this.actionToken.getCharPositionInLine());
        let splitter = new ActionSplitter(in, this);
        // forces eval, triggers listener methods
        this.node.chunks = splitter.getActionTokens();
    }

    // LISTENER METHODS

    // $x.y
    @Override
    public qualifiedAttr(expr: string, x: Token, y: Token): void {
        if (this.g.isLexer()) {
            this.errMgr.grammarError(ErrorType.ATTRIBUTE_IN_LEXER_ACTION,
                this.g.fileName, x, x.getText() + "." + y.getText(), expr);
            return;
        }
        if (this.node.resolver.resolveToAttribute(x.getText(), this.node) !== null) {
            // must be a member access to a predefined attribute like $ctx.foo
            this.attr(expr, x);
            return;
        }

        if (this.node.resolver.resolveToAttribute(x.getText(), y.getText(), this.node) === null) {
            let rref = this.isolatedRuleRef(x.getText());
            if (rref !== null) {
                if (rref.args !== null && rref.args.get(y.getText()) !== null) {
                    this.g.tool.errMgr.grammarError(ErrorType.INVALID_RULE_PARAMETER_REF,
                        this.g.fileName, y, y.getText(), rref.name, expr);
                }
                else {
                    this.errMgr.grammarError(ErrorType.UNKNOWN_RULE_ATTRIBUTE,
                        this.g.fileName, y, y.getText(), rref.name, expr);
                }
            }
            else {
                if (!this.node.resolver.resolvesToAttributeDict(x.getText(), this.node)) {
                    this.errMgr.grammarError(ErrorType.UNKNOWN_SIMPLE_ATTRIBUTE,
                        this.g.fileName, x, x.getText(), expr);
                }
                else {
                    this.errMgr.grammarError(ErrorType.UNKNOWN_ATTRIBUTE_IN_SCOPE,
                        this.g.fileName, y, y.getText(), expr);
                }
            }

        }
    }

    @Override
    public setAttr(expr: string, x: Token, rhs: Token): void {
        if (this.g.isLexer()) {
            this.errMgr.grammarError(ErrorType.ATTRIBUTE_IN_LEXER_ACTION,
                this.g.fileName, x, x.getText(), expr);
            return;
        }
        if (this.node.resolver.resolveToAttribute(x.getText(), this.node) === null) {
            let errorType = ErrorType.UNKNOWN_SIMPLE_ATTRIBUTE;
            if (this.node.resolver.resolvesToListLabel(x.getText(), this.node)) {
                // $ids for ids+=ID etc...
                errorType = ErrorType.ASSIGNMENT_TO_LIST_LABEL;
            }

            this.errMgr.grammarError(errorType,
                this.g.fileName, x, x.getText(), expr);
        }
        new AttributeChecks(this.g, this.r, this.alt, this.node, rhs).examineAction();
    }

    @Override
    public attr(expr: string, x: Token): void {
        if (this.g.isLexer()) {
            this.errMgr.grammarError(ErrorType.ATTRIBUTE_IN_LEXER_ACTION,
                this.g.fileName, x, x.getText(), expr);
            return;
        }
        if (this.node.resolver.resolveToAttribute(x.getText(), this.node) === null) {
            if (this.node.resolver.resolvesToToken(x.getText(), this.node)) {
                return; // $ID for token ref or label of token
            }
            if (this.node.resolver.resolvesToListLabel(x.getText(), this.node)) {
                return; // $ids for ids+=ID etc...
            }
            if (this.isolatedRuleRef(x.getText()) !== null) {
                this.errMgr.grammarError(ErrorType.ISOLATED_RULE_REF,
                    this.g.fileName, x, x.getText(), expr);
                return;
            }
            this.errMgr.grammarError(ErrorType.UNKNOWN_SIMPLE_ATTRIBUTE,
                this.g.fileName, x, x.getText(), expr);
        }
    }

    @Override
    public nonLocalAttr(expr: string, x: Token, y: Token): void {
        let r = this.g.getRule(x.getText());
        if (r === null) {
            this.errMgr.grammarError(ErrorType.UNDEFINED_RULE_IN_NONLOCAL_REF,
                this.g.fileName, x, x.getText(), y.getText(), expr);
        }
        else {
            if (r.resolveToAttribute(y.getText(), null) === null) {
                this.errMgr.grammarError(ErrorType.UNKNOWN_RULE_ATTRIBUTE,
                    this.g.fileName, y, y.getText(), x.getText(), expr);

            }
        }

    }

    @Override
    public setNonLocalAttr(expr: string, x: Token, y: Token, rhs: Token): void {
        let r = this.g.getRule(x.getText());
        if (r === null) {
            this.errMgr.grammarError(ErrorType.UNDEFINED_RULE_IN_NONLOCAL_REF,
                this.g.fileName, x, x.getText(), y.getText(), expr);
        }
        else {
            if (r.resolveToAttribute(y.getText(), null) === null) {
                this.errMgr.grammarError(ErrorType.UNKNOWN_RULE_ATTRIBUTE,
                    this.g.fileName, y, y.getText(), x.getText(), expr);

            }
        }

    }

    @Override
    public text(text: string): void { }

    // don't care
    public templateInstance(expr: string): void { }
    public indirectTemplateInstance(expr: string): void { }
    public setExprAttribute(expr: string): void { }
    public setSTAttribute(expr: string): void { }
    public templateExpr(expr: string): void { }

    // SUPPORT

    public isolatedRuleRef(x: string): Rule {
        if (this.node.resolver instanceof Grammar) {
            return null;
        }


        if (x.equals(this.r.name)) {
            return this.r;
        }

        let labels = null;
        if (this.node.resolver instanceof Rule) {
            labels = this.r.getElementLabelDefs().get(x);
        }
        else {
            if (this.node.resolver instanceof Alternative) {
                labels = (this.node.resolver as Alternative).labelDefs.get(x);
            }
        }

        if (labels !== null) {  // it's a label ref. is it a rule label?
            let anyLabelDef = labels.get(0);
            if (anyLabelDef.type === LabelType.RULE_LABEL) {
                return this.g.getRule(anyLabelDef.element.getText());
            }
        }
        if (this.node.resolver instanceof Alternative) {
            if ((this.node.resolver as Alternative).ruleRefs.get(x) !== null) {
                return this.g.getRule(x);
            }
        }
        return null;
    }

}
