/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */



import { SrcOp } from "./SrcOp.js";
import { OutputModelObject } from "./OutputModelObject.js";
import { ModelElement } from "./ModelElement.js";
import { ExceptionClause } from "./ExceptionClause.js";
import { ElementFrequenciesVisitor } from "./ElementFrequenciesVisitor.js";
import { CodeBlockForOuterMostAlt } from "./CodeBlockForOuterMostAlt.js";
import { Action } from "./Action.js";
import { OutputModelFactory } from "../OutputModelFactory.js";
import { AltLabelStructDecl } from "./decl/AltLabelStructDecl.js";
import { AttributeDecl } from "./decl/AttributeDecl.js";
import { ContextRuleGetterDecl } from "./decl/ContextRuleGetterDecl.js";
import { ContextRuleListGetterDecl } from "./decl/ContextRuleListGetterDecl.js";
import { ContextRuleListIndexedGetterDecl } from "./decl/ContextRuleListIndexedGetterDecl.js";
import { ContextTokenGetterDecl } from "./decl/ContextTokenGetterDecl.js";
import { ContextTokenListGetterDecl } from "./decl/ContextTokenListGetterDecl.js";
import { ContextTokenListIndexedGetterDecl } from "./decl/ContextTokenListIndexedGetterDecl.js";
import { Decl } from "./decl/Decl.js";
import { StructDecl } from "./decl/StructDecl.js";
import { FrequencySet } from "../../misc/FrequencySet.js";
import { Utils } from "../../misc/Utils.js";
import { GrammarASTAdaptor } from "../../parse/GrammarASTAdaptor.js";
import { ATNState, IntervalSet, OrderedHashSet, HashMap, HashSet } from "antlr4ng";
import { ErrorType } from "../../tool/ErrorType.js";
import { Rule } from "../../tool/Rule.js";
import { ActionAST } from "../../tool/ast/ActionAST.js";
import { AltAST } from "../../tool/ast/AltAST.js";
import { GrammarAST } from "../../tool/ast/GrammarAST.js";
import { PredAST } from "../../tool/ast/PredAST.js";




export class RuleFunction extends OutputModelObject {
    public readonly name: string;
    public readonly escapedName: string;
    public readonly modifiers: Array<string>;
    public ctxType: string;
    public readonly ruleLabels: Array<string>;
    public readonly tokenLabels: Array<string>;
    public readonly startState: ATNState;
    public readonly index: number;
    public readonly rule: Rule;
    public readonly altToContext: AltLabelStructDecl[];
    public hasLookaheadBlock: boolean;


    public code: Array<SrcOp>;

    public locals: OrderedHashSet<Decl>; // TODO: move into ctx?

    public args = null;

    public ruleCtx: StructDecl;

    public altLabelCtxs: Map<string, AltLabelStructDecl>;

    public namedActions: Map<string, Action>;

    public finallyAction: Action;

    public exceptions: Array<ExceptionClause>;

    public postamble: Array<SrcOp>;

    public constructor(factory: OutputModelFactory, r: Rule) {
        super(factory);
        this.name = r.name;
        this.escapedName = factory.getGenerator().getTarget().escapeIfNeeded(r.name);
        this.rule = r;
        this.modifiers = Utils.nodesToStrings(r.modifiers);

        this.index = r.index;

        this.ruleCtx = new StructDecl(factory, r);
        this.altToContext = new Array<AltLabelStructDecl>(r.getOriginalNumberOfAlts() + 1);
        this.addContextGetters(factory, r);

        if (r.args !== null) {
            let decls = r.args.attributes.values();
            if (decls.size() > 0) {
                this.args = new Array<AttributeDecl>();
                this.ruleCtx.addDecls(decls);
                for (let a of decls) {
                    this.args.add(new AttributeDecl(factory, a));
                }
                this.ruleCtx.ctorAttrs = this.args;
            }
        }
        if (r.retvals !== null) {
            this.ruleCtx.addDecls(r.retvals.attributes.values());
        }
        if (r.locals !== null) {
            this.ruleCtx.addDecls(r.locals.attributes.values());
        }

        this.ruleLabels = r.getElementLabelNames();
        this.tokenLabels = r.getTokenRefs();
        if (r.exceptions !== null) {
            this.exceptions = new Array<ExceptionClause>();
            for (let e of r.exceptions) {
                let catchArg = e.getChild(0) as ActionAST;
                let catchAction = e.getChild(1) as ActionAST;
                this.exceptions.add(new ExceptionClause(factory, catchArg, catchAction));
            }
        }

        this.startState = factory.getGrammar().atn.ruleToStartState[r.index];
    }

