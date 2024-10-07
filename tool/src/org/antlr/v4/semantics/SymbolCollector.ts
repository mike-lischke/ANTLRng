/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { Grammar } from "../tool/Grammar.js";
import { LabelElementPair } from "../tool/LabelElementPair.js";
import { Rule } from "../tool/Rule.js";
import { ActionAST } from "../tool/ast/ActionAST.js";
import { AltAST } from "../tool/ast/AltAST.js";
import { GrammarAST } from "../tool/ast/GrammarAST.js";
import { GrammarASTWithOptions } from "../tool/ast/GrammarASTWithOptions.js";
import { PredAST } from "../tool/ast/PredAST.js";
import { RuleAST } from "../tool/ast/RuleAST.js";
import { TerminalAST } from "../tool/ast/TerminalAST.js";
import { HashSet } from "antlr4ng";

/**
 * Collects (create) rules, terminals, strings, actions, scopes etc... from AST
 *  side-effects: sets resolver field of asts for actions and
 *  defines predicates via definePredicateInAlt(), collects actions and stores
 *  in alts.
 *  TODO: remove side-effects!
 */
export class SymbolCollector extends GrammarTreeVisitor {
    /** which grammar are we checking */
    public g: Grammar;

    // stuff to collect
    public rulerefs = new Array<GrammarAST>();
    public qualifiedRulerefs = new Array<GrammarAST>();
    public terminals = new Array<GrammarAST>();
    public tokenIDRefs = new Array<GrammarAST>();
    public strings = new HashSet<string>();
    public tokensDefs = new Array<GrammarAST>();
    public channelDefs = new Array<GrammarAST>();

    public errMgr: java.util.logging.ErrorManager;

    // context
    public currentRule: Rule;

    /** Track action name node in @parser::members {...} or @members {...} */
    protected namedActions = new Array<GrammarAST>();

    public constructor(g: Grammar) {
        this.g = g;
        this.errMgr = g.tool.errMgr;
    }

    @Override
    public getErrorManager(): java.util.logging.ErrorManager { return this.errMgr; }

    public process(ast: GrammarAST): void { visitGrammar(ast); }

    @Override
    public globalNamedAction(scope: GrammarAST, ID: GrammarAST, action: ActionAST): void {
        action.setScope(scope);
        this.namedActions.add(ID.getParent() as GrammarAST);
        action.resolver = this.g;
    }

    @Override
    public defineToken(ID: GrammarAST): void {
        this.terminals.add(ID);
        this.tokenIDRefs.add(ID);
        this.tokensDefs.add(ID);
    }

    @Override
    public defineChannel(ID: GrammarAST): void {
        this.channelDefs.add(ID);
    }

    @Override
    public discoverRule(rule: RuleAST, ID: GrammarAST,
        modifiers: GrammarAST[], arg: ActionAST,
        returns: ActionAST, thrws: GrammarAST,
        options: GrammarAST, locals: ActionAST,
        actions: GrammarAST[],
        block: GrammarAST): void {
        this.currentRule = this.g.getRule(ID.getText());
    }

    @Override
    public discoverLexerRule(rule: RuleAST, ID: GrammarAST, modifiers: GrammarAST[], options: GrammarAST,
        block: GrammarAST): void {
        this.currentRule = this.g.getRule(ID.getText());
    }

    @Override
    public discoverOuterAlt(alt: AltAST): void {
        this.currentRule.alt[currentOuterAltNumber].ast = alt;
    }

    @Override
    public actionInAlt(action: ActionAST): void {
        this.currentRule.defineActionInAlt(currentOuterAltNumber, action);
        action.resolver = this.currentRule.alt[currentOuterAltNumber];
    }

    @Override
    public sempredInAlt(pred: PredAST): void {
        this.currentRule.definePredicateInAlt(currentOuterAltNumber, pred);
        pred.resolver = this.currentRule.alt[currentOuterAltNumber];
    }

    @Override
    public ruleCatch(arg: GrammarAST, action: ActionAST): void {
        const catchme = action.getParent() as GrammarAST;
        this.currentRule.exceptions.add(catchme);
        action.resolver = this.currentRule;
    }

    @Override
    public finallyAction(action: ActionAST): void {
        this.currentRule.finallyAction = action;
        action.resolver = this.currentRule;
    }

    @Override
    public label(op: GrammarAST, ID: GrammarAST, element: GrammarAST): void {
        const lp = new LabelElementPair(this.g, ID, element, op.getType());
        this.currentRule.alt[currentOuterAltNumber].labelDefs.map(ID.getText(), lp);
    }

    @Override
    public stringRef(ref: TerminalAST): void {
        this.terminals.add(ref);
        this.strings.add(ref.getText());
        if (this.currentRule !== null) {
            this.currentRule.alt[currentOuterAltNumber].tokenRefs.map(ref.getText(), ref);
        }
    }

    @Override
    public tokenRef(ref: TerminalAST): void {
        this.terminals.add(ref);
        this.tokenIDRefs.add(ref);
        if (this.currentRule !== null) {
            this.currentRule.alt[currentOuterAltNumber].tokenRefs.map(ref.getText(), ref);
        }
    }

    @Override
    public ruleRef(ref: GrammarAST, arg: ActionAST): void {
        //		if ( inContext("DOT ...") ) qualifiedRulerefs.add((GrammarAST)ref.getParent());
        this.rulerefs.add(ref);
        if (this.currentRule !== null) {
            this.currentRule.alt[currentOuterAltNumber].ruleRefs.map(ref.getText(), ref);
        }
    }

    @Override
    public grammarOption(ID: GrammarAST, valueAST: GrammarAST): void {
        this.setActionResolver(valueAST);
    }

    @Override
    public ruleOption(ID: GrammarAST, valueAST: GrammarAST): void {
        this.setActionResolver(valueAST);
    }

    @Override
    public blockOption(ID: GrammarAST, valueAST: GrammarAST): void {
        this.setActionResolver(valueAST);
    }

    @Override
    public elementOption(t: GrammarASTWithOptions, ID: GrammarAST, valueAST: GrammarAST): void {
        this.setActionResolver(valueAST);
    }

    /** In case of option id={...}, set resolve in case they use $foo */
    private setActionResolver(valueAST: GrammarAST): void {
        if (valueAST instanceof ActionAST) {
            (valueAST).resolver = this.currentRule.alt[currentOuterAltNumber];
        }
    }
}
