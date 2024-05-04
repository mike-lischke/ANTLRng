/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/* eslint-disable jsdoc/require-returns, jsdoc/require-param */

import { LeftRecursiveRuleAnalyzer } from "../analysis/LeftRecursiveRuleAnalyzer.js";
import { Utils } from "../misc/Utils.js";
import { ScopeParser } from "../parse/ScopeParser.js";
import { Rule } from "../tool/Rule.js";
import { LeftRecursiveRule } from "../tool/LeftRecursiveRule.js";
import { Grammar } from "../tool/Grammar.js";
import { AttributeDict } from "../tool/AttributeDict.js";
import { ActionAST } from "../tool/ast/ActionAST.js";
import { AltAST } from "../tool/ast/AltAST.js";
import { GrammarAST } from "../tool/ast/GrammarAST.js";
import { RuleAST } from "../tool/ast/RuleAST.js";
import { OrderedHashMap, HashMap } from "antlr4ng";

export  class RuleCollector extends GrammarTreeVisitor {

	/** which grammar are we checking */
    public  g:  Grammar;
    public  errMgr:  java.util.logging.ErrorManager;

	// stuff to collect. this is the output
    public  rules = new  OrderedHashMap<string, Rule>();
    public  ruleToAltLabels = new  MultiMap<string, GrammarAST>();
    public  altLabelToRuleName = new  HashMap<string, string>();
    private  grammarCaseInsensitive = false;

    public  constructor(g: Grammar) {
        this.g = g;
        this.errMgr = g.tool.errMgr;
    }

    @Override
    public  getErrorManager():  java.util.logging.ErrorManager { return this.errMgr; }

    public  process(ast: GrammarAST):  void { visitGrammar(ast); }

    @Override
    public  discoverRule(rule: RuleAST, ID: GrammarAST,
							 modifiers: GrammarAST[], arg: ActionAST,
							 returns: ActionAST, thrws: GrammarAST,
							 options: GrammarAST, locals: ActionAST,
							 actions: GrammarAST[],
							 block: GrammarAST):  void
    {
        const  numAlts = block.getChildCount();
        let  r: Rule;
        if ( LeftRecursiveRuleAnalyzer.hasImmediateRecursiveRuleRefs(rule, ID.getText()) ) {
            r = new  LeftRecursiveRule(this.g, ID.getText(), rule);
        }
        else {
            r = new  Rule(this.g, ID.getText(), rule, numAlts);
        }
        this.rules.put(r.name, r);

        if ( arg!==null ) {
            r.args = ScopeParser.parseTypedArgList(arg, arg.getText(), this.g);
            r.args.type = AttributeDict.DictType.ARG;
            r.args.ast = arg;
            arg.resolver = r.alt[currentOuterAltNumber];
        }

        if ( returns!==null ) {
            r.retvals = ScopeParser.parseTypedArgList(returns, returns.getText(), this.g);
            r.retvals.type = AttributeDict.DictType.RET;
            r.retvals.ast = returns;
        }

        if ( locals!==null ) {
            r.locals = ScopeParser.parseTypedArgList(locals, locals.getText(), this.g);
            r.locals.type = AttributeDict.DictType.LOCAL;
            r.locals.ast = locals;
        }

        for (const a of actions) {
			// a = ^(AT ID ACTION)
            const  action =  a.getChild(1) as ActionAST;
            r.namedActions.put(a.getChild(0).getText(), action);
            action.resolver = r;
        }
    }

    @Override
    public  discoverOuterAlt(alt: AltAST):  void {
        if ( alt.altLabel!==null ) {
            this.ruleToAltLabels.map(currentRuleName, alt.altLabel);
            const  altLabel = alt.altLabel.getText();
            this.altLabelToRuleName.put(Utils.capitalize(altLabel), currentRuleName);
            this.altLabelToRuleName.put(Utils.decapitalize(altLabel), currentRuleName);
        }
    }

    @Override
    public  grammarOption(ID: GrammarAST, valueAST: GrammarAST):  void {
        const  caseInsensitive = this.getCaseInsensitiveValue(ID, valueAST);
        if (caseInsensitive !== null) {
            this.grammarCaseInsensitive = caseInsensitive;
        }
    }

    @Override
    public  discoverLexerRule(rule: RuleAST, ID: GrammarAST, modifiers: GrammarAST[],
								  options: GrammarAST, block: GrammarAST):  void
    {
        let  currentCaseInsensitive = this.grammarCaseInsensitive;
        if (options !== null) {
            for (const child of options.getChildren()) {
                const  childAST =  child as GrammarAST;
                const  caseInsensitive = this.getCaseInsensitiveValue(childAST.getChild(0) as GrammarAST, childAST.getChild(1) as GrammarAST);
                if (caseInsensitive !== null) {
                    currentCaseInsensitive = caseInsensitive;
                }
            }
        }

        const  numAlts = block.getChildCount();
        const  r = new  Rule(this.g, ID.getText(), rule, numAlts, currentModeName, currentCaseInsensitive);
        if ( !modifiers.isEmpty() ) {
            r.modifiers = modifiers;
        }

        this.rules.put(r.name, r);
    }

    private  getCaseInsensitiveValue(optionID: GrammarAST, valueAST: GrammarAST):  Boolean {
        const  optionName = optionID.getText();
        if (optionName.equals(Grammar.caseInsensitiveOptionName)) {
            const  valueText = valueAST.getText();
            if (valueText.equals("true") || valueText.equals("false")) {
                return Boolean.parseBoolean(valueText);
            }
        }

        return null;
    }
}
