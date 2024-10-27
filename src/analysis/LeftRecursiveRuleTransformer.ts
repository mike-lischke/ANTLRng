/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/* eslint-disable jsdoc/require-param, jsdoc/require-returns */

import { CharStream, CommonTokenStream, RecognitionException } from "antlr4ng";

import { Tool } from "../Tool.js";
import type { SupportedLanguage } from "../codegen/CodeGenerator.js";
import { Constants } from "../constants.js";
import { ANTLRv4Lexer } from "../generated/ANTLRv4Lexer.js";
import { ANTLRv4Parser, type GrammarDeclContext } from "../generated/ANTLRv4Parser.js";
import { GrammarASTAdaptor } from "../parse/GrammarASTAdaptor.js";
import { ScopeParser } from "../parse/ScopeParser.js";
import { ToolANTLRParser } from "../parse/ToolANTLRParser.js";
import { BasicSemanticChecks } from "../semantics/BasicSemanticChecks.js";
import { RuleCollector } from "../semantics/RuleCollector.js";
import { isTokenName } from "../support/helpers.js";
import { DictType } from "../tool/DictType.js";
import { ErrorManager } from "../tool/ErrorManager.js";
import { ErrorType } from "../tool/ErrorType.js";
import { Grammar } from "../tool/Grammar.js";
import { GrammarTransformPipeline } from "../tool/GrammarTransformPipeline.js";
import { LabelElementPair } from "../tool/LabelElementPair.js";
import { LeftRecursiveRule } from "../tool/LeftRecursiveRule.js";
import { Rule } from "../tool/Rule.js";
import { ActionAST } from "../tool/ast/ActionAST.js";
import { AltAST } from "../tool/ast/AltAST.js";
import { BlockAST } from "../tool/ast/BlockAST.js";
import { GrammarAST } from "../tool/ast/GrammarAST.js";
import { GrammarASTWithOptions } from "../tool/ast/GrammarASTWithOptions.js";
import { GrammarRootAST } from "../tool/ast/GrammarRootAST.js";
import { RuleAST } from "../tool/ast/RuleAST.js";
import { LeftRecursiveRuleAltInfo } from "./LeftRecursiveRuleAltInfo.js";
import { LeftRecursiveRuleAnalyzer } from "./LeftRecursiveRuleAnalyzer.js";

/**
 * Remove left-recursive rule refs, add precedence args to recursive rule refs.
 *  Rewrite rule so we can create ATN.
 *
 *  MODIFIES grammar AST in place.
 */
export class LeftRecursiveRuleTransformer {
    public ast: GrammarRootAST;
    public rules: Rule[];
    public g: Grammar;
    public tool: Tool;

    public constructor(ast: GrammarRootAST, rules: Rule[], g: Grammar) {
        this.ast = ast;
        this.rules = rules;
        this.g = g;
        this.tool = g.tool;
    }

    public translateLeftRecursiveRules(): void {
        const language = this.g.getLanguage();

        // translate all recursive rules
        const leftRecursiveRuleNames: string[] = [];
        for (const r of this.rules) {
            if (!isTokenName(r.name)) {
                if (LeftRecursiveRuleAnalyzer.hasImmediateRecursiveRuleRefs(r.ast, r.name)) {
                    const fitsPattern = this.translateLeftRecursiveRule(this.ast, r as LeftRecursiveRule, language);
                    if (fitsPattern) {
                        leftRecursiveRuleNames.push(r.name);
                    } else { // better given an error that non-conforming left-recursion exists
                        ErrorManager.get().grammarError(ErrorType.NONCONFORMING_LR_RULE, this.g.fileName,
                            (r.ast.getChild(0) as GrammarAST).token, r.name);
                    }
                }
            }
        }

        // update all refs to recursive rules to have [0] argument
        for (const r of this.ast.getNodesWithType(ANTLRv4Parser.RULE_REF)) {
            if (r.getParent()!.getType() !== ANTLRv4Parser.RULE_REF) {
                continue;
            }

            // must be rule def
            const rule = r as GrammarASTWithOptions;
            if (rule.getOptionString(Constants.PRECEDENCE_OPTION_NAME)) {
                continue;
            }

            // already has arg; must be in rewritten rule
            if (leftRecursiveRuleNames.includes(rule.getText()!)) {
                // found ref to recursive rule not already rewritten with arg
                rule.setOption(Constants.PRECEDENCE_OPTION_NAME,
                    new GrammarASTAdaptor().create(ANTLRv4Parser.INT, "0"));
            }
        }
    }

