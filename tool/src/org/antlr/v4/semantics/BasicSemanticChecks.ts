/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { RuleCollector } from "./RuleCollector.js";
import { Utils } from "../misc/Utils.js";
import { ErrorType } from "../tool/ErrorType.js";
import { Grammar } from "../tool/Grammar.js";
import { Rule } from "../tool/Rule.js";
import { ActionAST } from "../tool/ast/ActionAST.js";
import { AltAST } from "../tool/ast/AltAST.js";
import { BlockAST } from "../tool/ast/BlockAST.js";
import { GrammarAST } from "../tool/ast/GrammarAST.js";
import { GrammarASTWithOptions } from "../tool/ast/GrammarASTWithOptions.js";
import { GrammarRootAST } from "../tool/ast/GrammarRootAST.js";
import { RuleAST } from "../tool/ast/RuleAST.js";
import { RuleRefAST } from "../tool/ast/RuleRefAST.js";
import { TerminalAST } from "../tool/ast/TerminalAST.js";
import { GrammarTreeVisitor } from "../../../../../../src/tree-walkers/GrammarTreeVisitor.js";

/**
 * No side-effects except for setting options into the appropriate node.
 *  TODO:  make the side effects into a separate pass this
 *
 * Invokes check rules for these:
 *
 * FILE_AND_GRAMMAR_NAME_DIFFER
 * LEXER_RULES_NOT_ALLOWED
 * PARSER_RULES_NOT_ALLOWED
 * CANNOT_ALIAS_TOKENS
 * ARGS_ON_TOKEN_REF
 * ILLEGAL_OPTION
 * REWRITE_OR_OP_WITH_NO_OUTPUT_OPTION
 * NO_RULES
 * REWRITE_FOR_MULTI_ELEMENT_ALT
 * HETERO_ILLEGAL_IN_REWRITE_ALT
 * AST_OP_WITH_NON_AST_OUTPUT_OPTION
 * AST_OP_IN_ALT_WITH_REWRITE
 * CONFLICTING_OPTION_IN_TREE_FILTER
 * WILDCARD_AS_ROOT
 * INVALID_IMPORT
 * TOKEN_VOCAB_IN_DELEGATE
 * IMPORT_NAME_CLASH
 * REPEATED_PREQUEL
 * TOKEN_NAMES_MUST_START_UPPER
 */
export class BasicSemanticChecks extends GrammarTreeVisitor {
    /**
     * Set of valid imports.  Maps delegate to set of delegator grammar types.
     *  validDelegations.get(LEXER) gives list of the kinds of delegators
     *  that can import lexers.
     */
    public static readonly validImportTypes =
        new class extends MultiMap<number, number> {
            public constructor() {
                super();

                this.map(ANTLRParser.LEXER, ANTLRParser.LEXER);
                this.map(ANTLRParser.LEXER, ANTLRParser.COMBINED);

                this.map(ANTLRParser.PARSER, ANTLRParser.PARSER);
                this.map(ANTLRParser.PARSER, ANTLRParser.COMBINED);

                this.map(ANTLRParser.COMBINED, ANTLRParser.COMBINED);

            }
        }();

    public g: Grammar;
    public ruleCollector: RuleCollector;
    public errMgr: java.util.logging.ErrorManager;

    /**
     * When this is {@code true}, the semantic checks will report
     * {@link ErrorType#UNRECOGNIZED_ASSOC_OPTION} where appropriate. This may
     * be set to {@code false} to disable this specific check.
     *
     * <p>The default value is {@code true}.</p>
     */
    public checkAssocElementOption = true;

    /**
     * This field is used for reporting the {@link ErrorType#MODE_WITHOUT_RULES}
     * error when necessary.
     */
    protected nonFragmentRuleCount: number;

    /**
     * This is {@code true} from the time {@link #discoverLexerRule} is called
     * for a lexer rule with the {@code fragment} modifier until
     * {@link #exitLexerRule} is called.
     */
    private inFragmentRule: boolean;

