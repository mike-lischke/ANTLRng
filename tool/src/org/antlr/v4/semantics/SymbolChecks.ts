/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { SymbolCollector } from "./SymbolCollector.js";
import { LexerATNFactory } from "../automata/LexerATNFactory.js";
import { Token, HashMap, HashSet } from "antlr4ng";
import { Alternative } from "../tool/Alternative.js";
import { AttributeDict } from "../tool/AttributeDict.js";
import { ErrorType } from "../tool/ErrorType.js";
import { Grammar } from "../tool/Grammar.js";
import { LabelElementPair } from "../tool/LabelElementPair.js";
import { LabelType } from "../tool/LabelType.js";
import { LeftRecursiveRule } from "../tool/LeftRecursiveRule.js";
import { LexerGrammar } from "../tool/LexerGrammar.js";
import { Rule } from "../tool/Rule.js";
import { AltAST } from "../tool/ast/AltAST.js";
import { GrammarAST } from "../tool/ast/GrammarAST.js";
import { TerminalAST } from "../tool/ast/TerminalAST.js";

/**
 * Check for symbol problems; no side-effects.  Inefficient to walk rules
 *  and such multiple times, but I like isolating all error checking outside
 *  of code that actually defines symbols etc...
 *
 *  Side-effect: strip away redef'd rules.
 */
export class SymbolChecks {

    public errMgr: java.util.logging.ErrorManager;
    protected g: Grammar;
    protected collector: SymbolCollector;
    protected nameToRuleMap = new HashMap<string, Rule>();
    protected tokenIDs = new HashSet<string>();
    protected actionScopeToActionNames = new HashMap<string, Set<string>>();

    protected readonly reservedNames = new HashSet<string>();

    public constructor(g: Grammar, collector: SymbolCollector) {
        this.g = g;
        this.collector = collector;
        this.errMgr = g.tool.errMgr;

        for (const tokenId of collector.tokenIDRefs) {
            this.tokenIDs.add(tokenId.getText());
        }
    }

    public process(): void {
        // methods affect fields, but no side-effects outside this object
        // So, call order sensitive
        // First collect all rules for later use in checkForLabelConflict()
        if (this.g.rules !== null) {
            for (const r of this.g.rules.values()) {
                this.nameToRuleMap.put(r.name, r);
            }

        }
        this.checkReservedNames(this.g.rules.values());
        this.checkActionRedefinitions(this.collector.namedActions);
        this.checkForLabelConflicts(this.g.rules.values());
    }

    public checkActionRedefinitions(actions: GrammarAST[]): void {
        if (actions === null) {
            return;
        }

        let scope = this.g.getDefaultActionScope();
        let name: string;
        let nameNode: GrammarAST;
        for (const ampersandAST of actions) {
            nameNode = ampersandAST.getChild(0) as GrammarAST;
            if (ampersandAST.getChildCount() === 2) {
                name = nameNode.getText();
            }
            else {
                scope = nameNode.getText();
                name = ampersandAST.getChild(1).getText();
            }
            let scopeActions = this.actionScopeToActionNames.get(scope);
            if (scopeActions === null) { // init scope
                scopeActions = new HashSet<string>();
                this.actionScopeToActionNames.put(scope, scopeActions);
            }
            if (!scopeActions.contains(name)) {
                scopeActions.add(name);
            }
            else {
                this.errMgr.grammarError(ErrorType.ACTION_REDEFINITION,
                    this.g.fileName, nameNode.token, name);
            }
        }
    }