    public addContextGetters(factory: OutputModelFactory, r: Rule): void {
        // Add ctx labels for elements in alts with no -> label
        let altsNoLabels = r.getUnlabeledAltASTs();
        if (altsNoLabels !== null) {
            let decls = this.getDeclsForAllElements(altsNoLabels);
            // we know to put in rule ctx, so do it directly
            for (let d of decls) {
                this.ruleCtx.addDecl(d);
            }

        }

        // make structs for -> labeled alts, define ctx labels for elements
        this.altLabelCtxs = new HashMap<string, AltLabelStructDecl>();
        let labels = r.getAltLabels();
        if (labels !== null) {
            for (let entry of labels.entrySet()) {
                let label = entry.getKey();
                let alts = new Array<AltAST>();
                for (let pair of entry.getValue()) {
                    alts.add(pair.b);
                }

                let decls = this.getDeclsForAllElements(alts);
                for (let pair of entry.getValue()) {
                    let altNum = pair.a;
                    this.altToContext[altNum] = new AltLabelStructDecl(factory, r, altNum, label);
                    if (!this.altLabelCtxs.containsKey(label)) {
                        this.altLabelCtxs.put(label, this.altToContext[altNum]);
                    }

                    // we know which ctx to put in, so do it directly
                    for (let d of decls) {
                        this.altToContext[altNum].addDecl(d);
                    }
                }
            }
        }
    }

    public fillNamedActions(factory: OutputModelFactory, r: Rule): void {
        if (r.finallyAction !== null) {
            this.finallyAction = new Action(factory, r.finallyAction);
        }

        this.namedActions = new HashMap<string, Action>();
        for (let name of r.namedActions.keySet()) {
            let ast = r.namedActions.get(name);
            this.namedActions.put(name, new Action(factory, ast));
        }
    }

    /** for all alts, find which ref X or r needs List
       Must see across alts. If any alt needs X or r as list, then
       define as list.
     */
    public getDeclsForAllElements(altASTs: Array<AltAST>): Set<Decl> {
        let needsList = new HashSet<string>();
        let nonOptional = new HashSet<string>();
        let allRefs = new Array<GrammarAST>();
        let firstAlt = true;
        let reftypes = new IntervalSet(RULE_REF, TOKEN_REF, STRING_LITERAL);
        for (let ast of altASTs) {
            let refs = this.getRuleTokens(ast.getNodesWithType(reftypes));
            allRefs.addAll(refs);
            let minAndAltFreq = this.getElementFrequenciesForAlt(ast);
            let minFreq = minAndAltFreq.a;
            let altFreq = minAndAltFreq.b;
            for (let t of refs) {
                let refLabelName = this.getName(t);

                if (refLabelName !== null) {
                    if (altFreq.count(refLabelName) > 1) {
                        needsList.add(refLabelName);
                    }

                    if (firstAlt && minFreq.count(refLabelName) !== 0) {
                        nonOptional.add(refLabelName);
                    }
                }
            }

            for (let ref of nonOptional.toArray(new Array<string>(0))) {
                if (minFreq.count(ref) === 0) {
                    nonOptional.remove(ref);
                }
            }

            firstAlt = false;
        }
        let decls = new LinkedHashSet<Decl>();
        for (let t of allRefs) {
            let refLabelName = this.getName(t);

            if (refLabelName === null) {
                continue;
            }

            let d = this.getDeclForAltElement(t,
                refLabelName,
                needsList.contains(refLabelName),
                !nonOptional.contains(refLabelName));
            decls.addAll(d);
        }
        return decls;
    }