    /**
     * Value of caseInsensitive option (false if not defined)
     */
    private grammarCaseInsensitive = false;

    public constructor(g: Grammar, ruleCollector: RuleCollector) {
        this.g = g;
        this.ruleCollector = ruleCollector;
        this.errMgr = g.tool.errMgr;
    }

    public override getErrorManager(): java.util.logging.ErrorManager { return this.errMgr; }

    public process(): void { visitGrammar(this.g.ast); }

    // Routines to route visitor traffic to the checking routines

    public override discoverGrammar(root: GrammarRootAST, ID: GrammarAST): void {
        this.checkGrammarName(ID.token);
    }

    public override finishPrequels(firstPrequel: GrammarAST): void {
        if (firstPrequel === null) {
            return;
        }

        const parent = firstPrequel.parent as GrammarAST;
        const options = parent.getAllChildrenWithType(OPTIONS);
        const imports = parent.getAllChildrenWithType(IMPORT);
        const tokens = parent.getAllChildrenWithType(TOKENS_SPEC);
        this.checkNumPrequels(options, imports, tokens);
    }

    public override importGrammar(label: GrammarAST, ID: GrammarAST): void {
        this.checkImport(ID.token);
    }

    public override discoverRules(rules: GrammarAST): void {
        this.checkNumRules(rules);
    }

    public override modeDef(m: GrammarAST, ID: GrammarAST): void {
        if (!this.g.isLexer()) {
            this.g.tool.errMgr.grammarError(ErrorType.MODE_NOT_IN_LEXER, this.g.fileName,
                ID.token, ID.token.getText(), this.g);
        }
    }

    public override discoverRule(rule: RuleAST, ID: GrammarAST,
        modifiers: GrammarAST[],
        arg: ActionAST, returns: ActionAST,
        thrws: GrammarAST, options: GrammarAST,
        locals: ActionAST,
        actions: GrammarAST[], block: GrammarAST): void {
        // TODO: chk that all or no alts have "# label"
        this.checkInvalidRuleDef(ID.token);
    }

    public override discoverLexerRule(rule: RuleAST, ID: GrammarAST, modifiers: GrammarAST[], options: GrammarAST,
        block: GrammarAST): void {
        this.checkInvalidRuleDef(ID.token);

        if (modifiers !== null) {
            for (const tree of modifiers) {
                if (tree.getType() === ANTLRParser.FRAGMENT) {
                    this.inFragmentRule = true;
                }
            }
        }

        if (!this.inFragmentRule) {
            this.nonFragmentRuleCount++;
        }
    }

    public override ruleRef(ref: GrammarAST, arg: ActionAST): void {
        this.checkInvalidRuleRef(ref.token);
    }

    public override grammarOption(ID: GrammarAST, valueAST: GrammarAST): void {
        this.checkOptions(this.g.ast, ID.token, valueAST);
    }

    public override ruleOption(ID: GrammarAST, valueAST: GrammarAST): void {
        this.checkOptions(ID.getAncestor(RULE) as GrammarAST, ID.token, valueAST);
    }

    public override blockOption(ID: GrammarAST, valueAST: GrammarAST): void {
        this.checkOptions(ID.getAncestor(BLOCK) as GrammarAST, ID.token, valueAST);
    }

    public override defineToken(ID: GrammarAST): void {
        this.checkTokenDefinition(ID.token);
    }

    public override defineChannel(ID: GrammarAST): void {
        this.checkChannelDefinition(ID.token);
    }

    public override elementOption(elem: GrammarASTWithOptions, ID: GrammarAST, valueAST: GrammarAST): void {
        this.checkElementOptions(elem, ID, valueAST);
    }

