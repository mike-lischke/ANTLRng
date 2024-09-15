/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { LeftRecursiveRuleAnalyzer } from "./LeftRecursiveRuleAnalyzer.js";
import { LeftRecursiveRuleAltInfo } from "./LeftRecursiveRuleAltInfo.js";
import { Tool } from "../Tool.js";
import { GrammarASTAdaptor } from "../parse/GrammarASTAdaptor.js";
import { ScopeParser } from "../parse/ScopeParser.js";
import { ToolANTLRParser } from "../parse/ToolANTLRParser.js";
import { BasicSemanticChecks } from "../semantics/BasicSemanticChecks.js";
import { RuleCollector } from "../semantics/RuleCollector.js";
import { AttributeDict } from "../tool/AttributeDict.js";
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
import { OrderedHashMap } from "antlr4ng";

/**
 * Remove left-recursive rule refs, add precedence args to recursive rule refs.
 *  Rewrite rule so we can create ATN.
 *
 *  MODIFIES grammar AST in place.
 */
export class LeftRecursiveRuleTransformer {
    public static readonly PRECEDENCE_OPTION_NAME = "p";
    public static readonly TOKENINDEX_OPTION_NAME = "tokenIndex";

    public ast: GrammarRootAST;
    public rules: Collection<Rule>;
    public g: Grammar;
    public tool: Tool;

    public constructor(ast: GrammarRootAST, rules: Collection<Rule>, g: Grammar) {
        this.ast = ast;
        this.rules = rules;
        this.g = g;
        this.tool = g.tool;
    }

    public translateLeftRecursiveRules(): void {
        const language = this.g.getLanguage();
        // translate all recursive rules
        const leftRecursiveRuleNames = new Array<string>();
        for (const r of this.rules) {
            if (!Grammar.isTokenName(r.name)) {
                if (LeftRecursiveRuleAnalyzer.hasImmediateRecursiveRuleRefs(r.ast, r.name)) {
                    const fitsPattern = this.translateLeftRecursiveRule(this.ast, r as LeftRecursiveRule, language);
                    if (fitsPattern) {
                        leftRecursiveRuleNames.add(r.name);
                    }
                    else { // better given an error that non-conforming left-recursion exists
                        this.tool.errMgr.grammarError(ErrorType.NONCONFORMING_LR_RULE, this.g.fileName, (r.ast.getChild(0) as GrammarAST).token, r.name);
                    }
                }
            }
        }

        // update all refs to recursive rules to have [0] argument
        for (const r of this.ast.getNodesWithType(ANTLRParser.RULE_REF)) {
            if (r.getParent().getType() === ANTLRParser.RULE) {
                continue;
            }
            // must be rule def
            if ((r as GrammarASTWithOptions).getOptionString(LeftRecursiveRuleTransformer.PRECEDENCE_OPTION_NAME) !== null) {
                continue;
            }
            // already has arg; must be in rewritten rule
            if (leftRecursiveRuleNames.contains(r.getText())) {
                // found ref to recursive rule not already rewritten with arg
                (r as GrammarASTWithOptions).setOption(LeftRecursiveRuleTransformer.PRECEDENCE_OPTION_NAME, new GrammarASTAdaptor().create(ANTLRParser.INT, "0"));
            }
        }
    }

