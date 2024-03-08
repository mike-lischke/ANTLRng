/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */


/* eslint-disable jsdoc/require-returns, jsdoc/require-param */


import { LeftRecursionDetector } from "./LeftRecursionDetector.js";
import { Utils } from "../misc/Utils.js";
import { Token, DecisionState, LL1Analyzer, IntervalSet } from "antlr4ng";
import { ErrorType } from "../tool/ErrorType.js";
import { Grammar } from "../tool/Grammar.js";
import { Rule } from "../tool/Rule.js";
import { GrammarAST } from "../tool/ast/GrammarAST.js";



export  class AnalysisPipeline {
	public  g:  Grammar;

	public  constructor(g: Grammar) {
		this.g = g;
	}

	/** Return whether lookahead sets are disjoint; no lookahead ⇒ not disjoint */
	public static  disjoint(altLook: IntervalSet[]):  boolean {
		let  collision = false;
		let  combined = new  IntervalSet();
		if ( altLook===null ) {
 return false;
}

		for (let look of altLook) {
			if ( look===null ) {
 return false;
}
 // lookahead must've computation failed
			if ( !look.and(combined).isNil() ) {
				collision = true;
				break;
			}
			combined.addAll(look);
		}
		return !collision;
	}

	public  process():  void {
		// LEFT-RECURSION CHECK
		let  lr = new  LeftRecursionDetector(this.g, this.g.atn);
		lr.check();
		if ( !lr.listOfRecursiveCycles.isEmpty() ) {
 return;
}
 // bail out

		if (this.g.isLexer()) {
			this.processLexer();
		}
		else {
			// BUILD DFA FOR EACH DECISION
			this.processParser();
		}
	}

	protected  processLexer():  void {
		// make sure all non-fragment lexer rules must match at least one symbol
		for (let rule of this.g.rules.values()) {
			if (rule.isFragment()) {
				continue;
			}

			let  analyzer = new  LL1Analyzer(this.g.atn);
			let  look = analyzer.LOOK(this.g.atn.ruleToStartState[rule.index], null);
			if (look.contains(Token.EPSILON)) {
				this.g.tool.errMgr.grammarError(ErrorType.EPSILON_TOKEN, this.g.fileName, (rule.ast.getChild(0) as GrammarAST).getToken(), rule.name);
			}
		}
	}

	protected  processParser():  void {
		this.g.decisionLOOK = new  Array<IntervalSet[]>(this.g.atn.getNumberOfDecisions()+1);
		for (let s of this.g.atn.decisionToState) {
            this.g.tool.log("LL1", "\nDECISION "+s.decision+" in rule "+this.g.getRule(s.ruleIndex).name);
			let  look: IntervalSet[];
			if ( s.nonGreedy ) { // nongreedy decisions can't be LL(1)
				look = new  Array<IntervalSet>(s.getNumberOfTransitions()+1);
			}
			else {
				let  anal = new  LL1Analyzer(this.g.atn);
				look = anal.getDecisionLookahead(s);
				this.g.tool.log("LL1", "look=" + Arrays.toString(look));
			}

			/* assert s.decision + 1 >= g.decisionLOOK.size(); */ 
			Utils.setSize(this.g.decisionLOOK, s.decision+1);
			this.g.decisionLOOK.set(s.decision, look);
			this.g.tool.log("LL1", "LL(1)? " + AnalysisPipeline.disjoint(look));
		}
	}
}