    public override finishRule(rule: RuleAST, ID: GrammarAST, block: GrammarAST): void {
        if (rule.isLexerRule()) {
            return;
        }

        const blk = rule.getFirstChildWithType(BLOCK) as BlockAST;
        const nalts = blk.getChildCount();
        const idAST = rule.getChild(0) as GrammarAST;
        for (let i = 0; i < nalts; i++) {
            const altAST = blk.getChild(i) as AltAST;
            if (altAST.altLabel !== null) {
                const altLabel = altAST.altLabel.getText();
                // first check that label doesn't conflict with a rule
                // label X or x can't be rule x.
                const r = this.ruleCollector.rules.get(Utils.decapitalize(altLabel));
                if (r !== null) {
                    this.g.tool.errMgr.grammarError(ErrorType.ALT_LABEL_CONFLICTS_WITH_RULE,
                        this.g.fileName, altAST.altLabel.token,
                        altLabel,
                        r.name);
                }
                // Now verify that label X or x doesn't conflict with label
                // in another rule. altLabelToRuleName has both X and x mapped.
                const prevRuleForLabel = this.ruleCollector.altLabelToRuleName.get(altLabel);
                if (prevRuleForLabel !== null && !prevRuleForLabel.equals(rule.getRuleName())) {
                    this.g.tool.errMgr.grammarError(ErrorType.ALT_LABEL_REDEF,
                        this.g.fileName, altAST.altLabel.token,
                        altLabel,
                        rule.getRuleName(),
                        prevRuleForLabel);
                }
            }
        }
        const altLabels = this.ruleCollector.ruleToAltLabels.get(rule.getRuleName());
        let numAltLabels = 0;
        if (altLabels !== null) {
            numAltLabels = altLabels.size();
        }

        if (numAltLabels > 0 && nalts !== numAltLabels) {
            this.g.tool.errMgr.grammarError(ErrorType.RULE_WITH_TOO_FEW_ALT_LABELS,
                this.g.fileName, idAST.token, rule.getRuleName());
        }
    }

    public override actionInAlt(action: ActionAST): void {
        if (this.inFragmentRule) {
            const fileName = action.token.getInputStream().getSourceName();
            const ruleName = currentRuleName;
            this.g.tool.errMgr.grammarError(ErrorType.FRAGMENT_ACTION_IGNORED, fileName, action.token, ruleName);
        }
    }

    public override label(op: GrammarAST, ID: GrammarAST, element: GrammarAST): void {
        switch (element.getType()) {
            // token atoms
            case TOKEN_REF:
            case STRING_LITERAL:
            case RANGE:
            // token sets
            case SET:
            case NOT:
            // rule atoms
            case RULE_REF:
            case WILDCARD: {
                return;
            }

            default: {
                const fileName = ID.token.getInputStream().getSourceName();
                this.g.tool.errMgr.grammarError(ErrorType.LABEL_BLOCK_NOT_A_SET, fileName, ID.token, ID.getText());
                break;
            }

        }
    }

    protected override enterMode(tree: GrammarAST): void {
        this.nonFragmentRuleCount = 0;
    }

    protected override exitMode(tree: GrammarAST): void {
        if (this.nonFragmentRuleCount === 0) {
            let token = tree.getToken();
            let name = "?";
            if (tree.getChildCount() > 0) {
                name = tree.getChild(0).getText();
                if (name === null || name.isEmpty()) {
                    name = "?";
                }

                token = (tree.getChild(0) as GrammarAST).getToken();
            }

            this.g.tool.errMgr.grammarError(ErrorType.MODE_WITHOUT_RULES, this.g.fileName, token, name, this.g);
        }
    }

    protected override exitLexerRule(tree: GrammarAST): void {
        this.inFragmentRule = false;
    }

    protected override enterChannelsSpec(tree: GrammarAST): void {
        const errorType = this.g.isParser()
            ? ErrorType.CHANNELS_BLOCK_IN_PARSER_GRAMMAR
            : this.g.isCombined()
                ? ErrorType.CHANNELS_BLOCK_IN_COMBINED_GRAMMAR
                : null;
        if (errorType !== null) {
            this.g.tool.errMgr.grammarError(errorType, this.g.fileName, tree.token);
        }
    }

