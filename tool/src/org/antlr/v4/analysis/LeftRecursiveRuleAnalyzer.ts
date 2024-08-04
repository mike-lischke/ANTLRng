/* java2ts: keep */

/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/* eslint-disable jsdoc/require-returns, jsdoc/require-param */

import { CommonToken, IntervalSet, type TokenStream } from "antlr4ng";
import { STGroupFile, type STGroup } from "stringtemplate4ts";

import { CommonTreeNodeStream } from "../../../../../../src/antlr3/tree/CommonTreeNodeStream.js";
import { LeftRecursiveRuleWalker } from "../../../../../../src/tree-walkers/LeftRecursiveRuleWalker.js";
import { Tool } from "../Tool.js";
import { CodeGenerator } from "../codegen/CodeGenerator.js";
import { GrammarASTAdaptor } from "../parse/GrammarASTAdaptor.js";
import { ErrorType } from "../tool/ErrorType.js";
import { AltAST } from "../tool/ast/AltAST.js";
import { GrammarAST } from "../tool/ast/GrammarAST.js";
import { GrammarASTWithOptions } from "../tool/ast/GrammarASTWithOptions.js";
import { RuleRefAST } from "../tool/ast/RuleRefAST.js";
import { LeftRecursiveRuleAltInfo } from "./LeftRecursiveRuleAltInfo.js";
import { LeftRecursiveRuleTransformer } from "./LeftRecursiveRuleTransformer.js";



/** Using a tree walker on the rules, determine if a rule is directly left-recursive and if it follows
 *  our pattern.
 */
export class LeftRecursiveRuleAnalyzer extends LeftRecursiveRuleWalker {

    public static readonly recRuleTemplates: STGroup;

    public tool: Tool;
    public declare ruleName: string;
    public binaryAlts = new Map<number, LeftRecursiveRuleAltInfo>();
    public ternaryAlts = new Map<number, LeftRecursiveRuleAltInfo>();
    public suffixAlts = new Map<number, LeftRecursiveRuleAltInfo>();
    public prefixAndOtherAlts = new Array<LeftRecursiveRuleAltInfo>();

    /** Pointer to ID node of ^(= ID element) */
    public leftRecursiveRuleRefLabels =
        new Array<[GrammarAST, string]>();

    /** Tokens from which rule AST comes from */
    public readonly tokenStream: TokenStream;

    public retvals: GrammarAST;
    public readonly codegenTemplates: STGroup;
    public readonly language: string;

    public altAssociativity = new Map<number, ASSOC>();

    public constructor(ruleAST: GrammarAST,
        tool: Tool, ruleName: string, language: string) {
        super(new CommonTreeNodeStream(new GrammarASTAdaptor(ruleAST.token!.inputStream!), ruleAST));
        this.tool = tool;
        this.ruleName = ruleName;
        this.language = language;
        this.tokenStream = ruleAST.g.tokenStream;
        if (!this.tokenStream) {
            throw new Error("grammar must have a token stream");
        }

        // use codegen to get correct language templates; that's it though
        this.codegenTemplates = CodeGenerator.create(tool, null, language).getTemplates();
    }

    /**
     * Match (RULE RULE_REF (BLOCK (ALT .*) (ALT RULE_REF[self] .*) (ALT .*)))
     * Match (RULE RULE_REF (BLOCK (ALT .*) (ALT (ASSIGN ID RULE_REF[self]) .*) (ALT .*)))
     */
    public static hasImmediateRecursiveRuleRefs(t: GrammarAST, ruleName: string): boolean {
        if (t === null) {
            return false;
        }

        let blk = t.getFirstChildWithType(LeftRecursiveRuleAnalyzer.BLOCK) as GrammarAST;
        if (blk === null) {
            return false;
        }

        let n = blk.getChildren().length;
        for (let i = 0; i < n; i++) {
            let alt = blk.getChildren()[i] as GrammarAST;
            let first = alt.getChild(0);
            if (first === null) {
                continue;
            }

            if (first.getType() === LeftRecursiveRuleAnalyzer.ELEMENT_OPTIONS) {
                first = alt.getChild(1);
                if (first === null) {
                    continue;
                }
            }
            if (first.getType() === LeftRecursiveRuleAnalyzer.RULE_REF && first.getText() === ruleName) {
                return true;
            }

            let ruleRef = first.getChild(1);
            if (ruleRef !== null && ruleRef.getType() === LeftRecursiveRuleAnalyzer.RULE_REF &&
                ruleRef.getText() === ruleName) {
                return true;
            }

        }
        return false;
    }


    public override setReturnValues(t: GrammarAST): void {
        this.retvals = t;
    }