    /**
     * Make sure a label doesn't conflict with another symbol.
     * Labels must not conflict with: rules, tokens, scope names,
     * return values, parameters, and rule-scope dynamic attributes
     * defined in surrounding rule.  Also they must have same type
     * for repeated defs.
     */
    public checkForLabelConflicts(rules: Collection<Rule>): void {
        for (const r of rules) {
            this.checkForAttributeConflicts(r);

            const labelNameSpace = new HashMap();
            for (let i = 1; i <= r.numberOfAlts; i++) {
                const a = r.alt[i];
                for (const pairs of a.labelDefs.values()) {
                    if (r.hasAltSpecificContexts()) {
                        // Collect labelName-labeledRules map for rule with alternative labels.
                        const labelPairs = new HashMap();
                        for (const p of pairs) {
                            const labelName = this.findAltLabelName(p.label);
                            if (labelName !== null) {
                                let list: LabelElementPair[];
                                if (labelPairs.containsKey(labelName)) {
                                    list = labelPairs.get(labelName);
                                }
                                else {
                                    list = [];
                                    labelPairs.put(labelName, list);
                                }
                                list.add(p);
                            }
                        }

                        for (const internalPairs of labelPairs.values()) {
                            labelNameSpace.clear();
                            this.checkLabelPairs(r, labelNameSpace, internalPairs);
                        }
                    }
                    else {
                        this.checkLabelPairs(r, labelNameSpace, pairs);
                    }
                }
            }
        }
    }

    public checkForLabelConflict(r: Rule, labelID: GrammarAST): void {
        const name = labelID.getText();
        if (this.nameToRuleMap.containsKey(name)) {
            const etype = ErrorType.LABEL_CONFLICTS_WITH_RULE;
            this.errMgr.grammarError(etype, this.g.fileName, labelID.token, name, r.name);
        }

        if (this.tokenIDs.contains(name)) {
            const etype = ErrorType.LABEL_CONFLICTS_WITH_TOKEN;
            this.errMgr.grammarError(etype, this.g.fileName, labelID.token, name, r.name);
        }

        if (r.args !== null && r.args.get(name) !== null) {
            const etype = ErrorType.LABEL_CONFLICTS_WITH_ARG;
            this.errMgr.grammarError(etype, this.g.fileName, labelID.token, name, r.name);
        }

        if (r.retvals !== null && r.retvals.get(name) !== null) {
            const etype = ErrorType.LABEL_CONFLICTS_WITH_RETVAL;
            this.errMgr.grammarError(etype, this.g.fileName, labelID.token, name, r.name);
        }

        if (r.locals !== null && r.locals.get(name) !== null) {
            const etype = ErrorType.LABEL_CONFLICTS_WITH_LOCAL;
            this.errMgr.grammarError(etype, this.g.fileName, labelID.token, name, r.name);
        }
    }

    public checkForAttributeConflicts(r: Rule): void {
        this.checkDeclarationRuleConflicts(r, r.args, this.nameToRuleMap.keySet(), ErrorType.ARG_CONFLICTS_WITH_RULE);
        this.checkDeclarationRuleConflicts(r, r.args, this.tokenIDs, ErrorType.ARG_CONFLICTS_WITH_TOKEN);

        this.checkDeclarationRuleConflicts(r, r.retvals, this.nameToRuleMap.keySet(), ErrorType.RETVAL_CONFLICTS_WITH_RULE);
        this.checkDeclarationRuleConflicts(r, r.retvals, this.tokenIDs, ErrorType.RETVAL_CONFLICTS_WITH_TOKEN);

        this.checkDeclarationRuleConflicts(r, r.locals, this.nameToRuleMap.keySet(), ErrorType.LOCAL_CONFLICTS_WITH_RULE);
        this.checkDeclarationRuleConflicts(r, r.locals, this.tokenIDs, ErrorType.LOCAL_CONFLICTS_WITH_TOKEN);

        this.checkLocalConflictingDeclarations(r, r.retvals, r.args, ErrorType.RETVAL_CONFLICTS_WITH_ARG);
        this.checkLocalConflictingDeclarations(r, r.locals, r.args, ErrorType.LOCAL_CONFLICTS_WITH_ARG);
        this.checkLocalConflictingDeclarations(r, r.locals, r.retvals, ErrorType.LOCAL_CONFLICTS_WITH_RETVAL);
    }