    // Routines to do the actual work of checking issues with a grammar.
    // They are triggered by the visitor methods above.

    protected checkGrammarName(nameToken: Token): void {
        const fullyQualifiedName = nameToken.getInputStream().getSourceName();
        if (fullyQualifiedName === null) {
            // This wasn't read from a file.
            return;
        }

        const f = new File(fullyQualifiedName);
        const fileName = f.getName();
        if (this.g.originalGrammar !== null) {
            return;
        }
        // don't warn about diff if this is implicit lexer
        if (!Utils.stripFileExtension(fileName).equals(nameToken.getText()) &&
            !fileName.equals(Grammar.GRAMMAR_FROM_STRING_NAME)) {
            this.g.tool.errMgr.grammarError(ErrorType.FILE_AND_GRAMMAR_NAME_DIFFER,
                fileName, nameToken, nameToken.getText(), fileName);
        }
    }

    protected checkNumRules(rulesNode: GrammarAST): void {
        if (rulesNode.getChildCount() === 0) {
            const root = rulesNode.getParent() as GrammarAST;
            const IDNode = root.getChild(0) as GrammarAST;
            this.g.tool.errMgr.grammarError(ErrorType.NO_RULES, this.g.fileName,
                null, IDNode.getText(), this.g);
        }
    }

    protected checkNumPrequels(options: GrammarAST[],
        imports: GrammarAST[],
        tokens: GrammarAST[]): void {
        const secondOptionTokens = new Array<Token>();
        if (options !== null && options.size() > 1) {
            secondOptionTokens.add(options.get(1).token);
        }
        if (imports !== null && imports.size() > 1) {
            secondOptionTokens.add(imports.get(1).token);
        }
        if (tokens !== null && tokens.size() > 1) {
            secondOptionTokens.add(tokens.get(1).token);
        }
        for (const t of secondOptionTokens) {
            const fileName = t.getInputStream().getSourceName();
            this.g.tool.errMgr.grammarError(ErrorType.REPEATED_PREQUEL,
                fileName, t);
        }
    }

    protected checkInvalidRuleDef(ruleID: Token): void {
        let fileName = null;
        if (ruleID.getInputStream() !== null) {
            fileName = ruleID.getInputStream().getSourceName();
        }
        if (this.g.isLexer() && Character.isLowerCase(ruleID.getText().charAt(0))) {
            this.g.tool.errMgr.grammarError(ErrorType.PARSER_RULES_NOT_ALLOWED,
                fileName, ruleID, ruleID.getText());
        }
        if (this.g.isParser() &&
            Grammar.isTokenName(ruleID.getText())) {
            this.g.tool.errMgr.grammarError(ErrorType.LEXER_RULES_NOT_ALLOWED,
                fileName, ruleID, ruleID.getText());
        }
    }

    protected checkInvalidRuleRef(ruleID: Token): void {
        const fileName = ruleID.getInputStream().getSourceName();
        if (this.g.isLexer() && Character.isLowerCase(ruleID.getText().charAt(0))) {
            this.g.tool.errMgr.grammarError(ErrorType.PARSER_RULE_REF_IN_LEXER_RULE,
                fileName, ruleID, ruleID.getText(), currentRuleName);
        }
    }

    protected checkTokenDefinition(tokenID: Token): void {
        const fileName = tokenID.getInputStream().getSourceName();
        if (!Grammar.isTokenName(tokenID.getText())) {
            this.g.tool.errMgr.grammarError(ErrorType.TOKEN_NAMES_MUST_START_UPPER,
                fileName,
                tokenID,
                tokenID.getText());
        }
    }

    protected checkChannelDefinition(tokenID: Token): void {
    }