    public override setAltAssoc(t: AltAST, alt: number): void {
        let assoc = ASSOC.left;
        if (t.getOptions() !== null) {
            let a = t.getOptionString("assoc");
            if (a) {
                if (a === ASSOC.right.toString()) {
                    assoc = ASSOC.right;
                } else {
                    if (a === ASSOC.left.toString())
                        assoc = ASSOC.left;
                }                    else {
                    this.tool.errMgr.grammarError(ErrorType.ILLEGAL_OPTION_VALUE, t.g.fileName,
                        t.getOptionAST("assoc")!.getToken(), "assoc", assoc);
                }
            }

        }
    }

    if(this.altAssociativity.get(alt) !== null && this.altAssociativity.get(alt) !== assoc) {
    this.tool.errMgr.toolError(ErrorType.INTERNAL_ERROR, "all operators of alt " + alt + " of left-recursive rule must have same associativity");
}
this.altAssociativity.put(alt, assoc);

        //		System.out.println("setAltAssoc: op " + alt + ": " + t.getText()+", assoc="+assoc);
    }


    public override binaryAlt(originalAltTree: AltAST, alt: number): void {
    let altTree = originalAltTree.dupTree() as AltAST;
    let altLabel = altTree.altLabel !== null ? altTree.altLabel.getText() : null;

    let label = null;
    let isListLabel = false;
    let lrlabel = this.stripLeftRecursion(altTree);
    if(lrlabel !== null) {
    label = lrlabel.getText();
    isListLabel = lrlabel.getParent().getType() === LeftRecursiveRuleAnalyzer.PLUS_ASSIGN;
    this.leftRecursiveRuleRefLabels.add(new  <GrammarAST, string>(lrlabel, altLabel));
}

this.stripAltLabel(altTree);

// rewrite e to be e_[rec_arg]
let nextPrec = this.nextPrecedence(alt);
altTree = this.addPrecedenceArgToRules(altTree, nextPrec);

this.stripAltLabel(altTree);
let altText = this.text(altTree);
altText = altText.trim();
let a =
    new LeftRecursiveRuleAltInfo(alt, altText, label, altLabel, isListLabel, originalAltTree);
a.nextPrec = nextPrec;
this.binaryAlts.put(alt, a);
        //System.out.println("binaryAlt " + alt + ": " + altText + ", rewrite=" + rewriteText);
    }


    public override prefixAlt(originalAltTree: AltAST, alt: number): void {
    let altTree = originalAltTree.dupTree() as AltAST;
    this.stripAltLabel(altTree);

    let nextPrec = this.precedence(alt);
    // rewrite e to be e_[prec]
    altTree = this.addPrecedenceArgToRules(altTree, nextPrec);
    let altText = this.text(altTree);
    altText = altText.trim();
    let altLabel = altTree.altLabel !== null ? altTree.altLabel.getText() : null;
    let a =
    new LeftRecursiveRuleAltInfo(alt, altText, null, altLabel, false, originalAltTree);
    a.nextPrec = nextPrec;
    this.prefixAndOtherAlts.add(a);
    //System.out.println("prefixAlt " + alt + ": " + altText + ", rewrite=" + rewriteText);
}


    public override suffixAlt(originalAltTree: AltAST, alt: number): void {
    let altTree = originalAltTree.dupTree() as AltAST;
    let altLabel = altTree.altLabel !== null ? altTree.altLabel.getText() : null;

    let label = null;
    let isListLabel = false;
    let lrlabel = this.stripLeftRecursion(altTree);
    if(lrlabel !== null) {
    label = lrlabel.getText();
    isListLabel = lrlabel.getParent().getType() === LeftRecursiveRuleAnalyzer.PLUS_ASSIGN;
    this.leftRecursiveRuleRefLabels.add(new  <GrammarAST, string>(lrlabel, altLabel));
}
this.stripAltLabel(altTree);
let altText = this.text(altTree);
altText = altText.trim();
let a =
    new LeftRecursiveRuleAltInfo(alt, altText, label, altLabel, isListLabel, originalAltTree);
this.suffixAlts.put(alt, a);
        //		System.out.println("suffixAlt " + alt + ": " + altText + ", rewrite=" + rewriteText);
    }


    public override otherAlt(originalAltTree: AltAST, alt: number): void {
    let altTree = originalAltTree.dupTree() as AltAST;
    this.stripAltLabel(altTree);
    let altText = this.text(altTree);
    let altLabel = altTree.altLabel !== null ? altTree.altLabel.getText() : null;
    let a =
    new LeftRecursiveRuleAltInfo(alt, altText, null, altLabel, false, originalAltTree);
    // We keep other alts with prefix alts since they are all added to the start of the generated rule, and
    // we want to retain any prior ordering between them
    this.prefixAndOtherAlts.add(a);
    //		System.out.println("otherAlt " + alt + ": " + altText);
};

    // --------- get transformed rules ----------------

    public getArtificialOpPrecRule(): string {
    let ruleST = LeftRecursiveRuleAnalyzer.recRuleTemplates.getInstanceOf("recRule")!;
    ruleST.add("ruleName", this.ruleName);
    let ruleArgST = this.codegenTemplates.getInstanceOf("recRuleArg");
    ruleST.add("argName", ruleArgST);
    let setResultST = this.codegenTemplates.getInstanceOf("recRuleSetResultAction");
    ruleST.add("setResultAction", setResultST);
    ruleST.add("userRetvals", this.retvals);

    let opPrecRuleAlts = new Map<number, LeftRecursiveRuleAltInfo>();
    opPrecRuleAlts.putAll(this.binaryAlts);
    opPrecRuleAlts.putAll(this.ternaryAlts);
    opPrecRuleAlts.putAll(this.suffixAlts);
    for (let alt of opPrecRuleAlts.keySet()) {
        let altInfo = opPrecRuleAlts.get(alt);
        let altST = LeftRecursiveRuleAnalyzer.recRuleTemplates.getInstanceOf("recRuleAlt");
        let predST = this.codegenTemplates.getInstanceOf("recRuleAltPredicate");
        predST.add("opPrec", this.precedence(alt));
        predST.add("ruleName", this.ruleName);
        altST.add("pred", predST);
        altST.add("alt", altInfo);
        altST.add("precOption", LeftRecursiveRuleTransformer.PRECEDENCE_OPTION_NAME);
        altST.add("opPrec", this.precedence(alt));
        ruleST.add("opAlts", altST);
    }

    ruleST.add("primaryAlts", this.prefixAndOtherAlts);

    this.tool.logInfo("left-recursion", ruleST.render());

    return ruleST.render();
}

    public addPrecedenceArgToRules(t: AltAST, prec: number): AltAST {
    if (t === null) {
        return null;
    }

    // get all top-level rule refs from ALT
    let outerAltRuleRefs = t.getNodesWithTypePreorderDFS(IntervalSet.of(LeftRecursiveRuleAnalyzer.RULE_REF, LeftRecursiveRuleAnalyzer.RULE_REF));
    for (let x of outerAltRuleRefs) {
        let rref = x as RuleRefAST;
        let recursive = rref.getText().equals(this.ruleName);
        let rightmost = rref === outerAltRuleRefs.get(outerAltRuleRefs.size() - 1);
        if (recursive && rightmost) {
            let dummyValueNode = new GrammarAST(new CommonToken(ANTLRParser.INT, "" + prec));
            rref.setOption(LeftRecursiveRuleTransformer.PRECEDENCE_OPTION_NAME, dummyValueNode);
        }
    }
    return t;
}

    // TODO: this strips the tree properly, but since text()
    // uses the start of stop token index and gets text from that
    // ineffectively ignores this routine.
    public stripLeftRecursion(altAST: GrammarAST): GrammarAST {
    let lrlabel = null;
    let first = altAST.getChild(0) as GrammarAST;
    let leftRecurRuleIndex = 0;
    if (first.getType() === LeftRecursiveRuleAnalyzer.ELEMENT_OPTIONS) {
        first = altAST.getChild(1) as GrammarAST;
        leftRecurRuleIndex = 1;
    }
    let rref = first.getChild(1); // if label=rule
    if ((first.getType() === LeftRecursiveRuleAnalyzer.RULE_REF && first.getText().equals(this.ruleName)) ||
        (rref !== null && rref.getType() === LeftRecursiveRuleAnalyzer.RULE_REF && rref.getText().equals(this.ruleName))) {
        if (first.getType() === LeftRecursiveRuleAnalyzer.ASSIGN || first.getType() === LeftRecursiveRuleAnalyzer.PLUS_ASSIGN) {
            lrlabel = first.getChild(0) as GrammarAST;
        }

        // remove rule ref (first child unless options present)
        altAST.deleteChild(leftRecurRuleIndex);
        // reset index so it prints properly (sets token range of
        // ALT to start to right of left recur rule we deleted)
        let newFirstChild = altAST.getChild(leftRecurRuleIndex) as GrammarAST;
        altAST.setTokenStartIndex(newFirstChild.getTokenStartIndex());
    }
    return lrlabel;
}

    /** Strip last 2 tokens if → label; alter indexes in altAST */
    public stripAltLabel(altAST: GrammarAST): void {
    let start = altAST.getTokenStartIndex();
    let stop = altAST.getTokenStopIndex();
    // find =>
    for(let i = stop; i >= start; i--) {
    if (this.tokenStream.get(i).getType() === LeftRecursiveRuleAnalyzer.POUND) {
        altAST.setTokenStopIndex(i - 1);
        return;
    }
}
    }

    public text(t: GrammarAST): string {
    if (t === null) {
        return "";
    }


    let tokenStartIndex = t.getTokenStartIndex();
    let tokenStopIndex = t.getTokenStopIndex();

    // ignore tokens from existing option subtrees like:
    //    (ELEMENT_OPTIONS (= assoc right))
    //
    // element options are added back according to the values in the map
    // returned by getOptions().
    let ignore = new IntervalSet();
    let optionsSubTrees = t.getNodesWithType(LeftRecursiveRuleAnalyzer.ELEMENT_OPTIONS);
    for (let sub of optionsSubTrees) {
        ignore.add(sub.getTokenStartIndex(), sub.getTokenStopIndex());
    }

    // Individual labels appear as RULE_REF or TOKEN_REF tokens in the tree,
    // but do not support the ELEMENT_OPTIONS syntax. Make sure to not try
    // and add the tokenIndex option when writing these tokens.
    let noOptions = new IntervalSet();
    let labeledSubTrees = t.getNodesWithType(new IntervalSet(LeftRecursiveRuleAnalyzer.ASSIGN, LeftRecursiveRuleAnalyzer.PLUS_ASSIGN));
    for (let sub of labeledSubTrees) {
        noOptions.add(sub.getChild(0).getTokenStartIndex());
    }

    let buf = new StringBuilder();
    let i = tokenStartIndex;
    while (i <= tokenStopIndex) {
        if (ignore.contains(i)) {
            i++;
            continue;
        }

        let tok = this.tokenStream.get(i);

        // Compute/hold any element options
        let elementOptions = new StringBuilder();
        if (!noOptions.contains(i)) {
            let node = t.getNodeWithTokenIndex(tok.getTokenIndex());
            if (node !== null &&
                (tok.getType() === LeftRecursiveRuleAnalyzer.TOKEN_REF ||
                    tok.getType() === LeftRecursiveRuleAnalyzer.STRING_LITERAL ||
                    tok.getType() === LeftRecursiveRuleAnalyzer.RULE_REF)) {
                elementOptions.append("tokenIndex=").append(tok.getTokenIndex());
            }

            if (node instanceof GrammarASTWithOptions) {
                let o = node as GrammarASTWithOptions;
                for (let entry of o.getOptions().entrySet()) {
                    if (elementOptions.length() > 0) {
                        elementOptions.append(',');
                    }

                    elementOptions.append(entry.getKey());
                    elementOptions.append('=');
                    elementOptions.append(entry.getValue().getText());
                }
            }
        }

        buf.append(tok.getText()); // add actual text of the current token to the rewritten alternative
        i++;                       // move to the next token

        // Are there args on a rule?
        if (tok.getType() === LeftRecursiveRuleAnalyzer.RULE_REF && i <= tokenStopIndex && this.tokenStream.get(i).getType() === LeftRecursiveRuleAnalyzer.ARG_ACTION) {
            buf.append('[' + this.tokenStream.get(i).getText() + ']');
            i++;
        }

        // now that we have the actual element, we can add the options.
        if (elementOptions.length() > 0) {
            buf.append('<').append(elementOptions).append('>');
        }
    }
    return buf.toString();
}

    public precedence(alt: number): number {
    return this.numAlts - alt + 1;
}

    // Assumes left assoc
    public nextPrecedence(alt: number): number {
    let p = this.precedence(alt);
    if (this.altAssociativity.get(alt) === ASSOC.right) {
        return p;
    }

    return p + 1;
}


    public override toString(): string {
    return "PrecRuleOperatorCollector{" +
        "binaryAlts=" + this.binaryAlts +
        ", ternaryAlts=" + this.ternaryAlts +
        ", suffixAlts=" + this.suffixAlts +
        ", prefixAndOtherAlts=" + this.prefixAndOtherAlts +
        '}';
}

    public static ASSOC = class ASSOC extends Enum<ASSOC> {
    public static readonly left: ASSOC = new class extends ASSOC {
    }(S`left`, 0); public static readonly right: ASSOC = new class extends ASSOC {
    }(S`right`, 1);
};


    static {
    let templateGroupFile = "org/antlr/v4/tool/templates/LeftRecursiveRules.stg";
    LeftRecursiveRuleAnalyzer.recRuleTemplates = new STGroupFile(templateGroupFile);
    if (!LeftRecursiveRuleAnalyzer.recRuleTemplates.isDefined("recRule")) {
        try {
            throw new FileNotFoundException("can't find code generation templates: LeftRecursiveRules");
        } catch (e) {
            if (e instanceof FileNotFoundException) {
                e.printStackTrace();
            } else {
                throw e;
            }
        }
    }
}
}

// eslint-disable-next-line @typescript-eslint/no-namespace, no-redeclare
export namespace LeftRecursiveRuleAnalyzer {
    export type ASSOC = InstanceType<typeof ASSOC>;
}