    /** Return true if successful */
    public translateLeftRecursiveRule(context: GrammarDeclContext, r: LeftRecursiveRule,
        language: SupportedLanguage): boolean {
        const prevRuleAST = r.ast;
        const ruleName = prevRuleAST.getChild(0)!.getText()!;
        const leftRecursiveRuleWalker = new LeftRecursiveRuleAnalyzer(prevRuleAST, this.tool, ruleName, language);
        let isLeftRec: boolean;
        try {
            isLeftRec = leftRecursiveRuleWalker.rec_rule();
        } catch (re) {
            if (re instanceof RecognitionException) {
                isLeftRec = false; // didn't match; oh well
            } else {
                throw re;
            }
        }
        if (!isLeftRec) {
            return false;
        }

        // replace old rule's AST; first create text of altered rule
        const rules = context.getFirstChildWithType(ANTLRv4Parser.RULE_REF) as GrammarAST;
        const newRuleText = leftRecursiveRuleWalker.getArtificialOpPrecRule();

        // now parse within the context of the grammar that originally created
        // the AST we are transforming. This could be an imported grammar so
        // we cannot just reference this.g because the role might come from
        // the imported grammar and not the root grammar (this.g)
        const t = this.parseArtificialRule(prevRuleAST.g, newRuleText);
        if (t === undefined) {
            return false;
        }

        // Reuse the name token from the original AST since it refers to the proper source location in the original
        // grammar.
        (t.getChild(0) as GrammarAST).token = (prevRuleAST.getChild(0) as GrammarAST).getToken();

        // update grammar AST and set rule's AST.
        rules.setChild(prevRuleAST.getChildIndex(), t);
        r.ast = t;

        // Reduce sets in newly created rule tree
        const transform = new GrammarTransformPipeline(this.g, this.g.tool);
        transform.reduceBlocksToSets(r.ast);

        // Rerun semantic checks on the new rule
        const ruleCollector = new RuleCollector(this.g);
        // TODO: ruleCollector.visit(t, "ruleSpec");
        const basics = new BasicSemanticChecks(this.g, ruleCollector);
        // disable the assoc element option checks because they are already
        // handled for the pre-transformed rule.
        basics.checkAssocElementOption = false;

        // TODO: basics.visit(t, "ruleSpec");

        // track recursive alt info for codegen
        r.recPrimaryAlts = new Array<LeftRecursiveRuleAltInfo>();
        r.recPrimaryAlts.push(...leftRecursiveRuleWalker.prefixAndOtherAlts);
        if (r.recPrimaryAlts.length === 0) {
            ErrorManager.get().grammarError(ErrorType.NO_NON_LR_ALTS, this.g.fileName,
                (r.ast.getChild(0) as GrammarAST).getToken(), r.name);
        }

        r.recOpAlts = new Map<number, LeftRecursiveRuleAltInfo>();
        leftRecursiveRuleWalker.binaryAlts.forEach((value, key) => {
            r.recOpAlts.set(key, value);
        });

        leftRecursiveRuleWalker.ternaryAlts.forEach((value, key) => {
            r.recOpAlts.set(key, value);
        });

        leftRecursiveRuleWalker.suffixAlts.forEach((value, key) => {
            r.recOpAlts.set(key, value);
        });

        // walk alt info records and set their altAST to point to appropriate ALT subtree
        // from freshly created AST
        this.setAltASTPointers(r, t);

        // update Rule to just one alt and add prec alt
        const arg = r.ast.getFirstChildWithType(ANTLRv4Parser.BEGIN_ARGUMENT) as ActionAST | null;
        if (arg !== null) {
            r.args = ScopeParser.parseTypedArgList(arg, arg.getText()!, this.g);
            r.args.type = DictType.Argument;
            r.args.ast = arg;
            arg.resolver = r.alt[1]; // todo: isn't this Rule or something?
        }

        // define labels on recursive rule refs we delete; they don't point to nodes of course
        // these are so $label in action translation works
        for (const [ast, _] of leftRecursiveRuleWalker.leftRecursiveRuleRefLabels) {
            const labelOpNode = ast.getParent() as GrammarAST;
            const elementNode = labelOpNode.getChild(1) as GrammarAST;
            const lp = new LabelElementPair(this.g, ast, elementNode, labelOpNode.getType());
            r.alt[1].labelDefs.set(ast.getText()!, [lp]);
        }
        // copy to rule from walker
        r.leftRecursiveRuleRefLabels = leftRecursiveRuleWalker.leftRecursiveRuleRefLabels;

        this.tool.logInfo({ component: "grammar", msg: "added: " + t.toStringTree() });

        return true;
    }