    protected override enterLexerElement(tree: GrammarAST): void {
    }

    protected override enterLexerCommand(tree: GrammarAST): void {
        this.checkElementIsOuterMostInSingleAlt(tree);

        if (this.inFragmentRule) {
            const fileName = tree.token.getInputStream().getSourceName();
            const ruleName = currentRuleName;
            this.g.tool.errMgr.grammarError(ErrorType.FRAGMENT_ACTION_IGNORED, fileName, tree.token, ruleName);
        }
    }

    /**
     Make sure that action is last element in outer alt; here action,
     a2, z, and zz are bad, but a3 is ok:
     (RULE A (BLOCK (ALT {action} 'a')))
     (RULE B (BLOCK (ALT (BLOCK (ALT {a2} 'x') (ALT 'y')) {a3})))
     (RULE C (BLOCK (ALT 'd' {z}) (ALT 'e' {zz})))
     */
    protected checkElementIsOuterMostInSingleAlt(tree: GrammarAST): void {
        const alt = tree.parent;
        const blk = alt.parent;
        const outerMostAlt = blk.parent.getType() === RULE;
        const rule = tree.getAncestor(RULE);
        const fileName = tree.getToken().getInputStream().getSourceName();
        if (!outerMostAlt || blk.getChildCount() > 1) {
            const e = ErrorType.LEXER_COMMAND_PLACEMENT_ISSUE;
            this.g.tool.errMgr.grammarError(e,
                fileName,
                tree.getToken(),
                rule.getChild(0).getText());

        }
    }

    protected override enterTerminal(tree: GrammarAST): void {
        const text = tree.getText();
        if (text.equals("''")) {
            this.g.tool.errMgr.grammarError(ErrorType.EMPTY_STRINGS_AND_SETS_NOT_ALLOWED, this.g.fileName, tree.token, "''");
        }
    }

    /** Check option is appropriate for grammar, rule, subrule */
    protected checkOptions(parent: GrammarAST, optionID: Token, valueAST: GrammarAST): void {
        let optionsToCheck = null;
        const parentType = parent.getType();
        switch (parentType) {
            case ANTLRParser.BLOCK: {
                optionsToCheck = this.g.isLexer() ? Grammar.lexerBlockOptions : Grammar.parserBlockOptions;
                break;
            }

            case ANTLRParser.RULE: {
                optionsToCheck = this.g.isLexer() ? Grammar.lexerRuleOptions : Grammar.parseRuleOptions;
                break;
            }

            case ANTLRParser.GRAMMAR: {
                optionsToCheck = this.g.getType() === ANTLRParser.LEXER
                    ? Grammar.lexerOptions
                    : Grammar.parserOptions;
                break;
            }

            default:

        }
        const optionName = optionID.getText();
        if (optionsToCheck !== null && !optionsToCheck.contains(optionName)) {
            this.g.tool.errMgr.grammarError(ErrorType.ILLEGAL_OPTION, this.g.fileName, optionID, optionName);
        }
        else {
            this.checkCaseInsensitiveOption(optionID, valueAST, parentType);
        }
    }

    /** Check option is appropriate for elem; parent of ID is ELEMENT_OPTIONS */
    protected checkElementOptions(elem: GrammarASTWithOptions,
        ID: GrammarAST,
        valueAST: GrammarAST): boolean {
        if (this.checkAssocElementOption && ID !== null && "assoc".equals(ID.getText())) {
            if (elem.getType() !== ANTLRParser.ALT) {
                const optionID = ID.token;
                const fileName = optionID.getInputStream().getSourceName();
                this.g.tool.errMgr.grammarError(ErrorType.UNRECOGNIZED_ASSOC_OPTION,
                    fileName,
                    optionID,
                    currentRuleName);
            }
        }

        if (elem instanceof RuleRefAST) {
            return this.checkRuleRefOptions(elem, ID, valueAST);
        }
        if (elem instanceof TerminalAST) {
            return this.checkTokenOptions(elem, ID, valueAST);
        }
        if (elem.getType() === ANTLRParser.ACTION) {
            return false;
        }
        if (elem.getType() === ANTLRParser.SEMPRED) {
            const optionID = ID.token;
            const fileName = optionID.getInputStream().getSourceName();
            if (valueAST !== null && !Grammar.semPredOptions.contains(optionID.getText())) {
                this.g.tool.errMgr.grammarError(ErrorType.ILLEGAL_OPTION,
                    fileName,
                    optionID,
                    optionID.getText());

                return false;
            }
        }

        return false;
    }

