/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */


/* eslint-disable jsdoc/require-returns, jsdoc/require-param */


import { OutputModelController } from "./OutputModelController.js";
import { CodeGenerator } from "./CodeGenerator.js";
import { BlankOutputModelFactory } from "./BlankOutputModelFactory.js";
import { Action } from "./model/Action.js";
import { CodeBlockForOuterMostAlt } from "./model/CodeBlockForOuterMostAlt.js";
import { OutputModelObject } from "./model/OutputModelObject.js";
import { RuleFunction } from "./model/RuleFunction.js";
import { SrcOp } from "./model/SrcOp.js";
import { CodeBlock } from "./model/decl/CodeBlock.js";
import { Alternative } from "../tool/Alternative.js";
import { Grammar } from "../tool/Grammar.js";
import { Rule } from "../tool/Rule.js";



/** Create output objects for elements *within* rule functions except
 *  buildOutputModel() which builds outer/root model object and any
 *  objects such as RuleFunction that surround elements in rule
 *  functions.
 */
export abstract  class DefaultOutputModelFactory extends BlankOutputModelFactory {
	// Interface to outside world

	public readonly  g:  Grammar;

	public readonly  gen:  CodeGenerator;

	public  controller:  OutputModelController;

	protected  constructor(gen: CodeGenerator) {
		this.gen = gen;
		this.g = gen.g;
	}

	// MISC


	public static  list(...values: SrcOp[]):  Array<SrcOp>;


	public static  list(values: Collection< SrcOp>):  Array<SrcOp>;
public static list(...args: unknown[]):  Array<SrcOp> {
		switch (args.length) {
			case 1: {
				const [values] = args as [SrcOp[]];


		return new  Array<SrcOp>(Arrays.asList(java.io.ObjectInputFilter.Status.values));
	

				break;
			}

			case 1: {
				const [values] = args as [Collection< SrcOp>];


		return new  Array<SrcOp>(values);
	

				break;
			}

			default: {
				throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
			}
		}
	}


	@Override
public  setController(controller: OutputModelController):  void {
		this.controller = controller;
	}

	@Override
public  getController():  OutputModelController {
		return this.controller;
	}

	@Override
public override  rulePostamble(function: RuleFunction, r: Rule):  Array<SrcOp> {
		if ( r.namedActions.containsKey("after") || r.namedActions.containsKey("finally") ) {
			// See OutputModelController.buildLeftRecursiveRuleFunction
			// and Parser.exitRule for other places which set stop.
			let  gen = this.getGenerator();
			let  codegenTemplates = gen.getTemplates();
			let  setStopTokenAST = codegenTemplates.getInstanceOf("recRuleSetStopToken");
			let  setStopTokenAction = new  Action(this, function.ruleCtx, setStopTokenAST);
			let  ops = new  Array<SrcOp>(1);
			ops.add(setStopTokenAction);
			return ops;
		}
		return super.rulePostamble(function, r);
	}

	// Convenience methods


	@Override
public  getGrammar():  Grammar { return this.g; }

	@Override
public  getGenerator():  CodeGenerator { return this.gen; }

	@Override
public  getRoot():  OutputModelObject { return this.controller.getRoot(); }

	@Override
public  getCurrentRuleFunction():  RuleFunction { return this.controller.getCurrentRuleFunction(); }

	@Override
public  getCurrentOuterMostAlt():  Alternative { return this.controller.getCurrentOuterMostAlt(); }

	@Override
public  getCurrentBlock():  CodeBlock { return this.controller.getCurrentBlock(); }

	@Override
public  getCurrentOuterMostAlternativeBlock():  CodeBlockForOuterMostAlt { return this.controller.getCurrentOuterMostAlternativeBlock(); }

	@Override
public  getCodeBlockLevel():  number { return this.controller.codeBlockLevel; }

	@Override
public  getTreeLevel():  number { return this.controller.treeLevel; }
}
