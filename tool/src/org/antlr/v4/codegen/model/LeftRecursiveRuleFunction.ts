/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */


/* eslint-disable jsdoc/require-returns, jsdoc/require-param */


import { RuleFunction } from "./RuleFunction.js";
import { CodeGenerator } from "../CodeGenerator.js";
import { OutputModelFactory } from "../OutputModelFactory.js";
import { RuleContextDecl } from "./decl/RuleContextDecl.js";
import { RuleContextListDecl } from "./decl/RuleContextListDecl.js";
import { StructDecl } from "./decl/StructDecl.js";
import { LeftRecursiveRule } from "../../tool/LeftRecursiveRule.js";
import { Rule } from "../../tool/Rule.js";
import { GrammarAST } from "../../tool/ast/GrammarAST.js";



export  class LeftRecursiveRuleFunction extends RuleFunction {
	public  constructor(factory: OutputModelFactory, r: LeftRecursiveRule) {
		super(factory, r);

		let  gen = factory.getGenerator();
		// Since we delete x=lr, we have to manually add decls for all labels
		// on left-recur refs to proper structs
		for (let pair of r.leftRecursiveRuleRefLabels) {
			let  idAST = pair.a;
			let  altLabel = pair.b;
			let  label = idAST.getText();
			let  rrefAST = idAST.getParent().getChild(1) as GrammarAST;
			if ( rrefAST.getType() === ANTLRParser.RULE_REF ) {
				let  targetRule = factory.getGrammar().getRule(rrefAST.getText());
				let  ctxName = gen.getTarget().getRuleFunctionContextStructName(targetRule);
				let  d: RuleContextDecl;
				if (idAST.getParent().getType() === ANTLRParser.ASSIGN) {
					d = new  RuleContextDecl(factory, label, ctxName);
				}
				else {
					d = new  RuleContextListDecl(factory, label, ctxName);
				}

				let  struct = this.ruleCtx;
				if ( this.altLabelCtxs!==null ) {
					let  s = this.altLabelCtxs.get(altLabel);
					if ( s!==null ) {
 struct = s;
}
 // if alt label, use subctx
				}
				struct.addDecl(d); // stick in overall rule's ctx
			}
		}
	}
}