    public getDeclForAltElement(t: GrammarAST, refLabelName: string, needList: boolean, optional: boolean): Array<Decl> {
        let decls = new Array<Decl>();
        if (t.getType() === RULE_REF) {
            let rref = this.factory.getGrammar().getRule(t.getText());
            let ctxName = this.factory.getGenerator().getTarget()
                .getRuleFunctionContextStructName(rref);
            if (needList) {
                if (this.factory.getGenerator().getTarget().supportsOverloadedMethods()) {

                    decls.add(new ContextRuleListGetterDecl(this.factory, refLabelName, ctxName));
                }

                decls.add(new ContextRuleListIndexedGetterDecl(this.factory, refLabelName, ctxName));
            }
            else {
                decls.add(new ContextRuleGetterDecl(this.factory, refLabelName, ctxName, optional));
            }
        }
        else {
            if (needList) {
                if (this.factory.getGenerator().getTarget().supportsOverloadedMethods()) {

                    decls.add(new ContextTokenListGetterDecl(this.factory, refLabelName));
                }

                decls.add(new ContextTokenListIndexedGetterDecl(this.factory, refLabelName));
            }
            else {
                decls.add(new ContextTokenGetterDecl(this.factory, refLabelName, optional));
            }
        }
        return decls;
    }

    /** Add local var decl */
    public addLocalDecl(d: Decl): void {
        if (this.locals === null) {
            this.locals = new OrderedHashSet<Decl>();
        }

        this.locals.add(d);
        d.isLocal = true;
    }

    /** Add decl to struct ctx for rule or alt if labeled */
    public addContextDecl(altLabel: string, d: Decl): void {
        let alt = d.getOuterMostAltCodeBlock();
        // if we found code blk and might be alt label, try to add to that label ctx
        if (alt !== null && this.altLabelCtxs !== null) {
            //			System.out.println(d.name+" lives in alt "+alt.alt.altNum);
            let altCtx = this.altLabelCtxs.get(altLabel);
            if (altCtx !== null) { // we have an alt ctx
                //				System.out.println("ctx is "+ altCtx.name);
                altCtx.addDecl(d);
                return;
            }
        }
        this.ruleCtx.addDecl(d); // stick in overall rule's ctx
    }

    /** Given list of X and r refs in alt, compute how many of each there are */
    protected getElementFrequenciesForAlt(ast: AltAST): <FrequencySet<string>, FrequencySet<string>> {
        try {
            let  visitor = new ElementFrequenciesVisitor(new CommonTreeNodeStream(new GrammarASTAdaptor(), ast));
            visitor.outerAlternative();
            if(visitor.frequencies.size() !== 1) {
    this.factory.getGrammar().tool.errMgr.toolError(ErrorType.INTERNAL_ERROR);
    return new (new FrequencySet<string>(), new FrequencySet<string>());
}

return new (visitor.getMinFrequencies(), visitor.frequencies.peek());
		} catch (ex) {
    if (ex instanceof RecognitionException) {
        this.factory.getGrammar().tool.errMgr.toolError(ErrorType.INTERNAL_ERROR, ex);
        return new (new FrequencySet<string>(), new FrequencySet<string>());
    } else {
        throw ex;
    }
}
	}

	private getRuleTokens(refs: Array<GrammarAST>): Array < GrammarAST > {
    let  result = new Array(refs.size());
    for(let ref of refs) {
        let r = ref;

        let ignore = false;
        while (r !== null) {
            // Ignore string literals in predicates
            if (r instanceof PredAST) {
                ignore = true;
                break;
            }
            r = r.parent;
        }

        if (!ignore) {
            result.add(ref);
        }
    }

		return result;
}

	private getName(token: GrammarAST):  string {
    let tokenText = token.getText();
    let tokenName = token.getType() !== STRING_LITERAL ? tokenText : token.g.getTokenName(tokenText);
    return tokenName === null || tokenName.startsWith("T__") ? null : tokenName; // Do not include tokens with auto generated names
}
}