    protected checkRuleRefOptions(elem: RuleRefAST, ID: GrammarAST, valueAST: GrammarAST): boolean {
        const optionID = ID.token;
        const fileName = optionID.getInputStream().getSourceName();
        // don't care about id<SimpleValue> options
        if (valueAST !== null && !Grammar.ruleRefOptions.contains(optionID.getText())) {
            this.g.tool.errMgr.grammarError(ErrorType.ILLEGAL_OPTION,
                fileName,
                optionID,
                optionID.getText());

            return false;
        }

        // TODO: extra checks depending on rule kind?
        return true;
    }

    protected checkTokenOptions(elem: TerminalAST, ID: GrammarAST, valueAST: GrammarAST): boolean {
        const optionID = ID.token;
        const fileName = optionID.getInputStream().getSourceName();
        // don't care about ID<ASTNodeName> options
        if (valueAST !== null && !Grammar.tokenOptions.contains(optionID.getText())) {
            this.g.tool.errMgr.grammarError(ErrorType.ILLEGAL_OPTION,
                fileName,
                optionID,
                optionID.getText());

            return false;
        }

        // TODO: extra checks depending on terminal kind?
        return true;
    }

    protected checkImport(importID: Token): void {
        const delegate = this.g.getImportedGrammar(importID.getText());
        if (delegate === null) {
            return;
        }

        const validDelegators = BasicSemanticChecks.validImportTypes.get(delegate.getType());
        if (validDelegators !== null && !validDelegators.contains(this.g.getType())) {
            this.g.tool.errMgr.grammarError(ErrorType.INVALID_IMPORT,
                this.g.fileName,
                importID,
                this.g, delegate);
        }
        if (this.g.isCombined() &&
            (delegate.name.equals(this.g.name + Grammar.getGrammarTypeToFileNameSuffix(ANTLRParser.LEXER)) ||
                delegate.name.equals(this.g.name + Grammar.getGrammarTypeToFileNameSuffix(ANTLRParser.PARSER)))) {
            this.g.tool.errMgr.grammarError(ErrorType.IMPORT_NAME_CLASH,
                this.g.fileName,
                importID,
                this.g, delegate);
        }
    }

    private checkCaseInsensitiveOption(optionID: Token, valueAST: GrammarAST, parentType: number): void {
        const optionName = optionID.getText();
        if (optionName.equals(Grammar.caseInsensitiveOptionName)) {
            const valueText = valueAST.getText();
            if (valueText.equals("true") || valueText.equals("false")) {
                const currentValue = Boolean.parseBoolean(valueText);
                if (parentType === ANTLRParser.GRAMMAR) {
                    this.grammarCaseInsensitive = currentValue;
                }
                else {
                    if (this.grammarCaseInsensitive === currentValue) {
                        this.g.tool.errMgr.grammarError(ErrorType.REDUNDANT_CASE_INSENSITIVE_LEXER_RULE_OPTION,
                            this.g.fileName, optionID, currentValue);
                    }
                }
            }
            else {
                this.g.tool.errMgr.grammarError(ErrorType.ILLEGAL_OPTION_VALUE, this.g.fileName, valueAST.getToken(),
                    optionName, valueText);
            }
        }
    }
}
