/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/* eslint-disable jsdoc/require-param */

import { HashSet } from "antlr4ng";

import { GrammarTreeVisitor } from "../tree-walkers/GrammarTreeVisitor.js";

import { ActionAST } from "../tool/ast/ActionAST.js";
import { AltAST } from "../tool/ast/AltAST.js";
import { GrammarAST } from "../tool/ast/GrammarAST.js";
import { GrammarASTWithOptions } from "../tool/ast/GrammarASTWithOptions.js";
import { PredAST } from "../tool/ast/PredAST.js";
import { RuleAST } from "../tool/ast/RuleAST.js";
import { TerminalAST } from "../tool/ast/TerminalAST.js";
import type { ErrorManager } from "../tool/ErrorManager.js";
import { Grammar } from "../tool/Grammar.js";
import { LabelElementPair } from "../tool/LabelElementPair.js";
import { Rule } from "../tool/Rule.js";

/**
 * Collects (create) rules, terminals, strings, actions, scopes etc... from AST side-effects: sets resolver field
 * of asts for actions and defines predicates via definePredicateInAlt(), collects actions and stores in alts.
 * TODO: remove side-effects!
 */
export class SymbolCollector extends GrammarTreeVisitor {
    /** which grammar are we checking */
    public g: Grammar;

    // stuff to collect
    public ruleRefs = new Array<GrammarAST>();
    public qualifiedRuleRefs = new Array<GrammarAST>();
    public terminals = new Array<GrammarAST>();
    public tokenIDRefs = new Array<GrammarAST>();
    public strings = new HashSet<string>();
    public tokensDefs = new Array<GrammarAST>();
    public channelDefs = new Array<GrammarAST>();

    public errMgr: ErrorManager;

    // context
    public currentRule: Rule | null = null;

    /** Track action name node in @parser::members {...} or @members {...} */
    public readonly namedActions = new Array<GrammarAST>();

    public constructor(g: Grammar) {
        super();

        this.g = g;
        this.errMgr = g.tool.errMgr;
    }

    public override getErrorManager(): ErrorManager {
        return this.errMgr;
    }

    public process(ast: GrammarAST): void {
        this.visitGrammar(ast);
    }

    public override globalNamedAction(scope: GrammarAST, ID: GrammarAST, action: ActionAST): void {
        action.setScope(scope);
        this.namedActions.push(ID.getParent() as GrammarAST);
        action.resolver = this.g;
    }

    public override defineToken(ID: GrammarAST): void {
        this.terminals.push(ID);
        this.tokenIDRefs.push(ID);
        this.tokensDefs.push(ID);
    }

    public override defineChannel(ID: GrammarAST): void {
        this.channelDefs.push(ID);
    }

    public override discoverRule(rule: RuleAST, ID: GrammarAST, modifiers: GrammarAST[], arg: ActionAST,
        returns: ActionAST, throws: GrammarAST, options: GrammarAST, locals: ActionAST, actions: GrammarAST[],
        block: GrammarAST): void {
        this.currentRule = this.g.getRule(ID.getText()!);
    }

    public override discoverLexerRule(rule: RuleAST, ID: GrammarAST, modifiers: GrammarAST[], options: GrammarAST,
        block: GrammarAST): void {
        this.currentRule = this.g.getRule(ID.getText()!);
    }

    public override discoverOuterAlt(alt: AltAST): void {
        this.currentRule!.alt[this.currentOuterAltNumber].ast = alt;
    }

    public override actionInAlt(action: ActionAST): void {
        this.currentRule!.defineActionInAlt(this.currentOuterAltNumber, action);
        action.resolver = this.currentRule!.alt[this.currentOuterAltNumber];
    }

    public override sempredInAlt(pred: PredAST): void {
        this.currentRule!.definePredicateInAlt(this.currentOuterAltNumber, pred);
        pred.resolver = this.currentRule!.alt[this.currentOuterAltNumber];
    }

    public override ruleCatch(arg: GrammarAST, action: ActionAST): void {
        const catchMe = action.getParent() as GrammarAST;
        this.currentRule!.exceptions.push(catchMe);
        action.resolver = this.currentRule!;
    }

    public override finallyAction(action: ActionAST): void {
        this.currentRule!.finallyAction = action;
        action.resolver = this.currentRule!;
    }

    public override label(op: GrammarAST, ID: GrammarAST, element: GrammarAST): void {
        const lp = new LabelElementPair(this.g, ID, element, op.getType());

        const list = this.currentRule!.alt[this.currentOuterAltNumber].labelDefs.get(ID.getText()!);
        if (list) {
            list.push(lp);
        } else {
            this.currentRule!.alt[this.currentOuterAltNumber].labelDefs.set(ID.getText()!, [lp]);
        }
    }

    public override stringRef(ref: TerminalAST): void {
        this.terminals.push(ref);
        this.strings.add(ref.getText()!);
        if (this.currentRule) {
            const list = this.currentRule.alt[this.currentOuterAltNumber].tokenRefs.get(ref.getText()!);
            if (list) {
                list.push(ref);
            } else {
                this.currentRule.alt[this.currentOuterAltNumber].tokenRefs.set(ref.getText()!, [ref]);
            }
        }
    }

    public override tokenRef(ref: TerminalAST): void {
        this.terminals.push(ref);
        this.tokenIDRefs.push(ref);
        if (this.currentRule) {
            const list = this.currentRule.alt[this.currentOuterAltNumber].tokenRefs.get(ref.getText()!);
            if (list) {
                list.push(ref);
            } else {
                this.currentRule.alt[this.currentOuterAltNumber].tokenRefs.set(ref.getText()!, [ref]);
            }
        }
    }

    public override ruleRef(ref: GrammarAST, arg: ActionAST): void {
        this.ruleRefs.push(ref);
        if (this.currentRule !== null) {
            const list = this.currentRule.alt[this.currentOuterAltNumber].ruleRefs.get(ref.getText()!,);
            if (list) {
                list.push(ref);
            } else {
                this.currentRule.alt[this.currentOuterAltNumber].ruleRefs.set(ref.getText()!, [ref]);
            }
        }
    }

    public override grammarOption(ID: GrammarAST, valueAST: GrammarAST): void {
        this.setActionResolver(valueAST);
    }

    public override ruleOption(ID: GrammarAST, valueAST: GrammarAST): void {
        this.setActionResolver(valueAST);
    }

    public override blockOption(ID: GrammarAST, valueAST: GrammarAST): void {
        this.setActionResolver(valueAST);
    }

    public override elementOption(t: GrammarASTWithOptions): GrammarTreeVisitor.elementOption_return;
    public override elementOption(t: GrammarASTWithOptions, ID: GrammarAST, valueAST: GrammarAST): void;
    public override elementOption(...args: unknown[]): GrammarTreeVisitor.elementOption_return | void {
        if (args.length === 3) {
            this.setActionResolver(args[2] as GrammarAST);
        } else {
            return super.elementOption(args[0] as GrammarASTWithOptions);
        }
    }

    /** In case of option id={...}, set resolve in case they use $foo */
    private setActionResolver(valueAST: GrammarAST): void {
        if (valueAST instanceof ActionAST) {
            (valueAST).resolver = this.currentRule!.alt[this.currentOuterAltNumber];
        }
    }
}