    public checkForModeConflicts(g: Grammar): void {
        if (g.isLexer()) {
            const lexerGrammar = g as LexerGrammar;
            for (const modeName of lexerGrammar.modes.keySet()) {
                if (!modeName.equals("DEFAULT_MODE") && this.reservedNames.contains(modeName)) {
                    const rule = lexerGrammar.modes.get(modeName).iterator().next();
                    g.tool.errMgr.grammarError(ErrorType.MODE_CONFLICTS_WITH_COMMON_CONSTANTS, g.fileName, rule.ast.parent.getToken(), modeName);
                }

                if (g.getTokenType(modeName) !== Token.INVALID_TYPE) {
                    const rule = lexerGrammar.modes.get(modeName).iterator().next();
                    g.tool.errMgr.grammarError(ErrorType.MODE_CONFLICTS_WITH_TOKEN, g.fileName, rule.ast.parent.getToken(), modeName);
                }
            }
        }
    }

    /**
     * Algorithm steps:
     * 1. Collect all simple string literals (i.e. 'asdf', 'as' 'df', but not [a-z]+, 'a'..'z')
     *    for all lexer rules in each mode except of autogenerated tokens ({@link #getSingleTokenValues(Rule) getSingleTokenValues})
     * 2. Compare every string literal with each other ({@link #checkForOverlap(Grammar, Rule, Rule, List<String>, List<String>) checkForOverlap})
     *    and throw TOKEN_UNREACHABLE warning if the same string found.
     * Complexity: O(m * n^2 / 2), approximately equals to O(n^2)
     * where m - number of modes, n - average number of lexer rules per mode.
     * See also testUnreachableTokens unit test for details.
     */
    public checkForUnreachableTokens(g: Grammar): void {
        if (g.isLexer()) {
            const lexerGrammar = g as LexerGrammar;
            for (const rules of lexerGrammar.modes.values()) {
                // Collect string literal lexer rules for each mode
                const stringLiteralRules = [];
                const stringLiteralValues = [];
                for (let i = 0; i < rules.size(); i++) {
                    const rule = rules.get(i);

                    const ruleStringAlts = this.getSingleTokenValues(rule);
                    if (ruleStringAlts !== null && ruleStringAlts.size() > 0) {
                        stringLiteralRules.add(rule);
                        stringLiteralValues.add(ruleStringAlts);
                    }
                }

                // Check string sets intersection
                for (let i = 0; i < stringLiteralRules.size(); i++) {
                    const firstTokenStringValues = stringLiteralValues.get(i);
                    const rule1 = stringLiteralRules.get(i);
                    this.checkForOverlap(g, rule1, rule1, firstTokenStringValues, stringLiteralValues.get(i));

                    // Check fragment rules only with themself
                    if (!rule1.isFragment()) {
                        for (let j = i + 1; j < stringLiteralRules.size(); j++) {
                            const rule2 = stringLiteralRules.get(j);
                            if (!rule2.isFragment()) {
                                this.checkForOverlap(g, rule1, stringLiteralRules.get(j), firstTokenStringValues, stringLiteralValues.get(j));
                            }
                        }
                    }
                }
            }
        }
    }

    // CAN ONLY CALL THE TWO NEXT METHODS AFTER GRAMMAR HAS RULE DEFS (see semanticpipeline)
    public checkRuleArgs(g: Grammar, rulerefs: GrammarAST[]): void {
        if (rulerefs === null) {
            return;
        }

        for (const ref of rulerefs) {
            const ruleName = ref.getText();
            const r = g.getRule(ruleName);
            const arg = ref.getFirstChildWithType(ANTLRParser.ARG_ACTION) as GrammarAST;
            if (arg !== null && (r === null || r.args === null)) {
                this.errMgr.grammarError(ErrorType.RULE_HAS_NO_ARGS,
                    g.fileName, ref.token, ruleName);

            }
            else {
                if (arg === null && (r !== null && r.args !== null)) {
                    this.errMgr.grammarError(ErrorType.MISSING_RULE_ARGS,
                        g.fileName, ref.token, ruleName);
                }
            }

        }
    }