    /** Return true if successful */
    public translateLeftRecursiveRule(ast: GrammarRootAST,
        r: LeftRecursiveRule,
        language: string): boolean {
        //tool.log("grammar", ruleAST.toStringTree());
        const prevRuleAST = r.ast;
        const ruleName = prevRuleAST.getChild(0).getText();
        const leftRecursiveRuleWalker =
            new LeftRecursiveRuleAnalyzer(prevRuleAST, this.tool, ruleName, language);
        let isLeftRec: boolean;
        try {
            //			System.out.println("TESTING ---------------\n"+
            //							   leftRecursiveRuleWalker.text(ruleAST));
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
        const RULES = ast.getFirstChildWithType(ANTLRParser.RULES) as GrammarAST;
        const newRuleText = leftRecursiveRuleWalker.getArtificialOpPrecRule();
        //		System.out.println("created: "+newRuleText);
        // now parse within the context of the grammar that originally created
        // the AST we are transforming. This could be an imported grammar so
        // we cannot just reference this.g because the role might come from
        // the imported grammar and not the root grammar (this.g)
        const t = this.parseArtificialRule(prevRuleAST.g, newRuleText);

        // reuse the name token from the original AST since it refers to the proper source location in the original grammar
        (t.getChild(0) as GrammarAST).token = (prevRuleAST.getChild(0) as GrammarAST).getToken();

        // update grammar AST and set rule's AST.
        RULES.setChild(prevRuleAST.getChildIndex(), t);
        r.ast = t;

        // Reduce sets in newly created rule tree
        const transform = new GrammarTransformPipeline(this.g, this.g.tool);
        transform.reduceBlocksToSets(r.ast);
        transform.expandParameterizedLoops(r.ast);

        // Rerun semantic checks on the new rule
        const ruleCollector = new RuleCollector(this.g);
        ruleCollector.visit(t, "rule");
        const basics = new BasicSemanticChecks(this.g, ruleCollector);
        // disable the assoc element option checks because they are already
        // handled for the pre-transformed rule.
        basics.checkAssocElementOption = false;
        basics.visit(t, "rule");

        // track recursive alt info for codegen
        r.recPrimaryAlts = new Array<LeftRecursiveRuleAltInfo>();
        r.recPrimaryAlts.addAll(leftRecursiveRuleWalker.prefixAndOtherAlts);
        if (r.recPrimaryAlts.isEmpty()) {
            this.tool.errMgr.grammarError(ErrorType.NO_NON_LR_ALTS, this.g.fileName, (r.ast.getChild(0) as GrammarAST).getToken(), r.name);
        }

        r.recOpAlts = new OrderedHashMap<number, LeftRecursiveRuleAltInfo>();
        r.recOpAlts.putAll(leftRecursiveRuleWalker.binaryAlts);
        r.recOpAlts.putAll(leftRecursiveRuleWalker.ternaryAlts);
        r.recOpAlts.putAll(leftRecursiveRuleWalker.suffixAlts);

        // walk alt info records and set their altAST to point to appropriate ALT subtree
        // from freshly created AST
        this.setAltASTPointers(r, t);

        // update Rule to just one alt and add prec alt
        const arg = r.ast.getFirstChildWithType(ANTLRParser.ARG_ACTION) as ActionAST;
        if (arg !== null) {
            r.args = ScopeParser.parseTypedArgList(arg, arg.getText(), this.g);
            r.args.type = AttributeDict.DictType.ARG;
            r.args.ast = arg;
            arg.resolver = r.alt[1]; // todo: isn't this Rule or something?
        }

        // define labels on recursive rule refs we delete; they don't point to nodes of course
        // these are so $label in action translation works
        for (const pair of leftRecursiveRuleWalker.leftRecursiveRuleRefLabels) {
            const labelNode = pair.a;
            const labelOpNode = labelNode.getParent() as GrammarAST;
            const elementNode = labelOpNode.getChild(1) as GrammarAST;
            const lp = new LabelElementPair(this.g, labelNode, elementNode, labelOpNode.getType());
            r.alt[1].labelDefs.map(labelNode.getText(), lp);
        }
        // copy to rule from walker
        r.leftRecursiveRuleRefLabels = leftRecursiveRuleWalker.leftRecursiveRuleRefLabels;

        this.tool.logInfo("grammar", "added: " + t.toStringTree());

        return true;
    }

    public parseArtificialRule(/* final */  g: Grammar, ruleText: string): RuleAST {
        const lexer = new ANTLRLexer(new ANTLRStringStream(ruleText));
        const adaptor = new GrammarASTAdaptor(lexer.getCharStream());
        const tokens = new CommonTokenStream(lexer);
        lexer.tokens = tokens;
        const p = new ToolANTLRParser(tokens, this.tool);
        p.setTreeAdaptor(adaptor);
        let ruleStart = null;
        try {
            const r = p.rule();
            const tree = r.getTree() as RuleAST;
            ruleStart = r.getStart() as Token;
            GrammarTransformPipeline.setGrammarPtr(g, tree);
            GrammarTransformPipeline.augmentTokensWithOriginalPosition(g, tree);

            return tree;
        } catch (e) {
            if (e instanceof Exception) {
                this.tool.errMgr.toolError(ErrorType.INTERNAL_ERROR,
                    e,
                    ruleStart,
                    "error parsing rule created during left-recursion detection: " + ruleText);
            } else {
                throw e;
            }
        }

        return null;
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
        //		System.out.println("RULE: "+t.toStringTree());
        const ruleBlk = t.getFirstChildWithType(ANTLRParser.BLOCK) as BlockAST;
        const mainAlt = ruleBlk.getChild(0) as AltAST;
        const primaryBlk = mainAlt.getChild(0) as BlockAST;
        const opsBlk = mainAlt.getChild(1).getChild(0) as BlockAST; // (* BLOCK ...)
        for (let i = 0; i < r.recPrimaryAlts.size(); i++) {
            const altInfo = r.recPrimaryAlts.get(i);
            altInfo.altAST = primaryBlk.getChild(i) as AltAST;
            altInfo.altAST.leftRecursiveAltInfo = altInfo;
            altInfo.originalAltAST.leftRecursiveAltInfo = altInfo;
            //			altInfo.originalAltAST.parent = altInfo.altAST.parent;
            //			System.out.println(altInfo.altAST.toStringTree());
        }
        for (let i = 0; i < r.recOpAlts.size(); i++) {
            const altInfo = r.recOpAlts.getElement(i);
            altInfo.altAST = opsBlk.getChild(i) as AltAST;
            altInfo.altAST.leftRecursiveAltInfo = altInfo;
            altInfo.originalAltAST.leftRecursiveAltInfo = altInfo;
            //			altInfo.originalAltAST.parent = altInfo.altAST.parent;
            //			System.out.println(altInfo.altAST.toStringTree());
        }
    }

}