    public parseArtificialRule(g: Grammar, ruleText: string): RuleAST | undefined {
        const stream = CharStream.fromString(ruleText);
        const lexer = new ANTLRv4Lexer(stream);
        const adaptor = new GrammarASTAdaptor(stream);
        const tokens = new CommonTokenStream(lexer);
        //lexer.tokens = tokens;
        const p = new ToolANTLRParser(tokens, this.tool);
        //p.setTreeAdaptor(adaptor);
        const ruleStart = null;
        try {
            /*const r = p.rule();
            const tree = r.getTree() as RuleAST;
            ruleStart = r.getStart() as Token;
            GrammarTransformPipeline.setGrammarPtr(g, tree);
            GrammarTransformPipeline.augmentTokensWithOriginalPosition(g, tree);

            return tree;*/
        } catch (e) {
            ErrorManager.get().toolError(ErrorType.INTERNAL_ERROR, e, ruleStart,
                "error parsing rule created during left-recursion detection: " + ruleText);
        }

        return undefined;
    }

    /**
     * <pre>
     * (RULE e int _p (returns int v)
     * 	(BLOCK
     * 	  (ALT
     * 		(BLOCK
     * 			(ALT INT {$v = $INT.int;})
     * 			(ALT '(' (= x e) ')' {$v = $x.v;})
     * 			(ALT ID))
     * 		(* (BLOCK
     *			(OPTIONS ...)
     * 			(ALT {7 &gt;= $_p}? '*' (= b e) {$v = $a.v * $b.v;})
     * 			(ALT {6 &gt;= $_p}? '+' (= b e) {$v = $a.v + $b.v;})
     * 			(ALT {3 &gt;= $_p}? '++') (ALT {2 &gt;= $_p}? '--'))))))
     * </pre>
     */
    public setAltASTPointers(r: LeftRecursiveRule, t: RuleAST): void {
        const ruleBlk = t.getFirstChildWithType(ANTLRv4Parser.LPAREN) as BlockAST;
        const mainAlt = ruleBlk.getChild(0) as AltAST;
        const primaryBlk = mainAlt.getChild(0) as BlockAST;
        const opsBlk = mainAlt.getChild(1)!.getChild(0) as BlockAST; // (* BLOCK ...)
        for (let i = 0; i < r.recPrimaryAlts.length; i++) {
            const altInfo = r.recPrimaryAlts[i];
            altInfo.altAST = primaryBlk.getChild(i) as AltAST;
            altInfo.altAST.leftRecursiveAltInfo = altInfo;
            altInfo.originalAltAST!.leftRecursiveAltInfo = altInfo;
        }

        for (let i = 0; i < r.recOpAlts.size; i++) {
            const altInfo = r.recOpAlts.get(i)!;
            altInfo.altAST = opsBlk.getChild(i) as AltAST;
            altInfo.altAST.leftRecursiveAltInfo = altInfo;
            altInfo.originalAltAST!.leftRecursiveAltInfo = altInfo;
        }
    }

}