    public checkForQualifiedRuleIssues(g: Grammar, qualifiedRuleRefs: GrammarAST[]): void {
        for (const dot of qualifiedRuleRefs) {
            const grammar = dot.getChild(0) as GrammarAST;
            const rule = dot.getChild(1) as GrammarAST;
            g.tool.logInfo("semantics", grammar.getText() + "." + rule.getText());
            const delegate = g.getImportedGrammar(grammar.getText());
            if (delegate === null) {
                this.errMgr.grammarError(ErrorType.NO_SUCH_GRAMMAR_SCOPE,
                    g.fileName, grammar.token, grammar.getText(),
                    rule.getText());
            }
            else {
                if (g.getRule(grammar.getText(), rule.getText()) === null) {
                    this.errMgr.grammarError(ErrorType.NO_SUCH_RULE_IN_SCOPE,
                        g.fileName, rule.token, grammar.getText(),
                        rule.getText());
                }
            }
        }
    }

    protected checkDeclarationRuleConflicts(r: Rule, attributes: AttributeDict, ruleNames: Set<string>, errorType: ErrorType): void {
        if (attributes === null) {
            return;
        }

        for (const attribute of attributes.attributes.values()) {
            if (ruleNames.contains(attribute.name)) {
                this.errMgr.grammarError(
                    errorType,
                    this.g.fileName,
                    attribute.token !== null ? attribute.token : (r.ast.getChild(0) as GrammarAST).token,
                    attribute.name,
                    r.name);
            }
        }
    }

    protected checkLocalConflictingDeclarations(r: Rule, attributes: AttributeDict, referenceAttributes: AttributeDict, errorType: ErrorType): void {
        if (attributes === null || referenceAttributes === null) {
            return;
        }

        const conflictingKeys = attributes.intersection(referenceAttributes);
        for (const key of conflictingKeys) {
            this.errMgr.grammarError(
                errorType,
                this.g.fileName,
                attributes.get(key).token !== null ? attributes.get(key).token : (r.ast.getChild(0) as GrammarAST).token,
                key,
                r.name);
        }
    }

    protected checkReservedNames(rules: Collection<Rule>): void {
        for (const rule of rules) {
            if (this.reservedNames.contains(rule.name)) {
                this.errMgr.grammarError(ErrorType.RESERVED_RULE_NAME, this.g.fileName, (rule.ast.getChild(0) as GrammarAST).getToken(), rule.name);
            }
        }
    }

    private checkLabelPairs(r: Rule, labelNameSpace: Map<string, LabelElementPair>, pairs: LabelElementPair[]): void {
        for (const p of pairs) {
            this.checkForLabelConflict(r, p.label);
            const name = p.label.getText();
            const prev = labelNameSpace.get(name);
            if (prev === null) {
                labelNameSpace.put(name, p);
            }
            else {
                this.checkForTypeMismatch(r, prev, p);
            }
        }
    }

    private findAltLabelName(label: CommonTree): string {
        if (label === null) {
            return null;
        }
        else {
            if (label instanceof AltAST) {
                const altAST = label;
                if (altAST.altLabel !== null) {
                    return altAST.altLabel.toString();
                }
                else {
                    if (altAST.leftRecursiveAltInfo !== null) {
                        return altAST.leftRecursiveAltInfo.altLabel.toString();
                    }
                    else {
                        return this.findAltLabelName(label.parent);
                    }
                }

            }
            else {
                return this.findAltLabelName(label.parent);
            }
        }

    }

    private checkForTypeMismatch(r: Rule, prevLabelPair: LabelElementPair, labelPair: LabelElementPair): void {
        // label already defined; if same type, no problem
        if (prevLabelPair.type !== labelPair.type) {
            // Current behavior: take a token of rule declaration in case of left-recursive rule
            // Desired behavior: take a token of proper label declaration in case of left-recursive rule
            // See https://github.com/antlr/antlr4/pull/1585
            // Such behavior is referring to the fact that the warning is typically reported on the actual label redefinition,
            //   but for left-recursive rules the warning is reported on the enclosing rule.
            const token = r instanceof LeftRecursiveRule
                ? (r.ast.getChild(0) as GrammarAST).getToken()
                : labelPair.label.token;
            this.errMgr.grammarError(
                ErrorType.LABEL_TYPE_CONFLICT,
                this.g.fileName,
                token,
                labelPair.label.getText(),
                labelPair.type + "!=" + prevLabelPair.type);
        }
        if (!prevLabelPair.element.getText().equals(labelPair.element.getText()) &&
            (prevLabelPair.type.equals(LabelType.RULE_LABEL) || prevLabelPair.type.equals(LabelType.RULE_LIST_LABEL)) &&
            (labelPair.type.equals(LabelType.RULE_LABEL) || labelPair.type.equals(LabelType.RULE_LIST_LABEL))) {

            const token = r instanceof LeftRecursiveRule
                ? (r.ast.getChild(0) as GrammarAST).getToken()
                : labelPair.label.token;
            const prevLabelOp = prevLabelPair.type.equals(LabelType.RULE_LIST_LABEL) ? "+=" : "=";
            const labelOp = labelPair.type.equals(LabelType.RULE_LIST_LABEL) ? "+=" : "=";
            this.errMgr.grammarError(
                ErrorType.LABEL_TYPE_CONFLICT,
                this.g.fileName,
                token,
                labelPair.label.getText() + labelOp + labelPair.element.getText(),
                prevLabelPair.label.getText() + prevLabelOp + prevLabelPair.element.getText());
        }
    }

    /**
     * {@return} list of simple string literals for rule {@param rule}
     */
    private getSingleTokenValues(rule: Rule): string[] {
        const values = [];
        for (const alt of rule.alt) {
            if (alt !== null) {
                // select first alt if token has a command
                const rootNode = alt.ast.getChildCount() === 2 &&
                    alt.ast.getChild(0) instanceof AltAST && alt.ast.getChild(1) instanceof GrammarAST
                    ? alt.ast.getChild(0)
                    : alt.ast;

                if (rootNode.getTokenStartIndex() === -1) {
                    continue; // ignore autogenerated tokens from combined grammars that start with T__
                }

                // Ignore alt if contains not only string literals (repetition, optional)
                let ignore = false;
                const currentValue = new StringBuilder();
                for (let i = 0; i < rootNode.getChildCount(); i++) {
                    const child = rootNode.getChild(i);
                    if (!(child instanceof TerminalAST)) {
                        ignore = true;
                        break;
                    }

                    const terminalAST = child;
                    if (terminalAST.token.getType() !== ANTLRLexer.STRING_LITERAL) {
                        ignore = true;
                        break;
                    }
                    else {
                        const text = terminalAST.token.getText();
                        currentValue.append(text.substring(1, text.length() - 1));
                    }
                }

                if (!ignore) {
                    values.add(currentValue.toString());
                }
            }
        }

        return values;
    }

    /**
     * For same rule compare values from next index:
     * TOKEN_WITH_SAME_VALUES: 'asdf' | 'asdf';
     * For different rules compare from start value:
     * TOKEN1: 'asdf';
     * TOKEN2: 'asdf';
     */
    private checkForOverlap(g: Grammar, rule1: Rule, rule2: Rule, firstTokenStringValues: string[], secondTokenStringValues: string[]): void {
        for (let i = 0; i < firstTokenStringValues.size(); i++) {
            const secondTokenInd = rule1 === rule2 ? i + 1 : 0;
            const str1 = firstTokenStringValues.get(i);
            for (let j = secondTokenInd; j < secondTokenStringValues.size(); j++) {
                const str2 = secondTokenStringValues.get(j);
                if (str1.equals(str2)) {
                    this.errMgr.grammarError(ErrorType.TOKEN_UNREACHABLE, g.fileName,
                        (rule2.ast.getChild(0) as GrammarAST).token, rule2.name, str2, rule1.name);
                }
            }
        }
    }
    public constructor() {
        super();

        this.reservedNames.addAll(LexerATNFactory.getCommonConstants());

    }
}
